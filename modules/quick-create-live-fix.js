/* DONE RITE Creator OS — live Quick Create fix v1.0
   Fixes two issues without changing the React bootstrap:
   1) SAY lines must contain spoken copy only.
   2) iPhone/Safari click audio should recover after AudioContext suspension.
*/
(function(){
'use strict';
const BAD_SAY_PATTERNS=[
  /narrate the demo/i,
  /verified features only/i,
  /describe what you(?:'re| are) doing/i,
  /say something about/i,
  /insert (?:voiceover|dialogue|copy)/i,
  /placeholder/i
];
function isInstruction(line){
  const s=String(line||'').trim();
  return !s || BAD_SAY_PATTERNS.some(r=>r.test(s));
}
function sanitizeSayLines(lines){
  const arr=(Array.isArray(lines)?lines:String(lines||'').split(/\n+/)).map(x=>String(x||'').trim()).filter(Boolean);
  return arr.filter(x=>!isInstruction(x));
}
function sanitizeRenderedText(text){
  const lines=String(text||'').split('\n');
  return lines.filter(line=>{
    const m=line.match(/^\s*SAY:\s*(.*)$/i);
    if(!m) return true;
    return !isInstruction(m[1]);
  }).join('\n');
}

let ctx=null;
async function ensureAudio(){
  try{
    const A=window.AudioContext||window.webkitAudioContext;
    if(!A) return null;
    if(!ctx || ctx.state==='closed') ctx=new A();
    if(ctx.state==='suspended') await ctx.resume();
    return ctx;
  }catch(e){return null;}
}
async function click(){
  const c=await ensureAudio(); if(!c) return;
  try{
    const now=c.currentTime,o=c.createOscillator(),g=c.createGain();
    o.type='square'; o.frequency.setValueAtTime(720,now); o.frequency.exponentialRampToValueAtTime(360,now+.035);
    g.gain.setValueAtTime(.035,now); g.gain.exponentialRampToValueAtTime(.001,now+.04);
    o.connect(g); g.connect(c.destination); o.start(now); o.stop(now+.045);
  }catch(e){}
}
function bindAudioRecovery(){
  ['pointerdown','touchstart','click'].forEach(evt=>document.addEventListener(evt,()=>{ensureAudio();},{capture:true,passive:true}));
  document.addEventListener('click',e=>{if(e.target&&e.target.closest&&e.target.closest('button,[role="button"],.dr-chip')) click();},true);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible') ensureAudio();});
}
function patchRenderedOutputs(){
  const fix=()=>{
    document.querySelectorAll('.dr-output').forEach(node=>{
      const before=node.textContent||'', after=sanitizeRenderedText(before);
      if(after!==before) node.textContent=after;
    });
  };
  fix();
  const obs=new MutationObserver(fix); obs.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  return obs;
}
window.DoneRiteQuickCreateLiveFix={version:'1.0',isInstruction,sanitizeSayLines,sanitizeRenderedText,ensureAudio,click,bindAudioRecovery,patchRenderedOutputs};
})();