/* DONE RITE Creator OS — Voice Suggestion Helper v1.0
   Client-side only. This module NEVER calls any AI voice/audio API — GitHub Pages
   is static and has no server-side credentials to do that safely. What it does:
   1. Right after clips are chosen, suggest a narration tone + example voice name
      for each clip (filename-based heuristic — no visual/audio content analysis).
   2. Once a script/voiceover line exists for the project, read the text and
      suggest one narration tone + voice for the whole project.
   The suggested voice name refers to a Gemini 2.5 Pro TTS preset. To actually
   generate AI narration audio in that voice, take the suggested voice name into
   a Perplexity chat and ask it to generate the voiceover — this module only
   recommends, it does not synthesize audio.
*/
(function(){
'use strict';
const VERSION='1.0';

/* Voice catalog grouped by delivery tone. Source: Gemini 2.5 Pro TTS preset voices. */
const VOICES={
  upbeat:[
    {id:'puck',gender:'male',desc:'upbeat and lively'},
    {id:'fenrir',gender:'male',desc:'passionate and energetic'},
    {id:'sulafat',gender:'female',desc:'warm and approachable, high energy'},
    {id:'leda',gender:'female',desc:'youthful and energetic'},
    {id:'laomedeia',gender:'female',desc:'positive and upbeat'},
    {id:'autonoe',gender:'female',desc:'bright and cheerful'},
    {id:'sadachbia',gender:'male',desc:'lively and vivid'}
  ],
  confident:[
    {id:'kore',gender:'female',desc:'strong and firm'},
    {id:'alnilam',gender:'male',desc:'confident and firm'},
    {id:'pulcherrima',gender:'female',desc:'forward and enterprising'},
    {id:'orus',gender:'male',desc:'calm and firm'}
  ],
  warm:[
    {id:'callirrhoe',gender:'female',desc:'friendly and easy-going'},
    {id:'achird',gender:'male',desc:'friendly and kind'},
    {id:'aoede',gender:'female',desc:'relaxed and natural'},
    {id:'despina',gender:'female',desc:'smooth and gentle'},
    {id:'umbriel',gender:'male',desc:'relaxed and easy-going'},
    {id:'achernar',gender:'female',desc:'soft and warm, bright and youthful'},
    {id:'zubenelgenubi',gender:'male',desc:'casual and relaxed'},
    {id:'vindemiatrix',gender:'female',desc:'gentle and delicate'}
  ],
  calm:[
    {id:'charon',gender:'male',desc:'calm and professional, deep steady tone'},
    {id:'rasalgethi',gender:'male',desc:'professional narrator style'},
    {id:'erinome',gender:'female',desc:'clear and articulate'},
    {id:'gacrux',gender:'female',desc:'mature and steady'},
    {id:'iapetus',gender:'male',desc:'clear and clean'},
    {id:'schedar',gender:'male',desc:'even and steady'},
    {id:'algieba',gender:'male',desc:'smooth and flowing'},
    {id:'sadaltager',gender:'male',desc:'knowledgeable and learned'},
    {id:'enceladus',gender:'male',desc:'soft and breathy'},
    {id:'algenib',gender:'male',desc:'gravelly and textured'},
    {id:'zephyr',gender:'female',desc:'bright and clear'}
  ]
};
const TONE_LABEL={upbeat:'Upbeat & energetic',confident:'Confident & firm',warm:'Warm & approachable',calm:'Calm & professional'};
const TONE_ORDER=['upbeat','confident','warm','calm'];

function normalize(text){
  return ' '+String(text||'').toLowerCase().replace(/['\u2019]/g,'').replace(/[^a-z0-9]+/g,' ').trim()+' ';
}
function countMatches(text,phrases){
  let n=0;
  (phrases||[]).forEach(function(phrase){
    const needle=' '+normalizeNeedle(phrase)+' ';
    if(needle.trim()==='')return;
    let from=0,idx;
    while((idx=text.indexOf(needle,from))!==-1){n++;from=idx+needle.length-1;}
  });
  return n;
}
function normalizeNeedle(phrase){
  return String(phrase||'').toLowerCase().replace(/['\u2019]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
}

const SCRIPT_SIGNALS={
  upbeat:['insane','obsessed','wow','omg','crazy','cant believe','excited','hype','no way','screamed','so good','love this'],
  confident:['link','cart','shop now','buy now','dont miss','last chance','grab yours','tap the link','today only','limited','guaranteed','you need this','trust me'],
  warm:['honestly','actually','i tried','my take','reminds me','i noticed','i love','personally','real talk','you know','not expecting','my honest'],
  calm:['heres how','step','works by','means that','let me explain','the reason','how to','tutorial','in this video','walkthrough','breaks down']
};
const CLIP_NAME_SIGNALS={
  upbeat:['unbox','reveal','surprise','omg','wow','viral','insane','shock'],
  confident:['deal','sale','buy','shop','cart','discount','offer','link'],
  calm:['review','honest','compare','vs','pros','cons','tested','howto','tutorial','explain'],
  warm:[]
};

function scoreText(text,signalMap){
  const t=normalize(text),scores={};
  let bangBonus=0;const bangs=(String(text||'').match(/!/g)||[]).length;if(bangs>=2)bangBonus=2;else if(bangs===1)bangBonus=1;
  TONE_ORDER.forEach(function(tone){scores[tone]=countMatches(t,signalMap[tone]||[]);});
  scores.upbeat+=bangBonus;
  return scores;
}
function topTone(scores,fallback){
  let best=fallback||'warm',bestScore=0;
  TONE_ORDER.forEach(function(tone){const s=scores[tone]||0;if(s>bestScore){bestScore=s;best=tone;}});
  return bestScore>0?best:(fallback||'warm');
}
function pickVoices(tone){
  const pool=VOICES[tone]||VOICES.warm;
  return {primary:pool[0],alternate:pool[1]||pool[0]};
}
function buildResult(tone,scores,reasonPrefix){
  const picks=pickVoices(tone);
  return {
    version:VERSION,
    toneGroup:tone,
    toneLabel:TONE_LABEL[tone],
    voice:picks.primary.id,
    voiceGender:picks.primary.gender,
    voiceDescription:picks.primary.desc,
    alternateVoice:picks.alternate.id,
    alternateVoiceGender:picks.alternate.gender,
    alternateVoiceDescription:picks.alternate.desc,
    scoreBreakdown:scores,
    reason:reasonPrefix+' suggests a '+TONE_LABEL[tone].toLowerCase()+' delivery \u2014 try "'+picks.primary.id+'" ('+picks.primary.desc+').',
    howToGenerate:'Ask Perplexity to generate narration audio using the "'+picks.primary.id+'" voice for this text \u2014 this app only recommends the voice, it does not synthesize audio.'
  };
}

/* Suggest a narration voice for one freshly-added clip. info: {name, type, durationSeconds} */
function suggestForClip(info){
  info=info||{};
  const name=String(info.name||'');
  const scores=scoreText(name,CLIP_NAME_SIGNALS);
  const shortClip=Number(info.durationSeconds||0)>0&&Number(info.durationSeconds)<=8;
  if(shortClip)scores.upbeat=(scores.upbeat||0)+1;
  const tone=topTone(scores,'warm');
  return buildResult(tone,scores,'This clip\u2019s file name'+(shortClip?' and short length':''));
}

/* Suggest a narration voice for a full script/project voiceover string. */
function suggestForScript(scriptText){
  const scores=scoreText(scriptText,SCRIPT_SIGNALS);
  const tone=topTone(scores,'warm');
  return buildResult(tone,scores,'This script\u2019s wording');
}

function allVoices(){
  const out=[];
  TONE_ORDER.forEach(function(tone){(VOICES[tone]||[]).forEach(function(v){out.push(Object.assign({toneGroup:tone,toneLabel:TONE_LABEL[tone]},v));});});
  return out;
}

window.DoneRiteVoiceSuggestion={version:VERSION,toneGroups:TONE_ORDER.slice(),toneLabels:Object.assign({},TONE_LABEL),voices:VOICES,allVoices:allVoices,suggestForClip:suggestForClip,suggestForScript:suggestForScript};
})();
