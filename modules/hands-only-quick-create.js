/* DONE RITE Creator OS — Hands-Only Quick Create engine v1.0 */
(function(){
'use strict';
function clean(v){return String(v||'').trim();}
function create(input){
  const product=clean(input.product)||'this product';
  const feature=clean(input.feature)||'the main feature';
  const hook=clean(input.hook)||`Watch ${feature} before you decide on ${product}.`;
  return {
    mode:'Hands Only',durationSeconds:{min:7,max:10},product,feature,hook,
    script:[hook,`Here’s ${feature} in real use.`,'See the product link.'].join('\n'),
    shotList:[
      {time:'0–1s',shot:'Product already visible; hand starts the demo immediately.'},
      {time:'1–5s',shot:`Hands show only ${feature}.`},
      {time:'5–7s',shot:'Show the practical result or close-up.'},
      {time:'7–10s',shot:'Clean hero shot with simple CTA.'}
    ],
    onScreenText:[hook,feature,'See product link'],
    thumbnail:{source:'Real product photo',aiEnhancementAllowed:true,preserveProductAccuracy:true},
    aiVideo:false,
    rules:['One video = one selling point','No long intro','No fake product behavior','No unverified price/discount copy']
  };
}
window.DoneRiteHandsOnlyQuickCreate={version:'1.0',create};
})();