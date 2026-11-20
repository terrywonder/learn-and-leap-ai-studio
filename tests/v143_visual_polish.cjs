'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const premium=fs.readFileSync(path.join(root,'src/premium.js'),'utf8');
const terrain=fs.readFileSync(path.join(root,'src/world1_terrain_v141.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const pkg=require('../package.json');
const kinds=['forest','mushroom','waterfall','timber','temple','firefly','swamp','cave','storm','sacred'];
assert(/^(14\.3|14\.4|14\.5|14\.6|15\.0)\.0-/.test(pkg.version),'v14.3 visual changes preserved in later releases');
assert.match(html,/(v14\.(3 PROFESSIONAL WORLD 1 VISUAL PASS|4 NATURAL RUN CYCLE|5 ARTICULATED ANKLE RUN CYCLE|6 REAR-FOOT GAIT CORRECTION)|v15\.0 FULL ADVENTURE)/);
assert(premium.includes("ready('world1-v143/mistwalk-cinematic-scenery.webp')"),'professional scenic plate used by default renderer');
assert(premium.includes('stage.id===3'),'professional waterfall plate scoped to World 1 / Level 3 only');
assert(premium.includes('WorldOneArt.background(this.ctx,this.stage,cam,t)'),'other scenes use their bespoke backgrounds');
assert(premium.includes("'animation/ari/back-leg-v141.png'"),'approved fixed boot retained');
assert(premium.includes("'animation/ari/front-leg.png'"),'existing front-leg retained');
assert(premium.includes("c.strokeText('DISCOVER',x,y-40)"),'draw gate label is live and outlined');
assert(terrain.includes('approvedMaterial(c,d,x,y,w,hg,seedNum,kind,texture)'),'art atlas actually used by game renderer');
assert(terrain.includes('c.rect(x,y-6,w,Math.min(hg+6,116))'),'texture clipped to actual platform geometry');
for(const k of kinds){
  assert(premium.includes(`world1-v143/${k}-stone-moss.webp`) || premium.includes('map(k=>`world1-v143/${k}-stone-moss.webp`)'),`preloads ${k}`);
  const f=path.join(root,`assets/world1-v143/${k}-stone-moss.webp`);
  const bytes=fs.readFileSync(f);assert(bytes.length>20000);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
}
let plate=fs.readFileSync(path.join(root,'assets/world1-v143/mistwalk-cinematic-scenery.webp'));
assert(plate.length>70000);assert.equal(plate.toString('ascii',8,12),'WEBP');
require('../src/world1_v14.js');
const L=require('../src/levels.js'),C=require('../src/curriculum.js');
for(let n=1;n<=100;n++){
 let d=L.make(n);assert.equal(d.shrines.length,4);assert.equal(d.world,Math.floor((n-1)/10));
 if(n<=10)assert(d.v14?.mechanic);else assert.equal(d.v14,undefined);
}
assert.deepEqual(new Set(C.SUBJECTS),new Set(['math','english','science','general']));
console.log('PASS v14.3: 11 professional art assets, scoped runtime scenery, clipped terrain material, real-text gate, approved Ari assets, 100-level database preserved');
