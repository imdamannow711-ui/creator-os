/* DONE RITE Creator OS Next — deterministic browser self-test */
(function(){
'use strict';
function run(){const r=[];const t=(name,fn)=>{try{const value=fn();if(value!==true)throw new Error(typeof value==='string'?value:'Expected true');r.push({name,pass:true});}catch(e){r.push({name,pass:false,error:String(e&&e.message||e)});}};
t('Hands-only mode enabled',()=>DoneRiteNextConfig.production.mode==='hands-only');
t('Quick Create is 7–10 seconds',()=>{const x=DoneRiteHandsOnlyQuickCreate.create({product:'Test',feature:'feature'});return x.durationSeconds.min===7&&x.durationSeconds.max===10&&x.aiVideo===false;});
t('Content Gap 1000 is Priority',()=>DoneRiteContentGapDemand.classify(1000).status==='Priority');
t('Content Gap 900 is Watchlist',()=>DoneRiteContentGapDemand.classify(900).status==='Watchlist');
t('Content Gap 500 is ignored',()=>DoneRiteContentGapDemand.classify(500).use===false); 
t('Showcase sale does not create hook sales winner',()=>DoneRiteHookRanking.score({attribution:'Showcase',orders:3,commission:20,views:500}).label!=='Sales Winner');
t('LIVE sale does not create hook sales winner',()=>DoneRiteHookRanking.score({attribution:'LIVE',orders:1,commission:5,views:500}).label!=='Sales Winner');
t('Verified video sale creates Sales Winner',()=>DoneRiteHookRanking.score({attribution:'Video',orders:1,commission:5}).label==='Sales Winner');
t('Amazon primary tracking ID correct',()=>DoneRiteYouTubeAmazon.trackingId==='donerite02-20');
t('YouTube queue uses three daily slots',()=>DoneRiteNextConfig.youtube.dailySlots.join('|')==='Morning|Afternoon|Evening');
t('Cross-platform package has five platforms',()=>Object.keys(DoneRiteCrossPlatform.pack({product:'Test',feature:'feature'})).length===5);
t('Media Vault never claims it deletes Apple Photos originals',()=>/does not delete originals/i.test(DoneRiteMediaVault.IMPORTANT));
return {pass:r.every(x=>x.pass),tests:r,passed:r.filter(x=>x.pass).length,total:r.length};}
window.DoneRiteSelfTest={version:'1.0',run};
})();