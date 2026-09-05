# DONE RITE Creator OS — Shared Chat Sync Status

Updated: 2026-09-05

## Purpose

This file is the shared coordination point for every ChatGPT/Claude conversation working on DONE RITE Creator OS.

**Before making any repository change, every chat must read this file and then re-check the current remote `main` branch.**

The repository is the source of truth. Conversation memory is not.

Repository: `imdamannow711-ui/creator-os`
Default branch: `main`
Primary device: iPhone 13 / Safari / Home Screen PWA
Live app: `https://imdamannow711-ui.github.io/creator-os/`
One-Click editor: `https://imdamannow711-ui.github.io/creator-os/one-click-ad-dev.html`

---

## MULTI-CHAT RULES

1. **Always fetch current `main` before editing.**
2. **Read the newest commits since the last chat's known commit.**
3. **Compare current `main` against the last commit you personally touched.**
4. **Do not assume another chat has not changed the same file.**
5. **Do not overwrite unrelated work from another chat.**
6. **Make the smallest targeted change possible.**
7. **After changing a file, re-fetch that exact file from remote `main`.**
8. **Report the exact commit SHA, files changed, and rollback point.**
9. **Do not call iPhone behavior verified unless the user has actually tested it.**
10. **If another chat changed `main` while you were working, stop and reconcile before pushing anything else.**

---

## CURRENT REPOSITORY STATE

At the time this coordination file was created, the latest known `main` head was:

`4757223c13e0f248a1d6d22a55bde283b22e96fd`

Recent work from other chats includes:

- iPhone finished-video download/save fixes
- PR #5 isolated iPhone Safari harness work
- cached PR #5 module compatibility work
- `app.js` restructuring
- `index.html` restructuring
- One-Click browser executor changes
- One-Click test page changes
- service-worker changes
- new shared content-library module
- new dashboard stylesheet
- vendored offline React file

Because other chats are active, **this SHA is only a checkpoint, not a permanent build tag. Always fetch `main` again before editing.**

---

## CURRENT ONE-CLICK / SCRIPT STUDIO STATUS

The intended connected workflow remains:

**One-Click project → ONE CLICK SCRIPT STUDIO → Teleprompter → voiceover → Gap Remover → record/select video → One-Click editor → creative controls → render/export**

Important standing requirements:

- Original clip audio gain stays at 1 unless the user explicitly requests otherwise.
- Separate voiceover gain stays at 1 unless the user explicitly requests otherwise.
- SFX must not duck or lower the original voice.
- No automatic normalization/compression/pitch/speed alteration of the user's recorded voice.
- Manual trims should persist when the same local file is reselected.
- Trimming one clip must not remove untouched selected cuts.
- Do not pretend semantic product/action recognition is live; current browser analysis is not full semantic vision.
- If required footage is missing, use **RECORD MISSING CLIP** rather than forcing a weak edit.

---

## SERVICE WORKER / CACHE EXPECTATION

The desired service-worker behavior is:

- network first for same-origin GET requests
- `fetch(request, { cache: "no-store" })` or equivalent fresh-fetch behavior
- CacheStorage fallback only after network failure
- `index.html` fallback only for navigation requests
- scripts/modules must never receive HTML as a fallback
- cache only full `200` responses, not `206 Partial Content`
- One-Click, Script Studio, Teleprompter companion flow, and required One-Click modules should be available through the offline cache

Before changing `sw.js`, read the current remote version first. Do not assume the cache name or precache list in this file is still current.

---

## COMPLIANCE STATUS — OPEN REVIEW ITEM

Current known `app.js` contains:

- `safeFeatureText()`
- `scanCompliance()`
- `makePackage()` using cleaned verified-feature text for generated content

However, the exact historical functions:

- `blockingRuleFor`
- `isSafeForViewers`

were not found in the latest checked `main`.

**Do not automatically re-add them.** First determine whether they were intentionally replaced by the current `safeFeatureText()` + `scanCompliance()` system or accidentally lost.

No compliance regression should be introduced while resolving this.

Standing content rules include:

- no prices/discounts/cheapest/lowest-price claims
- no unsupported scarcity
- no absolute claims such as guaranteed/instantly/100%
- no cure/treat/prevent/heal disease claims
- no unsupported competitor comparisons
- no before/after outcome implications
- no income promises
- `#ad` in affiliate hashtag sets
- regulated categories require extra review

---

## STORAGE / SAVE STATUS — OPEN REVIEW ITEM

One-Click session autosave historically uses debounced localStorage writes.

The main dashboard `app.js` was last observed writing its primary state directly from a React effect rather than through an explicit debounce.

Do not change this merely because it differs from One-Click. First determine whether it is causing a real problem or is an intentional design choice.

Preserve all current storage keys and IndexedDB data unless a tested migration is explicitly approved.

---

## TELEPROMPTER MICROPHONE RULE

The Teleprompter does **not** need microphone permission merely to display or speak a script.

- Text display / speech synthesis / Voice Coach: no microphone permission required.
- Recording the user's voiceover: microphone permission required.

Microphone permission should only be requested when the user explicitly starts a recording action, not merely when opening the Teleprompter.

---

## CURRENT TEST FREEZE / COORDINATION RULE

Before modifying production behavior, check whether the user is actively testing a build in another chat.

If a test is in progress:

- do not push unrelated production changes
- prefer review-only work
- if a critical fix is needed, tell the user exactly what will change before touching `main`

A documentation-only update to this coordination file is allowed when the user explicitly asks for synchronization between chats.

---

## REQUIRED PRE-WORK CHECKLIST FOR EVERY CHAT

Before editing:

1. Fetch current `main` HEAD SHA.
2. Read `CHAT_SYNC_STATUS.md`.
3. Read `BUILD_STATUS.md`.
4. Read `CLAUDE_CURRENT_HANDOFF.md` for historical context only; it may be stale.
5. Search recent commits since the last known checkpoint.
6. Inspect every file you intend to touch from current remote `main`.
7. Check whether another active chat already fixed the issue.
8. Only then decide whether a code change is still needed.

After editing:

1. Re-fetch every changed file from remote `main`.
2. Check syntax and the exact changed functions.
3. Verify service-worker/cache implications if any JS/HTML loader changed.
4. Record the resulting commit SHA.
5. State the rollback commit/file.
6. Update this file only if the shared project state materially changed.

---

## DO NOT DELETE / OVERWRITE WORK CASUALLY

Avoid wholesale rewrites of:

- `app.js`
- `index.html`
- `teleprompter.html`
- One-Click executor/render modules
- storage schemas

unless the user explicitly approves it and the current remote version has been fully inspected.

Never delete user data merely to solve a code problem.

---

## HANDOFF FORMAT BETWEEN CHATS

When one chat finishes work, leave this minimum handoff:

- **Current HEAD:** exact SHA
- **Changed files:** exact paths
- **Changed functions:** exact names/sections
- **What was verified in code**
- **What was verified by the user on iPhone**
- **What remains unverified**
- **Rollback point**
- **Known open issues**

This prevents another chat from assuming stale information.

---

# END SHARED CHAT SYNC STATUS
