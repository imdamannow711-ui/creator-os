/* DONE RITE Creator OS — One-Click Scene Scorer v0.3
   Source-aware scoring for candidate time windows. Does not alter source media.
*/
(function(){
'use strict';
const VERSION='0.3';
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
window.DoneRiteOneClickSceneScorer={version:VERSION,scoreCandidate,rank,chooseNonOverlapping};
})();