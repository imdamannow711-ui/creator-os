/* DONE RITE Creator OS — content libraries
   Extracted from app.js without changing library text or selection behavior. */
(function(){
'use strict';
/* HOOK LIBRARY
   ------------------------------------------------------------------
   Every hook here is claim-free on purpose: no prices, no superiority,
   no "everyone is buying this", no results promises. Those are what get
   videos pulled. The variety comes from the ANGLE, not from bigger claims.
   Angles are tagged by platform because a Pinterest searcher and a TikTok
   scroller are not in the same headspace. */
const HOOK_LIBRARY = [
  // --- Curiosity / pattern interrupt (TikTok, Reels)
  { angle: "Curiosity", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `Nobody talks about this part of ${p}.` },
  { angle: "Curiosity", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `I did not expect ${f} to be the part I use most.` },
  { angle: "Curiosity", platforms: ["TikTok Shop"], make: (p, f) => `Three seconds on ${p} and you will see what I mean.` },
  { angle: "Curiosity", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `Watch what ${f} actually looks like in use.` },
  { angle: "Curiosity", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `Here is the part of ${p} the photos do not show.` },

  // --- Conversation starters (added Aug 2026 from the user's Hook Library
  // screenshots). Each keeps the natural opening phrase but completes the
  // thought with the selected product and verified feature. This avoids a
  // dangling open loop while staying claim-free and usable in a 7-second ad.
  { angle: "Conversation", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `You know that feeling when one product detail keeps catching your attention? On ${p}, it is ${f}.` },
  { angle: "Conversation", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `I did not think this would matter until I saw ${f} on ${p}.` },
  { angle: "Conversation", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `This might sound weird, but ${f} is the part of ${p} I wanted to see up close.` },
  { angle: "Conversation", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts", "Facebook"], make: (p, f) => `Can I show you something? This is ${f} on ${p}.` },
  { angle: "Conversation", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `I was not expecting this from ${p}: ${f}.` },

  // --- Problem first
  { angle: "Problem", platforms: ["TikTok Shop", "Facebook", "YouTube Shorts"], make: (p, f) => `Tired of dealing with this the hard way? ${p} was built for it.` },
  { angle: "Problem", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `If this keeps happening to you, ${f} is the part to look at.` },
  { angle: "Problem", platforms: ["TikTok Shop", "YouTube Shorts"], make: (p, f) => `The annoying part everyone puts up with — ${p} handles it differently.` },
  { angle: "Problem", platforms: ["Facebook", "Instagram Reels"], make: (p, f) => `Small problem, constant problem. ${p} is designed around it.` },

  // --- Objection / honest framing
  { angle: "Honest", platforms: ["TikTok Shop", "YouTube Shorts", "Facebook"], make: (p, f) => `Not for everyone. Here is who ${p} is actually for.` },
  { angle: "Honest", platforms: ["TikTok Shop", "YouTube Shorts"], make: (p, f) => `Before you buy ${p}, look at ${f} first.` },
  { angle: "Honest", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `I will show you ${f} and you can decide for yourself.` },
  { angle: "Honest", platforms: ["YouTube Shorts", "Facebook"], make: (p, f) => `Skip ${p} if you do not care about ${f}. That is the whole pitch.` },
  { angle: "Honest", platforms: ["TikTok Shop"], make: (p, f) => `No hype. Just what ${p} does.` },

  // --- Demonstration
  { angle: "Demo", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `Watch ${f} work.` },
  { angle: "Demo", platforms: ["TikTok Shop", "YouTube Shorts"], make: (p, f) => `${p}, start to finish, in one take.` },
  { angle: "Demo", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `This is ${f} in real use, not a product photo.` },
  { angle: "Demo", platforms: ["TikTok Shop"], make: (p, f) => `Ten seconds. ${p}. Go.` },

  // --- Specific detail
  { angle: "Detail", platforms: ["TikTok Shop", "YouTube Shorts", "Pinterest"], make: (p, f) => `${f}. That is the detail that made ${p} worth showing.` },
  { angle: "Detail", platforms: ["TikTok Shop", "YouTube Shorts"], make: (p, f) => `One detail on ${p} does most of the work: ${f}.` },
  { angle: "Detail", platforms: ["Pinterest", "Facebook"], make: (p, f) => `${p} — what ${f} looks like up close.` },

  // --- Question
  { angle: "Question", platforms: ["TikTok Shop", "Facebook", "Instagram Reels"], make: (p, f) => `Would you use ${p} for this?` },
  { angle: "Question", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `Is ${f} something you would actually use?` },
  { angle: "Question", platforms: ["YouTube Shorts", "Facebook"], make: (p, f) => `What would you check first on ${p}?` },

  // --- Use case
  { angle: "Use case", platforms: ["TikTok Shop", "Pinterest", "Facebook"], make: (p, f) => `If you deal with this daily, ${p} is worth two seconds.` },
  { angle: "Use case", platforms: ["Pinterest", "YouTube Shorts"], make: (p, f) => `${p} for people who care about ${f}.` },
  { angle: "Use case", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `Keep this one where you actually need it. ${p}.` },

  // --- Search-first (Pinterest and YouTube reward clarity, not mystery)
  { angle: "Search", platforms: ["Pinterest", "YouTube Shorts"], make: (p, f) => `${p}: a closer look at ${f}.` },
  { angle: "Search", platforms: ["Pinterest"], make: (p, f) => `${p} — features, close-ups, and what to check before buying.` },
  { angle: "Search", platforms: ["Pinterest", "YouTube Shorts"], make: (p, f) => `What ${f} means on ${p}, explained simply.` },
  { angle: "Search", platforms: ["YouTube Shorts"], make: (p, f) => `${p} walkthrough — the parts that matter.` },

  // --- Contrast without naming competitors
  { angle: "Contrast", platforms: ["TikTok Shop", "YouTube Shorts", "Facebook"], make: (p, f) => `Most of them skip this. ${p} does not.` },
  { angle: "Contrast", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `The version with ${f} is a different experience.` },
  { angle: "Contrast", platforms: ["TikTok Shop"], make: (p, f) => `Same idea, different execution. ${p}.` },

  // --- Direct
  { angle: "Direct", platforms: ["TikTok Shop", "Facebook", "Instagram Reels"], make: (p, f) => `${p}. ${f}. That is it.` },
  { angle: "Direct", platforms: ["TikTok Shop"], make: (p, f) => `Here is ${p} and exactly what it does.` },
  { angle: "Direct", platforms: ["Facebook", "YouTube Shorts"], make: (p, f) => `Short version: ${p} is built around ${f}.` },

  // --- Researched patterns (Aug 2026). Documented as high-performing across
  // TikTok, Shorts, Reels and Pinterest. Rewritten to fit DONE RITE rules:
  // the specificity comes from counts, timeframes and part names, never from
  // prices or dollar amounts, which the compliance rules forbid.
  { angle: "Contrarian", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `Most people get this wrong about ${p}.` },
  { angle: "Contrarian", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `Here is what nobody tells you about ${p}.` },
  { angle: "Contrarian", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `Stop checking the wrong thing when you look at ${p}.` },
  { angle: "Contrarian", platforms: ["YouTube Shorts", "Facebook"], make: (p, f) => `Everyone looks at the wrong part of ${p} first.` },

  // Result-first. Showing the finished product in the opening frame is the
  // single strongest documented pattern, and it suits a no-face format.
  { angle: "Result first", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `This is ${p} set up and ready. Now here is how it got there.` },
  { angle: "Result first", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `Finished result first: ${p} with ${f}.` },
  { angle: "Result first", platforms: ["TikTok Shop", "YouTube Shorts"], make: (p, f) => `Start at the end. This is what ${p} looks like in place.` },

  // Numbered specificity — counts and timeframes only, never amounts.
  { angle: "Specific", platforms: ["TikTok Shop", "YouTube Shorts", "Pinterest"], make: (p, f) => `Three things I check on ${p} before anything else.` },
  { angle: "Specific", platforms: ["YouTube Shorts", "Pinterest"], make: (p, f) => `${p}: the two parts that actually matter.` },
  { angle: "Specific", platforms: ["TikTok Shop", "YouTube Shorts"], make: (p, f) => `Seven seconds on ${f}, then you decide.` },
  { angle: "Specific", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `One feature, five seconds: ${f}.` },

  // Mid-action openers. Documented advice for Shorts is to skip the greeting
  // entirely and begin inside the most interesting moment.
  { angle: "Mid-action", platforms: ["YouTube Shorts", "TikTok Shop", "Instagram Reels"], make: (p, f) => `Already running. This is ${f} doing its job.` },
  { angle: "Mid-action", platforms: ["YouTube Shorts", "Instagram Reels"], make: (p, f) => `No intro. ${p}, ${f}, watch.` },

  // Search-intent openers for Pinterest, where people arrive already looking.
  { angle: "Search", platforms: ["Pinterest", "YouTube Shorts"], make: (p, f) => `What to check before buying ${p}.` },
  { angle: "Search", platforms: ["Pinterest"], make: (p, f) => `${p}: ${f} shown close up.` },
  { angle: "Search", platforms: ["Pinterest", "Facebook"], make: (p, f) => `Looking at ${p}? Start with ${f}.` },

  // --- Hands-on (added Aug 2026 with the format change).
  // Demonstrations convert far better than talking-head reviews, and static
  // slideshows no longer earn distribution. These openers only make sense if
  // hands are actually in frame doing the thing — which is now the default.
  { angle: "Hands-on", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `Hands on ${p}. Here is what ${f} feels like.` },
  { angle: "Hands-on", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `Watch my hands, not a product photo. ${p}.` },
  { angle: "Hands-on", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `One take, no cuts. ${p} doing the thing.` },
  { angle: "Hands-on", platforms: ["TikTok Shop", "YouTube Shorts"], make: (p, f) => `I am not going to describe ${f}. I am going to show it.` },
  { angle: "Hands-on", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `This is ${p} out of the box and straight into use.` },

  // --- Utility-first. The opening three seconds should show what it does.
  { angle: "Utility", platforms: ["TikTok Shop", "YouTube Shorts", "Instagram Reels"], make: (p, f) => `That is ${p} doing its whole job in three seconds.` },
  { angle: "Utility", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `No build-up. ${p} works like this.` },
  { angle: "Utility", platforms: ["TikTok Shop", "YouTube Shorts", "Pinterest"], make: (p, f) => `${f}, in one motion. That is ${p}.` },
  { angle: "Utility", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `Whole thing, start to finish, before you can scroll.` },

  // --- Screenshot hook expansion (Aug 30, 2026).
  // Adapted from the user's 18 reference screenshots. Risky originals that
  // relied on superiority, money outcomes, guaranteed results or pressure
  // were rewritten into product-specific, claim-safe open loops.
  { angle: "Conversation", platforms: ["TikTok Shop", "Instagram Reels", "Facebook", "YouTube Shorts"], make: (p, f) => `Okay, this is actually useful. Here is ${f} on ${p}.` },
  { angle: "Conversation", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `You know that moment when one small detail changes how you use something? On ${p}, it is ${f}.` },
  { angle: "Problem", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `I did not realize how much this bothered me until I tried ${p}.` },
  { angle: "Curiosity", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `I thought this was just another ${p} until I noticed ${f}.` },
  { angle: "Conversation", platforms: ["TikTok Shop", "Instagram Reels", "Facebook", "YouTube Shorts"], make: (p, f) => `Can I show you something? Look at ${f} on ${p}.` },

  // Weekly conversational prompts.
  { angle: "Conversation", platforms: ["TikTok Shop", "Facebook", "Instagram Reels"], make: (p, f) => `Since we are already here, we might as well talk about ${f} on ${p}.` },
  { angle: "Conversation", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `If we were best friends, I would tell you to check ${f} before choosing ${p}.` },
  { angle: "Reverse", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `Whatever you do, do not save this unless you want a closer look at ${f}.` },
  { angle: "Probing", platforms: ["TikTok Shop", "Facebook", "Instagram Reels"], make: (p, f) => `This may sound blunt, but why does everyone overlook ${f} on ${p}?` },
  { angle: "Creator talk", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `Creator to creator: this is the shot I would use to show ${f}.` },

  // Bold/opinion patterns, softened to avoid superiority and absolute claims.
  { angle: "Opinion", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `Whoever said details do not matter was not looking at ${f}.` },
  { angle: "Opinion", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `I may have been checking the wrong part of ${p}. Start with ${f}.` },
  { angle: "Discovery", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `I was today years old when I noticed ${f} on ${p}.` },
  { angle: "Opinion", platforms: ["TikTok Shop", "YouTube Shorts"], make: (p, f) => `This is a detail I will stand behind: ${f} deserves a closer look.` },
  { angle: "Curiosity", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `This might change how you look at ${p}: ${f}.` },
  { angle: "Opinion", platforms: ["TikTok Shop", "Facebook", "YouTube Shorts"], make: (p, f) => `My honest take on ${p}: check ${f} before anything else.` },
  { angle: "Contrast", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `The internet talks about ${p}, but this is the detail I wanted to see: ${f}.` },
  { angle: "Contrast", platforms: ["TikTok Shop", "YouTube Shorts"], make: (p, f) => `Here is the detail I would compare first on ${p}: ${f}.` },
  { angle: "Direct", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `I chose the detail people skip. This is ${f} on ${p}.` },
  { angle: "Direct", platforms: ["TikTok Shop", "YouTube Shorts", "Pinterest"], make: (p, f) => `If I were building the setup around one feature, I would start with ${f}.` },

  // Reverse-psychology patterns without false scarcity or manipulation.
  { angle: "Reverse", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `Let us not even talk about the box. Watch ${f} on ${p}.` },
  { angle: "Reverse", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `If you already know exactly what you need, this may not be for you.` },
  { angle: "Reverse", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `Do not look at the packaging. Look at ${f}.` },
  { angle: "Reverse", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `You might not want to watch this if ${f} does not matter to you.` },
  { angle: "Reverse", platforms: ["TikTok Shop", "Facebook", "YouTube Shorts"], make: (p, f) => `This will make the most sense if you use ${p} for the same reason I do.` },
  { angle: "Reverse", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `This is not for you if you do not care about ${f}.` },
  { angle: "Reverse", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `If your current setup already works for you, keep scrolling.` },

  // Probing prompts kept focused on observable product details.
  { angle: "Probing", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `Can someone explain why ${f} gets overlooked on ${p}?` },
  { angle: "Probing", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `I am not trying to start a debate. I want to know whether you would use ${f}.` },
  { angle: "Probing", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `If this task feels harder than it should, check ${f}.` },
  { angle: "Probing", platforms: ["TikTok Shop", "YouTube Shorts"], make: (p, f) => `You might not need another accessory. You might need ${f}.` },
  { angle: "Probing", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `If you disagree, tell me which feature matters more than ${f}.` },
  { angle: "Direct", platforms: ["TikTok Shop", "Facebook", "YouTube Shorts"], make: (p, f) => `You wanted the short version, so here it is: ${p}, with ${f}.` },
  { angle: "Direct", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `I will not sugarcoat it: ${f} is the part I would check first.` },

  // Vulnerability/open-loop phrases, used only as honest creator framing.
  { angle: "Vulnerability", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `I am a little embarrassed I overlooked ${f} on ${p}.` },
  { angle: "Vulnerability", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `Here goes nothing. This is the part of ${p} I wanted to test.` },
  { angle: "Vulnerability", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `I almost did not post this, but ${f} is worth showing up close.` },
  { angle: "Vulnerability", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `I am putting this out there before I overthink it: ${f}.` },
  { angle: "Vulnerability", platforms: ["TikTok Shop", "Instagram Reels", "Facebook"], make: (p, f) => `This could go either way, so watch ${f} and decide for yourself.` },

  // Outcome-first framework: show the payoff immediately, then explain it.
  { angle: "Outcome first", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts", "Facebook"], make: (p, f) => `Here is ${p} ready to use. Now watch ${f}.` },
  { angle: "Outcome first", platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts"], make: (p, f) => `Start with the finished setup: ${p} with ${f}.` },
  { angle: "Outcome first", platforms: ["TikTok Shop", "Facebook"], make: (p, f) => `The useful part first: ${f}. The setup comes next.` },
  { angle: "Outcome first", platforms: ["TikTok Shop", "Instagram Reels"], make: (p, f) => `Watch the result first, then I will show you the setup.` },
  { angle: "Outcome first", platforms: ["YouTube Shorts", "Pinterest", "Facebook"], make: (p, f) => `${p} ready to go, with ${f} shown clearly.` },
];

/* Picks three hooks from three DIFFERENT angles, rotating each time so the
   same product does not produce the same three twice in a row. Anything the
   user has marked as a proven winner is offered first — their own sales data
   beats any generic list. */
function pickHooks(product, feature, platform, winners, spin) {
  const proven = (winners || [])
    .filter((w) => !w.platform || w.platform === platform)
    .slice(0, 2)
    .map((w) => w.text);

  const pool = HOOK_LIBRARY.filter((h) => h.platforms.indexOf(platform) !== -1);
  const usable = pool.length ? pool : HOOK_LIBRARY;

  const byAngle = {};
  usable.forEach((h) => {
    if (!byAngle[h.angle]) byAngle[h.angle] = [];
    byAngle[h.angle].push(h);
  });
  const angles = Object.keys(byAngle);

  const out = proven.slice();
  for (let i = 0; out.length < 3 && i < angles.length; i += 1) {
    const angle = angles[(spin + i) % angles.length];
    const bucket = byAngle[angle];
    const choice = bucket[(spin + i * 7) % bucket.length];
    const text = choice.make(product, feature);
    if (out.indexOf(text) === -1) out.push(text);
  }
  return out.slice(0, 3);
}


/* CALL TO ACTION LIBRARY
   ------------------------------------------------------------------
   Cart- or link-directed only. No urgency, no scarcity, no deadlines,
   no price or discount language, no "everyone is buying this" — all of
   which are on the banned list. The variety is in the framing. */
const CTA_LIBRARY = [
  // TikTok Shop — the cart is right there, so point at it plainly.
  { style: "Direct", platforms: ["TikTok Shop"], text: "Product details are in the cart." },
  { style: "Direct", platforms: ["TikTok Shop"], text: "Tap the cart to see the full listing." },
  { style: "Direct", platforms: ["TikTok Shop"], text: "Full specs are on the product page in the cart." },
  { style: "Direct", platforms: ["TikTok Shop"], text: "Everything you need is in the orange cart." },
  { style: "Informed", platforms: ["TikTok Shop"], text: "Check the specs in the cart before you decide." },
  { style: "Informed", platforms: ["TikTok Shop"], text: "Read the listing in the cart and see if it fits your setup." },
  { style: "Low pressure", platforms: ["TikTok Shop"], text: "Have a look at the details in the cart. No rush." },
  { style: "Low pressure", platforms: ["TikTok Shop"], text: "The cart has the rest. Decide for yourself." },
  { style: "Qualifying", platforms: ["TikTok Shop"], text: "If that matches what you need, the cart has the full listing." },
  { style: "Qualifying", platforms: ["TikTok Shop"], text: "Not for everyone. If it is for you, the details are in the cart." },

  // YouTube Shorts — description link.
  { style: "Direct", platforms: ["YouTube Shorts"], text: "Product link is in the description." },
  { style: "Direct", platforms: ["YouTube Shorts"], text: "Full details are linked below." },
  { style: "Informed", platforms: ["YouTube Shorts"], text: "Check the description for the full spec sheet." },
  { style: "Low pressure", platforms: ["YouTube Shorts"], text: "Link is below if you want a closer look." },

  // Pinterest — savers and searchers, not impulse buyers.
  { style: "Direct", platforms: ["Pinterest"], text: "Tap through for the full product details." },
  { style: "Informed", platforms: ["Pinterest"], text: "Save this and check the product page when you are ready." },
  { style: "Low pressure", platforms: ["Pinterest"], text: "Pin it for later. The listing has the rest." },

  // Facebook and Instagram.
  { style: "Direct", platforms: ["Facebook", "Instagram Reels"], text: "Product details are in the link." },
  { style: "Direct", platforms: ["Facebook", "Instagram Reels"], text: "Full listing is linked for you." },
  { style: "Informed", platforms: ["Facebook", "Instagram Reels"], text: "The link has the specs if you want to compare." },
  { style: "Low pressure", platforms: ["Facebook", "Instagram Reels"], text: "Take a look at the listing and decide for yourself." },
  { style: "Qualifying", platforms: ["Facebook", "Instagram Reels"], text: "If this solves something for you, the details are in the link." },

  // Demo-linked (added Aug 2026). Naming what the hands just did makes the CTA
  // read as the end of the demo rather than an ad break. Still no urgency,
  // no price, no scarcity — the specificity comes from the footage.
  { style: "Demo-linked", platforms: ["TikTok Shop"], text: "That is the whole motion. Full listing is in the cart." },
  { style: "Demo-linked", platforms: ["TikTok Shop"], text: "You just watched it work. Specs are in the cart." },
  { style: "Demo-linked", platforms: ["TikTok Shop"], text: "Same product, same hands, no edit. Details are in the cart." },
  { style: "Demo-linked", platforms: ["YouTube Shorts"], text: "That is it in real use. Full details are linked below." },
  { style: "Demo-linked", platforms: ["Instagram Reels", "Facebook"], text: "You saw what it does. The listing has the rest." },
  { style: "Demo-linked", platforms: ["Pinterest"], text: "Save this demo. The product page has the full spec." },
];

/* Every hook the library can produce for a given platform, already filled in
   with this product and feature — used to populate the Quick Create dropdown. */
function hookOptions(product, feature, platform) {
  const pool = HOOK_LIBRARY.filter((h) => h.platforms.indexOf(platform) !== -1);
  const usable = pool.length ? pool : HOOK_LIBRARY;
  const seen = {};
  const out = [];
  usable.forEach((h) => {
    const text = h.make(product, feature);
    if (seen[text]) return;
    seen[text] = true;
    out.push({ angle: h.angle, text });
  });
  return out;
}

function ctaOptions(platform) {
  const pool = CTA_LIBRARY.filter((c) => c.platforms.indexOf(platform) !== -1);
  return pool.length ? pool : CTA_LIBRARY;
}

/* WHAT THE CURRENT DATA SAYS (checked Aug 2026)
   ------------------------------------------------------------------
   These are the findings the hook, CTA and shot-pattern libraries below
   are built on. They are shown inside Quick Create so the format choice
   is never blind. Re-check these every quarter — platform behaviour
   moves faster than any app can. */
const RESEARCH_NOTES = [
  {
    finding: "Demonstrations beat talking heads",
    detail: "TikTok Shop affiliate videos with a product demonstration convert roughly 3–5x better than talking-head reviews. Hands doing something to the product is the lift — not a face.",
    soWhat: "Every shot pattern below keeps hands in frame and the head out.",
  },
  {
    finding: "Static slideshows are being throttled",
    detail: "Static image slideshows and silent unboxing videos no longer earn organic algorithmic distribution.",
    soWhat: "Continuous hand motion is now the default. The old product-image-only format is retired.",
  },
  {
    finding: "First three seconds must show utility",
    detail: "The opening three seconds should show what the product actually does, not build suspense.",
    soWhat: "Every pattern opens mid-action. No empty frame, no reaching in, no logo card.",
  },
  {
    finding: "Faceless is still fine",
    detail: "The algorithm measures watch time, completion, shares, comments and saves. It does not measure whether a face appears.",
    soWhat: "Hands-on with no face keeps the 5StarGadgetGuru identity and takes the demo lift.",
  },
  {
    finding: "Daily posting limits exist now",
    detail: "A Content Posting Limit introduced in May 2026 dampens accounts that flood the feed with shoppable video. New creators in the pilot period are capped at a handful of shoppable videos and LIVEs per week.",
    soWhat: "Fewer, better product tests. Volume alone is no longer a strategy.",
  },
  {
    finding: "Tutorials and demos read as organic",
    detail: "Product tutorials, unboxings and in-use footage outperform static promotion because they look less like an advertisement.",
    soWhat: "The Unbox to use and Problem to demo patterns exist for exactly this.",
  },
];

/* SHOT PATTERN LIBRARY — hands in frame, head out of frame
   ------------------------------------------------------------------
   Each entry is a documented scaling format, not a style preference.
   The `why` line is the reason it earned a slot. None of them lean on a
   claim to do the work, so any of them can carry a compliant script. */
const SHOT_PATTERNS = [
  {
    id: "demo-first",
    name: "Demo first",
    why: "Demonstrations convert about 3–5x better than talking-head reviews.",
    platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts", "Facebook"],
    beats: (p, f) => [
      { label: "OPEN MID-ACTION", hands: `Hands are already using ${p} on frame one. Nothing enters the shot.` },
      { label: "NAME IT", hands: `Slow rotate. Thumb rests on ${f} so the eye goes there.` },
      { label: "THE DEMO", hands: "The working motion itself, one unbroken take. No cut here." },
      { label: "HAND OFF", hands: "Set it down, then point off-frame toward the cart." },
    ],
  },
  {
    id: "utility-3s",
    name: "Utility in three seconds",
    why: "The opening three seconds should show what the product does, not build suspense.",
    platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts", "Facebook", "Pinterest"],
    beats: (p, f) => [
      { label: "THE JOB", hands: `Hands complete one full useful action with ${p} before the third second.` },
      { label: "REPLAY CLOSER", hands: "Same action again, tighter crop, slower." },
      { label: "THE PART THAT DOES IT", hands: `Fingers isolate ${f} and hold it still for a beat.` },
      { label: "HAND OFF", hands: "Product flat in palm, then point off-frame toward the cart." },
    ],
  },
  {
    id: "result-first",
    name: "Result first, then how",
    why: "Opening on the finished state is the strongest documented pattern for a no-face format.",
    platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts", "Facebook"],
    beats: (p, f) => [
      { label: "THE END STATE", hands: `${p} already set up and working. Hands rest beside it, not on it.` },
      { label: "REWIND", hands: "Hands pick it up from the starting position. Motion reverses the story." },
      { label: "THE STEPS", hands: "Two or three quick hand movements that get it back to the end state." },
      { label: "HAND OFF", hands: "Back to the finished shot, then point off-frame toward the cart." },
    ],
  },
  {
    id: "unbox-to-use",
    name: "Unbox to use",
    why: "Tutorials and unboxings read as organic rather than as an advertisement — but only with continuous motion.",
    platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts", "Facebook"],
    beats: (p, f) => [
      { label: "ALREADY OPENING", hands: "Box is mid-open on frame one. Never start with a sealed box sitting still." },
      { label: "OUT AND UP", hands: `${p} lifted clear of the packaging in one motion.` },
      { label: "STRAIGHT TO USE", hands: `Hands go directly into using it. Show ${f} working.` },
      { label: "HAND OFF", hands: "Packaging pushed out of frame, product held up, point toward the cart." },
    ],
  },
  {
    id: "problem-to-demo",
    name: "Problem to demo",
    why: "Showing the annoyance first gives the demo something to resolve, which holds watch time to the end.",
    platforms: ["TikTok Shop", "Facebook", "YouTube Shorts", "Instagram Reels"],
    beats: (p, f) => [
      { label: "THE ANNOYANCE", hands: "Hands struggle with the old way. Keep it short and obvious." },
      { label: "SWITCH", hands: `Old thing pushed aside, ${p} picked up in the same movement.` },
      { label: "THE FIX", hands: `Same task done with ${p}. Let ${f} do the visible work.` },
      { label: "HAND OFF", hands: "Both options in frame side by side, then point toward the cart." },
    ],
  },
  {
    id: "detail-pass",
    name: "Close-up detail pass",
    why: "One feature shown properly outperforms five features listed. Macro hands read as inspection, not sales.",
    platforms: ["TikTok Shop", "Pinterest", "YouTube Shorts", "Instagram Reels"],
    beats: (p, f) => [
      { label: "MACRO OPEN", hands: `Extreme close-up. Fingertips already turning ${p}.` },
      { label: "THE DETAIL", hands: `Hold on ${f}. Fingers trace it so the viewer knows where to look.` },
      { label: "PULL BACK", hands: "Widen out to show the detail in context, hands still moving." },
      { label: "HAND OFF", hands: "Product settles in the palm, then point toward the cart." },
    ],
  },
  {
    id: "search-answer",
    name: "Search answer",
    why: "Pinterest and Shorts viewers arrive already looking. Clarity beats mystery for search-driven traffic.",
    platforms: ["Pinterest", "YouTube Shorts", "Facebook", "TikTok Shop"],
    beats: (p, f) => [
      { label: "STATE THE QUESTION", hands: `${p} held square to camera, hands turning it slowly.` },
      { label: "CHECK ONE", hands: `Fingers point directly at ${f}.` },
      { label: "CHECK TWO", hands: "Move to a second verified detail. Same steady pace." },
      { label: "HAND OFF", hands: "Product set down flat, then point toward the listing." },
    ],
  },
];
window.DoneRiteContentLibraries={HOOK_LIBRARY,pickHooks,CTA_LIBRARY,hookOptions,ctaOptions,RESEARCH_NOTES,SHOT_PATTERNS};
})();
