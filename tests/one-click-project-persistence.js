const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const path=require('path');

const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'modules/one-click-project-store.js'),'utf8');
const context={
  window:{dispatchEvent(){}},
  localStorage:{getItem(){return null;},setItem(){}},
  indexedDB:undefined,
  CustomEvent:function(type,init){this.type=type;this.detail=init&&init.detail;},
  crypto:require('crypto').webcrypto,
  Date,Math,Promise,Set,Map,Array,Number,String,Error,Blob,
  setTimeout,clearTimeout
};
vm.createContext(context);vm.runInContext(source,context);
const store=context.window.DoneRiteOneClickProjectStore;
assert(store,'project store API should load');

function file(name,size,lastModified){return {name,size,lastModified,type:'video/mp4'};}
const first=[file('a.mov',10,1),file('b.mov',20,2)];
let result=store.mergeFiles([],first,20);
assert.strictEqual(result.files.length,2);
assert.strictEqual(result.added,2);

result=store.mergeFiles(result.files,[file('a.mov',10,1),file('c.mov',30,3)],20);
assert.strictEqual(result.files.length,3,'later picks retain earlier clips');
assert.strictEqual(result.duplicates,1,'duplicate clip is suppressed');
result.files=store.removeFromList(result.files,store.fileKey(file('b.mov',20,2)));
assert.deepStrictEqual(Array.from(result.files,item=>item.name),['a.mov','c.mov'],'removing one clip leaves the others');

const overflow=Array.from({length:25},(_,i)=>file('clip-'+i+'.mov',100+i,100+i));
result=store.mergeFiles([],overflow,20);
assert.strictEqual(result.files.length,20,'clip cap remains 20');
assert.strictEqual(result.overflow,5,'overflow reports only clips not added');

const html=fs.readFileSync(path.join(root,'one-click-ad-dev.html'),'utf8');
const executor=fs.readFileSync(path.join(root,'modules/one-click-browser-executor.js'),'utf8');
const gap=fs.readFileSync(path.join(root,'modules/one-click-gap-remover.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert(html.includes('one-click-project-store.js'));
assert(html.includes('SAVE AS NEW VIDEO VERSION'));
assert(html.includes("clipStore.removeFile(fileKey(file))"));
assert(html.includes('id="productListing"'));
assert(executor.includes('projectStore.getFiles()'));
assert(!executor.includes('function list(){return Array.from(input.files||[]);}'));
assert(gap.includes('saveForProject'));
assert(gap.includes('restoreProjectVoiceover'));
assert(sw.includes('./modules/one-click-project-store.js'));

console.log('One-Click project persistence regression checks passed.');
