/* DONE RITE Creator OS — One-Click Hook Experiments v1.0
   Rotates compliant on-screen hooks and stores assignments/results locally.
*/
(function(){
'use strict';
const VERSION='1.0';
const KEY='done-rite-one-click-hook-tests:v1';
const POOL=[
  {id:'H01',text:'BEFORE YOU SCROLL, WATCH THIS',angle:'curiosity'},
  {id:'H02',text:'THIS PART IS EASY TO MISS',angle:'detail'},
  {id:'H03',text:'LOOK CLOSER AT THIS',angle:'curiosity'},
  {id:'H04',text:'ONE FEATURE WORTH SEEING',angle:'feature'},
  {id:'H05',text:'WATCH HOW THIS PART WORKS',angle:'demo'},
  {id:'H06',text:'HERE’S THE DETAIL THAT STOOD OUT',angle:'detail'},
  {id:'H07',text:'THIS IS WHY THE DEMO MATTERS',angle:'demo'},
  {id:'H08',text:'CHECK THIS DETAIL FIRST',angle:'detail'},
  {id:'H09',text:'DON’T MISS THIS FEATURE',angle:'feature'},
  {id:'H10',text:'THE SMALL DETAIL PEOPLE SKIP',angle:'curiosity'},
  {id:'H11',text:'SEE WHAT THIS PART DOES',angle:'demo'},
  {id:'H12',text:'THIS DESERVES A CLOSER LOOK',angle:'curiosity'}
];
function load(){try{return Object.assign({lastHookId:null,assignments:[],results:[]},JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return{lastHookId:null,assignments:[],results:[]};}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));return s;}
function uid(){return'hooktest-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);}
function choose(options){
  options=options||{};const s=load();let candidates=POOL.slice();
  if(options.excludeLast!==false&&s.lastHookId&&candidates.length>1)candidates=candidates.filter(x=>x.id!==s.lastHookId);
  if(options.angle)candidates=candidates.filter(x=>x.angle===options.angle).concat(candidates.filter(x=>x.angle!==options.angle));
  const top=options.angle?candidates.filter(x=>x.angle===options.angle):candidates;
  const usable=top.length?top:candidates;
  const picked=usable[Math.floor(Math.random()*usable.length)];
  return Object.assign({},picked);
}
function assign(input){
  input=input||{};const s=load(),hook=choose({excludeLast:true,angle:input.angle||''});
  const row={id:uid(),hookId:hook.id,hookText:hook.text,angle:hook.angle,product:String(input.product||'').trim(),mode:input.mode||'AUTO_SELL',platform:input.platform||'TikTok Shop',createdAt:new Date().toISOString(),videoFileName:input.videoFileName||'',status:'assigned'};
  s.lastHookId=hook.id;s.assignments.unshift(row);s.assignments=s.assignments.slice(0,500);save(s);
  return Object.assign({},hook,{assignmentId:row.id});
}
function recordResult(assignmentId,metrics){
  const s=load(),m=metrics||{};const result={id:uid(),assignmentId:String(assignmentId||''),views:Number(m.views||0),avgWatchTime:Number(m.avgWatchTime||0),completionRate:Number(m.completionRate||0),likes:Number(m.likes||0),comments:Number(m.comments||0),shares:Number(m.shares||0),saves:Number(m.saves||0),clicks:Number(m.clicks||0),orders:Number(m.orders||0),recordedAt:new Date().toISOString()};
  s.results.unshift(result);s.results=s.results.slice(0,1000);save(s);return result;
}
function leaderboard(){
  const s=load(),by={};
  s.assignments.forEach(a=>{if(!by[a.hookId])by[a.hookId]={hookId:a.hookId,hookText:a.hookText,angle:a.angle,tests:0,views:0,avgWatchTimeTotal:0,completionTotal:0,clicks:0,orders:0,resultCount:0};by[a.hookId].tests++;});
  s.results.forEach(r=>{const a=s.assignments.find(x=>x.id===r.assignmentId);if(!a||!by[a.hookId])return;const x=by[a.hookId];x.views+=r.views;x.avgWatchTimeTotal+=r.avgWatchTime;x.completionTotal+=r.completionRate;x.clicks+=r.clicks;x.orders+=r.orders;x.resultCount++;});
  return Object.values(by).map(x=>Object.assign(x,{avgWatchTime:x.resultCount?x.avgWatchTimeTotal/x.resultCount:0,avgCompletionRate:x.resultCount?x.completionTotal/x.resultCount:0})).sort((a,b)=>b.orders-a.orders||b.clicks-a.clicks||b.avgCompletionRate-a.avgCompletionRate||b.avgWatchTime-a.avgWatchTime||b.views-a.views);
}
window.DoneRiteHookExperiments={version:VERSION,pool:POOL.slice(),choose,assign,recordResult,leaderboard,getState:load};
})();