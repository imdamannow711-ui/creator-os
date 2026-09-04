/* DONE RITE Creator OS — One-Click Ad Editor engine v0.1 */
(function(){
'use strict';

const VERSION='0.1';
const DEFAULTS={
  mode:'AUTO_SELL',
  platform:'TikTok Shop',
  durationSeconds:15,
  theme:'DONE_RITE_DARK',
  preserveOriginalVoice:true,
  preserveOriginalFraming:true,
  allowVoiceSpeedChange:false,
  addMusic:false,
  addSfx:true,
  includeCover:true,
  includeCaption:true,
  includeHashtags:true,
  includeCompliance:true
};

function clean(v){return String(v==null?'':v).trim();}
function clampDuration(v){const n=Number(v);return [7,10,15,20,25,30].includes(n)?n:15;}
function slug(v){return clean(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'product';}
function safeText(v){
  return clean(v)
    .replace(/\$\s?\d+(?:\.\d{1,2})?/gi,'')
    .replace(/\b(discount|sale|cheapest|lowest price|coupon)\b/gi,'')
    .replace(/\b(guaranteed|guarantee|instantly|instant|100%|perfect|flawless)\b/gi,'')
    .replace(/\s{2,}/g,' ')
    .trim();
}
function categoryFlags(category,batteryPowered){
  const c=clean(category).toLowerCase();
  const flags=[];
  if(/supplement|wellness/.test(c)) flags.push('supplement/wellness review');
  if(/skincare|body-applied|oral|dental/.test(c)) flags.push('body/claim review');
  if(/kids/.test(c)) flags.push('kids-product review');
  if(/tool|weapon/.test(c)) flags.push('tools/restricted-category review');
  if(batteryPowered || /electronics|gadget/.test(c)) flags.push('electrical/battery-powered review');
  return flags;
}
function makeTimeline(duration,mode,feature){
  const d=clampDuration(duration);
  const hookEnd=Math.min(2,d*.16);
  const demoEnd=Math.min(d-3,Math.max(hookEnd+3,d*.62));
  const benefitEnd=Math.min(d-1,Math.max(demoEnd+1,d*.84));
  const hook=mode==='AUTO_HOOK'?'Open on the strongest visible action or result.':'Open with the product already visible and moving.';
  return [
    {start:0,end:+hookEnd.toFixed(1),role:'HOOK',instruction:hook},
    {start:+hookEnd.toFixed(1),end:+demoEnd.toFixed(1),role:'DEMO',instruction:`Show ${feature||'the main feature'} clearly. Remove dead space and repeated setup.`},
    {start:+demoEnd.toFixed(1),end:+benefitEnd.toFixed(1),role:'BENEFIT',instruction:'Hold the clearest practical-use moment long enough to understand.'},
    {start:+benefitEnd.toFixed(1),end:d,role:'CLOSE',instruction:'Finish on a clean product shot and simple product-link CTA.'}
  ];
}
function makeOverlayPlan(input){
  const feature=safeText(input.verifiedFeature||input.feature||'Main feature');
  const hook=safeText(input.hook||'WATCH THIS');
  const cta='SEE IT IN THE PRODUCT LINK';
  return [
    {role:'HOOK',text:hook||'WATCH THIS',animation:'pop-hold-fade',safeZone:'upper-middle/central-left'},
    {role:'DEMO',text:feature.toUpperCase(),animation:'pop-hold-fade',safeZone:'central-left'},
    {role:'CLOSE',text:cta,animation:'pop-hold-fade',safeZone:'upper-middle/central-left'}
  ];
}
function makePackage(input){
  const product=clean(input.productName)||'Product';
  const feature=safeText(input.verifiedFeature||input.feature||'designed for everyday use');
  const flags=categoryFlags(input.category,input.batteryPowered);
  const caption=safeText(input.caption||`${product} — ${feature}. Check the product link for details.`);
  const tags=['#ad'];
  (Array.isArray(input.hashtags)?input.hashtags:[]).forEach(t=>{const x=clean(t);if(x&&!tags.includes(x))tags.push(x);});
  const base=`${slug(product)}-${String(input.mode||DEFAULTS.mode).toLowerCase().replace(/_/g,'-')}-${clampDuration(input.durationSeconds)}s`;
  return {
    caption,
    hashtags:tags,
    videoFileName:`${base}.mp4`,
    coverFileName:`${base}-cover.jpg`,
    coverTitle:safeText(input.coverTitle||feature).toUpperCase(),
    compliance:{flags,shipOnly:flags.filter(f=>!/electrical\/battery-powered|kids-product/.test(f))}
  };
}
function createPlan(input){
  input=input||{};
  const options=Object.assign({},DEFAULTS,input);
  options.durationSeconds=clampDuration(options.durationSeconds);
  const product=clean(options.productName)||'Product';
  const feature=safeText(options.verifiedFeature||options.feature||'the main feature');
  return {
    engine:'DONE RITE One-Click Ad Editor',
    version:VERSION,
    status:'PLAN_READY',
    product,
    mode:options.mode,
    durationSeconds:options.durationSeconds,
    mediaPolicy:{
      preserveOriginalVoice:options.preserveOriginalVoice!==false,
      preserveOriginalVoiceLevel:true,
      preserveOriginalVoiceTiming:true,
      preserveOriginalFraming:options.preserveOriginalFraming!==false,
      allowVoiceSpeedChange:false,
      normalizeVoice:false,
      compressVoice:false,
      autoEnhanceVoice:false,
      removeThirdPartyWatermarks:false,
      note:'Watermark removal requires a clean user-owned source or a crop/replace step that does not alter protected third-party marks.'
    },
    editPlan:{
      selectStrongestOpening:true,
      trimDeadSpace:true,
      removeRepeatedTakes:true,
      keepProductVisible:true,
      structure:makeTimeline(options.durationSeconds,options.mode,feature),
      overlays:makeOverlayPlan(options),
      sfx:options.addSfx!==false?[{event:'overlay-in',sound:'whoosh',mix:'under original voice'}]:[],
      music:options.addMusic===true?{allowed:true,mix:'under original voice'}:{allowed:false}
    },
    packaging:makePackage(options),
    nextRequiredStage:'MEDIA_ANALYSIS',
    limitations:[
      'This module creates the deterministic edit and compliance plan. Frame-level scene analysis and final MP4 rendering require the media-processing stage.',
      'iPhone Safari cannot silently save final files or open another app without a user gesture.'
    ]
  };
}

window.DoneRiteOneClickAdEditor={version:VERSION,defaults:Object.assign({},DEFAULTS),createPlan,safeText,categoryFlags};
})();
