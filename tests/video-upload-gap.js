/* Node simulation for video-upload.html's bestGap() logic — QA only, not wired into any build. */
// (no 'use strict' here on purpose: direct `eval` of the sourced script needs to be
// non-strict so its top-level function declarations attach to this scope.)

// --- minimal fakes for the pieces bestGap()/refreshGapSelection() touch ---
const store = { data: {} };
global.localStorage = {
  getItem: (k) => (k === 'done-rite-creator-os:v1' ? JSON.stringify(store.data) : null),
};
const elements = { product: { value: 'Hollyland LARK A1', addEventListener: () => {} }, gapStatus: { textContent: '', className: '' } };
global.document = { getElementById: (id) => elements[id] };

// Pull just the functions we need out of the real file by regex+eval, so this test
// exercises the actual shipped code rather than a hand copy of it.
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/../video-upload.html', 'utf8');
const script = html.match(/<script>\n([\s\S]*)<\/script>/)[1];

// Stub out the browser bits bestGap()/brief() don't need for this test but the
// wider script references at load time (event listeners etc. are harmless no-ops here).
global.window = { addEventListener: () => {} };
global.navigator = { clipboard: { writeText: async () => {} } };
global.URL = { createObjectURL: () => '', revokeObjectURL: () => {} };
const $ = (id) => elements[id];
elements.files = { addEventListener: () => {}, files: [] };
elements.selected = { textContent: '' };
elements.previewCard = { hidden: false };
elements.shareAll = { disabled: false, onclick: null };
elements.copyBrief = { onclick: null };
elements.notes = { value: '' };
elements.length = { value: '10 seconds' };
elements.style = { value: 'Product-only / faceless' };
elements.status = { textContent: '', className: '' };
elements.preview = { innerHTML: '', appendChild: () => {} };

// eslint-disable-next-line no-eval
eval(script);

function run(rows, label) {
  store.data = { gapRows: rows };
  const gap = bestGap();
  console.log(label, '=>', gap ? `${gap.phrase} @ ${gap.searchIncreasePct}% (${gap.tier})` : null);
  return gap;
}

let failures = 0;
function assert(cond, msg) { if (!cond) { failures++; console.error('FAIL:', msg); } else { console.log('pass:', msg); } }

// 1. Archived rows must be excluded even if they'd otherwise win on relevance/percent.
let gap = run([
  { phrase: 'wireless lavalier mic', searchIncreasePct: 1500, archived: true },
  { phrase: 'creator audio setup', searchIncreasePct: 950, archived: false },
], 'archived exclusion');
assert(gap && gap.phrase === 'creator audio setup', 'archived row is skipped in favor of the active one');

// 2. 900-999% now qualifies (previously required 1000%+).
gap = run([
  { phrase: 'lavalier microphone tips', searchIncreasePct: 925, archived: false },
], '900-999% now qualifies');
assert(gap && gap.tier === 'Qualified', '925% is classified Qualified and is now selected');

// 3. Below 900% still excluded.
gap = run([
  { phrase: 'lavalier microphone tips', searchIncreasePct: 899, archived: false },
], 'below 900% still excluded');
assert(gap === null, '899% is still rejected');

// 4. 1000%+ still classified Priority.
gap = run([
  { phrase: 'creator mic hollyland', searchIncreasePct: 1200, archived: false },
], '1000%+ is Priority');
assert(gap && gap.tier === 'Priority', '1200% is classified Priority');

// 5. All rows archived => no selection (regression guard for the exact bug reported).
gap = run([
  { phrase: 'creator mic hollyland', searchIncreasePct: 1200, archived: true },
  { phrase: 'lavalier microphone tips', searchIncreasePct: 950, archived: true },
], 'all archived => none selected');
assert(gap === null, 'archived-only rows never surface');

console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL PASSED');
process.exit(failures ? 1 : 0);
