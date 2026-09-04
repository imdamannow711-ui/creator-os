/* DONE RITE Creator OS — One-Click Camera Handoff v0.3
   Adds a real iPhone camera capture path to the Hook + CTA recording guide.
   Also loads the One-Click voiceover gap remover and autosave/resume state.
*/
(function(){
'use strict';
const VERSION='0.3';
let lastPlan=null;
let capturedUrl='';

function loadScriptOnce(selector,src,datasetKey,onload){
  if(document.querySelector(selector))return;
  const s=document.createElement('script');s.src=src;s.async=false;s.dataset[datasetKey]='1';if(onload)s.onload=onload;document.head.appendChild(s);
}
function loadGapRemover(){
  if(window.DoneRiteOneClickGapRemover)return;
  loadScriptOnce('script[data-done-rite-gap-remover]','modules/one-click-gap-remover.js?v=20260904-gap1','doneRiteGapRemover',()=>{try{window.DoneRiteOneClickGapRemover&&window.DoneRiteOneClickGapRemover.install();}catch(e){}});
}
function loadSessionState(){
  if(window.DoneRiteOneClickSessionState)return;
  loadScriptOnce('script[data-done-rite-session-state]','modules/one-click-session-state.js?v=20260904-session1','doneRiteSessionState');
}

function fileSignature(file){return [file&&file.name||'',file&&file.size||0,file&&file.lastModified||0].join('|');}

function appendCapturedFile(captured){
  const source=document.getElementById('video');
  if(!source||!captured)return {ok:false,reason:'Raw clip picker is unavailable.'};
  if(typeof DataTransfer==='undefined')return {ok:false,reason:'This Safari build cannot append the camera file automatically.'};
  try{
    const dt=new DataTransfer(),seen=new Set();
    Array.from(source.files||[]).forEach(file=>{const key=fileSignature(file);if(!seen.has(key)){seen.add(key);dt.items.add(file);}});
    const captureKey=fileSignature(captured);if(!seen.has(captureKey))dt.items.add(captured);
    source.files=dt.files;
    source.dispatchEvent(new Event('change',{bubbles:true}));
    return {ok:true,count:dt.files.length};
  }catch(err){return {ok:false,reason:err&&err.message?err.message:'Safari did not allow the camera file to be appended.'};}
}

function install(plan){
  loadGapRemover();loadSessionState();
  if(plan)lastPlan=plan;
  const card=document.getElementById('doneRiteRecordingHandoff');
  if(!card||!lastPlan)return;
  if(card.dataset.cameraHandoff==='1')return;
  card.dataset.cameraHandoff='1';

  const oldLink=document.getElementById('doneRiteRecordMissing');
  if(oldLink){
    oldLink.textContent='🎙 OPEN TELEPROMPTER + VO / FILMING GUIDE';
    oldLink.style.background='#171c25';
    oldLink.style.border='1px solid #58a6ff';
    oldLink.style.color='#72bdff';
    oldLink.style.marginTop='8px';
  }

  const cameraButton=document.createElement('button');
  cameraButton.type='button';cameraButton.id='doneRiteCameraButton';
  cameraButton.textContent='📹 RECORD MISSING CLIP NOW';
  cameraButton.style.cssText='display:block;width:100%;min-height:54px;padding:14px 10px;border:1px solid #2bd97c;border-radius:13px;background:#16864b;color:#fff;font:950 16px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;margin-top:8px';

  const cameraInput=document.createElement('input');
  cameraInput.type='file';cameraInput.id='doneRiteCameraCapture';cameraInput.accept='video/*';cameraInput.setAttribute('capture','environment');cameraInput.hidden=true;

  const status=document.createElement('div');
  status.id='doneRiteCameraStatus';status.setAttribute('aria-live','polite');
  status.style.cssText='margin-top:8px;color:#b8c6d6;font-size:13px;line-height:1.4';
  status.textContent='Read the Hook + CTA directions above first. Then record only the missing shot.';

  if(oldLink)card.insertBefore(cameraButton,oldLink);else card.appendChild(cameraButton);
  if(oldLink)card.insertBefore(cameraInput,oldLink);else card.appendChild(cameraInput);
  if(oldLink)card.insertBefore(status,oldLink);else card.appendChild(status);

  cameraButton.addEventListener('click',()=>{cameraInput.value='';cameraInput.click();});

  cameraInput.addEventListener('change',()=>{
    const file=cameraInput.files&&cameraInput.files[0];
    if(!file){status.textContent='No new video was recorded.';return;}
    const result=appendCapturedFile(file);
    if(result.ok){
      status.style.color='#56ec9c';
      status.textContent='New camera clip added to this One-Click project. '+result.count+' raw clip'+(result.count===1?' is':'s are')+' loaded. Rebuild the edit when you are ready.';
    }else{
      status.style.color='#ffd166';
      status.textContent='The video was recorded, but Safari would not append it automatically. Save/share the recorded clip, then add it with your originals. '+result.reason;
      let save=document.getElementById('doneRiteSaveCaptured');
      if(!save){
        save=document.createElement('button');save.type='button';save.id='doneRiteSaveCaptured';save.textContent='SAVE / SHARE RECORDED CLIP';
        save.style.cssText='display:block;width:100%;min-height:48px;padding:12px 10px;border:1px solid #ffd166;border-radius:12px;background:#2a1c00;color:#ffd166;font-weight:900;margin-top:8px';
        status.insertAdjacentElement('afterend',save);
      }
      save.onclick=async()=>{
        try{
          if(typeof File!=='undefined'&&navigator.share&&navigator.canShare){const shareFile=new File([file],file.name||'done-rite-missing-clip.mov',{type:file.type||'video/quicktime'});if(navigator.canShare({files:[shareFile]})){await navigator.share({files:[shareFile],title:shareFile.name});return;}}
          if(capturedUrl)try{URL.revokeObjectURL(capturedUrl);}catch(e){}
          capturedUrl=URL.createObjectURL(file);const a=document.createElement('a');a.href=capturedUrl;a.download=file.name||'done-rite-missing-clip.mov';a.click();
        }catch(err){if(err&&err.name!=='AbortError')status.textContent='Could not open the save/share sheet. The recorded clip is still loaded on this page.';}
      };
    }
  });
}

function bootHelpers(){loadGapRemover();loadSessionState();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootHelpers,{once:true});else bootHelpers();
window.addEventListener('pagehide',()=>{if(capturedUrl)try{URL.revokeObjectURL(capturedUrl);}catch(e){}});
window.addEventListener('done-rite-one-click-plan',event=>{lastPlan=event&&event.detail||lastPlan;setTimeout(()=>install(lastPlan),0);});

window.DoneRiteOneClickCameraHandoff={version:VERSION,install,appendCapturedFile,loadGapRemover,loadSessionState};
})();
