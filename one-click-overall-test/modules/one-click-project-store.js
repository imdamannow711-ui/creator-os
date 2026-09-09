/* DONE RITE Creator OS — One-Click Project Store v0.1
   Canonical project clips, saved video versions, and project-linked voiceovers.
   Uses an isolated IndexedDB database and never changes existing Creator OS data.
*/
(function(){
'use strict';
const VERSION='0.1';
const DB_NAME='done-rite-one-click-projects:v1';
const DB_VERSION=1;
const CURRENT_KEY='done-rite-one-click-current-project:v1';
const MAX_CLIPS=20;
const stores=['projects','clips','voiceovers','versions'];
let dbPromise=null,readyPromise=null,project=null,projectClips=[],listeners=[];

function uid(prefix){
  try{if(crypto&&typeof crypto.randomUUID==='function')return prefix+'-'+crypto.randomUUID();}catch(e){}
  return prefix+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,10);
}
function fileKey(file){return [file&&file.name||'',file&&file.size||0,file&&file.lastModified||0].join('|');}
function clipId(projectId,key){return projectId+':clip:'+key;}
function currentProjectId(){
  let id='';try{id=localStorage.getItem(CURRENT_KEY)||'';}catch(e){}
  if(!id){id=uid('project');try{localStorage.setItem(CURRENT_KEY,id);}catch(e){}}
  return id;
}
function openDb(){
  if(dbPromise)return dbPromise;
  dbPromise=new Promise((resolve,reject)=>{
    if(typeof indexedDB==='undefined'){reject(new Error('Saved media storage is unavailable.'));return;}
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{stores.forEach(name=>{if(!req.result.objectStoreNames.contains(name))req.result.createObjectStore(name,{keyPath:'id'});});};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||new Error('Saved media storage could not open.'));
  });
  return dbPromise;
}
async function get(storeName,id){const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(storeName,'readonly').objectStore(storeName).get(id);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);});}
async function getAll(storeName){const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(storeName,'readonly').objectStore(storeName).getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);});}
async function put(storeName,value){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(storeName,'readwrite');tx.objectStore(storeName).put(value);tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error||new Error('Could not save '+storeName+'.'));tx.onabort=()=>reject(tx.error||new Error('Could not save '+storeName+'.'));});}
async function putMany(storeName,values){if(!values.length)return;const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(storeName,'readwrite'),store=tx.objectStore(storeName);values.forEach(value=>store.put(value));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||new Error('Could not save '+storeName+'.'));tx.onabort=()=>reject(tx.error||new Error('Could not save '+storeName+'.'));});}
function asFile(row){
  const blob=row&&row.blob;if(!blob)return null;
  try{return new File([blob],row.name||'raw-video',{type:row.type||blob.type||'video/mp4',lastModified:Number(row.lastModified||Date.now())});}
  catch(e){blob.name=row.name||'raw-video';blob.lastModified=Number(row.lastModified||Date.now());return blob;}
}
function mergeFiles(existing,picked,max){
  const out=Array.from(existing||[]),seen=new Set(out.map(fileKey));let duplicates=0,overflow=0,added=0;
  Array.from(picked||[]).forEach(file=>{const key=fileKey(file);if(seen.has(key)){duplicates++;return;}if(out.length>=Number(max||MAX_CLIPS)){overflow++;return;}seen.add(key);out.push(file);added++;});
  return {files:out,added,duplicates,overflow};
}
function removeFromList(existing,key){return Array.from(existing||[]).filter(file=>fileKey(file)!==key);}
function emit(reason,detail){
  const payload=Object.assign({reason,project,files:getFiles()},detail||{});
  listeners.slice().forEach(fn=>{try{fn(payload);}catch(e){}});
  try{window.dispatchEvent(new CustomEvent('done-rite-one-click-clips',{detail:payload}));}catch(e){}
}
function subscribe(fn){if(typeof fn!=='function')return()=>{};listeners.push(fn);return()=>{listeners=listeners.filter(x=>x!==fn);};}
function getFiles(){return projectClips.slice();}
function getProject(){return project?Object.assign({},project):null;}
async function saveProject(patch){project=Object.assign({},project||{id:currentProjectId(),createdAt:new Date().toISOString(),clipKeys:[]},patch||{},{updatedAt:new Date().toISOString(),version:VERSION});await put('projects',project);return getProject();}
async function init(){
  const id=currentProjectId();project=await get('projects',id)||{id,createdAt:new Date().toISOString(),clipKeys:[],version:VERSION};
  const rows=await getAll('clips'),byId=new Map(rows.map(row=>[row.id,row]));
  projectClips=(project.clipKeys||[]).map(key=>asFile(byId.get(clipId(id,key)))).filter(Boolean);
  await saveProject({clipKeys:projectClips.map(fileKey),mediaSaved:true});emit('restore',{restored:true});return {project:getProject(),files:getFiles()};
}
function ready(){if(!readyPromise)readyPromise=init().catch(err=>{emit('storage-error',{error:err});throw err;});return readyPromise;}
async function addFiles(picked){
  await ready();const merged=mergeFiles(projectClips,picked,MAX_CLIPS);projectClips=merged.files;
  const rows=projectClips.map((file,order)=>({id:clipId(project.id,fileKey(file)),projectId:project.id,key:fileKey(file),name:file.name||'raw-video',type:file.type||'video/mp4',size:Number(file.size||0),lastModified:Number(file.lastModified||0),order,blob:file,updatedAt:new Date().toISOString()}));
  await putMany('clips',rows);await saveProject({clipKeys:projectClips.map(fileKey),mediaSaved:true});emit('add',merged);return merged;
}
async function removeFile(key){
  await ready();const before=projectClips.length;projectClips=removeFromList(projectClips,key);
  if(projectClips.length===before)return false;
  await saveProject({clipKeys:projectClips.map(fileKey),mediaSaved:true});emit('remove',{removedKey:key});return true;
}
async function updateProject(patch){await ready();const saved=await saveProject(patch);emit('project-update');return saved;}
async function saveVoiceover(blob,meta){
  await ready();if(!blob)throw new Error('Missing voiceover audio.');meta=meta||{};
  const row={id:uid('voiceover'),projectId:project.id,videoVersionId:meta.videoVersionId||null,videoVersionIds:meta.videoVersionId?[meta.videoVersionId]:[],name:meta.name||blob.name||'done-rite-voiceover',label:meta.label||meta.name||'Voiceover',kind:meta.kind||'original',derivedFrom:meta.derivedFrom||null,preset:meta.preset||null,mimeType:blob.type||meta.mimeType||'audio/mp4',size:Number(blob.size||0),blob,createdAt:new Date().toISOString()};
  await put('voiceovers',row);await saveProject({activeVoiceoverId:row.id,lastVoiceoverFile:row.name,mediaSaved:true});emit('voiceover',{voiceover:row});return row;
}
async function getVoiceover(id){return id?get('voiceovers',id):null;}
async function getActiveVoiceover(){await ready();return project.activeVoiceoverId?getVoiceover(project.activeVoiceoverId):null;}
async function setActiveVoiceover(id){await ready();const row=await getVoiceover(id);if(!row)throw new Error('Saved voiceover was not found.');await saveProject({activeVoiceoverId:id,lastVoiceoverFile:row.name});emit('voiceover',{voiceover:row});return row;}
async function saveVersion(snapshot){
  await ready();snapshot=snapshot||{};const all=(await getAll('versions')).filter(row=>row.projectId===project.id);const number=all.reduce((n,row)=>Math.max(n,Number(row.versionNumber||0)),0)+1,id=uid('video-version');
  const row=Object.assign({},snapshot,{id,projectId:project.id,versionNumber:number,label:'Video V'+number,clipKeys:projectClips.map(fileKey),voiceoverId:project.activeVoiceoverId||null,productName:snapshot.productName||project.productName||'',productListing:snapshot.productListing||project.productListing||'',createdAt:new Date().toISOString()});
  await put('versions',row);
  if(row.voiceoverId){const voice=await getVoiceover(row.voiceoverId);if(voice){const ids=Array.from(new Set([...(voice.videoVersionIds||[]),id]));await put('voiceovers',Object.assign({},voice,{videoVersionId:voice.videoVersionId||id,videoVersionIds:ids}));}}
  await saveProject({activeVersionId:id});emit('version-save',{videoVersion:row});return row;
}
async function listVersions(){await ready();return (await getAll('versions')).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));}
async function loadVersion(id){
  await ready();const row=await get('versions',id);if(!row)throw new Error('Saved video version was not found.');
  if(row.projectId!==project.id){project=await get('projects',row.projectId)||{id:row.projectId,createdAt:row.createdAt||new Date().toISOString(),clipKeys:[]};try{localStorage.setItem(CURRENT_KEY,row.projectId);}catch(e){}}
  const clips=await getAll('clips'),byId=new Map(clips.map(item=>[item.id,item]));projectClips=(row.clipKeys||[]).map(key=>asFile(byId.get(clipId(row.projectId,key)))).filter(Boolean);
  await saveProject({activeVersionId:row.id,activeVoiceoverId:row.voiceoverId||null,clipKeys:row.clipKeys||[],productName:row.productName||'',productListing:row.productListing||'',feature:row.feature||'',mode:row.mode||'AUTO_SELL',duration:String(row.duration||15),mediaSaved:true});
  emit('version-load',{videoVersion:row});return row;
}
async function startFresh(){
  const id=uid('project');try{localStorage.setItem(CURRENT_KEY,id);}catch(e){}
  project={id,createdAt:new Date().toISOString(),clipKeys:[],version:VERSION,mediaSaved:true};projectClips=[];await put('projects',project);emit('fresh');return getProject();
}

window.DoneRiteOneClickProjectStore={version:VERSION,dbName:DB_NAME,maxClips:MAX_CLIPS,ready,getProject,getFiles,fileKey,mergeFiles,removeFromList,subscribe,addFiles,removeFile,updateProject,saveVoiceover,getVoiceover,getActiveVoiceover,setActiveVoiceover,saveVersion,listVersions,loadVersion,startFresh};
ready().catch(()=>{});
})();
