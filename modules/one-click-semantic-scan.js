/* DONE RITE Creator OS — One-Click Semantic Scan v0.1
   Extracts real video frames and prepares them for secure vision scoring.
   IMPORTANT: this browser module never stores or exposes an AI API key.
*/
(function(){
'use strict';
const VERSION='0.1';
const ENDPOINT_KEY='done-rite-semantic-scan-endpoint:v1';

function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function waitEvent(target,name,timeout){
  return new Promise((resolve,reject)=>{
    let timer=null;
    const done=()=>{cleanup();resolve();};
    const fail=()=>{cleanup();reject(new Error('Video '+name+' failed.'));};
    function cleanup(){target.removeEventListener(name,done);target.removeEventListener('error',fail);if(timer)clearTimeout(timer);}
    target.addEventListener(name,done,{once:true});target.addEventListener('error',fail,{once:true});
    timer=setTimeout(()=>{cleanup();reject(new Error('Timed out waiting for '+name+'.'));},timeout||12000);
  });
}
function configuredEndpoint(){
  if(typeof window!=='undefined'&&window.DONE_RITE_SEMANTIC_SCAN_ENDPOINT)return String(window.DONE_RITE_SEMANTIC_SCAN_ENDPOINT);
  try{return localStorage.getItem(ENDPOINT_KEY)||'';}catch(e){return'';}
}
function setEndpoint(url){
  const value=String(url||'').trim();
  try{if(value)localStorage.setItem(ENDPOINT_KEY,value);else localStorage.removeItem(ENDPOINT_KEY);}catch(e){}
  return value;
}
async function seek(video,time){
  const target=Math.max(0,Math.min(Number(time||0),Math.max(0,(video.duration||0)-.03)));
  if(Math.abs(video.currentTime-target)<.04)return;
  video.currentTime=target;
  try{await waitEvent(video,'seeked',12000);}catch(err){
    if(video.readyState<2)throw err;
  }
}
function sampleTimes(duration,maxFrames){
  const d=Math.max(0,Number(duration||0)),count=Math.max(4,Math.min(Number(maxFrames||18),d>180?24:d>90?20:18));
  if(!d)return[];
  const times=[];
  for(let i=0;i<count;i++)times.push(clamp((d*(i+.5))/count,.05,Math.max(.05,d-.05)));
  return times;
}
async function extractFrames(file,options){
  options=options||{};
  if(!file)throw new Error('Missing video file.');
  const url=URL.createObjectURL(file),video=document.createElement('video');
  video.src=url;video.preload='auto';video.muted=true;video.playsInline=true;
  try{
    video.load();
    if(video.readyState<1)await waitEvent(video,'loadedmetadata',16000);
    const duration=Number(video.duration||0),times=sampleTimes(duration,options.maxFrames||18);
    const targetWidth=Math.max(180,Math.min(480,Number(options.width||320)));
    const ratio=(video.videoHeight||1920)/(video.videoWidth||1080),canvas=document.createElement('canvas');
    canvas.width=targetWidth;canvas.height=Math.max(180,Math.min(720,Math.round(targetWidth*ratio)));
    const ctx=canvas.getContext('2d',{alpha:false});
    const frames=[];
    for(let i=0;i<times.length;i++){
      try{
        await seek(video,times[i]);
        if(video.readyState<2){try{await video.play();await sleep(90);}catch(e){}video.pause();}
        ctx.drawImage(video,0,0,canvas.width,canvas.height);
        frames.push({index:i,time:+times[i].toFixed(2),image:canvas.toDataURL('image/jpeg',Number(options.quality||.72))});
      }catch(e){
        frames.push({index:i,time:+times[i].toFixed(2),skipped:true,error:e.message});
      }
    }
    return {fileName:file.name||'video',durationSeconds:+duration.toFixed(2),width:video.videoWidth||0,height:video.videoHeight||0,frames:frames.filter(f=>!f.skipped),skipped:frames.filter(f=>f.skipped)};
  }finally{try{video.pause();video.removeAttribute('src');video.load();}catch(e){}try{URL.revokeObjectURL(url);}catch(e){}}
}
function buildRequest(frameSet,context){
  context=context||{};
  return {
    schema:'done-rite-semantic-scan/v1',
    productName:String(context.productName||''),
    verifiedFeature:String(context.verifiedFeature||''),
    intent:String(context.intent||'Find the strongest moments that clearly show the named product and requested feature/action for a short shoppable video.'),
    source:{fileName:frameSet.fileName,durationSeconds:frameSet.durationSeconds,width:frameSet.width,height:frameSet.height},
    frames:frameSet.frames.map(f=>({index:f.index,time:f.time,image:f.image})),
    responseFormat:{matches:[{frameIndex:0,time:0,semanticScore:0,productVisible:false,featureVisible:false,actionVisible:false,reason:''}]}
  };
}
function normalizeResponse(data){
  const rows=Array.isArray(data&&data.matches)?data.matches:[];
  return rows.map(r=>({
    frameIndex:Number(r.frameIndex||0),time:Number(r.time||0),semanticScore:clamp(Number(r.semanticScore||0),0,1),
    productVisible:!!r.productVisible,featureVisible:!!r.featureVisible,actionVisible:!!r.actionVisible,reason:String(r.reason||'').slice(0,180)
  })).sort((a,b)=>b.semanticScore-a.semanticScore);
}
async function scanFile(file,context,options){
  options=options||{};
  const frames=await extractFrames(file,options),payload=buildRequest(frames,context),endpoint=String(options.endpoint||configuredEndpoint()||'').trim();
  if(!endpoint)return {status:'SEMANTIC_ENDPOINT_REQUIRED',version:VERSION,frames,payload,matches:[]};
  const res=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  if(!res.ok)throw new Error('Semantic scan endpoint returned '+res.status+'.');
  const data=await res.json();
  return {status:'SEMANTIC_SCAN_COMPLETE',version:VERSION,frames,payload:null,matches:normalizeResponse(data)};
}
function attachSemanticScores(candidates,matches){
  const rows=Array.isArray(matches)?matches:[];
  return (Array.isArray(candidates)?candidates:[]).map(c=>{
    const mid=(Number(c.start||0)+Number(c.end||0))/2;
    let best=null,bestDistance=Infinity;
    for(const m of rows){const d=Math.abs(Number(m.time||0)-mid);if(d<bestDistance){best=m;bestDistance=d;}}
    const semantic=best&&bestDistance<=Math.max(3,(Number(c.end||0)-Number(c.start||0))*1.5)?Number(best.semanticScore||0):0;
    const features=Object.assign({},c.features||{}, {semanticMatch:clamp(semantic,0,1)});
    return Object.assign({},c,{features,semanticReason:best&&semantic?best.reason||'':null});
  });
}

window.DoneRiteSemanticScan={version:VERSION,configuredEndpoint,setEndpoint,sampleTimes,extractFrames,buildRequest,normalizeResponse,scanFile,attachSemanticScores};
})();