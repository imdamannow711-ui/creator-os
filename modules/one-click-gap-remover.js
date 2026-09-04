/* DONE RITE Creator OS — One-Click Voiceover Gap Remover v0.1
   Shortens silence only. Spoken audio samples are kept at their original gain.
*/
(function(){
'use strict';
const VERSION='0.1';
const PRESETS={
  natural:{label:'Natural',thresholdDb:-38,minSilenceMs:320,keepMs:160},
  tight:{label:'Tight',thresholdDb:-34,minSilenceMs:220,keepMs:100}
};
let outputUrl='',outputBlob=null,outputName='';
function dbToAmp(db){return Math.pow(10,Number(db)/20);}
function fmt(sec){sec=Math.max(0,Number(sec||0));const m=Math.floor(sec/60),s=(sec-m*60).toFixed(1).padStart(4,'0');return m+':'+s;}
function wav16(channels,sampleRate){
  const count=channels[0].length,nch=channels.length,bytes=44+count*nch*2,b=new ArrayBuffer(bytes),v=new DataView(b);let o=0;
  function str(s){for(let i=0;i<s.length;i++)v.setUint8(o++,s.charCodeAt(i));}
  str('RIFF');v.setUint32(o,bytes-8,true);o+=4;str('WAVE');str('fmt ');v.setUint32(o,16,true);o+=4;v.setUint16(o,1,true);o+=2;v.setUint16(o,nch,true);o+=2;v.setUint32(o,sampleRate,true);o+=4;v.setUint32(o,sampleRate*nch*2,true);o+=4;v.setUint16(o,nch*2,true);o+=2;v.setUint16(o,16,true);o+=2;str('data');v.setUint32(o,count*nch*2,true);o+=4;
  for(let i=0;i<count;i++)for(let c=0;c<nch;c++){let x=Math.max(-1,Math.min(1,channels[c][i]));v.setInt16(o,x<0?x*32768:x*32767,true);o+=2;}
  return new Blob([b],{type:'audio/wav'});
}
function analyze(buffer,preset){
  const sr=buffer.sampleRate,win=Math.max(1,Math.round(sr*.01)),threshold=dbToAmp(preset.thresholdDb),frames=Math.ceil(buffer.length/win),silent=new Uint8Array(frames);
  for(let f=0;f<frames;f++){
    const a=f*win,z=Math.min(buffer.length,a+win);let sum=0,n=0;
    for(let i=a;i<z;i+=2){let peak=0;for(let c=0;c<buffer.numberOfChannels;c++)peak=Math.max(peak,Math.abs(buffer.getChannelData(c)[i]||0));sum+=peak*peak;n++;}
    silent[f]=Math.sqrt(sum/Math.max(1,n))<threshold?1:0;
  }
  const minFrames=Math.ceil(preset.minSilenceMs/10),keepFrames=Math.max(1,Math.round(preset.keepMs/10)),drops=[];let i=0;
  while(i<frames){if(!silent[i]){i++;continue;}let j=i+1;while(j<frames&&silent[j])j++;const len=j-i;if(len>=minFrames){const extra=len-keepFrames;if(extra>0){const left=Math.floor(extra/2),right=extra-left;drops.push({startFrame:i+Math.ceil(keepFrames/2),endFrame:j-Math.floor(keepFrames/2),frames:extra});}}i=j;}
  return {win,drops};
}
function processBuffer(buffer,preset){
  const a=analyze(buffer,preset),dropSamples=a.drops.reduce((n,d)=>n+(d.endFrame-d.startFrame)*a.win,0),outLen=Math.max(1,buffer.length-dropSamples),channels=[];
  for(let c=0;c<buffer.numberOfChannels;c++)channels.push(new Float32Array(outLen));
  let src=0,dst=0;
  for(const d of a.drops){const ds=Math.min(buffer.length,d.startFrame*a.win),de=Math.min(buffer.length,d.endFrame*a.win),len=Math.max(0,ds-src);for(let c=0;c<channels.length;c++)channels[c].set(buffer.getChannelData(c).subarray(src,ds),dst);dst+=len;src=de;}
  const tail=Math.max(0,buffer.length-src);for(let c=0;c<channels.length;c++)channels[c].set(buffer.getChannelData(c).subarray(src),dst);
  return {channels,sampleRate:buffer.sampleRate,originalSeconds:buffer.duration,outputSeconds:(dst+tail)/buffer.sampleRate,removedSeconds:Math.max(0,buffer.duration-(dst+tail)/buffer.sampleRate),gapCount:a.drops.length};
}
async function decode(file){const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)throw new Error('Web Audio is unavailable on this browser.');const ctx=new Ctx();try{return await ctx.decodeAudioData(await file.arrayBuffer());}finally{try{await ctx.close();}catch(e){}}}
function baseName(name){return String(name||'voiceover').replace(/\.[^.]+$/,'').replace(/[^a-z0-9_-]+/gi,'-');}
async function run(file,presetKey){const preset=PRESETS[presetKey]||PRESETS.natural,buffer=await decode(file),r=processBuffer(buffer,preset);if(outputUrl)URL.revokeObjectURL(outputUrl);outputBlob=wav16(r.channels,r.sampleRate);outputUrl=URL.createObjectURL(outputBlob);outputName=baseName(file.name)+'-gap-removed-'+presetKey+'.wav';return Object.assign(r,{blob:outputBlob,url:outputUrl,fileName:outputName,preset});}
function canShare(){if(!outputBlob||typeof File==='undefined'||!navigator.share||!navigator.canShare)return false;try{return navigator.canShare({files:[new File([outputBlob],outputName,{type:'audio/wav'})]});}catch(e){return false;}}
async function share(){if(!canShare())throw new Error('Audio file sharing is not available in this browser.');await navigator.share({files:[new File([outputBlob],outputName,{type:'audio/wav'})],title:outputName});}
function install(){
  if(document.getElementById('doneRiteGapRemover'))return;
  const wrap=document.querySelector('.wrap')||document.body,card=document.createElement('div');card.id='doneRiteGapRemover';card.className='card';card.style.cssText='border-color:#58a6ff;background:#0b1522';
  card.innerHTML='<h2>🎙 Voiceover Gap Remover</h2><p class="help">Choose the voiceover you recorded. Creator OS shortens silence only — spoken sections keep their original volume, tone, pitch and speed.</p><input id="drGapFile" class="input" type="file" accept="audio/*,.m4a,.mp3,.wav,.aac"><label class="label">Gap style</label><select id="drGapPreset" class="select"><option value="natural">Natural — −38 dB / 320 ms / keep 160 ms</option><option value="tight">Tight — −34 dB / 220 ms / keep 100 ms</option></select><button id="drGapRun" class="button good">REMOVE VOICEOVER GAPS</button><div id="drGapStatus" class="help" style="margin-top:10px">No audio processed yet.</div><audio id="drGapPreview" controls style="display:none;width:100%;margin-top:10px"></audio><a id="drGapSave" class="button secondary" style="display:none;text-align:center;text-decoration:none" download>SAVE CLEAN VOICEOVER</a><button id="drGapShare" class="button secondary" style="display:none">SAVE / SHARE CLEAN VOICEOVER</button>';
  const adSetup=Array.from(document.querySelectorAll('.card')).find(x=>/Ad setup/i.test(x.textContent||''));if(adSetup)adSetup.insertAdjacentElement('afterend',card);else wrap.appendChild(card);
  const file=card.querySelector('#drGapFile'),preset=card.querySelector('#drGapPreset'),runBtn=card.querySelector('#drGapRun'),status=card.querySelector('#drGapStatus'),preview=card.querySelector('#drGapPreview'),save=card.querySelector('#drGapSave'),shareBtn=card.querySelector('#drGapShare');
  runBtn.addEventListener('click',async()=>{const f=file.files&&file.files[0];if(!f){status.textContent='Choose your voiceover audio file first.';return;}runBtn.disabled=true;runBtn.textContent='REMOVING GAPS…';status.textContent='Analyzing silence. Your spoken audio is not being normalized or compressed.';try{const r=await run(f,preset.value);preview.src=r.url;preview.style.display='block';save.href=r.url;save.download=r.fileName;save.style.display='block';shareBtn.style.display=canShare()?'block':'none';status.style.color='#56ec9c';status.textContent=r.gapCount+' gap'+(r.gapCount===1?'':'s')+' shortened • '+fmt(r.originalSeconds)+' → '+fmt(r.outputSeconds)+' • '+r.removedSeconds.toFixed(1)+' sec removed • '+r.preset.label+' preset';}catch(err){status.style.color='#ff7b86';status.textContent='Gap removal failed: '+err.message;}finally{runBtn.disabled=false;runBtn.textContent='REMOVE VOICEOVER GAPS';}});
  shareBtn.addEventListener('click',async()=>{try{await share();}catch(err){if(err&&err.name!=='AbortError')status.textContent='Share failed: '+err.message;}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else setTimeout(install,0);
window.DoneRiteOneClickGapRemover={version:VERSION,presets:PRESETS,run,install};
})();