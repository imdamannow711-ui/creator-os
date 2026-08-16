# DONE RITE Creator OS — Current Claude Handoff

Updated: August 16, 2026

## Purpose

Claude is the secondary coding and troubleshooting assistant for DONE RITE Creator OS. Preserve the working app, existing data structures, and the user's mobile-first workflow. Do not rebuild or replace major files unless specifically asked.

## Repository and live app

- Repository: `imdamannow711-ui/creator-os`
- Default branch: `main`
- Live app: `https://imdamannow711-ui.github.io/creator-os/`
- Teleprompter: `https://imdamannow711-ui.github.io/creator-os/teleprompter.html`
- Primary device: iPhone 13 using Safari or the Home Screen PWA

Always inspect the newest remote `main` version before editing. Some older local copies and ZIP files exist and must not be treated as current.

## Current production workflow

1. The user uploads plain product videos.
2. Review every clip for duration, framing, motion, useful moments, and original audio.
3. Choose the strongest 7-, 10-, or 15-second route.
4. Create a clean 9:16 cut with compliant on-screen text and no unlicensed music.
5. Provide the creative angle and exact sound-effect timing.
6. Generate a ready-loaded Teleprompter recording-session link.
7. The user taps **I'm Ready — Record Now**, records, and stops.
8. The app automatically creates the product/version filename and saves the recording in its local Voiceover Library.
9. The completed screen shows only:
   - **Send to ChatGPT for Review**
   - **Record Another Take**
   - **Save to Files for Reuse**
10. The user normally saves reusable audio into the same iCloud Drive `DONE RITE/Voiceovers` folder. ChatGPT review is optional.
11. The approved voiceover is fitted to the edited video.

## Teleprompter quick-session implementation

The newest `teleprompter.html` accepts URL query parameters:

- `session=1`
- `product`
- `seconds` (`7`, `10`, or `15`)
- `type` (`hook`, `intro`, `feature`, `cta`, or `full`)
- `tone`
- `angle`
- `direction`
- `sfx`
- `script`

The session link opens a simplified recording card with the script, product, timing, direction, sound plan, and tone already loaded. Advanced editor, library, rewind, pause, and forward controls are hidden during the quick session.

The most recent Teleprompter update was committed directly to `main` as:

- Commit: `2087a83ad74393d0d638fc471104150c1828834b`
- Purpose: simplify the quick voiceover recording workflow

Important iPhone limitation: Safari requires a user tap to open the Share Sheet, select ChatGPT, or save into the Files app. Do not claim these operating-system actions can happen silently. The in-app IndexedDB save and automatic filename can happen automatically.

## Automatic voiceover filenames

Preserve the current format:

`YYYYMMDD_DONE_RITE_PRODUCT_TYPE_TONE_DURATIONs_VNUMBER.m4a`

Example:

`20260816_DONE_RITE_BUNNY_LULU_FULL_CURIOUS_10s_V1.m4a`

## Current product status

### Bunny Lulu

- Two source clips were uploaded.
- Selected route: 10-second curiosity reveal.
- Cut order: closed tin, Bunny Lulu reveal, matching case detail, plush hero shot.
- On-screen text:
  - `WHAT IS INSIDE?`
  - `MEET BUNNY LULU`
  - `FLUFFY PLUSH + MATCHING CASE`
  - `SEE IT IN THE PRODUCT LINK`
- Voiceover:
  - `What's hiding in this little tin? Meet Bunny Lulu—a fluffy plush tucked inside a matching case. See it in the product link.`
- Tone: curious, warm, and clear.
- Sound plan:
  - 0.0s soft mystery chime
  - 2.1s pop plus whoosh on reveal
  - 6.4s sparkle
  - 8.1s soft click
- Kids-product review applies. Avoid unverified safety, age, educational, or developmental claims.

### Next product

- Correct name: **Hohem iSteady X3 SE Gimbal**
- Wait for the user's video before choosing the exact route.
- Battery-powered/electrical product review applies.

## TikTok Shop compliance rules

- Do not use prices, discounts, coupon promises, cheapest, or lowest-price language.
- Do not use competitor brands promotionally or comparatively.
- Do not make guaranteed, instant, 100%, or other absolute performance claims.
- Use `designed to`, `built for`, or `made to` when appropriate.
- Do not use false scarcity or unsupported urgency.
- Do not use copyrighted lyrics, movie/TV dialogue, or trademarked slogans.
- Include `#ad` in every hashtag set.
- Supplements and wellness require support language only and no disease, cure, treatment, prevention, weight-loss, or before/after claims.
- Flag supplements, skincare claims, weapons/tools, vape/tobacco-adjacent products, kids' products, and electrical/battery-powered products before writing.
- Shipping varies by user and location. Use conditional wording such as: `Check the product link to see if free shipping is available.`

## Coding rules for Claude

- Read the current remote files before changing anything.
- Preserve localStorage keys, IndexedDB databases, saved products, Content Gap data, dropdown data, and existing user content.
- Do not delete or rename existing storage keys without a tested migration.
- Keep the UI mobile-first for iPhone Safari and portrait use.
- Make the smallest targeted change possible.
- Do not rewrite `app.js`, `index.html`, or `teleprompter.html` wholesale.
- Keep unrelated user changes untouched.
- Validate JavaScript syntax and check the diff before committing.
- Explain exactly which files changed and what the user should test on the iPhone.

## Immediate verification checklist

1. Open a session link on the iPhone.
2. Confirm only the simple recording card appears.
3. Tap **I'm Ready — Record Now**.
4. Confirm the 3-second countdown and slow Teleprompter start.
5. Tap **Stop & Save**.
6. Confirm the automatic filename and in-app save.
7. Confirm the finished screen shows the three approved actions only.
8. Confirm **Send to ChatGPT for Review** attaches the audio through the Share Sheet.
9. Confirm **Save to Files for Reuse** opens the Files save flow.
10. Confirm **Record Another Take** starts a new version cleanly.

Do not start a new feature until the user assigns it. If troubleshooting, diagnose first and preserve the current working flow.
