"use strict";
"use client";
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
    batteryPowered: false,
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
  .dr-danger { background:transparent; color:${COLORS.red}; }
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
  .dr-check input { width:20px; height:20px; margin:0; accent-color:${COLORS.blue}; flex:0 0 auto; }
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
        .replace(/\b(guaranteed|instantly|instant|100%|perfect|never fails)\b/gi, "designed to")
        .replace(/\b(cure|cures|treat|treats|prevent|prevents|heal|heals|reverse|reverses|fix|fixes)\b/gi, "support")
        .replace(/\s{2,}/g, " ")
        .trim();
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
    if (/\b(cure|treat|prevent|heal|reverse|disease|weight loss|lose weight)\b/i.test(source)) {
        add("health", "block", "Health or medical claim detected.", "Use accurate support language and remove disease, treatment, and outcome claims.");
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
    if (form.sampleReceived === false) {
        add("sample", "review", "Sample Received is not confirmed.", "Keep this as a planning draft and avoid first-person experience claims.");
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
    const feature = cleaned.split(/[\n.;]/).map((part) => part.trim()).filter(Boolean)[0] || "support a simpler everyday routine";
    const planning = !form.sampleReceived;
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
    const hooks = [
        `A simpler way to ${feature}—without overcomplicating it.`,
        `Before you add another gadget, look at what ${product} is designed to do.`,
        `${product}: built around ${feature}.`,
    ];
    const voiceover = `${prefix}Looking for a simple way to ${feature}? ${product} is designed around that job, with a product-focused setup that is easy to show in a short demo. Check the product details in the cart.`;
    const onScreenText = [
        "0–2s: WORTH A CLOSER LOOK?",
        `2–6s: ${product.toUpperCase()}`,
        `6–11s: DESIGNED TO ${feature.toUpperCase()}`,
        `11–${form.duration}s: CHECK PRODUCT DETAILS`,
    ].join("\n");
    const caption = `${planning ? "Planning draft: " : ""}A closer look at ${product} and the verified features it was designed around. Product details are available in the cart.`;
    const hashtags = "#ad #TikTokShop #GadgetFinds #ProductDemo #DoneRite";
    const cta = "Check the product details in the cart.";
    const thumbnail = "WORTH A CLOSER LOOK?";
    const aiImagePrompt = `Create a vertical 9:16 product-image-only visual for ${product}. Use a black, chrome, and electric-blue DONE RITE technology style. Show only the product and a clean feature-focused environment. No person, face, hands, price, discount badge, competitor branding, unsupported specification, or added product claim.`;
    const aiVideoPrompt = `Create a ${form.duration}-second vertical 9:16 product-image-only ${form.funnel} video for ${product}. Use three to five clean product shots, subtle electric-blue lighting, readable safe-zone text, and one cart-directed CTA. No face, hands, price, discount, false scarcity, competitor comparison, medical claim, absolute claim, or invented specification. Use only these verified details: ${cleaned || "No verified feature supplied; keep the presentation generic."}`;
    const crossPlatform = [
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
        aiImagePrompt,
        aiVideoPrompt,
        crossPlatform,
        complianceNote,
        issues,
        publishReady: form.sampleReceived && !issues.some((item) => item.severity === "block"),
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
function Card({ children, className = "" }) {
    return React.createElement("section", { className: `dr-card ${className}` }, children);
}
function Field({ label, children, help }) {
    return (React.createElement("div", { className: "dr-field" },
        React.createElement("label", { className: "dr-label" }, label),
        children,
        help ? React.createElement("div", { className: "dr-help", style: { marginTop: 6 } }, help) : null));
}
function OutputCard({ title, text, onCopy }) {
    return (React.createElement(Card, null,
        React.createElement("div", { className: "dr-output-head" },
            React.createElement("h3", null, title),
            React.createElement("button", { className: "dr-copy", type: "button", onClick: () => onCopy(text, title) }, "Copy")),
        React.createElement("div", { className: "dr-output" }, text)));
}
function DoneRiteCreatorOS() {
    const [tab, setTab] = useState("home");
    const [ready, setReady] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [pkg, setPkg] = useState(null);
    const [saved, setSaved] = useState([]);
    const [products, setProducts] = useState([]);
    const [tasks, setTasks] = useState(DEFAULT_TASKS);
    const [moneyRows, setMoneyRows] = useState([]);
    const [moneyForm, setMoneyForm] = useState(EMPTY_MONEY);
    const [search, setSearch] = useState("");
    const [checkText, setCheckText] = useState("");
    const [copyStatus, setCopyStatus] = useState("");
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
                setTasks(Array.isArray(data.tasks) ? data.tasks : DEFAULT_TASKS);
                setMoneyRows(Array.isArray(data.moneyRows) ? data.moneyRows : []);
                if (data.lastTab)
                    setTab(data.lastTab);
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
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ saved, products, tasks, moneyRows, lastTab: tab, version: 1 }));
            setSaveBlocked("");
        }
        catch (error) {
            const full = String(error && error.name) === "QuotaExceededError";
            setSaveBlocked(full
                ? "This device is out of storage space, so new changes are not being saved. Go to Settings and download a backup now, then delete some saved packages."
                : "This browser is not allowing anything to be saved on this device. Your work is still on screen, but it will disappear if you close this page. Go to Settings and download a backup now. Private browsing mode is the usual cause.");
        }
    }, [ready, saved, products, tasks, moneyRows, tab]);
    useEffect(() => {
        if (!copyStatus)
            return undefined;
        const timer = window.setTimeout(() => setCopyStatus(""), 3500);
        return () => window.clearTimeout(timer);
    }, [copyStatus]);
    const complianceResults = useMemo(() => scanCompliance(checkText), [checkText]);
    const filteredSaved = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q)
            return saved;
        return saved.filter((item) => flattenScript(item).toLowerCase().includes(q));
    }, [saved, search]);
    const revenue = moneyRows.filter((row) => row.type !== "Expense").reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const expenses = moneyRows.filter((row) => row.type === "Expense").reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const completedTasks = tasks.filter((task) => task.done).length;
    const sampleCount = products.filter((product) => product.sampleReceived).length;
    const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const notifyCopy = async (text, label) => {
        const ok = await copyText(text);
        setCopyStatus(ok ? `${label} copied.` : "Copy was blocked. Press and hold the text, then choose Select All and Copy.");
    };
    const generate = () => {
        if (!form.productName.trim()) {
            setCopyStatus("Enter the product name first.");
            return;
        }
        const next = makePackage(form);
        setPkg(next);
        setProducts((current) => {
            const existing = current.find((item) => item.productName.toLowerCase() === form.productName.trim().toLowerCase());
            const record = {
                id: (existing === null || existing === void 0 ? void 0 : existing.id) || uid(),
                productName: form.productName.trim(),
                category: form.category,
                verifiedFeatures: safeFeatureText(form.verifiedFeatures),
                sampleReceived: form.sampleReceived,
                status: form.sampleReceived ? "Ready to create" : "Waiting for sample",
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
    const exportBackup = () => {
        const backup = { version: 1, exportedAt: new Date().toISOString(), saved, products, tasks, moneyRows };
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
            setTasks(Array.isArray(data.tasks) ? data.tasks : DEFAULT_TASKS);
            setMoneyRows(Array.isArray(data.moneyRows) ? data.moneyRows : []);
            setImportStatus("Backup restored successfully.");
        }
        catch {
            setImportStatus("That file is not a valid DONE RITE backup.");
        }
    };
    const sections = pkg ? [
        ["Hooks", pkg.hooks.map((hook, index) => `${index + 1}. ${hook}`).join("\n")],
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
                    React.createElement(Field, { label: "Product name" },
                        React.createElement("input", { className: "dr-input", value: form.productName, onChange: (event) => setValue("productName", event.target.value), placeholder: "Example: rechargeable work light" })),
                    React.createElement(Field, { label: "Category" },
                        React.createElement("select", { className: "dr-select", value: form.category, onChange: (event) => setValue("category", event.target.value) }, CATEGORIES.map((category) => React.createElement("option", { key: category }, category)))),
                    React.createElement(Field, { label: "Verified features", help: "Do not paste seller hype, prices, discounts, unsupported specifications, or medical claims." },
                        React.createElement("textarea", { className: "dr-textarea", value: form.verifiedFeatures, onChange: (event) => setValue("verifiedFeatures", event.target.value), placeholder: "One verified feature per line" })),
                    React.createElement("div", { className: "dr-row" },
                        React.createElement(Field, { label: "Funnel" },
                            React.createElement("select", { className: "dr-select", value: form.funnel, onChange: (event) => setValue("funnel", event.target.value) },
                                React.createElement("option", null, "BOF"),
                                React.createElement("option", null, "TOF"))),
                        React.createElement(Field, { label: "Duration" },
                            React.createElement("select", { className: "dr-select", value: form.duration, onChange: (event) => setValue("duration", event.target.value) },
                                React.createElement("option", null, "7"),
                                React.createElement("option", null, "10"),
                                React.createElement("option", null, "15"),
                                React.createElement("option", null, "20"),
                                React.createElement("option", null, "30")))),
                    React.createElement("div", { className: "dr-field" },
                        React.createElement("label", { className: "dr-check" },
                            React.createElement("input", { type: "checkbox", checked: form.sampleReceived, onChange: (event) => setValue("sampleReceived", event.target.checked) }),
                            React.createElement("span", null, "I have received this sample. If unchecked, the output stays a planning draft."))),
                    React.createElement("div", { className: "dr-field" },
                        React.createElement("label", { className: "dr-check" },
                            React.createElement("input", { type: "checkbox", checked: form.batteryPowered, onChange: (event) => setValue("batteryPowered", event.target.checked) }),
                            React.createElement("span", null, "This product is electrical or battery-powered."))),
                    React.createElement("button", { className: "dr-button", type: "button", onClick: generate }, "Generate Content Package")),
                pkg && (React.createElement(React.Fragment, null,
                    React.createElement(Card, { className: pkg.publishReady ? "dr-clear" : "dr-flag" },
                        React.createElement("div", { className: "dr-output-head" },
                            React.createElement("div", null,
                                React.createElement("h3", null, pkg.publishReady ? "Automated check passed" : "Review before publishing"),
                                React.createElement("div", { className: "dr-help" }, "Automated checks cannot verify seller facts or current platform eligibility.")),
                            React.createElement("span", { className: "dr-pill" },
                                pkg.form.funnel,
                                " \u00B7 ",
                                pkg.form.duration,
                                "s")),
                        React.createElement("div", { className: "dr-row" },
                            React.createElement("button", { className: "dr-button", type: "button", onClick: () => notifyCopy(flattenScript(pkg), "Everything") }, "Copy Everything"),
                            React.createElement("button", { className: "dr-copy", type: "button", onClick: () => notifyCopy(pkg.aiVideoPrompt, "AI prompt") }, "Copy AI Prompt"),
                            React.createElement("button", { className: "dr-copy", type: "button", onClick: savePackage }, "Save Package"))),
                    sections.map(([title, text]) => React.createElement(OutputCard, { key: title, title: title, text: text, onCopy: notifyCopy })))))),
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
                                React.createElement("span", { className: "dr-pill" }, product.sampleReceived ? "Sample received" : "Waiting for sample"))),
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
                            React.createElement("button", { className: "dr-copy", type: "button", onClick: () => notifyCopy(flattenScript(item), item.productName) }, "Copy"),
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
                    React.createElement("h2", null, "Backup & Restore"),
                    React.createElement("p", { className: "dr-help" }, "This component stores data on the current device. Export regular backups before clearing browser data or changing devices."),
                    React.createElement("div", { className: "dr-row", style: { marginTop: 14 } },
                        React.createElement("button", { className: "dr-button", type: "button", onClick: exportBackup }, "Export Backup"),
                        React.createElement("button", { className: "dr-copy", type: "button", onClick: () => { var _a; return (_a = importRef.current) === null || _a === void 0 ? void 0 : _a.click(); } }, "Restore Backup")),
                    React.createElement("input", { ref: importRef, type: "file", accept: "application/json,.json", hidden: true, onChange: (event) => { var _a; return importBackup((_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0]); } }),
                    importStatus && React.createElement("p", { className: "dr-help", style: { color: COLORS.green } }, importStatus)),
                React.createElement(Card, null,
                    React.createElement("h3", null, "Permanent Playbook Rules"),
                    React.createElement("div", { className: "dr-output", style: { marginTop: 10 } }, "No pricing or discount language. No competitor comparisons. No unsupported claims. Health content uses support language only. Every affiliate hashtag set includes #ad. Product-image-only by default. Confirm Sample Received before publish-ready first-person content.")),
                React.createElement(Card, null,
                    React.createElement("h3", null, "Implementation note for Claude"),
                    React.createElement("p", { className: "dr-help" }, "This is the single-file local-first baseline. Preserve its data schema and working copy flow when splitting it into modules. A complete installable PWA still needs a project manifest, service worker, icons, and deployment configuration outside this component."))))),
        React.createElement("nav", { className: "dr-nav", "aria-label": "Bottom navigation" },
            React.createElement("div", { className: "dr-nav-inner" }, tabs.map(([id, label]) => React.createElement("button", { key: id, type: "button", "aria-current": tab === id ? "page" : undefined, onClick: () => setTab(id) }, label))))));
}
