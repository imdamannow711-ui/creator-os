/* DONE RITE Creator OS — cross-platform packaging engine v1.0 */
(function(){
'use strict';
function clean(v){return String(v||'').trim();}
function pack(input){
  const product=clean(input.product)||'this product';
  const feature=clean(input.feature)||'the main feature';
  const baseHook=clean(input.hook)||`Watch ${feature} before you decide on ${product}.`;
  const shotList=['0–1s — Product already visible and moving/working.','1–5s — Hands demonstrate one feature only.','5–7s — Show the practical result/close-up.','7–10s — Product hero shot + platform CTA.'];
  return {
    'TikTok Shop':{hook:baseHook,shotList,cta:'See the product link.',caption:`${product} — quick hands-only demo.`,hashtags:['#ad','#TikTokShop','#Gadgets','#ProductDemo','#DoneRite']},
    'YouTube Shorts':{hook:baseHook,shotList,cta:'Product picks are linked on my channel profile.',title:`${product} — quick hands-only demo`,description:'Hands-only product demonstration. As an Amazon Associate I earn from qualifying purchases.'},
    'Instagram Reels':{hook:baseHook,shotList,cta:'Check the link on my profile.',caption:`Quick hands-only look at ${product}.`},
    'Facebook Reels':{hook:baseHook,shotList,cta:'Check my profile for the product link.',caption:`A quick real-use look at ${product}.`},
    'Pinterest':{hook:`A quick look at ${feature}.`,shotList,cta:'Save this product idea for later.',title:`${product}: quick product demo`}
  };
}
window.DoneRiteCrossPlatform={version:'1.0',pack};
})();