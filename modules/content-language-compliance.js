/* DONE RITE Creator OS — High-Risk Language Dictionary v1.0
   TikTok does not publish one universal banned-word list. These terms are
   blocked or flagged under DONE RITE's stricter affiliate-content rules. */
(function(){
'use strict';
const VERSION='1.0';
const GROUPS={
  counterfeit:['dupe','duped','dupes','replica','knockoff','counterfeit','fake designer','mirror copy','inspired copy'],
  unrelatedBrands:['iphone','ipad','airpods','macbook','apple watch','galaxy','samsung','pixel','google pixel'],
  priceOffer:['price','cost','cheap','cheapest','lowest price','discount','sale','coupon','promo code','save money','percent off','% off','free'],
  falseScarcity:['only a few left','selling out','ends tonight','today only','last chance','while supplies last','limited time','act now'],
  absolutePerformance:['guaranteed','guarantee','instantly','instant','100%','perfect','flawless','never fails','works every time','best ever','fastest','strongest'],
  medicalTreatment:['cure','cures','treat','treats','prevent','prevents','heal','heals','reverse','eliminate disease','doctor recommended'],
  weightBody:['lose weight','weight loss','burn fat','fat burner','melt fat','drop pounds','muscle gain','body transformation'],
  unsupportedAuthority:['clinically proven','scientifically proven','lab tested','expert approved','certified safe','officially endorsed'],
  comparative:['better than','beats every','number one','#1','the best on the market','competitor'],
  unrealisticResults:['miracle','overnight results','permanent results','life changing results','impossible results','before and after']
};
const LABELS={counterfeit:'Counterfeit or imitation wording',unrelatedBrands:'Unrelated brand/device name',priceOffer:'Price or promotional wording',falseScarcity:'Unverified urgency or scarcity',absolutePerformance:'Absolute performance claim',medicalTreatment:'Medical treatment claim',weightBody:'Weight or body-transformation claim',unsupportedAuthority:'Unsupported authority, testing, or certification',comparative:'Comparative or ranking claim',unrealisticResults:'Unrealistic result or transformation claim'};
function clean(value){return String(value==null?'':value);}
function exactProductTokens(productName){return clean(productName).toLowerCase().split(/[^a-z0-9]+/).filter(token=>token.length>2);}
function hasTerm(text,term){return new RegExp('(^|[^a-z0-9])'+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+')+'([^a-z0-9]|$)','i').test(text);}
function review(text,options){options=options||{};const body=clean(text),product=clean(options.productName).toLowerCase(),flags=[];Object.keys(GROUPS).forEach(group=>GROUPS[group].forEach(term=>{if(!hasTerm(body,term))return;if(group==='unrelatedBrands'&&(product.includes(term)||exactProductTokens(product).includes(term)))return;const message=LABELS[group]+': “'+term+'”';if(!flags.includes(message))flags.push(message);}));return {version:VERSION,status:flags.length?'FIX_BEFORE_RECORDING':'NO_DICTIONARY_FLAGS',flags};}
window.DoneRiteContentLanguageCompliance={version:VERSION,groups:Object.keys(GROUPS).reduce((out,key)=>(out[key]=GROUPS[key].slice(),out),{}),review};
})();
