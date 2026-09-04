/* DONE RITE Creator OS — One-Click Render Stage v0.1
   Builds a preview/export recipe from selected cuts without mutating originals.
*/
(function(){
'use strict';
const VERSION='0.1';
function cleanCuts(cuts){return (Array.isArray(cuts)?cuts:[]).map((c,i)=>({
  id:c.id||('cut-'+(i+1)),start:+Number(c.start||0).toFixed(3),end:+Number(c.end||0).toFixed(3),
  score:Number(c.score||0),role:c.role||null
})).filter(c=>c.end>c.start).sort((a,b)=>a.start-b.start);}
function totalDuration(cuts){return +cleanCuts(cuts).reduce((s,c)=>s+(c.end-c.start),0).toFixed(3);}
function makeRecipe(session,cuts,plan){
  const selected=cleanCuts(cuts);
  const overlays=(plan&&plan.editPlan&&Array.isArray(plan.editPlan.overlays))?plan.editPlan.overlays:[];
  return {
    engine:'DONE RITE One-Click Render Stage',version:VERSION,status:'RENDER_RECIPE_READY',
    sessionId:session&&session.id||null,
    sourceName:session&&session.source&&session.source.name||null,
    sourcePreserved:true,
    selectedCuts:selected,
    outputDurationSeconds:totalDuration(selected),
    framing:{preserveOriginal:true,verticalSafeZones:true},
    audio:{preserveOriginalVoice:true,preserveOriginalVoiceLevel:true,normalize:false,compress:false,speedChange:false,
      sfxMix:'under original voice'},
    overlays:overlays.map((o,i)=>({id:'overlay-'+(i+1),role:o.role,text:o.text,animation:o.animation,safeZone:o.safeZone})),
    export:{container:'video/mp4',videoCodecPreference:['avc1','h264'],audioCodecPreference:['aac'],fileName:plan&&plan.packaging&&plan.packaging.videoFileName||'done-rite-ad.mp4'},
    rollback:{originalPreserved:true,restoreTarget:'original'},
    nextRequiredStage:'BROWSER_RENDER_EXECUTION'
  };
}
function browserCapabilities(){
  return {
    mediaRecorder:typeof MediaRecorder!=='undefined',
    videoFrameCallback:typeof HTMLVideoElement!=='undefined'&&'requestVideoFrameCallback' in HTMLVideoElement.prototype,
    offscreenCanvas:typeof OffscreenCanvas!=='undefined',
    webCodecs:typeof VideoEncoder!=='undefined'&&typeof AudioEncoder!=='undefined'
  };
}
function chooseExecutionPath(){
  const c=browserCapabilities();
  if(c.webCodecs) return {path:'WEBCODECS',reason:'Best available browser-native render path.'};
  if(c.mediaRecorder) return {path:'CANVAS_MEDIARECORDER',reason:'Fallback browser-native preview/export path.'};
  return {path:'PREVIEW_ONLY',reason:'This browser lacks a supported local encoding API.'};
}
window.DoneRiteOneClickRenderStage={version:VERSION,cleanCuts,totalDuration,makeRecipe,browserCapabilities,chooseExecutionPath};
})();