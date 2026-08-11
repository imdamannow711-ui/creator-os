/* DONE RITE Creator OS — cross-platform performance engine v1.0 */
(function(){
'use strict';
const KEY='done-rite-performance:v1';
const DEFAULT={rows:[]};
function load(){try{return Object.assign({},DEFAULT,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return JSON.parse(JSON.stringify(DEFAULT));}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));return s;}
function uid(){return'perf-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);}
function add(x){const s=load();const r={id:uid(),platform:x.platform||'TikTok Shop',product:String(x.product||'').trim(),format:x.format||'Hands Only',hook:String(x.hook||'').trim(),funnel:x.funnel||'BOF',views:Number(x.views||0),engagedViews:Number(x.engagedViews||0),avgWatchTime:Number(x.avgWatchTime||0),completionRate:Number(x.completionRate||0),likes:Number(x.likes||0),comments:Number(x.comments||0),shares:Number(x.shares||0),saves:Number(x.saves||0),clicks:Number(x.clicks||0),orders:Number(x.orders||0),commission:Number(x.commission||0),attribution:x.attribution||'Unknown',date:x.date||new Date().toISOString().slice(0,10)};r.videoAttributedSale=(r.attribution==='Video'&&(r.orders>0||r.commission>0));s.rows.unshift(r);save(s);return r;}
function hookLabel(r){if(r.videoAttributedSale)return'Sales Winner';if((r.shares+r.saves+r.likes+r.comments)>0||r.completionRate>0||r.avgWatchTime>0)return'Strong Performer';return'Untested';}
function byPlatform(){const s=load(),m={};s.rows.forEach(r=>{if(!m[r.platform])m[r.platform]={platform:r.platform,views:0,clicks:0,orders:0,commission:0,posts:0};const x=m[r.platform];x.views+=r.views;x.clicks+=r.clicks;x.orders+=r.orders;x.commission+=r.commission;x.posts+=1;});return Object.values(m).map(x=>Object.assign(x,{rpm:x.views?(x.commission/x.views)*1000:0})).sort((a,b)=>b.commission-a.commission||b.orders-a.orders||b.rpm-a.rpm);}
function handsOnlyBaseline(){const rows=load().rows.filter(r=>r.format==='Hands Only');if(!rows.length)return null;return{posts:rows.length,avgViews:rows.reduce((a,b)=>a+b.views,0)/rows.length,avgWatchTime:rows.reduce((a,b)=>a+b.avgWatchTime,0)/rows.length,avgCompletionRate:rows.reduce((a,b)=>a+b.completionRate,0)/rows.length,totalShares:rows.reduce((a,b)=>a+b.shares,0),totalSaves:rows.reduce((a,b)=>a+b.saves,0)};}
window.DoneRitePerformance={version:'1.0',getState:load,add,hookLabel,byPlatform,handsOnlyBaseline};
})();