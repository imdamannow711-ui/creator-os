/* DONE RITE Creator OS — One-Click Builder UI v0.2
   Functional navigation shell inspired by the approved future-design concept.
*/
(function(){
'use strict';
const VERSION='0.2';
const STAGES=[
  {id:'create',icon:'✦',label:'CREATE'},
  {id:'upload',icon:'☁',label:'UPLOAD'},
  {id:'text',icon:'T',label:'TEXT'},
  {id:'voiceover',icon:'🎙',label:'VOICEOVER'},
  {id:'trim',icon:'✂',label:'AUTO TRIM'},
  {id:'sfx',icon:'▥',label:'SFX'},
  {id:'render',icon:'⚙',label:'RENDER'},
  {id:'export',icon:'⇧',label:'EXPORT'}
];
let toastTimer=null;
function id(value){return document.getElementById(value);}
function files(){try{return typeof window.DoneRiteOneClickProjectFiles==='function'?Array.from(window.DoneRiteOneClickProjectFiles()||[]):Array.from(id('video')?.files||[]);}catch(e){return[];}}
function announce(message){let toast=id('drStageToast');if(!toast){toast=document.createElement('div');toast.id='drStageToast';toast.className='dr-stage-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.appendChild(toast);}toast.textContent=message;toast.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),3000);}
function scrollToElement(el){if(!el)return false;el.scrollIntoView({behavior:'smooth',block:'start'});const focusable=el.querySelector('input:not([disabled]),select:not([disabled]),button:not([disabled]),a[href]');if(focusable)setTimeout(()=>focusable.focus({preventScroll:true}),380);return true;}
function loadAndFind(loaderName,targetId,message){const api=window.DoneRiteOneClickCameraHandoff;if(api&&typeof api[loaderName]==='function')api[loaderName]();let tries=0;const timer=setInterval(()=>{const target=id(targetId);if(target){clearInterval(timer);scrollToElement(target);update();return;}if(++tries>20){clearInterval(timer);announce(message);}},75);}
function studioUrl(){const api=window.DoneRiteOneClickCameraHandoff;return api&&typeof api.studioUrl==='function'?api.studioUrl():'teleprompter-script-studio.html';}
function requestedStage(){try{const value=new URLSearchParams(location.search).get('stage')||'';return STAGES.some(stage=>stage.id===value)?value:'';}catch(e){return'';}}
function runStage(stage){
  document.querySelectorAll('.dr-stage-button').forEach(button=>button.removeAttribute('aria-current'));
  const active=document.querySelector('[data-dr-stage="'+stage+'"]');if(active)active.setAttribute('aria-current','step');
  if(stage==='create'){scrollToElement(id('createCard'));return;}
  if(stage==='upload'){
    const input=id('video');
    if(!input)return announce('The raw-clip picker is unavailable.');
    if(input.disabled){scrollToElement(id('systemCard'));announce('Run the iPhone system check first.');return;}
    input.click();return;
  }
  if(stage==='text'){location.assign(studioUrl());return;}
  if(stage==='voiceover'){loadAndFind('loadGapRemover','doneRiteGapRemover','Voiceover tools are still loading.');return;}
  if(stage==='trim'){
    if(!files().length){runStage('upload');announce('Add at least one clip before trimming.');return;}
    window.dispatchEvent(new CustomEvent('done-rite-one-click-project-files',{detail:{files:files(),previewIndex:0}}));
    if(!scrollToElement(id('doneRiteClipReview')))announce('Trim controls are still loading.');return;
  }
  if(stage==='sfx'){loadAndFind('loadCreativeControls','doneRiteCreativeControls','Text and sound controls are still loading.');return;}
  if(stage==='render'){
    const result=id('resultCard'),button=id('renderBtn');
    if(result&&result.style.display!=='none'){scrollToElement(result);return;}
    scrollToElement(id('createCard'));announce('Build the edit plan first, then Render becomes available.');return;
  }
  if(stage==='export'){
    const box=id('renderBox');
    if(box&&box.style.display!=='none'){scrollToElement(box);return;}
    runStage('render');announce('Render the finished video before exporting.');
  }
}
function makeHero(){const hero=document.createElement('section');hero.className='dr-builder-hero';hero.innerHTML='<div class="dr-builder-kicker">DONE RITE CREATOR OS</div><h1>One‑Click <strong>Ad Builder</strong></h1><p class="dr-builder-tagline">Ideas to impact—in one connected workflow.</p>';return hero;}
function makeRail(){const rail=document.createElement('nav');rail.className='dr-workflow-rail';rail.setAttribute('aria-label','One-Click workflow');STAGES.forEach(stage=>{const button=document.createElement('button');button.type='button';button.className='dr-stage-button';button.dataset.drStage=stage.id;button.innerHTML='<span class="dr-stage-icon" aria-hidden="true">'+stage.icon+'</span>'+stage.label;button.addEventListener('click',()=>runStage(stage.id));rail.appendChild(button);});return rail;}
function makeStatus(){const status=document.createElement('div');status.className='dr-builder-status';status.innerHTML='<div class="dr-status-chip"><span>PROJECT<br><b id="drUiClipCount">0 clips</b></span></div><div class="dr-status-chip"><span>VOICE<br><b>Original preserved</b></span></div><div class="dr-status-chip"><span>SESSION<br><b id="drUiSaveState">Local save ready</b></span></div>';return status;}
function update(){
  const count=files().length,countEl=id('drUiClipCount');if(countEl)countEl.textContent=count+' clip'+(count===1?'':'s');
  const save=id('sessionSave'),saveEl=id('drUiSaveState');if(saveEl)saveEl.textContent=save&&/saved|restored/i.test(save.textContent||'')?'Saved locally':'Local save ready';
  const result=id('resultCard'),renderBox=id('renderBox');
  const ready={upload:count>0,trim:count>0,render:!!result&&result.style.display!=='none',export:!!renderBox&&renderBox.style.display!=='none',voiceover:!!id('doneRiteGapRemover'),sfx:!!id('doneRiteCreativeControls')};
  Object.keys(ready).forEach(key=>{const button=document.querySelector('[data-dr-stage="'+key+'"]');if(button)button.classList.toggle('is-ready',ready[key]);});
}
function install(){
  if(id('drOneClickBuilderHero'))return;
  const wrap=document.querySelector('.wrap');if(!wrap)return;
  const hero=makeHero();hero.id='drOneClickBuilderHero';
  const nav=id('doneRiteOneClickNav');if(nav)nav.insertAdjacentElement('afterend',hero);else wrap.insertBefore(hero,wrap.firstChild);
  hero.insertAdjacentElement('afterend',makeRail());
  document.querySelector('.dr-workflow-rail').insertAdjacentElement('afterend',makeStatus());
  const observer=new MutationObserver(update);observer.observe(wrap,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']});
  document.addEventListener('change',update,true);window.addEventListener('done-rite-one-click-project-files',update);window.addEventListener('done-rite-one-click-plan',()=>setTimeout(update,0));
  update();
  const requested=requestedStage();if(requested)setTimeout(()=>runStage(requested),180);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,40),{once:true});else setTimeout(install,40);
window.DoneRiteOneClickBuilderUI={version:VERSION,install,runStage,update};
})();
