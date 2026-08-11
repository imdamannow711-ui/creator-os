/* DONE RITE Creator OS — Daily HQ summary engine v1.0 */
(function(){
'use strict';
function safe(fn,fallback){try{return fn();}catch(e){return fallback;}}
function build(){
  const media=safe(()=>window.DoneRiteMediaVault.summary(),{total:0,safeToDelete:0,review:0,protected:0});
  const perf=safe(()=>window.DoneRitePerformance.handsOnlyBaseline(),null);
  const yt=safe(()=>window.DoneRiteYouTubeAmazon.getState(),{queue:[],products:[],results:[]});
  const today=new Date().toISOString().slice(0,10);
  const todayQueue=(yt.queue||[]).filter(x=>x.date===today);
  return {
    date:today,
    mediaCleanup:{safeToDelete:media.safeToDelete,review:media.review},
    handsOnlyBaseline:perf,
    youtube:{plannedToday:todayQueue.length,slots:['Morning','Afternoon','Evening'],productsSaved:(yt.products||[]).length},
    nextActions:[
      media.safeToDelete>0?`Review ${media.safeToDelete} processed screenshot${media.safeToDelete===1?'':'s'} for deletion.`:'No processed screenshots waiting for deletion review.',
      todayQueue.length<3?`Plan ${3-todayQueue.length} more YouTube Short${3-todayQueue.length===1?'':'s'} for today.`:'YouTube daily queue is full.',
      perf?`Hands-only baseline: ${Math.round(perf.avgViews)} average views across ${perf.posts} post${perf.posts===1?'':'s'}.`:'Log hands-only analytics to start the performance baseline.'
    ]
  };
}
window.DoneRiteDailyHQ={version:'1.0',build};
})();