/* DONE RITE Creator OS — One-Click Scene Scorer v0.4
   Source-aware scoring using only measured candidate features.
*/
(function(){
'use strict';
const VERSION='0.4';
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function round(n){return Math.round(n*100)/100;}
function numeric(v){return typeof v==='number'&&Number.isFinite(v);}
function scoreCandidate(candidate,mode){
  const f=candidate&&candidate.features||{},hookBoost=mode==='AUTO_HOOK'?1.18:1,cleanBoost=mode==='AUTO_CLEAN'?1.08:1;
  let score=0,weight=0;
  function add(value,w){if(numeric(value)){score+=clamp(value,0,1)*w;weight+=w;}}
  function subtract(value,w){if(numeric(value)){score-=clamp(value,0,1)*w;weight+=w;}}
  add(f.semanticMatch,.30);add(f.productVisibility,.26);add(f.sharpness,.16);add(f.motion,.14*hookBoost);add(f.audioActivity,.08);add(f.brightness,.06);
  subtract(f.deadSpacePenalty,.28*cleanBoost);subtract(f.duplicatePenalty,.18);subtract(f.facePenalty,.05);
  return weight?round(clamp(score/weight,0,1)):0;
}
function rank(candidates,mode){return (candidates||[]).map((c,i)=>Object.assign({id:c.id||('scene-'+i)},c,{score:scoreCandidate(c,mode)})).sort((a,b)=>b.score-a.score||Number(a.start||0)-Number(b.start||0));}
function sourceKey(c){return Number.isInteger(c&&c.sourceIndex)?c.sourceIndex:0;}
function overlapsChosen(c,chosen){const start=Number(c.start||0),end=Number(c.end||0),key=sourceKey(c);return chosen.some(x=>sourceKey(x)===key&&start<x.end&&end>x.start);}
function chooseNonOverlapping(candidates,targetSeconds,mode){
  const ranked=rank(candidates,mode),chosen=[],target=Math.max(0,Number(targetSeconds||0));let total=0;
  function addCandidate(c){
    const start=Number(c.start||0),end=Number(c.end||0),available=Math.max(0,end-start),remaining=Math.max(0,target-total);
    if(!available||!remaining||overlapsChosen(c,chosen))return false;
    const used=Math.min(available,remaining),usedEnd=start+used;
    chosen.push(Object.assign({},c,{start,end:+usedEnd.toFixed(3),duration:round(used)}));total+=used;return true;
  }
  const sourceIds=[...new Set(ranked.map(sourceKey))];
  if(sourceIds.length>1)for(const sourceIndex of sourceIds){const best=ranked.find(c=>sourceKey(c)===sourceIndex&&!overlapsChosen(c,chosen));if(best)addCandidate(best);if(total>=target)break;}
  if(total<target)for(const c of ranked){if(chosen.some(x=>x.id===c.id))continue;addCandidate(c);if(total>=target)break;}
  chosen.sort((a,b)=>sourceKey(a)-sourceKey(b)||a.start-b.start);chosen.forEach((c,i)=>{c.sequenceIndex=i;});
  return {analysisSource:'measured features only',chosen,totalSeconds:round(total),targetSeconds:target,complete:total>=target,sourceCountUsed:new Set(chosen.map(sourceKey)).size};
}
window.DoneRiteOneClickSceneScorer={version:VERSION,scoreCandidate,rank,chooseNonOverlapping};
})();