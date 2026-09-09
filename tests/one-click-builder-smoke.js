const fs=require('fs');
const path=require('path');
const vm=require('vm');

function assert(condition,message){if(!condition)throw new Error(message);}
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'one-click-ad-dev.html'),'utf8');
const executor=fs.readFileSync(path.join(root,'modules','one-click-browser-executor.js'),'utf8');
const builder=fs.readFileSync(path.join(root,'modules','one-click-builder-ui.js'),'utf8');
const css=fs.readFileSync(path.join(root,'styles','one-click-builder.css'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');

const inlineScripts=[...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)].map(match=>match[1]);
inlineScripts.forEach((script,index)=>new vm.Script(script,{filename:'one-click-inline-'+index+'.js'}));
new vm.Script(executor,{filename:'one-click-browser-executor.js'});
new vm.Script(builder,{filename:'one-click-builder-ui.js'});

assert(html.includes('styles/one-click-builder.css'),'One-Click visual stylesheet is not loaded');
assert(html.includes('modules/one-click-builder-ui.js'),'One-Click workflow controller is not loaded');
assert(html.includes('window.DoneRiteOneClickProjectFiles=files'),'Canonical project-file provider is missing');
assert(html.includes("done-rite-one-click-project-files"),'Project-file synchronization event is missing');
assert(executor.includes("typeof window.DoneRiteOneClickProjectFiles==='function'"),'Trim UI does not read canonical project clips');
assert(executor.includes("window.addEventListener('done-rite-one-click-project-files'"),'Trim UI does not react to project clip changes');
for(const stage of ['create','upload','text','voiceover','trim','sfx','render','export'])assert(builder.includes("id:'"+stage+"'"),'Missing workflow stage: '+stage);
assert(builder.includes("api.studioUrl"),'Text stage is not connected to Script Studio');
assert(builder.includes("loadGapRemover"),'Voiceover stage is not connected');
assert(builder.includes("loadCreativeControls"),'SFX stage is not connected');
assert(css.includes('.dr-workflow-rail'),'Workflow rail styling is missing');
assert(sw.includes('styles/one-click-builder.css')&&sw.includes('modules/one-click-builder-ui.js'),'New One-Click assets are not cached for offline use');
assert(sw.includes('done-rite-v26-one-click-builder-ui'),'Service-worker cache was not refreshed');

console.log('ONE_CLICK_BUILDER_SMOKE_PASS');
