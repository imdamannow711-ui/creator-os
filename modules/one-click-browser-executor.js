/* DONE RITE Creator OS — One-Click Browser Executor v0.7
   iPhone-safe local preview and multi-source timed render executor.
   Originals are never overwritten.
*/
(function(){
'use strict';
const VERSION='0.7';

function supports(){
  const canCapture=typeof HTMLCanvasElement!=='undefined'&&!!HTMLCanvasElement.prototype.captureStream;
  const canRecord=typeof MediaRecorder!=='undefined';
  const canDraw=typeof document!=='undefined';
  const AudioCtx=typeof window!=='undefined'&&(window.AudioContext||window.webkitAudioContext);
  return {canCapture,canRecord,canDraw,canAudioMix:!!AudioCtx,localPreview:canDraw,localExport:canCapture&&canRecord&&!!AudioCtx};
}
function pickMime(){
  if(typeof MediaRecorder==='undefined'||typeof MediaRecorder.isTypeSupported!=='function')return'';
  const choices=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
  for(const m of choices){try{if(MediaRecorder.isTypeSupported(m))return m;}catch(e){}}
  return'';
}
function createPreviewUrl(file){if(!file)throw new Error('Missing source file.');return URL.createObjectURL(file);}
function release(url){if(url)try{URL.revokeObjectURL(url);}catch(e){}}
function buildExecutionState(session,recipe){
  const caps=supports(),mime=pickMime();
  return {engine:'DONE RITE One-Click Browser Executor',version:VERSION,status:caps.localExport&&mime?'LOCAL_EXPORT_AVAILABLE':'PREVIEW_ONLY',sessionId:session&&session.id||null,originalPreserved:true,recipe:recipe||null,capabilities:caps,recorderMime:mime||null,exportWarning:caps.localExport&&mime?null:'This browser can preview the planned edit but cannot reliably encode the final local video in this path.',requiresUserGestureForSave:true};
}
function waitEvent(target,name,timeout){return new Promise((resolve,reject)=>{let timer=null;const done=()=>{cleanup();resolve();};const fail=()=>{cleanup();reject(new Error('Video '+name+' failed.'));};function cleanup(){target.removeEventListener(name,done);target.removeEventListener('error',fail);if(timer)clearTimeout(timer);}target.addEventListener(name,done,{once:true});target.addEventListener('error',fail,{once:true});if(timeout)timer=setTimeout(()=>{cleanup();reject(new Error('Timed out waiting for video '+name+'.'));},timeout);});}
function waitUntil(test,timeout,label){return new Promise((resolve,reject)=>{const start=Date.now();function tick(){let ok=false;try{ok=!!test();}catch(e){}if(ok){resolve();return;}if(Date.now()-start>=timeout){reject(new Error('Timed out waiting for '+label+'.'));return;}setTimeout(tick,80);}tick();});}
function waitRecorderState(recorder,eventName,timeout){return new Promise((resolve,reject)=>{let timer=null;const done=()=>{cleanup();resolve();};const fail=e=>{cleanup();reject(e&&e.error||new Error('Recorder '+eventName+' failed.'));};function cleanup(){recorder.removeEventListener(eventName,done);recorder.removeEventListener('error',fail);if(timer)clearTimeout(timer);}recorder.addEventListener(eventName,done,{once:true});recorder.addEventListener('error',fail,{once:true});timer=setTimeout(()=>{cleanup();reject(new Error('Timed out waiting for recorder '+eventName+'.'));},timeout||5000);});}

async function loadPlayableVideo(file){
  const video=document.createElement('video');video.playsInline=true;video.preload='auto';video.volume=1;video.muted=false;
  const url=URL.createObjectURL(file);video.src=url;video.load();
  try{if(video.readyState<1)await waitEvent(video,'loadedmetadata',20000);return {video,url};}
  catch(err){release(url);throw err;}
}
async function ensureFrameReady(video,targetTime){
  const target=Math.max(0,Math.min(Number(targetTime||0),Math.max(0,(video.duration||0)-.02)));
  if(Math.abs(video.currentTime-target)>.04){video.currentTime=target;try{await waitEvent(video,'seeked',20000);}catch(err){if(video.readyState<2)throw err;}}
  if(video.readyState>=2)return;
  const wasMuted=video.muted;video.muted=true;
  try{try{await video.play();}catch(e){}await waitUntil(()=>video.readyState>=2,30000,'video frame data');}
  finally{try{video.pause();}catch(e){}video.muted=wasMuted;}
}
function makeCanvasForVideo(video,maxLongEdge){const vw=video.videoWidth||1080,vh=video.videoHeight||1920,maxEdge=Math.max(vw,vh),limit=Math.max(360,Number(maxLongEdge||1280)),scale=maxEdge>limit?limit/maxEdge:1;const canvas=document.createElement('canvas');canvas.width=Math.max(2,Math.round(vw*scale));canvas.height=Math.max(2,Math.round(vh*scale));return canvas;}
function fitContain(ctx,video,w,h){const vw=video.videoWidth||w,vh=video.videoHeight||h,scale=Math.min(w/vw,h/vh),dw=vw*scale,dh=vh*scale,x=(w-dw)/2,y=(h-dh)/2;ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);if(video.readyState>=2)ctx.drawImage(video,x,y,dw,dh);}
function wrapText(ctx,text,maxWidth){const words=String(text||'').trim().split(/\s+/),lines=[];let line='';for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;}else line=test;}if(line)lines.push(line);return lines.slice(0,3);}
function drawOverlay(ctx,overlay,w,h){if(!overlay||!overlay.text)return;const fontSize=Math.max(26,Math.round(w*.058)),x=Math.round(w*.08),y=Math.round(h*.17),maxWidth=Math.round(w*.78);ctx.font='900 '+fontSize+'px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';ctx.textBaseline='top';ctx.lineJoin='round';const lines=wrapText(ctx,String(overlay.text).slice(0,100),maxWidth),gap=Math.round(fontSize*1.12);lines.forEach((line,i)=>{ctx.lineWidth=Math.max(3,Math.round(w*.005));ctx.strokeStyle='rgba(0,0,0,.92)';ctx.fillStyle='#fff';ctx.strokeText(line,x,y+i*gap);ctx.fillText(line,x,y+i*gap);});}
function overlayForTime(recipe,t){const overlays=recipe&&Array.isArray(recipe.overlays)?recipe.overlays:[],d=Math.max(.1,Number(recipe&&recipe.outputDurationSeconds||0));if(!overlays.length)return null;if(overlays.length===1)return overlays[0];if(t<Math.min(2,d*.25))return overlays[0];if(overlays.length>2&&t>=Math.max(0,d-2.4))return overlays[overlays.length-1];if(overlays.length>1&&t>=d*.34&&t<=d*.72)return overlays[Math.min(1,overlays.length-1)];return null;}
function drawUntil(video,ctx,canvas,cut,baseElapsed,recipe,onProgress){return new Promise((resolve,reject)=>{let stopped=false;function frame(){if(stopped)return;try{if(video.readyState>=2){fitContain(ctx,video,canvas.width,canvas.height);const elapsed=baseElapsed+Math.max(0,Math.min(cut.end,video.currentTime)-cut.start);drawOverlay(ctx,overlayForTime(recipe,elapsed),canvas.width,canvas.height);if(typeof onProgress==='function')onProgress(Math.min(1,elapsed/Math.max(.1,recipe.outputDurationSeconds||1)));}if(video.currentTime>=cut.end-.025||video.ended){stopped=true;resolve();return;}requestAnimationFrame(frame);}catch(err){stopped=true;reject(err);}}requestAnimationFrame(frame);});}
async function previewFrame(file,recipe,options){options=options||{};if(!file)throw new Error('Missing source file.');const loaded=await loadPlayableVideo(file),video=loaded.video,url=loaded.url;try{const cuts=recipe&&Array.isArray(recipe.selectedCuts)?recipe.selectedCuts:[],first=cuts[0];const target=first?Math.min(first.end-.05,first.start+Math.min(.35,Math.max(.08,(first.end-first.start)*.15))):Math.min(.35,Math.max(.08,(video.duration||1)*.08));await ensureFrameReady(video,target);const canvas=makeCanvasForVideo(video,options.maxLongEdge||1280),ctx=canvas.getContext('2d');fitContain(ctx,video,canvas.width,canvas.height);drawOverlay(ctx,overlayForTime(recipe,0),canvas.width,canvas.height);return {canvas,dataUrl:canvas.toDataURL('image/jpeg',.9),sourceTime:target};}finally{video.pause();video.removeAttribute('src');video.load();release(url);}}
function createRecorder(stream,mime,options){const full={mimeType:mime,videoBitsPerSecond:Number(options.videoBitsPerSecond||6000000),audioBitsPerSecond:Number(options.audioBitsPerSecond||128000)};try{return new MediaRecorder(stream,full);}catch(e){return new MediaRecorder(stream,{mimeType:mime});}}
async function renderLocalVideo(file,recipe,options){return renderLocalBatch([file],recipe,options);}

async function renderLocalBatch(files,recipe,options){
  options=options||{};
  const list=Array.from(files||[]),caps=supports(),mime=pickMime(),AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!list.length)throw new Error('Missing source files.');
  if(!recipe||!Array.isArray(recipe.selectedCuts)||!recipe.selectedCuts.length)throw new Error('No selected cuts to render.');
  if(!caps.localExport||!mime||!AudioCtx)throw new Error('Local video export is not available in this browser.');

  const cuts=recipe.selectedCuts.map((c,i)=>({start:Number(c.start),end:Number(c.end),sourceIndex:Number.isInteger(c.sourceIndex)?c.sourceIndex:0,sequenceIndex:i})).filter(c=>c.end>c.start);
  const firstIndex=Math.max(0,Math.min(list.length-1,cuts[0].sourceIndex));
  let audioCtx=null,canvasStream=null,combined=null,recorder=null,outputUrl='',video=null,currentUrl='',currentSourceIndex=-1;

  try{
    /* iPhone Safari: create and authorize ONE media element while the Render button tap is still active. */
    video=document.createElement('video');video.playsInline=true;video.preload='auto';video.volume=1;video.muted=false;
    currentUrl=URL.createObjectURL(list[firstIndex]);video.src=currentUrl;video.load();
    const initialPlay=video.play();

    audioCtx=new AudioCtx();
    const resumePromise=audioCtx.state==='running'?Promise.resolve():audioCtx.resume();
    await Promise.allSettled([initialPlay,resumePromise]);
    if(video.readyState<1)await waitEvent(video,'loadedmetadata',20000);
    try{video.pause();}catch(e){}
    currentSourceIndex=firstIndex;
    await ensureFrameReady(video,cuts[0].start);

    const canvas=makeCanvasForVideo(video,options.maxLongEdge||1280),ctx=canvas.getContext('2d',{alpha:false});
    const dest=audioCtx.createMediaStreamDestination();
    const sourceNode=audioCtx.createMediaElementSource(video),gain=audioCtx.createGain();gain.gain.value=1;sourceNode.connect(gain);gain.connect(dest);
    canvasStream=canvas.captureStream(Number(options.fps||30));
    combined=new MediaStream([...canvasStream.getVideoTracks(),...dest.stream.getAudioTracks()]);
    const chunks=[];recorder=createRecorder(combined,mime,options);recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};
    const stopped=new Promise((resolve,reject)=>{recorder.onstop=resolve;recorder.onerror=e=>reject(e.error||new Error('MediaRecorder failed.'));});

    async function switchSource(sourceIndex,startTime){
      sourceIndex=Math.max(0,Math.min(list.length-1,Number(sourceIndex||0)));
      if(currentSourceIndex!==sourceIndex){
        try{video.pause();}catch(e){}
        release(currentUrl);currentUrl=URL.createObjectURL(list[sourceIndex]);
        video.src=currentUrl;video.load();
        if(video.readyState<1)await waitEvent(video,'loadedmetadata',20000);
        currentSourceIndex=sourceIndex;
      }
      await ensureFrameReady(video,startTime||0);
    }

    await switchSource(firstIndex,cuts[0].start);
    fitContain(ctx,video,canvas.width,canvas.height);drawOverlay(ctx,overlayForTime(recipe,0),canvas.width,canvas.height);
    recorder.start(250);
    let baseElapsed=0;

    for(let i=0;i<cuts.length;i++){
      const cut=cuts[i];
      if(i>0){
        if(recorder.state==='recording'){const p=waitRecorderState(recorder,'pause',5000);recorder.pause();await p;}
        await switchSource(cut.sourceIndex,cut.start);
        if(recorder.state==='paused'){const r=waitRecorderState(recorder,'resume',5000);recorder.resume();await r;}
      }else await ensureFrameReady(video,cut.start);

      video.muted=false;
      try{await video.play();}
      catch(err){
        /* Safari fallback: reuse the same authorized element and allow muted playback only if required.
           Do not alter the source file or recorded voice data. */
        video.muted=true;
        await video.play();
      }
      await drawUntil(video,ctx,canvas,cut,baseElapsed,recipe,options.onProgress);
      video.pause();baseElapsed+=cut.end-cut.start;
    }

    if(recorder.state!=='inactive')recorder.stop();await stopped;
    const blob=new Blob(chunks,{type:mime.split(';')[0]||'video/mp4'});if(!blob.size)throw new Error('The browser returned an empty rendered video.');
    outputUrl=URL.createObjectURL(blob);
    return {status:'RENDER_COMPLETE',blob,url:outputUrl,mimeType:blob.type||mime,fileName:recipe.export&&recipe.export.fileName||'done-rite-ad.mp4',durationSeconds:+baseElapsed.toFixed(2),width:canvas.width,height:canvas.height,sourceCount:list.length,originalPreserved:true};
  }catch(err){if(outputUrl)release(outputUrl);throw err;}
  finally{
    try{if(video){video.pause();video.removeAttribute('src');video.load();}}catch(e){}release(currentUrl);
    try{if(recorder&&recorder.state!=='inactive')recorder.stop();}catch(e){}
    try{if(canvasStream)canvasStream.getTracks().forEach(t=>t.stop());}catch(e){}
    try{if(combined)combined.getTracks().forEach(t=>t.stop());}catch(e){}
    try{if(audioCtx)await audioCtx.close();}catch(e){}
  }
}

function installMultiClipReviewUI(){
  const input=document.getElementById('video'),preview=document.getElementById('preview');
  if(!input||!preview||document.getElementById('doneRiteClipReview'))return;
  const wrap=document.createElement('div');wrap.id='doneRiteClipReview';wrap.style.display='none';wrap.style.marginTop='10px';
  wrap.innerHTML='<div id="doneRiteClipCounter" style="text-align:center;font-weight:800;margin-bottom:8px;color:#c4ccd6"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button id="doneRitePrevClip" type="button" style="min-height:44px;border-radius:12px;border:1px solid #2a3442;background:#171c25;color:#58a6ff;font-weight:900">◀ PREVIOUS CLIP</button><button id="doneRiteNextClip" type="button" style="min-height:44px;border-radius:12px;border:1px solid #2a3442;background:#171c25;color:#58a6ff;font-weight:900">NEXT CLIP ▶</button></div>';
  preview.insertAdjacentElement('afterend',wrap);
  let index=0,url='';
  const counter=wrap.querySelector('#doneRiteClipCounter'),prev=wrap.querySelector('#doneRitePrevClip'),next=wrap.querySelector('#doneRiteNextClip');
  function list(){return Array.from(input.files||[]);}
  function show(i,autoPlay){
    const files=list();if(!files.length)return;
    index=Math.max(0,Math.min(files.length-1,i));
    try{preview.pause();}catch(e){}if(url)release(url);url=createPreviewUrl(files[index]);preview.src=url;preview.style.display='block';preview.load();
    counter.textContent='Clip '+(index+1)+' of '+files.length+' — '+files[index].name;
    prev.disabled=index===0;next.disabled=index===files.length-1;prev.style.opacity=prev.disabled?'.45':'1';next.style.opacity=next.disabled?'.45':'1';
    if(autoPlay)preview.play().catch(()=>{});
  }
  input.addEventListener('change',()=>setTimeout(()=>{const files=list();if(!files.length){wrap.style.display='none';if(url){release(url);url='';}return;}wrap.style.display='block';show(0,false);},0));
  prev.addEventListener('click',()=>show(index-1,true));next.addEventListener('click',()=>show(index+1,true));
  window.addEventListener('pagehide',()=>{if(url)release(url);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installMultiClipReviewUI,{once:true});else setTimeout(installMultiClipReviewUI,0);

function canShareFile(blob,fileName){if(!blob||typeof File==='undefined'||!navigator.share||!navigator.canShare)return false;try{return navigator.canShare({files:[new File([blob],fileName||'done-rite-ad.mp4',{type:blob.type||'video/mp4'})]});}catch(e){return false;}}
async function shareFile(blob,fileName,shareText){if(!canShareFile(blob,fileName))throw new Error('File sharing is not available in this browser.');const file=new File([blob],fileName||'done-rite-ad.mp4',{type:blob.type||'video/mp4'});const payload={files:[file],title:file.name};if(shareText)payload.text=String(shareText);await navigator.share(payload);}
window.DoneRiteOneClickBrowserExecutor={version:VERSION,supports,pickMime,createPreviewUrl,release,buildExecutionState,previewFrame,renderLocalVideo,renderLocalBatch,canShareFile,shareFile,installMultiClipReviewUI};
})();