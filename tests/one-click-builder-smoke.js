const fs=require('fs');
const path=require('path');
const vm=require('vm');

function assert(condition,message){if(!condition)throw new Error(message);}
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'one-click-ad-dev.html'),'utf8');
const executor=fs.readFileSync(path.join(root,'modules','one-click-browser-executor.js'),'utf8');
const mediaStage=fs.readFileSync(path.join(root,'modules','one-click-media-stage.js'),'utf8');
const gapRemover=fs.readFileSync(path.join(root,'modules','one-click-gap-remover.js'),'utf8');
const builder=fs.readFileSync(path.join(root,'modules','one-click-builder-ui.js'),'utf8');
const css=fs.readFileSync(path.join(root,'styles','one-click-builder.css'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');

const inlineScripts=[...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)].map(match=>match[1]);
inlineScripts.forEach((script,index)=>new vm.Script(script,{filename:'one-click-inline-'+index+'.js'}));
new vm.Script(executor,{filename:'one-click-browser-executor.js'});
new vm.Script(mediaStage,{filename:'one-click-media-stage.js'});
new vm.Script(gapRemover,{filename:'one-click-gap-remover.js'});
new vm.Script(builder,{filename:'one-click-builder-ui.js'});

assert(html.includes('styles/one-click-builder.css'),'One-Click visual stylesheet is not loaded');
assert(html.includes('modules/one-click-builder-ui.js'),'One-Click workflow controller is not loaded');
assert(html.includes('modules/one-click-builder-ui.js?v=20260912-freeze-fix-1'),'One-Click workflow controller cache key was not refreshed after the freeze fix');
assert(html.includes('window.DoneRiteOneClickProjectFiles=files'),'Canonical project-file provider is missing');
assert(html.includes("done-rite-one-click-project-files"),'Project-file synchronization event is missing');
assert(executor.includes("typeof window.DoneRiteOneClickProjectFiles==='function'"),'Trim UI does not read canonical project clips');
assert(executor.includes("window.addEventListener('done-rite-one-click-project-files'"),'Trim UI does not react to project clip changes');
assert(executor.includes("preview.preload='metadata'"),'Long-clip preview must request metadata without preloading the full video');
assert(executor.includes('function requestSync(previewIndex)'),'Clip refresh events must be debounced so iPhone metadata handlers are not replaced');
assert(executor.includes('detachMeta(onMetadata)'),'Stale metadata callbacks must detach only themselves');
assert(mediaStage.includes("video.preload='metadata'"),'Long-clip inspection must use metadata-only loading');
assert(html.includes('id="addClips"'),'Raw clips need a clear add-more control instead of a misleading empty native picker');
assert(html.includes('id="selectedVoiceoverBox"'),'Selected-hook voiceover panel is missing');
assert(html.includes('publishSelectedVoiceover(plan,selection,list)'),'Selected-hook voiceover is not connected to the chosen edit');
assert(gapRemover.includes('setSelectedScript'),'Selected-hook script is not connected to Voiceover tools');
assert(gapRemover.includes('done-rite-selected-voiceover'),'Voiceover tools do not react to the selected-hook script');
for(const stage of ['create','upload','text','voiceover','trim','sfx','render','export'])assert(builder.includes("id:'"+stage+"'"),'Missing workflow stage: '+stage);
assert(builder.includes("api.studioUrl"),'Text stage is not connected to Script Studio');
assert(builder.includes("loadGapRemover"),'Voiceover stage is not connected');
assert(builder.includes("loadCreativeControls"),'SFX stage is not connected');
assert(builder.includes('function setText(el,value){if(el&&el.textContent!==value)'),'Status text writes must stay idempotent to prevent a MutationObserver loop');
assert(builder.includes("button.classList.contains('is-ready')!==!!on"),'Ready-state class writes must stay idempotent to prevent a MutationObserver loop');
assert(css.includes('.dr-workflow-rail'),'Workflow rail styling is missing');
assert(sw.includes('styles/one-click-builder.css')&&sw.includes('modules/one-click-builder-ui.js'),'New One-Click assets are not cached for offline use');
assert(sw.includes('done-rite-v29-long-clip-voiceover'),'Service-worker cache was not refreshed after the long-clip and voiceover fixes');

console.log('ONE_CLICK_BUILDER_SMOKE_PASS');
