/* DONE RITE Creator OS — Content Gap demand filter v1.0 */
(function(){
'use strict';
function classify(searches){searches=Number(searches||0);if(searches>=1000)return{status:'Priority',use:true,weight:100};if(searches>=750)return{status:'Watchlist',use:true,weight:60};return{status:'Ignore',use:false,weight:0};}
function filter(rows){return(rows||[]).map(r=>Object.assign({},r,{demand:classify(r.searches)})).filter(r=>r.demand.use).sort((a,b)=>Number(b.searches||0)-Number(a.searches||0));}
window.DoneRiteContentGapDemand={version:'1.0',prioritySearches:1000,watchlistMin:750,classify,filter};
})();