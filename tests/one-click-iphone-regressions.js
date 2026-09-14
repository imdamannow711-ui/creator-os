const fs=require('fs');
const path=require('path');
const vm=require('vm');

function assert(value,message){if(!value)throw new Error(message);}
const root=path.join(__dirname,'..');

function storage(){
  const values=new Map();
  return {getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
}

const gapSource=fs.readFileSync(path.join(root,'modules','one-click-gap-remover.js'),'utf8');
const gapWindow={addEventListener(){}};
const gapContext={
  window:gapWindow,
  document:{readyState:'loading',addEventListener(){}},
  localStorage:storage(),
  navigator:{},
  URL:{revokeObjectURL(){},createObjectURL(){return'blob:test';}},
  Blob,File:global.File,
  console
};
vm.runInNewContext(gapSource,gapContext,{filename:'one-click-gap-remover.js'});
const gap=gapWindow.DoneRiteOneClickGapRemover;
assert(gap&&gap.version==='0.8','Gap-remover v0.8 did not load');

function audioBuffer(seconds,amplitude){
  const sampleRate=1000,length=seconds*sampleRate,data=new Float32Array(length);data.fill(amplitude);
  return {sampleRate,length,duration:seconds,numberOfChannels:1,getChannelData(){return data;}};
}
const quietSpeech=gap.processBuffer(audioBuffer(2,.002),gap.presets.speechSafe);
assert(quietSpeech.gapCount===0&&quietSpeech.outputSeconds===2,'Speech Safe removed low-volume speech');
const longSilence=gap.processBuffer(audioBuffer(2,0),gap.presets.speechSafe);
assert(longSilence.gapCount===1,'Speech Safe did not recognize a long near-silent pause');
assert(longSilence.outputSeconds>=.59&&longSilence.outputSeconds<=.61,'Speech Safe did not preserve its 600 ms pause cushion');

const editorSource=fs.readFileSync(path.join(root,'modules','one-click-ad-editor.js'),'utf8');
const editorWindow={addEventListener(){},dispatchEvent(){},crypto:null};
editorWindow.window=editorWindow;
const editorContext={
  window:editorWindow,
  localStorage:storage(),
  document:{getElementById(){return null;},querySelector(){return null;},body:{appendChild(){}}},
  CustomEvent:function(type,options){this.type=type;this.detail=options&&options.detail;},
  URLSearchParams,Math,Date,console
};
vm.runInNewContext(editorSource,editorContext,{filename:'one-click-ad-editor.js'});
const editor=editorWindow.DoneRiteOneClickAdEditor;
assert(editor&&editor.version==='0.6','One-Click editor v0.6 did not load');
assert(editor.genericScriptWords.join(',')==='amazing,obsessed,perfect,literally,need','Specific-story word list changed');
for(let i=0;i<250;i++){
  const plan=editor.createPlan({productName:'Hollyland LARK A1 Combo Kit',verifiedFeature:'two microphones and two receiver options in one case',durationSeconds:7});
  assert(plan.writingPolicy&&plan.writingPolicy.hookFlags.length===0&&plan.writingPolicy.ctaFlags.length===0,'Generated plan used a generic script word');
}

console.log('ONE_CLICK_IPHONE_REGRESSIONS_PASS');
