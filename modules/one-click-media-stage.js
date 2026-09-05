/* DONE RITE Creator OS — One-Click Media Stage v0.2 */
(function(){
'use strict';
const VERSION='0.2';
function wait(target,event,errorMessage){return new Promise((resolve,reject)=>{const ok=()=>{cleanup();resolve();};const bad=()=>{cleanup();reject(new Error(errorMessage));};const cleanup=()=>{target.removeEventListener(event,ok);target.removeEventListener('error',bad);};target.addEventListener(event,ok,{once:true});target.addEventListener('error',bad,{once:true});});}
function seek(video,time){return new Promise((resolve,reject)=>{const ok=()=>{cleanup();resolve();};const bad=()=>{cleanup();reject(new Error('Could not seek through this video.'));};const cleanup=()=>{video.removeEventListener('seeked',ok);video.removeEventListener('error',bad);};video.addEventListener('seeked',ok,{once:true});video.addEventListener('error',bad,{once:true});video.currentTime=Math.max(0,Math.min(time,Math.max(0,(video.duration||0)-0.05)));});}
function inspectFile(file){
  if(!file) throw new Error('No media file selected.');
  const type=String(file.type||'');
  const namedVideo=/\.(mov|mp4|m4v|webm)$/i.test(file.name||'');
  if(!type.startsWith('video/')&&!namedVideo) throw new Error('Choose an iPhone video file (MOV, MP4, M4V, or WebM).');
  return {name:file.name||'raw-video',type:type||'video/unknown',size:file.size||0,lastModified:file.lastModified||0,isVideo:true,originalFile:file,metadata:null};
}
async function withVideo(file,preload){
  const video=document.createElement('video');
  video.preload=preload||'auto';video.muted=true;video.playsInline=true;
  const url=URL.createObjectURL(file);video.src=url;
  try{await wait(video,'loadedmetadata','Could not read video metadata.');return {video,url};}catch(err){URL.revokeObjectURL(url);throw err;}
}
async function loadMetadata(file){
  const holder=await withVideo(file,'metadata');const video=holder.video;
  const data={duration:video.duration||0,width:video.videoWidth||0,height:video.videoHeight||0,aspectRatio:video.videoWidth&&video.videoHeight?video.videoWidth/video.videoHeight:null,orientation:video.videoHeight>=video.videoWidth?'portrait':'landscape'};
  URL.revokeObjectURL(holder.url);return data;
}
function frameMetrics(data,previous){
  let light=0,edge=0,motion=0,count=0;
  const width=data.width,height=data.height,p=data.data;
  for(let y=0;y<height;y+=2){for(let x=0;x<width;x+=2){const i=(y*width+x)*4;const g=(p[i]*0.299+p[i+1]*0.587+p[i+2]*0.114);light+=g;count++;if(x+2<width){const j=i+8;const g2=(p[j]*0.299+p[j+1]*0.587+p[j+2]*0.114);edge+=Math.abs(g-g2);}if(previous)motion+=(Math.abs(p[i]-previous[i])+Math.abs(p[i+1]-previous[i+1])+Math.abs(p[i+2]-previous[i+2]))/3;}}
  return {brightness:+(light/count/255).toFixed(3),sharpness:+Math.min(1,edge/count/48).toFixed(3),motion:previous?+Math.min(1,motion/count/42).toFixed(3):null};
}
async function analyzeFrames(file,options){
  options=options||{};const holder=await withVideo(file,'auto');const video=holder.video;
  if(video.readyState<2) await wait(video,'loadeddata','Could not decode a video frame.');
  const canvas=document.createElement('canvas');canvas.width=96;canvas.height=Math.max(54,Math.round(96*(video.videoHeight||1920)/(video.videoWidth||1080)));
  const ctx=canvas.getContext('2d',{willReadFrequently:true});const step=Math.max(1,Number(options.stepSeconds||3));const windows=[];let previous=null,index=0;
  try{
    for(let start=0;start<video.duration;start+=step){const end=Math.min(video.duration,start+step);await seek(video,start+(end-start)/2);ctx.drawImage(video,0,0,canvas.width,canvas.height);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);const metrics=frameMetrics(pixels,previous);previous=new Uint8ClampedArray(pixels.data);windows.push({id:'sample-'+(++index),start:+start.toFixed(3),end:+end.toFixed(3),features:metrics,analysisSource:'decoded video frames'});}
    return {analysisType:'REAL_FRAME_SAMPLING',sampleCount:windows.length,stepSeconds:step,candidates:windows,limitations:['Visual sampling measures motion, brightness, and edge detail. Product recognition and speech meaning are not yet analyzed.','Voice preservation is verified from the edited export, not inferred from these frame scores.']};
  }finally{URL.revokeObjectURL(holder.url);}
}
function buildMediaAnalysis(metadata,targetSeconds){
  const d=Math.max(0,Number(metadata&&metadata.duration||0));const target=Math.min(Math.max(1,Number(targetSeconds||15)),d||Number(targetSeconds||15));
  return {sourceDurationSeconds:+d.toFixed(2),targetDurationSeconds:+target.toFixed(2),frameWidth:metadata&&metadata.width||0,frameHeight:metadata&&metadata.height||0,orientation:metadata&&metadata.orientation||'unknown',originalFramingPolicy:'contain; never crop automatically',selectionPolicy:'Derive edits from the source; never overwrite the source.',visualAnalysisStatus:'PENDING_REAL_FRAME_SAMPLING',voiceAnalysisStatus:'NOT_INFERRED'};
}
async function createSession(file,plan){const source=inspectFile(file);const metadata=await loadMetadata(file);return {id:'oneclick-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),status:'MEDIA_READY',createdAt:new Date().toISOString(),source:Object.assign({},source,{metadata}),plan:plan||null,analysis:buildMediaAnalysis(metadata,plan&&plan.durationSeconds),outputs:{editedBlob:null,editedUrl:null,activeVersion:'original'},rollback:{originalPreserved:true,canRestoreOriginal:true}};}
function releaseUrl(url){if(url)try{URL.revokeObjectURL(url);}catch(e){}}
window.DoneRiteOneClickMediaStage={version:VERSION,inspectFile,loadMetadata,analyzeFrames,buildMediaAnalysis,createSession,releaseUrl};
})();
