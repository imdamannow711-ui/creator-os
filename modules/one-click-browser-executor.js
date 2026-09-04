/* DONE RITE Creator OS — One-Click Browser Executor v0.5
   Local preview and timed render executor. Originals are never overwritten.
*/
(function(){
'use strict';
const VERSION='0.5';
function supports(){const canCapture=typeof HTMLCanvasElement!=='undefined'&&!!HTMLCanvasElement.prototype.captureStream;const canRecord=typeof MediaRecorder!=='undefined';const canDraw=typeof document!=='undefined';const AudioCtx=typeof window!=='undefined'&&(window.AudioContext||window.webkitAudioContext);return {canCapture,canRecord,canDraw,canAudioMix:!!AudioCtx,localPreview:canDraw,localExport:canCapture&&canRecord&&!!AudioCtx};}
function pickMime(){if(typeof MediaRecorder==='undefined'||typeof MediaRecorder.isTypeSupported!=='function')return'';const choices=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];for(const m of choices){try{if(MediaRecorder.isTypeSupported(m))return m;}catch(e){}}return'';}
function createPreviewUrl(file){if(!file)throw new Error('Missing source file.');return URL.createObjectURL(file);}
function release(url){if(url)try{URL.revokeObjectURL(url);}catch(e){}}
function buildExecutionState(session,recipe){const caps=supports(),mime=pickMime();return {engine:'DONE RITE One-Click Browser Executor',version:VERSION,status:caps.localExport&&mime?'LOCAL_EXPORT_AVAILABLE':'PREVIEW_ONLY',sessionId:session&&session.id||null,originalPreserved:true,recipe:recipe||null,capabilities:caps,recorderMime:mime||null,exportWarning:caps.localExport&&mime?null:'This browser can preview the planned edit but cannot reliably encode the final local video in this path.',requiresUserGestureForSave:true};}
function waitEvent(target,name,timeout){return new Promise((resolve,reject)=>{let timer=null;const done=()=>{cleanup();resolve();};const fail=()=>{cleanup();reject(new Error('Video '+name+' failed.'));};function cleanup(){target.removeEventListener(name,done);target.removeEventListener('error',fail);if(timer)clearTimeout(timer);}target.addEventListener(name,done,{once:true});target.addEventListener('error',fail,{once:true});if(timeout)timer=setTimeout(()=>{cleanup();reject(new Error('Timed out waiting for video '+name+'.'));},timeout);});}
function waitRecorderState(recorder,eventName,timeout){return new Promise((resolve,reject)=>{let timer=null;const done=()=>{cleanup();resolve();};const fail=e=>{cleanup();reject(e&&e.error||new Error('Recorder '+eventName+' failed.'));};function cleanup(){recorder.removeEventListener(eventName,done);recorder.removeEventListener('error',fail);if(timer)clearTimeout(timer);}recorder.addEventListener(eventName,done,{once:true});recorder.addEventListener('error',fail,{once:true});timer=setTimeout(()=>{cleanup();reject(new Error('Timed out waiting for recorder '+eventName+'.'));},timeout||5000);});}
async function loadPlayableVideo(file){const video=document.createElement('video');video.playsInline=true;video.preload='auto';video.volume=1;video.muted=false;const url=URL.createObjectURL(file);video.src=url;try{if(video.readyState<1)await waitEvent(video,'loadedmetadata',12000);if(video.readyState<2)await waitEvent(video,'loadeddata',12000);return {video,url};}catch(err){release(url);throw err;}}
function makeCanvasForVideo(video,maxLongEdge){const vw=video.videoWidth||1080,vh=video.videoHeight||1920,maxEdge=Math.max(vw,vh),limit=Math.max(360,Number(maxLongEdge||1280)),scale=maxEdge>limit?limit/maxEdge:1;const canvas=document.createElement('canvas');canvas.width=Math.max(2,Math.round(vw*scale));canvas.height=Math.max(2,Math.round(vh*scale));return canvas;}
function fitContain(ctx,video,w,h){const vw=video.videoWidth||w,vh=video.videoHeight||h,scale=Math.min(w/vw,h/vh),dw=vw*scale,dh=vh*scale,x=(w-dw)/2,y=(h-dh)/2;ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);ctx.drawImage(video,x,y,dw,dh);}
function wrapText(ctx,text,maxWidth){const words=String(text||'').trim().split(/\s+/),lines=[];let line='';for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;}else line=test;}if(line)lines.push(line);return lines.slice(0,3);}
function drawOverlay(ctx,overlay,w,h){if(!overlay||!overlay.text)return;const fontSize=Math.max(26,Math.round(w*.058)),x=Math.round(w*.08),y=Math.round(h*.17),maxWidth=Math.round(w*.78);ctx.font='900 '+fontSize+'px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';ctx.textBaseline='top';ctx.lineJoin='round';const lines=wrapText(ctx,String(overlay.text).slice(0,100),maxWidth),gap=Math.round(fontSize*1.12);lines.forEach((line,i)=>{ctx.lineWidth=Math.max(3,Math.round(w*.005));ctx.strokeStyle='rgba(0,0,0,.92)';ctx.fillStyle='#fff';ctx.strokeText(line,x,y+i*gap);ctx.fillText(line,x,y+i*gap);});}
function overlayForTime(recipe,t){const overlays=recipe&&Array.isArray(recipe.overlays)?recipe.overlays:[],d=Math.max(.1,Number(recipe&&recipe.outputDurationSeconds||0));if(!overlays.length)return null;if(overlays.length===1)return overlays[0];if(t<Math.min(2,d*.25))return overlays[0];if(overlays.length>2&&t>=Math.max(0,d-2.4))return overlays[overlays.length-1];if(overlays.length>1&&t>=d*.34&&t<=d*.72)return overlays[Math.min(1,overlays.length-1)];return null;}
async function seekVideo(video,time){const target=Math.max(0,Math.min(Number(time||0),Math.max(0,(video.duration||0)-.01)));if(Math.abs(video.currentTime-target)<.04)return;video.currentTime=target;await waitEvent(video,'seeked',10000);}
function drawUntil(video,ctx,canvas,cut,baseElapsed,recipe,onProgress){return new Promise((resolve,reject)=>{let stopped=false;function frame(){if(stopped)return;try{if(video.readyState>=2){fitContain(ctx,video,canvas.width,canvas.height);const elapsed=baseElapsed+Math.max(0,Math.min(cut.end,video.currentTime)-cut.start);drawOverlay(ctx,overlayForTime(recipe,elapsed),canvas.width,canvas.height);if(typeof onProgress==='function')onProgress(Math.min(1,elapsed/Math.max(.1,recipe.outputDurationSeconds||1)));}if(video.currentTime>=cut.end-.025||video.ended){stopped=true;resolve();return;}requestAnimationFrame(frame);}catch(err){stopped=true;reject(err);}}requestAnimationFrame(frame);});}
async function previewFrame(file,recipe,options){options=options||{};if(!file)throw new Error('Missing source file.');const loaded=await loadPlayableVideo(file),video=loaded.video,url=loaded.url;try{const cuts=recipe&&Array.isArray(recipe.selectedCuts)?recipe.selectedCuts:[],first=cuts[0];const target=first?Math.min(first.end-.05,first.start+Math.min(.35,Math.max(.08,(first.end-first.start)*.15))):Math.min(.35,Math.max(.08,(video.duration||1)*.08));await seekVideo(video,target);const canvas=makeCanvasForVideo(video,options.maxLongEdge||1280),ctx=canvas.getContext('2d');fitContain(ctx,video,canvas.width,canvas.height);drawOverlay(ctx,overlayForTime(recipe,0),canvas.width,canvas.height);return {canvas,dataUrl:canvas.toDataURL('image/jpeg',.9),sourceTime:target};}finally{video.pause();video.removeAttribute('src');video.load();release(url);}}
function createRecorder(stream,mime,options){const full={mimeType:mime,videoBitsPerSecond:Number(options.videoBitsPerSecond||6000000),audioBitsPerSecond:Number(options.audioBitsPerSecond||128000)};try{return new MediaRecorder(stream,full);}catch(e){return new MediaRecorder(stream,{mimeType:mime});}}
async function renderLocalVideo(file,recipe,options){return renderLocalBatch([file],recipe,options);}
async function renderLocalBatch(files,recipe,options){
  options=options||{};const list=Array.from(files||[]),caps=supports(),mime=pickMime(),AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!list.length)throw new Error('Missing source files.');
  if(!recipe||!Array.isArray(recipe.selectedCuts)||!recipe.selectedCuts.length)throw new Error('No selected cuts to render.');
  if(!caps.localExport||!mime||!AudioCtx)throw new Error('Local video export is not available in this browser.');
  let audioCtx=null,canvasStream=null,combined=null,recorder=null,outputUrl='',active=null;
  try{
    audioCtx=new AudioCtx();if(audioCtx.state!=='running')await audioCtx.resume();
    const firstIndex=Math.max(0,Math.min(list.length-1,Number(recipe.selectedCuts[0].sourceIndex||0)));active=await loadPlayableVideo(list[firstIndex]);
    const canvas=makeCanvasForVideo(active.video,options.maxLongEdge||1280),ctx=canvas.getContext('2d',{alpha:false}),dest=audioCtx.createMediaStreamDestination();
    canvasStream=canvas.captureStream(Number(options.fps||30));combined=new MediaStream([...canvasStream.getVideoTracks(),...dest.stream.getAudioTracks()]);
    const chunks=[];recorder=createRecorder(combined,mime,options);recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};
    const stopped=new Promise((resolve,reject)=>{recorder.onstop=resolve;recorder.onerror=e=>reject(e.error||new Error('MediaRecorder failed.'));});
    let currentSourceIndex=-1,currentSourceNode=null,currentGain=null,baseElapsed=0;
    async function switchSource(sourceIndex){
      sourceIndex=Math.max(0,Math.min(list.length-1,Number(sourceIndex||0)));
      if(currentSourceIndex===sourceIndex&&active)return;
      if(currentSourceNode)try{currentSourceNode.disconnect();}catch(e){}
      if(currentGain)try{currentGain.disconnect();}catch(e){}
      if(active){try{active.video.pause();active.video.removeAttribute('src');active.video.load();}catch(e){}release(active.url);active=null;}
      active=await loadPlayableVideo(list[sourceIndex]);currentSourceIndex=sourceIndex;
      currentSourceNode=audioCtx.createMediaElementSource(active.video);currentGain=audioCtx.createGain();currentGain.gain.value=1;currentSourceNode.connect(currentGain);currentGain.connect(dest);
    }
    await switchSource(firstIndex);
    const cuts=recipe.selectedCuts.map((c,i)=>({start:Number(c.start),end:Number(c.end),sourceIndex:Number.isInteger(c.sourceIndex)?c.sourceIndex:0,sequenceIndex:i})).filter(c=>c.end>c.start);
    await seekVideo(active.video,cuts[0].start);fitContain(ctx,active.video,canvas.width,canvas.height);drawOverlay(ctx,overlayForTime(recipe,0),canvas.width,canvas.height);recorder.start(250);
    for(let i=0;i<cuts.length;i++){
      const cut=cuts[i];
      if(i>0){if(recorder.state==='recording'){const p=waitRecorderState(recorder,'pause',4000);recorder.pause();await p;}await switchSource(cut.sourceIndex);await seekVideo(active.video,cut.start);if(recorder.state==='paused'){const r=waitRecorderState(recorder,'resume',4000);recorder.resume();await r;}}
      await active.video.play();await drawUntil(active.video,ctx,canvas,cut,baseElapsed,recipe,options.onProgress);active.video.pause();baseElapsed+=cut.end-cut.start;
    }
    if(recorder.state!=='inactive')recorder.stop();await stopped;
    const blob=new Blob(chunks,{type:mime.split(';')[0]||'video/mp4'});if(!blob.size)throw new Error('The browser returned an empty rendered video.');
    outputUrl=URL.createObjectURL(blob);return {status:'RENDER_COMPLETE',blob,url:outputUrl,mimeType:blob.type||mime,fileName:recipe.export&&recipe.export.fileName||'done-rite-ad.mp4',durationSeconds:+baseElapsed.toFixed(2),width:canvas.width,height:canvas.height,sourceCount:list.length,originalPreserved:true};
  }catch(err){if(outputUrl)release(outputUrl);throw err;}
  finally{try{if(active){active.video.pause();active.video.removeAttribute('src');active.video.load();release(active.url);}}catch(e){}try{if(recorder&&recorder.state!=='inactive')recorder.stop();}catch(e){}try{if(canvasStream)canvasStream.getTracks().forEach(t=>t.stop());}catch(e){}try{if(combined)combined.getTracks().forEach(t=>t.stop());}catch(e){}try{if(audioCtx)await audioCtx.close();}catch(e){}}
}
function canShareFile(blob,fileName){if(!blob||typeof File==='undefined'||!navigator.share||!navigator.canShare)return false;try{return navigator.canShare({files:[new File([blob],fileName||'done-rite-ad.mp4',{type:blob.type||'video/mp4'})]});}catch(e){return false;}}
async function shareFile(blob,fileName,shareText){if(!canShareFile(blob,fileName))throw new Error('File sharing is not available in this browser.');const file=new File([blob],fileName||'done-rite-ad.mp4',{type:blob.type||'video/mp4'});const payload={files:[file],title:file.name};if(shareText)payload.text=String(shareText);await navigator.share(payload);}
window.DoneRiteOneClickBrowserExecutor={version:VERSION,supports,pickMime,createPreviewUrl,release,buildExecutionState,previewFrame,renderLocalVideo,renderLocalBatch,canShareFile,shareFile};
})();