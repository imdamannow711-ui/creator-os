const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const requireText = (body, value, label) => {
  if (!body.includes(value)) throw new Error(label + ': missing ' + value);
};

const crest = read('assets/brand/done-rite-cross-crest.svg');
const logo = read('assets/brand/done-rite-network-logo.svg');
const bolts = read('assets/brand/divine-bolts.svg');
const launcherArt = read('assets/one-click/one-click-home-righteous-light.svg');
const dashboard = read('styles/dashboard.css');
const builder = read('styles/one-click-builder.css');
const home = read('one-click-home-dev.html');
const app = read('app.js');
const manifest = JSON.parse(read('manifest.json'));
const sw = read('sw.js');

requireText(crest, '<title id="title">DONE RITE cross crest</title>', 'crest identity');
requireText(crest, 'M112 72h32v39h40v32h-40v65h-32v-65H72v-32h40z', 'cross geometry');
requireText(logo, 'FAITH • INTEGRITY • SERVICE • EXCELLENCE', 'brand values');
requireText(logo, 'Real Reviews. Real Gadgets. Done Rite.', 'brand slogan');
requireText(bolts, 'stroke="#168cff"', 'electric-blue bolts');
requireText(launcherArt, 'CREATE WITH PURPOSE', 'purpose message');
['CREATE','UPLOAD','TEXT','VOICEOVER','AUTO TRIM','SFX','RENDER','EXPORT'].forEach(label => requireText(launcherArt, '>'+label+'<', 'launcher stage'));
requireText(dashboard, 'color-scheme: light', 'dashboard light mode');
requireText(dashboard, 'divine-bolts.svg', 'dashboard divine light');
requireText(builder, 'color-scheme: light', 'builder light mode');
requireText(builder, 'divine-bolts.svg', 'builder divine light');
requireText(home, 'one-click-home-righteous-light.svg', 'launcher art');
requireText(app, 'done-rite-cross-crest.svg', 'dashboard crest');
requireText(app, 'Faith \\u2022 Integrity \\u2022 Service \\u2022 Excellence', 'dashboard brand values');
if (manifest.theme_color !== '#eef8ff' || manifest.background_color !== '#eef8ff') throw new Error('manifest is not using the bright install theme');
requireText(sw, 'done-rite-v35-righteous-light-theme', 'cache version');
['done-rite-cross-crest.svg','done-rite-network-logo.svg','divine-bolts.svg','one-click-home-righteous-light.svg'].forEach(asset => requireText(sw, asset, 'offline asset'));
for (const file of ['icon-192.png','icon-512.png']) {
  const bytes = fs.readFileSync(path.join(root, file));
  if (bytes.length < 1000 || bytes.toString('ascii', 1, 4) !== 'PNG') throw new Error(file + ' is not a valid rendered icon');
}

console.log('Righteous-light theme smoke checks passed.');
