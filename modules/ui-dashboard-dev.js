/* DONE RITE Creator OS Next — staged dashboard UI v1.0
   Development branch only. Renders into #done-rite-next-dev when present.
*/
(function(){
'use strict';
function el(tag,attrs,children){const n=document.createElement(tag);Object.entries(attrs||{}).forEach(([k,v])=>{if(k==='class')n.className=v;else if(k==='html')n.innerHTML=v;else if(k.startsWith('on')&&typeof v==='function')n.addEventListener(k.slice(2).toLowerCase(),v);else n.setAttribute(k,v);});(children||[]).forEach(c=>n.appendChild(typeof c==='string'?document.createTextNode(c):c));return n;}
function section(title,body){return el('section',{class:'drn-card'},[el('h2',{},[title]),body]);}
function render(root){
  root.innerHTML='';
  const css=el('style',{html:`.drn{font-family:system-ui;background:#05070d;color:#eef3f8;min-height:100vh;padding:18px}.drn h1{color:#58a6ff}.drn-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px}.drn-card{background:#11151c;border:1px solid #2a3442;border-radius:16px;padding:14px}.drn-card h2{font-size:17px;margin:0 0 8px}.drn-muted{color:#8793a1;font-size:13px}.drn-metric{font-size:26px;font-weight:900;color:#2bd97c}.drn-btn{width:100%;min-height:44px;border:1px solid #2a3442;border-radius:10px;background:#1e7bff;color:white;font-weight:800;margin-top:8px}.drn-input{width:100%;padding:11px;border-radius:10px;border:1px solid #2a3442;background:#171c25;color:white;margin-top:8px;box-sizing:border-box}.drn-list{display:grid;gap:8px;margin-top:10px}.drn-row{padding:9px;border:1px solid #2a3442;border-radius:10px;background:#171c25}`});
  document.head.appendChild(css);
  const app=el('div',{class:'drn'});
  app.appendChild(el('h1',{},['DONE RITE Creator OS Next']));
  app.appendChild(el('p',{class:'drn-muted'},['Development preview — live app is not changed.']));
  const grid=el('div',{class:'drn-grid'});

  const hq=window.DoneRiteDailyHQ?DoneRiteDailyHQ.build():null;
  grid.appendChild(section('Daily HQ',hq?el('div',{},[
    el('div',{class:'drn-metric'},[String((hq.youtube&&hq.youtube.plannedToday)||0)]),
    el('div',{class:'drn-muted'},['YouTube Shorts planned today']),
    el('div',{class:'drn-list'},(hq.nextActions||[]).map(x=>el('div',{class:'drn-row'},[x])))
  ]):el('p',{class:'drn-muted'},['Daily HQ engine not loaded.'])));

  const mediaSummary=window.DoneRiteMediaVault?DoneRiteMediaVault.summary():{total:0,safeToDelete:0,review:0};
  const mediaBody=el('div',{},[
    el('div',{class:'drn-metric'},[String(mediaSummary.total)]),
    el('div',{class:'drn-muted'},[`Indexed media · ${mediaSummary.safeToDelete} safe-to-delete · ${mediaSummary.review} review`])
  ]);
  const mediaInput=el('input',{type:'file',multiple:'multiple',accept:'image/*,video/*',class:'drn-input'});
  mediaInput.addEventListener('change',()=>{DoneRiteMediaVault.addFiles(mediaInput.files);render(root);});
  mediaBody.appendChild(mediaInput);
  mediaBody.appendChild(el('p',{class:'drn-muted'},['Original files stay in Apple Photos. Creator OS stores metadata only.']));
  grid.appendChild(section('Media Vault',mediaBody));

  const quickBody=el('div');
  const product=el('input',{class:'drn-input',placeholder:'Product name'});
  const feature=el('input',{class:'drn-input',placeholder:'One feature to demonstrate'});
  const quickOut=el('div',{class:'drn-list'});
  quickBody.appendChild(product);quickBody.appendChild(feature);
  quickBody.appendChild(el('button',{class:'drn-btn',onclick:()=>{if(!window.DoneRiteHandsOnlyQuickCreate)return;const p=DoneRiteHandsOnlyQuickCreate.create({product:product.value,feature:feature.value});quickOut.innerHTML='';quickOut.appendChild(el('div',{class:'drn-row'},[p.hook]));p.shotList.forEach(s=>quickOut.appendChild(el('div',{class:'drn-row'},[`${s.time} — ${s.shot}`])));}},['Build 7–10s Hands-Only Package']));
  quickBody.appendChild(quickOut);
  grid.appendChild(section('Hands-Only Quick Create',quickBody));

  const gapBody=el('div',{},[
    el('div',{class:'drn-metric'},['1,000+']),
    el('div',{class:'drn-muted'},['Priority Content Gap searches']),
    el('div',{class:'drn-row'},['750–999 = Watchlist']),
    el('div',{class:'drn-row'},['Below 750 = Ignore'])
  ]);
  grid.appendChild(section('Content Gap Demand',gapBody));

  const yt=window.DoneRiteYouTubeAmazon?DoneRiteYouTubeAmazon.getState():{products:[],queue:[]};
  const ytBody=el('div',{},[
    el('div',{class:'drn-metric'},[String(yt.products.length)]),
    el('div',{class:'drn-muted'},['Amazon products saved']),
    el('div',{class:'drn-row'},['Daily slots: Morning · Afternoon · Evening']),
    el('div',{class:'drn-row'},['Primary tracking ID: donerite02-20'])
  ]);
  grid.appendChild(section('YouTube + Amazon',ytBody));

  const perf=window.DoneRitePerformance?DoneRitePerformance.handsOnlyBaseline():null;
  grid.appendChild(section('Performance',perf?el('div',{},[
    el('div',{class:'drn-metric'},[String(Math.round(perf.avgViews))]),
    el('div',{class:'drn-muted'},[`Average hands-only views across ${perf.posts} posts`])
  ]):el('p',{class:'drn-muted'},['No hands-only analytics logged yet.'])));

  app.appendChild(grid);root.appendChild(app);
}
window.DoneRiteNextDashboard={version:'1.0',render};
})();