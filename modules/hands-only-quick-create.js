/* DONE RITE Creator OS — Hands-Only Quick Create engine v1.2 */
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
  const voiceTone=clean(input.voiceTone)||'Confident, natural and conversational. Quick but clear — never rushed or overhyped.';
  const say=[hook,spokenFeature,cta];
  const hands=[
    'Product is already visible. Bring one hand into frame and start the demo immediately — no still opening shot.',
    `Keep both hands purposeful. Demonstrate only ${feature}; point, press, turn, plug in, open or move only what the real demo requires.`,
    'Pause the hands briefly on the practical result or tight close-up so the viewer can see it clearly.',
    'Settle the product into a clean hero position, keep one hand naturally in frame, then point toward the product-link area.'
  ];
  const fullScript=[
    'DONE RITE — FULL HANDS-ONLY SCRIPT',
    'LENGTH: 7–10 seconds',
    `VOICE TONE: ${voiceTone}`,
    '',
    '0–1s — HOOK',
    `HANDS: ${hands[0]}`,
    `SAY (${voiceTone}): ${say[0]}`,
    '',
    '1–5s — DEMO',
    `HANDS: ${hands[1]}`,
    `SAY (${voiceTone}): ${say[1]}`,
    '',
    '5–7s — RESULT',
    `HANDS: ${hands[2]}`,
    'SAY: No extra line — let the product demonstration breathe.',
    '',
    '7–10s — CTA',
    `HANDS: ${hands[3]}`,
    `SAY (${voiceTone}): ${say[2]}`
  ].join('\n');
  return {
    mode:'Hands Only',durationSeconds:{min:7,max:10},product,feature,hook,cta,voiceTone,
    fullScript,
    script:fullScript,
    editableSections:{
      hook,
      hands:hands.join('\n'),
      voiceTone,
      say:say.join('\n'),
      onScreenText:[hook,feature,cta].join('\n'),
      cta,
      caption:`${product} — quick hands-only demo.`,
      hashtags:'#ad #TikTokShop #Gadgets #ProductDemo #DoneRite'
    },
    say,
    shotList:[
      {time:'0–1s',shot:hands[0],gesture:hands[0],say:say[0],voiceTone},
      {time:'1–5s',shot:hands[1],gesture:hands[1],say:say[1],voiceTone},
      {time:'5–7s',shot:hands[2],gesture:hands[2],say:'',voiceTone},
      {time:'7–10s',shot:hands[3],gesture:hands[3],say:say[2],voiceTone}
    ],
    onScreenText:[hook,feature,cta],
    thumbnail:{source:'Real product photo',aiEnhancementAllowed:true,preserveProductAccuracy:true},
    aiVideo:false,
    rules:['Every full script includes hand gestures and voice tone','SAY contains spoken words only','One video = one selling point','No long intro','No fake product behavior','No unverified price/discount copy']
  };
}
window.DoneRiteHandsOnlyQuickCreate={version:'1.2',create};
})();