/* DONE RITE Creator OS Next — analytics baseline seed v1.0 */
(function(){
'use strict';
const KEY='done-rite-performance:v1';
function seed(){try{const s=JSON.parse(localStorage.getItem(KEY)||'{"rows":[]}');if((s.rows||[]).some(r=>r.id==='baseline-noco-xgrid-373'))return false;s.rows=s.rows||[];s.rows.unshift({id:'baseline-noco-xgrid-373',platform:'TikTok Shop',product:'NOCO XGRID 3-in-1 charging dock',format:'Hands Only',hook:'',funnel:'Unknown',views:373,engagedViews:0,avgWatchTime:2.8,completionRate:0.76,likes:0,comments:0,shares:3,saves:1,clicks:0,orders:0,commission:0,attribution:'Unknown',date:'2026-08-10',note:'64.1-second baseline video; next test should be 7–10 seconds.',videoAttributedSale:false});localStorage.setItem(KEY,JSON.stringify(s));return true;}catch(e){return false;}}
window.DoneRiteAnalyticsBaseline={version:'1.0',seed};
})();