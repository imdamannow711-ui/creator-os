# DONE RITE Creator OS — Shared Chat Sync Status

Updated: 2026-09-05

## PURPOSE

This file is the shared coordination point for every ChatGPT/Claude conversation working on DONE RITE Creator OS.

**Before making any repository change, every chat must read this file and then re-check the current remote `main` branch.**

The repository is the source of truth for code state. Conversation memory/history should be used for user preferences and prior decisions, but never assumed to equal the newest repo state.

Repository: `imdamannow711-ui/creator-os`
Default branch: `main`
Primary device: iPhone 13 / Safari / Home Screen PWA
Live app: `https://imdamannow711-ui.github.io/creator-os/`
One-Click editor: `https://imdamannow711-ui.github.io/creator-os/one-click-ad-dev.html`

---

## LATEST SHARED PROJECT UPDATE — SCRIPT STUDIO RANDOMIZE FIX

User tested Script Studio on iPhone and reported:

- `RANDOMIZE A LITTLE` appeared not to work.
- `RANDOMIZE A LOT` appeared to work.
- the original-restore behavior needed to be checked and made obvious.

Implemented on 2026-09-05:

- `teleprompter-script-studio.html`
  - `RANDOMIZE A LITTLE` no longer depends only on a short list of very specific phrases.
  - added safe general wording variations plus a structure-preserving fallback, so ordinary product scripts still receive a visible light rewrite.
  - `RANDOMIZE AGAIN` in light mode retries and has a final fallback so it does not silently return the same visible result.
  - the original button is now labeled `GO BACK TO ORIGINAL`.
  - original restore explicitly copies the source/pasted script back to the Teleprompter-version box word-for-word.
  - existing Exact/Light/Heavy workflow, manual editing, copy, navigation, compliance check, and Teleprompter handoff remain intact.
- `sw.js`
  - cache tag bumped to `done-rite-v25-script-randomize-hardened` so iPhone Safari receives the corrected Script Studio.
  - network-first / no-store / navigation-only HTML fallback behavior remains unchanged.

The last code commit before this status-file update was:

`63cf08af40dc318862e1de104800b1de98e7bf86`

This fix is **code-verified but not yet re-tested by the user on iPhone**.

---

## PREVIOUS SHARED PROJECT UPDATE — ONE-CLICK NAVIGATION

User reported that One-Click felt disconnected and frustrating because there was no obvious route from a copied/edited script into the Teleprompter and no dependable Back control while editing.

Approved and implemented on 2026-09-05:

- `modules/one-click-camera-handoff.js` upgraded to v0.8.
  - persistent `← BACK` control on the One-Click page
  - new always-visible `SCRIPT & TELEPROMPTER` shortcut card
  - `📝 PASTE / EDIT SCRIPT → TELEPROMPTER`
  - `🎙 OPEN TELEPROMPTER MANUALLY`
  - existing Hook + CTA handoff remains connected
- `teleprompter-script-studio.html`
  - persistent `← BACK`
  - direct `ONE-CLICK` return
  - full editing/randomize/copy options preserved
  - primary action renamed to `USE THIS SCRIPT IN TELEPROMPTER →`
  - manual Teleprompter button added
  - script state saved before navigation/pagehide
  - Teleprompter receives both a previous-page Back target and One-Click return target
- `teleprompter-one-click.html`
  - persistent `← BACK` button
  - Back returns to Script Studio/previous page when available
  - completed recording still gets `RETURN TO ONE-CLICK EDITOR →`

Navigation work remains **code-verified and only partially user-tested**.

---

## CURRENT ONE-CLICK / SCRIPT STUDIO WORKFLOW

Intended flow:

**One-Click project → Script Studio (optional edit) → Teleprompter → voiceover → Gap Remover → One-Click editor → creative controls → render/export**

Navigation rule going forward:

**Every editing surface should expose an obvious Back path without wiping the current work.** When multiple destinations matter, provide both normal `← BACK` and a direct workflow return such as `ONE-CLICK`.

Standing requirements:

- Original clip audio gain stays at 1 unless the user explicitly requests otherwise.
- Separate voiceover gain stays at 1 unless the user explicitly requests otherwise.
- SFX must not duck or lower the original voice.
- No automatic normalization/compression/pitch/speed alteration of the user's recorded voice.
- Manual trims should persist when the same local file is reselected.
- Trimming one clip must not remove untouched selected cuts.
- Do not claim semantic product/action recognition is live; current browser analysis is not full semantic vision.
- If required footage is missing, use **RECORD MISSING CLIP** rather than forcing a weak edit.

---

## SERVICE WORKER / CACHE EXPECTATION

Required behavior:

- network first for same-origin GET requests
- `fetch(request, { cache: "no-store" })` or equivalent fresh-fetch behavior
- CacheStorage fallback only after network failure
- `index.html` fallback only for navigation requests
- scripts/modules must never receive HTML as a fallback
- cache only full `200` responses, not `206 Partial Content`
- One-Click, Script Studio, Teleprompter companion flow, and required One-Click modules available through offline cache

Before changing `sw.js`, read the current remote version first.

---

## COMPLIANCE STATUS — OPEN REVIEW ITEM

Current known `app.js` contains:

- `safeFeatureText()`
- `scanCompliance()`
- `makePackage()` using cleaned verified-feature text for generated content

The exact historical functions `blockingRuleFor` and `isSafeForViewers` were not found in the latest checked `main`.

Do not automatically re-add them. First determine whether they were intentionally replaced by the current compliance system or accidentally lost.

Standing content rules include no prices/discount claims, unsupported scarcity, absolute claims, medical cure/treat/prevent/heal claims, unsupported competitor comparisons, before/after outcome implications, or income promises. `#ad` belongs in affiliate hashtag sets. Regulated categories require extra review.

---

## STORAGE / SAVE STATUS — OPEN REVIEW ITEM

One-Click session autosave uses its own persistence/debounce behavior. The main dashboard `app.js` was last observed writing its primary state directly from a React effect rather than an explicit debounce.

Do not change this merely because it differs from One-Click. First determine whether it is causing a real problem or is intentional.

Preserve all current localStorage keys and IndexedDB data unless a tested migration is explicitly approved.

---

## TELEPROMPTER MICROPHONE RULE

The Teleprompter does not need microphone permission merely to display or speak a script.

- Text display / speech synthesis / Voice Coach: no microphone permission required.
- Recording the user's voiceover: microphone permission required.

Microphone permission should only be requested when the user explicitly starts a recording action, not merely when opening the Teleprompter.

---

## REQUIRED PRE-WORK CHECKLIST FOR EVERY CHAT

Before editing:

1. Fetch current `main` HEAD SHA.
2. Read `CHAT_SYNC_STATUS.md`.
3. Read `BUILD_STATUS.md`.
4. Read `CLAUDE_CURRENT_HANDOFF.md` only as historical context; it may be stale.
5. Search recent commits since the last known checkpoint.
6. Inspect every current remote file you intend to touch.
7. Check whether another active chat already fixed the issue.
8. Only then decide whether a code change is needed.

After editing:

1. Re-fetch every changed file from remote `main`.
2. Check syntax and exact changed functions/sections.
3. Verify service-worker/cache implications if any JS/HTML loader changed.
4. Record resulting commit SHA.
5. State rollback point.
6. Update this file if the shared project state materially changed.

---

## HANDOFF FORMAT BETWEEN CHATS

Leave at minimum:

- Current HEAD exact SHA
- Changed files
- Changed functions/sections
- What was verified in code
- What was verified by the user on iPhone
- What remains unverified
- Rollback point
- Known open issues

# END SHARED CHAT SYNC STATUS
