/* DONE RITE Creator OS — One-Click Scene Scorer v0.4
   Source-aware scoring for candidate time windows. Does not alter source media.
*/
(function(){
'use strict';
const VERSION='0.4';
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function round(n){return Math.round(n*100)/100;}
function normalizeFeatures(x){
  x=x||{};
  return {
    motion:clamp(Number(x.motion||0),0,1),
    sharpness:clamp(Number(x.sharpness||0),0,1),
    brightness:clamp(Number(x.brightness||0),0,1),
    facePenalty:clamp(Number(x.facePenalty||0),0,1),
    productVisibility:clamp(Number(x.productVisibility||0),0,1),
    audioActivity:clamp(Number(x.audioActivity||0),0,1),
    duplicatePenalty:clamp(Number(x.duplicatePenalty||0),0,1),
    deadSpacePenalty:clamp(Number(x.deadSpacePenalty||0),0,1),
    semanticMatch:clamp(Number(x.semanticMatch||0),0,1)
  };
}
function scoreCandidate(candidate,mode){
  const f=normalizeFeatures(candidate.features);
  const hookBoost=mode==='AUTO_HOOK'?1.18:1;
  const cleanBoost=mode==='AUTO_CLEAN'?1.08:1;
  let score=0;
  score+=f.semanticMatch*0.30;
  score+=f.productVisibility*0.26;
  score+=f.sharpness*0.16;
  score+=f.motion*0.14*hookBoost;
  score+=f.audioActivity*0.08;
  score+=f.brightness*0.06;
  score-=f.deadSpacePenalty*0.28*cleanBoost;
  score-=f.duplicatePenalty*0.18;
  score-=f.facePenalty*0.05;
  return round(clamp(score,0,1.35));
}
function rank(candidates,mode){
  return (candidates||[]).map((c,i)=>Object.assign({id:c.id||('scene-'+i)},c,{score:scoreCandidate(c,mode)})).sort((a,b)=>b.score-a.score);
}
function sourceKey(c){return Number.isInteger(c&&c.sourceIndex)?c.sourceIndex:0;}
function overlapsChosen(c,chosen){
  const start=Number(c.start||0),end=Number(c.end||0),key=sourceKey(c);
  return chosen.some(x=>sourceKey(x)===key&&start<x.end&&end>x.start);
}
function chooseNonOverlapping(candidates,targetSeconds,mode){
  const ranked=rank(candidates,mode),chosen=[];
  const target=Math.max(0,Number(targetSeconds||0));
  let total=0;
  const sourceIds=[...new Set(ranked.map(sourceKey))];
  function addCandidate(c){
    const start=Number(c.start||0),end=Number(c.end||0),dur=Math.max(0,end-start);
    if(!dur||overlapsChosen(c,chosen))return false;
    chosen.push(Object.assign({},c,{start,end,duration:round(dur)}));total+=dur;return true;
  }
  if(sourceIds.length>1){
    for(const sourceIndex of sourceIds){
      const best=ranked.find(c=>sourceKey(c)===sourceIndex&&!overlapsChosen(c,chosen));
      if(best)addCandidate(best);
      if(total>=target)break;
    }
  }
  if(total<target){
    for(const c of ranked){
      if(chosen.some(x=>x.id===c.id))continue;
      addCandidate(c);
      if(total>=target)break;
    }
  }
  chosen.sort((a,b)=>sourceKey(a)-sourceKey(b)||a.start-b.start);
  chosen.forEach((c,i)=>{c.sequenceIndex=i;});
  return {chosen,totalSeconds:round(total),targetSeconds:target,complete:total>=target,sourceCountUsed:new Set(chosen.map(sourceKey)).size};
}
function chooseSpeechSafeSingleSource(durationSeconds,targetSeconds,silenceRanges,source){
  const duration=Math.max(0,Number(durationSeconds||0)),target=Math.max(0,Math.min(Number(targetSeconds||0),duration)),keepSilence=.16;
  const original={id:'source-0-original',sourceIndex:0,sourceName:source&&source.name||null,start:0,end:round(duration),duration:round(duration),score:1,sequenceIndex:0,speechSafe:true};
  if(!duration||target<=0||duration-target<=.05)return {chosen:[original],totalSeconds:round(duration),targetSeconds:target,complete:true,sourceCountUsed:1,speechSafe:true,keptOriginal:true,reason:'ORIGINAL_WITHIN_TARGET'};
  const excess=duration-target;
  const gaps=(Array.isArray(silenceRanges)?silenceRanges:[]).map((gap,i)=>{
    const start=clamp(Number(gap.start||0),0,duration),end=clamp(Number(gap.end||0),0,duration),removable=Math.max(0,end-start-keepSilence);
    return {id:i,start,end,removable,boundary:start<=.06||end>=duration-.06};
  }).filter(g=>g.removable>.02).sort((a,b)=>Number(b.boundary)-Number(a.boundary)||b.removable-a.removable);
  const available=gaps.reduce((sum,g)=>sum+g.removable,0);
  if(available+0.03<excess)return {chosen:[original],totalSeconds:round(duration),targetSeconds:target,complete:true,sourceCountUsed:1,speechSafe:true,keptOriginal:true,reason:'NO_SAFE_GAPS'};
  let remaining=excess;const drops=[];
  for(const gap of gaps){
    if(remaining<=.02)break;
    const amount=Math.min(gap.removable,remaining);let start,end;
    if(gap.start<=.06){start=0;end=amount;}
    else if(gap.end>=duration-.06){start=duration-amount;end=duration;}
    else{const middle=(gap.start+gap.end)/2;start=middle-amount/2;end=middle+amount/2;}
    drops.push({start,end});remaining-=amount;
  }
  if(remaining>.03)return {chosen:[original],totalSeconds:round(duration),targetSeconds:target,complete:true,sourceCountUsed:1,speechSafe:true,keptOriginal:true,reason:'NO_SAFE_GAPS'};
  drops.sort((a,b)=>a.start-b.start);const chosen=[];let cursor=0;
  drops.forEach(drop=>{if(drop.start-cursor>.04)chosen.push({start:cursor,end:drop.start});cursor=Math.max(cursor,drop.end);});
  if(duration-cursor>.04)chosen.push({start:cursor,end:duration});
  const cuts=chosen.map((cut,i)=>({id:'source-0-speech-safe-'+(i+1),sourceIndex:0,sourceName:source&&source.name||null,start:round(cut.start),end:round(cut.end),duration:round(cut.end-cut.start),score:1,sequenceIndex:i,speechSafe:true}));
  const total=cuts.reduce((sum,cut)=>sum+cut.end-cut.start,0);
  return {chosen:cuts,totalSeconds:round(total),targetSeconds:target,complete:total+0.03>=target,sourceCountUsed:1,speechSafe:true,keptOriginal:false,reason:'SILENCE_ONLY_GAPS_REMOVED',removedSeconds:round(duration-total)};
}
window.DoneRiteOneClickSceneScorer={version:VERSION,scoreCandidate,rank,chooseNonOverlapping,chooseSpeechSafeSingleSource};
})();
