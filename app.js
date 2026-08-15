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
const APP_BUILD = "2026.08.15-product-reset";
const LAST_TAB_KEY = "done-rite-last-tab:v1";
const STORAGE_KEY = "done-rite-creator-os:v1";
const PRODUCT_HISTORY_KEY = "done-rite-product-history:v1";
const VOICEOVER_QUEUE_KEY = "done-rite-voiceover-queue:v1";
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
  .dr-review-list { display:grid; gap:10px; margin-top:12px; }
  .dr-review-item { padding:12px; border:1px solid ${COLORS.line}; border-radius:12px; background:${COLORS.panel2}; }
  .dr-review-top { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:9px; }
  .dr-review-item .dr-danger { width:auto; min-height:38px; padding:7px 11px; font-size:13px; }
  .dr-review-actions, .dr-gap-actions { display:flex; justify-content:flex-end; align-items:center; flex-wrap:wrap; gap:7px; }
  .dr-review-actions { margin-top:10px; }
  .dr-review-actions button, .dr-gap-actions button {
    width:auto; min-height:36px; padding:7px 10px; font-size:12px; flex:0 0 auto; touch-action:pan-y;
  }
  .dr-gap-menu { align-self:flex-end; margin-top:10px; }
  .dr-gap-menu summary {
    width:max-content; margin-left:auto; list-style:none; min-height:36px; padding:8px 11px;
    border:1px solid ${COLORS.line}; border-radius:10px; background:${COLORS.panel}; color:${COLORS.blueGlow};
    font-size:12px; font-weight:850; cursor:pointer; touch-action:pan-y;
  }
  .dr-gap-menu summary::-webkit-details-marker { display:none; }
  .dr-gap-menu[open] summary { margin-bottom:8px; }
  .dr-hook-options { display:grid; gap:9px; margin-top:12px; }
  .dr-hook-choice {
    width:100%; min-height:50px; padding:11px 13px; border:1px solid ${COLORS.line}; border-radius:12px;
    background:${COLORS.panel2}; color:${COLORS.text}; text-align:left; font:inherit; font-size:14px;
    line-height:1.4; cursor:pointer; touch-action:manipulation;
  }
  .dr-hook-choice strong { color:${COLORS.blueGlow}; margin-right:7px; }
  .dr-hook-choice[aria-pressed="true"] {
    border-color:${COLORS.green}; background:rgba(43,217,124,.12); box-shadow:0 0 0 2px rgba(43,217,124,.14);
  }
  .dr-hook-choice[aria-pressed="true"] strong { color:${COLORS.green}; }
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
/* RISK RULES — ONE LIST, USED BY BOTH THE CHECKER AND THE CLEANER
   ------------------------------------------------------------------
   Before Aug 14 there were two separate lists. The Compliance tab
   blocked words the cleaner never removed, so a package could be built
   containing wording the app itself called a violation. There is now
   one list. scanCompliance reads it to raise flags; the cleaner reads
   the same list to decide which wording must not reach a script.

   The cleaner also no longer deletes single words out of the middle of
   a sentence. Deleting "treated" out of "heat-treated steel" produced
   "Heat- steel" and that went straight into the voiceover. A line that
   trips a block rule is now removed WHOLE and reported back, so you can
   reword it yourself instead of finding broken English in your script. */

/* Ordinary manufacturing and product wording that happens to contain a
   risky word. These are masked before scanning and put back afterwards,
   so honest gadget and tool descriptions survive. */
const PROTECTED_WORDINGS = [
    /\bheat[- ]treated\b/gi,
    /\bsurface[- ]treated\b/gi,
    /\bpre[- ]treated\b/gi,
    /\bpowder[- ]coated\b/gi,
    /\bfixed[- ](?:mount|base|angle|blade|focus)\b/gi,
    /\bfixture\b/gi,
];
function maskProtectedWordings(text) {
    let out = String(text || "");
    const stash = [];
    PROTECTED_WORDINGS.forEach((pattern) => {
        out = out.replace(pattern, (match) => {
            stash.push(match);
            return `\u0000${stash.length - 1}\u0000`;
        });
    });
    return { masked: out, stash };
}
function unmaskProtectedWordings(text, stash) {
    return String(text || "").replace(/\u0000(\d+)\u0000/g, (whole, index) => stash[Number(index)] !== undefined ? stash[Number(index)] : whole);
}

const RISK_RULES = [
    {
        id: "pricing",
        severity: "block",
        test: /\$\s?\d|\b(price|pricing|discount|discounted|sale|on sale|cheapest|lowest price|coupon|save money|savings|deal of)\b/i,
        label: "Pricing or promotional language detected.",
        safer: "Remove the price or promotion and direct viewers to product details.",
    },
    {
        id: "absolute",
        severity: "block",
        test: /\b(guaranteed|guarantee|instantly|100\s?%|100 percent|perfect|flawless|never fails)\b/i,
        label: "Absolute performance claim detected.",
        safer: "Use “designed to,” “built for,” or a verified feature statement.",
    },
    {
        id: "health",
        severity: "block",
        test: /\b(cure|cures|cured|curing|treat|treats|treated|treating|prevent|prevents|prevented|preventing|heal|heals|healed|healing|remedy|remedies|reverse|reverses|reversed|reversing|relieve|relieves|relieved|relieving|alleviate|alleviates|diagnose|diagnoses|detox|detoxes|antibacterial|anti[- ]bacterial|antiviral|anti[- ]viral|antifungal|anti[- ]fungal|clinically proven|doctor recommended|medical grade|pharmaceutical grade|disease|diseases|weight loss|lose weight|burn fat|immune boosting)\b/i,
        label: "Health or medical claim detected.",
        safer: "Remove the treatment, cure, or outcome wording and describe only verified product features.",
    },
    {
        id: "condition",
        severity: "block",
        test: /\b(arthritis|anxiety|depression|diabetes|diabetic|cancer|tumor|tumour|asthma|eczema|psoriasis|acne|migraine|migraines|insomnia|adhd|autism|alzheimer'?s|dementia|blood pressure|hypertension|cholesterol|inflammation|inflammatory|infection|infections|fungal|joint pain|back pain|nerve pain|neuropathy|hair loss|erectile|menopause|acid reflux|vertigo|tinnitus|covid|influenza)\b/i,
        label: "A medical condition is named.",
        safer: "Naming a health condition implies a medical claim. Remove the condition and describe only what the product is designed to do.",
    },
    {
        id: "before-after",
        severity: "block",
        test: /\b(before and after|before\s*\/\s*after)\b/i,
        label: "Before-and-after implication detected.",
        safer: "Describe only verified product features without promising a personal outcome.",
    },
    {
        id: "earnings",
        severity: "block",
        test: /\b(earnings?|income|make money|financial freedom|get rich)\b/i,
        label: "Income or earnings claim detected.",
        safer: "Remove the financial outcome claim and describe only the creator workflow or verified product facts.",
    },
    {
        id: "scarcity",
        severity: "block",
        test: /\b(only \d+ left|ends tonight|last chance)\b/i,
        label: "Scarcity or deadline language detected.",
        safer: "Remove it unless the exact claim is verified as current.",
    },
    {
        id: "unrealistic",
        severity: "block",
        test: /\b(life[- ]changing|miracle|magic|effortless|no effort|overnight|transform your life|works every time|will fix|solves everything|game changer)\b/i,
        label: "Unrealistic expectation language detected.",
        safer: "Describe one verified thing the product is designed to do instead of promising a transformation.",
    },
    {
        id: "comparison",
        severity: "review",
        test: /\b(better than|beats|superior to|versus|vs\.)\b/i,
        label: "Promotional comparison language detected.",
        safer: "Remove the competitor comparison and describe the promoted product's verified features on their own.",
    },
    {
        id: "authority",
        severity: "review",
        test: /\b(as seen on|official partner|endorsed by|certified by|FDA[- ]approved|patented|award[- ]winning)\b/i,
        label: "Endorsement, certification, or award claim detected.",
        safer: "Remove it unless you can verify the exact claim for this exact product.",
    },
    {
        id: "ip",
        severity: "review",
        test: /\b(lyrics|song by|soundtrack|movie clip|trademark|™|®)\b/i,
        label: "Possible third-party or trademarked content referenced.",
        safer: "Use only sounds, footage, and wording you have the right to use.",
    },
];

/* Splits the verified-features box into lines, then keeps or drops each
   line WHOLE. Returns what survived and a plain-language reason for each
   line that did not, so nothing disappears silently. */
function cleanFeatureClauses(text) {
    const raw = String(text || "");
    const lines = raw
        .replace(/([.!?])\s+/g, "$1\n")
        .split(/[\n;]+/)
        .map((part) => part.replace(/\s{2,}/g, " ").trim())
        .filter(Boolean);
    const kept = [];
    const removed = [];
    lines.forEach((line) => {
        const { masked } = maskProtectedWordings(line);
        const hit = RISK_RULES.find((rule) => rule.severity === "block" && rule.test.test(masked));
        if (hit) {
            removed.push({ text: line.replace(/[.]+$/, ""), ruleId: hit.id, reason: hit.label });
            return;
        }
        kept.push(line.replace(/[.]+$/, "").trim());
    });
    return { kept, removed };
}

/* Kept for every existing caller. Returns only the wording that is safe
   to put in front of viewers. */
function safeFeatureText(text) {
    return cleanFeatureClauses(text).kept.join("\n");
}

function correctKnownProductNames(text) {
    return String(text || "")
        .replace(/\bhollayland\b/gi, "Hollyland")
        .replace(/\bhollyland\s+lark\s+a1\b/gi, "Hollyland LARK A1");
}
function normalizeProductName(text) {
    return correctKnownProductNames(text).trim();
}
function namesLookLikeSameProduct(previous, next) {
    const left = String(previous || "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
    const right = String(next || "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
    if (!left || !right)
        return false;
    const previousNumbers = String(previous || "").match(/\d+/g) || [];
    const nextNumbers = String(next || "").match(/\d+/g) || [];
    if (previousNumbers.length && nextNumbers.length && previousNumbers.join("|") !== nextNumbers.join("|"))
        return false;
    if (left.includes(right) || right.includes(left))
        return true;
    const previousWords = new Set(String(previous || "").toLowerCase().match(/[a-z0-9]+/g) || []);
    const nextWords = new Set(String(next || "").toLowerCase().match(/[a-z0-9]+/g) || []);
    const union = new Set([...previousWords, ...nextWords]);
    const overlap = [...previousWords].filter((word) => nextWords.has(word)).length;
    if (union.size && overlap / union.size >= 0.6)
        return true;
    const rows = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
        let diagonal = rows[0];
        rows[0] = leftIndex;
        for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
            const above = rows[rightIndex];
            rows[rightIndex] = left[leftIndex - 1] === right[rightIndex - 1]
                ? diagonal
                : Math.min(diagonal, rows[rightIndex - 1], above) + 1;
            diagonal = above;
        }
    }
    return rows[right.length] <= Math.max(2, Math.floor(Math.max(left.length, right.length) * 0.2));
}
function splitVerifiedFeatures(text) {
    return String(text || "")
        .split(/[\n.;]+/)
        .map((part) => part.trim())
        .filter(Boolean);
}
function featurePriority(text) {
    const value = String(text || "").toLowerCase();
    if (/\b(rechargeable battery|battery-powered|battery powered|cordless)\b/.test(value))
        return -50;
    if (/\b(lightning|noise cancellation|noise canceling|noise cancelling|charging case|compact|foldable|carrying case)\b/.test(value))
        return 50;
    if (/\b(compatible|connector|microphone|transmitter|receiver|wireless|range|adapter|mount|magnetic|brightness|usb-c)\b/.test(value))
        return 25;
    return 10;
}
function rankVerifiedFeatures(features) {
    return (features || [])
        .map((text, index) => ({ text, index, priority: featurePriority(text) }))
        .sort((a, b) => b.priority - a.priority || a.index - b.index)
        .map((item) => item.text);
}
function hookWorthyFeatures(features) {
    const ranked = rankVerifiedFeatures(features);
    const stronger = ranked.filter((text) => featurePriority(text) >= 10);
    return stronger.length ? stronger : [];
}
function naturalFeatureText(text) {
    const value = String(text || "").trim().replace(/[.]+$/, "");
    if (!value)
        return "";
    return /^[A-Z]{2,}(?:\b|-)/.test(value)
        ? value
        : value.charAt(0).toLowerCase() + value.slice(1);
}
function timelineMarks(duration) {
    const total = [7, 10, 15].includes(Number(duration)) ? Number(duration) : 15;
    return [
        0,
        Math.max(2, Math.round(total * 0.18)),
        Math.round(total * 0.48),
        Math.round(total * 0.76),
        total,
    ];
}
function spokenScriptLines(product, feature, hook, cta) {
    const detail = naturalFeatureText(feature);
    const hookMentionsProduct = String(hook || "").toLowerCase().includes(String(product || "").toLowerCase());
    return [
        correctKnownProductNames(hook),
        hookMentionsProduct ? (detail ? `Designed with ${detail}.` : "Here it is in one take.") : `Meet ${product}.`,
        detail ? (hookMentionsProduct ? "Watch it in use." : `Designed with ${detail}.`) : "Watch the hands-on demo.",
        cta,
    ];
}
function platformDestination(platform) {
    if (platform === "YouTube Shorts") return {
        target: "the channel profile",
        caption: "Follow for more gadget reviews. My TikTok is linked on my channel profile.",
        prompt: "a follow-or-channel-profile call to action with no cart or product-link wording",
        checklist: "☐ YouTube Short: growth-only mode; channel profile points to TikTok; no cart, product-link, or Amazon CTA yet",
        hashtags: "#ad #YouTubeShorts #GadgetReview #ProductDemo #DoneRite",
    };
    if (platform === "Pinterest") return {
        target: "the product page",
        caption: "Product details are available through the product page.",
        prompt: "a product-page call to action",
        checklist: "☐ Pinterest: vertical format, destination link checked, affiliate disclosure included",
        hashtags: "#ad #PinterestFinds #GadgetReview #ProductDemo #DoneRite",
    };
    if (platform === "Facebook" || platform === "Instagram Reels") return {
        target: "the product link",
        caption: "Product details are available through the product link.",
        prompt: "a product-link call to action",
        checklist: `☐ ${platform}: vertical format, product link checked, paid-partnership or affiliate disclosure enabled when required`,
        hashtags: platform === "Instagram Reels"
            ? "#ad #InstagramReels #GadgetReview #ProductDemo #DoneRite"
            : "#ad #FacebookReels #GadgetReview #ProductDemo #DoneRite",
    };
    return {
        target: "the cart",
        caption: "Product details are available in the cart.",
        prompt: "a cart-directed call to action",
        checklist: "☐ TikTok Shop: 9:16, product link/cart selected, content disclosure enabled",
        hashtags: "#ad #TikTokShop #GadgetFinds #ProductDemo #DoneRite",
    };
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

const MIN_CONTENT_GAP_SEARCHES = 1000;
function parseContentGapSearchCount(value) {
    const line = String(value || "").replace(/,/g, " ").replace(/\s+/g, " ").trim();
    const compact = line.match(/(?:^|\s)(\d+(?:\.\d+)?)\s*([KkMm])\b/);
    if (compact) {
        const number = Number(compact[1]);
        if (!Number.isFinite(number)) return 0;
        return Math.round(number * (compact[2].toLowerCase() === "m" ? 1000000 : 1000));
    }
    const labelled = line.match(/(?:^|\s)(\d{1,3}(?:[ ,]\d{3})+)\s*(?:searches?|views?)\b/i);
    return labelled ? Number(labelled[1].replace(/\D/g, "")) : 0;
}
function cleanContentGapPhrase(value) {
    return String(value || "")
        .replace(/[|•●■►]+/g, " ")
        .replace(/^\s*\d+[.)]\s*/, "")
        .replace(/^\s*(?:content gap|creator search insights?|all searches?|searches?)\s*[:\-–—]*\s*/i, "")
        .replace(/\s+\d+(?:[.,]\d+)?\s*[KMB]?\s*(?:views?|searches?|posts?|videos?|%)\b.*$/i, "")
        .replace(/\s+(?:0|O)\s*(?:C(?:om|m)?|BC|B6|Cm|Com|om)\b.*$/i, "")
        .replace(/\s+[Y¥]{1,2}\s*C\s*$/i, "")
        .replace(/[¥€£©®™]+/g, " ")
        .replace(/^[\s,;:.\-–—_[\]{}]+|[\s,;:.\-–—_[\]{}]+$/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
function isContentGapPhraseJunk(value) {
    const phrase = cleanContentGapPhrase(value);
    const lower = phrase.toLowerCase();
    if (!phrase || phrase.length < 5 || phrase.length > 110) return true;
    if ((phrase.match(/[A-Za-z]{2,}/g) || []).length < 2) return true;
    if (/^(content gap|creator search insights?|search insights?|all searches?|search|inspiration|analytics|recommended|followers?|following|friends?|profile|home|shop|inbox|videos?|posts?|views?|likes?|comments?|shares?|high|medium|low|all|filter|filters|back|done|cancel|today|yesterday|last 7 days|last 30 days)$/i.test(phrase)) return true;
    if (/\b(all searches?|creator search insights?|content gap|high % gap|search popularity)\b/i.test(phrase)) return true;
    if (/^\d+(?:[.,]\d+)?\s*(?:[KMB]|%|searches?|views?)?$/i.test(phrase)) return true;
    if (/[¥€£©®™]|\uFFFD/.test(value) || /\b(?:wifi|battery|gmt)\b/i.test(lower)) return true;
    return false;
}
function contentGapPhrasesFromText(text) {
    const lines = String(text || "").split(/\r?\n/).map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
    const found = [];
    for (let index = 0; index < lines.length; index += 1) {
        const searches = parseContentGapSearchCount(lines[index]);
        if (searches < MIN_CONTENT_GAP_SEARCHES) continue;
        let phrase = "";
        for (let distance = 1; distance <= 3 && !phrase; distance += 1) {
            const candidate = cleanContentGapPhrase(lines[index - distance] || "");
            if (!isContentGapPhraseJunk(candidate) && !parseContentGapSearchCount(candidate)) phrase = candidate;
        }
        for (let distance = 1; distance <= 2 && !phrase; distance += 1) {
            const candidate = cleanContentGapPhrase(lines[index + distance] || "");
            if (!isContentGapPhraseJunk(candidate) && !parseContentGapSearchCount(candidate)) phrase = candidate;
        }
        if (phrase) found.push({ phrase, searches, rawMetric: lines[index] });
    }
    const best = new Map();
    found.forEach((item) => {
        const key = item.phrase.toLowerCase();
        if (!best.has(key) || best.get(key).searches < item.searches) best.set(key, item);
    });
    return [...best.values()].sort((a, b) => b.searches - a.searches).slice(0, 20);
}
function sanitizeContentGapRows(rows) {
    const seen = new Set();
    const cleaned = [];
    (Array.isArray(rows) ? rows : []).forEach((row) => {
        if (!row || typeof row !== "object") return;
        const phrase = cleanContentGapPhrase(row.phrase);
        const source = String(row.source || "").toLowerCase();
        const note = String(row.note || "").toLowerCase();
        const searches = Number(row.searches || 0);
        const key = phrase.toLowerCase();
        if (isContentGapPhraseJunk(phrase) || seen.has(key)) return;
        seen.add(key);
        cleaned.push({
            ...row,
            phrase,
            searches: searches || undefined,
            needsSearchCountReview: (!searches && (source.includes("screenshot") || note.includes("imported from screenshot"))) || undefined,
        });
    });
    return cleaned;
}
function voiceoverSegments(spokenLines, duration) {
    const lines = (spokenLines || []).map((line) => String(line || "").trim()).filter(Boolean);
    const total = [7, 10, 15].includes(Number(duration)) ? Number(duration) : 15;
    const groups = total <= 7
        ? [[lines[0], lines[1]], [lines[2], lines[3]]]
        : total <= 10
            ? [[lines[0]], [lines[1], lines[2]], [lines[3]]]
            : lines.map((line) => [line]);
    const tones = [
        { tone: "curious", direction: "Curious discovery — lift the hook slightly." },
        { tone: "sincere", direction: "Sincere and helpful — warm, natural pace." },
        { tone: "confident", direction: "Confident demonstration — clear, never pushy." },
        { tone: "confident", direction: "Friendly CTA — let the final words land." },
    ];
    return groups.map((group, index) => {
        const start = Math.round((total * index) / groups.length * 10) / 10;
        const end = Math.round((total * (index + 1)) / groups.length * 10) / 10;
        return {
            id: `vo-${index + 1}`,
            label: `Voiceover ${index + 1} of ${groups.length}`,
            text: group.filter(Boolean).join(" "),
            start,
            end,
            tone: tones[index].tone,
            direction: tones[index].direction,
        };
    }).filter((item) => item.text);
}
function normalizeRestoredForm(value) {
    const restored = value && typeof value === "object" ? { ...EMPTY_FORM, ...value } : { ...EMPTY_FORM };
    restored.productName = normalizeProductName(restored.productName);
    restored.duration = ["7", "10", "15"].includes(String(restored.duration)) ? String(restored.duration) : "15";
    restored.searchPhrase = isContentGapPhraseJunk(restored.searchPhrase) ? "" : cleanContentGapPhrase(restored.searchPhrase);
    return restored;
}
function scanCompliance(text, form = {}) {
    const source = String(text || "");
    const { masked } = maskProtectedWordings(source);
    const issues = [];
    const add = (id, severity, label, safer) => {
        if (!issues.some((item) => item.id === id))
            issues.push({ id, severity, label, safer });
    };
    // Every wording rule comes from the single shared list, so the checker
    // and the cleaner can never disagree again.
    RISK_RULES.forEach((rule) => {
        if (rule.test.test(masked))
            add(rule.id, rule.severity, rule.label, rule.safer);
    });
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
function makePackage(rawForm) {
    // Older saved records and partial backups can be missing fields
    // entirely. Fill the gaps first so generating never throws.
    const form = { ...EMPTY_FORM, ...(rawForm && typeof rawForm === "object" ? rawForm : {}) };
    form.productName = String(form.productName || "");
    form.verifiedFeatures = String(form.verifiedFeatures || "");
    form.searchPhrase = String(form.searchPhrase || "");
    form.platform = CTA_LIBRARY.some((item) => item.platforms.indexOf(form.platform) !== -1) ? form.platform : "TikTok Shop";
    form.duration = ["7", "10", "15"].includes(String(form.duration)) ? String(form.duration) : "15";
    const product = normalizeProductName(form.productName);
    const cleanResult = cleanFeatureClauses(form.verifiedFeatures);
    const cleaned = cleanResult.kept.join("\n");
    const features = rankVerifiedFeatures(splitVerifiedFeatures(cleaned));
    const hookFeatures = hookWorthyFeatures(features);
    const feature = hookFeatures[0] || "";
    const displayFeature = naturalFeatureText(feature) || "the hands-on setup";
    const inHand = form.acquisition === "sample" || form.acquisition === "purchased";
    const planning = !inHand;
    const issues = scanCompliance(`${product}\n${form.verifiedFeatures}`, form);
    if (cleanResult.removed.length) {
        issues.unshift({
            id: "rewritten",
            severity: "review",
            label: `${cleanResult.removed.length} verified-feature line${cleanResult.removed.length === 1 ? " was" : "s were"} left out of this script: ${cleanResult.removed.map((item) => `“${item.text}” (${item.reason.replace(/\.$/, "").toLowerCase()})`).join("; ")}`,
            safer: "Reword those lines using only what the product physically is or does, then generate again.",
        });
    }
    const prefix = planning ? "PLANNING DRAFT — SAMPLE NOT CONFIRMED\n\n" : "";
    let hooks = pickHooks(product, features, form.platform, form.hookWinners || [], form.hookSpin || 0);
    if (form.chosenHook) {
        const chosenHook = correctKnownProductNames(form.chosenHook);
        hooks = [chosenHook].concat(hooks.filter((h) => h !== chosenHook)).slice(0, 3);
    }
    const pattern = pickPattern(form.platform, form.chosenPattern, form.hookSpin || 0);
    const destination = platformDestination(form.platform);
    const availableCtas = ctaOptions(form.platform);
    const cta = availableCtas.some((item) => item.text === form.chosenCta) ? form.chosenCta : availableCtas[0].text;
    const spokenLines = spokenScriptLines(product, feature, hooks[0], cta);
    const voiceover = `${prefix}${spokenLines.join(" ")}`;
    const voiceovers = voiceoverSegments(spokenLines, form.duration);
    const searchPhrase = String(form.searchPhrase || "").trim();
    const marks = timelineMarks(form.duration);
    const onScreenText = [
        `${marks[0]}–${marks[1]}s: ${searchPhrase ? searchPhrase.toUpperCase() : hooks[0].toUpperCase()}`,
        `${marks[1]}–${marks[2]}s: ${product.toUpperCase()}`,
        `${marks[2]}–${marks[3]}s: ${displayFeature.toUpperCase()}`,
        `${marks[3]}–${marks[4]}s: ${cta.toUpperCase()}`,
    ].join("\n");
    const caption = `${planning ? "Planning draft: " : ""}${searchPhrase ? searchPhrase + ". " : ""}A closer look at ${product} and the verified features it was designed around. ${destination.caption}`;
    const hashtags = destination.hashtags;
    const thumbnail = searchPhrase ? searchPhrase.toUpperCase() : "WORTH A CLOSER LOOK?";
    const shotList = buildShotList(pattern, product, feature, form.duration, spokenLines, form.platform);
    const aiImagePrompt = `Create a vertical 9:16 hands-on visual for ${product}. Hands may hold, open, or operate the product. Use a black, chrome, and electric-blue DONE RITE technology style. Show the product, the hands using it, and a clean feature-focused environment. No face, no head, no shoulders, no price, discount badge, competitor branding, unsupported specification, or added product claim.`;
    const aiVideoPrompt = `Create a ${form.duration}-second vertical 9:16 hands-on ${form.funnel} demo video for ${product}, shot in the "${pattern.name}" pattern. Hands enter frame and operate the product; the camera stays above or beside the hands so no face, head, or shoulders are visible. Keep the product moving — continuous hand motion, not a slideshow of stills. Use subtle electric-blue lighting, readable safe-zone text, and ${destination.prompt}. No face, price, discount, false scarcity, competitor comparison, medical claim, absolute claim, or invented specification. Use only these verified details: ${cleaned || "No verified feature supplied; keep the presentation generic."}`;
    const crossPlatform = [
        "☐ Watch it back: no face, head, or shoulders in any frame",
        "☐ Watch it back: the product is moving throughout — no static slideshow section",
        destination.checklist,
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
        form: { ...form, productName: product, verifiedFeatures: cleaned },
        hooks,
        selectedHook: hooks[0],
        voiceover,
        voiceovers,
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
        removedFeatureLines: cleanResult.removed,
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

  // --- Conversation starters (added Aug 2026 from the supplied Hook Library
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
  { angle: "Detail", platforms: ["TikTok Shop", "YouTube Shorts", "Facebook"], make: (p, f) => `This is the detail to look at on ${p}.` },
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
  // Demonstrations make product utility easier to see. These openers make sense if
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
function pickHooks(product, features, platform, winners, spin) {
  const ranked = rankVerifiedFeatures(features);
  const hookFeatures = hookWorthyFeatures(ranked);
  const lowPriority = ranked.filter((text) => featurePriority(text) < 0).map((text) => text.toLowerCase());
  const proven = (winners || [])
    .filter((w) => !w.platform || w.platform === platform)
    .map((w) => w.text)
    .filter((text) => !lowPriority.some((detail) => String(text || "").toLowerCase().includes(detail)))
    .slice(0, 2);

  const pool = HOOK_LIBRARY.filter((h) => h.platforms.indexOf(platform) !== -1);
  const usable = pool.length ? pool : HOOK_LIBRARY;
  const byAngle = {};
  usable.forEach((h) => {
    const usesFeature = h.make(product, "__DETAIL__").includes("__DETAIL__");
    if (!hookFeatures.length && usesFeature) return;
    if (!byAngle[h.angle]) byAngle[h.angle] = [];
    byAngle[h.angle].push(h);
  });
  const angles = Object.keys(byAngle);
  const out = proven.slice();
  let attempts = 0;
  while (out.length < 3 && attempts < Math.max(angles.length * 4, 12)) {
    const angle = angles[(spin + attempts) % angles.length];
    const bucket = byAngle[angle];
    const choice = bucket[(spin + attempts * 7) % bucket.length];
    const detail = hookFeatures.length
      ? naturalFeatureText(hookFeatures[(spin + out.length + attempts) % hookFeatures.length])
      : "";
    const text = choice.make(product, detail);
    if (out.indexOf(text) === -1) out.push(text);
    attempts += 1;
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
  { style: "Direct", platforms: ["TikTok Shop"], text: "More product details are in the orange cart." },
  { style: "Informed", platforms: ["TikTok Shop"], text: "Check the specs in the cart before you decide." },
  { style: "Informed", platforms: ["TikTok Shop"], text: "Read the listing in the cart and see if it fits your setup." },
  { style: "Low pressure", platforms: ["TikTok Shop"], text: "Have a look at the details in the cart. No rush." },
  { style: "Low pressure", platforms: ["TikTok Shop"], text: "The cart has the rest. Decide for yourself." },
  { style: "Qualifying", platforms: ["TikTok Shop"], text: "If that matches what you need, the cart has the full listing." },
  { style: "Qualifying", platforms: ["TikTok Shop"], text: "Not for everyone. If it is for you, the details are in the cart." },

  // YouTube Shorts — growth-only until the channel product-link route is ready.
  { style: "Follow", platforms: ["YouTube Shorts"], text: "Follow for more gadget reviews." },
  { style: "Profile", platforms: ["YouTube Shorts"], text: "My TikTok is linked on my channel profile." },
  { style: "Subscribe", platforms: ["YouTube Shorts"], text: "Subscribe for more hands-on gadget demos." },
  { style: "Profile", platforms: ["YouTube Shorts"], text: "More gadget content is linked on my channel profile." },

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
  { style: "Demo-linked", platforms: ["TikTok Shop"], text: "The demonstration is complete. Full specifications are in the cart." },
  { style: "Demo-linked", platforms: ["YouTube Shorts"], text: "That is it in real use. Subscribe for more gadget demos." },
  { style: "Demo-linked", platforms: ["Instagram Reels", "Facebook"], text: "You saw what it does. The listing has the rest." },
  { style: "Demo-linked", platforms: ["Pinterest"], text: "Save this demo. The product page has the full spec." },
];

/* Every hook the library can produce for a given platform, already filled in
   with this product and feature — used to populate the Quick Create dropdown. */
function hookOptions(product, features, platform) {
  const pool = HOOK_LIBRARY.filter((h) => h.platforms.indexOf(platform) !== -1);
  const usable = pool.length ? pool : HOOK_LIBRARY;
  const hookFeatures = hookWorthyFeatures(features);
  const seen = {};
  const out = [];
  let detailIndex = 0;
  usable.forEach((h) => {
    const usesFeature = h.make(product, "__DETAIL__").includes("__DETAIL__");
    if (usesFeature && !hookFeatures.length) return;
    const detail = usesFeature
      ? naturalFeatureText(hookFeatures[detailIndex++ % hookFeatures.length])
      : "";
    const text = h.make(product, detail);
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
    finding: "Demonstrations make utility clearer",
    detail: "Showing the product in use can help viewers understand its function quickly without requiring a face on camera.",
    soWhat: "The shot patterns below keep hands in frame and the head out.",
  },
  {
    finding: "Motion can hold attention",
    detail: "A clear product demonstration may be easier to follow than a sequence of still images.",
    soWhat: "Use continuous hand motion when the product can be demonstrated safely and honestly.",
  },
  {
    finding: "Show utility early",
    detail: "Opening with the product's verified use can help viewers understand the video quickly.",
    soWhat: "The patterns open with the product already visible or in use.",
  },
  {
    finding: "Faceless content can show the product clearly",
    detail: "A face is not required to demonstrate a gadget's verified features or use.",
    soWhat: "Hands-only framing keeps the 5StarGadgetGuru identity while focusing on the product.",
  },
  {
    finding: "Quality matters more than flooding the feed",
    detail: "A smaller number of clear, accurate product demonstrations is easier to evaluate than many rushed posts.",
    soWhat: "Track each hook and result, then improve the next test.",
  },
  {
    finding: "Tutorials and demos explain the product",
    detail: "Unboxing and in-use footage can show verified features without relying on unsupported promises.",
    soWhat: "Use the Unbox to use or Problem to demo pattern when it fits the product.",
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
    why: "A demonstration can make the product's verified function easier to understand.",
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
      { label: "STRAIGHT TO USE", hands: `Hands go directly into using it. Show ${f} in use.` },
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
    why: "Showing one verified feature clearly can be easier to follow than listing several at once.",
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
function buildShotList(pattern, product, feature, duration, spokenLines, platform) {
  const marks = timelineMarks(duration);
  const displayFeature = naturalFeatureText(feature) || "the selected verified detail";
  const beats = pattern.beats(product, displayFeature);
  const destination = platformDestination(platform).target;
  const rows = beats.map((beat, index) => [
    `${marks[index]}–${marks[index + 1]}s  ${beat.label}`,
    `   HANDS: ${String(beat.hands || "").replace(/\bthe cart\b/gi, destination)}`,
    `   SAY:   ${spokenLines[index] || ""}`,
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
        // Some phones never answer at all for an unsupported file: no details,
        // no error, nothing. Without this timer the checker span forever.
        let settled = false;
        const cleanUp = () => {
            settled = true;
            window.clearTimeout(watchdog);
            try { video.removeAttribute("src"); video.load(); }
            catch { }
            URL.revokeObjectURL(url);
        };
        const finish = (value) => { if (settled) return; cleanUp(); resolve(value); };
        const fail = (message) => { if (settled) return; cleanUp(); reject(new Error(message)); };
        const watchdog = window.setTimeout(() => fail("This video took too long to open on this phone. It is usually an unsupported file type — export it again as MP4 (H.264) and try once more."), 25000);
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
            finish({
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
    if (info.motionScore === null || info.motionScore === undefined) {
        add("review", "Movement could not be measured on this device.", "This phone would not let the checker read the picture. Shape and text checks above are still valid — watch the clip back yourself and confirm the product keeps moving.");
    }
    else if (info.motionScore < 2.5) {
        add("review", "Almost no movement — this may read as a static slideshow.", "Consider re-shooting with your hands operating the product so its verified use is clear.");
    }
    else if (info.motionScore < 8) {
        add("review", "Only slight movement between frames.", "Keep the hands working for the full clip. A still section in the middle is where viewers drop.");
    }
    else {
        add("ok", "Continuous motion confirmed — this reads as a hands-on demo.", "This matches your hands-in-frame, no-face format.");
    }
    // This reminder used to sit inside the motion block, so it vanished on
    // exactly the phones that could not check the picture. It is now always shown.
    add("review", "Faces cannot be detected automatically.", "Watch the clip back once and confirm no face, head, shoulders, or reflection appears in any frame.");
    return flags;
}
/* Common feature wordings, grouped by category. These are prompts, not facts —
   nothing here is true of a product until you have looked at the product and
   confirmed it. Deliberately plain: no performance, health, or quality claims. */
const FEATURE_LIBRARY = {
    "Electronics & Gadgets": ["Lightning-compatible connector", "Noise cancellation", "Charging case included", "Compact design", "Foldable design", "Carrying case included", "USB-C charging", "Multiple brightness settings", "Magnetic base", "Built-in LED indicator", "Cordless", "Rechargeable battery"],
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
    const productContextNameRef = useRef(null);
    const resultsRef = useRef(null);
    const clickerRef = useRef(null);
    const boomerRef = useRef(null); // lightning strike for feature chips
    const metalRef = useRef(null); // metal latch for checkboxes
    const [gapRows, setGapRows] = useState([]);
    const [gapDraft, setGapDraft] = useState(EMPTY_GAP);
    const [gapScanBusy, setGapScanBusy] = useState(false);
    const [gapScanProgress, setGapScanProgress] = useState(0);
    const [gapScanStatus, setGapScanStatus] = useState("");
    const [gapScanResults, setGapScanResults] = useState([]);
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
            const candidates = [];
            const addCandidate = (key, raw) => {
                if (!raw)
                    return;
                try {
                    const parsed = JSON.parse(raw);
                    const value = parsed && typeof parsed === "object" && !Array.isArray(parsed)
                        ? (parsed.state && typeof parsed.state === "object" ? parsed.state : parsed.data && typeof parsed.data === "object" ? parsed.data : parsed)
                        : parsed;
                    const data = Array.isArray(value) ? { quickCreateHistory: value } : value;
                    if (!data || typeof data !== "object")
                        return;
                    const looksLikeCreatorData = ["saved", "savedPackages", "creations", "products", "productVault", "quickCreateHistory", "history", "gapRows", "contentGapRows", "contentGaps", "hookLog"].some((field) => Array.isArray(data[field]))
                        || (data.form && typeof data.form === "object" && data.form.productName);
                    if (looksLikeCreatorData)
                        candidates.push({ key, data });
                }
                catch { }
            };
            addCandidate(STORAGE_KEY, localStorage.getItem(STORAGE_KEY));
            addCandidate(PRODUCT_HISTORY_KEY, localStorage.getItem(PRODUCT_HISTORY_KEY));
            for (let index = 0; index < localStorage.length; index += 1) {
                const key = localStorage.key(index);
                if (!key || key === STORAGE_KEY || key === PRODUCT_HISTORY_KEY)
                    continue;
                addCandidate(key, localStorage.getItem(key));
            }
            const primary = candidates.find((item) => item.key === STORAGE_KEY);
            const sources = primary ? [primary, ...candidates.filter((item) => item !== primary)] : candidates;
            const mergeRecords = (fields, keyFor) => {
                const out = [];
                const seen = new Set();
                sources.forEach(({ data }) => {
                    const records = fields.flatMap((field) => Array.isArray(data[field]) ? data[field] : []);
                    records.forEach((item, index) => {
                        if (!item || typeof item !== "object")
                            return;
                        const normalized = item.productName ? item : {
                            ...item,
                            productName: item.name || item.product || item.productTitle || (item.form && item.form.productName) || "",
                            verifiedFeatures: item.verifiedFeatures || item.features || (item.form && item.form.verifiedFeatures) || "",
                            category: item.category || (item.form && item.form.category),
                        };
                        const key = String(keyFor(normalized, index) || "").toLowerCase();
                        if (!key || seen.has(key))
                            return;
                        seen.add(key);
                        out.push(normalized);
                    });
                });
                return out;
            };
            const savedRecovered = mergeRecords(["saved", "savedPackages", "creations"], (item, index) => item.id || `${item.productName || ""}|${item.createdAt || index}`);
            const productsRecovered = mergeRecords(["products", "productVault", "productRows"], (item, index) => item.productName || item.id || index);
            const historyRecovered = mergeRecords(["quickCreateHistory", "history", "productHistory"], (item, index) => item.productName || item.id || index);
            const gapsRecovered = mergeRecords(["gapRows", "contentGapRows", "contentGaps"], (item, index) => item.phrase || item.searchPhrase || item.id || index)
                .map((item) => item.phrase ? item : { ...item, phrase: item.searchPhrase || item.query || item.text || "" });
            const hooksRecovered = mergeRecords(["hookLog"], (item, index) => item.id || `${item.text || ""}|${index}`);
            const inferredProducts = [...productsRecovered];
            [...savedRecovered, ...historyRecovered].forEach((item) => {
                const name = String(item.productName || "").trim();
                if (!name || inferredProducts.some((product) => String(product.productName || "").trim().toLowerCase() === name.toLowerCase())) return;
                inferredProducts.push({ id: item.id || uid(), productName: name, category: item.category || "Electronics & Gadgets", verifiedFeatures: item.verifiedFeatures || "", acquisition: item.acquisition || "none", sampleReceived: !!item.sampleReceived, status: "Recovered", updatedAt: item.updatedAt || item.createdAt || new Date().toISOString() });
            });
            const chosen = sources.map((item) => item.data).find((data) =>
                (data.form && data.form.productName)
                || (Array.isArray(data.products) && data.products.length)
                || (Array.isArray(data.saved) && data.saved.length)
                || (Array.isArray(data.quickCreateHistory) && data.quickCreateHistory.length)
            ) || (sources[0] && sources[0].data);
            if (sources.length) {
                setSaved(savedRecovered);
                setProducts(inferredProducts);
                setQuickCreateHistory(historyRecovered);
                if (chosen && chosen.form && typeof chosen.form === "object")
                    setForm(normalizeRestoredForm(chosen.form));
                setTasks(chosen && Array.isArray(chosen.tasks) ? chosen.tasks : DEFAULT_TASKS);
                setMoneyRows(chosen && Array.isArray(chosen.moneyRows) ? chosen.moneyRows : []);
                const lastTab = (() => { try { return localStorage.getItem(LAST_TAB_KEY); } catch { return null; } })()
                    || (chosen && chosen.lastTab);
                if (lastTab)
                    setTab(lastTab);
                if (chosen && typeof chosen.clickSound === "boolean")
                    setClickSound(chosen.clickSound);
                setHookLog(hooksRecovered);
                setGapRows(sanitizeContentGapRows(gapsRecovered));
                if (chosen && typeof chosen.hookSpin === "number")
                    setHookSpin(chosen.hookSpin);
                if (candidates.some((item) => item.key !== STORAGE_KEY)
                    && (inferredProducts.length || savedRecovered.length || historyRecovered.length || gapsRecovered.length))
                    setImportStatus("Previous Creator OS product history was found and recovered.");
            }
        }
        catch {
            setImportStatus("Saved data could not be read. Open Settings and use Restore Backup if you exported one.");
        }
        finally {
            setReady(true);
        }
    }, []);
    useEffect(() => {
        if (ready && productContextNameRef.current === null)
            productContextNameRef.current = String(form.productName || "").trim();
    }, [ready]);
    useEffect(() => {
        if (!ready)
            return;
        try {
            const historyMirror = {
                version: 1,
                updatedAt: new Date().toISOString(),
                products: products.map((item) => ({
                    id: item.id,
                    productName: item.productName,
                    category: item.category,
                    verifiedFeatures: item.verifiedFeatures,
                    acquisition: item.acquisition,
                    sampleReceived: item.sampleReceived,
                    updatedAt: item.updatedAt,
                })),
                quickCreateHistory,
                form: {
                    productName: form.productName,
                    category: form.category,
                    verifiedFeatures: form.verifiedFeatures,
                    acquisition: form.acquisition,
                    sampleReceived: form.sampleReceived,
                    updatedAt: new Date().toISOString(),
                },
            };
            localStorage.setItem(PRODUCT_HISTORY_KEY, JSON.stringify(historyMirror));
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ saved, products, quickCreateHistory, form: normalizeRestoredForm(form), tasks, moneyRows, gapRows: sanitizeContentGapRows(gapRows), lastTab: localStorage.getItem(LAST_TAB_KEY) || tab, clickSound, hookLog, hookSpin, version: 1 }));
            setSaveBlocked("");
        }
        catch (error) {
            const full = String(error && error.name) === "QuotaExceededError";
            setSaveBlocked(full
                ? "This device is out of storage space, so new changes are not being saved. Go to Settings and download a backup now, then delete some saved packages."
                : "This browser is not allowing anything to be saved on this device. Your work is still on screen, but it will disappear if you close this page. Go to Settings and download a backup now. Private browsing mode is the usual cause.");
        }
    }, [ready, saved, products, quickCreateHistory, form, tasks, moneyRows, gapRows, clickSound, hookLog, hookSpin]);
    // Which tab you were on is one short word. It used to live in the big
    // save, so every single tab tap rewrote every saved package on the phone.
    // It now has its own tiny slot and the big save leaves it alone.
    useEffect(() => {
        if (!ready)
            return;
        try { localStorage.setItem(LAST_TAB_KEY, tab); }
        catch { }
    }, [ready, tab]);
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
        const rankedGaps = sanitizeContentGapRows(gapRows)
            .filter((item) => Number(item.searches || 0) >= MIN_CONTENT_GAP_SEARCHES)
            .map((item) => {
                const words = String(item.phrase || "").toLowerCase().match(/[a-z0-9]+/g) || [];
                const hits = words.filter((word) => word.length > 2 && !stopWords.has(word) && productWords.has(word)).length;
                return { phrase: item.phrase, searches: Number(item.searches || 0), score: hits + (item.category === draft.category ? 0.25 : 0) };
            })
            .sort((a, b) => b.score - a.score || Number(b.searches || 0) - Number(a.searches || 0));
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
        const productName = normalizeProductName(form.productName) || "this product";
        const features = rankVerifiedFeatures(splitVerifiedFeatures(safeFeatureText(form.verifiedFeatures)));
        return hookOptions(productName, features, form.platform);
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
    const clearProductSpecificFields = (current, productName = "") => ({
        ...current,
        productName,
        verifiedFeatures: "",
        searchPhrase: "",
        chosenHook: "",
        chosenCta: "",
        chosenPattern: "",
        batteryPowered: false,
    });
    const startNewProduct = () => {
        productContextNameRef.current = "";
        setForm((current) => clearProductSpecificFields(current));
        setPkg(null);
        setNeedsName(false);
        setCopyStatus("Ready for a new product. Previous verified features were cleared.");
        window.setTimeout(() => { var _a; return (_a = nameRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 0);
    };
    const changeProductName = (value) => {
        const nextName = String(value || "");
        const contextName = String(productContextNameRef.current === null ? form.productName : productContextNameRef.current).trim();
        const clearlyNew = !nextName.trim()
            || (contextName && nextName.trim().length >= 3 && !namesLookLikeSameProduct(contextName, nextName));
        setNeedsName(!nextName.trim());
        if (clearlyNew) {
            productContextNameRef.current = nextName.trim();
            if (form.verifiedFeatures || form.searchPhrase)
                setCopyStatus("New product detected. Previous verified features and search phrase were cleared.");
        }
        setForm((current) => clearlyNew
            ? clearProductSpecificFields(current, nextName)
            : { ...current, productName: nextName });
    };
    const rememberQuickCreateProduct = (draft = form) => {
        const name = String(draft.productName || "").trim();
        if (!name)
            return;
        productContextNameRef.current = name;
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
        const correctedForm = { ...form, productName: normalizeProductName(form.productName) };
        const effectiveForm = correctedForm.searchPhrase.trim()
            ? correctedForm
            : { ...correctedForm, searchPhrase: buildTargetPhraseChoices(correctedForm)[0] || "" };
        productContextNameRef.current = effectiveForm.productName.trim();
        if (effectiveForm.searchPhrase !== form.searchPhrase || effectiveForm.productName !== form.productName)
            setForm(effectiveForm);
        rememberQuickCreateProduct(effectiveForm);
        // Rotate the hook angles and hand the generator any proven winners.
        const spin = hookSpin + 1;
        setHookSpin(spin);
        const winners = hookLog.filter((entry) => entry.winner);
        const next = makePackage({ ...effectiveForm, hookWinners: winners, hookSpin: spin });
        setPkg(next);
        try {
            localStorage.setItem(VOICEOVER_QUEUE_KEY, JSON.stringify({ version: 1, productName: next.productName, duration: next.form.duration, createdAt: next.createdAt, segments: next.voiceovers }));
        }
        catch { }
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
    const selectGeneratedHook = (hook) => {
        if (!pkg || !hook)
            return;
        const hookOptions = [...pkg.hooks];
        const chosenForm = { ...pkg.form, chosenHook: hook };
        const rebuilt = makePackage(chosenForm);
        const next = {
            ...rebuilt,
            id: pkg.id,
            createdAt: pkg.createdAt,
            hooks: hookOptions,
            selectedHook: hook,
        };
        setForm((current) => ({ ...current, chosenHook: hook }));
        setPkg(next);
        try {
            localStorage.setItem(VOICEOVER_QUEUE_KEY, JSON.stringify({ version: 1, productName: next.productName, duration: next.form.duration, createdAt: next.createdAt, segments: next.voiceovers }));
        }
        catch { }
        const number = hookOptions.findIndex((item) => item === hook) + 1;
        setCopyStatus(`Hook ${number} selected. Script and voiceover queue updated.`);
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
    const scanContentGapImages = async (fileList) => {
        const files = Array.from(fileList || []).filter((file) => String(file && file.type || "").startsWith("image/"));
        if (!files.length) {
            setGapScanStatus("Choose one or more screenshots or photos.");
            return;
        }
        setGapScanBusy(true);
        setGapScanResults([]);
        setGapScanProgress(0.02);
        setGapScanStatus(`Preparing ${files.length} screenshot${files.length === 1 ? "" : "s"}…`);
        let worker = null;
        let currentIndex = 0;
        let failedImages = 0;
        const detected = [];
        const detectedKeys = new Set();
        try {
            const Tesseract = await loadGapOcrLibrary();
            worker = await Tesseract.createWorker("eng", 1, {
                logger: (message) => {
                    if (message.status === "recognizing text") {
                        const imageProgress = Number(message.progress || 0);
                        const overall = (currentIndex + imageProgress) / files.length;
                        setGapScanProgress(0.05 + overall * 0.93);
                        setGapScanStatus(`Reading screenshot ${currentIndex + 1} of ${files.length}… ${Math.round(imageProgress * 100)}%`);
                    }
                },
            });
            for (currentIndex = 0; currentIndex < files.length; currentIndex += 1) {
                setGapScanStatus(`Reading screenshot ${currentIndex + 1} of ${files.length}…`);
                try {
                    const result = await worker.recognize(files[currentIndex]);
                    const ocrText = String((result && result.data && result.data.text) || "").trim();
                    contentGapPhrasesFromText(ocrText).forEach((item) => {
                        const key = item.phrase.toLowerCase();
                        if (detectedKeys.has(key))
                            return;
                        detectedKeys.add(key);
                        detected.push(item);
                    });
                }
                catch {
                    failedImages += 1;
                }
                setGapScanProgress(0.05 + ((currentIndex + 1) / files.length) * 0.93);
            }
            if (detected.length) {
                setGapScanResults(detected.map((item) => ({ ...item, phrase: cleanContentGapPhrase(item.phrase), id: uid() })));
                const failureNote = failedImages ? ` ${failedImages} image${failedImages === 1 ? "" : "s"} could not be read.` : "";
                setGapScanStatus(`${files.length} screenshot${files.length === 1 ? "" : "s"} processed. ${detected.length} qualified phrase${detected.length === 1 ? "" : "s"} found.${failureNote} Check every word below before saving. All images were discarded.`);
                setCopyStatus("Screenshot reading finished. Review the detected wording before saving.");
            }
            else {
                const failureNote = failedImages ? ` ${failedImages} image${failedImages === 1 ? "" : "s"} could not be read.` : "";
                setGapScanStatus(`No trustworthy 1,000+ search phrases were found.${failureNote} Try tighter screenshots that show each phrase and its search count together. Nothing was saved, and all images were discarded.`);
            }
            setGapScanProgress(1);
        }
        catch (error) {
            setGapScanStatus((error && error.message) || "The screenshots could not be read. Try sharper images while connected to the internet.");
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
    const saveReviewedGapResults = () => {
        const reviewed = gapScanResults
            .map((item) => ({ ...item, phrase: cleanContentGapPhrase(item.phrase) }))
            .filter((item) => item.searches >= MIN_CONTENT_GAP_SEARCHES && !isContentGapPhraseJunk(item.phrase));
        if (!reviewed.length) {
            setCopyStatus("No valid reviewed phrases are ready to save.");
            return;
        }
        const createdAt = new Date().toISOString();
        setGapRows((current) => sanitizeContentGapRows([
            ...reviewed.map((item) => ({
                phrase: item.phrase,
                searches: item.searches,
                searchVolumeLabel: item.searches >= 1000000 ? `${Number((item.searches / 1000000).toFixed(1))}M` : `${Number((item.searches / 1000).toFixed(1))}K`,
                rawMetric: item.rawMetric,
                category: gapDraft.category,
                gapLevel: gapDraft.gapLevel,
                note: `Reviewed screenshot import · ${item.searches.toLocaleString()} searches`,
                id: uid(),
                status: "queued",
                source: "qualified screenshot import",
                createdAt,
            })),
            ...current,
        ]));
        setGapScanResults([]);
        setGapScanStatus(`${reviewed.length} reviewed phrase${reviewed.length === 1 ? "" : "s"} saved to Content Gap.`);
        setCopyStatus("Reviewed Content Gap phrases saved.");
    };
    const backupPayload = () => ({ version: 1, exportedAt: new Date().toISOString(), appBuild: APP_BUILD, saved, products, quickCreateHistory, form: normalizeRestoredForm(form), tasks, moneyRows, gapRows: sanitizeContentGapRows(gapRows), hookLog, hookSpin, lastTab: tab, clickSound });
    const exportBackup = () => {
        try {
            const text = JSON.stringify(backupPayload(), null, 2);
            const blob = new Blob([text], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `done-rite-backup-${new Date().toISOString().slice(0, 10)}.json`;
            link.rel = "noopener";
            // Safari on iPhone ignores a link that is not in the page, and
            // cancels the download if the address is thrown away straight
            // after the tap. So: put it in the page, tap it, clean up later.
            link.style.position = "fixed";
            link.style.opacity = "0";
            document.body.appendChild(link);
            link.click();
            window.setTimeout(() => {
                try { document.body.removeChild(link); }
                catch { }
                URL.revokeObjectURL(url);
            }, 4000);
            setImportStatus("Backup downloaded. Check the Files app or your Downloads. If nothing arrived, use Copy Backup Text instead.");
        }
        catch {
            setImportStatus("The download would not start on this device. Use Copy Backup Text instead and paste it somewhere safe.");
        }
    };
    // Guaranteed way off the phone when a Home Screen app blocks downloads.
    const copyBackupText = async () => {
        const ok = await copyText(JSON.stringify(backupPayload(), null, 2));
        setImportStatus(ok
            ? "Backup copied. Paste it into Notes, an email to yourself, or a file in Google Drive and keep it somewhere you can find it."
            : "Copy was blocked. Try Export Backup instead.");
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
                setForm(normalizeRestoredForm(data.form));
            setTasks(Array.isArray(data.tasks) ? data.tasks : DEFAULT_TASKS);
            setMoneyRows(Array.isArray(data.moneyRows) ? data.moneyRows : []);
            setGapRows(sanitizeContentGapRows(data.gapRows));
            if (Array.isArray(data.hookLog))
                setHookLog(data.hookLog);
            setImportStatus("Backup restored successfully.");
        }
        catch {
            setImportStatus("That file is not a valid DONE RITE backup.");
        }
    };
    const sections = pkg ? [
        ...(pkg.shotList ? [["Shot list — hands in frame, no face", pkg.shotList]] : []),
        ["Voiceover", pkg.voiceover],
        ...(pkg.voiceovers && pkg.voiceovers.length ? [["Voiceover recording queue", pkg.voiceovers.map((item) => `${item.label} · ${item.start}–${item.end}s · ${item.direction}\n${item.text}`).join("\n\n")]] : []),
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
        ["tools", "Creator Tools"],
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
                                if (event.target.value === "__new__") {
                                    startNewProduct();
                                    return;
                                }
                                const entry = productHistory.find((item) => item.key === event.target.value);
                                if (!entry)
                                    return;
                                const found = entry.source;
                                productContextNameRef.current = entry.name;
                                setForm((current) => {
                                    const loaded = {
                                        ...current,
                                        productName: entry.name,
                                        category: found.category || current.category,
                                        verifiedFeatures: String(found.verifiedFeatures || ""),
                                        searchPhrase: "",
                                        acquisition: found.acquisition || (found.sampleReceived ? "sample" : current.acquisition),
                                    };
                                    return { ...loaded, searchPhrase: buildTargetPhraseChoices(loaded)[0] || "" };
                                });
                                setCopyStatus(`Loaded ${entry.name}.`);
                            } },
                            React.createElement("option", { value: "" }, "Choose a saved product"),
                            React.createElement("option", { value: "__new__" }, "New product — clear old features"),
                            productHistory.map((item) => (React.createElement("option", { key: item.key, value: item.key }, item.name)))))),
                    React.createElement(Field, { label: "Product name" },
                        React.createElement("input", { ref: nameRef, className: "dr-input", style: needsName ? { borderColor: COLORS.red } : undefined, value: form.productName, onChange: (event) => changeProductName(event.target.value), onBlur: () => rememberQuickCreateProduct(), placeholder: "Example: rechargeable work light" })),
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
                    React.createElement(Field, { label: "Pick a call to action", help: `${ctaChoices.length} written specifically for ${form.platform}. No urgency or price language.` },
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
                    React.createElement(Card, null,
                        React.createElement("h3", null, "Choose the Hook Used in Your Script"),
                        React.createElement("p", { className: "dr-help" }, "Tap any suggestion. The script, opening text, shot timing, saved package, and teleprompter queue update immediately."),
                        React.createElement("div", { className: "dr-hook-options" }, pkg.hooks.map((hook, index) => {
                            const selected = hook === (pkg.selectedHook || pkg.hooks[0]);
                            return React.createElement("button", { key: hook, className: "dr-hook-choice", type: "button", "aria-pressed": selected, onClick: () => selectGeneratedHook(hook) },
                                React.createElement("strong", null, selected ? `✓ Hook ${index + 1}` : `Hook ${index + 1}`),
                                hook);
                        }))),
                    React.createElement(Card, null,
                        React.createElement("h3", null, `Record ${pkg.voiceovers && pkg.voiceovers.length || 1} voiceover part${pkg.voiceovers && pkg.voiceovers.length === 1 ? "" : "s"}`),
                        React.createElement("p", { className: "dr-help" }, "Every part of this script is loaded into one teleprompter dropdown with its delivery tone and time window."),
                        React.createElement("a", { className: "dr-button", href: "./teleprompter.html", style: { display: "block", textAlign: "center", textDecoration: "none", marginTop: 12 } }, "Open Voiceover Queue")),
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
                    React.createElement("p", { className: "dr-help" }, "Upload TikTok Creator Search Insights screenshots. Creator OS now saves only phrases it can pair with a visible search count of 1,000 or more. Labels, broken symbols, percentages, and other OCR junk are discarded."),
                    React.createElement("div", { className: "dr-output", style: { marginTop: 12 } }, [
                        "1. Open TikTok, go to your profile",
                        "2. Creator Tools → Creator Search Insights",
                        "   (on some builds it sits under Settings instead)",
                        "3. Choose Content Gap",
                        "4. Filter to High % Gap",
                        "5. Take all needed screenshots, then select and upload them together",
                    ].join("\n")),
                    React.createElement("p", { className: "dr-help", style: { marginTop: 12 } }, "Keep each phrase and its search count visible in the same screenshot. The first scan needs internet to load the on-device reader. Images are discarded after reading.")),

                React.createElement(Card, null,
                    React.createElement("h3", null, "Upload Content Gap Screenshots"),
                    React.createElement("div", { className: "dr-upload-box", style: { marginTop: 12 } },
                        React.createElement("input", { ref: gapImageRef, type: "file", accept: "image/*", multiple: true, hidden: true, onChange: (event) => scanContentGapImages(event.target.files) }),
                        React.createElement("button", { className: "dr-button", type: "button", disabled: gapScanBusy, onClick: () => gapImageRef.current && gapImageRef.current.click() }, gapScanBusy ? "Reading Screenshots…" : "Choose Screenshots or Take Photos"),
                        gapScanBusy && React.createElement("div", { className: "dr-progress", style: { marginTop: 12 } }, React.createElement("span", { style: { width: `${Math.round(gapScanProgress * 100)}%` } })),
                        gapScanStatus && React.createElement("p", { className: "dr-help", role: "status", style: { marginBottom: 0, color: gapScanProgress === 1 ? COLORS.green : COLORS.chrome } }, gapScanStatus)),
                    gapScanResults.length > 0 && React.createElement("div", { className: "dr-review-list" },
                        React.createElement("h3", null, "Detected Phrases — Review Before Saving"),
                        React.createElement("p", { className: "dr-help", style: { color: COLORS.amber, margin: 0 } }, "These are not saved yet. Correct any OCR spelling or discard the phrase."),
                        gapScanResults.map((item) => React.createElement("div", { className: "dr-review-item", key: item.id },
                            React.createElement("div", { className: "dr-review-top" },
                                React.createElement("span", { className: "dr-pill" }, `${item.searches.toLocaleString()} searches`),
                                React.createElement("button", { className: "dr-danger", type: "button", onClick: () => setGapScanResults((current) => current.filter((row) => row.id !== item.id)) }, "Discard")),
                            React.createElement("input", { className: "dr-input", value: item.phrase, onChange: (event) => setGapScanResults((current) => current.map((row) => row.id === item.id ? { ...row, phrase: event.target.value } : row)), "aria-label": "Review detected Content Gap phrase" }))),
                        React.createElement("div", { className: "dr-review-actions" },
                            React.createElement("button", { className: "dr-button", type: "button", onClick: saveReviewedGapResults }, "Save Reviewed"),
                            React.createElement("button", { className: "dr-danger", type: "button", onClick: () => { setGapScanResults([]); setGapScanStatus("Detected phrases discarded. Nothing was saved."); } }, "Discard All")))),

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
                        const phrase = cleanContentGapPhrase(gapDraft.phrase);
                        if (!phrase) { setCopyStatus("Type the search phrase first."); return; }
                        if (isContentGapPhraseJunk(phrase)) { setCopyStatus("That looks like a label or broken OCR text. Type only the exact search phrase."); return; }
                        setGapRows((current) => sanitizeContentGapRows([{ ...gapDraft, phrase, note: gapDraft.note.trim(), id: uid(), status: "queued", source: "manual", createdAt: new Date().toISOString() }, ...current]));
                        setGapDraft({ ...EMPTY_GAP, category: gapDraft.category, gapLevel: gapDraft.gapLevel });
                        setCopyStatus("Phrase logged.");
                    } }, "Log This Phrase")),

                React.createElement(Card, null,
                    React.createElement("div", { className: "dr-output-head" },
                        React.createElement("h3", null, "Queue"),
                        React.createElement("span", { className: "dr-pill" }, `${gapRows.filter((r) => r.status !== "filmed").length} waiting`)),
                    React.createElement("button", { className: "dr-copy", type: "button", style: { width: "100%", marginBottom: 12 }, onClick: () => {
                        const cleaned = sanitizeContentGapRows(gapRows);
                        const removed = gapRows.length - cleaned.length;
                        setGapRows(cleaned);
                        if (form.searchPhrase && isContentGapPhraseJunk(form.searchPhrase)) setValue("searchPhrase", "");
                        setCopyStatus(removed ? `${removed} bad or duplicate Content Gap row${removed === 1 ? "" : "s"} removed.` : "Content Gap queue is already clean.");
                    } }, "Clean Bad Imported Rows"),
                    React.createElement("p", { className: "dr-help" }, "Products you already own are matched by keyword. A match is a suggestion, not a verdict — you decide whether the phrase honestly describes the product."),
                    React.createElement("div", { className: "dr-list", style: { marginTop: 12 } },
                        gapRows.length === 0 && React.createElement("p", { className: "dr-help" }, "Nothing logged yet. Open Creator Search Insights and bring back five phrases."),
                        gapRows.map((row) => {
                            const matches = matchProducts(row.phrase, products);
                            const filmed = row.status === "filmed";
                            return React.createElement("div", { className: "dr-item", key: row.id, style: { flexDirection: "column", alignItems: "stretch", opacity: filmed ? 0.55 : 1 } },
                                React.createElement("div", { className: "dr-item-title", style: { color: filmed ? COLORS.dim : row.gapLevel === "High" ? COLORS.green : COLORS.chrome, textDecoration: filmed ? "line-through" : "none" } }, row.phrase),
                                React.createElement("div", { className: "dr-help", style: { marginTop: 4 } }, `${row.gapLevel} gap · ${row.category}${row.searchVolumeLabel ? " · " + row.searchVolumeLabel + " searches" : ""}${row.note ? " · " + row.note : ""}`),
                                React.createElement("div", { className: "dr-help", style: { marginTop: 8, color: matches.length ? COLORS.blueGlow : COLORS.amber } },
                                    matches.length
                                        ? `Possible match: ${matches.map((m) => m.product.productName).join(", ")}`
                                        : "No product in your vault matches this. Worth requesting a sample, or skip it."),
                                React.createElement("details", { className: "dr-gap-menu" },
                                    React.createElement("summary", null, "Actions"),
                                    React.createElement("div", { className: "dr-gap-actions" },
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
                                    React.createElement("button", { className: "dr-danger", type: "button", onClick: () => {
                                        if (window.confirm("Remove this Content Gap phrase?")) setGapRows((c) => c.filter((x) => x.id !== row.id));
                                    } }, "Remove"))));
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
            tab === "tools" && (React.createElement(React.Fragment, null,
                React.createElement(Card, null,
                    React.createElement("h2", null, "Creator Tools"),
                    React.createElement("p", { className: "dr-help" }, "Record voiceovers, practice delivery, preview clips, and import Content Gap screenshots from one place.")),
                React.createElement(Card, null,
                    React.createElement("h3", null, "Teleprompter & Voice Coach"),
                    React.createElement("p", { className: "dr-help" }, "Hear synthesized tone examples, practice without pressure, record with the iPhone or Hollyland LARK A1, and automatically organize reusable recordings in your searchable Voiceover Library."),
                    React.createElement("a", { className: "dr-button", href: "./teleprompter.html", style: { display: "block", textAlign: "center", textDecoration: "none", marginTop: 14 } }, "Open Teleprompter & Voice Coach")),
                React.createElement(Card, null,
                    React.createElement("h3", null, "Video Upload & Clip Preview"),
                    React.createElement("p", { className: "dr-help" }, "Select and preview several original product clips, copy the ad brief, and prepare files to send for complete editing."),
                    React.createElement("a", { className: "dr-button", href: "./video-upload.html", style: { display: "block", textAlign: "center", textDecoration: "none", marginTop: 14 } }, "Open Video Uploader")),
                React.createElement(Card, null,
                    React.createElement("h3", null, "Content Gap Screenshot Import"),
                    React.createElement("p", { className: "dr-help" }, "Import several Creator Search Insights screenshots while preserving manually entered Content Gap data."),
                    React.createElement("a", { className: "dr-button", href: "./content-gap-import.html", style: { display: "block", textAlign: "center", textDecoration: "none", marginTop: 14 } }, "Open Screenshot Importer")))),
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
                    React.createElement("p", { className: "dr-help" }, "Backups include saved packages, products, Quick Create history, tasks, money records, hook results, settings, and cleaned Content Gap phrases. Screenshot images are never saved."),
                    React.createElement("div", { className: "dr-row", style: { marginTop: 14 } },
                        React.createElement("button", { className: "dr-button", type: "button", onClick: exportBackup }, "Export Backup"),
                        React.createElement("button", { className: "dr-copy", type: "button", onClick: () => { var _a; return (_a = importRef.current) === null || _a === void 0 ? void 0 : _a.click(); } }, "Restore Backup"),
                        React.createElement("button", { className: "dr-copy", type: "button", onClick: copyBackupText }, "Copy Backup Text")),
                    React.createElement("input", { ref: importRef, type: "file", accept: "application/json,.json", hidden: true, onChange: (event) => { var _a; return importBackup((_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0]); } }),
                    importStatus && React.createElement("p", { className: "dr-help", style: { color: COLORS.green } }, importStatus)),
                React.createElement(Card, null,
                    React.createElement("h3", null, "Permanent Playbook Rules"),
                    React.createElement("div", { className: "dr-output", style: { marginTop: 10 } }, "No pricing or discount language. No competitor comparisons. No unsupported claims. Health content uses support language only. Every affiliate hashtag set includes #ad. Hands-on demo by default \u2014 hands in frame, face never in frame, product moving throughout. Confirm Sample Received before publish-ready first-person content.")),
                React.createElement(Card, null,
                    React.createElement("h3", null, "App Status"),
                    React.createElement("p", { className: "dr-help" }, `Clean build ${APP_BUILD} · ${products.length} product${products.length === 1 ? "" : "s"} · ${saved.length} saved creation${saved.length === 1 ? "" : "s"} · ${gapRows.length} Content Gap phrase${gapRows.length === 1 ? "" : "s"}.`))))),
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
