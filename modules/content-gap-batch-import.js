/* DONE RITE Creator OS — Content Gap Batch Import v1.0
   Lets the user select multiple screenshots/photos at once.
   Images are processed in memory and discarded; only detected phrase text is retained.
*/
(function(){
'use strict';
const STORE='done-rite-content-gap-batch:v1';
let libPromise=null;
function loadOCR(){
  if(window.Tesseract) return Promise.resolve(window.Tesseract);
  if(libPromise) return libPromise;
  libPromise=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.min.js';
    s.async=true;
    s.onload=()=>window.Tesseract?resolve(window.Tesseract):reject(new Error('Screenshot reader did not start.'));
    s.onerror=()=>reject(new Error('Screenshot reader could not load. Check your internet connection.'));
    document.head.appendChild(s);
  });
  return libPromise;
}
function cleanLine(v){return String(v||'').replace(/\s+/g,' ').trim();}
function phrasesFromText(text){
  const reject=/^(content gap|creator search insights|search|views?|posts?|likes?|filters?|high % gap|recommended|trending|related searches?)$/i;
  const noise=/^[\d\W_]+$/;
  const seen=new Set();
  return String(text||'').split(/\r?\n/).map(cleanLine).filter(x=>x.length>=3&&x.length<=120&&!reject.test(x)&&!noise.test(x)).filter(x=>{
    const k=x.toLowerCase(); if(seen.has(k)) return false; seen.add(k); return true;
  });
}
function load(){try{return JSON.parse(localStorage.getItem(STORE)||'{"phrases":[]}');}catch(e){return{phrases:[]};}}
function savePhrases(rows){
  const s=load(), seen=new Set((s.phrases||[]).map(x=>String(x.phrase||'').toLowerCase()));
  const additions=[];
  (rows||[]).forEach(r=>{const phrase=cleanLine(r.phrase);const k=phrase.toLowerCase();if(!phrase||seen.has(k))return;seen.add(k);additions.push({phrase,source:'screenshot batch import',createdAt:new Date().toISOString()});});
  s.phrases=[...additions,...(s.phrases||[])];localStorage.setItem(STORE,JSON.stringify(s));return additions;
}
async function processFiles(fileList,onProgress){
  const files=Array.from(fileList||[]).filter(f=>String(f.type||'').startsWith('image/'));
  if(!files.length) throw new Error('Choose one or more screenshots or photos.');
  const T=await loadOCR(); const all=[];
  for(let i=0;i<files.length;i++){
    const file=files[i]; let worker=null;
    try{
      if(onProgress)onProgress({file,index:i,total:files.length,status:'starting',progress:i/files.length});
      worker=await T.createWorker('eng',1,{logger:m=>{if(m.status==='recognizing text'&&onProgress){const p=Number(m.progress||0);onProgress({file,index:i,total:files.length,status:'reading',progress:(i+p)/files.length,fileProgress:p});}}});
      const result=await worker.recognize(file);
      phrasesFromText(result&&result.data&&result.data.text).forEach(phrase=>all.push({phrase,fileName:file.name||`Screenshot ${i+1}`}));
    }finally{if(worker){try{await worker.terminate();}catch(e){}}}
  }
  const unique=[],seen=new Set();all.forEach(x=>{const k=x.phrase.toLowerCase();if(!seen.has(k)){seen.add(k);unique.push(x);}});
  const saved=savePhrases(unique);
  if(onProgress)onProgress({index:files.length,total:files.length,status:'done',progress:1});
  return{filesProcessed:files.length,detected:unique.length,saved:saved.length,phrases:unique};
}
window.DoneRiteContentGapBatch={version:'1.0',processFiles,phrasesFromText,getState:load};
})();