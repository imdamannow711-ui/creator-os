/* DONE RITE Creator OS — application code
   ==================================================================
   This file holds the whole dashboard. index.html holds React and the
   page shell, and almost never changes. This file changes every update,
   which means an update is a small upload instead of a huge one.

   Everything is wrapped in a function so it cannot collide with any
   leftover code still sitting inside index.html.
   ================================================================== */
(function () {
"use strict";

var React = window.React;
var ReactDOM = window.ReactDOM;
var mountPoint = document.getElementById("root");

if (!React || !ReactDOM) {
  if (mountPoint) {
    mountPoint.innerHTML =
      '<div id="boot"><h1>DONE RITE Creator OS</h1>' +
      '<p>React did not load. Check that index.html still has its React block above this file.</p></div>';
  }
  return;
}

const { useEffect, useMemo, useRef, useState } = React;
/*
  DONE RITE Creator OS — single-file React component
  --------------------------------------------------
  Drop this file into a React/Vite/Next project and render <DoneRiteCreatorOS />.
  No third-party UI library is required. Data is stored on the current device.
*/
const COLORS = {
    void: "#080a0e",
    panel: "#11151c",
    panel2: "#171c25",
    line: "#2a3442",
    chrome: "#c4ccd6",
    dim: "#8793a1",
    text: "#eef3f8",
    blue: "#1e7bff",
    blueGlow: "#58a6ff",
    green: "#2bd97c",
    amber: "#ffb020",
    red: "#ff4d5a",
};
const STORAGE_KEY = "done-rite-creator-os:v1";
const CATEGORIES = [
    "Electronics & Gadgets",
    "Kitchen",
    "Home",
    "Outdoor",
    "Apparel",
    "Wellness & Supplements",
    "Oral & Dental",
    "Skincare",
    "Body-Applied Products",
    "Kids' Products",
    "Tools",
    "Lifestyle",
];
const DEFAULT_TASKS = [
    { id: "shop", label: "Check TikTok Shop", done: false },
    { id: "samples", label: "Review sample opportunities", done: false },
    { id: "create", label: "Create one product package", done: false },
    { id: "comments", label: "Reply to important comments", done: false },
    { id: "results", label: "Record results and new ideas", done: false },
];
const EMPTY_FORM = {
    productName: "",
    category: "Electronics & Gadgets",
    verifiedFeatures: "",
    funnel: "BOF",
    duration: "15",
    platform: "TikTok Shop",
    sampleReceived: false,
    acquisition: "none",
    chosenHook: "",
    chosenCta: "",
    chosenPattern: "",
    searchPhrase: "",
    batteryPowered: false,
};

/* A logged Content Gap phrase, before anything is filled in. */
const EMPTY_GAP = {
    phrase: "",
    category: "Electronics & Gadgets",
    gapLevel: "High",
    note: "",
};
const EMPTY_MONEY = {
    type: "Affiliate revenue",
    platform: "TikTok Shop",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
};
const CSS = `
  * { box-sizing: border-box; }
  .dr-shell {
    min-height: 100vh;
    background:
      radial-gradient(circle at 50% -10%, rgba(30,123,255,.22), transparent 34rem),
      ${COLORS.void};
    color: ${COLORS.text};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    padding-bottom: 86px;
  }
  .dr-wrap { width: min(820px, 100%); margin: 0 auto; padding: 16px; }
  .dr-header {
    position: sticky; top: 0; z-index: 20;
    border-bottom: 1px solid ${COLORS.line};
    background: rgba(8,10,14,.94); backdrop-filter: blur(14px);
  }
  .dr-brand { display:flex; align-items:center; gap:10px; min-height:64px; }
  .dr-bolt { color:${COLORS.blueGlow}; font-size:24px; filter:drop-shadow(0 0 8px ${COLORS.blue}); }
  .dr-title { margin:0; font-size:15px; letter-spacing:.13em; text-transform:uppercase; }
  .dr-tagline { margin:3px 0 0; color:${COLORS.dim}; font-size:12px; }
  .dr-tabs { display:flex; gap:8px; overflow-x:auto; padding:10px 16px; scrollbar-width:none; }
  .dr-tabs::-webkit-scrollbar { display:none; }
  .dr-tab, .dr-button, .dr-copy, .dr-danger {
    min-height:44px; border-radius:12px; border:1px solid ${COLORS.line};
    padding:10px 14px; font:inherit; font-weight:800; cursor:pointer;
    -webkit-tap-highlight-color:transparent;
  }
  .dr-tab { flex:0 0 auto; color:${COLORS.chrome}; background:${COLORS.panel}; }
  .dr-tab[aria-selected="true"] { color:white; background:${COLORS.blue}; border-color:${COLORS.blueGlow}; }
  .dr-button { width:100%; background:linear-gradient(135deg, ${COLORS.blue}, #0f4fa8); color:white; }
  .dr-button:disabled { opacity:.45; cursor:not-allowed; }
  .dr-copy { background:${COLORS.panel2}; color:${COLORS.blueGlow}; }
  .dr-copy.is-copied, .dr-button.is-copied {
    background:${COLORS.green}; color:#04140a; border-color:${COLORS.green};
  }
  .dr-danger { background:transparent; color:${COLORS.red}; }

  /* Every button flashes its own colour the moment it is pressed. */
  .dr-tab, .dr-button, .dr-copy, .dr-danger, .dr-nav button {
    transition: background-color .08s ease, color .08s ease, border-color .08s ease, transform .08s ease;
  }
  .dr-pressed { transform: scale(.97); }
  .dr-chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
  .dr-chip {
    min-height:36px; padding:8px 12px; border-radius:999px; font:inherit; font-size:13px; font-weight:800;
    background:${COLORS.panel2}; color:${COLORS.chrome}; border:1px solid ${COLORS.line}; cursor:pointer;
    -webkit-tap-highlight-color:transparent;
  }
  .dr-chip.dr-pressed,
  .dr-tab.dr-pressed,
  .dr-button.dr-pressed,
  .dr-copy.dr-pressed,
  .dr-danger.dr-pressed,
  .dr-nav button.dr-pressed {
    background:#eaf6ff; color:#062240; border-color:#ffffff;
    text-shadow:0 0 6px rgba(120,200,255,.9);
    box-shadow:
      0 0 0 2px #ffffff,
      0 0 0 6px rgba(46,168,255,.55),
      0 0 26px 8px rgba(46,168,255,.85),
      0 0 54px 16px rgba(30,123,255,.45);
    animation: dr-arc .42s steps(1) 1;
  }
  @keyframes dr-arc {
    0%   { background:#ffffff; box-shadow:0 0 0 3px #ffffff, 0 0 40px 14px rgba(160,220,255,.95); }
    18%  { background:${COLORS.blueGlow}; box-shadow:0 0 0 2px #cfe8ff, 0 0 18px 5px rgba(46,168,255,.7); }
    34%  { background:#ffffff; box-shadow:0 0 0 3px #ffffff, 0 0 34px 12px rgba(160,220,255,.9); }
    55%  { background:${COLORS.blue}; box-shadow:0 0 0 2px #9ad2ff, 0 0 22px 7px rgba(46,168,255,.75); }
    100% { background:#eaf6ff; box-shadow:0 0 0 2px #ffffff, 0 0 26px 8px rgba(46,168,255,.7); }
  }
  @media (prefers-reduced-motion: reduce) { .dr-chip.dr-pressed { animation:none; } }
  
  
  
  
  
  @media (prefers-reduced-motion: reduce) {
    .dr-pressed { transform:none; }
  }
  .dr-grid { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:12px; }
  .dr-card { background:rgba(17,21,28,.96); border:1px solid ${COLORS.line}; border-radius:18px; padding:16px; }
  .dr-card + .dr-card { margin-top:12px; }
  .dr-metric { font-size:28px; font-weight:900; color:${COLORS.blueGlow}; }
  .dr-label { display:block; margin:0 0 7px; color:${COLORS.chrome}; font-size:12px; font-weight:900; letter-spacing:.07em; text-transform:uppercase; }
  .dr-help { color:${COLORS.dim}; font-size:13px; line-height:1.5; }
  .dr-input, .dr-select, .dr-textarea {
    width:100%; border:1px solid ${COLORS.line}; border-radius:12px;
    background:${COLORS.panel2}; color:${COLORS.text}; padding:13px;
    font:inherit; font-size:16px; outline:none;
  }
  .dr-input:focus, .dr-select:focus, .dr-textarea:focus { border-color:${COLORS.blueGlow}; box-shadow:0 0 0 3px rgba(88,166,255,.14); }
  .dr-textarea { min-height:112px; resize:vertical; }
  .dr-field { margin-bottom:14px; }
  .dr-row { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .dr-row > * { flex:1 1 150px; }
  .dr-check { display:flex; gap:10px; align-items:flex-start; color:${COLORS.chrome}; font-size:14px; line-height:1.4; }
  .dr-check input { width:22px; height:22px; margin:0; accent-color:${COLORS.blue}; flex:0 0 auto;
    transition: box-shadow .12s ease, transform .12s ease; }
  .dr-check input:checked {
    accent-color:${COLORS.red};
    box-shadow:0 0 0 3px rgba(255,77,99,.35), 0 0 14px 3px rgba(255,77,99,.55);
    border-radius:4px;
  }
  .dr-check input:checked + span { color:${COLORS.red}; font-weight:800; }
  .dr-check.dr-struck input:checked { transform:scale(1.12); }
  .dr-output { white-space:pre-wrap; line-height:1.55; font-size:14px; color:${COLORS.text}; }
  .dr-output-head { display:flex; gap:10px; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .dr-output-head .dr-copy { flex:0 0 auto; min-height:38px; padding:8px 12px; }
  .dr-flag { border-left:4px solid ${COLORS.amber}; }
  .dr-block { border-left-color:${COLORS.red}; }
  .dr-clear { border-left:4px solid ${COLORS.green}; }
  .dr-pill { display:inline-flex; border:1px solid ${COLORS.line}; border-radius:999px; padding:5px 9px; color:${COLORS.chrome}; background:${COLORS.panel2}; font-size:12px; }
  .dr-list { display:grid; gap:9px; }
  .dr-item { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:12px; border:1px solid ${COLORS.line}; border-radius:12px; background:${COLORS.panel2}; }
  .dr-item-main { min-width:0; flex:1; }
  .dr-item-title { font-weight:800; overflow-wrap:anywhere; }
  .dr-status { min-height:24px; margin:10px 0; text-align:center; color:${COLORS.green}; font-weight:800; }
  .dr-savewarn { display:flex; flex-direction:column; gap:6px; margin:0 0 14px; padding:14px 16px;
    border:2px solid #ffb020; border-radius:12px; background:#2a1c00; color:#ffffff;
    font-size:15px; line-height:1.45; }
  .dr-savewarn strong { color:#ffd166; font-size:16px; }
  .dr-upload-box { border:1px dashed ${COLORS.blueGlow}; border-radius:14px; padding:14px; background:rgba(30,123,255,.08); }
  .dr-progress { height:9px; overflow:hidden; border-radius:999px; background:${COLORS.panel2}; border:1px solid ${COLORS.line}; }
  .dr-progress > span { display:block; height:100%; background:linear-gradient(90deg, ${COLORS.blue}, ${COLORS.green}); transition:width .18s ease; }
  .dr-nav {
    position:fixed; left:0; right:0; bottom:0; z-index:25;
    border-top:1px solid ${COLORS.line}; background:rgba(17,21,28,.97);
    padding-bottom:env(safe-area-inset-bottom);
  }
  .dr-nav-inner { width:min(820px,100%); margin:0 auto; display:flex; overflow-x:auto; }
  .dr-nav button { flex:1 0 74px; min-height:62px; border:0; background:transparent; color:${COLORS.dim}; font:inherit; font-size:11px; font-weight:800; }
  .dr-nav button[aria-current="page"] { color:${COLORS.blueGlow}; }
  h2 { margin:0 0 6px; font-size:22px; }
  h3 { margin:0; font-size:15px; }
  @media (max-width:540px) { .dr-grid { grid-template-columns:1fr 1fr; } .dr-wrap { padding:12px; } }
`;
function uid() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function money(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));
}
function safeFeatureText(text) {
    return String(text || "")
        .replace(/\$\s?\d+(?:\.\d{1,2})?/gi, "")
        .replace(/\b(discount|sale|cheapest|lowest price|coupon|save money)\b/gi, "")
        .replace(/\b(guaranteed|guarantee|instantly|instant|perfect|flawless|never fails)\b/gi, "")
        .replace(/\b100\s?%|\b100 percent\b/gi, "")
        .replace(/\b(cure|cures|cured|curing|treat|treats|treated|treating|prevent|prevents|prevented|preventing|heal|heals|healed|healing|reverse|reverses|reversed|reversing|fix|fixes|fixed|fixing|detox|detoxes|relieve|relieves|relieved|relieving|alleviate|alleviates|remedy|remedies)\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .replace(/\s+([,.;:])/g, "$1")
        .replace(/^[\s,;:.\-]+/, "")
        .trim();
}

let gapOcrLibraryPromise = null;
function loadGapOcrLibrary() {
    if (window.Tesseract)
        return Promise.resolve(window.Tesseract);
    if (gapOcrLibraryPromise)
        return gapOcrLibraryPromise;
    gapOcrLibraryPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.min.js";
        script.async = true;
        script.onload = () => window.Tesseract ? resolve(window.Tesseract) : reject(new Error("The screenshot reader did not start."));
        script.onerror = () => reject(new Error("The screenshot reader could not load. Connect to the internet and try again."));
        document.head.appendChild(script);
    });
    return gapOcrLibraryPromise;
}

function contentGapPhrasesFromText(text) {
    const ignored = /^(content gap|creator search insights|search insights|search|inspiration|analytics|recommended|followers?|following|friends?|profile|home|shop|inbox|videos?|posts?|views?|likes?|comments?|shares?|high|medium|low|all|filter|filters|back|done|cancel|today|yesterday|last 7 days|last 30 days)$/i;
    const seen = new Set();
    return String(text || "")
        .split(/\r?\n/)
        .map((line) => line.replace(/[|•●■►]+/g, " ").replace(/\s+/g, " ").trim())
        .map((line) => line.replace(/^\d+[.)]\s*/, "").replace(/\s+\d+(?:[.,]\d+)?[KMB]?\s*(?:views?|searches?|posts?|videos?|%)?.*$/i, "").trim())
        .filter((line) => line.length >= 5 && line.length <= 110)
        .filter((line) => !ignored.test(line) && !/^\d+(?:[.,]\d+)?%?$/.test(line))
        .filter((line) => (line.match(/[A-Za-z]{2,}/g) || []).length >= 2)
        .filter((line) => {
            const key = line.toLowerCase();
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        })
        .slice(0, 20);
}
function scanCompliance(text, form = {}) {
    const source = String(text || "");
    const issues = [];
    const add = (id, severity, label, safer) => {
        if (!issues.some((item) => item.id === id))
            issues.push({ id, severity, label, safer });
    };
    if (/\$\s?\d|\b(price|discount|sale|cheapest|lowest price|coupon|save money)\b/i.test(source)) {
        add("pricing", "block", "Pricing or promotional language detected.", "Remove the price or promotion and direct viewers to product details.");
    }
    if (/\b(guaranteed|instantly|100%|perfect|never fails)\b/i.test(source)) {
        add("absolute", "block", "Absolute performance claim detected.", "Use “designed to,” “built for,” or a verified feature statement.");
    }
    if (/\b(cure|cures|cured|curing|treat|treats|treated|treating|prevent|prevents|prevented|preventing|heal|heals|healed|healing|remedy|remedies|reverse|reverses|reversed|reversing|relieve|relieves|relieved|relieving|alleviate|alleviates|diagnose|diagnoses|detox|detoxes|antibacterial|antiviral|antifungal|clinically proven|doctor recommended|medical grade|pharmaceutical grade|disease|diseases|weight loss|lose weight|burn fat|immune boosting)\b/i.test(source)) {
        add("health", "block", "Health or medical claim detected.", "Remove the treatment, cure, or outcome wording and describe only verified product features.");
    }
    if (/\b(arthritis|anxiety|depression|diabetes|diabetic|cancer|tumor|tumour|asthma|eczema|psoriasis|acne|migraine|migraines|insomnia|adhd|autism|alzheimer'?s|dementia|blood pressure|hypertension|cholesterol|inflammation|inflammatory|infection|infections|fungal|joint pain|back pain|nerve pain|neuropathy|hair loss|erectile|menopause|acid reflux|vertigo|tinnitus|covid|influenza)\b/i.test(source)) {
        add("condition", "block", "A medical condition is named.", "Naming a health condition implies a medical claim. Remove the condition and describe only what the product is designed to do.");
    }
    if (/\b(before and after|before\s*\/\s*after)\b/i.test(source)) {
        add("before-after", "block", "Before-and-after implication detected.", "Describe only verified product features without promising a personal outcome.");
    }
    if (/\b(earnings?|income|make money|financial freedom|get rich)\b/i.test(source)) {
        add("earnings", "block", "Income or earnings claim detected.", "Remove the financial outcome claim and describe only the creator workflow or verified product facts.");
    }
    if (/\b(better than|beats|superior to|versus|vs\.)\b/i.test(source)) {
        add("comparison", "review", "Promotional comparison language detected.", "Remove the competitor comparison and describe the promoted product's verified features on their own.");
    }
    if (/\b(only \d+ left|ends tonight|last chance)\b/i.test(source)) {
        add("scarcity", "block", "Scarcity or deadline language detected.", "Remove it unless the exact claim is verified as current.");
    }
    if (/\b(life[- ]changing|miracle|magic|effortless|no effort|overnight|transform your life|works every time|will fix|solves everything|game changer)\b/i.test(source)) {
        add("unrealistic", "block", "Unrealistic expectation language detected.", "Describe one verified thing the product is designed to do instead of promising a transformation.");
    }
    if (/\b(as seen on|official partner|endorsed by|certified by|FDA[- ]approved|patented|award[- ]winning)\b/i.test(source)) {
        add("authority", "review", "Endorsement, certification, or award claim detected.", "Remove it unless you can verify the exact claim for this exact product.");
    }
    if (/\b(lyrics|song by|soundtrack|movie clip|trademark|™|®)\b/i.test(source)) {
        add("ip", "review", "Possible third-party or trademarked content referenced.", "Use only sounds, footage, and wording you have the right to use.");
    }
    if (form.acquisition === "sample") {
        add("sample-disclosure", "review", "Free seller sample — disclosure is required.", "Keep #ad in the hashtags and say the product was provided when the platform asks.");
    }
    else if (form.acquisition === "purchased") {
        add("purchased-disclosure", "review", "Bought with your own money — you can speak from real use.", "Affiliate commission still requires #ad in the hashtags.");
    }
    else {
        add("not-in-hand", "review", "Product is not in your hands yet.", "This stays a planning draft. Avoid first-person experience claims until you have the product.");
    }
    if (/Wellness|Supplement|Oral|Dental|Skincare|Body-Applied|Kids|Tools/i.test(form.category || "")) {
        add("category", "review", `${form.category} requires additional review.`, "Use only verified product facts and the safest category-specific wording.");
    }
    if (/Electronics/i.test(form.category || "") || form.batteryPowered) {
        add("powered", "review", "Electrical or battery-powered product flagged for review.", "Use verified specifications and avoid unsupported safety or performance claims.");
    }
    return issues;
}
// Intentionally defined once. The earlier prototype accidentally defined this twice.
function flattenScript(pkg) {
    if (!pkg)
        return "";
    return [
        `DONE RITE CONTENT PACKAGE — ${pkg.productName}`,
        "",
        ...(pkg.searchPhrase ? [`TARGET SEARCH PHRASE: ${pkg.searchPhrase}`, ""] : []),
        "HOOKS",
        ...pkg.hooks.map((hook, index) => `${index + 1}. ${hook}`),
        "",
        "VOICEOVER",
        pkg.voiceover,
        "",
        "ON-SCREEN TEXT",
        pkg.onScreenText,
        "",
        "CAPTION",
        pkg.caption,
        "",
        "HASHTAGS",
        pkg.hashtags,
        "",
        "CTA",
        pkg.cta,
        "",
        "THUMBNAIL",
        pkg.thumbnail,
        "",
        ...(pkg.shotList ? ["SHOT LIST — HANDS IN FRAME, NO FACE", pkg.shotList, ""] : []),
        "AI IMAGE PROMPT",
        pkg.aiImagePrompt,
        "",
        "AI VIDEO PROMPT",
        pkg.aiVideoPrompt,
        "",
        "CROSS-PLATFORM CHECKLIST",
        pkg.crossPlatform,
        "",
        pkg.complianceNote,
    ].join("\n");
}
function makePackage(form) {
    const product = form.productName.trim();
    const cleaned = safeFeatureText(form.verifiedFeatures);
    const feature = cleaned.split(/[\n.;]/).map((part) => part.trim()).filter(Boolean)[0] || "a simpler everyday routine";
    const inHand = form.acquisition === "sample" || form.acquisition === "purchased";
    const planning = !inHand;
    const issues = scanCompliance(`${form.productName}\n${form.verifiedFeatures}`, form);
    const changed = safeFeatureText(form.verifiedFeatures) !== form.verifiedFeatures.trim();
    if (changed) {
        issues.unshift({
            id: "rewritten",
            severity: "review",
            label: "Risky wording was removed from the verified-features field.",
            safer: "Review the cleaned wording before publishing.",
        });
    }
    const prefix = planning ? "PLANNING DRAFT — SAMPLE NOT CONFIRMED\n\n" : "";
    let hooks = pickHooks(product, feature, form.platform, form.hookWinners || [], form.hookSpin || 0);
    if (form.chosenHook) {
        hooks = [form.chosenHook].concat(hooks.filter((h) => h !== form.chosenHook)).slice(0, 3);
    }
    const pattern = pickPattern(form.platform, form.chosenPattern, form.hookSpin || 0);
    const voiceover = `${prefix}${hooks[0]} This is ${product}, built around ${feature}. Watch it work rather than listen to me describe it. Product details are in the cart.`;
    const searchPhrase = String(form.searchPhrase || "").trim();
    const onScreenText = [
        `0–2s: ${searchPhrase ? searchPhrase.toUpperCase() : "WORTH A CLOSER LOOK?"}`,
        `2–6s: ${product.toUpperCase()}`,
        `6–11s: ${feature.toUpperCase()}`,
        `11–${form.duration}s: CHECK PRODUCT DETAILS`,
    ].join("\n");
    const caption = `${planning ? "Planning draft: " : ""}${searchPhrase ? searchPhrase + ". " : ""}A closer look at ${product} and the verified features it was designed around. Product details are available in the cart.`;
    const hashtags = "#ad #TikTokShop #GadgetFinds #ProductDemo #DoneRite";
    const cta = form.chosenCta || ctaOptions(form.platform)[0].text;
    const thumbnail = "WORTH A CLOSER LOOK?";
    const shotList = buildShotList(pattern, product, feature, form.duration, hooks[0], cta);
    const aiImagePrompt = `Create a vertical 9:16 hands-on visual for ${product}. Hands may hold, open, or operate the product. Use a black, chrome, and electric-blue DONE RITE technology style. Show the product, the hands using it, and a clean feature-focused environment. No face, no head, no shoulders, no price, discount badge, competitor branding, unsupported specification, or added product claim.`;
    const aiVideoPrompt = `Create a ${form.duration}-second vertical 9:16 hands-on ${form.funnel} demo video for ${product}, shot in the "${pattern.name}" pattern. Hands enter frame and operate the product; the camera stays above or beside the hands so no face, head, or shoulders are visible. Keep the product moving — continuous hand motion, not a slideshow of stills. Use subtle electric-blue lighting, readable safe-zone text, and one cart-directed CTA. No face, price, discount, false scarcity, competitor comparison, medical claim, absolute claim, or invented specification. Use only these verified details: ${cleaned || "No verified feature supplied; keep the presentation generic."}`;
    const crossPlatform = [
        "☐ Watch it back: no face, head, or shoulders in any frame",
        "☐ Watch it back: the product is moving throughout — no static slideshow section",
        "☐ TikTok: 9:16, product link/cart selected, content disclosure enabled",
        "☐ YouTube Short: remove TikTok-only cart wording and use an approved description link",
        "☐ Facebook/Instagram Reels: verify disclosure and link placement",
        "☐ Pinterest: link only to the approved YouTube or Amazon destination, never TikTok",
        "☐ Confirm music is licensed for commercial use",
    ].join("\n");
    const firstIssue = issues[0];
    const complianceNote = firstIssue
        ? `Compliance flags: ${issues.map((item) => item.label).join(" ")} Safer alternate: “${firstIssue.safer}”`
        : "Compliance flags: No automated wording flags found; safer alternate: keep all visible claims limited to verified product facts.";
    return {
        id: uid(),
        createdAt: new Date().toISOString(),
        productName: product,
        form: { ...form, verifiedFeatures: cleaned },
        hooks,
        voiceover,
        onScreenText,
        caption,
        hashtags,
        cta,
        thumbnail,
        searchPhrase,
        shotList,
        patternId: pattern.id,
        patternName: pattern.name,
        patternWhy: pattern.why,
        aiImagePrompt,
        aiVideoPrompt,
        crossPlatform,
        complianceNote,
        issues,
        publishReady: inHand && !issues.some((item) => item.severity === "block"),
    };
}
function copyFallback(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    const copied = document.execCommand("copy");
    document.body.removeChild(area);
    return copied;
}
async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        return copyFallback(text);
    }
    catch {
        return copyFallback(text);
    }
}
/* A short mechanical click, built in the browser. No sound file to download. */
let __drAudioCtx = null;
function drAudio() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!__drAudioCtx) __drAudioCtx = new Ctx();
  if (__drAudioCtx.state === "suspended") __drAudioCtx.resume();
  return __drAudioCtx;
}

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

/* Scores logged Content Gap phrases against products already in the vault.
   Deliberately dumb word matching — it suggests, it does not decide. */
function matchProducts(phrase, products) {
  const words = String(phrase || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3);
  if (!words.length) return [];
  return (products || [])
    .map((product) => {
      const hay = `${product.productName || ""} ${product.category || ""} ${product.verifiedFeatures || ""}`.toLowerCase();
      const hits = words.filter((w) => hay.indexOf(w) !== -1);
      return { product, score: hits.length, hits };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function patternOptions(platform) {
  const pool = SHOT_PATTERNS.filter((s) => s.platforms.indexOf(platform) !== -1);
  return pool.length ? pool : SHOT_PATTERNS;
}

/* Auto mode rotates a different pattern each generate, the same way hooks do,
   so the same product never films the same way twice in a row. */
function pickPattern(platform, chosenId, spin) {
  const pool = patternOptions(platform);
  const chosen = pool.find((s) => s.id === chosenId) || SHOT_PATTERNS.find((s) => s.id === chosenId);
  if (chosen) return chosen;
  return pool[(spin || 0) % pool.length];
}

/* Turns a pattern into a timed, filmable shot list. Hands in frame, head out. */
function buildShotList(pattern, product, feature, duration, hook, cta) {
  const total = Number(duration) || 15;
  const marks = [
    0,
    Math.max(2, Math.round(total * 0.18)),
    Math.round(total * 0.48),
    Math.round(total * 0.76),
    total,
  ];
  const say = [
    hook,
    `${product}. ${feature}.`,
    "Narrate the demo as it happens. Verified features only.",
    cta,
  ];
  const rows = pattern.beats(product, feature).map((beat, index) => [
    `${marks[index]}–${marks[index + 1]}s  ${beat.label}`,
    `   HANDS: ${beat.hands}`,
    `   SAY:   ${say[index]}`,
  ].join("\n"));
  return [
    `PATTERN: ${pattern.name} — ${pattern.why}`,
    "FRAMING: hands in frame, head and face out of frame, 9:16, keep the product moving throughout.",
    ...rows,
  ].join("\n\n");
}

function makeMetalCheck() {
  let ctx = null;
  return function clank(volume) {
    try {
      ctx = drAudio();
      if (!ctx) return;
      const now = ctx.currentTime;

      const out = ctx.createGain();
      out.gain.value = 3.4 * volume;
      const guard = ctx.createDynamicsCompressor();
      guard.threshold.value = -6;
      guard.ratio.value = 12;
      out.connect(guard).connect(ctx.destination);

      // Struck metal is inharmonic — these ratios are deliberately not
      // whole multiples, which is what stops it sounding like a musical bell.
      // 780Hz body added on purpose — a phone speaker is strongest here,
      // and the old top-heavy version was inaudible on one.
      const partials = [780, 1840, 2510, 3370, 4620];
      const decays = [0.40, 0.34, 0.26, 0.19, 0.13];
      partials.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        osc.type = index < 2 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.965, now + decays[index]);
        const gain = ctx.createGain();
        const level = 0.85 / (index * 0.55 + 1);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(level, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[index]);
        osc.connect(gain).connect(out);
        osc.start(now);
        osc.stop(now + decays[index] + 0.05);
      });

      // The latch itself — the mechanical bite before the ring.
      const frames = Math.floor(ctx.sampleRate * 0.045);
      const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frames; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / frames, 4);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 2600;
      band.Q.value = 0.6;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 1.4;
      noise.connect(band).connect(noiseGain).connect(out);
      noise.start(now);
    } catch {
      /* Audio is a nicety. If the browser blocks it, the app carries on. */
    }
  };
}
function makeZapper() {
  let ctx = null;
  return function zap(volume) {
    try {
      ctx = drAudio();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Driven hard, then limited — loud without crackling.
      const out = ctx.createGain();
      out.gain.value = 2.2 * volume;
      const guard = ctx.createDynamicsCompressor();
      guard.threshold.value = -6;
      guard.ratio.value = 12;
      out.connect(guard).connect(ctx.destination);

      // 1. CRACK — the strike landing.
      const crackFrames = Math.floor(ctx.sampleRate * 0.05);
      const crackBuf = ctx.createBuffer(1, crackFrames, ctx.sampleRate);
      const crackData = crackBuf.getChannelData(0);
      for (let i = 0; i < crackFrames; i += 1) {
        crackData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / crackFrames, 4);
      }
      const crack = ctx.createBufferSource();
      crack.buffer = crackBuf;
      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 1800;
      const crackGain = ctx.createGain();
      crackGain.gain.value = 1.3;
      crack.connect(highpass).connect(crackGain).connect(out);
      crack.start(now);

      // 2. ZAP — the electric sweep down the bolt.
      const bolt = ctx.createOscillator();
      bolt.type = "sawtooth";
      bolt.frequency.setValueAtTime(3200, now);
      bolt.frequency.exponentialRampToValueAtTime(220, now + 0.09);
      const boltGain = ctx.createGain();
      boltGain.gain.setValueAtTime(0.0001, now);
      boltGain.gain.exponentialRampToValueAtTime(0.85, now + 0.005);
      boltGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      bolt.connect(boltGain).connect(out);
      bolt.start(now);
      bolt.stop(now + 0.14);

      // 3. SIZZLE — the arc still crackling after the hit.
      const sizFrames = Math.floor(ctx.sampleRate * 0.3);
      const sizBuf = ctx.createBuffer(1, sizFrames, ctx.sampleRate);
      const sizData = sizBuf.getChannelData(0);
      for (let i = 0; i < sizFrames; i += 1) {
        const envelope = Math.pow(1 - i / sizFrames, 2.2);
        const flicker = Math.random() < 0.35 ? 1 : 0.15;
        sizData[i] = (Math.random() * 2 - 1) * envelope * flicker;
      }
      const sizzle = ctx.createBufferSource();
      sizzle.buffer = sizBuf;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 3600;
      bandpass.Q.value = 0.9;
      const sizGain = ctx.createGain();
      sizGain.gain.value = 0.75;
      sizzle.connect(bandpass).connect(sizGain).connect(out);
      sizzle.start(now + 0.01);

      // 4. THUNDER — short low tail. Kept above 150Hz on purpose:
      // a phone speaker cannot move enough air below that to be heard.
      const thunder = ctx.createOscillator();
      thunder.type = "triangle";
      thunder.frequency.setValueAtTime(300, now);
      thunder.frequency.exponentialRampToValueAtTime(150, now + 0.28);
      const thunderGain = ctx.createGain();
      thunderGain.gain.setValueAtTime(0.0001, now + 0.02);
      thunderGain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
      thunderGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      thunder.connect(thunderGain).connect(out);
      thunder.start(now);
      thunder.stop(now + 0.45);
    } catch {
      /* Audio is a nicety. If the browser blocks it, the app carries on. */
    }
  };
}
function makeClicker() {
    let ctx = null;
    return function click(volume) {
        try {
            ctx = drAudio();
            if (!ctx)
                return;
            const now = ctx.currentTime;
            const out = ctx.createGain();
            out.gain.value = volume;
            out.connect(ctx.destination);
            // Sharp top-end snap — the plastic "tick".
            const frames = Math.floor(ctx.sampleRate * 0.03);
            const noise = ctx.createBuffer(1, frames, ctx.sampleRate);
            const data = noise.getChannelData(0);
            for (let i = 0; i < frames; i += 1) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / frames, 6);
            }
            const noiseSource = ctx.createBufferSource();
            noiseSource.buffer = noise;
            const bandpass = ctx.createBiquadFilter();
            bandpass.type = "bandpass";
            bandpass.frequency.value = 2600;
            bandpass.Q.value = 1.1;
            noiseSource.connect(bandpass).connect(out);
            noiseSource.start(now);
            // Low body — the "thock" underneath, so it reads mechanical rather than tinny.
            const thock = ctx.createOscillator();
            thock.type = "square";
            thock.frequency.setValueAtTime(190, now);
            thock.frequency.exponentialRampToValueAtTime(70, now + 0.045);
            const thockGain = ctx.createGain();
            thockGain.gain.setValueAtTime(0.7, now);
            thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            thock.connect(thockGain).connect(out);
            thock.start(now);
            thock.stop(now + 0.06);
        }
        catch {
            /* Audio is a nicety. If the browser blocks it, the app carries on. */
        }
    };
}
/* Reads a video's shape on this device. The file is never uploaded anywhere. */
function analyzeVideo(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;
        video.playsInline = true;
        video.src = url;
        const fail = (message) => { URL.revokeObjectURL(url); reject(new Error(message)); };
        video.onerror = () => fail("This file could not be read as a video on this device.");
        video.onloadedmetadata = async () => {
            const width = video.videoWidth;
            const height = video.videoHeight;
            const duration = video.duration;
            if (!width || !height || !isFinite(duration))
                return fail("This video's details could not be read.");
            // Sample frames across the clip and measure how much the picture changes.
            const canvas = document.createElement("canvas");
            canvas.width = 64;
            canvas.height = Math.max(1, Math.round((64 * height) / width));
            const ctx2d = canvas.getContext("2d", { willReadFrequently: true });
            const seekTo = (time) => new Promise((done) => {
                const handler = () => { video.removeEventListener("seeked", handler); done(); };
                video.addEventListener("seeked", handler);
                video.currentTime = Math.min(time, Math.max(0, duration - 0.05));
            });
            const samples = [];
            const shots = 8;
            try {
                for (let i = 0; i < shots; i += 1) {
                    await seekTo((duration * i) / (shots - 1 || 1));
                    ctx2d.drawImage(video, 0, 0, canvas.width, canvas.height);
                    samples.push(ctx2d.getImageData(0, 0, canvas.width, canvas.height).data);
                }
            }
            catch {
                /* Some browsers refuse frame reads; fall back to shape-only results. */
            }
            let motion = 0;
            let compared = 0;
            for (let i = 1; i < samples.length; i += 1) {
                const a = samples[i - 1];
                const b = samples[i];
                let total = 0;
                for (let p = 0; p < a.length; p += 4) {
                    total += Math.abs(a[p] - b[p]) + Math.abs(a[p + 1] - b[p + 1]) + Math.abs(a[p + 2] - b[p + 2]);
                }
                motion += total / (a.length / 4) / 3;
                compared += 1;
            }
            const motionScore = compared ? motion / compared : null;
            URL.revokeObjectURL(url);
            resolve({
                name: file.name,
                sizeMb: file.size / (1024 * 1024),
                width,
                height,
                duration,
                ratio: width / height,
                motionScore,
                framesRead: samples.length,
            });
        };
    });
}
/* Turns the measurements into plain-language flags. */
function videoFlags(info, mode) {
    const flags = [];
    const add = (severity, label, safer) => flags.push({ severity, label, safer });
    const limit = mode === "BOF" ? 15 : 30;
    if (info.duration > limit) {
        add("block", `${info.duration.toFixed(1)}s is longer than the ${limit}s ${mode} target.`, `Trim to ${limit} seconds or switch this to ${mode === "BOF" ? "TOF" : "BOF"}.`);
    }
    else if (info.duration < 5) {
        add("review", `${info.duration.toFixed(1)}s is very short.`, "Under five seconds rarely leaves room for a hook and a call to action.");
    }
    const target = 9 / 16;
    if (Math.abs(info.ratio - target) > 0.02) {
        const shape = info.ratio > 1 ? "landscape" : "not 9:16";
        add("block", `Frame is ${info.width}×${info.height} (${shape}).`, "Export at 1080×1920 so nothing is cropped on TikTok.");
    }
    if (info.width < 720) {
        add("review", `Width is only ${info.width} pixels.`, "Export at 1080 wide or better.");
    }
    if (info.motionScore !== null) {
        if (info.motionScore < 2.5) {
            add("block", "Almost no movement — this reads as a static slideshow.", "Static slideshows and silent unboxings no longer earn organic distribution. Re-shoot with your hands operating the product the whole way through.");
        }
        else if (info.motionScore < 8) {
            add("review", "Only slight movement between frames.", "Keep the hands working for the full clip. A still section in the middle is where viewers drop.");
        }
        else {
            add("ok", "Continuous motion confirmed — this reads as a hands-on demo.", "This matches your hands-in-frame, no-face format.");
        }
        add("review", "Faces cannot be detected automatically.", "Watch the clip back once and confirm no face, head, shoulders, or reflection appears in any frame.");
    }
    return flags;
}
/* Common feature wordings, grouped by category. These are prompts, not facts —
   nothing here is true of a product until you have looked at the product and
   confirmed it. Deliberately plain: no performance, health, or quality claims. */
const FEATURE_LIBRARY = {
    "Electronics & Gadgets": ["USB-C charging", "Rechargeable battery", "Cordless", "Foldable design", "Built-in LED indicator", "Magnetic base", "Multiple brightness settings", "Carrying case included"],
    Kitchen: ["Dishwasher safe", "Stainless steel body", "Non-stick surface", "Stackable", "Cordless", "Removable lid", "Measurement markings", "Fits standard cabinets"],
    Home: ["Adhesive backing", "No tools needed to set up", "Foldable for storage", "Machine washable cover", "Non-slip base", "Comes in multiple sizes"],
    Outdoor: ["Water-resistant housing", "Foldable", "Carrying strap included", "Stake or clip mount", "Rechargeable battery", "Packs into its own bag"],
    Apparel: ["Machine washable", "Has pockets", "Adjustable strap", "Available in multiple sizes", "Zip closure", "Lined interior"],
    "Wellness & Supplements": ["Capsule form", "Powder form", "Unflavored", "One scoop per serving", "Resealable container", "Travel size available"],
    "Oral & Dental": ["Rechargeable handle", "Replaceable heads", "Travel case included", "Two-minute timer", "Soft bristles"],
    Skincare: ["Unscented", "Pump dispenser", "Travel size", "Resealable jar", "Comes with an applicator"],
    "Body-Applied Products": ["Adjustable strap", "Machine washable cover", "Rechargeable", "Multiple size options", "Carrying pouch included"],
    "Kids' Products": ["Machine washable", "No small detachable parts", "Age range printed on the box", "Folds flat for storage", "Batteries included"],
    Tools: ["Cordless", "Magnetic tip", "Carrying case included", "Belt clip", "Rechargeable battery", "Multiple bit sizes included"],
    Lifestyle: ["Folds flat", "Carrying case included", "Rechargeable", "Adjustable strap", "Available in multiple colors"],
};
function Card({ children, className = "" }) {
    return React.createElement("section", { className: `dr-card ${className}` }, children);
}
function Field({ label, children, help }) {
    return (React.createElement("div", { className: "dr-field" },
        React.createElement("label", { className: "dr-label" }, label),
        children,
        help ? React.createElement("div", { className: "dr-help", style: { marginTop: 6 } }, help) : null));
}
function OutputCard({ title, text, onCopy, copiedKey }) {
    const copied = copiedKey === title;
    return (React.createElement(Card, null,
        React.createElement("div", { className: "dr-output-head" },
            React.createElement("h3", null, title),
            React.createElement("button", { className: `dr-copy ${copied ? "is-copied" : ""}`, type: "button", onClick: () => onCopy(text, title) }, copied ? "Copied ✓" : "Copy")),
        React.createElement("div", { className: "dr-output" }, text)));
}
function DoneRiteCreatorOS() {
    const [tab, setTab] = useState("home");
    const [ready, setReady] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [pkg, setPkg] = useState(null);
    const [saved, setSaved] = useState([]);
    const [products, setProducts] = useState([]);
    const [quickCreateHistory, setQuickCreateHistory] = useState([]);
    const [tasks, setTasks] = useState(DEFAULT_TASKS);
    const [moneyRows, setMoneyRows] = useState([]);
    const [moneyForm, setMoneyForm] = useState(EMPTY_MONEY);
    const [search, setSearch] = useState("");
    const [checkText, setCheckText] = useState("");
    const [copyStatus, setCopyStatus] = useState("");
    const [copiedKey, setCopiedKey] = useState("");
    const [clickSound, setClickSound] = useState(true);
    const [videoInfo, setVideoInfo] = useState(null);
    const [videoMode, setVideoMode] = useState("BOF");
    const [videoBusy, setVideoBusy] = useState(false);
    const [videoError, setVideoError] = useState("");
    const [videoText, setVideoText] = useState("");
    const [videoDecl, setVideoDecl] = useState({ ownFootage: false, ownAudio: false, noLogos: false, noFace: false, sampleInHand: false });
    const videoRef = useRef(null);
    const [aiDraft, setAiDraft] = useState("");
    const [aiProduct, setAiProduct] = useState("");
    const [needsName, setNeedsName] = useState(false);
    const nameRef = useRef(null);
    const resultsRef = useRef(null);
    const clickerRef = useRef(null);
    const boomerRef = useRef(null); // lightning strike for feature chips
    const metalRef = useRef(null); // metal latch for checkboxes
    const [gapRows, setGapRows] = useState([]);
    const [gapDraft, setGapDraft] = useState(EMPTY_GAP);
    const [gapScanBusy, setGapScanBusy] = useState(false);
    const [gapScanProgress, setGapScanProgress] = useState(0);
    const [gapScanStatus, setGapScanStatus] = useState("");
    const gapImageRef = useRef(null);
    const [hookLog, setHookLog] = useState([]);
    const [hookSpin, setHookSpin] = useState(0);
    const [hookDraft, setHookDraft] = useState({ text: "", platform: "TikTok Shop", product: "", sales: "", views: "" });
    // One listener covers every button in the app, including any added later.
    useEffect(() => {
        if (!clickerRef.current)
            clickerRef.current = makeClicker();
        if (!boomerRef.current)
            boomerRef.current = makeZapper();
        if (!metalRef.current)
            metalRef.current = makeMetalCheck();
        const onPointerDown = (event) => {
            // Checkboxes get the metal latch instead of the lightning strike.
            const box = event.target.closest('input[type="checkbox"]');
            if (box) {
                if (clickSound)
                    metalRef.current(box.checked ? 0.75 : 1);
                const holder = box.closest(".dr-check");
                if (holder) {
                    holder.classList.add("dr-struck");
                    window.setTimeout(() => holder.classList.remove("dr-struck"), 260);
                }
                return;
            }
            const button = event.target.closest("button");
            if (!button)
                return;
            const isChip = button.classList.contains("dr-chip");
            const isTab = button.classList.contains("dr-tab");
            if (clickSound) {
                // Tabs get the hardest strike, chips next, everything else a touch lighter.
                boomerRef.current(isTab ? 1.15 : isChip ? 1 : 0.85);
            }
            button.classList.add("dr-pressed");
            window.setTimeout(() => button.classList.remove("dr-pressed"), 440);
        };
        document.addEventListener("pointerdown", onPointerDown, true);
        return () => document.removeEventListener("pointerdown", onPointerDown, true);
    }, [clickSound]);
    const [importStatus, setImportStatus] = useState("");
    const [saveBlocked, setSaveBlocked] = useState("");
    const importRef = useRef(null);
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                setSaved(Array.isArray(data.saved) ? data.saved : []);
                setProducts(Array.isArray(data.products) ? data.products : []);
                setQuickCreateHistory(Array.isArray(data.quickCreateHistory) ? data.quickCreateHistory : []);
                if (data.form && typeof data.form === "object")
                    setForm({ ...EMPTY_FORM, ...data.form });
                setTasks(Array.isArray(data.tasks) ? data.tasks : DEFAULT_TASKS);
                setMoneyRows(Array.isArray(data.moneyRows) ? data.moneyRows : []);
                if (data.lastTab)
                    setTab(data.lastTab);
                if (typeof data.clickSound === "boolean")
                    setClickSound(data.clickSound);
                if (Array.isArray(data.hookLog))
                    setHookLog(data.hookLog);
                if (Array.isArray(data.gapRows))
                    setGapRows(data.gapRows);
                if (typeof data.hookSpin === "number")
                    setHookSpin(data.hookSpin);
            }
        }
        catch {
            setImportStatus("Saved data could not be read. A fresh local workspace was opened.");
        }
        finally {
            setReady(true);
        }
    }, []);
    useEffect(() => {
        if (!ready)
            return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ saved, products, quickCreateHistory, form, tasks, moneyRows, gapRows, lastTab: tab, clickSound, hookLog, hookSpin, version: 1 }));
            setSaveBlocked("");
        }
        catch (error) {
            const full = String(error && error.name) === "QuotaExceededError";
            setSaveBlocked(full
                ? "This device is out of storage space, so new changes are not being saved. Go to Settings and download a backup now, then delete some saved packages."
                : "This browser is not allowing anything to be saved on this device. Your work is still on screen, but it will disappear if you close this page. Go to Settings and download a backup now. Private browsing mode is the usual cause.");
        }
    }, [ready, saved, products, quickCreateHistory, form, tasks, moneyRows, gapRows, tab, clickSound, hookLog, hookSpin]);
    useEffect(() => {
        if (!copyStatus)
            return undefined;
        const timer = window.setTimeout(() => setCopyStatus(""), 3500);
        return () => window.clearTimeout(timer);
    }, [copyStatus]);
    useEffect(() => {
        if (!copiedKey)
            return undefined;
        const timer = window.setTimeout(() => setCopiedKey(""), 1800);
        return () => window.clearTimeout(timer);
    }, [copiedKey]);
    // Auto-save: every generated or edited package is kept without pressing Save.
    useEffect(() => {
        if (!ready || !pkg)
            return;
        setSaved((current) => [pkg, ...current.filter((item) => item.id !== pkg.id)]);
    }, [ready, pkg]);
    // Quick Create remembers names even when the user has not generated a
    // package yet. Saved packages go first so a product's most recent target
    // search phrase is restored when the same name also exists in the vault.
    const productHistory = useMemo(() => {
        const list = [];
        const seen = new Set();
        const push = (name, source) => {
            const clean = String(name || "").trim();
            if (!clean)
                return;
            const key = clean.toLowerCase();
            if (seen.has(key))
                return;
            seen.add(key);
            list.push({ key, name: clean, source });
        };
        saved.forEach((item) => push(item.productName, item));
        products.forEach((item) => push(item.productName, item));
        quickCreateHistory.forEach((item) => push(item.productName, item));
        push(form.productName, form);
        return list;
    }, [products, saved, quickCreateHistory, form]);
    const featureHistory = useMemo(() => {
        const seen = new Set();
        const out = [];
        products.forEach((item) => String(item.verifiedFeatures || "").split(/\n/).forEach((line) => {
            const clean = line.trim();
            if (!clean || seen.has(clean.toLowerCase()))
                return;
            seen.add(clean.toLowerCase());
            out.push(clean);
        }));
        return out.slice(0, 12);
    }, [products]);
    const buildTargetPhraseChoices = (draft) => {
        const out = [];
        const seen = new Set();
        const push = (value) => {
            const phrase = String(value || "").trim();
            const key = phrase.toLowerCase();
            if (!phrase || seen.has(key))
                return;
            seen.add(key);
            out.push(phrase);
        };
        const productName = String(draft.productName || "").trim();
        const stopWords = new Set(["and", "the", "for", "with", "this", "that", "from", "your"]);
        const productWords = new Set(`${productName} ${draft.verifiedFeatures || ""}`.toLowerCase().match(/[a-z0-9]+/g) || []);
        const rankedGaps = gapRows
            .map((item) => {
                const words = String(item.phrase || "").toLowerCase().match(/[a-z0-9]+/g) || [];
                const hits = words.filter((word) => word.length > 2 && !stopWords.has(word) && productWords.has(word)).length;
                return { phrase: item.phrase, score: hits + (item.category === draft.category ? 0.25 : 0) };
            })
            .sort((a, b) => b.score - a.score);
        rankedGaps.forEach((item) => push(item.phrase));
        return out;
    };
    const targetPhraseChoices = useMemo(() => buildTargetPhraseChoices(form), [form.productName, form.category, form.verifiedFeatures, form.funnel, gapRows]);
    const addFeature = (text) => {
        setForm((current) => {
            const lines = String(current.verifiedFeatures || "").split(/\n/).map((l) => l.trim()).filter(Boolean);
            if (lines.some((l) => l.toLowerCase() === text.toLowerCase()))
                return current;
            return { ...current, verifiedFeatures: [...lines, text].join("\n") };
        });
    };
    const hookChoices = useMemo(() => {
        const productName = form.productName.trim() || "this product";
        const featureLine = String(form.verifiedFeatures || "").split(/\n/).map((l) => l.trim()).filter(Boolean)[0] || "a simpler everyday routine";
        return hookOptions(productName, featureLine, form.platform);
    }, [form.productName, form.verifiedFeatures, form.platform]);
    const ctaChoices = useMemo(() => ctaOptions(form.platform), [form.platform]);
    const patternChoices = useMemo(() => patternOptions(form.platform), [form.platform]);
    const previewPattern = useMemo(() => pickPattern(form.platform, form.chosenPattern, hookSpin + 1), [form.platform, form.chosenPattern, hookSpin]);
    const complianceResults = useMemo(() => scanCompliance(checkText), [checkText]);
    const videoTextResults = useMemo(() => scanCompliance(videoText), [videoText]);
    const videoShapeFlags = useMemo(() => (videoInfo ? videoFlags(videoInfo, videoMode) : []), [videoInfo, videoMode]);
    const aiResults = useMemo(() => scanCompliance(aiDraft), [aiDraft]);
    const pickVideo = async (file) => {
        if (!file)
            return;
        setVideoBusy(true);
        setVideoError("");
        setVideoInfo(null);
        try {
            setVideoInfo(await analyzeVideo(file));
        }
        catch (error) {
            setVideoError(error.message || "This video could not be read.");
        }
        setVideoBusy(false);
    };
    const videoReport = () => {
        if (!videoInfo)
            return "";
        const decl = [
            `Footage is mine or licensed: ${videoDecl.ownFootage ? "yes" : "NOT CONFIRMED"}`,
            `Audio/music is cleared: ${videoDecl.ownAudio ? "yes" : "NOT CONFIRMED"}`,
            `No competitor logos or brands in frame: ${videoDecl.noLogos ? "yes" : "NOT CONFIRMED"}`,
            `No face, head, shoulders, or reflection in frame: ${videoDecl.noFace ? "yes" : "NOT CONFIRMED"}`,
            `Product in hand (sample or purchased): ${videoDecl.sampleInHand ? "yes" : "NOT CONFIRMED"}`,
        ];
        const lines = [
            `DONE RITE VIDEO CHECK — ${videoInfo.name}`,
            "",
            `Mode: ${videoMode} · ${videoInfo.duration.toFixed(1)}s · ${videoInfo.width}×${videoInfo.height} · ${videoInfo.sizeMb.toFixed(1)} MB`,
            "",
            "VIDEO FLAGS",
            ...(videoShapeFlags.length ? videoShapeFlags.map((f) => `${f.severity.toUpperCase()}: ${f.label} → ${f.safer}`) : ["None."]),
            "",
            "TEXT FLAGS",
            ...(videoTextResults.length ? videoTextResults.map((f) => `${f.severity.toUpperCase()}: ${f.label} → ${f.safer}`) : ["None."]),
            "",
            "DECLARATIONS",
            ...decl,
        ];
        return lines.join("\n");
    };
    const aiPrompt = () => {
        const product = aiProduct.trim() || "the product";
        return [
            `Write a TikTok Shop affiliate script for ${product}.`,
            "",
            "Rules that cannot be broken:",
            "- No prices, discounts, savings, coupons, or price comparisons.",
            "- No guaranteed, instantly, 100%, perfect, or never fails.",
            "- No cure, treat, prevent, heal, reverse, or weight-loss claims.",
            "- No competitor brand names, lyrics, or movie or TV dialogue.",
            "- No before-and-after implications and no income claims.",
            "- Use designed to, built for, made to, or can help.",
            "- Include #ad in the hashtags.",
            "",
            "Format: 3 hooks, a 7-15 second voiceover, a timed shot list, on-screen text, caption, hashtags, and one cart-directed call to action.",
            "Hands-on demo, 9:16. My hands operate the product on camera. No face, head, or shoulders in any frame.",
            "Open mid-action in the first three seconds. Keep the product moving throughout \u2014 no static slideshow sections.",
            "",
            "Only use features I have verified. Do not invent specifications, ingredients, certifications, or test results.",
        ].join("\n");
    };
    const filteredSaved = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q)
            return saved;
        return saved.filter((item) => flattenScript(item).toLowerCase().includes(q));
    }, [saved, search]);
    const revenue = moneyRows.filter((row) => row.type !== "Expense").reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const expenses = moneyRows.filter((row) => row.type === "Expense").reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const completedTasks = tasks.filter((task) => task.done).length;
    const sampleCount = products.filter((product) => product.acquisition === "sample" || product.acquisition === "purchased" || product.sampleReceived).length;
    const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const rememberQuickCreateProduct = (draft = form) => {
        const name = String(draft.productName || "").trim();
        if (!name)
            return;
        const record = {
            productName: name,
            category: draft.category,
            verifiedFeatures: safeFeatureText(draft.verifiedFeatures),
            searchPhrase: String(draft.searchPhrase || "").trim(),
            acquisition: draft.acquisition,
            sampleReceived: draft.acquisition === "sample",
            updatedAt: new Date().toISOString(),
        };
        setQuickCreateHistory((current) => [record, ...current.filter((item) => String(item.productName || "").trim().toLowerCase() !== name.toLowerCase())]);
    };
    const notifyCopy = async (text, label) => {
        const ok = await copyText(text);
        setCopyStatus(ok ? `${label} copied.` : "Copy was blocked. Press and hold the text, then choose Select All and Copy.");
        if (ok)
            setCopiedKey(label);
    };
    const generate = () => {
        if (!form.productName.trim()) {
            setNeedsName(true);
            setCopyStatus("Enter the product name first.");
            window.setTimeout(() => { var _a; return (_a = nameRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 0);
            return;
        }
        setNeedsName(false);
        const effectiveForm = form.searchPhrase.trim()
            ? form
            : { ...form, searchPhrase: buildTargetPhraseChoices(form)[0] || "" };
        if (effectiveForm.searchPhrase !== form.searchPhrase)
            setForm(effectiveForm);
        rememberQuickCreateProduct(effectiveForm);
        // Rotate the hook angles and hand the generator any proven winners.
        const spin = hookSpin + 1;
        setHookSpin(spin);
        const winners = hookLog.filter((entry) => entry.winner);
        const next = makePackage({ ...effectiveForm, hookWinners: winners, hookSpin: spin });
        setPkg(next);
        window.setTimeout(() => { var _a; return (_a = resultsRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
        setProducts((current) => {
            const existing = current.find((item) => item.productName.toLowerCase() === effectiveForm.productName.trim().toLowerCase());
            const record = {
                id: (existing === null || existing === void 0 ? void 0 : existing.id) || uid(),
                productName: effectiveForm.productName.trim(),
                category: effectiveForm.category,
                verifiedFeatures: safeFeatureText(effectiveForm.verifiedFeatures),
                searchPhrase: effectiveForm.searchPhrase,
                sampleReceived: effectiveForm.acquisition === "sample",
                acquisition: effectiveForm.acquisition,
                status: effectiveForm.acquisition === "none" ? "Waiting for product" : "Ready to create",
                updatedAt: new Date().toISOString(),
            };
            return [record, ...current.filter((item) => item.id !== (existing === null || existing === void 0 ? void 0 : existing.id))];
        });
    };
    const savePackage = () => {
        if (!pkg)
            return;
        setSaved((current) => [pkg, ...current.filter((item) => item.id !== pkg.id)]);
        setCopyStatus("Content package saved on this device.");
    };
    const duplicatePackage = (item) => {
        const duplicate = { ...item, id: uid(), createdAt: new Date().toISOString(), productName: `${item.productName} copy` };
        setSaved((current) => [duplicate, ...current]);
    };
    const deleteSaved = (id) => {
        if (window.confirm("Delete this saved content package?")) {
            setSaved((current) => current.filter((item) => item.id !== id));
        }
    };
    const deleteProduct = (id) => {
        if (window.confirm("Delete this product record?")) {
            setProducts((current) => current.filter((item) => item.id !== id));
        }
    };
    const addMoney = () => {
        const amount = Number(moneyForm.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            setCopyStatus("Enter a valid amount first.");
            return;
        }
        setMoneyRows((current) => [{ ...moneyForm, id: uid(), amount }, ...current]);
        setMoneyForm((current) => ({ ...EMPTY_MONEY, type: current.type, platform: current.platform }));
    };
    const scanContentGapImage = async (file) => {
        if (!file)
            return;
        if (!String(file.type || "").startsWith("image/")) {
            setGapScanStatus("Choose a screenshot or photo file.");
            return;
        }
        setGapScanBusy(true);
        setGapScanProgress(0.02);
        setGapScanStatus("Preparing screenshot…");
        let worker = null;
        try {
            const Tesseract = await loadGapOcrLibrary();
            setGapScanStatus("Reading the words in the screenshot…");
            worker = await Tesseract.createWorker("eng", 1, {
                logger: (message) => {
                    if (message.status === "recognizing text") {
                        const progress = Number(message.progress || 0);
                        setGapScanProgress(0.1 + progress * 0.88);
                        setGapScanStatus(`Reading screenshot… ${Math.round(progress * 100)}%`);
                    }
                },
            });
            const result = await worker.recognize(file);
            const ocrText = String((result && result.data && result.data.text) || "").trim();
            const phrases = contentGapPhrasesFromText(ocrText);
            const createdAt = new Date().toISOString();
            if (phrases.length) {
                setGapRows((current) => {
                    const existing = new Set(current.map((row) => String(row.phrase || "").trim().toLowerCase()));
                    const additions = phrases
                        .filter((phrase) => !existing.has(phrase.toLowerCase()))
                        .map((phrase) => ({
                            phrase,
                            category: gapDraft.category,
                            gapLevel: gapDraft.gapLevel,
                            note: "Imported from screenshot — review spelling before filming",
                            id: uid(),
                            status: "queued",
                            source: "screenshot import",
                            createdAt,
                        }));
                    return [...additions, ...current];
                });
                setGapScanStatus(`${phrases.length} phrase${phrases.length === 1 ? "" : "s"} read and saved in the queue. The image was discarded. Review the spelling, then remove any line that is not a real Content Gap phrase.`);
                setCopyStatus("Detected Content Gap phrases saved. Image discarded.");
            }
            else {
                setGapScanStatus("No clear phrases were found, and the image was discarded. Try a tighter screenshot with larger, sharper text.");
            }
            setGapScanProgress(1);
        }
        catch (error) {
            setGapScanStatus((error && error.message) || "The screenshot could not be read. Try a sharper image while connected to the internet.");
            setGapScanProgress(0);
        }
        finally {
            if (worker) {
                try { await worker.terminate(); }
                catch { }
            }
            setGapScanBusy(false);
            if (gapImageRef.current)
                gapImageRef.current.value = "";
        }
    };
    const exportBackup = () => {
        const backup = { version: 1, exportedAt: new Date().toISOString(), saved, products, quickCreateHistory, form, tasks, moneyRows, gapRows, hookLog };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `done-rite-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
        setImportStatus("Backup downloaded.");
    };
    const importBackup = async (file) => {
        if (!file)
            return;
        try {
            const data = JSON.parse(await file.text());
            if (data.version !== 1)
                throw new Error("Unsupported backup version");
            setSaved(Array.isArray(data.saved) ? data.saved : []);
            setProducts(Array.isArray(data.products) ? data.products : []);
            setQuickCreateHistory(Array.isArray(data.quickCreateHistory) ? data.quickCreateHistory : []);
            if (data.form && typeof data.form === "object")
                setForm({ ...EMPTY_FORM, ...data.form });
            setTasks(Array.isArray(data.tasks) ? data.tasks : DEFAULT_TASKS);
            setMoneyRows(Array.isArray(data.moneyRows) ? data.moneyRows : []);
            setGapRows(Array.isArray(data.gapRows) ? data.gapRows : []);
            if (Array.isArray(data.hookLog))
                setHookLog(data.hookLog);
            setImportStatus("Backup restored successfully.");
        }
        catch {
            setImportStatus("That file is not a valid DONE RITE backup.");
        }
    };
    const sections = pkg ? [
        ["Hooks", pkg.hooks.map((hook, index) => `${index + 1}. ${hook}`).join("\n")],
        ...(pkg.shotList ? [["Shot list — hands in frame, no face", pkg.shotList]] : []),
        ["Voiceover", pkg.voiceover],
        ["On-screen text", pkg.onScreenText],
        ["Caption", pkg.caption],
        ["Hashtags", pkg.hashtags],
        ["CTA", pkg.cta],
        ["Thumbnail", pkg.thumbnail],
        ["AI image prompt", pkg.aiImagePrompt],
        ["AI video prompt", pkg.aiVideoPrompt],
        ["Cross-platform checklist", pkg.crossPlatform],
        ["Compliance note", pkg.complianceNote],
    ] : [];
    const tabs = [
        ["home", "Home"],
        ["create", "Quick Create"],
        ["check", "Compliance"],
        ["video", "Video Check"],
        ["hooks", "Hook Lab"],
        ["gap", "Content Gap"],
        ["ai", "AI Studio"],
        ["products", "Products"],
        ["saved", "Saved"],
        ["money", "Money"],
        ["settings", "Settings"],
    ];
    return (React.createElement("div", { className: "dr-shell" },
        React.createElement("style", null, CSS),
        React.createElement("header", { className: "dr-header" },
            React.createElement("div", { className: "dr-wrap dr-brand" },
                React.createElement("div", { className: "dr-bolt", "aria-hidden": "true" }, "\u26A1"),
                React.createElement("div", null,
                    React.createElement("h1", { className: "dr-title" }, "DONE RITE Creator OS"),
                    React.createElement("p", { className: "dr-tagline" }, "Real Reviews. Real Gadgets. Done Rite."))),
            React.createElement("div", { className: "dr-tabs", role: "tablist", "aria-label": "Creator OS sections" }, tabs.map(([id, label]) => (React.createElement("button", { key: id, className: "dr-tab", type: "button", role: "tab", "aria-selected": tab === id, onClick: () => setTab(id) }, label))))),
        React.createElement("main", { className: "dr-wrap" },
            React.createElement("div", { className: "dr-status", role: "status", "aria-live": "polite" }, copyStatus),
            saveBlocked && (React.createElement("div", { className: "dr-savewarn", role: "alert" },
                React.createElement("strong", null, "Saving is turned off right now."),
                React.createElement("span", null, saveBlocked))),
            tab === "home" && (React.createElement(React.Fragment, null,
                React.createElement(Card, null,
                    React.createElement("h2", null, "Start My Day"),
                    React.createElement("p", { className: "dr-help" }, "One dashboard. One clear daily mission. Prioritize money, time, growth, platform rules, and AI assistance.")),
                React.createElement("div", { className: "dr-grid", style: { marginTop: 12 } },
                    React.createElement(Card, null,
                        React.createElement("div", { className: "dr-label" }, "Net revenue"),
                        React.createElement("div", { className: "dr-metric" }, money(revenue - expenses))),
                    React.createElement(Card, null,
                        React.createElement("div", { className: "dr-label" }, "Daily progress"),
                        React.createElement("div", { className: "dr-metric" },
                            completedTasks,
                            "/",
                            tasks.length)),
                    React.createElement(Card, null,
                        React.createElement("div", { className: "dr-label" }, "Products"),
                        React.createElement("div", { className: "dr-metric" }, products.length)),
                    React.createElement(Card, null,
                        React.createElement("div", { className: "dr-label" }, "Samples received"),
                        React.createElement("div", { className: "dr-metric" }, sampleCount))),
                React.createElement(Card, null,
                    React.createElement("div", { className: "dr-output-head" },
                        React.createElement("h3", null, "Today\u2019s Mission"),
                        React.createElement("span", { className: "dr-pill" }, "Local auto-save")),
                    React.createElement("div", { className: "dr-list" }, tasks.map((task) => (React.createElement("label", { className: "dr-item", key: task.id },
                        React.createElement("span", { className: "dr-check" },
                            React.createElement("input", { type: "checkbox", checked: task.done, onChange: () => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done: !item.done } : item)) }),
                            React.createElement("span", null, task.label))))))))),
            tab === "create" && (React.createElement(React.Fragment, null,
                React.createElement(Card, null,
                    React.createElement("h2", null, "Quick Create"),
                    React.createElement("p", { className: "dr-help" }, "One product in, a complete compliant content package out. Enter only verified product information."),
                    React.createElement("div", { style: { height: 14 } }),
                    productHistory.length > 0 && (React.createElement(Field, { label: "Load a previous product", help: `${productHistory.length} product${productHistory.length === 1 ? "" : "s"} you have worked on before.` },
                        React.createElement("select", { className: "dr-select", value: "", onChange: (event) => {
                                const entry = productHistory.find((item) => item.key === event.target.value);
                                if (!entry)
                                    return;
                                const found = entry.source;
                                setForm((current) => {
                                    const loaded = {
                                        ...current,
                                        productName: entry.name,
                                        category: found.category || current.category,
                                        verifiedFeatures: found.verifiedFeatures || current.verifiedFeatures,
                                        searchPhrase: "",
                                        acquisition: found.acquisition || (found.sampleReceived ? "sample" : current.acquisition),
                                    };
                                    return { ...loaded, searchPhrase: buildTargetPhraseChoices(loaded)[0] || "" };
                                });
                                setCopyStatus(`Loaded ${entry.name}.`);
                            } },
                            React.createElement("option", { value: "" }, "New product"),
                            productHistory.map((item) => (React.createElement("option", { key: item.key, value: item.key }, item.name)))))),
                    React.createElement(Field, { label: "Product name" },
                        React.createElement("input", { ref: nameRef, className: "dr-input", style: needsName ? { borderColor: COLORS.red } : undefined, value: form.productName, onChange: (event) => { setValue("productName", event.target.value); if (event.target.value.trim())
                                setNeedsName(false); }, onBlur: () => rememberQuickCreateProduct(), placeholder: "Example: rechargeable work light" })),
                    needsName && (React.createElement("div", { className: "dr-savewarn", role: "alert" },
                        React.createElement("strong", null, "Nothing was generated."),
                        React.createElement("span", null, "Type the product name in the box above, then press Generate Content Package again."))),
                    React.createElement(Field, { label: "Category" },
                        React.createElement("select", { className: "dr-select", value: form.category, onChange: (event) => setValue("category", event.target.value) }, CATEGORIES.map((category) => React.createElement("option", { key: category }, category)))),
                    React.createElement(Field, { label: "Choose a target search phrase", help: "Only phrases saved in Content Gap appear here. The closest match for the selected product is listed first." },
                        React.createElement("select", { className: "dr-select", value: "", onChange: (event) => {
                                if (event.target.value)
                                    setValue("searchPhrase", event.target.value);
                            } },
                            React.createElement("option", { value: "" }, targetPhraseChoices.length ? "Select a Content Gap phrase" : "Save a Content Gap phrase first"),
                            targetPhraseChoices.length > 0 && React.createElement("optgroup", { label: "Saved Content Gap phrases" },
                                targetPhraseChoices.map((phrase, index) => React.createElement("option", { key: `gap-${phrase}`, value: phrase }, index === 0 ? `Best match: ${phrase}` : phrase))))),
                    React.createElement(Field, { label: "Target search phrase", help: "The selected phrase appears here. You can also type or edit your own phrase." },
                        React.createElement("input", { className: "dr-input", value: form.searchPhrase, onChange: (event) => setValue("searchPhrase", event.target.value), placeholder: "Choose from the list above or type your own" })),
                    React.createElement(Field, { label: "Verified features", help: "Do not paste seller hype, prices, discounts, unsupported specifications, or medical claims." },
                        React.createElement("textarea", { className: "dr-textarea", value: form.verifiedFeatures, onChange: (event) => setValue("verifiedFeatures", event.target.value), placeholder: "One verified feature per line" })),
                    React.createElement("p", { className: "dr-help", style: { marginTop: 4 } }, "Tap to add. Only add what you have actually confirmed on the product \u2014 these are wordings, not facts."),
                    React.createElement("div", { className: "dr-chips" }, (FEATURE_LIBRARY[form.category] || []).map((text) => (React.createElement("button", { className: "dr-chip", type: "button", key: text, onClick: () => addFeature(text) },
                        "+ ",
                        text)))),
                    React.createElement(Field, { label: "Platform", help: "Changes which hooks and calls to action are offered below." },
                        React.createElement("select", { className: "dr-select", value: form.platform, onChange: (e) => { setValue("platform", e.target.value); setValue("chosenHook", ""); setValue("chosenCta", ""); setValue("chosenPattern", ""); } },
                            ["TikTok Shop", "YouTube Shorts", "Facebook", "Instagram Reels", "Pinterest"].map((pf) => React.createElement("option", { key: pf, value: pf }, pf)))),
                    React.createElement(Field, { label: "Pick a hook", help: `${hookChoices.length} hooks written for ${form.platform}. Leave on Auto and it rotates a fresh one every time.` },
                        React.createElement("select", { className: "dr-select", value: form.chosenHook, onChange: (e) => setValue("chosenHook", e.target.value) },
                            React.createElement("option", { value: "" }, "Auto \u2014 rotate a new hook each time"),
                            hookChoices.map((h) => React.createElement("option", { key: h.text, value: h.text }, `${h.angle}: ${h.text}`)))),
                    React.createElement(Field, { label: "Pick a call to action", help: `${ctaChoices.length} written for ${form.platform}. All cart or link directed, no urgency or price language.` },
                        React.createElement("select", { className: "dr-select", value: form.chosenCta, onChange: (e) => setValue("chosenCta", e.target.value) },
                            React.createElement("option", { value: "" }, "Auto \u2014 use the default for this platform"),
                            ctaChoices.map((c) => React.createElement("option", { key: c.text, value: c.text }, `${c.style}: ${c.text}`)))),
                    React.createElement(Field, { label: "Pick a shot pattern", help: `${patternChoices.length} filming patterns for ${form.platform}. Every one is hands in frame, head out of frame. Leave on Auto and it rotates a different pattern each time.` },
                        React.createElement("select", { className: "dr-select", value: form.chosenPattern, onChange: (e) => setValue("chosenPattern", e.target.value) },
                            React.createElement("option", { value: "" }, "Auto \u2014 rotate a different pattern each time"),
                            patternChoices.map((s) => React.createElement("option", { key: s.id, value: s.id }, s.name)))),
                    React.createElement("div", { className: "dr-card", style: { background: COLORS.panel2, padding: 12, marginBottom: 14 } },
                        React.createElement("div", { className: "dr-label" }, form.chosenPattern ? "Selected pattern" : "Next up on auto"),
                        React.createElement("div", { className: "dr-item-title", style: { color: COLORS.blueGlow } }, previewPattern.name),
                        React.createElement("div", { className: "dr-help", style: { marginTop: 4 } }, previewPattern.why)),
                    featureHistory.length > 0 && (React.createElement(React.Fragment, null,
                        React.createElement("p", { className: "dr-help", style: { marginTop: 12 } }, "Features you have used before"),
                        React.createElement("div", { className: "dr-chips" }, featureHistory.map((text) => (React.createElement("button", { className: "dr-chip", type: "button", key: text, onClick: () => addFeature(text) },
                            "+ ",
                            text)))))),
                    React.createElement("div", { className: "dr-row" },
                        React.createElement(Field, { label: "Funnel" },
                            React.createElement("select", { className: "dr-select", value: form.funnel, onChange: (event) => setValue("funnel", event.target.value) },
                                React.createElement("option", null, "BOF"),
                                React.createElement("option", null, "TOF"))),
                        React.createElement(Field, { label: "Duration" },
                            React.createElement("select", { className: "dr-select", value: form.duration, onChange: (event) => setValue("duration", event.target.value) },
                                React.createElement("option", null, "7"),
                                React.createElement("option", null, "10"),
                                React.createElement("option", null, "15")))),
                    React.createElement("div", { className: "dr-field" },
                        React.createElement(Field, { label: "How did you get this product?", help: "Anything other than \u201Cnot in hand yet\u201D lets the script speak from real use." },
                            React.createElement("select", { className: "dr-select", value: form.acquisition, onChange: (event) => setValue("acquisition", event.target.value) },
                                React.createElement("option", { value: "none" }, "Not in my hands yet \u2014 planning draft only"),
                                React.createElement("option", { value: "sample" }, "Free sample from the seller"),
                                React.createElement("option", { value: "purchased" }, "I bought it myself")))),
                    React.createElement("div", { className: "dr-field" },
                        React.createElement("label", { className: "dr-check" },
                            React.createElement("input", { type: "checkbox", checked: form.batteryPowered, onChange: (event) => setValue("batteryPowered", event.target.checked) }),
                            React.createElement("span", null, "This product is electrical or battery-powered."))),
                    React.createElement("button", { className: "dr-button", type: "button", onClick: generate }, "Generate Content Package")),
                React.createElement(Card, null,
                    React.createElement("div", { className: "dr-output-head" },
                        React.createElement("h3", null, "Why these hooks, CTAs and patterns"),
                        React.createElement("span", { className: "dr-pill" }, "Checked Aug 2026")),
                    React.createElement("p", { className: "dr-help" }, "The libraries above are built on this. Re-check it every quarter \u2014 platform behaviour moves faster than any app can."),
                    React.createElement("div", { className: "dr-list", style: { marginTop: 12 } }, RESEARCH_NOTES.map((note) => (React.createElement("div", { className: "dr-item", key: note.finding },
                        React.createElement("div", { className: "dr-item-main" },
                            React.createElement("div", { className: "dr-item-title", style: { color: COLORS.blueGlow } }, note.finding),
                            React.createElement("div", { className: "dr-help", style: { marginTop: 4 } }, note.detail),
                            React.createElement("div", { className: "dr-help", style: { marginTop: 6, color: COLORS.chrome } }, note.soWhat))))))),
                pkg && (React.createElement(React.Fragment, null,
                    React.createElement("div", { ref: resultsRef }),
                    React.createElement(Card, { className: pkg.publishReady ? "dr-clear" : "dr-flag" },
                        React.createElement("div", { className: "dr-output-head" },
                            React.createElement("div", null,
                                React.createElement("h3", null, pkg.publishReady ? "Automated check passed" : "Review before publishing"),
                                React.createElement("div", { className: "dr-help" }, "Automated checks cannot verify seller facts or current platform eligibility.")),
                            React.createElement("span", { className: "dr-pill" },
                                pkg.form.funnel,
                                " \u00B7 ",
                                pkg.form.duration,
                                "s",
                                pkg.patternName ? ` \u00B7 ${pkg.patternName}` : "")),
                        React.createElement("div", { className: "dr-row" },
                            React.createElement("button", { className: `dr-button ${copiedKey === "Everything" ? "is-copied" : ""}`, type: "button", onClick: () => notifyCopy(flattenScript(pkg), "Everything") }, copiedKey === "Everything" ? "Copied ✓" : "Copy Everything"),
                            React.createElement("button", { className: `dr-copy ${copiedKey === "AI prompt" ? "is-copied" : ""}`, type: "button", onClick: () => notifyCopy(pkg.aiVideoPrompt, "AI prompt") }, copiedKey === "AI prompt" ? "Copied ✓" : "Copy AI Prompt"),
                            React.createElement("span", { className: "dr-pill" }, "Saved automatically"))),
                    sections.map(([title, text]) => React.createElement(OutputCard, { key: title, title: title, text: text, onCopy: notifyCopy, copiedKey: copiedKey })))))),
            tab === "check" && (React.createElement(React.Fragment, null,
                React.createElement(Card, null,
                    React.createElement("h2", null, "Compliance Center"),
                    React.createElement("p", { className: "dr-help" }, "Paste a hook, script, caption, or on-screen text. This is a wording screen, not a guarantee of platform approval."),
                    React.createElement("div", { style: { height: 12 } }),
                    React.createElement("textarea", { className: "dr-textarea", value: checkText, onChange: (event) => setCheckText(event.target.value), placeholder: "Paste content to check" })),
                checkText && complianceResults.length === 0 && React.createElement(Card, { className: "dr-clear" },
                    React.createElement("h3", null, "No automated wording flags found"),
                    React.createElement("p", { className: "dr-help" }, "Still verify product facts, eligibility, disclosure, footage, audio rights, and current platform rules.")),
                complianceResults.map((issue) => (React.createElement(Card, { key: issue.id, className: issue.severity === "block" ? "dr-flag dr-block" : "dr-flag" },
                    React.createElement("h3", { style: { color: issue.severity === "block" ? COLORS.red : COLORS.amber } }, issue.label),
                    React.createElement("p", { className: "dr-help" },
                        "Safer alternate: ",
                        issue.safer)))))),
            tab === "video" && (React.createElement(React.Fragment, null,
                React.createElement(Card, null,
                    React.createElement("h2", null, "Video Check"),
                    React.createElement("p", { className: "dr-help" }, "Your video stays on this phone. Nothing is uploaded and nothing leaves the device."),
                    React.createElement(Field, { label: "Video type" },
                        React.createElement("select", { className: "dr-select", value: videoMode, onChange: (event) => setVideoMode(event.target.value) },
                            React.createElement("option", { value: "BOF" }, "BOF \u2014 7 to 15 seconds"),
                            React.createElement("option", { value: "TOF" }, "TOF \u2014 up to 30 seconds"))),
                    React.createElement("div", { className: "dr-row", style: { marginTop: 12 } },
                        React.createElement("button", { className: "dr-button", type: "button", onClick: () => { var _a; return (_a = videoRef.current) === null || _a === void 0 ? void 0 : _a.click(); } }, videoBusy ? "Reading video…" : "Choose a video")),
                    React.createElement("input", { ref: videoRef, type: "file", accept: "video/*", hidden: true, onChange: (event) => { var _a; return pickVideo((_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0]); } }),
                    videoError && React.createElement("p", { className: "dr-help", style: { color: COLORS.red } }, videoError)),
                videoInfo && (React.createElement(Card, null,
                    React.createElement("h3", null, videoInfo.name),
                    React.createElement("div", { className: "dr-output", style: { marginTop: 10 } },
                        videoInfo.duration.toFixed(1),
                        " seconds \u00B7 ",
                        videoInfo.width,
                        "\u00D7",
                        videoInfo.height,
                        " \u00B7 ",
                        videoInfo.sizeMb.toFixed(1),
                        " MB"),
                    React.createElement("div", { className: "dr-list", style: { marginTop: 12 } },
                        videoShapeFlags.length === 0 && React.createElement("p", { className: "dr-help" }, "Nothing flagged on the video itself."),
                        videoShapeFlags.map((flag, index) => (React.createElement("div", { className: "dr-item", key: index },
                            React.createElement("div", { className: "dr-item-main" },
                                React.createElement("div", { className: "dr-item-title", style: { color: flag.severity === "block" ? COLORS.red : flag.severity === "ok" ? COLORS.green : COLORS.amber } }, flag.label),
                                React.createElement("div", { className: "dr-help" }, flag.safer)))))))),
                React.createElement(Card, null,
                    React.createElement("h3", null, "Words in and around the video"),
                    React.createElement("p", { className: "dr-help" }, "Paste your caption, on-screen text, and voiceover. Most takedowns come from wording, not footage."),
                    React.createElement("textarea", { className: "dr-textarea", rows: 5, value: videoText, onChange: (event) => setVideoText(event.target.value), placeholder: "Paste caption, on-screen text, and voiceover here" }),
                    React.createElement("div", { className: "dr-list", style: { marginTop: 12 } },
                        videoText.trim() === "" && React.createElement("p", { className: "dr-help" }, "Nothing to check yet."),
                        videoText.trim() !== "" && videoTextResults.length === 0 && React.createElement("p", { className: "dr-help", style: { color: COLORS.green } }, "No banned wording found."),
                        videoTextResults.map((issue) => (React.createElement("div", { className: "dr-item", key: issue.id },
                            React.createElement("div", { className: "dr-item-main" },
                                React.createElement("div", { className: "dr-item-title", style: { color: issue.severity === "block" ? COLORS.red : COLORS.amber } }, issue.label),
                                React.createElement("div", { className: "dr-help" },
                                    "Safer: ",
                                    issue.safer))))))),
                React.createElement(Card, null,
                    React.createElement("h3", null, "Before you publish"),
                    React.createElement("p", { className: "dr-help" }, "Copyright and ownership cannot be measured automatically. Confirm each one yourself."),
                    [
                        ["ownFootage", "The footage and product images are mine or licensed to me"],
                        ["ownAudio", "Any music or audio is cleared, or I used TikTok's own library"],
                        ["noLogos", "No competitor brands, logos, or packaging appear in frame"],
                        ["noFace", "No face, head, shoulders, or reflection appears in any frame \u2014 hands only"],
                        ["sampleInHand", "I have this product in hand — sample or bought myself — so first-person claims are honest"],
                    ].map(([key, label]) => (React.createElement("label", { className: "dr-check", key: key },
                        React.createElement("input", { type: "checkbox", checked: videoDecl[key], onChange: (event) => setVideoDecl({ ...videoDecl, [key]: event.target.checked }) }),
                        React.createElement("span", null, label)))),
                    videoInfo && (React.createElement("div", { className: "dr-row", style: { marginTop: 14 } },
                        React.createElement("button", { className: `dr-button ${copiedKey === "Video report" ? "is-copied" : ""}`, type: "button", onClick: () => notifyCopy(videoReport(), "Video report") }, copiedKey === "Video report" ? "Copied ✓" : "Copy Full Report")))))),
            tab === "ai" && (React.createElement(React.Fragment, null,
                React.createElement(Card, null,
                    React.createElement("h2", null, "AI Studio"),
                    React.createElement("p", { className: "dr-help" }, "This dashboard writes rule-based packages on its own. Original AI writing needs a connected AI service, which this app does not have. Build a prompt here, run it in ChatGPT or Claude, then paste the result back for checking."),
                    React.createElement(Field, { label: "Product name" },
                        React.createElement("input", { className: "dr-input", value: aiProduct, onChange: (event) => setAiProduct(event.target.value), placeholder: "e.g. rechargeable work light" })),
                    React.createElement("div", { className: "dr-row", style: { marginTop: 12 } },
                        React.createElement("button", { className: `dr-button ${copiedKey === "AI Studio prompt" ? "is-copied" : ""}`, type: "button", onClick: () => notifyCopy(aiPrompt(), "AI Studio prompt") }, copiedKey === "AI Studio prompt" ? "Copied ✓" : "Copy Prompt for ChatGPT or Claude")),
                    React.createElement("div", { className: "dr-output", style: { marginTop: 12 } }, aiPrompt())),
                React.createElement(Card, null,
                    React.createElement("h3", null, "Paste the AI script back here"),
                    React.createElement("p", { className: "dr-help" }, "Anything AI writes still has to pass your rules before it goes out."),
                    React.createElement("textarea", { className: "dr-textarea", rows: 8, value: aiDraft, onChange: (event) => setAiDraft(event.target.value), placeholder: "Paste the script the AI wrote" }),
                    React.createElement("div", { className: "dr-list", style: { marginTop: 12 } },
                        aiDraft.trim() === "" && React.createElement("p", { className: "dr-help" }, "Nothing pasted yet."),
                        aiDraft.trim() !== "" && aiResults.length === 0 && React.createElement("p", { className: "dr-help", style: { color: COLORS.green } }, "Clean. No banned wording found."),
                        aiResults.map((issue) => (React.createElement("div", { className: "dr-item", key: issue.id },
                            React.createElement("div", { className: "dr-item-main" },
                                React.createElement("div", { className: "dr-item-title", style: { color: issue.severity === "block" ? COLORS.red : COLORS.amber } }, issue.label),
                                React.createElement("div", { className: "dr-help" },
                                    "Safer: ",
                                    issue.safer)))))),
                    aiDraft.trim() !== "" && (React.createElement("div", { className: "dr-row", style: { marginTop: 14 } },
                        React.createElement("button", { className: "dr-copy", type: "button", onClick: () => {
                                const now = new Date().toISOString();
                                setSaved((current) => [{
                                        id: `ai-${Date.now()}`,
                                        productName: aiProduct.trim() || "AI script",
                                        createdAt: now,
                                        hooks: [],
                                        voiceover: aiDraft,
                                        onScreenText: "",
                                        caption: "",
                                        hashtags: "",
                                        cta: "",
                                        thumbnailText: "",
                                        aiImagePrompt: "",
                                        aiVideoPrompt: "",
                                        checklist: "",
                                        complianceNote: aiResults.map((issue) => `${issue.label} Safer: ${issue.safer}`).join(" "),
                                    }, ...current]);
                                setCopyStatus("AI script saved.");
                            } }, "Save to Saved Creations")))))),
            tab === "hooks" && (React.createElement(React.Fragment, null,
                React.createElement(Card, null,
                    React.createElement("h2", null, "Hook Lab"),
                    React.createElement("p", { className: "dr-help" }, "Log the hooks you actually post and what they earned. Anything you mark as a winner gets used first the next time you generate for that platform. Nobody can tell you which hooks are selling right now \u2014 your own numbers can."),
                    React.createElement(Field, { label: "Hook text" },
                        React.createElement("textarea", { className: "dr-textarea", rows: 2, value: hookDraft.text, onChange: (e) => setHookDraft({ ...hookDraft, text: e.target.value }), placeholder: "Paste the exact opening line you used" })),
                    React.createElement(Field, { label: "Platform" },
                        React.createElement("select", { className: "dr-select", value: hookDraft.platform, onChange: (e) => setHookDraft({ ...hookDraft, platform: e.target.value }) },
                            ["TikTok Shop", "YouTube Shorts", "Facebook", "Instagram Reels", "Pinterest"].map((pf) => React.createElement("option", { key: pf, value: pf }, pf)))),
                    React.createElement(Field, { label: "Product" },
                        React.createElement("input", { className: "dr-input", value: hookDraft.product, onChange: (e) => setHookDraft({ ...hookDraft, product: e.target.value }), placeholder: "Which product this ran on" })),
                    React.createElement("div", { className: "dr-grid2" },
                        React.createElement(Field, { label: "Views" },
                            React.createElement("input", { className: "dr-input", inputMode: "numeric", value: hookDraft.views, onChange: (e) => setHookDraft({ ...hookDraft, views: e.target.value }), placeholder: "0" })),
                        React.createElement(Field, { label: "Sales" },
                            React.createElement("input", { className: "dr-input", inputMode: "numeric", value: hookDraft.sales, onChange: (e) => setHookDraft({ ...hookDraft, sales: e.target.value }), placeholder: "0" }))),
                    React.createElement("div", { className: "dr-row", style: { marginTop: 14 } },
                        React.createElement("button", { className: "dr-button", type: "button", onClick: () => {
                            if (!hookDraft.text.trim()) { setCopyStatus("Paste the hook text first."); return; }
                            const sales = Number(hookDraft.sales) || 0;
                            setHookLog((current) => [{
                                id: `hook-${Date.now()}`,
                                text: hookDraft.text.trim(),
                                platform: hookDraft.platform,
                                product: hookDraft.product.trim(),
                                views: Number(hookDraft.views) || 0,
                                sales,
                                winner: sales > 0,
                                createdAt: new Date().toISOString(),
                            }, ...current]);
                            setHookDraft({ text: "", platform: hookDraft.platform, product: "", sales: "", views: "" });
                            setCopyStatus(sales > 0 ? "Logged and marked as a winner." : "Hook logged.");
                        } }, "Log This Hook"))),

                React.createElement(Card, null,
                    React.createElement("h3", null, "Your winners"),
                    React.createElement("p", { className: "dr-help" }, "Hooks that made at least one sale. These are pulled into Quick Create first."),
                    React.createElement("div", { className: "dr-list" },
                        hookLog.filter((h) => h.winner).length === 0 && React.createElement("p", { className: "dr-help" }, "No winners logged yet. Log a hook with at least one sale and it will appear here."),
                        hookLog.filter((h) => h.winner).map((h) => React.createElement("div", { className: "dr-item", key: h.id },
                            React.createElement("div", { className: "dr-item-main" },
                                React.createElement("div", { className: "dr-item-title", style: { color: COLORS.green } }, h.text),
                                React.createElement("div", { className: "dr-help" }, `${h.platform}${h.product ? " \u00b7 " + h.product : ""} \u00b7 ${h.sales} sale${h.sales === 1 ? "" : "s"} \u00b7 ${h.views} views`)),
                            React.createElement("button", { className: "dr-danger", type: "button", onClick: () => setHookLog((c) => c.filter((x) => x.id !== h.id)) }, "Remove"))))),

                React.createElement(Card, null,
                    React.createElement("h3", null, "Everything logged"),
                    React.createElement("div", { className: "dr-list" },
                        hookLog.length === 0 && React.createElement("p", { className: "dr-help" }, "Nothing logged yet."),
                        hookLog.map((h) => React.createElement("div", { className: "dr-item", key: h.id },
                            React.createElement("div", { className: "dr-item-main" },
                                React.createElement("div", { className: "dr-item-title" }, h.text),
                                React.createElement("div", { className: "dr-help" }, `${h.platform} \u00b7 ${h.sales} sales \u00b7 ${h.views} views`)),
                            React.createElement("button", { className: "dr-copy", type: "button", onClick: () => setHookLog((c) => c.map((x) => x.id === h.id ? { ...x, winner: !x.winner } : x)) }, h.winner ? "Unmark" : "Mark winner")))))
            )),
            tab === "gap" && (React.createElement(React.Fragment, null,
                React.createElement(Card, null,
                    React.createElement("h2", null, "Content Gap"),
                    React.createElement("p", { className: "dr-help" }, "Take a screenshot of TikTok Creator Search Insights, upload it below, and the Creator OS will read the visible Content Gap phrases into your queue. You can still type one manually when needed."),
                    React.createElement("div", { className: "dr-output", style: { marginTop: 12 } }, [
                        "1. Open TikTok, go to your profile",
                        "2. Creator Tools → Creator Search Insights",
                        "   (on some builds it sits under Settings instead)",
                        "3. Choose Content Gap",
                        "4. Filter to High % Gap",
                        "5. Screenshot the visible phrases and upload it here",
                    ].join("\n")),
                    React.createElement("p", { className: "dr-help", style: { marginTop: 12 } }, "The first scan needs an internet connection to load the on-device text reader. The screenshot is used only long enough to read the text, then discarded. Only the detected phrases are saved.")),

                React.createElement(Card, null,
                    React.createElement("h3", null, "Upload Content Gap Screenshot"),
                    React.createElement("div", { className: "dr-upload-box", style: { marginTop: 12 } },
                        React.createElement("input", { ref: gapImageRef, type: "file", accept: "image/*", hidden: true, onChange: (event) => scanContentGapImage(event.target.files && event.target.files[0]) }),
                        React.createElement("button", { className: "dr-button", type: "button", disabled: gapScanBusy, onClick: () => gapImageRef.current && gapImageRef.current.click() }, gapScanBusy ? "Reading Screenshot…" : "Choose Screenshot or Take Photo"),
                        gapScanBusy && React.createElement("div", { className: "dr-progress", style: { marginTop: 12 } }, React.createElement("span", { style: { width: `${Math.round(gapScanProgress * 100)}%` } })),
                        gapScanStatus && React.createElement("p", { className: "dr-help", role: "status", style: { marginBottom: 0, color: gapScanProgress === 1 ? COLORS.green : COLORS.chrome } }, gapScanStatus))),

                React.createElement(Card, null,
                    React.createElement("h3", null, "Type One Phrase Manually"),
                    React.createElement("div", { style: { height: 12 } }),
                    React.createElement(Field, { label: "Search phrase", help: "Type it exactly as TikTok shows it. Exact wording is the whole point." },
                        React.createElement("input", { className: "dr-input", value: gapDraft.phrase, onChange: (e) => setGapDraft({ ...gapDraft, phrase: e.target.value }), placeholder: "e.g. best neck phone holder for reading in bed" })),
                    React.createElement("div", { className: "dr-row" },
                        React.createElement(Field, { label: "Category" },
                            React.createElement("select", { className: "dr-select", value: gapDraft.category, onChange: (e) => setGapDraft({ ...gapDraft, category: e.target.value }) }, CATEGORIES.map((c) => React.createElement("option", { key: c }, c)))),
                        React.createElement(Field, { label: "Gap level" },
                            React.createElement("select", { className: "dr-select", value: gapDraft.gapLevel, onChange: (e) => setGapDraft({ ...gapDraft, gapLevel: e.target.value }) },
                                React.createElement("option", null, "High"),
                                React.createElement("option", null, "Medium"),
                                React.createElement("option", null, "Low")))),
                    React.createElement(Field, { label: "Note" },
                        React.createElement("input", { className: "dr-input", value: gapDraft.note, onChange: (e) => setGapDraft({ ...gapDraft, note: e.target.value }), placeholder: "Optional — anything you noticed" })),
                    React.createElement("button", { className: "dr-button", type: "button", onClick: () => {
                        if (!gapDraft.phrase.trim()) { setCopyStatus("Type the search phrase first."); return; }
                        setGapRows((current) => [{ ...gapDraft, phrase: gapDraft.phrase.trim(), note: gapDraft.note.trim(), id: uid(), status: "queued", createdAt: new Date().toISOString() }, ...current]);
                        setGapDraft({ ...EMPTY_GAP, category: gapDraft.category, gapLevel: gapDraft.gapLevel });
                        setCopyStatus("Phrase logged.");
                    } }, "Log This Phrase")),

                React.createElement(Card, null,
                    React.createElement("div", { className: "dr-output-head" },
                        React.createElement("h3", null, "Queue"),
                        React.createElement("span", { className: "dr-pill" }, `${gapRows.filter((r) => r.status !== "filmed").length} waiting`)),
                    React.createElement("p", { className: "dr-help" }, "Products you already own are matched by keyword. A match is a suggestion, not a verdict — you decide whether the phrase honestly describes the product."),
                    React.createElement("div", { className: "dr-list", style: { marginTop: 12 } },
                        gapRows.length === 0 && React.createElement("p", { className: "dr-help" }, "Nothing logged yet. Open Creator Search Insights and bring back five phrases."),
                        gapRows.map((row) => {
                            const matches = matchProducts(row.phrase, products);
                            const filmed = row.status === "filmed";
                            return React.createElement("div", { className: "dr-item", key: row.id, style: { flexDirection: "column", alignItems: "stretch", opacity: filmed ? 0.55 : 1 } },
                                React.createElement("div", { className: "dr-item-title", style: { color: filmed ? COLORS.dim : row.gapLevel === "High" ? COLORS.green : COLORS.chrome, textDecoration: filmed ? "line-through" : "none" } }, row.phrase),
                                React.createElement("div", { className: "dr-help", style: { marginTop: 4 } }, `${row.gapLevel} gap · ${row.category}${row.note ? " · " + row.note : ""}`),
                                React.createElement("div", { className: "dr-help", style: { marginTop: 8, color: matches.length ? COLORS.blueGlow : COLORS.amber } },
                                    matches.length
                                        ? `Possible match: ${matches.map((m) => m.product.productName).join(", ")}`
                                        : "No product in your vault matches this. Worth requesting a sample, or skip it."),
                                React.createElement("div", { className: "dr-row", style: { marginTop: 10 } },
                                    React.createElement("button", { className: "dr-copy", type: "button", onClick: () => {
                                        setForm((current) => ({
                                            ...current,
                                            searchPhrase: row.phrase,
                                            category: row.category || current.category,
                                            productName: matches.length ? matches[0].product.productName : current.productName,
                                            verifiedFeatures: matches.length ? (matches[0].product.verifiedFeatures || current.verifiedFeatures) : current.verifiedFeatures,
                                        }));
                                        setTab("create");
                                        setCopyStatus("Loaded into Quick Create.");
                                    } }, "Use in Quick Create"),
                                    React.createElement("button", { className: "dr-copy", type: "button", onClick: () => setGapRows((c) => c.map((x) => x.id === row.id ? { ...x, status: filmed ? "queued" : "filmed" } : x)) }, filmed ? "Reopen" : "Mark filmed"),
                                    React.createElement("button", { className: "dr-danger", type: "button", onClick: () => setGapRows((c) => c.filter((x) => x.id !== row.id)) }, "Remove")));
                        })))
            )),
            tab === "products" && (React.createElement(Card, null,
                React.createElement("div", { className: "dr-output-head" },
                    React.createElement("div", null,
                        React.createElement("h2", null, "Product & Sample Vault"),
                        React.createElement("p", { className: "dr-help" }, "Track received samples and the next content action.")),
                    React.createElement("span", { className: "dr-pill" },
                        products.length,
                        " products")),
                React.createElement("div", { className: "dr-list" },
                    products.length === 0 && React.createElement("p", { className: "dr-help" }, "Create your first product in Quick Create."),
                    products.map((product) => (React.createElement("div", { className: "dr-item", key: product.id },
                        React.createElement("div", { className: "dr-item-main" },
                            React.createElement("div", { className: "dr-item-title" }, product.productName),
                            React.createElement("div", { className: "dr-help" },
                                product.category,
                                " \u00B7 ",
                                product.status),
                            React.createElement("div", { style: { marginTop: 8 } },
                                React.createElement("span", { className: "dr-pill" }, product.acquisition === "purchased" ? "Bought it myself" : product.acquisition === "sample" || product.sampleReceived ? "Seller sample received" : "Not in hand yet"))),
                        React.createElement("button", { className: "dr-danger", type: "button", onClick: () => deleteProduct(product.id) }, "Delete"))))))),
            tab === "saved" && (React.createElement(Card, null,
                React.createElement("div", { className: "dr-output-head" },
                    React.createElement("div", null,
                        React.createElement("h2", null, "Saved Creations"),
                        React.createElement("p", { className: "dr-help" }, "Search, copy, duplicate, or delete packages stored on this device.")),
                    React.createElement("span", { className: "dr-pill" },
                        saved.length,
                        " saved")),
                React.createElement("input", { className: "dr-input", value: search, onChange: (event) => setSearch(event.target.value), placeholder: "Search product or script" }),
                React.createElement("div", { className: "dr-list", style: { marginTop: 12 } },
                    filteredSaved.length === 0 && React.createElement("p", { className: "dr-help" }, "No matching saved packages."),
                    filteredSaved.map((item) => (React.createElement("div", { className: "dr-item", key: item.id },
                        React.createElement("div", { className: "dr-item-main" },
                            React.createElement("div", { className: "dr-item-title" }, item.productName),
                            React.createElement("div", { className: "dr-help" }, new Date(item.createdAt).toLocaleString())),
                        React.createElement("div", { className: "dr-row", style: { flex: "0 1 290px" } },
                            React.createElement("button", { className: `dr-copy ${copiedKey === item.productName ? "is-copied" : ""}`, type: "button", onClick: () => notifyCopy(flattenScript(item), item.productName) }, copiedKey === item.productName ? "Copied ✓" : "Copy"),
                            React.createElement("button", { className: "dr-copy", type: "button", onClick: () => duplicatePackage(item) }, "Duplicate"),
                            React.createElement("button", { className: "dr-danger", type: "button", onClick: () => deleteSaved(item.id) }, "Delete")))))))),
            tab === "money" && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "dr-grid" },
                    React.createElement(Card, null,
                        React.createElement("div", { className: "dr-label" }, "Revenue"),
                        React.createElement("div", { className: "dr-metric" }, money(revenue))),
                    React.createElement(Card, null,
                        React.createElement("div", { className: "dr-label" }, "Expenses"),
                        React.createElement("div", { className: "dr-metric", style: { color: COLORS.amber } }, money(expenses)))),
                React.createElement(Card, null,
                    React.createElement("h2", null, "Money Center"),
                    React.createElement("p", { className: "dr-help" }, "A simple record keeper\u2014not financial advice."),
                    React.createElement("div", { style: { height: 12 } }),
                    React.createElement("div", { className: "dr-row" },
                        React.createElement(Field, { label: "Type" },
                            React.createElement("select", { className: "dr-select", value: moneyForm.type, onChange: (event) => setMoneyForm((current) => ({ ...current, type: event.target.value })) },
                                React.createElement("option", null, "Affiliate revenue"),
                                React.createElement("option", null, "Brand deal"),
                                React.createElement("option", null, "Expense"))),
                        React.createElement(Field, { label: "Platform" },
                            React.createElement("select", { className: "dr-select", value: moneyForm.platform, onChange: (event) => setMoneyForm((current) => ({ ...current, platform: event.target.value })) },
                                React.createElement("option", null, "TikTok Shop"),
                                React.createElement("option", null, "Amazon"),
                                React.createElement("option", null, "YouTube"),
                                React.createElement("option", null, "Facebook"),
                                React.createElement("option", null, "Instagram"),
                                React.createElement("option", null, "Pinterest"),
                                React.createElement("option", null, "UGC"),
                                React.createElement("option", null, "Other")))),
                    React.createElement("div", { className: "dr-row" },
                        React.createElement(Field, { label: "Amount" },
                            React.createElement("input", { className: "dr-input", type: "number", inputMode: "decimal", min: "0", step: "0.01", value: moneyForm.amount, onChange: (event) => setMoneyForm((current) => ({ ...current, amount: event.target.value })) })),
                        React.createElement(Field, { label: "Date" },
                            React.createElement("input", { className: "dr-input", type: "date", value: moneyForm.date, onChange: (event) => setMoneyForm((current) => ({ ...current, date: event.target.value })) }))),
                    React.createElement("button", { className: "dr-button", type: "button", onClick: addMoney }, "Save Record")),
                React.createElement(Card, null,
                    React.createElement("div", { className: "dr-list" },
                        moneyRows.length === 0 && React.createElement("p", { className: "dr-help" }, "No money records yet."),
                        moneyRows.map((row) => React.createElement("div", { className: "dr-item", key: row.id },
                            React.createElement("div", null,
                                React.createElement("div", { className: "dr-item-title" },
                                    row.type,
                                    " \u00B7 ",
                                    row.platform),
                                React.createElement("div", { className: "dr-help" }, row.date)),
                            React.createElement("strong", { style: { color: row.type === "Expense" ? COLORS.amber : COLORS.green } }, money(row.amount)))))))),
            tab === "settings" && (React.createElement(React.Fragment, null,
                React.createElement(Card, null,
                    React.createElement("h2", null, "Button Sound"),
                    React.createElement("p", { className: "dr-help" }, "Buttons flash their colour and make a mechanical click when pressed."),
                    React.createElement("div", { className: "dr-field", style: { marginTop: 12 } },
                        React.createElement("label", { className: "dr-check" },
                            React.createElement("input", { type: "checkbox", checked: clickSound, onChange: (event) => setClickSound(event.target.checked) }),
                            React.createElement("span", null, "Click sound on"))),
                    React.createElement("p", { className: "dr-help" }, "On iPhone the click follows the ring/silent switch. Flip the switch on the side of the phone to hear it.")),
                React.createElement(Card, null,
                    React.createElement("h2", null, "Backup & Restore"),
                    React.createElement("p", { className: "dr-help" }, "This component stores data on the current device. Export regular backups before clearing browser data or changing devices."),
                    React.createElement("p", { className: "dr-help" }, "Backups include every Content Gap phrase imported from a screenshot. Images are never saved."),
                    React.createElement("div", { className: "dr-row", style: { marginTop: 14 } },
                        React.createElement("button", { className: "dr-button", type: "button", onClick: exportBackup }, "Export Backup"),
                        React.createElement("button", { className: "dr-copy", type: "button", onClick: () => { var _a; return (_a = importRef.current) === null || _a === void 0 ? void 0 : _a.click(); } }, "Restore Backup")),
                    React.createElement("input", { ref: importRef, type: "file", accept: "application/json,.json", hidden: true, onChange: (event) => { var _a; return importBackup((_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0]); } }),
                    importStatus && React.createElement("p", { className: "dr-help", style: { color: COLORS.green } }, importStatus)),
                React.createElement(Card, null,
                    React.createElement("h3", null, "Permanent Playbook Rules"),
                    React.createElement("div", { className: "dr-output", style: { marginTop: 10 } }, "No pricing or discount language. No competitor comparisons. No unsupported claims. Health content uses support language only. Every affiliate hashtag set includes #ad. Hands-on demo by default \u2014 hands in frame, face never in frame, product moving throughout. Confirm Sample Received before publish-ready first-person content.")),
                React.createElement(Card, null,
                    React.createElement("h3", null, "Implementation note for Claude"),
                    React.createElement("p", { className: "dr-help" }, "This is the single-file local-first baseline. Preserve its data schema and working copy flow when splitting it into modules. A complete installable PWA still needs a project manifest, service worker, icons, and deployment configuration outside this component."))))),
        React.createElement("nav", { className: "dr-nav", "aria-label": "Bottom navigation" },
            React.createElement("div", { className: "dr-nav-inner" }, tabs.map(([id, label]) => React.createElement("button", { key: id, type: "button", "aria-current": tab === id ? "page" : undefined, onClick: () => setTab(id) }, label))))));
}

/* ---------- Mount ----------------------------------------------------
   The old mount block inside index.html is switched off, so this is the
   only thing putting the dashboard on screen. */
try {
  ReactDOM.createRoot(mountPoint).render(React.createElement(DoneRiteCreatorOS));
} catch (error) {
  mountPoint.innerHTML =
    '<div id="boot"><h1>DONE RITE Creator OS</h1>' +
    '<p style="font-size:13px;color:#ff8f9a">Could not start: ' +
    String((error && error.message) || error) +
    '</p></div>';
}

})();
