/* DONE RITE Creator OS Next — Media Vault UI helper v1.0 */
(function(){
'use strict';
function render(root){
  if(!root||!window.DoneRiteMediaVault)return;
  const state=DoneRiteMediaVault.getState(), q=DoneRiteMediaVault.reviewQueue();
  root.innerHTML='';
  const h=document.createElement('h3');h.textContent='Media Cleanup Queue';root.appendChild(h);
  const p=document.createElement('p');p.textContent=`${state.items.length} indexed · ${q.filter(x=>x.cleanupStatus==='Safe to Delete').length} safe-to-delete · ${q.filter(x=>x.cleanupStatus==='Review').length} review`;root.appendChild(p);
  q.forEach(item=>{const row=document.createElement('div');row.style.cssText='padding:10px;margin:8px 0;border:1px solid #2a3442;border-radius:10px;background:#171c25;color:#eef3f8';const t=document.createElement('div');t.textContent=`${item.cleanupStatus}: ${item.name}`;row.appendChild(t);const b=document.createElement('button');b.textContent='Remove From Vault';b.onclick=()=>{DoneRiteMediaVault.removeIndex(item.id);render(root);};row.appendChild(b);root.appendChild(row);});
}
window.DoneRiteMediaVaultUI={version:'1.0',render};
})();