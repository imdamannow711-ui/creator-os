/* DONE RITE Creator OS Next — approved operating rules v1.0 */
(function(){
  'use strict';
  const CFG={
    version:'1.0',
    production:{
      mode:'hands-only',
      defaultDurationSeconds:{min:7,max:10},
      oneVideoOneSellingPoint:true,
      aiVideoDefault:false,
      thumbnail:{source:'real-product-photo',aiEnhancementAllowed:true,preserveProductAccuracy:true}
    },
    categories:{
      enabled:['Electronics & Gadgets','Kitchen','Home','Outdoor','Apparel','Tools','Lifestyle'],
      excludedByDefault:['Wellness & Supplements','Oral & Dental','Skincare','Body-Applied Products','Kids\' Products']
    },
    contentGap:{
      prioritySearches:1000,
      watchlistMinSearches:750,
      ignoreBelow:750,
      classify:function(searches){
        searches=Number(searches||0);
        if(searches>=1000) return 'Priority';
        if(searches>=750) return 'Watchlist';
        return 'Ignore';
      }
    },
    hooks:{
      attributionLevels:['Engagement Performer','Video-Attributed Sale','LIVE Sale','Showcase Sale','Unknown Attribution'],
      winnerRules:{
        strongPerformer:'engagement or retention only; no sale claim',
        salesWinner:'at least one verified video-attributed sale tied to this hook',
        provenWinner:'repeated verified video-attributed sales across multiple posts/tests'
      },
      priorityOrder:['Proven Winner','Sales Winner','Strong Performer','Current BOF Research','Current MOF Research','Current TOF Research','General Library']
    },
    youtube:{
      dailySlots:['Morning','Afternoon','Evening'],
      defaultPostsPerDay:3,
      track:['views','engagedViews','likes','comments','shares','saves','clicks','orders','commission','hook','funnel']
    },
    amazon:{
      primaryTrackingId:'donerite02-20',
      secondaryTrackingId:'donerite0e-20',
      disclosure:'As an Amazon Associate I earn from qualifying purchases.',
      productPicksPage:true
    },
    crossPlatform:{platforms:['TikTok Shop','YouTube Shorts','Instagram Reels','Facebook Reels','Pinterest']},
    compliance:{
      noPricing:true,noCompetitorPromotion:true,noUnsupportedClaims:true,noFalseScarcity:true,
      noAbsolutePerformanceClaims:true,affiliateHashtag:'#ad'
    }
  };
  window.DoneRiteNextConfig=Object.freeze(CFG);
})();