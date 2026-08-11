/* DONE RITE Creator OS Next — integrated staged dashboard v1.1 */
(function(){
'use strict';
function el(tag,attrs,children){const n=document.createElement(tag);Object.entries(attrs||{}).forEach(([k,v])=>{if(k==='class')n.className=v;else if(k==='html')n.innerHTML=v;else if(k.startsWith('on')&&typeof v==='function')n.addEventListener(k.slice(2).toLowerCase(),v);else if(v!==undefined&&v!==null)n.setAttribute(k,v);});(children||[]).forEach(c=>n.appendChild(typeof c==='string'?document.createTextNode(c):c));return n;}
function card(title,body){return el('section',{class:'drn-card'},[el('h2',{},[title]),body]);}
function play(kind){try{const A=window.AudioContext||window.webkitAudioContext;const c=new A(),o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=kind==='tab'?500:kind==='copy'?720:610;g.gain.setValueAtTime(.025,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.045);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.05);o.onended=()=>c.close();}catch(e){}}
function render(root){
  root.innerHTML='';
  if(!document.getElementById('drn-style')) document.head.appendChild(el('style',{id:'drn-style',html:`
  *{box-sizing:border-box}.drn{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#05070d;color:#eef3f8;min-height:100vh;padding:16px 16px 92px}.drn-head{position:sticky;top:0;z-index:10;background:rgba(5,7,13,.94);backdrop-filter:blur(12px);padding:8px 0 12px}.drn h1{margin:0;color:#58a6ff;font-size:22px}.drn-sub{color:#8793a1;font-size:12px;margin-top:4px}.drn-tabs{display:flex;gap:7px;overflow-x:auto;margin-top:12px}.drn-tab{flex:0 0 auto;min-height:42px;padding:9px 12px;border-radius:999px;border:1px solid #2a3442;background:#11151c;color:#c4ccd6;font-weight:800}.drn-tab.on{background:#1e7bff;color:white}.drn-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:12px}.drn-card{background:#11151c;border:1px solid #2a3442;border-radius:16px;padding:14px}.drn-card h2{font-size:17px;margin:0 0 9px}.drn-muted{color:#8793a1;font-size:13px;line-height:1.45}.drn-metric{font-size:27px;font-weight:900;color:#2bd97c}.drn-input,.drn-select,.drn-textarea{width:100%;padding:11px;border-radius:10px;border:1px solid #2a3442;background:#171c25;color:white;margin-top:8px;font:inherit}.drn-textarea{min-height:90px}.drn-btn,.drn-small{min-height:42px;border:1px solid #2a3442;border-radius:10px;background:#1e7bff;color:white;font-weight:800;margin-top:8px}.drn-btn{width:100%}.drn-small{padding:8px 10px;margin-right:6px;background:#171c25;color:#58a6ff}.drn-danger{color:#ff6673}.drn-list{display:grid;gap:8px;margin-top:10px}.drn-row{padding:10px;border:1px solid #2a3442;border-radius:10px;background:#171c25}.drn-pill{display:inline-block;padding:4px 8px;border-radius:999px;background:#0d2749;color:#8fc1ff;font-size:11px;font-weight:800;margin-right:5px}.drn-ok{color:#2bd97c}.drn-warn{color:#ffb020}.drn-columns{display:grid;grid-template-columns:1fr 1fr;gap:8px}@media(max-width:560px){.drn-columns{grid-template-columns:1fr}.drn{padding:12px 12px 86px}}` }));

  const app=el('div',{class:'drn'}),head=el('div',{class:'drn-head'});
  head.appendChild(el('h1',{},['DONE RITE Creator OS Next']));
  head.appendChild(el('div',{class:'drn-sub'},['Development build · live Creator OS remains protected']));
  const tabs=['HQ','Create Now','Media','YouTube + Amazon','Product Picks','Performance'];
  let active=sessionStorage.getItem('drn-active')||'HQ';
  const tabbar=el('div',{class:'drn-tabs'});head.appendChild(tabbar);app.appendChild(head);
  const content=el('div');app.appendChild(content);root.appendChild(app);
  document.addEventListener('click',e=>{if(e.target.closest('button'))play(e.target.classList.contains('drn-tab')?'tab':'tap');},{once:true,capture:true});

  function rerender(){render(root);}
  function renderTab(){
    content.innerHTML=''; tabbar.innerHTML='';
    tabs.forEach(t=>tabbar.appendChild(el('button',{class:'drn-tab'+(t===active?' on':''),onclick:()=>{active=t;sessionStorage.setItem('drn-active',t);play('tab');renderTab();}},[t])));
    if(active==='HQ'){
      const hq=DoneRiteDailyHQ.build(); const grid=el('div',{class:'drn-grid'});
      grid.appendChild(card('Daily HQ',el('div',{},[
        el('div',{class:'drn-metric'},[String((hq.youtube&&hq.youtube.plannedToday)||0)]),el('div',{class:'drn-muted'},['YouTube Shorts planned today']),
        el('div',{class:'drn-list'},hq.nextActions.map(x=>el('div',{class:'drn-row'},[x])))
      ])));
      const perf=DoneRitePerformance.handsOnlyBaseline();
      grid.appendChild(card('Hands-Only Baseline',perf?el('div',{},[
        el('div',{class:'drn-metric'},[String(Math.round(perf.avgViews))]),el('div',{class:'drn-muted'},[`Average views · ${perf.posts} logged post${perf.posts===1?'':'s'}`]),
        el('div',{class:'drn-row'},[`Avg watch time ${perf.avgWatchTime.toFixed(1)}s · Completion ${perf.avgCompletionRate.toFixed(2)}% · Shares ${perf.totalShares} · Saves ${perf.totalSaves}`])
      ]):el('p',{class:'drn-muted'},['No baseline yet.'])));
      const m=DoneRiteMediaVault.summary();grid.appendChild(card('Media Cleanup',el('div',{},[el('div',{class:'drn-metric'},[String(m.safeToDelete)]),el('div',{class:'drn-muted'},['Processed screenshots ready for deletion review']),el('div',{class:'drn-row'},[`${m.review} additional items need review`])])));
      content.appendChild(grid);
    }
    if(active==='Create Now'){
      const body=el('div');const p=el('input',{class:'drn-input',placeholder:'Product name'}),f=el('input',{class:'drn-input',placeholder:'One feature to demonstrate'}),h=el('input',{class:'drn-input',placeholder:'Optional hook'}),out=el('div',{class:'drn-list'});
      body.append(p,f,h,el('button',{class:'drn-btn',onclick:()=>{const pkg=DoneRiteHandsOnlyQuickCreate.create({product:p.value,feature:f.value,hook:h.value});out.innerHTML='';out.appendChild(el('div',{class:'drn-row'},[el('span',{class:'drn-pill'},['7–10s']),el('span',{class:'drn-pill'},['Hands Only']),el('div',{},[pkg.hook])]));pkg.shotList.forEach(s=>out.appendChild(el('div',{class:'drn-row'},[`${s.time} — ${s.shot}`])));const cp=DoneRiteCrossPlatform.pack({product:p.value,feature:f.value,hook:pkg.hook});Object.keys(cp).forEach(platform=>out.appendChild(el('div',{class:'drn-row'},[el('strong',{},[platform]),el('div',{class:'drn-muted'},[cp[platform].cta||''])])));}},['Build Hands-Only Package']),out);
      content.appendChild(card('Quick Create — Safe Mode',body));
      content.appendChild(card('Content Gap Rules',el('div',{},[el('div',{class:'drn-metric'},['1,000+']),el('div',{class:'drn-muted'},['Priority']),el('div',{class:'drn-row'},['750–999 = Watchlist']),el('div',{class:'drn-row'},['Below 750 = ignored by Quick Create'])])));
    }
    if(active==='Media'){
      const body=el('div'),input=el('input',{class:'drn-input',type:'file',multiple:'multiple',accept:'image/*,video/*'});body.append(input,el('p',{class:'drn-muted'},['Select media from your phone. Creator OS stores metadata only; originals stay in Apple Photos. Product photos/videos default to KEEP.']));input.onchange=()=>{DoneRiteMediaVault.addFiles(input.files);renderTab();};content.appendChild(card('Media Vault',body));const q=DoneRiteMediaVault.reviewQueue();content.appendChild(card('Cleanup Queue',el('div',{class:'drn-list'},q.length?q.map(item=>el('div',{class:'drn-row'},[el('strong',{},[item.cleanupStatus+' · '+item.name]),el('div',{class:'drn-muted'},[item.category]),el('button',{class:'drn-small',onclick:()=>{DoneRiteMediaVault.markProcessed(item.id);renderTab();}},['Processed']),el('button',{class:'drn-small',onclick:()=>{DoneRiteMediaVault.protect(item.id);renderTab();}},['Protect']),el('button',{class:'drn-small drn-danger',onclick:()=>{DoneRiteMediaVault.removeIndex(item.id);renderTab();}},['Remove from Vault'])])):[el('div',{class:'drn-muted'},['Nothing waiting for cleanup.'])])));
    }
    if(active==='YouTube + Amazon'){
      const state=DoneRiteYouTubeAmazon.getState();const body=el('div'),name=el('input',{class:'drn-input',placeholder:'Amazon product name'}),url=el('input',{class:'drn-input',placeholder:'Amazon Associates product link'}),status=el('div',{class:'drn-muted'});body.append(name,url,el('button',{class:'drn-btn',onclick:()=>{try{const prod=DoneRiteYouTubeAmazon.addProduct({name:name.value,affiliateUrl:url.value});DoneRiteProductPicks.add({name:prod.name,category:'Gadgets',affiliateUrl:prod.affiliateUrl});status.textContent='Saved to Amazon Product Library and Product Picks.';name.value='';url.value='';renderTab();}catch(e){status.textContent=e.message;}}},['Save Amazon Product']),status);content.appendChild(card('Amazon Associates',body));
      const q=el('div',{class:'drn-list'});['Morning','Afternoon','Evening'].forEach(slot=>{const item=state.queue.find(x=>x.date===new Date().toISOString().slice(0,10)&&x.slot===slot);const row=el('div',{class:'drn-row'},[el('strong',{},[slot]),el('div',{class:'drn-muted'},[item?`${item.productName||'Product'} · ${item.status}`:'Open slot'])]);if(!item&&state.products[0])row.appendChild(el('button',{class:'drn-small',onclick:()=>{DoneRiteYouTubeAmazon.queueShort({productId:state.products[0].id,productName:state.products[0].name,slot});renderTab();}},['Fill with latest product']));q.appendChild(row);});content.appendChild(card('YouTube Shorts Queue',q));content.appendChild(card('Amazon Setup',el('div',{},[el('div',{class:'drn-row'},['Primary tracking ID: donerite02-20']),el('div',{class:'drn-row'},['CTA: Product picks are linked on my channel profile.']),el('div',{class:'drn-row'},['Disclosure: As an Amazon Associate I earn from qualifying purchases.'])])));
    }
    if(active==='Product Picks'){
      const groups=DoneRiteProductPicks.grouped(),list=el('div',{class:'drn-list'});Object.keys(groups).forEach(cat=>{list.appendChild(el('div',{class:'drn-row'},[el('strong',{},[cat]),...groups[cat].map(x=>el('div',{class:'drn-muted'},[x.name]))]));});content.appendChild(card('DONE RITE Product Picks',list.childNodes.length?list:el('p',{class:'drn-muted'},['No Amazon products saved yet.'])));
    }
    if(active==='Performance'){
      const state=DoneRitePerformance.getState(),list=el('div',{class:'drn-list'});state.rows.forEach(r=>{const label=DoneRiteHookRanking.score(r).label;list.appendChild(el('div',{class:'drn-row'},[el('strong',{},[r.product||'Product']),el('div',{class:'drn-muted'},[`${r.platform} · ${r.views} views · ${r.avgWatchTime}s avg watch · ${r.completionRate}% completion`]),el('span',{class:'drn-pill'},[label]),el('span',{class:'drn-pill'},[`Attribution: ${r.attribution}`])]));});content.appendChild(card('Performance & Attribution',list.childNodes.length?list:el('p',{class:'drn-muted'},['No analytics logged.'])));content.appendChild(card('Attribution Rule',el('p',{class:'drn-muted'},['Showcase, LIVE, and unknown-attribution sales never give a video hook sales credit. Only verified video-attributed sales can create a Sales Winner.'])));
    }
  }
  renderTab();
}
window.DoneRiteNextDashboard={version:'1.1',render};
})();