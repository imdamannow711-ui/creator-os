/* DONE RITE Creator OS — Hands-Only Quick Create engine v1.1 */
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
  const say=[hook,spokenFeature,cta];
  const hands=[
    'Product is already visible and moving on frame one.',
    `Hands demonstrate only ${feature}.`,
    'Show the practical result or a tight close-up.',
    'Finish on a clean product hero shot.'
  ];
  const fullScript=[
    '0–1s',
    `HANDS: ${hands[0]}`,
    `SAY: ${say[0]}`,
    '',
    '1–5s',
    `HANDS: ${hands[1]}`,
    `SAY: ${say[1]}`,
    '',
    '5–7s',
    `HANDS: ${hands[2]}`,
    '',
    '7–10s',
    `HANDS: ${hands[3]}`,
    `SAY: ${say[2]}`
  ].join('\n');
  return {
    mode:'Hands Only',durationSeconds:{min:7,max:10},product,feature,hook,cta,
    fullScript,
    script:fullScript,
    editableSections:{
      hook,
      hands:hands.join('\n'),
      say:say.join('\n'),
      onScreenText:[hook,feature,cta].join('\n'),
      cta,
      caption:`${product} — quick hands-only demo.`,
      hashtags:'#ad #TikTokShop #Gadgets #ProductDemo #DoneRite'
    },
    say,
    shotList:[
      {time:'0–1s',shot:hands[0],say:say[0]},
      {time:'1–5s',shot:hands[1],say:say[1]},
      {time:'5–7s',shot:hands[2],say:''},
      {time:'7–10s',shot:hands[3],say:say[2]}
    ],
    onScreenText:[hook,feature,cta],
    thumbnail:{source:'Real product photo',aiEnhancementAllowed:true,preserveProductAccuracy:true},
    aiVideo:false,
    rules:['SAY contains spoken words only','One video = one selling point','No long intro','No fake product behavior','No unverified price/discount copy']
  };
}
window.DoneRiteHandsOnlyQuickCreate={version:'1.1',create};
})();