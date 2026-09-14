const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (value, message) => { if (!value) throw new Error(message); };

const crest = read('assets/brand/done-rite-cross-crest.svg');
const logo = read('assets/brand/done-rite-network-logo.svg');
const droplets = read('assets/brand/smoked-glass-droplets.svg');
const launcherArt = read('assets/one-click/one-click-home-smoked-glass.svg');
const theme = read('styles/smoked-glass-theme.css');
const touch = read('modules/ui-touch-feedback.js');
const sfx = JSON.parse(read('assets/sfx/manifest.json'));
const manifest = JSON.parse(read('manifest.json'));
const sw = read('sw.js');

new vm.Script(touch, { filename: 'ui-touch-feedback.js' });
assert(crest.includes('<title id="title">DONE RITE cross crest</title>'), 'Cross crest identity is missing');
assert(crest.includes('M107 61h42v52h52v42h-52v83h-42v-83H55v-42h52z'), 'Stronger cross geometry is missing');
assert(logo.includes('FAITH • INTEGRITY • SERVICE • EXCELLENCE'), 'Brand values are missing');
assert(logo.includes('Real Reviews. Real Gadgets. Done Rite.'), 'Brand slogan is missing');
assert(droplets.includes('radialGradient id="drop"'), 'Wet-glass droplet pattern is missing');
assert(launcherArt.includes('ONE-CLICK WET-GLASS CONSOLE'), 'Wet-glass launcher identity is missing');
for (const label of ['CREATE','UPLOAD','TEXT','VOICEOVER','AUTO TRIM','SFX','RENDER','EXPORT']) {
  assert(launcherArt.includes('>'+label+'<'), 'Launcher artwork is missing '+label);
}
assert(theme.includes('smoked-glass-droplets.svg'), 'Shared theme does not load the droplets');
assert(theme.includes('.dr-touch-live'), 'Touch-light state is missing');
assert(theme.includes('--dr-rim-gold'), 'Meaningful gold action rim is missing');
assert(theme.includes('min-height: 46px'), 'iPhone touch target floor is missing');
for (const sound of ['click','pop','snap','whoosh']) {
  assert(sfx.builtIn.some(item => item.id === sound), 'SFX manifest is missing '+sound);
  assert(touch.includes("'"+sound+"'"), 'Touch controller is missing '+sound);
}
assert(touch.includes("document.addEventListener('pointerdown'"), 'Real touch delegation is missing');
assert(touch.includes("document.addEventListener('keydown'"), 'Keyboard activation feedback is missing');
assert(!/\.volume\s*=|\.muted\s*=|createMediaElementSource|createMediaStreamSource/.test(touch), 'UI touch SFX must not modify voice or media audio');

const directlyThemedPages = [
  'index.html','one-click-home-dev.html','one-click-ad-dev.html','teleprompter.html',
  'teleprompter-script-studio.html','video-upload.html','content-gap-import.html',
  'amazon-setup-launchpad.html','one-click-hook-results.html','dev-dashboard.html'
];
for (const page of directlyThemedPages) {
  const html = read(page);
  assert(html.includes('styles/smoked-glass-theme.css?v=20260914-smoked-glass-1'), page+' does not load the shared glass theme');
  assert(html.includes('modules/ui-touch-feedback.js?v=20260914-smoked-glass-1'), page+' does not load touch feedback');
}
const wrapper = read('teleprompter-one-click.html');
assert(wrapper.includes('styles/smoked-glass-theme.css?v=20260914-smoked-glass-1'), 'Teleprompter wrapper loading view is not themed');
assert(manifest.theme_color === '#071116' && manifest.background_color === '#071116', 'Install theme is not smoked glass');
assert(sw.includes('done-rite-v37-smoked-glass-touch'), 'Offline cache version was not refreshed');
for (const asset of ['styles/smoked-glass-theme.css','assets/brand/smoked-glass-droplets.svg','assets/one-click/one-click-home-smoked-glass.svg','modules/ui-touch-feedback.js']) {
  assert(sw.includes(asset), 'Offline cache is missing '+asset);
}

console.log('SMOKED_GLASS_THEME_SMOKE_PASS');
