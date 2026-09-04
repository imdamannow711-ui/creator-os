/* DONE RITE Creator OS — One-Click Camera Handoff v0.1
   Adds a real iPhone camera capture path to the Hook + CTA recording guide.
   The captured file stays local and is appended to the current One-Click clip set when Safari permits it.
*/
(function(){
'use strict';
const VERSION='0.1';
let lastPlan=null;

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

  cameraButton.addEventListener('click',()=>{
    cameraInput.value='';
    cameraInput.click();
  });

  cameraInput.addEventListener('change',()=>{
    const file=cameraInput.files&&cameraInput.files[0];
    if(!file){status.textContent='No new video was recorded.';return;}
    const result=appendCapturedFile(file);
    if(result.ok){
      status.style.color='#56ec9c';
      status.textContent='New camera clip added to this One-Click project. '+result.count+' raw clip'+(result.count===1?' is':'s are')+' loaded. Rebuild the edit when you are ready.';
    }else{
      status.style.color='#ffd166';
      status.textContent='The video was recorded, but Safari would not append it automatically. Use Choose your raw clips and select the new video together with your originals. '+result.reason;
    }
  });
}

window.addEventListener('done-rite-one-click-plan',event=>{
  lastPlan=event&&event.detail||lastPlan;
  setTimeout(()=>install(lastPlan),0);
});

window.DoneRiteOneClickCameraHandoff={version:VERSION,install,appendCapturedFile};
})();
