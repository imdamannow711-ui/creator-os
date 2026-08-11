/* DONE RITE Creator OS Next — YouTube Queue UI helper v1.0 */
(function(){
'use strict';
function render(root){if(!root||!window.DoneRiteYouTubeAmazon)return;root.innerHTML='';const state=DoneRiteYouTubeAmazon.getState();const title=document.createElement('h3');title.textContent='YouTube Shorts Queue';root.appendChild(title);['Morning','Afternoon','Evening'].forEach(slot=>{const row=document.createElement('div');row.style.cssText='padding:10px;margin:8px 0;border:1px solid #2a3442;border-radius:10px;background:#171c25;color:#eef3f8';const label=document.createElement('strong');label.textContent=slot;row.appendChild(label);const today=new Date().toISOString().slice(0,10);const item=(state.queue||[]).find(x=>x.date===today&&x.slot===slot);const p=document.createElement('div');p.textContent=item?`${item.productName||'Product'} · ${item.status}`:'Open slot';row.appendChild(p);root.appendChild(row);});}
window.DoneRiteYouTubeQueueUI={version:'1.0',render};
})();