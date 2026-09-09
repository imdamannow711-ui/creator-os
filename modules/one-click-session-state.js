/* DONE RITE Creator OS — One-Click Session State v0.2
   Remembers One-Click setup and restores project media through the isolated
   One-Click IndexedDB project store.
*/
(function(){
'use strict';
const VERSION='0.2';
const KEY='done-rite-one-click-session:v1';
let saveTimer=null;
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){return{};}}
function write(patch){const next=Object.assign({},read(),patch,{updatedAt:new Date().toISOString(),version:VERSION});try{localStorage.setItem(KEY,JSON.stringify(next));}catch(e){}return next;}
function val(id){const el=document.getElementById(id);return el?String(el.value||''):'';}
function selectedFileName(id){const el=document.getElementById(id),f=el&&el.files&&el.files[0];return f?f.name:'';}
function snapshot(extra){return write(Object.assign({
  product:val('product'),productListing:val('productListing'),feature:val('feature'),mode:val('mode'),duration:val('duration'),
  gapPreset:val('drGapPreset')||undefined,
  lastVoiceoverFile:selectedFileName('drGapFile')||read().lastVoiceoverFile||'',
  scrollY:Math.max(0,Math.round(window.scrollY||0)),
  activeElementId:document.activeElement&&document.activeElement.id||''
},extra||{}));}
function persistProject(state){const store=window.DoneRiteOneClickProjectStore;if(!store)return;store.updateProject({productName:state.product||'',productListing:state.productListing||'',feature:state.feature||'',mode:state.mode||'AUTO_SELL',duration:state.duration||'15',gapPreset:state.gapPreset||'natural'}).catch(()=>{});}
function restoreFields(state){
  [['product','product'],['productListing','productListing'],['feature','feature'],['mode','mode'],['duration','duration'],['drGapPreset','gapPreset']].forEach(([id,key])=>{const el=document.getElementById(id);if(el&&state[key]!=null&&String(state[key])!=='')el.value=state[key];});
}
function createResumeCard(state,project,clipCount){
  if(document.getElementById('doneRiteResumeCard'))return;
  const wrap=document.querySelector('.wrap')||document.body,card=document.createElement('div');card.id='doneRiteResumeCard';card.className='card';card.style.cssText='border-color:#2bd97c;background:linear-gradient(145deg,#0d1a15,#0b1522)';
  const savedAt=state.updatedAt||(project&&project.updatedAt)||'',when=savedAt?new Date(savedAt).toLocaleString():'';
  card.innerHTML='<div style="font-weight:950;color:#56ec9c">💾 LAST SESSION SAVED</div><div id="drResumeSummary" class="help" style="margin-top:7px"></div><button id="drResumeBtn" class="button good">RESUME LAST SESSION</button><button id="drClearSession" class="button secondary">START FRESH</button>';
  const resumeSlot=document.getElementById('doneRiteResumeSlot');
  if(resumeSlot){resumeSlot.appendChild(card);}else{const first=wrap.firstElementChild;first?wrap.insertBefore(card,first):wrap.appendChild(card);}
  const bits=[];if(state.product)bits.push(state.product);if(clipCount)bits.push(clipCount+' saved clip'+(clipCount===1?'':'s'));if(state.gapPreset)bits.push('Gap remover: '+(state.gapPreset==='tight'?'Tight':'Natural'));if(project&&project.lastVoiceoverFile)bits.push('Audio: '+project.lastVoiceoverFile);else if(state.lastVoiceoverFile)bits.push('Audio: '+state.lastVoiceoverFile);if(when)bits.push('Saved '+when);
  card.querySelector('#drResumeSummary').textContent=bits.length?bits.join(' • '):'Creator OS saved your previous One-Click settings.';
  card.querySelector('#drResumeBtn').addEventListener('click',()=>{restoreFields(state);setTimeout(()=>window.scrollTo({top:Number(state.scrollY||0),behavior:'smooth'}),80);card.style.display='none';});
  card.querySelector('#drClearSession').addEventListener('click',async()=>{try{localStorage.removeItem(KEY);}catch(e){}const store=window.DoneRiteOneClickProjectStore;if(store)try{await store.startFresh();}catch(e){}['product','productListing','feature'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});const mode=document.getElementById('mode');if(mode)mode.value='AUTO_SELL';const duration=document.getElementById('duration');if(duration)duration.value='15';const gap=document.getElementById('drGapPreset');if(gap)gap.value='natural';card.style.display='none';window.scrollTo({top:0,behavior:'smooth'});});
}
async function bind(){
  const state=read(),store=window.DoneRiteOneClickProjectStore;let project=null,clipCount=0;
  if(store)try{await store.ready();project=store.getProject();clipCount=store.getFiles().length;}catch(e){}
  const merged=Object.assign({},state,project?{product:project.productName||state.product,productListing:project.productListing||state.productListing,feature:project.feature||state.feature,mode:project.mode||state.mode,duration:project.duration||state.duration,gapPreset:project.gapPreset||state.gapPreset}:{});restoreFields(merged);
  if((merged.updatedAt||(project&&project.updatedAt))&&(project?project.mediaSaved!==false:true))createResumeCard(merged,project,clipCount);
  document.addEventListener('input',e=>{const id=e.target&&e.target.id;if(['product','productListing','feature','mode','duration','drGapPreset','drGapFile'].includes(id)){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{const next=snapshot();persistProject(next);},180);}},true);
  document.addEventListener('change',e=>{const id=e.target&&e.target.id;if(['product','productListing','feature','mode','duration','drGapPreset','drGapFile'].includes(id)){const next=snapshot();persistProject(next);}},true);
  let scrollTimer=null;window.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>snapshot(),400);},{passive:true});
  window.addEventListener('done-rite-one-click-plan',e=>{const p=e&&e.detail||{};snapshot({lastHook:p.hookExperiment||null,lastCta:p.ctaExperiment||null,lastPlanVersion:p.version||null});});
  window.addEventListener('pagehide',()=>snapshot());
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else setTimeout(bind,0);
window.DoneRiteOneClickSessionState={version:VERSION,key:KEY,read,snapshot,restore:()=>restoreFields(read())};
})();
