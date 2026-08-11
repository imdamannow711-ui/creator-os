/* DONE RITE Creator OS Next — Daily HQ UI helper v1.0 */
(function(){
'use strict';
function render(root){if(!root||!window.DoneRiteDailyHQ)return;const hq=DoneRiteDailyHQ.build();root.innerHTML='';const h=document.createElement('h3');h.textContent='Daily HQ';root.appendChild(h);(hq.nextActions||[]).forEach(x=>{const row=document.createElement('div');row.style.cssText='padding:10px;margin:8px 0;border:1px solid #2a3442;border-radius:10px;background:#171c25;color:#eef3f8';row.textContent=x;root.appendChild(row);});}
window.DoneRiteDailyHQUI={version:'1.0',render};
})();