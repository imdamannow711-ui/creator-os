/* DONE RITE Creator OS — One-Click Media Stage v0.3
   Browser-local media inspection helpers. Originals are never overwritten.
*/
(function(){
'use strict';
const VERSION='0.3';
function inspectFile(file){
  if(!file) throw new Error('No media file selected.');
  const type=String(file.type||'');
  if(!type.startsWith('video/')) throw new Error('One-Click Ad currently requires video files.');
  return {name:file.name||'raw-video',type,size:file.size||0,lastModified:file.lastModified||0,isVideo:true,originalFile:file,originalUrl:null,workingUrl:null,metadata:null};
}
function loadMetadata(file){
  return new Promise((resolve,reject)=>{
    let url='';
    try{
      url=URL.createObjectURL(file);
      const video=document.createElement('video');
      video.preload='metadata';video.muted=true;video.playsInline=true;
      video.onloadedmetadata=()=>{const data={duration:video.duration||0,width:video.videoWidth||0,height:video.videoHeight||0,aspectRatio:video.videoWidth&&video.videoHeight?video.videoWidth/video.videoHeight:null,orientation:video.videoHeight>=video.videoWidth?'portrait':'landscape'};URL.revokeObjectURL(url);resolve(data);};
      video.onerror=()=>{try{URL.revokeObjectURL(url);}catch(e){}reject(new Error('Could not read video metadata.'));};
      video.src=url;
    }catch(err){try{if(url)URL.revokeObjectURL(url);}catch(e){}reject(err);}
  });
}
function buildMediaAnalysis(metadata,targetSeconds){
  const d=Math.max(0,Number(metadata&&metadata.duration||0));
  const target=Math.min(Math.max(1,Number(targetSeconds||15)),d||Number(targetSeconds||15));
  return {sourceDurationSeconds:+d.toFixed(2),targetDurationSeconds:+target.toFixed(2),orientation:metadata&&metadata.orientation||'unknown',canKeepOriginalFraming:!!metadata&&metadata.height>=metadata.width,selectionPolicy:'Preserve original and derive edits from the source; never overwrite the source.',recommendedRange:d>target?{start:0,end:+target.toFixed(2)}:{start:0,end:+d.toFixed(2)},needsSceneAnalysis:true,notes:d>target?['Source is longer than target; scene-level scoring will choose segments.']:['Source fits target duration; cleanup can focus on dead space and overlays.']};
}
async function createSession(file,plan){
  const source=inspectFile(file),metadata=await loadMetadata(file);
  return {id:'oneclick-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),status:'MEDIA_READY',createdAt:new Date().toISOString(),source:Object.assign({},source,{metadata}),sources:[Object.assign({},source,{metadata,sourceIndex:0})],plan:plan||null,analysis:buildMediaAnalysis(metadata,plan&&plan.durationSeconds),outputs:{editedBlob:null,editedUrl:null,activeVersion:'original'},rollback:{originalPreserved:true,canRestoreOriginal:true}};
}
async function createMultiSession(files,plan){
  const list=Array.from(files||[]);
  if(!list.length)throw new Error('Choose at least one video.');
  if(list.length>20)throw new Error('Choose 20 clips or fewer for one ad project.');
  const sources=[];
  for(let i=0;i<list.length;i++){
    const inspected=inspectFile(list[i]);
    const metadata=await loadMetadata(list[i]);
    sources.push(Object.assign({},inspected,{metadata,sourceIndex:i}));
  }
  const total=sources.reduce((n,s)=>n+Number(s.metadata.duration||0),0);
  return {id:'oneclick-batch-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),status:'MULTI_MEDIA_READY',createdAt:new Date().toISOString(),source:sources[0],sources,plan:plan||null,analysis:{sourceCount:sources.length,totalSourceDurationSeconds:+total.toFixed(2),targetDurationSeconds:Number(plan&&plan.durationSeconds||15),selectionPolicy:'Treat all selected clips as one ad project while preserving every original source.',needsSceneAnalysis:true},outputs:{editedBlob:null,editedUrl:null,activeVersion:'originals'},rollback:{originalPreserved:true,canRestoreOriginal:true,sourceCount:sources.length}};
}
function releaseUrl(url){if(url)try{URL.revokeObjectURL(url);}catch(e){}}
function installMultiClipPreviewUI(){
  if(typeof document==='undefined')return;
  const boot=()=>{
    const input=document.getElementById('video'),preview=document.getElementById('preview'),fileList=document.getElementById('fileList'),media=document.getElementById('media');
    if(!input||!preview||!fileList||input.dataset.doneRiteClipPreview==='1')return;
    input.dataset.doneRiteClipPreview='1';
    let reviewUrl='';
    function clearReviewUrl(){if(reviewUrl){releaseUrl(reviewUrl);reviewUrl='';}}
    input.addEventListener('change',()=>{
      clearReviewUrl();
      setTimeout(()=>{
        const clips=Array.from(input.files||[]);if(!clips.length||clips.length>20)return;
        fileList.innerHTML='';fileList.style.display='block';
        clips.forEach((file,index)=>{
          const row=document.createElement('div');row.style.padding='10px 0';row.style.borderBottom=index===clips.length-1?'0':'1px solid #222b36';
          const name=document.createElement('div');name.textContent=(index+1)+'. '+file.name;name.style.fontWeight='800';name.style.marginBottom='7px';
          const button=document.createElement('button');button.type='button';button.textContent='PLAY CLIP '+(index+1);button.dataset.clipIndex=String(index);button.style.width='100%';button.style.minHeight='44px';button.style.borderRadius='11px';button.style.border='1px solid #58a6ff';button.style.background='#171c25';button.style.color='#58a6ff';button.style.fontWeight='900';button.style.fontSize='15px';
          button.addEventListener('click',()=>{
            clearReviewUrl();reviewUrl=URL.createObjectURL(file);preview.pause();preview.src=reviewUrl;preview.load();preview.style.display='block';
            if(media)media.textContent='Previewing clip '+(index+1)+' of '+clips.length+' — '+file.name;
            fileList.querySelectorAll('button[data-clip-index]').forEach(b=>{b.textContent='PLAY CLIP '+(Number(b.dataset.clipIndex)+1);b.style.background='#171c25';b.style.color='#58a6ff';});
            button.textContent='NOW PLAYING CLIP '+(index+1);button.style.background='#1e7bff';button.style.color='#fff';
            const p=preview.play();if(p&&typeof p.catch==='function')p.catch(()=>{});
          });
          row.appendChild(name);row.appendChild(button);fileList.appendChild(row);
        });
        if(media)media.textContent=(clips.length===1?'1 raw clip selected. Tap PLAY CLIP 1 to review it.':clips.length+' raw clips selected. Tap each PLAY CLIP button to review every take before editing.');
      },0);
    });
    window.addEventListener('pagehide',clearReviewUrl);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
}
installMultiClipPreviewUI();
window.DoneRiteOneClickMediaStage={version:VERSION,inspectFile,loadMetadata,buildMediaAnalysis,createSession,createMultiSession,releaseUrl,installMultiClipPreviewUI};
})();