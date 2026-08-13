const fs = require('fs');
const vm = require('vm');
const path = require('path');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = path.join(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const start = app.indexOf('const MIN_CONTENT_GAP_GROWTH_PERCENT');
const end = app.indexOf('function voiceoverSegments', start);
assert(start >= 0 && end > start, 'Could not isolate Content Gap helpers from app.js');
const context = {};
vm.createContext(context);
vm.runInContext(`${app.slice(start, end)}\nthis.testApi={parseContentGapGrowthPercent,contentGapGrowthPercent,contentGapPhrasesFromText,sanitizeContentGapRows};`, context);
const api = context.testApi;

assert(api.parseContentGapGrowthPercent('Search increase 1,000%+') === 1000, 'Comma percentage was not parsed');
assert(api.parseContentGapGrowthPercent('↑ 1250%') === 1250, 'Arrow percentage was not parsed');
assert(api.parseContentGapGrowthPercent('1.2K searches') === 0, 'Search count was mistaken for growth percentage');

const detected = api.contentGapPhrasesFromText([
  'Hollyland LARK A1 mini cordless microphone review',
  'Search increase',
  '1,000%+',
  'Hollyland LARK A1 setup',
  '900%',
].join('\n'));
assert(detected.length === 1, 'Importer did not enforce 1,000% minimum');
assert(detected[0].phrase.includes('Hollyland LARK A1'), 'Phrase was not paired with percentage');
assert(detected[0].searchIncreasePct === 1000, 'Growth percentage was not retained');

const preserved = api.sanitizeContentGapRows([
  { phrase: 'Hollyland LARK A1 review', note: 'Imported · 1,000% search increase' },
  { phrase: 'Older phrase without percentage', source: 'screenshot import' },
]);
assert(preserved.length === 2, 'Existing rows were deleted during migration');
assert(preserved[0].searchIncreasePct === 1000, 'Legacy note percentage was not migrated');

const uploader = fs.readFileSync(path.join(root, 'video-upload.html'), 'utf8');
assert(uploader.includes('Selected Content Gap phrase:'), 'Video brief omits selected Content Gap phrase');
assert(uploader.includes('Search increase:'), 'Video brief omits search increase percentage');
assert(uploader.includes('MIN_GROWTH_PERCENT=1000'), 'Video uploader does not enforce 1,000% minimum');
const elements = new Map();
for (const id of ['product','length','style','notes','gapStatus','files','shareAll','copyBrief']) {
  elements.set(id, { id, value: '', textContent: '', className: '', disabled: false, addEventListener() {} });
}
elements.get('product').value = 'Hollyland LARK A1';
elements.get('length').value = '7 seconds';
elements.get('style').value = 'Product-only / faceless';
const uploaderStore = JSON.stringify({ gapRows: [
  { phrase: 'Hollyland LARK A1 mini cordless microphone review', searchIncreasePct: 1000 },
  { phrase: 'Unrelated kitchen gadget', searchIncreasePct: 9000 },
] });
const uploaderContext = {
  document: { getElementById: id => elements.get(id) },
  localStorage: { getItem: key => key === 'done-rite-creator-os:v1' ? uploaderStore : null },
  window: { addEventListener() {} },
  navigator: {}, URL, console,
};
vm.createContext(uploaderContext);
const uploaderScript = [...uploader.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)][0][1];
vm.runInContext(`${uploaderScript}\nthis.generatedBrief=brief();`, uploaderContext);
assert(uploaderContext.generatedBrief.includes('Selected Content Gap phrase: Hollyland LARK A1 mini cordless microphone review'), 'Uploader did not select the relevant phrase');
assert(uploaderContext.generatedBrief.includes('Search increase: 1000%'), 'Uploader did not hand off the exact percentage');

const importer = fs.readFileSync(path.join(root, 'content-gap-import.html'), 'utf8');
assert(importer.includes('Nothing was deleted.'), 'Importer does not confirm preservation');
assert(!importer.includes('MIN_SEARCHES=1000'), 'Old 1,000-search rule is still present');

console.log('CONTENT_GAP_1000_PERCENT_PASS');
