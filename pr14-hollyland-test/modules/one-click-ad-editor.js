/* DONE RITE Creator OS — One-Click Ad Editor engine v0.5 */
(function(){
'use strict';
const VERSION='0.5';
const DEFAULTS={mode:'AUTO_SELL',platform:'TikTok Shop',durationSeconds:15,theme:'DONE_RITE_DARK',preserveOriginalVoice:true,preserveOriginalFraming:true,allowVoiceSpeedChange:false,addMusic:false,addSfx:true,includeCover:true,includeCaption:true,includeHashtags:true,includeCompliance:true,autoHookExperiment:true,autoCtaExperiment:true};
const HOOK_KEY='done-rite-one-click-hook-tests:v1';
const CREATIVE_KEY='done-rite-one-click-creative:v2';
const MAIN_OS_KEY='done-rite-creator-os:v1';
const P=['TikTok Shop','Instagram Reels','Facebook','YouTube Shorts','Pinterest'];
const H=(angle,platforms,make)=>({angle,platforms,make});
const HOOK_LIBRARY=[
H('Curiosity',[P[0],P[1],P[2]],(p,f)=>`Nobody talks about this part of ${p}.`),
H('Curiosity',[P[0],P[1]],(p,f)=>`I did not expect ${f} to be the part I use most.`),
H('Curiosity',[P[0]],(p,f)=>`Three seconds on ${p} and you will see what I mean.`),
H('Curiosity',[P[0],P[2]],(p,f)=>`Watch what ${f} actually looks like in use.`),
H('Curiosity',[P[0],P[1]],(p,f)=>`Here is the part of ${p} the photos do not show.`),
H('Conversation',[P[0],P[1],P[2]],(p,f)=>`You know that feeling when one product detail keeps catching your attention? On ${p}, it is ${f}.`),
H('Conversation',[P[0],P[1],P[3]],(p,f)=>`I did not think this would matter until I saw ${f} on ${p}.`),
H('Conversation',[P[0],P[1],P[2]],(p,f)=>`This might sound weird, but ${f} is the part of ${p} I wanted to see up close.`),
H('Conversation',[P[0],P[1],P[3],P[2]],(p,f)=>`Can I show you something? This is ${f} on ${p}.`),
H('Conversation',[P[0],P[1],P[3]],(p,f)=>`I was not expecting this from ${p}: ${f}.`),
H('Problem',[P[0],P[2],P[3]],(p,f)=>`Tired of dealing with this the hard way? ${p} was built for it.`),
H('Problem',[P[0],P[2]],(p,f)=>`If this keeps happening to you, ${f} is the part to look at.`),
H('Problem',[P[0],P[3]],(p,f)=>`The annoying part everyone puts up with — ${p} handles it differently.`),
H('Problem',[P[2],P[1]],(p,f)=>`Small problem, constant problem. ${p} is designed around it.`),
H('Honest',[P[0],P[3],P[2]],(p,f)=>`Not for everyone. Here is who ${p} is actually for.`),
H('Honest',[P[0],P[3]],(p,f)=>`Before you buy ${p}, look at ${f} first.`),
H('Honest',[P[0],P[2]],(p,f)=>`I will show you ${f} and you can decide for yourself.`),
H('Honest',[P[3],P[2]],(p,f)=>`Skip ${p} if you do not care about ${f}. That is the whole pitch.`),
H('Honest',[P[0]],(p,f)=>`No hype. Just what ${p} does.`),
H('Demo',[P[0],P[1],P[3]],(p,f)=>`Watch ${f} work.`),
H('Demo',[P[0],P[3]],(p,f)=>`${p}, start to finish, in one take.`),
H('Demo',[P[0],P[1]],(p,f)=>`This is ${f} in real use, not a product photo.`),
H('Demo',[P[0]],(p,f)=>`Ten seconds. ${p}. Go.`),
H('Detail',[P[0],P[3],P[4]],(p,f)=>`${f}. That is the detail that made ${p} worth showing.`),
H('Detail',[P[0],P[3]],(p,f)=>`One detail on ${p} does most of the work: ${f}.`),
H('Detail',[P[4],P[2]],(p,f)=>`${p} — what ${f} looks like up close.`),
H('Question',[P[0],P[2],P[1]],(p,f)=>`Would you use ${p} for this?`),
H('Question',[P[0],P[2]],(p,f)=>`Is ${f} something you would actually use?`),
H('Question',[P[3],P[2]],(p,f)=>`What would you check first on ${p}?`),
H('Use case',[P[0],P[4],P[2]],(p,f)=>`If you deal with this daily, ${p} is worth two seconds.`),
H('Use case',[P[4],P[3]],(p,f)=>`${p} for people who care about ${f}.`),
H('Use case',[P[0],P[1]],(p,f)=>`Keep this one where you actually need it. ${p}.`),
H('Search',[P[4],P[3]],(p,f)=>`${p}: a closer look at ${f}.`),
H('Search',[P[4]],(p,f)=>`${p} — features, close-ups, and what to check before buying.`),
H('Search',[P[4],P[3]],(p,f)=>`What ${f} means on ${p}, explained simply.`),
H('Search',[P[3]],(p,f)=>`${p} walkthrough — the parts that matter.`),
H('Contrast',[P[0],P[3],P[2]],(p,f)=>`Most of them skip this. ${p} does not.`),
H('Contrast',[P[0],P[2]],(p,f)=>`The version with ${f} is a different experience.`),
H('Contrast',[P[0]],(p,f)=>`Same idea, different execution. ${p}.`),
H('Direct',[P[0],P[2],P[1]],(p,f)=>`${p}. ${f}. That is it.`),
H('Direct',[P[0]],(p,f)=>`Here is ${p} and exactly what it does.`),
H('Direct',[P[2],P[3]],(p,f)=>`Short version: ${p} is built around ${f}.`),
H('Contrarian',[P[0],P[1],P[3]],(p,f)=>`Most people get this wrong about ${p}.`),
H('Contrarian',[P[0],P[2]],(p,f)=>`Here is what nobody tells you about ${p}.`),
H('Contrarian',[P[0],P[1]],(p,f)=>`Stop checking the wrong thing when you look at ${p}.`),
H('Contrarian',[P[3],P[2]],(p,f)=>`Everyone looks at the wrong part of ${p} first.`),
H('Result first',[P[0],P[1],P[3]],(p,f)=>`This is ${p} set up and ready. Now here is how it got there.`),
H('Result first',[P[0],P[2]],(p,f)=>`Finished result first: ${p} with ${f}.`),
H('Result first',[P[0],P[3]],(p,f)=>`Start at the end. This is what ${p} looks like in place.`),
H('Specific',[P[0],P[3],P[4]],(p,f)=>`Three things I check on ${p} before anything else.`),
H('Specific',[P[3],P[4]],(p,f)=>`${p}: the two parts that actually matter.`),
H('Specific',[P[0],P[3]],(p,f)=>`Seven seconds on ${f}, then you decide.`),
H('Specific',[P[0],P[2]],(p,f)=>`One feature, five seconds: ${f}.`),
H('Mid-action',[P[3],P[0],P[1]],(p,f)=>`Already running. This is ${f} doing its job.`),
H('Mid-action',[P[3],P[1]],(p,f)=>`No intro. ${p}, ${f}, watch.`),
H('Search',[P[4],P[3]],(p,f)=>`What to check before buying ${p}.`),
H('Search',[P[4]],(p,f)=>`${p}: ${f} shown close up.`),
H('Search',[P[4],P[2]],(p,f)=>`Looking at ${p}? Start with ${f}.`),
H('Hands-on',[P[0],P[1],P[3]],(p,f)=>`Hands on ${p}. Here is what ${f} feels like.`),
H('Hands-on',[P[0],P[1]],(p,f)=>`Watch my hands, not a product photo. ${p}.`),
H('Hands-on',[P[0],P[2]],(p,f)=>`One take, no cuts. ${p} doing the thing.`),
H('Hands-on',[P[0],P[3]],(p,f)=>`I am not going to describe ${f}. I am going to show it.`),
H('Hands-on',[P[0],P[1],P[2]],(p,f)=>`This is ${p} out of the box and straight into use.`),
H('Utility',[P[0],P[3],P[1]],(p,f)=>`That is ${p} doing its whole job in three seconds.`),
H('Utility',[P[0],P[2]],(p,f)=>`No build-up. ${p} works like this.`),
H('Utility',[P[0],P[3],P[4]],(p,f)=>`${f}, in one motion. That is ${p}.`),
H('Utility',[P[0],P[1]],(p,f)=>`Whole thing, start to finish, before you can scroll.`),
H('Conversation',[P[0],P[1],P[2],P[3]],(p,f)=>`Okay, this is actually useful. Here is ${f} on ${p}.`),
H('Conversation',[P[0],P[1],P[2]],(p,f)=>`You know that moment when one small detail changes how you use something? On ${p}, it is ${f}.`),
H('Problem',[P[0],P[1],P[2]],(p,f)=>`I did not realize how much this bothered me until I tried ${p}.`),
H('Curiosity',[P[0],P[1],P[3]],(p,f)=>`I thought this was just another ${p} until I noticed ${f}.`),
H('Conversation',[P[0],P[1],P[2],P[3]],(p,f)=>`Can I show you something? Look at ${f} on ${p}.`),
H('Conversation',[P[0],P[2],P[1]],(p,f)=>`Since we are already here, we might as well talk about ${f} on ${p}.`),
H('Conversation',[P[0],P[1],P[2]],(p,f)=>`If we were best friends, I would tell you to check ${f} before choosing ${p}.`),
H('Reverse',[P[0],P[1]],(p,f)=>`Whatever you do, do not save this unless you want a closer look at ${f}.`),
H('Probing',[P[0],P[2],P[1]],(p,f)=>`This may sound blunt, but why does everyone overlook ${f} on ${p}?`),
H('Creator talk',[P[0],P[1],P[3]],(p,f)=>`Creator to creator: this is the shot I would use to show ${f}.`),
H('Opinion',[P[0],P[1],P[3]],(p,f)=>`Whoever said details do not matter was not looking at ${f}.`),
H('Opinion',[P[0],P[2]],(p,f)=>`I may have been checking the wrong part of ${p}. Start with ${f}.`),
H('Discovery',[P[0],P[1],P[2]],(p,f)=>`I was today years old when I noticed ${f} on ${p}.`),
H('Opinion',[P[0],P[3]],(p,f)=>`This is a detail I will stand behind: ${f} deserves a closer look.`),
H('Curiosity',[P[0],P[1]],(p,f)=>`This might change how you look at ${p}: ${f}.`),
H('Opinion',[P[0],P[2],P[3]],(p,f)=>`My honest take on ${p}: check ${f} before anything else.`),
H('Contrast',[P[0],P[1],P[2]],(p,f)=>`The internet talks about ${p}, but this is the detail I wanted to see: ${f}.`),
H('Contrast',[P[0],P[3]],(p,f)=>`Here is the detail I would compare first on ${p}: ${f}.`),
H('Direct',[P[0],P[1]],(p,f)=>`I chose the detail people skip. This is ${f} on ${p}.`),
H('Direct',[P[0],P[3],P[4]],(p,f)=>`If I were building the setup around one feature, I would start with ${f}.`),
H('Reverse',[P[0],P[1]],(p,f)=>`Let us not even talk about the box. Watch ${f} on ${p}.`),
H('Reverse',[P[0],P[2]],(p,f)=>`If you already know exactly what you need, this may not be for you.`),
H('Reverse',[P[0],P[1],P[3]],(p,f)=>`Do not look at the packaging. Look at ${f}.`),
H('Reverse',[P[0],P[1]],(p,f)=>`You might not want to watch this if ${f} does not matter to you.`),
H('Reverse',[P[0],P[2],P[3]],(p,f)=>`This will make the most sense if you use ${p} for the same reason I do.`),
H('Reverse',[P[0],P[1]],(p,f)=>`This is not for you if you do not care about ${f}.`),
H('Reverse',[P[0],P[2]],(p,f)=>`If your current setup already works for you, keep scrolling.`),
H('Probing',[P[0],P[1],P[2]],(p,f)=>`Can someone explain why ${f} gets overlooked on ${p}?`),
H('Probing',[P[0],P[1]],(p,f)=>`I am not trying to start a debate. I want to know whether you would use ${f}.`),
H('Probing',[P[0],P[2]],(p,f)=>`If this task feels harder than it should, check ${f}.`),
H('Probing',[P[0],P[3]],(p,f)=>`You might not need another accessory. You might need ${f}.`),
H('Probing',[P[0],P[1],P[2]],(p,f)=>`If you disagree, tell me which feature matters more than ${f}.`),
H('Direct',[P[0],P[2],P[3]],(p,f)=>`You wanted the short version, so here it is: ${p}, with ${f}.`),
H('Direct',[P[0],P[1]],(p,f)=>`I will not sugarcoat it: ${f} is the part I would check first.`),
H('Vulnerability',[P[0],P[1]],(p,f)=>`I am a little embarrassed I overlooked ${f} on ${p}.`),
H('Vulnerability',[P[0],P[1],P[3]],(p,f)=>`Here goes nothing. This is the part of ${p} I wanted to test.`),
H('Vulnerability',[P[0],P[1]],(p,f)=>`I almost did not post this, but ${f} is worth showing up close.`),
H('Vulnerability',[P[0],P[2]],(p,f)=>`I am putting this out there before I overthink it: ${f}.`),
H('Vulnerability',[P[0],P[1],P[2]],(p,f)=>`This could go either way, so watch ${f} and decide for yourself.`),
H('Outcome first',[P[0],P[1],P[3],P[2]],(p,f)=>`Here is ${p} ready to use. Now watch ${f}.`),
H('Outcome first',[P[0],P[1],P[3]],(p,f)=>`Start with the finished setup: ${p} with ${f}.`),
H('Outcome first',[P[0],P[2]],(p,f)=>`The useful part first: ${f}. The setup comes next.`),
H('Outcome first',[P[0],P[1]],(p,f)=>`Watch the result first, then I will show you the setup.`),
H('Outcome first',[P[3],P[4],P[2]],(p,f)=>`${p} ready to go, with ${f} shown clearly.`)
];
const CTA_LIBRARY=[
{style:'Direct',platforms:[P[0]],text:'Product details are in the cart.'},
{style:'Direct',platforms:[P[0]],text:'Tap the cart to see the full listing.'},
{style:'Direct',platforms:[P[0]],text:'Full specs are on the product page in the cart.'},
{style:'Direct',platforms:[P[0]],text:'Everything you need is in the orange cart.'},
{style:'Informed',platforms:[P[0]],text:'Check the specs in the cart before you decide.'},
{style:'Informed',platforms:[P[0]],text:'Read the listing in the cart and see if it fits your setup.'},
{style:'Low pressure',platforms:[P[0]],text:'Have a look at the details in the cart. No rush.'},
{style:'Low pressure',platforms:[P[0]],text:'The cart has the rest. Decide for yourself.'},
{style:'Qualifying',platforms:[P[0]],text:'If that matches what you need, the cart has the full listing.'},
{style:'Qualifying',platforms:[P[0]],text:'Not for everyone. If it is for you, the details are in the cart.'},
{style:'Direct',platforms:[P[3]],text:'Product link is in the description.'},
{style:'Direct',platforms:[P[3]],text:'Full details are linked below.'},
{style:'Informed',platforms:[P[3]],text:'Check the description for the full spec sheet.'},
{style:'Low pressure',platforms:[P[3]],text:'Link is below if you want a closer look.'},
{style:'Direct',platforms:[P[4]],text:'Tap through for the full product details.'},
{style:'Informed',platforms:[P[4]],text:'Save this and check the product page when you are ready.'},
{style:'Low pressure',platforms:[P[4]],text:'Pin it for later. The listing has the rest.'},
{style:'Direct',platforms:[P[2],P[1]],text:'Product details are in the link.'},
{style:'Direct',platforms:[P[2],P[1]],text:'Full listing is linked for you.'},
{style:'Informed',platforms:[P[2],P[1]],text:'The link has the specs if you want to compare.'},
{style:'Low pressure',platforms:[P[2],P[1]],text:'Take a look at the listing and decide for yourself.'},
{style:'Qualifying',platforms:[P[2],P[1]],text:'If this solves something for you, the details are in the link.'},
{style:'Demo-linked',platforms:[P[0]],text:'That is the whole motion. Full listing is in the cart.'},
{style:'Demo-linked',platforms:[P[0]],text:'You just watched it work. Specs are in the cart.'},
{style:'Demo-linked',platforms:[P[0]],text:'Same product, same hands, no edit. Details are in the cart.'},
{style:'Demo-linked',platforms:[P[3]],text:'That is it in real use. Full details are linked below.'},
{style:'Demo-linked',platforms:[P[1],P[2]],text:'You saw what it does. The listing has the rest.'},
{style:'Demo-linked',platforms:[P[4]],text:'Save this demo. The product page has the full spec.'}
];
function clean(v){return String(v==null?'':v).trim();}
function clampDuration(v){const n=Number(v);return [7,10,15,20,25,30].includes(n)?n:15;}
function slug(v){return clean(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'product';}
function safeText(v){return clean(v).replace(/\$\s?\d+(?:\.\d{1,2})?/gi,'').replace(/\b(discount|sale|cheapest|lowest price|coupon)\b/gi,'').replace(/\b(guaranteed|guarantee|instantly|instant|100%|perfect|flawless)\b/gi,'').replace(/\s{2,}/g,' ').trim();}
function categoryFlags(category,batteryPowered,productText){const c=clean(category).toLowerCase(),p=clean(productText).toLowerCase(),flags=[];if(/supplement|wellness/.test(c))flags.push('supplement/wellness review');if(/skincare|body-applied|oral|dental/.test(c))flags.push('body/claim review');if(/kids/.test(c))flags.push('kids-product review');if(/tool|weapon/.test(c))flags.push('tools/restricted-category review');const electricalWords=/battery|batteries|recharge|charging|charger|power bank|powered|electric|electronic|usb|led|light|microphone|mic\b|wireless|bluetooth|motor|solar/;const passiveAccessory=/phone holder|neck holder|holder|mount|stand|tripod|clamp|grip|case|sleeve/;const clearlyElectrical=electricalWords.test(p),clearlyPassive=passiveAccessory.test(p)&&!clearlyElectrical;if((batteryPowered||/electronics|gadget/.test(c))&&!clearlyPassive)flags.push('electrical/battery-powered review');return flags;}
function loadHookState(){try{return Object.assign({lastHookId:null,lastHookText:null,lastCtaText:null,assignments:[],results:[]},JSON.parse(localStorage.getItem(HOOK_KEY)||'{}'));}catch(e){return{lastHookId:null,lastHookText:null,lastCtaText:null,assignments:[],results:[]};}}
function saveHookState(s){try{localStorage.setItem(HOOK_KEY,JSON.stringify(s));}catch(e){}return s;}
function hookUid(){return'hooktest-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);}
function mainWinners(platform){try{const d=JSON.parse(localStorage.getItem(MAIN_OS_KEY)||'{}');return (Array.isArray(d.hookLog)?d.hookLog:[]).filter(x=>x&&x.winner&&(!x.platform||x.platform===platform)&&clean(x.text));}catch(e){return[];}}
function randomIndex(n){if(n<=1)return 0;if(window.crypto&&crypto.getRandomValues){const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n;}return Math.floor(Math.random()*n);}
function chooseHook(input){const s=loadHookState(),platform=input.platform||P[0],product=clean(input.product)||'Product',feature=safeText(input.feature||'the main feature'),winnerPool=mainWinners(platform).filter(x=>x.text!==s.lastHookText);let choice=null,fromWinner=false;if(winnerPool.length&&Math.random()<.35){const w=winnerPool[randomIndex(winnerPool.length)];choice={id:'WIN-'+String(w.id||randomIndex(9999)),text:safeText(w.text),angle:'Proven winner'};fromWinner=true;}if(!choice){let pool=HOOK_LIBRARY.filter(h=>h.platforms.includes(platform)).map((h,i)=>({id:'LIB-'+i,text:safeText(h.make(product,feature)),angle:h.angle})).filter(h=>h.text&&h.text!==s.lastHookText);if(!pool.length)pool=HOOK_LIBRARY.map((h,i)=>({id:'LIB-'+i,text:safeText(h.make(product,feature)),angle:h.angle}));choice=pool[randomIndex(pool.length)];}const row={id:hookUid(),hookId:choice.id,hookText:choice.text,angle:choice.angle,product,feature,mode:input.mode||'AUTO_SELL',platform,createdAt:new Date().toISOString(),videoFileName:input.videoFileName||'',status:'assigned',fromWinner};s.lastHookId=choice.id;s.lastHookText=choice.text;s.assignments.unshift(row);s.assignments=s.assignments.slice(0,500);saveHookState(s);return Object.assign({},choice,{assignmentId:row.id,fromWinner});}
function chooseCta(platform){const s=loadHookState();let pool=CTA_LIBRARY.filter(c=>c.platforms.includes(platform)&&c.text!==s.lastCtaText);if(!pool.length)pool=CTA_LIBRARY.filter(c=>c.platforms.includes(platform));if(!pool.length)pool=CTA_LIBRARY.slice();const c=pool[randomIndex(pool.length)];s.lastCtaText=c.text;saveHookState(s);return Object.assign({id:'CTA-'+CTA_LIBRARY.indexOf(c)},c);}
function recordHookResult(assignmentId,metrics){const s=loadHookState(),m=metrics||{},r={id:hookUid(),assignmentId:String(assignmentId||''),views:Number(m.views||0),avgWatchTime:Number(m.avgWatchTime||0),completionRate:Number(m.completionRate||0),likes:Number(m.likes||0),comments:Number(m.comments||0),shares:Number(m.shares||0),saves:Number(m.saves||0),clicks:Number(m.clicks||0),orders:Number(m.orders||0),recordedAt:new Date().toISOString()};s.results.unshift(r);s.results=s.results.slice(0,1000);saveHookState(s);return r;}
function shotTimes(duration){
  const d=clampDuration(duration),hookEnd=Math.min(2,Math.max(1.2,d*.16)),closeLength=d<=10?1.5:Math.min(3,d*.2),closeStart=d-closeLength,middle=closeStart-hookEnd,demoEnd=hookEnd+middle*.55;
  return {d,hookEnd:+hookEnd.toFixed(1),demoEnd:+demoEnd.toFixed(1),closeStart:+closeStart.toFixed(1)};
}
function shotWindow(start,end){return Number(start).toFixed(1)+'–'+Number(end).toFixed(1)+'s';}
function visualShotRecipe(product,feature){
  const text=(product+' '+feature).toLowerCase();
  const base={kind:'general',
    hook:`Lock the phone vertically on a tripod at product height. Begin with the product just below the frame. Move it into the middle-left area, rotate it until the front label faces the camera, then stop moving.`,
    demo:`Keep the camera still in a medium close-up. Use one hand to perform the single physical action connected to ${feature} once, from its clear starting position to its clear ending position. Do not repeat the setup.`,
    detail:`Move to a tight close-up of the exact button, connector, material, or part connected to ${feature}. Point to it once, remove your finger, and hold the detail steady.`,
    close:`Place ${product} upright on a clean surface with the front facing the camera. Keep both hands out of frame and hold the final shot completely still.`};
  if(/gumm|supplement|nmn|vitamin|flavou?r|taste|tropical|wellness|energy|aging|nad\+?/.test(text))return {kind:'packaged/nonvisual',
    hook:`Lock the phone vertically on a tripod at jar height. Begin with ${product} below the frame. Lift it into the middle-left area, turn the front label square to the camera, and hold it still.`,
    demo:`Switch to a locked overhead close-up on a clean surface. Keep the label visible, remove the lid, place one gummy in your clean palm beside the container, and stop. Do not act out energy, aging, health results, or a before-and-after reaction.`,
    detail:`Record a tight close-up of the gummy beside the package flavor artwork or printed flavor name. Slowly roll the gummy once with one fingertip, remove your finger, and hold. Flavor is shown through the label and product appearance—not as a result that is “working.”`,
    close:`Replace the lid and stand ${product} upright. Point once to the printed flavor name, move your hand completely out of frame, and hold the front label steady.`};
  if(/clamp|mount|holder|stand|bracket/.test(text))return {kind:'mount',
    hook:base.hook,
    demo:`Use a side-angle close-up showing both the mount and attachment surface. Open the clamp fully, place it on the surface, release or tighten it once, then remove your hand so the attached position is visible.`,
    detail:`Keep the camera locked. Place the intended device into ${product}, adjust the viewing angle once, remove both hands, and hold the finished setup steady. Do not perform a force or weight test unless verified.`,
    close:base.close};
  if(/charg|battery|power bank|cable|usb|wireless|electrical/.test(text))return {kind:'power',
    hook:base.hook,
    demo:`Use a tight side view with the connector and port both visible. Plug the cable in once, remove your hand, and hold long enough to show the normal device indicator. Do not claim a charging speed or capacity from the indicator.`,
    detail:`Record a close-up of the verified port or control connected to ${feature}. Point once, then show one normal button press or connection. Keep liquid and loose metal away from the setup.`,
    close:base.close};
  if(/light|lamp|led|glow|brightness/.test(text))return {kind:'light',
    hook:base.hook,
    demo:`Lock exposure and keep the camera in one position. Start with the light off, press the power control once, remove your hand, and hold while the visible light turns on. Do not change the room lighting between shots.`,
    detail:`Use a close-up of the verified control. Show one normal adjustment from its starting position to its ending position, then hold the resulting light in the same frame.`,
    close:base.close};
  if(/shirt|jacket|jeans|pants|apparel|fabric|pocket|zipper|shoe|wear/.test(text))return {kind:'apparel',
    hook:`Hang or lay ${product} flat against a plain background. Start on the full item, then make one slow top-to-bottom camera move while keeping the entire item inside the frame.`,
    demo:`Use a locked close-up. Open and close the verified zipper, pocket, fastener, or adjustable part once. If ${feature} is not a moving part, pinch and release that material once without making a durability claim.`,
    detail:`Hold a tight, steady view of the stitching, texture, label, or exact construction detail connected to ${feature}. Point once and remove your hand.`,
    close:`Return to the full-item view with ${product} straight, unobstructed, and centered. Hold completely still.`};
  if(/knife|blade|cut|drill|saw|heat|cook|pan|kitchen/.test(text))return {kind:'tool/kitchen',
    hook:base.hook,
    demo:`Use a locked side angle with the full work area visible. Perform one normal, label-supported action with ${product}; keep hands clear of moving, sharp, or hot parts and stop the action before changing the camera.`,
    detail:`After the product is safely off and stationary, record a close-up of the verified control or working part connected to ${feature}. Point once and remove your hand.`,
    close:base.close};
  if(/flavou?r|taste|quality|support|energy|aging|comfort|healthy|premium|durab/.test(text)){base.kind='nonvisual';base.demo=`Use a locked close-up of the packaging or physical detail where ${feature} is printed or visibly supported. Point to that exact label or material once, then remove your hand. Do not pretend a nonvisual benefit is happening.`;base.detail=`Rotate ${product} slowly to the relevant label or construction detail, stop when it is readable, and hold it steady. Do not add a reaction shot as proof.`;}
  return base;
}
function hookShot(angle,product,feature){return visualShotRecipe(product,feature).hook;}
function ctaShot(cta,product){return `Place ${product} upright on a clean surface with its front facing the camera. Move both hands out of frame and hold the shot completely still while the CTA appears.`;}
function makeTimeline(duration,mode,feature,hook,cta,product){
  const t=shotTimes(duration),r=visualShotRecipe(product||'Product',feature);
  return [
    {start:0,end:t.hookEnd,role:'HOOK',instruction:r.hook},
    {start:t.hookEnd,end:t.demoEnd,role:'DEMO',instruction:r.demo},
    {start:t.demoEnd,end:t.closeStart,role:'DETAIL',instruction:r.detail},
    {start:t.closeStart,end:t.d,role:'CLOSE',instruction:r.close}
  ];
}
function makeOverlayPlan(input,hook,cta){const feature=safeText(input.verifiedFeature||input.feature||'Main feature');return [{role:'HOOK',text:hook.text,animation:'pop-snap-in',safeZone:'upper-middle/central-left',experimentId:hook.assignmentId||null,hookId:hook.id||null},{role:'DEMO',text:feature.toUpperCase(),animation:'slide-drift',safeZone:'central-left'},{role:'CLOSE',text:cta.text.toUpperCase(),animation:'snap-pop-out',safeZone:'upper-middle/central-left'}];}
function makePackage(input){const product=clean(input.productName)||'Product',feature=safeText(input.verifiedFeature||input.feature||'designed for everyday use'),flags=categoryFlags(input.category,input.batteryPowered,product+' '+feature),caption=safeText(input.caption||`${product} — ${feature}. Check the product link for details.`),tags=['#ad'];(Array.isArray(input.hashtags)?input.hashtags:[]).forEach(t=>{const x=clean(t);if(x&&!tags.includes(x))tags.push(x);});const base=`${slug(product)}-${String(input.mode||DEFAULTS.mode).toLowerCase().replace(/_/g,'-')}-${clampDuration(input.durationSeconds)}s`;return {caption,hashtags:tags,videoFileName:`${base}.mp4`,coverFileName:`${base}-cover.jpg`,coverTitle:safeText(input.coverTitle||feature).toUpperCase(),compliance:{flags,shipOnly:flags.filter(f=>!/electrical\/battery-powered|kids-product/.test(f))}};}
function makeVoiceover(hook,feature,cta,duration){const bridge=duration<=10?` ${feature}. `:` Here is ${feature} in use. `;return safeText(hook.text+bridge+cta.text);}
function makeRecordingGuide(product,feature,hook,cta,packaging,duration){
  const r=visualShotRecipe(product,feature),t=shotTimes(duration),voice=makeVoiceover(hook,feature,cta,duration);
  const setup=`SETUP — Vertical 9:16. Clean the lens. Lock the phone on a tripod; do not hand-hold it. Use bright, even front lighting and a plain background. Keep your face and reflections out of frame. Keep the product and your hands out of TikTok's top, bottom, and right-side control areas.`;
  const shot1=`${shotWindow(0,t.hookEnd)} HOOK — ${r.hook} END FRAME: front label readable and product motion stopped.`;
  const shot2=`${shotWindow(t.hookEnd,t.demoEnd)} PHYSICAL DEMO — ${r.demo} END FRAME: completed action visible with hands paused or removed.`;
  const shot3=`${shotWindow(t.demoEnd,t.closeStart)} DETAIL — ${r.detail} END FRAME: selected detail sharp, unobstructed, and still.`;
  const shot4=`${shotWindow(t.closeStart,t.d)} CTA HERO SHOT — ${r.close} END FRAME: product remains still until recording stops.`;
  const plan=[setup,shot1,shot2,shot3,shot4].join('\n');
  return {durationSeconds:duration,hookAngle:hook.angle,hookText:hook.text,ctaStyle:cta.style,ctaText:cta.text,voiceover:voice,direction:plan,shots:[shot1,shot2,shot3,shot4].join('\n'),onScreenText:`HOOK: ${hook.text}\nDEMO: ${feature.toUpperCase()}\nCTA: ${cta.text}`,sfx:'Whoosh on hook text in; light click/pop on feature text; snap/pop on CTA. Effects stay on a separate layer and never lower the original voice.',caption:packaging.caption,hashtags:packaging.hashtags.join(' '),cover:packaging.coverTitle,compliance:(packaging.compliance.flags.length?packaging.compliance.flags.join('; '):'No automatic wording flags. Use only verified product details.'),teleprompterPath:'teleprompter.html',visualGuideType:r.kind};
}
function teleprompterUrl(plan){const g=plan&&plan.recordingGuide||{},q=new URLSearchParams();q.set('session','1');q.set('product',plan.product||'');q.set('seconds',String(plan.durationSeconds||15));q.set('type','full');q.set('tone','confident');q.set('script',g.voiceover||'');q.set('direction',g.direction||'');q.set('angle',g.hookAngle||'');q.set('format','Vertical 9:16 · '+(plan.platform||'TikTok Shop')+' · hands/product focused');q.set('shots',g.shots||'');q.set('onscreen',g.onScreenText||'');q.set('sfx',g.sfx||'');q.set('caption',g.caption||'');q.set('hashtags',g.hashtags||'');q.set('cover',g.cover||'');q.set('compliance',g.compliance||'');return 'teleprompter.html?'+q.toString();}
function escapeHtml(v){return String(v==null?'':v).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));}
function escapeAttr(v){return escapeHtml(v).replace(/'/g,'&#39;');}
function installRecordingHandoff(plan){if(typeof document==='undefined'||!plan)return;let card=document.getElementById('doneRiteRecordingHandoff');if(!card){card=document.createElement('div');card.id='doneRiteRecordingHandoff';card.style.cssText='margin-top:12px;padding:14px;border:1px solid #2bd97c;border-radius:14px;background:#0d1a15;color:#eef3f8';const anchor=document.getElementById('doneRiteClipReview')||document.getElementById('preview');if(anchor&&anchor.parentNode)anchor.insertAdjacentElement('afterend',card);else(document.querySelector('.wrap')||document.body).appendChild(card);}const g=plan.recordingGuide||{},files=document.getElementById('video'),count=files&&files.files?files.files.length:0;card.innerHTML='<div style="font-weight:950;color:#56ec9c;margin-bottom:8px">🎬 HOOK + CTA RECORDING CHECK</div>'+'<div style="font-size:13px;color:#b8c6d6;line-height:1.45;margin-bottom:10px">'+(count?count+' source clip'+(count===1?'':'s')+' loaded. ':'No source clips loaded. ')+'Current browser scan can score visual quality, but it cannot yet prove that the exact product action needed by this hook/CTA is present. If your footage does not match the directions below, record the missing shot instead of forcing the edit.</div>'+'<div style="padding:10px;border-left:3px solid #58a6ff;background:#07101b;border-radius:0 10px 10px 0;margin-bottom:8px"><b style="color:#72bdff">HOOK — '+escapeHtml(plan.hookExperiment&&plan.hookExperiment.text||'')+'</b><div style="margin-top:5px;line-height:1.4">'+escapeHtml(plan.creativeSync&&plan.creativeSync.hookShot||'')+'</div></div>'+'<div style="padding:10px;border-left:3px solid #ffb020;background:#171006;border-radius:0 10px 10px 0;margin-bottom:8px"><b style="color:#ffd166">CTA — '+escapeHtml(plan.ctaExperiment&&plan.ctaExperiment.text||'')+'</b><div style="margin-top:5px;line-height:1.4">'+escapeHtml(plan.creativeSync&&plan.creativeSync.ctaShot||'')+'</div></div>'+'<div style="padding:10px;background:#10151d;border:1px solid #2a3442;border-radius:10px;margin-bottom:10px"><b>VOICEOVER</b><div style="margin-top:5px;line-height:1.45">'+escapeHtml(g.voiceover||'')+'</div></div>'+'<a id="doneRiteRecordMissing" href="'+escapeAttr(teleprompterUrl(plan))+'" style="display:block;text-align:center;text-decoration:none;min-height:52px;padding:15px 10px;border-radius:13px;background:#197aff;color:white;font-weight:950">🎥 RECORD MISSING / BETTER CLIP + TELEPROMPTER</a>';}
function createPlan(input){input=input||{};const options=Object.assign({},DEFAULTS,input);options.durationSeconds=clampDuration(options.durationSeconds);const product=clean(options.productName)||'Product',feature=safeText(options.verifiedFeature||options.feature||'the main feature'),packaging=makePackage(options);let hook;if(clean(options.hook)){hook={id:'MANUAL',assignmentId:null,text:safeText(options.hook),angle:'Manual',fromWinner:false};}else if(options.autoHookExperiment!==false){hook=chooseHook({product,feature,mode:options.mode,platform:options.platform,videoFileName:packaging.videoFileName});}else{hook={id:'DEFAULT',assignmentId:null,text:`Watch ${feature} work.`,angle:'Demo',fromWinner:false};}const cta=clean(options.cta)?{id:'MANUAL_CTA',text:safeText(options.cta),style:'Manual',platforms:[options.platform]}:chooseCta(options.platform);hook.shot=hookShot(hook.angle,product,feature);cta.shot=ctaShot(cta,product);const guide=makeRecordingGuide(product,feature,hook,cta,packaging,options.durationSeconds);const plan={engine:'DONE RITE One-Click Ad Editor',version:VERSION,status:'PLAN_READY',product,feature,mode:options.mode,platform:options.platform,durationSeconds:options.durationSeconds,hookExperiment:{assignmentId:hook.assignmentId||null,hookId:hook.id,text:hook.text,angle:hook.angle,status:'assigned',fromWinner:!!hook.fromWinner},ctaExperiment:{ctaId:cta.id,text:cta.text,style:cta.style,status:'assigned'},creativeSync:{rule:'Hook, opening footage, demo, on-screen text, sound timing and CTA are one synchronized edit plan.',hookShot:hook.shot,ctaShot:cta.shot,voiceover:guide.voiceover},recordingGuide:guide,mediaPolicy:{preserveOriginalVoice:options.preserveOriginalVoice!==false,preserveOriginalVoiceLevel:true,preserveOriginalVoiceTiming:true,preserveOriginalFraming:options.preserveOriginalFraming!==false,allowVoiceSpeedChange:false,normalizeVoice:false,compressVoice:false,autoEnhanceVoice:false,removeThirdPartyWatermarks:false,note:'Watermark removal requires a clean user-owned source or a crop/replace step that does not alter protected third-party marks.'},editPlan:{selectStrongestOpening:true,trimDeadSpace:true,removeRepeatedTakes:true,keepProductVisible:true,structure:makeTimeline(options.durationSeconds,options.mode,feature,hook,cta,product),overlays:makeOverlayPlan(options,hook,cta),sfx:options.addSfx!==false?[{event:'hook-in',sound:'whoosh',mix:'independent layer; original voice level unchanged'},{event:'feature',sound:'click',mix:'independent layer; original voice level unchanged'},{event:'cta',sound:'snap',mix:'independent layer; original voice level unchanged'}]:[],music:options.addMusic===true?{allowed:true,mix:'under original voice'}:{allowed:false}},packaging,analytics:{hookAssignmentId:hook.assignmentId||null,hookId:hook.id,hookText:hook.text,ctaId:cta.id,ctaText:cta.text,trackAgainst:['views','avgWatchTime','completionRate','likes','comments','shares','saves','clicks','orders']},nextRequiredStage:'MEDIA_ANALYSIS',limitations:['Current browser-side scan can judge visual activity/quality but cannot reliably prove that a specific product action exists without semantic vision.','If footage does not clearly support the chosen hook or CTA, use the recording-guide handoff instead of forcing the edit.','iPhone Safari cannot silently save final files or open another app without a user gesture.']};try{localStorage.setItem(CREATIVE_KEY,JSON.stringify({updatedAt:new Date().toISOString(),plan}));}catch(e){}try{window.dispatchEvent(new CustomEvent('done-rite-one-click-plan',{detail:plan}));}catch(e){}try{installRecordingHandoff(plan);}catch(e){}return plan;}
function hookOptions(product,feature,platform){const seen=new Set();return HOOK_LIBRARY.filter(h=>h.platforms.includes(platform)).map((h,i)=>({id:'LIB-'+i,angle:h.angle,text:safeText(h.make(product,feature))})).filter(x=>x.text&&!seen.has(x.text)&&(seen.add(x.text),true));}
function ctaOptions(platform){return CTA_LIBRARY.filter(c=>c.platforms.includes(platform)).map((c,i)=>Object.assign({id:'CTA-'+i},c));}
window.DoneRiteOneClickAdEditor={version:VERSION,defaults:Object.assign({},DEFAULTS),createPlan,safeText,categoryFlags,recordHookResult,getHookTestState:loadHookState,hookPool:HOOK_LIBRARY.slice(),ctaPool:CTA_LIBRARY.slice(),hookOptions,ctaOptions,teleprompterUrl,installRecordingHandoff};
})();