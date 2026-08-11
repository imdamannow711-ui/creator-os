/* DONE RITE Creator OS — hook ranking engine v1.0 */
(function(){
'use strict';
function score(row){
  const videoSale=row.attribution==='Video'&&(Number(row.orders||0)>0||Number(row.commission||0)>0);
  const repeated=Number(row.videoAttributedSales||0)>=2;
  if(repeated)return{label:'Proven Winner',rank:100};
  if(videoSale)return{label:'Sales Winner',rank:90};
  const engagement=Number(row.likes||0)+Number(row.comments||0)+Number(row.shares||0)+Number(row.saves||0);
  const retention=Number(row.completionRate||0)+Number(row.avgWatchTime||0);
  if(engagement>0||retention>0)return{label:'Strong Performer',rank:70};
  return{label:'Untested',rank:10};
}
function rank(rows){return (rows||[]).map(x=>Object.assign({},x,score(x))).sort((a,b)=>b.rank-a.rank||Number(b.commission||0)-Number(a.commission||0)||Number(b.views||0)-Number(a.views||0));}
window.DoneRiteHookRanking={version:'1.0',score,rank,rule:'Showcase/LIVE/Unknown sales never give a video hook sales credit.'};
})();