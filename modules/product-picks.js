/* DONE RITE Product Picks — local catalog engine v1.0 */
(function(){
'use strict';
const KEY='done-rite-product-picks:v1';
const DEFAULT={items:[]};
function load(){try{return Object.assign({},DEFAULT,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return JSON.parse(JSON.stringify(DEFAULT));}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s));return s;}
function uid(){return'pick-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);}
function add(x){const s=load();const row={id:uid(),name:String(x.name||'').trim(),category:String(x.category||'Gadgets').trim(),affiliateUrl:String(x.affiliateUrl||'').trim(),active:true,sort:Number(x.sort||999),createdAt:new Date().toISOString()};if(!row.name)throw new Error('Product name is required.');if(!/^https?:\/\//i.test(row.affiliateUrl))throw new Error('Affiliate URL is required.');s.items.push(row);save(s);return row;}
function update(id,patch){const s=load();s.items=s.items.map(x=>x.id===id?Object.assign({},x,patch):x);save(s);return true;}
function remove(id){const s=load();s.items=s.items.filter(x=>x.id!==id);save(s);return true;}
function grouped(){const s=load(),out={};s.items.filter(x=>x.active).sort((a,b)=>a.sort-b.sort).forEach(x=>{if(!out[x.category])out[x.category]=[];out[x.category].push(x);});return out;}
window.DoneRiteProductPicks={version:'1.0',getState:load,add,update,remove,grouped};
})();