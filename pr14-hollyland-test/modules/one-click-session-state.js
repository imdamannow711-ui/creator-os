/* DONE RITE Creator OS — One-Click Session State v0.1
   Remembers One-Click setup and last working position on this device.
   Browser security prevents silently restoring local file-picker contents.
*/
(function(){
'use strict';
const VERSION='0.1';
const KEY='done-rite-one-click-session:v1';
let saveTimer=null;
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){return{};}}
function write(patch){const next=Object.assign({},read(),patch,{updatedAt:new Date().toISOString(),version:VERSION});try{localStorage.setItem(KEY,JSON.stringify(next));}catch(e){}return next;}
function val(id){const el=document.getElementById(id);return el?String(el.value||''):'';}
function selectedFileName(id){const el=document.getElementById(id),f=el&&el.files&&el.files[0];return f?f.name:'';}
function snapshot(extra){return write(Object.assign({
  product:val('product'),feature:val('feature'),mode:val('mode'),duration:val('duration'),
  gapPreset:val('drGapPreset')||undefined,
  lastVoiceoverFile:selectedFileName('drGapFile')||read().lastVoiceoverFile||'',
  scrollY:Math.max(0,Math.round(window.scrollY||0)),
  activeElementId:document.activeElement&&document.activeElement.id||''
},extra||{}));}
function restoreFields(state){
  [['product','product'],['feature','feature'],['mode','mode'],['duration','duration'],['drGapPreset','gapPreset']].forEach(([id,key])=>{const el=document.getElementById(id);if(el&&state[key]!=null&&String(state[key])!=='')el.value=state[key];});
}
function createResumeCard(state){
  if(document.getElementById('doneRiteResumeCard'))return;
  const wrap=document.querySelector('.wrap')||document.body,card=document.createElement('div');card.id='doneRiteResumeCard';card.className='card';card.style.cssText='border-color:#2bd97c;background:linear-gradient(145deg,#0d1a15,#0b1522)';
  const when=state.updatedAt?new Date(state.updatedAt).toLocaleString():'';
  card.innerHTML='<div style="font-weight:950;color:#56ec9c">💾 LAST SESSION SAVED</div><div id="drResumeSummary" class="help" style="margin-top:7px"></div><button id="drResumeBtn" class="button good">RESUME LAST SESSION</button><button id="drClearSession" class="button secondary">START FRESH</button>';
  const first=wrap.firstElementChild;first?wrap.insertBefore(card,first):wrap.appendChild(card);
  const bits=[];if(state.product)bits.push(state.product);if(state.gapPreset)bits.push('Gap remover: '+(state.gapPreset==='tight'?'Tight':'Natural'));if(state.lastVoiceoverFile)bits.push('Audio: '+state.lastVoiceoverFile);if(when)bits.push('Saved '+when);
  card.querySelector('#drResumeSummary').textContent=bits.length?bits.join(' • '):'Creator OS saved your previous One-Click settings.';
  card.querySelector('#drResumeBtn').addEventListener('click',()=>{restoreFields(state);setTimeout(()=>window.scrollTo({top:Number(state.scrollY||0),behavior:'smooth'}),80);card.style.display='none';});
  card.querySelector('#drClearSession').addEventListener('click',()=>{try{localStorage.removeItem(KEY);}catch(e){}['product','feature'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});const mode=document.getElementById('mode');if(mode)mode.value='AUTO_SELL';const duration=document.getElementById('duration');if(duration)duration.value='15';const gap=document.getElementById('drGapPreset');if(gap)gap.value='natural';card.style.display='none';window.scrollTo({top:0,behavior:'smooth'});});
}
function bind(){
  const state=read();restoreFields(state);if(state.updatedAt)createResumeCard(state);
  document.addEventListener('input',e=>{const id=e.target&&e.target.id;if(['product','feature','mode','duration','drGapPreset','drGapFile'].includes(id)){clearTimeout(saveTimer);saveTimer=setTimeout(()=>snapshot(),180);}},true);
  document.addEventListener('change',e=>{const id=e.target&&e.target.id;if(['product','feature','mode','duration','drGapPreset','drGapFile'].includes(id))snapshot();},true);
  let scrollTimer=null;window.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>snapshot(),400);},{passive:true});
  window.addEventListener('done-rite-one-click-plan',e=>{const p=e&&e.detail||{};snapshot({lastHook:p.hookExperiment||null,lastCta:p.ctaExperiment||null,lastPlanVersion:p.version||null});});
  window.addEventListener('pagehide',()=>snapshot());
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else setTimeout(bind,0);
window.DoneRiteOneClickSessionState={version:VERSION,key:KEY,read,snapshot,restore:()=>restoreFields(read())};
})();