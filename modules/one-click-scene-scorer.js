/* DONE RITE Creator OS — One-Click Scene Scorer v0.2 */
(function(){
'use strict';
const VERSION='0.2';
function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
function round(n){return Math.round(n*1000)/1000;}
function numeric(v){return typeof v==='number'&&Number.isFinite(v);}
function scoreCandidate(candidate,mode){
  const f=(candidate&&candidate.features)||{};let sum=0,weight=0;
  const add=(value,w)=>{if(numeric(value)){sum+=clamp(value,0,1)*w;weight+=w;}};
  add(f.sharpness,.34);add(f.motion,mode==='AUTO_HOOK'?.38:.28);add(f.brightness,.18);add(f.audioActivity,.20);add(f.productVisibility,.34);
  if(numeric(f.deadSpacePenalty)){sum-=clamp(f.deadSpacePenalty,0,1)*.28;weight+=.28;}
  if(numeric(f.duplicatePenalty)){sum-=clamp(f.duplicatePenalty,0,1)*.18;weight+=.18;}
  return weight?round(clamp(sum/weight,0,1)):0;
}
function rank(candidates,mode){return (candidates||[]).map((c,i)=>Object.assign({id:c.id||('scene-'+i)},c,{score:scoreCandidate(c,mode)})).sort((a,b)=>b.score-a.score||a.start-b.start);}
function chooseNonOverlapping(candidates,targetSeconds,mode){const ranked=rank(candidates,mode),chosen=[];let total=0;for(const c of ranked){const start=Number(c.start||0),end=Number(c.end||0),dur=Math.max(0,end-start);if(!dur||chosen.some(x=>start<x.end&&end>x.start))continue;const remaining=Math.max(0,Number(targetSeconds||0)-total);const usedEnd=remaining&&dur>remaining?start+remaining:end;chosen.push(Object.assign({},c,{start,end:+usedEnd.toFixed(3),duration:round(usedEnd-start)}));total+=usedEnd-start;if(total>=Number(targetSeconds||0))break;}chosen.sort((a,b)=>a.start-b.start);return {analysisSource:'real decoded frame samples',chosen,totalSeconds:round(total),targetSeconds:Number(targetSeconds||0),complete:total>=Number(targetSeconds||0)};}
window.DoneRiteOneClickSceneScorer={version:VERSION,scoreCandidate,rank,chooseNonOverlapping};
})();
