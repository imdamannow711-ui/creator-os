/* DONE RITE Creator OS — Content Gap batch UI + mobile wrap v1.0 */
(function(){
'use strict';
function addWrapCSS(){if(document.getElementById('dr-gap-wrap-fix'))return;const s=document.createElement('style');s.id='dr-gap-wrap-fix';s.textContent=`
.dr-card,.row,.full,.edit,.muted,.section-title,.drn-card,.drn-row,.dr-output,.dr-item-title{min-width:0;max-width:100%;overflow-wrap:anywhere;word-break:break-word;white-space:normal}
.full,.dr-output{white-space:pre-wrap}
input,textarea,select,button{max-width:100%}
`;
document.head.appendChild(s);}
function makeUploader(card){if(!card||card.querySelector('[data-dr-gap-batch]')||!window.DoneRiteContentGapBatch)return;const box=document.createElement('div');box.dataset.drGapBatch='1';box.style.cssText='margin-top:14px;padding:12px;border:1px dashed #58a6ff;border-radius:12px;background:rgba(30,123,255,.08);max-width:100%;overflow:hidden';
const title=document.createElement('strong');title.textContent='Upload Multiple Content Gap Screenshots';
const help=document.createElement('div');help.textContent='Select several screenshots at once. Creator OS reads them one-by-one, combines the phrases, removes duplicates, then discards the images.';help.style.cssText='margin-top:6px;color:#8793a1;font-size:12px;line-height:1.45;overflow-wrap:anywhere';
const input=document.createElement('input');input.type='file';input.accept='image/*';input.multiple=true;input.style.cssText='display:block;width:100%;margin-top:10px;color:#eef3f8';
const status=document.createElement('div');status.style.cssText='margin-top:8px;color:#c4ccd6;font-size:12px;line-height:1.45;overflow-wrap:anywhere';
input.addEventListener('change',async()=>{const files=Array.from(input.files||[]);if(!files.length)return;status.textContent=`Preparing ${files.length} screenshot${files.length===1?'':'s'}…`;input.disabled=true;try{const result=await DoneRiteContentGapBatch.processFiles(files,p=>{if(p.status==='reading')status.textContent=`Reading ${p.index+1} of ${p.total}: ${Math.round((p.fileProgress||0)*100)}%`;else if(p.status==='starting')status.textContent=`Starting ${p.index+1} of ${p.total}…`;});status.textContent=`Done: ${result.filesProcessed} screenshot${result.filesProcessed===1?'':'s'} processed · ${result.detected} unique phrase${result.detected===1?'':'s'} found · ${result.saved} new saved.`;}catch(e){status.textContent=(e&&e.message)||'Batch import failed.';}finally{input.disabled=false;input.value='';}});
box.append(title,help,input,status);card.appendChild(box);}
function enhance(){addWrapCSS();const cards=[...document.querySelectorAll('.dr-card,.drn-card')];cards.forEach(card=>{const t=(card.textContent||'').toLowerCase();if(t.includes('content gap'))makeUploader(card);});}
function start(){enhance();const obs=new MutationObserver(()=>enhance());obs.observe(document.documentElement,{subtree:true,childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.DoneRiteContentGapBatchUI={version:'1.0',enhance};
})();