/* DONE RITE Creator OS — Ready Project Loader v0.1
   Loads approved, same-origin project assets into One-Click without changing
   the existing Plex editor, Teleprompter, trim, or voiceover engines.
*/
(function(){
'use strict';
const VERSION='0.1';
const PROJECTS={
  'hollyland-lark-a1-combo':{
    title:'Hollyland LARK A1 Combo Kit',
    product:'Hollyland LARK A1 Combo Kit',
    feature:'Two microphones and two receiver options in one case',
    mode:'AUTO_SELL',duration:'7',
    videoParts:Array.from({length:10},(_,index)=>'assets/ready-projects/hollyland-lark-a1-combo-video.part'+String(index).padStart(2,'0')),
    videoName:'20260912_DONE_RITE_HOLLYLAND_LARK_A1_COMBO_KIT_AUTO_SELL_7S_V2.mp4',
    cover:'assets/ready-projects/20260912_DONE_RITE_HOLLYLAND_LARK_A1_COMBO_KIT_COVER_V2.webp',
    coverName:'20260912_DONE_RITE_HOLLYLAND_LARK_A1_COMBO_KIT_COVER_V2.webp',
    voiceover:'This combo kit keeps two mics and two receivers together—tap the cart to see the details.',
    direction:'Read in a confident, natural voice. Pause briefly after “together.” Keep your normal tone, pitch, timing, and speed.',
    onScreen:'HOOK: CREATOR AUDIO SOUNDING FLAT?\nDEMO: TWO MICS • TWO RECEIVERS • ONE CASE\nCTA: TAP THE CART — SEE THE DETAILS',
    sfx:'Keep the existing whoosh/click/pop effects on their own layer. Do not lower or cover the voice.',
    caption:'Two mics and two receiver options packed into one case. Take a closer look at the Hollyland LARK A1 Combo Kit.',
    hashtags:'#ad #HollylandLARKA1 #WirelessMicrophone #CreatorGear #ContentCreator',
    compliance:'Electrical/battery-powered product: show normal use only. No price, discount, charging-speed, range, battery-life, or absolute performance claims.'
  }
};
const SCRIPT_KEY='done-rite-one-click-selected-voiceover:v1';
let current=null;
function id(value){return document.getElementById(value);}
function requested(){try{return new URLSearchParams(location.search).get('project')||'';}catch(e){return'';}}
function setField(name,value){const el=id(name);if(!el)return;el.value=value;el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));}
function teleprompterUrl(project){
  const url=new URL('teleprompter-one-click.html',location.href),returnUrl=location.href;
  url.searchParams.set('session','1');url.searchParams.set('return',returnUrl);url.searchParams.set('back',returnUrl);
  url.searchParams.set('product',project.product);url.searchParams.set('seconds',project.duration);url.searchParams.set('type','full');url.searchParams.set('tone','confident');
  url.searchParams.set('script',project.voiceover);url.searchParams.set('direction',project.direction);url.searchParams.set('angle','Product reveal');
  url.searchParams.set('format','Vertical 9:16 · TikTok Shop · hands/product focused');url.searchParams.set('shots','Use the supplied edited clip: closed case hook, opening reveal, steady open-case close.');
  url.searchParams.set('onscreen',project.onScreen);url.searchParams.set('sfx',project.sfx);url.searchParams.set('caption',project.caption);url.searchParams.set('hashtags',project.hashtags);url.searchParams.set('cover','HOLLYLAND LARK A1 — COMBO KIT');url.searchParams.set('compliance',project.compliance);
  return url.toString();
}
function publishScript(project){
  const payload={script:project.voiceover,product:project.product,hook:'Two mics, two receivers, one case.',sourceName:project.videoName,start:0,end:6.8,updatedAt:new Date().toISOString()};
  try{localStorage.setItem(SCRIPT_KEY,JSON.stringify(payload));}catch(e){}
  try{window.dispatchEvent(new CustomEvent('done-rite-selected-voiceover',{detail:payload}));}catch(e){}
  if(window.DoneRiteOneClickGapRemover&&typeof window.DoneRiteOneClickGapRemover.setSelectedScript==='function')window.DoneRiteOneClickGapRemover.setSelectedScript(payload);
}
async function loadProject(project,status,button){
  button.disabled=true;button.textContent='LOADING READY PROJECT…';status.className='help';status.textContent='Loading the edited clip, script, caption, hashtags, and cover.';
  try{
    setField('product',project.product);setField('feature',project.feature);setField('mode',project.mode);setField('duration',project.duration);
    const check=id('check');if(check)check.click();
    const responses=await Promise.all(project.videoParts.map(part=>fetch(part,{cache:'no-store'})));if(responses.some(response=>!response.ok))throw new Error('Edited clip could not be downloaded.');
    const buffers=await Promise.all(responses.map(response=>response.arrayBuffer())),blob=new Blob(buffers,{type:'video/mp4'}),file=new File([blob],project.videoName,{type:'video/mp4',lastModified:Date.now()});
    const api=window.DoneRiteOneClickCameraHandoff,result=typeof window.DoneRiteOneClickAppendFile==='function'?window.DoneRiteOneClickAppendFile(file):(api&&typeof api.appendCapturedFile==='function'?api.appendCapturedFile(file):{ok:false,reason:'Clip handoff is not ready.'});
    if(!result.ok)throw new Error(result.reason||'Safari did not add the edited clip.');
    current=project;publishScript(project);status.className='help ok';status.textContent='READY — edited clip and complete ad package are loaded. Open the Teleprompter and read the connected script.';
    button.textContent='READY PROJECT LOADED';id('drReadyTeleprompter').href=teleprompterUrl(project);id('drReadyTeleprompter').style.display='block';id('drReadyCover').style.display='block';id('drReadyDetails').open=true;
  }catch(err){status.className='help bad';status.textContent='Could not load the ready project: '+err.message;button.disabled=false;button.textContent='TRY LOADING READY PROJECT AGAIN';}
}
function install(project){
  if(id('drReadyProject')||!project)return;
  const card=document.createElement('section');card.id='drReadyProject';card.className='card';card.style.cssText='border-color:#2bd97c;background:linear-gradient(145deg,#0d1a15,#0b1522)';
  card.innerHTML='<div class="pill" style="color:#56ec9c;border-color:#2bd97c">READY PROJECT</div><h2>'+project.title+'</h2><img id="drReadyCover" src="'+project.cover+'" alt="Hollyland LARK A1 Combo Kit cover" style="display:none;width:100%;max-height:440px;object-fit:cover;object-position:center;border-radius:14px;margin:10px 0"><button id="drLoadReadyProject" class="button good" type="button">LOAD EDITED VIDEO + COMPLETE AD PACKAGE</button><div id="drReadyStatus" class="help" style="margin-top:9px">One tap loads the edited clip, exact script, caption, hashtags, cover, and compliance note.</div><a id="drReadyTeleprompter" class="button good" style="display:none;text-align:center;text-decoration:none">OPEN SCRIPT IN TELEPROMPTER →</a><details id="drReadyDetails"><summary>Voiceover, caption, hashtags, and file names</summary><div class="copybox"><b>VOICEOVER</b><div style="margin-top:6px">'+project.voiceover+'</div></div><div class="copybox"><b>CAPTION</b><div style="margin-top:6px">'+project.caption+'</div></div><div class="copybox"><b>HASHTAGS</b><div style="margin-top:6px">'+project.hashtags+'</div></div><div class="copybox"><b>VIDEO FILE</b><div style="margin-top:6px">'+project.videoName+'</div></div><div class="copybox"><b>COVER FILE</b><div style="margin-top:6px">'+project.coverName+'</div></div><div class="copybox"><b>COMPLIANCE</b><div style="margin-top:6px">'+project.compliance+'</div></div><a class="button secondary" style="display:block;text-align:center;text-decoration:none" href="'+project.cover+'" download="'+project.coverName+'">DOWNLOAD COVER IMAGE</a></details>';
  const wrap=document.querySelector('.wrap')||document.body,target=id('systemCard');target?wrap.insertBefore(card,target):wrap.appendChild(card);
  card.querySelector('#drLoadReadyProject').addEventListener('click',event=>loadProject(project,card.querySelector('#drReadyStatus'),event.currentTarget));
}
function enhancePlan(event){
  if(!current||!event||!event.detail)return;const plan=event.detail,guide=plan.recordingGuide||{},pack=plan.packaging||{};
  guide.voiceover=current.voiceover;guide.direction=current.direction;guide.onScreenText=current.onScreen;guide.sfx=current.sfx;guide.caption=current.caption;guide.hashtags=current.hashtags;guide.cover='HOLLYLAND LARK A1 — COMBO KIT';guide.compliance=current.compliance;
  pack.caption=current.caption;pack.hashtags=current.hashtags.split(/\s+/).filter(Boolean);pack.videoFileName=current.videoName;pack.coverFileName=current.coverName;pack.coverTitle='HOLLYLAND LARK A1 — COMBO KIT';pack.compliance={flags:['Electrical/battery-powered — normal-use review'],shipOnly:[]};
}
window.addEventListener('done-rite-one-click-plan',enhancePlan);
const key=requested();if(PROJECTS[key]){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>install(PROJECTS[key]),{once:true});else setTimeout(()=>install(PROJECTS[key]),0);}
window.DoneRiteReadyProjects={version:VERSION,projects:PROJECTS,load:key=>PROJECTS[key]||null};
})();
