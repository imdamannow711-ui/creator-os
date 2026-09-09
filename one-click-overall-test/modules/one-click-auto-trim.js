/* DONE RITE Creator OS — One-Click Auto Trim v0.1
   Independent left/right trim handles for a raw clip. Trimming only changes
   which portion of the clip is used later — it never re-encodes, speeds up,
   slows down, or otherwise alters the original file. Saved trims are keyed
   by file name+size+lastModified so picking the same clip again (including
   after a reload) restores the same trim automatically.
*/
(function(){
'use strict';
const VERSION='0.2';
const STORE_KEY='done-rite-autotrim-trims:v1';
const MIN_GAP=0.2;
let currentFile=null,currentKey='',currentDuration=0,previewTimer=null,previewUrl='',renderTrim=null;
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function fileKey(f){return f?f.name+'|'+f.size+'|'+f.lastModified:'';}
function fmt(sec){sec=Math.max(0,Number(sec||0));const m=Math.floor(sec/60),s=(sec-m*60).toFixed(1).padStart(4,'0');return m+':'+s;}
function readStore(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'{}')||{};}catch(e){return {};}}
function writeStore(store){try{localStorage.setItem(STORE_KEY,JSON.stringify(store));}catch(e){/* storage unavailable — trims just won't persist this session */}}
function getTrim(fileOrKey){const key=typeof fileOrKey==='string'?fileOrKey:fileKey(fileOrKey);if(!key)return null;const row=readStore()[key];return row?{inSec:row.inSec,outSec:row.outSec,duration:row.duration}:null;}
function saveTrim(fileOrKey,trim){const key=typeof fileOrKey==='string'?fileOrKey:fileKey(fileOrKey);if(!key)return;const store=readStore();store[key]=Object.assign({},trim,{savedAt:new Date().toISOString()});writeStore(store);}
function setRenderTrim(file,trim){renderTrim=file&&trim?{key:fileKey(file),name:file.name,inSec:trim.inSec,outSec:trim.outSec,duration:trim.duration}:null;return renderTrim;}
function getRenderTrim(){return renderTrim;}
function waitEvent(target,name,timeout){return new Promise((resolve,reject)=>{let timer;const done=()=>{clean();resolve();};const fail=()=>{clean();reject(new Error('Could not read this video.'));};function clean(){target.removeEventListener(name,done);target.removeEventListener('error',fail);if(timer)clearTimeout(timer);}target.addEventListener(name,done,{once:true});target.addEventListener('error',fail,{once:true});timer=setTimeout(()=>{clean();reject(new Error('Video metadata timed out.'));},timeout||15000);});}
function install(){
  if(document.getElementById('doneRiteAutoTrim'))return;
  const slot=document.getElementById('doneRiteAutoTrimSlot');
  if(!slot)return;
  const card=document.createElement('div');
  card.id='doneRiteAutoTrim';card.className='card';card.style.cssText='border-color:#2bd97c;background:#0b1a13';
  card.innerHTML='<h2>✂️ Independent Trim Handles</h2>'+
    '<p class="help">Choose one of the clips already saved in this project and set where it starts and ends. The trim is linked to that clip and is used by Render. The original file is never re-encoded or altered.</p>'+
    '<select id="atClip" class="select"><option value="">Upload project clips first</option></select>'+
    '<video id="atPreview" class="preview" controls playsinline></video>'+
    '<div id="atStatus" class="help" style="margin:8px 0">No clip selected.</div>'+
    '<div id="atHandles" style="display:none">'+
      '<label class="label">Trim start</label>'+
      '<input id="atStart" type="range" style="width:100%" min="0" max="0" step="0.1" value="0">'+
      '<div id="atStartVal" class="help">0:00.0</div>'+
      '<label class="label">Trim end</label>'+
      '<input id="atEnd" type="range" style="width:100%" min="0" max="0" step="0.1" value="0">'+
      '<div id="atEndVal" class="help">0:00.0</div>'+
      '<div class="row">'+
        '<div class="metric"><b>Kept</b><span id="atKept">—</span></div>'+
        '<div class="metric"><b>Removed</b><span id="atRemoved">—</span></div>'+
      '</div>'+
      '<button id="atPreviewBtn" class="button secondary">PREVIEW TRIMMED RANGE</button>'+
      '<button id="atKeepBtn" class="button good">KEEP THIS TRIM</button>'+
      '<div id="atKeepStatus" class="help" style="margin-top:8px;color:#72bdff">No trim attached to the next render yet.</div>'+
    '</div>';
  slot.appendChild(card);
  const clipSelect=card.querySelector('#atClip'),preview=card.querySelector('#atPreview'),status=card.querySelector('#atStatus'),
    handles=card.querySelector('#atHandles'),startRange=card.querySelector('#atStart'),endRange=card.querySelector('#atEnd'),
    startVal=card.querySelector('#atStartVal'),endVal=card.querySelector('#atEndVal'),kept=card.querySelector('#atKept'),
    removed=card.querySelector('#atRemoved'),previewBtn=card.querySelector('#atPreviewBtn'),keepBtn=card.querySelector('#atKeepBtn'),
    keepStatus=card.querySelector('#atKeepStatus');
  function refreshReadout(){
    let s=clamp(Number(startRange.value||0),0,currentDuration),e=clamp(Number(endRange.value||currentDuration),0,currentDuration);
    if(e-s<MIN_GAP){if(startRange===document.activeElement){e=clamp(s+MIN_GAP,0,currentDuration);endRange.value=e;}else{s=clamp(e-MIN_GAP,0,currentDuration);startRange.value=s;}}
    startVal.textContent=fmt(s);endVal.textContent=fmt(e);
    kept.textContent=fmt(Math.max(0,e-s));removed.textContent=fmt(Math.max(0,currentDuration-(e-s)));
    return {inSec:s,outSec:currentDuration-e,duration:currentDuration,rangeStart:s,rangeEnd:e};
  }
  function loadTrimIntoUI(trim){
    const rangeStart=clamp(trim.inSec||0,0,currentDuration),rangeEnd=clamp(currentDuration-(trim.outSec||0),0,currentDuration);
    startRange.value=rangeStart;endRange.value=rangeEnd;refreshReadout();
  }
  async function loadFile(f){
    if(previewTimer){clearInterval(previewTimer);previewTimer=null;}
    if(previewUrl){try{URL.revokeObjectURL(previewUrl);}catch(e){}previewUrl='';}
    if(!f){currentFile=null;currentKey='';currentDuration=0;handles.style.display='none';status.textContent='No project clip selected.';preview.style.display='none';return;}
    currentFile=f;currentKey=fileKey(f);
    status.textContent='Reading '+f.name+'…';
    previewUrl=URL.createObjectURL(f);preview.src=previewUrl;preview.style.display='block';
    try{
      if(preview.readyState<1)await waitEvent(preview,'loadedmetadata',20000);
      currentDuration=Number(preview.duration||0);
      if(!currentDuration||!isFinite(currentDuration)){status.textContent='Could not read this clip\u2019s length.';handles.style.display='none';return;}
      startRange.min='0';startRange.max=String(currentDuration);endRange.min='0';endRange.max=String(currentDuration);
      const executor=window.DoneRiteOneClickBrowserExecutor,manual=executor&&executor.getManualTrim(f,Number(clipSelect.value||0)),stored=getTrim(currentKey),saved=manual?{inSec:manual.start,outSec:currentDuration-manual.end,duration:manual.duration}:stored;
      if(saved&&Math.abs(Number(saved.duration)-currentDuration)<.05){
        loadTrimIntoUI(saved);
        status.textContent='Restored saved trim for '+f.name+' • '+fmt(currentDuration)+' total.';
      }else{
        startRange.value='0';endRange.value=String(currentDuration);refreshReadout();
        status.textContent=f.name+' loaded • '+fmt(currentDuration)+' total.';
      }
      handles.style.display='block';
      keepStatus.style.color='#72bdff';keepStatus.textContent='No trim attached to the next render yet.';
    }catch(err){status.textContent='Could not read this clip: '+err.message;handles.style.display='none';}
  }
  clipSelect.addEventListener('change',()=>{const store=window.DoneRiteOneClickProjectStore,files=store?store.getFiles():[];loadFile(files[Number(clipSelect.value)]||null);});
  function refreshProjectClips(){
    const store=window.DoneRiteOneClickProjectStore,files=store?store.getFiles():[],wanted=currentKey;clipSelect.innerHTML='';
    if(!files.length){const option=document.createElement('option');option.value='';option.textContent='Upload project clips first';clipSelect.appendChild(option);loadFile(null);return;}
    files.forEach((file,index)=>{const option=document.createElement('option');option.value=String(index);option.textContent=(index+1)+'. '+file.name;clipSelect.appendChild(option);});
    let index=files.findIndex(file=>fileKey(file)===wanted);if(index<0)index=0;clipSelect.value=String(index);loadFile(files[index]);
  }
  const projectStore=window.DoneRiteOneClickProjectStore;if(projectStore){projectStore.subscribe(refreshProjectClips);projectStore.ready().then(refreshProjectClips).catch(()=>{});}else refreshProjectClips();
  startRange.addEventListener('input',refreshReadout);
  endRange.addEventListener('input',refreshReadout);
  previewBtn.addEventListener('click',()=>{
    if(!currentDuration)return;
    const r=refreshReadout();
    if(previewTimer){clearInterval(previewTimer);previewTimer=null;}
    preview.currentTime=r.rangeStart;
    preview.play().catch(()=>{});
    previewTimer=setInterval(()=>{if(preview.currentTime>=r.rangeEnd-0.05||preview.paused){preview.pause();clearInterval(previewTimer);previewTimer=null;}},80);
  });
  keepBtn.addEventListener('click',()=>{
    if(!currentFile||!currentDuration)return;
    const r=refreshReadout(),trim={inSec:r.inSec,outSec:r.outSec,duration:currentDuration};
    saveTrim(currentKey,trim);setRenderTrim(currentFile,trim);
    const executor=window.DoneRiteOneClickBrowserExecutor;if(executor)executor.setManualTrim(currentFile,Number(clipSelect.value||0),r.rangeStart,r.rangeEnd,currentDuration);
    keepStatus.style.color='#56ec9c';
    keepStatus.textContent='Trim saved for '+currentFile.name+' • keeps '+fmt(r.rangeEnd-r.rangeStart)+' of '+fmt(currentDuration)+' • original file unchanged.';
  });
  window.addEventListener('pagehide',()=>{if(previewUrl)try{URL.revokeObjectURL(previewUrl);}catch(e){};});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else setTimeout(install,0);
window.DoneRiteOneClickAutoTrim={version:VERSION,install,getTrim,saveTrim,setRenderTrim,getRenderTrim,fileKey};
})();
