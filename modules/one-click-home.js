/* DONE RITE Creator OS — Graphic One-Click launcher v0.2 */
(function(){
'use strict';
const VERSION='0.2';
const STAGES=new Set(['create','upload','text','voiceover','trim','sfx','render','export']);

function safeSameOrigin(path){
  const url=new URL(path,location.href);
  if(url.origin!==location.origin)throw new Error('One-Click route must stay on Creator OS.');
  return url;
}

function launcherReturn(){
  const url=safeSameOrigin('one-click-home-dev.html');
  return url.pathname.split('/').pop()||'one-click-home-dev.html';
}

function editorUrl(stage){
  if(!STAGES.has(stage))throw new Error('Unknown One-Click stage.');
  const url=safeSameOrigin('one-click-ad-dev.html');
  url.searchParams.set('stage',stage);
  url.searchParams.set('return',launcherReturn());
  url.searchParams.set('build','20260912-long-clip-1');
  return url.href;
}

function install(){
  const status=document.getElementById('launcherStatus');
  try{
    document.querySelectorAll('[data-stage]').forEach(link=>{
      const stage=link.getAttribute('data-stage');
      link.setAttribute('href',editorUrl(stage));
      link.addEventListener('click',()=>{if(status)status.textContent='Opening '+stage.replace('trim','auto trim')+'…';});
    });
    if(status){status.className='launcher-status ready';status.textContent='One-Click launcher ready. Your project stays on this device.';}
  }catch(err){
    if(status){status.className='launcher-status error';status.textContent='Launcher unavailable: '+err.message;}
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.DoneRiteOneClickHome={version:VERSION,editorUrl};
})();
