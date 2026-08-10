/* DONE RITE Creator OS — Media Vault / Cleanup Manager v1.0
   Safe design: indexes metadata for media the user selects. It never silently scans
   or deletes the iPhone Photos library. Original files stay under user control.
*/
(function(){
  'use strict';
  const KEY='done-rite-media-vault:v1';
  const DAY=86400000;
  const DEFAULTS={items:[],settings:{screenshotReviewDays:7,generalReviewDays:30}};
  const CATEGORIES=[
    'Product Photo','Product Video','TikTok Analytics Screenshot','Content Gap Screenshot',
    'Thumbnail','Creator OS Screenshot','Personal','Receipt / Document','Other'
  ];
  function load(){try{return Object.assign({},DEFAULTS,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return JSON.parse(JSON.stringify(DEFAULTS));}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));return s;}
  function uid(){return 'media-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);}
  function guess(file){
    const n=String(file.name||'').toLowerCase(), t=String(file.type||'').toLowerCase();
    if(t.startsWith('video/')) return 'Product Video';
    if(/content.?gap|search.?insight/.test(n)) return 'Content Gap Screenshot';
    if(/analytic|tiktok|studio|screenshot|screen.?shot/.test(n)) return 'TikTok Analytics Screenshot';
    if(/thumbnail|thumb/.test(n)) return 'Thumbnail';
    if(/receipt|invoice/.test(n)) return 'Receipt / Document';
    return t.startsWith('image/')?'Product Photo':'Other';
  }
  function policy(item,settings){
    if(item.protected||item.category==='Personal'||item.category==='Product Photo'||item.category==='Product Video') return 'Keep';
    if(item.processed && /Screenshot/.test(item.category)) return 'Safe to Delete';
    const age=(Date.now()-new Date(item.addedAt).getTime())/DAY;
    if(/Screenshot/.test(item.category)&&age>=settings.screenshotReviewDays) return 'Review';
    if(age>=settings.generalReviewDays) return 'Review';
    return 'Keep';
  }
  function addFiles(fileList){
    const s=load();
    Array.from(fileList||[]).forEach(file=>s.items.unshift({
      id:uid(),name:file.name||'Untitled',type:file.type||'',size:file.size||0,
      modifiedAt:file.lastModified?new Date(file.lastModified).toISOString():null,
      addedAt:new Date().toISOString(),category:guess(file),product:'',platform:'',
      processed:false,used:false,protected:false,note:'',originalNotStored:true
    }));
    save(s); return s.items;
  }
  function update(id,patch){const s=load();s.items=s.items.map(x=>x.id===id?Object.assign({},x,patch):x);save(s);return s.items.find(x=>x.id===id);}
  function removeIndex(id){const s=load();s.items=s.items.filter(x=>x.id!==id);save(s);return true;}
  function reviewQueue(){const s=load();return s.items.map(x=>Object.assign({},x,{cleanupStatus:policy(x,s.settings)})).filter(x=>x.cleanupStatus!=='Keep');}
  function summary(){const s=load(), q=reviewQueue();return {total:s.items.length,safeToDelete:q.filter(x=>x.cleanupStatus==='Safe to Delete').length,review:q.filter(x=>x.cleanupStatus==='Review').length,protected:s.items.filter(x=>x.protected).length};}
  function exportData(){return JSON.stringify(load(),null,2);}
  window.DoneRiteMediaVault={version:'1.0',categories:CATEGORIES,getState:load,addFiles,update,removeIndex,reviewQueue,summary,exportData,
    markProcessed:id=>update(id,{processed:true}),markUsed:id=>update(id,{used:true}),protect:id=>update(id,{protected:true}),
    IMPORTANT:'Safe to Delete is a recommendation only. Creator OS does not delete originals from Apple Photos.'};
})();