const fs=require('fs');
const path=require('path');
const vm=require('vm');

function assert(value,message){if(!value)throw new Error(message);}
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'one-click-home-dev.html'),'utf8');
const css=fs.readFileSync(path.join(root,'styles','one-click-home.css'),'utf8');
const js=fs.readFileSync(path.join(root,'modules','one-click-home.js'),'utf8');
const image=fs.readFileSync(path.join(root,'assets','one-click','one-click-home.webp'));

new vm.Script(js,{filename:'one-click-home.js'});
assert(html.includes('assets/one-click/one-click-home.webp'),'Approved One-Click graphic is not loaded');
assert(html.includes('styles/one-click-home.css'),'Launcher stylesheet is not loaded');
assert(html.includes('modules/one-click-home.js'),'Launcher route controller is not loaded');
for(const stage of ['create','upload','text','voiceover','trim','sfx','render','export']){
  const matches=html.match(new RegExp('data-stage="'+stage+'"','g'))||[];
  assert(matches.length===2,'Expected graphic and mobile control for '+stage);
}
assert(js.includes("url.searchParams.set('return',launcherReturn())"),'Editor return route is missing');
assert(js.includes("url.searchParams.set('stage',stage)"),'Stage route is missing');
assert(css.includes('min-height: 82px'),'Mobile touch targets are not protected');
assert(css.includes('@media (min-width: 760px)'),'Responsive graphic hotspot layout is missing');
assert(image.slice(0,4).toString('ascii')==='RIFF'&&image.slice(8,12).toString('ascii')==='WEBP','Graphic is not WebP');

console.log('ONE_CLICK_HOME_SMOKE_PASS');
