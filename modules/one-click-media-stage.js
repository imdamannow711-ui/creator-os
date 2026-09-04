/* DONE RITE Creator OS — One-Click Media Stage v0.1
   Browser-local media inspection helpers. Originals are never overwritten.
*/
(function(){
'use strict';
const VERSION='0.1';
function inspectFile(file){
  if(!file) throw new Error('No media file selected.');
  const type=String(file.type||'');
  if(!type.startsWith('video/')) throw new Error('One-Click Ad currently requires a video file.');
  return {
    name:file.name||'raw-video',type,size:file.size||0,lastModified:file.lastModified||0,
    isVideo:true,originalFile:file,originalUrl:null,workingUrl:null,metadata:null
  };
}
function loadMetadata(file){
  return new Promise((resolve,reject)=>{
    let url='';
    try{
      url=URL.createObjectURL(file);
      const video=document.createElement('video');
      video.preload='metadata'; video.muted=true; video.playsInline=true;
      video.onloadedmetadata=()=>{
        const data={duration:video.duration||0,width:video.videoWidth||0,height:video.videoHeight||0,
          aspectRatio:video.videoWidth&&video.videoHeight?video.videoWidth/video.videoHeight:null,
          orientation:video.videoHeight>=video.videoWidth?'portrait':'landscape'};
        URL.revokeObjectURL(url); resolve(data);
      };
      video.onerror=()=>{try{URL.revokeObjectURL(url);}catch(e){} reject(new Error('Could not read video metadata.'));};
      video.src=url;
    }catch(err){try{if(url)URL.revokeObjectURL(url);}catch(e){} reject(err);}
  });
}
function buildMediaAnalysis(metadata,targetSeconds){
  const d=Math.max(0,Number(metadata&&metadata.duration||0));
  const target=Math.min(Math.max(1,Number(targetSeconds||15)),d||Number(targetSeconds||15));
  return {
    sourceDurationSeconds:+d.toFixed(2),targetDurationSeconds:+target.toFixed(2),
    orientation:metadata&&metadata.orientation||'unknown',
    canKeepOriginalFraming:!!metadata && metadata.height>=metadata.width,
    selectionPolicy:'Preserve original and derive edits from the source; never overwrite the source.',
    recommendedRange:d>target?{start:0,end:+target.toFixed(2)}:{start:0,end:+d.toFixed(2)},
    needsSceneAnalysis:true,
    notes:d>target?['Source is longer than target; scene-level scoring will choose the strongest segments.']:['Source fits target duration; cleanup can focus on dead space and overlays.']
  };
}
function createSession(file,plan){
  const source=inspectFile(file);
  return loadMetadata(file).then(metadata=>({
    id:'oneclick-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
    status:'MEDIA_READY',createdAt:new Date().toISOString(),source:Object.assign({},source,{metadata}),
    plan:plan||null,analysis:buildMediaAnalysis(metadata,plan&&plan.durationSeconds),
    outputs:{editedBlob:null,editedUrl:null,activeVersion:'original'},
    rollback:{originalPreserved:true,canRestoreOriginal:true}
  }));
}
function releaseUrl(url){if(url) try{URL.revokeObjectURL(url);}catch(e){}}
window.DoneRiteOneClickMediaStage={version:VERSION,inspectFile,loadMetadata,buildMediaAnalysis,createSession,releaseUrl};
})();