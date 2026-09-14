/* DONE RITE Creator OS — Still Image & Realistic Results Compliance v1.0 */
(function(){
'use strict';
const VERSION='1.0';
const AFFILIATE_STILL_IMAGE_RULES=[
  'Show the exact product connected to the listing. Brand, model, color, quantity, included accessories, packaging, and visible features must match.',
  'Do not stretch, shrink, recolor, reshape, duplicate, remove, or add product parts in a way that changes what the buyer receives.',
  'Do not use filters, staging, editing, or AI effects to make the product look faster, stronger, larger, more effective, or different from real use.',
  'If an image is fully generated or significantly altered with AI, keep it truthful and use TikTok’s AI-generated-content disclosure when required.',
  'Use only product images and background visuals you own or are authorized to use. No copyrighted screen grabs, copied creator content, third-party watermarks, movie or TV frames, or unlicensed brand material.',
  'Do not add a competitor logo, unrelated certification, rating badge, award, endorsement, test result, or professional authority that is not verified for the exact product.',
  'Do not show prices, discounts, coupons, savings, false scarcity, or AI-supplied specifications, measurements, quantities, percentages, rankings, or performance numbers.',
  'Do not use before-and-after imagery or imply a guaranteed transformation. DONE RITE uses the safer product-demonstration format instead.',
  'Do not use sexualized, exploitative, shocking, violent, gory, dangerous, hateful, or otherwise disturbing imagery. Keep minors out of product promotion.',
  'Keep the product clearly visible and in focus. Do not cover it with text; keep important text in the central-left or upper-middle safe area and outside TikTok controls.',
  'Avoid a static-only slideshow. Add original narration plus meaningful motion, interaction, zoom, pan, or creative editing so the post is not low-quality still-frame content.'
];
const UNREALISTIC_EXPECTATION_RULES=[
  'Do not promise instant, overnight, permanent, guaranteed, perfect, complete, or scientifically impossible results.',
  'Do not visually demonstrate a capability, speed, strength, capacity, runtime, range, durability, waterproofing, safety result, or outcome that the exact listing and real product do not support.',
  'Do not change lighting, angles, scale, timing, filters, or editing to create a fake product result or an unfair before-and-after difference.',
  'Do not make one item appear to include more pieces, accessories, colors, quantity, or package contents than the buyer receives.',
  'Do not use AI to fabricate product performance, customer results, doctors, experts, laboratories, endorsements, testimonials, people, events, or demonstrations.',
  'Do not imply that typical results are certain. Personal experience is allowed only for a product physically received and used, and it must remain accurate.',
  'Do not use fear, humiliation, insecurity, sympathy, or an unrealistic lifestyle transformation to pressure a purchase.',
  'If a result cannot be shown honestly with the real product, replace it with a close-up of a verified feature and direct viewers to the listing details.'
];
const LISTING_FIRST_IMAGE_RULES=[
  'For a TikTok Shop first listing image only: do not add text, graphics, watermarks, or promotional stickers.',
  'For a TikTok Shop first listing image only: do not use black-and-white imagery, mosaics, or filters that hide product or brand details.',
  'For a TikTok Shop first listing image only: do not add another brand identifier or alter the real product brand identifier.'
];
const AUTO_PATTERNS=[
  {re:/\b(instant(?:ly)?|overnight|miracle|guaranteed?|perfect|flawless|permanent(?:ly)?|100%)\b/i,flag:'Unrealistic or absolute result wording — replace it with a verified feature demonstration.'},
  {re:/\b(cure|treat|prevent|heal|reverse|eliminate)\b/i,flag:'Treatment or transformation wording — use compliant support language only when accurate.'},
  {re:/\b(before\s*(?:and|&|\/)\s*after|transformation)\b/i,flag:'Before-and-after or transformation framing — use a real-time feature demonstration instead.'},
  {re:/\b(doctor recommended|expert approved|clinically proven|lab tested|certified)\b/i,flag:'Authority, testing, or certification claim — verify it for the exact product or remove it.'},
  {re:/\b(fastest|strongest|best ever|number one|#1|better than every|works every time|never fails)\b/i,flag:'Comparative or impossible performance expectation — replace it with a specific verified detail.'}
];
function clean(value){return String(value==null?'':value).trim();}
function automaticFlags(input){const text=[input.productName,input.feature,input.hook,input.cta,input.caption,input.onScreenText].map(clean).join(' '),flags=[];AUTO_PATTERNS.forEach(item=>{if(item.re.test(text)&&!flags.includes(item.flag))flags.push(item.flag);});return flags;}
function numbered(title,rules){return title+'\n'+rules.map((rule,index)=>(index+1)+'. '+rule).join('\n');}
function review(input){input=input||{};const flags=automaticFlags(input);return {version:VERSION,status:flags.length?'FIX_BEFORE_RECORDING':'VISUAL_CONFIRMATION_REQUIRED',automaticFlags:flags,affiliateVideoRules:AFFILIATE_STILL_IMAGE_RULES.slice(),unrealisticExpectationRules:UNREALISTIC_EXPECTATION_RULES.slice(),listingFirstImageRules:LISTING_FIRST_IMAGE_RULES.slice(),teleprompterText:['VISUAL CONFIRMATION REQUIRED — Creator OS applies these rules to the recommendation, but it cannot prove every detail inside an image without a visual review.',numbered('AFFILIATE VIDEO STILL-IMAGE RULES',AFFILIATE_STILL_IMAGE_RULES),numbered('UNREALISTIC-EXPECTATION RULES',UNREALISTIC_EXPECTATION_RULES),numbered('ONLY IF MAKING A TIKTOK SHOP FIRST LISTING IMAGE',LISTING_FIRST_IMAGE_RULES)].join('\n\n')};}
window.DoneRiteStillImageCompliance={version:VERSION,affiliateStillImageRules:AFFILIATE_STILL_IMAGE_RULES.slice(),unrealisticExpectationRules:UNREALISTIC_EXPECTATION_RULES.slice(),listingFirstImageRules:LISTING_FIRST_IMAGE_RULES.slice(),automaticFlags,review};
})();
