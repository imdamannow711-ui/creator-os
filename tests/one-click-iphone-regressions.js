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
const stillComplianceSource=fs.readFileSync(path.join(root,'modules','still-image-compliance.js'),'utf8');
const languageComplianceSource=fs.readFileSync(path.join(root,'modules','content-language-compliance.js'),'utf8');
const editorWindow={addEventListener(){},dispatchEvent(){},crypto:null};
editorWindow.window=editorWindow;
const editorStorage=storage();
const editorContext={
  window:editorWindow,
  localStorage:editorStorage,
  document:{getElementById(){return null;},querySelector(){return null;},body:{appendChild(){}}},
  CustomEvent:function(type,options){this.type=type;this.detail=options&&options.detail;},
  URLSearchParams,Math,Date,console
};
vm.runInNewContext(stillComplianceSource,editorContext,{filename:'still-image-compliance.js'});
vm.runInNewContext(languageComplianceSource,editorContext,{filename:'content-language-compliance.js'});
vm.runInNewContext(editorSource,editorContext,{filename:'one-click-ad-editor.js'});
const editor=editorWindow.DoneRiteOneClickAdEditor;
assert(editor&&editor.version==='0.7','One-Click editor v0.7 did not load');
assert(editor.genericScriptWords.join(',')==='amazing,obsessed,perfect,literally,need','Specific-story word list changed');
for(let i=0;i<250;i++){
  const plan=editor.createPlan({productName:'Hollyland LARK A1 Combo Kit',verifiedFeature:'two microphones and two receiver options in one case',durationSeconds:7});
  assert(plan.writingPolicy&&plan.writingPolicy.hookFlags.length===0&&plan.writingPolicy.ctaFlags.length===0,'Generated plan used a generic script word');
  assert(plan.stillImagePolicy&&plan.stillImagePolicy.affiliateVideoRules.length>=10,'Generated plan lost the still-image rules');
  assert(plan.languagePolicy&&Array.isArray(plan.languagePolicy.flags),'Generated plan lost the language review');
  assert(plan.packaging.hashtags.length<=5&&plan.packaging.hashtags[0]==='#ad','Generated package broke the five-hashtag #ad rule');
}
const compliancePlan=editor.createPlan({productName:'Charging Cable',verifiedFeature:'four connectors',hook:'This iPhone dupe gives guaranteed overnight results',durationSeconds:15,hashtags:['#One','#Two','#Three','#Four','#Five','#Six']});
assert(compliancePlan.languagePolicy.flags.some(flag=>flag.includes('“iphone”')),'Generated plan did not flag the unrelated iPhone reference');
assert(compliancePlan.languagePolicy.flags.some(flag=>flag.includes('“dupe”')),'Generated plan did not flag dupe wording');
assert(compliancePlan.packaging.hashtags.length===5&&compliancePlan.packaging.hashtags[0]==='#ad','Generated package did not enforce the five-hashtag #ad maximum');
const compactUrl=editor.teleprompterUrl(compliancePlan);
assert(compactUrl.length<2000&&compactUrl.includes('handoff=1'),'Compliance handoff recreated the oversized Teleprompter URL');
const handoff=JSON.parse(editorStorage.getItem('done-rite-one-click-teleprompter-handoff:v1'));
assert(handoff.stillrules.includes('UNREALISTIC-EXPECTATION RULES'),'Stored Teleprompter handoff lost the compliance rules');

console.log('ONE_CLICK_IPHONE_REGRESSIONS_PASS');
