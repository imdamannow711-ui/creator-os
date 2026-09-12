/* DONE RITE Creator OS Next — analytics baseline seed v2.0
   Historical rows below come only from creator-provided TikTok Shop screenshots.
   Do not infer hooks, format, commission, or funnel stage when the screenshot does not show them. */
(function(){
'use strict';
const KEY='done-rite-performance:v1';
const VERIFIED=[
 {id:'baseline-noco-xgrid-373',platform:'TikTok Shop',product:'NOCO XGRID 3-in-1 charging dock',format:'Hands Only',hook:'',funnel:'Unknown',views:373,engagedViews:0,avgWatchTime:2.8,completionRate:0.76,likes:0,comments:0,shares:3,saves:1,clicks:0,orders:0,commission:0,attribution:'Unknown',date:'2026-08-10',note:'TikTok video analytics baseline: 64.1-second video. Keep separate from TikTok Shop attributed-view metrics.',videoAttributedSale:false},
 {id:'verified-2026-06-laptop',platform:'TikTok Shop',product:'15.6-inch laptop, N95 quad-core…',format:'Legacy/Unknown',hook:'Why is NOBODY talking about this laptop??',funnel:'Unknown',views:934,engagedViews:0,avgWatchTime:0,completionRate:0,likes:0,comments:0,shares:0,saves:0,clicks:0,orders:1,commission:0,attribution:'Video',date:'2026-06-25',durationSeconds:12,attributedGMV:258.06,note:'Verified from TikTok Shop June 2026 video screenshot. Commission not shown.',videoAttributedSale:true},
 {id:'verified-2026-06-goli',platform:'TikTok Shop',product:"Goli's wellness bundle",format:'Legacy/Unknown',hook:'',funnel:'Unknown',views:247,engagedViews:0,avgWatchTime:0,completionRate:0,likes:0,comments:0,shares:0,saves:0,clicks:0,orders:1,commission:0,attribution:'Video',date:'2026-06-02',durationSeconds:12,attributedGMV:89.07,note:'Verified historical sale. Wellness product is legacy data only; do not use it to recommend future wellness content.',videoAttributedSale:true},
 {id:'verified-2026-06-hohem-x3se',platform:'TikTok Shop',product:'Hohem iSteady X3SE 3-axis smartphone gimbal',format:'Legacy/Unknown',hook:'',funnel:'Unknown',views:192,engagedViews:0,avgWatchTime:0,completionRate:0,likes:0,comments:0,shares:0,saves:0,clicks:0,orders:1,commission:0,attribution:'Video',date:'2026-05-31',durationSeconds:5,attributedGMV:43.99,note:'Sale appears in June 1–30 TikTok Shop attribution window; video thumbnail dated May 31.',videoAttributedSale:true},
 {id:'verified-2026-06-lark-a1',platform:'TikTok Shop',product:'Hollyland Lark A1 mini microphone',format:'Legacy/Unknown',hook:'',funnel:'Unknown',views:128,engagedViews:0,avgWatchTime:0,completionRate:0,likes:0,comments:0,shares:0,saves:0,clicks:0,orders:1,commission:0,attribution:'Video',date:'2026-06-03',durationSeconds:97,attributedGMV:35.63,note:'Verified from TikTok Shop June 2026 video screenshot.',videoAttributedSale:true},
 {id:'verified-2026-06-rayhaan',platform:'TikTok Shop',product:'Rayhaan Nocturno Elixir',format:'Legacy/Unknown',hook:'',funnel:'Unknown',views:118,engagedViews:0,avgWatchTime:0,completionRate:0,likes:0,comments:0,shares:0,saves:0,clicks:0,orders:1,commission:0,attribution:'Video',date:'2026-06-03',durationSeconds:12,attributedGMV:30.80,note:'Verified from TikTok Shop June 2026 video screenshot.',videoAttributedSale:true},
 {id:'verified-2026-06-monster-ac530',platform:'TikTok Shop',product:'Monster AC530 open-ear headphones',format:'Legacy/Unknown',hook:'',funnel:'Unknown',views:28,engagedViews:0,avgWatchTime:0,completionRate:0,likes:0,comments:0,shares:0,saves:0,clicks:0,orders:1,commission:0,attribution:'Video',date:'2026-05-21',durationSeconds:30,attributedGMV:29.99,note:'Sale appears in June 1–30 TikTok Shop attribution window; video thumbnail dated May 21.',videoAttributedSale:true},
 {id:'verified-2026-07-outlet-extender',platform:'TikTok Shop',product:'Outlet extender',format:'Legacy/Unknown',hook:'This outlet extender does e…',funnel:'Unknown',views:127,engagedViews:0,avgWatchTime:0,completionRate:0,likes:0,comments:0,shares:0,saves:0,clicks:0,orders:1,commission:0,attribution:'Video',date:'2026-06-10',durationSeconds:17,attributedGMV:17.99,note:'Verified in TikTok Shop July 1–31 attribution screen. Visible title is truncated, so do not treat the partial title as a reusable hook.',videoAttributedSale:true}
];
const PERIODS={
 june2026:{period:'2026-06-01/2026-06-30',attributedGMV:487.54,views:13100,videoCount:38,itemsSold:6,skuOrders:5,source:'TikTok Shop screenshot'},
 july2026:{period:'2026-07-01/2026-07-31',itemsSold:1,skuOrders:1,source:'TikTok Shop screenshot'},
 august7d:{period:'2026-08-03/2026-08-09',contentViews:475,customers:1,itemsSold:1,attributedGMV:17,estimatedCommission:0,exposurePlusExtraViews:676,source:'TikTok Shop screenshots',note:'Product/video for this sale is not identified in the supplied screen; do not assign it to a hook.'},
 aprilProducts:[
  {product:'HEYDUDE Wally Cozy Plaid',attributedGMV:32.81,itemsSold:1},
  {product:'Lattafa Opulent Dubai EDP',attributedGMV:29.42,itemsSold:1}
 ]
};
function seed(){
 try{
  const s=JSON.parse(localStorage.getItem(KEY)||'{"rows":[]}');s.rows=s.rows||[];
  const ids=new Set(s.rows.map(r=>r.id));let added=0;
  VERIFIED.slice().reverse().forEach(r=>{if(!ids.has(r.id)){s.rows.unshift(r);ids.add(r.id);added++;}});
  s.verifiedPeriods=Object.assign({},s.verifiedPeriods||{},PERIODS);
  localStorage.setItem(KEY,JSON.stringify(s));return added;
 }catch(e){return 0;}
}
window.DoneRiteAnalyticsBaseline={version:'2.0',seed,verifiedRows:VERIFIED,verifiedPeriods:PERIODS};
})();