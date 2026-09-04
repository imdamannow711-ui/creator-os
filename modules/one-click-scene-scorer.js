/* DONE RITE Creator OS — One-Click Scene Scorer v0.1
   Deterministic scoring for candidate time windows. Does not alter source media.
*/
(function(){
'use strict';
const VERSION='0.1';
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
    deadSpacePenalty:clamp(Number(x.deadSpacePenalty||0),0,1)
  };
}
function scoreCandidate(candidate,mode){
  const f=normalizeFeatures(candidate.features);
  const hookBoost=mode==='AUTO_HOOK'?1.18:1;
  const cleanBoost=mode==='AUTO_CLEAN'?1.08:1;
  let score=0;
  score += f.productVisibility*0.34;
  score += f.sharpness*0.18;
  score += f.motion*0.16*hookBoost;
  score += f.audioActivity*0.12;
  score += f.brightness*0.08;
  score -= f.deadSpacePenalty*0.28*cleanBoost;
  score -= f.duplicatePenalty*0.18;
  score -= f.facePenalty*0.05;
  return round(clamp(score,0,1.25));
}
function rank(candidates,mode){
  return (candidates||[]).map((c,i)=>Object.assign({id:c.id||('scene-'+i)},c,{score:scoreCandidate(c,mode)}))
    .sort((a,b)=>b.score-a.score);
}
function chooseNonOverlapping(candidates,targetSeconds,mode){
  const ranked=rank(candidates,mode),chosen=[];
  let total=0;
  for(const c of ranked){
    const start=Number(c.start||0),end=Number(c.end||0),dur=Math.max(0,end-start);
    if(!dur) continue;
    const overlaps=chosen.some(x=>start<x.end&&end>x.start);
    if(overlaps) continue;
    chosen.push(Object.assign({},c,{start,end,duration:round(dur)}));
    total+=dur;
    if(total>=targetSeconds) break;
  }
  chosen.sort((a,b)=>a.start-b.start);
  return {chosen,totalSeconds:round(total),targetSeconds:Number(targetSeconds||0),complete:total>=Number(targetSeconds||0)};
}
window.DoneRiteOneClickSceneScorer={version:VERSION,scoreCandidate,rank,chooseNonOverlapping};
})();