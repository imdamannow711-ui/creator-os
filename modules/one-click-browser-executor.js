/* DONE RITE Creator OS — One-Click Browser Executor v0.2
   Local preview/export executor. Preserves the original source and never overwrites it.
*/
(function(){
'use strict';
const VERSION='0.2';

function supports(){
  const canCapture=typeof HTMLCanvasElement!=='undefined'&&!!HTMLCanvasElement.prototype.captureStream;
  const canRecord=typeof MediaRecorder!=='undefined';
  const canDraw=typeof document!=='undefined';
  return {canCapture,canRecord,canDraw,localPreview:canDraw,localExport:canCapture&&canRecord};
}
function pickMime(){
  if(typeof MediaRecorder==='undefined'||typeof MediaRecorder.isTypeSupported!=='function') return '';
  const choices=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
  for(const m of choices){try{if(MediaRecorder.isTypeSupported(m)) return m;}catch(e){}}
  return '';
}
function createPreviewUrl(file){if(!file) throw new Error('Missing source file.');return URL.createObjectURL(file);}
function release(url){if(url) try{URL.revokeObjectURL(url);}catch(e){}}
function buildExecutionState(session,recipe){
  const caps=supports(); const mime=pickMime();
  return {
    engine:'DONE RITE One-Click Browser Executor',version:VERSION,
    status:caps.localExport?'LOCAL_EXPORT_AVAILABLE':'PREVIEW_ONLY',
    sessionId:session&&session.id||null,originalPreserved:true,recipe:recipe||null,
    capabilities:caps,recorderMime:mime||null,
    exportWarning:caps.localExport?null:'This browser can preview the planned edit but cannot reliably encode the final local video in this path.',
    requiresUserGestureForSave:true
  };
}
function makeCanvas(width,height){const canvas=document.createElement('canvas');canvas.width=Math.max(1,width||1080);canvas.height=Math.max(1,height||1920);return canvas;}
function fitContain(ctx,video,w,h){const vw=video.videoWidth||w,vh=video.videoHeight||h;const scale=Math.min(w/vw,h/vh),dw=vw*scale,dh=vh*scale;const x=(w-dw)/2,y=(h-dh)/2;ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);ctx.drawImage(video,x,y,dw,dh);}
function drawOverlay(ctx,overlay,w,h){if(!overlay||!overlay.text)return;const text=String(overlay.text).slice(0,90);const x=Math.round(w*0.08),y=Math.round(h*0.18);ctx.font=`900 ${Math.max(34,Math.round(w*0.055))}px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif`;ctx.textBaseline='top';ctx.lineWidth=Math.max(3,Math.round(w*0.004));ctx.strokeStyle='rgba(0,0,0,.9)';ctx.fillStyle='#fff';ctx.strokeText(text,x,y);ctx.fillText(text,x,y);}
function waitFor(target,event,timeoutMs){
  return new Promise((resolve,reject)=>{
    let done=false;
    const finish=(ok,value)=>{if(done)return;done=true;clearTimeout(timer);target.removeEventListener(event,onEvent);target.removeEventListener('error',onError);ok?resolve(value):reject(value);};
    const onEvent=()=>finish(true);
    const onError=()=>finish(false,new Error('Could not decode the selected video frame.'));
    const timer=setTimeout(()=>finish(false,new Error('Timed out waiting for the selected video frame.')),timeoutMs||6000);
    target.addEventListener(event,onEvent,{once:true});
    target.addEventListener('error',onError,{once:true});
  });
}
async function previewFrame(file,recipe,options){
  options=options||{}; if(!file) throw new Error('Missing source file.');
  const video=document.createElement('video');video.muted=true;video.playsInline=true;video.preload='auto';
  const url=URL.createObjectURL(file);
  try{
    video.src=url;
    if(video.readyState<1) await waitFor(video,'loadedmetadata',6000);
    const duration=Number.isFinite(video.duration)?video.duration:0;
    const firstCut=recipe&&Array.isArray(recipe.selectedCuts)&&recipe.selectedCuts[0];
    const requested=firstCut?Number(firstCut.start||0)+Math.min(0.35,Math.max(0,(Number(firstCut.end||0)-Number(firstCut.start||0))/2)):0.25;
    const seekTo=Math.max(0,Math.min(duration>0?Math.max(0,duration-0.05):requested,requested));
    if(video.readyState<2) await waitFor(video,'loadeddata',6000);
    if(seekTo>0.01 && Math.abs((video.currentTime||0)-seekTo)>0.01){
      video.currentTime=seekTo;
      await waitFor(video,'seeked',6000);
    }
    if('requestVideoFrameCallback' in video){
      await new Promise(resolve=>{let settled=false;const timer=setTimeout(()=>{if(!settled){settled=true;resolve();}},1200);video.requestVideoFrameCallback(()=>{if(!settled){settled=true;clearTimeout(timer);resolve();}});});
    }else{
      await new Promise(resolve=>setTimeout(resolve,120));
    }
    const canvas=makeCanvas(options.width||video.videoWidth||1080,options.height||video.videoHeight||1920);
    const ctx=canvas.getContext('2d');
    if(!ctx) throw new Error('Canvas preview is unavailable on this device.');
    fitContain(ctx,video,canvas.width,canvas.height);
    const overlay=recipe&&recipe.overlays&&recipe.overlays[0]; drawOverlay(ctx,overlay,canvas.width,canvas.height);
    return {canvas,dataUrl:canvas.toDataURL('image/jpeg',0.9),sampleTime:seekTo};
  } finally {
    release(url);
  }
}
window.DoneRiteOneClickBrowserExecutor={version:VERSION,supports,pickMime,createPreviewUrl,release,buildExecutionState,previewFrame};
})();