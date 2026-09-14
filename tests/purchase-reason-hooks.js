const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'modules', 'creator-content-libraries.js'), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context, { filename: 'creator-content-libraries.js' });
const library = context.window.DoneRiteContentLibraries;
const purchase = library.HOOK_LIBRARY.filter(item => item.angle === 'Purchase reason (bought item)');
if (purchase.length !== 5 || purchase.some(item => item.manualOnly !== true)) throw new Error('Purchase-reason hooks must be five manual-only choices');
for (let spin = 0; spin < 250; spin += 1) {
  const output = library.pickHooks('Test product', 'verified feature', 'TikTok Shop', [], spin);
  if (output.some(text => /^I bought\b/.test(text))) throw new Error('Automatic hook rotation used a personal-purchase claim');
}
console.log('PURCHASE_REASON_HOOKS_PASS');
