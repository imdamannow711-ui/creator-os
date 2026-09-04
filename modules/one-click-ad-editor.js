/* DONE RITE Creator OS — One-Click Ad Editor engine v0.2 */
(function(){
'use strict';

const VERSION='0.2';
const DEFAULTS={
  mode:'AUTO_SELL',platform:'TikTok Shop',durationSeconds:15,theme:'DONE_RITE_DARK',
  preserveOriginalVoice:true,preserveOriginalFraming:true,allowVoiceSpeedChange:false,
  addMusic:false,addSfx:true,includeCover:true,includeCaption:true,includeHashtags:true,includeCompliance:true,
  autoHookExperiment:true
};
const HOOK_KEY='done-rite-one-click-hook-tests:v1';
const FALLBACK_HOOKS=[
  {id:'H01',text:'BEFORE YOU SCROLL, WATCH THIS',angle:'curiosity'},
  {id:'H02',text:'THIS PART IS EASY TO MISS',angle:'detail'},
  {id:'H03',text:'LOOK CLOSER AT THIS',angle:'curiosity'},
  {id:'H04',text:'ONE FEATURE WORTH SEEING',angle:'feature'},
  {id:'H05',text:'WATCH HOW THIS PART WORKS',angle:'demo'},
  {id:'H06',text:'HERE’S THE DETAIL THAT STOOD OUT',angle:'detail'},
  {id:'H07',text:'THIS IS WHY THE DEMO MATTERS',angle:'demo'},
  {id:'H08',text:'CHECK THIS DETAIL FIRST',angle:'detail'},
  {id:'H09',text:'DON’T MISS THIS FEATURE',angle:'feature'},
  {id:'H10',text:'THE SMALL DETAIL PEOPLE SKIP',angle:'curiosity'},
  {id:'H11',text:'SEE WHAT THIS PART DOES',angle:'demo'},
  {id:'H12',text:'THIS DESERVES A CLOSER LOOK',angle:'curiosity'}
];
function clean(v){return String(v==null?'':v).trim();}
function clampDuration(v){const n=Number(v);return [7,10,15,20,25,30].includes(n)?n:15;}
function slug(v){return clean(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'product';}
function safeText(v){
  return clean(v)
    .replace(/\$\s?\d+(?:\.\d{1,2})?/gi,'')
    .replace(/\b(discount|sale|cheapest|lowest price|coupon)\b/gi,'')
    .replace(/\b(guaranteed|guarantee|instantly|instant|100%|perfect|flawless)\b/gi,'')
    .replace(/\s{2,}/g,' ').trim();
}
function categoryFlags(category,batteryPowered){
  const c=clean(category).toLowerCase(),flags=[];
  if(/supplement|wellness/.test(c))flags.push('supplement/wellness review');
  if(/skincare|body-applied|oral|dental/.test(c))flags.push('body/claim review');
  if(/kids/.test(c))flags.push('kids-product review');
  if(/tool|weapon/.test(c))flags.push('tools/restricted-category review');
  if(batteryPowered||/electronics|gadget/.test(c))flags.push('electrical/battery-powered review');
  return flags;
}
function loadHookState(){try{return Object.assign({lastHookId:null,assignments:[],results:[]},JSON.parse(localStorage.getItem(HOOK_KEY)||'{}'));}catch(e){return{lastHookId:null,assignments:[],results:[]};}}
function saveHookState(s){try{localStorage.setItem(HOOK_KEY,JSON.stringify(s));}catch(e){}return s;}
function hookUid(){return'hooktest-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);}
function fallbackAssign(input){
  const s=loadHookState();let pool=FALLBACK_HOOKS.filter(x=>x.id!==s.lastHookId);if(!pool.length)pool=FALLBACK_HOOKS.slice();
  const hook=pool[Math.floor(Math.random()*pool.length)];
  const row={id:hookUid(),hookId:hook.id,hookText:hook.text,angle:hook.angle,product:clean(input.product),mode:input.mode||'AUTO_SELL',platform:input.platform||'TikTok Shop',createdAt:new Date().toISOString(),videoFileName:input.videoFileName||'',status:'assigned'};
  s.lastHookId=hook.id;s.assignments.unshift(row);s.assignments=s.assignments.slice(0,500);saveHookState(s);
  return Object.assign({},hook,{assignmentId:row.id});
}
function assignHook(input){
  if(window.DoneRiteHookExperiments&&typeof window.DoneRiteHookExperiments.assign==='function')return window.DoneRiteHookExperiments.assign(input);
  return fallbackAssign(input);
}
function recordHookResult(assignmentId,metrics){
  if(window.DoneRiteHookExperiments&&typeof window.DoneRiteHookExperiments.recordResult==='function')return window.DoneRiteHookExperiments.recordResult(assignmentId,metrics);
  const s=loadHookState(),m=metrics||{},r={id:hookUid(),assignmentId:String(assignmentId||''),views:Number(m.views||0),avgWatchTime:Number(m.avgWatchTime||0),completionRate:Number(m.completionRate||0),likes:Number(m.likes||0),comments:Number(m.comments||0),shares:Number(m.shares||0),saves:Number(m.saves||0),clicks:Number(m.clicks||0),orders:Number(m.orders||0),recordedAt:new Date().toISOString()};
  s.results.unshift(r);s.results=s.results.slice(0,1000);saveHookState(s);return r;
}
function makeTimeline(duration,mode,feature){
  const d=clampDuration(duration),hookEnd=Math.min(2,d*.16),demoEnd=Math.min(d-3,Math.max(hookEnd+3,d*.62)),benefitEnd=Math.min(d-1,Math.max(demoEnd+1,d*.84));
  const hook=mode==='AUTO_HOOK'?'Open on the strongest visible action or result.':'Open with the product already visible and moving.';
  return [
    {start:0,end:+hookEnd.toFixed(1),role:'HOOK',instruction:hook},
    {start:+hookEnd.toFixed(1),end:+demoEnd.toFixed(1),role:'DEMO',instruction:`Show ${feature||'the main feature'} clearly. Remove dead space and repeated setup.`},
    {start:+demoEnd.toFixed(1),end:+benefitEnd.toFixed(1),role:'BENEFIT',instruction:'Hold the clearest practical-use moment long enough to understand.'},
    {start:+benefitEnd.toFixed(1),end:d,role:'CLOSE',instruction:'Finish on a clean product shot and simple product-link CTA.'}
  ];
}
function makeOverlayPlan(input,hookExperiment){
  const feature=safeText(input.verifiedFeature||input.feature||'Main feature');
  const hook=safeText(input.hook||(hookExperiment&&hookExperiment.text)||'WATCH THIS');
  const cta='SEE IT IN THE PRODUCT LINK';
  return [
    {role:'HOOK',text:hook||'WATCH THIS',animation:'pop-hold-fade',safeZone:'upper-middle/central-left',experimentId:hookExperiment&&hookExperiment.assignmentId||null,hookId:hookExperiment&&hookExperiment.id||null},
    {role:'DEMO',text:feature.toUpperCase(),animation:'pop-hold-fade',safeZone:'central-left'},
    {role:'CLOSE',text:cta,animation:'pop-hold-fade',safeZone:'upper-middle/central-left'}
  ];
}
function makePackage(input){
  const product=clean(input.productName)||'Product',feature=safeText(input.verifiedFeature||input.feature||'designed for everyday use'),flags=categoryFlags(input.category,input.batteryPowered);
  const caption=safeText(input.caption||`${product} — ${feature}. Check the product link for details.`),tags=['#ad'];
  (Array.isArray(input.hashtags)?input.hashtags:[]).forEach(t=>{const x=clean(t);if(x&&!tags.includes(x))tags.push(x);});
  const base=`${slug(product)}-${String(input.mode||DEFAULTS.mode).toLowerCase().replace(/_/g,'-')}-${clampDuration(input.durationSeconds)}s`;
  return {caption,hashtags:tags,videoFileName:`${base}.mp4`,coverFileName:`${base}-cover.jpg`,coverTitle:safeText(input.coverTitle||feature).toUpperCase(),compliance:{flags,shipOnly:flags.filter(f=>!/electrical\/battery-powered|kids-product/.test(f))}};
}
function createPlan(input){
  input=input||{};const options=Object.assign({},DEFAULTS,input);options.durationSeconds=clampDuration(options.durationSeconds);
  const product=clean(options.productName)||'Product',feature=safeText(options.verifiedFeature||options.feature||'the main feature'),packaging=makePackage(options);
  let hookExperiment=null;
  if(!clean(options.hook)&&options.autoHookExperiment!==false){hookExperiment=assignHook({product,mode:options.mode,platform:options.platform,videoFileName:packaging.videoFileName});}
  return {
    engine:'DONE RITE One-Click Ad Editor',version:VERSION,status:'PLAN_READY',product,mode:options.mode,durationSeconds:options.durationSeconds,
    hookExperiment:hookExperiment?{assignmentId:hookExperiment.assignmentId,hookId:hookExperiment.id,text:hookExperiment.text,angle:hookExperiment.angle,status:'assigned'}:null,
    mediaPolicy:{preserveOriginalVoice:options.preserveOriginalVoice!==false,preserveOriginalVoiceLevel:true,preserveOriginalVoiceTiming:true,preserveOriginalFraming:options.preserveOriginalFraming!==false,allowVoiceSpeedChange:false,normalizeVoice:false,compressVoice:false,autoEnhanceVoice:false,removeThirdPartyWatermarks:false,note:'Watermark removal requires a clean user-owned source or a crop/replace step that does not alter protected third-party marks.'},
    editPlan:{selectStrongestOpening:true,trimDeadSpace:true,removeRepeatedTakes:true,keepProductVisible:true,structure:makeTimeline(options.durationSeconds,options.mode,feature),overlays:makeOverlayPlan(options,hookExperiment),sfx:options.addSfx!==false?[{event:'overlay-in',sound:'whoosh',mix:'under original voice'}]:[],music:options.addMusic===true?{allowed:true,mix:'under original voice'}:{allowed:false}},
    packaging,
    analytics:{hookAssignmentId:hookExperiment&&hookExperiment.assignmentId||null,hookId:hookExperiment&&hookExperiment.id||null,hookText:hookExperiment&&hookExperiment.text||clean(options.hook)||null,trackAgainst:['views','avgWatchTime','completionRate','likes','comments','shares','saves','clicks','orders']},
    nextRequiredStage:'MEDIA_ANALYSIS',
    limitations:['This module creates the deterministic edit and compliance plan. Frame-level scene analysis and final MP4 rendering require the media-processing stage.','iPhone Safari cannot silently save final files or open another app without a user gesture.']
  };
}
window.DoneRiteOneClickAdEditor={version:VERSION,defaults:Object.assign({},DEFAULTS),createPlan,safeText,categoryFlags,recordHookResult,getHookTestState:loadHookState,hookPool:FALLBACK_HOOKS.slice()};
})();