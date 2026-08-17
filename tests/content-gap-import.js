const fs=require('fs');
const path=require('path');
const vm=require('vm');

function assert(condition,message){if(!condition)throw new Error(message)}
const root=path.join(__dirname,'..');

const importer=fs.readFileSync(path.join(root,'content-gap-import.html'),'utf8');
const importerScript=[...importer.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)][0][1];
const importerCut=importerScript.indexOf('function loadOCR');
assert(importerCut>0,'Could not isolate importer helpers');
const importerContext={localStorage:{getItem(){return null},setItem(){}}};
vm.createContext(importerContext);
vm.runInContext(`${importerScript.slice(0,importerCut)}\nthis.api={parseGrowthPercent,parseSearchVolume,extractRows,extractQualified,cleanupExisting};`,importerContext);
const api=importerContext.api;

assert(api.parseGrowthPercent('▲ 1,000%+')===1000,'1,000%+ growth was not parsed');
assert(api.parseGrowthPercent('54.7%')===54.7,'Decimal growth was not parsed');
assert(api.parseGrowthPercent('253K')==='','Volume was mistaken for growth');
assert(api.parseSearchVolume('253K').searches===253000,'253K volume was not parsed');
assert(api.parseSearchVolume('79.2K').searches===79200,'79.2K volume was not parsed');
assert(api.parseSearchVolume('123M').bad===true,'M-range legacy corruption was not flagged');

const rows=api.extractRows([
 'wireless microphone for content creators',
 '253K',
 'sparkline',
 '▲ 1000%+',
 'microphones for recording',
 '79.2K',
 '▲ 54.7%',
 'creator audio setup',
 '82K'
].join('\n'));
assert(rows.length===3,'List-view rows were not separated correctly');
assert(rows[0].searches===253000&&rows[0].searchIncreasePct===1000,'Phrase, volume and growth were not paired');
assert(rows[2].searchIncreasePct==='','Missing increase must be stored as empty, not zero');
const qualified=api.extractQualified([
 'wireless microphone for content creators','253K','▲ 1000%+',
 'microphones for recording','79.2K','▲ 54.7%'
].join('\n'));
assert(qualified.length===1&&qualified[0].phrase==='wireless microphone for content creators','1,000%+ filter failed');

const legacyStore={gapRows:[
 {phrase:'old imported phrase',source:'screenshot import',searches:123000000,searchVolumeLabel:'123M'},
 {phrase:'manual phrase',source:'manual'}
]};
importerContext.localStorage={
 getItem(){return JSON.stringify(legacyStore)},
 setItem(key,value){this.saved=JSON.parse(value)}
};
const review=api.cleanupExisting();
assert(review.preserved===2&&importerContext.localStorage.saved.gapRows.length===2,'Legacy review deleted rows');
assert(importerContext.localStorage.saved.gapRows[0].needsVolumeReview===true,'Legacy M volume was not flagged');
assert(importerContext.localStorage.saved.gapRows[0].searchIncreasePct==='','Missing growth was not normalized to empty');

const uploader=fs.readFileSync(path.join(root,'video-upload.html'),'utf8');
const uploaderScript=[...uploader.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)][0][1];
const elements=new Map();
for(const id of ['product','length','style','notes','gapStatus','files','shareAll','copyBrief','preview','previewCard','selected','status']){
 elements.set(id,{id,value:'',textContent:'',className:'',disabled:false,hidden:false,files:[],addEventListener(){}});
}
elements.get('product').value='Hollyland LARK A1';
elements.get('length').value='7 seconds';
elements.get('style').value='Product-only / faceless';
const uploaderData={gapRows:[
 {phrase:'microphones for recording',searchIncreasePct:1250},
 {phrase:'kitchen storage ideas',searchIncreasePct:9000},
 {phrase:'creator audio setup',searchIncreasePct:''}
]};
const uploaderContext={
 document:{getElementById:id=>elements.get(id)},
 localStorage:{getItem:key=>key==='done-rite-creator-os:v1'?JSON.stringify(uploaderData):null},
 window:{addEventListener(){}},navigator:{},URL,console
};
vm.createContext(uploaderContext);
vm.runInContext(`${uploaderScript}\nthis.api={bestGap,brief,relevance};`,uploaderContext);
assert(uploaderContext.api.relevance('Hollyland LARK A1','microphones for recording')>0,'Loose audio-topic match failed');
assert(uploaderContext.api.bestGap().phrase==='microphones for recording','Uploader chose an unrelated higher percentage');
const generated=uploaderContext.api.brief();
assert(generated.includes('Selected Content Gap phrase: microphones for recording'),'Video brief omitted exact phrase');
assert(generated.includes('Search increase: 1250%'),'Video brief omitted growth percentage');
assert(generated.includes('voiceover lines and timing'),'Video brief omitted voiceover play-by-play');

console.log('CONTENT_GAP_IMPORT_PASS');
