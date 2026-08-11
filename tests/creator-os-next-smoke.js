const fs=require('fs'),vm=require('vm'),path=require('path');
const store=new Map();
global.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
global.window=global;
const files=['creator-os-next-config.js','media-vault.js','content-gap-demand.js','hook-ranking.js','hands-only-quick-create.js','youtube-amazon.js','product-picks.js','performance-engine.js','cross-platform-package.js','daily-hq.js','self-test.js'];
for(const f of files){const p=path.join(__dirname,'..','modules',f);vm.runInThisContext(fs.readFileSync(p,'utf8'),{filename:p});}
const result=DoneRiteSelfTest.run();
console.log(JSON.stringify(result,null,2));
if(!result.pass)process.exit(1);
// Additional state tests
const prod=DoneRiteYouTubeAmazon.addProduct({name:'Test Gadget',affiliateUrl:'https://www.amazon.com/dp/TEST?tag=donerite02-20'});
if(prod.trackingId!=='donerite02-20')throw new Error('Amazon tracking ID default failed');
DoneRiteYouTubeAmazon.queueShort({productId:prod.id,productName:prod.name,slot:'Morning'});
if(DoneRiteYouTubeAmazon.getState().queue.length!==1)throw new Error('YouTube queue failed');
DoneRiteProductPicks.add({name:prod.name,category:'Gadgets',affiliateUrl:prod.affiliateUrl});
if(!DoneRiteProductPicks.grouped().Gadgets)throw new Error('Product Picks grouping failed');
const perf=DoneRitePerformance.add({platform:'TikTok Shop',product:'Test Gadget',format:'Hands Only',views:400,avgWatchTime:3,completionRate:10,shares:2,saves:1,attribution:'Showcase',orders:1,commission:2});
if(DoneRiteHookRanking.score(perf).label==='Sales Winner')throw new Error('Showcase sale incorrectly credited to video hook');
console.log('CREATOR_OS_NEXT_SMOKE_PASS');