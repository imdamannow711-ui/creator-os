/* DONE RITE Creator OS — Hands-Only Quick Create engine v1.3 */
(function(){
'use strict';
function clean(v){return String(v||'').trim();}
function create(input){
  input=input||{};
  const product=clean(input.product)||'this product';
  const feature=clean(input.feature)||'the main feature';
  const hook=clean(input.hook)||`Watch ${feature} before you decide on ${product}.`;
  const cta=clean(input.cta)||'See the product link.';
  const spokenFeature=clean(input.say)||`${product}. ${feature}.`;
  const overallTone=clean(input.voiceTone)||'Natural, conversational and confident — quick but clear, never rushed or overhyped.';
  const tones={
    hook:clean(input.hookTone)||'Curious and attention-grabbing; short, natural, not shouted.',
    demo:clean(input.demoTone)||'Confident and conversational; sound like you are showing a friend.',
    result:clean(input.resultTone)||'No voice needed; let the visual result breathe.',
    cta:clean(input.ctaTone)||'Relaxed and direct; helpful rather than pushy.'
  };
  const say=[hook,spokenFeature,cta];
  const hands=[
    'Product is already visible. Bring one hand into frame and start the demo immediately — no still opening shot.',
    `Keep both hands purposeful. Demonstrate only ${feature}; point, press, turn, plug in, open or move only what the real demo requires.`,
    'Pause the hands briefly on the practical result or tight close-up so the viewer can see it clearly.',
    'Settle the product into a clean hero position, keep one hand naturally in frame, then point toward the product-link area.'
  ];
  const beats=[
    {time:'0–1s',label:'HOOK',hands:hands[0],say:say[0],voiceTone:tones.hook},
    {time:'1–5s',label:'DEMO',hands:hands[1],say:say[1],voiceTone:tones.demo},
    {time:'5–7s',label:'RESULT',hands:hands[2],say:'No extra line — let the product demonstration breathe.',voiceTone:tones.result},
    {time:'7–10s',label:'CTA',hands:hands[3],say:say[2],voiceTone:tones.cta}
  ];
  const fullScript=[
    'DONE RITE — FULL HANDS-ONLY SCRIPT',
    'LENGTH: 7–10 seconds',
    `OVERALL VOICE TONE: ${overallTone}`,
    '',
    ...beats.flatMap(b=>[
      `${b.time} — ${b.label}`,
      `HANDS: ${b.hands}`,
      `SAY: ${b.say}`,
      `VOICE TONE: ${b.voiceTone}`,
      ''
    ])
  ].join('\n').trim();
  return {
    mode:'Hands Only',durationSeconds:{min:7,max:10},product,feature,hook,cta,voiceTone:overallTone,voiceTones:tones,
    fullScript,
    script:fullScript,
    editableSections:{
      hook,
      hands:hands.join('\n'),
      voiceTone:[`Overall: ${overallTone}`,`Hook: ${tones.hook}`,`Demo: ${tones.demo}`,`Result: ${tones.result}`,`CTA: ${tones.cta}`].join('\n'),
      say:say.join('\n'),
      onScreenText:[hook,feature,cta].join('\n'),
      cta,
      caption:`${product} — quick hands-only demo.`,
      hashtags:'#ad #TikTokShop #Gadgets #ProductDemo #DoneRite'
    },
    say,
    shotList:beats.map(b=>({time:b.time,shot:b.hands,gesture:b.hands,say:b.label==='RESULT'?'':b.say,voiceTone:b.voiceTone,label:b.label})),
    onScreenText:[hook,feature,cta],
    thumbnail:{source:'Real product photo',aiEnhancementAllowed:true,preserveProductAccuracy:true},
    aiVideo:false,
    rules:['Every full script includes hand gestures and voice tone for each beat','SAY contains spoken words only','One video = one selling point','No long intro','No fake product behavior','No unverified price/discount copy']
  };
}
window.DoneRiteHandsOnlyQuickCreate={version:'1.3',create};
})();