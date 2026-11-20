const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const W=require('../src/world1_v14.js'),L=require('../src/levels.js'),C=require('../src/curriculum.js');
const names=['Enchanted Forest Entrance','Giant Mushroom Valley','Crystal Waterfall Gorge','Treetop Village','Forgotten Temple','Firefly Forest','Misty Swamplands','Underground Root Caverns','Stormwood Highlands','Heart of the Ancient Forest'];
const kinds=['forest','bounce','waterfall','treetop','temple','firefly','swamp','cavern','storm','heart'];
assert.equal(W.locations.length,10);
assert.equal(new Set(W.locations.map(x=>x.landmark)).size,10);
for(let n=1;n<=100;n++){
 const d=L.make(n);assert.equal(d.shrines.length,4);assert.deepEqual(new Set(d.shrines.map(x=>x.subject)),new Set(C.SUBJECTS));
 if(n<=10){assert.equal(d.title[0],names[n-1]);assert.equal(d.v14.mechanic,kinds[n-1]);assert.equal(d.title.length,3);assert(d.subtitle.every(Boolean));for(const p of d.platforms)assert(p.y<d.ground);
  for(const s of d.shrines)for(const q of d.pits)assert(!(s.x>q.x-100&&s.x<q.x+q.w+100),`shrine/pit conflict stage ${n}`);
  for(const cp of d.checkpoints)for(const q of d.pits)assert(!(cp>q.x-90&&cp<q.x+q.w+90),`checkpoint/pit conflict stage ${n}`);
  W.reset(d);assert.equal(d.v14.triggerCount,0);assert(d.platforms.every(x=>!x.v14Broken));
 }else assert.equal(d.v14,undefined,`v14 leaks into world ${d.world+1}`);
}
const demo=(id)=>{let d=L.make(id);W.reset(d);return {scene:'play',elapsed:0,keys:0,bossHp:3,levelData:d,player:{x:0,y:400,h:62,vy:0,vx:0,grounded:false}}};
let s=demo(2),b=s.levelData.platforms.find(x=>x.v14Type==='bounce');s.player.x=b.x+50;s.player.y=b.y-62;assert(W.contact(s,b));assert.equal(s.player.vy,-875);assert(s.levelData.v14.triggerCount>0);
s=demo(5);s.player.x=s.levelData.v14.switches[0].x;assert(W.activate(s));assert(s.levelData.v14.bridges[0].open);assert(W.activate(s));assert(!s.levelData.v14.bridges[0].open);W.onRune(s,s.levelData.shrines[0]);assert(s.levelData.v14.bridges[0].open,'correct education must activate physical temple bridge');
s=demo(6);s.player.x=s.levelData.v14.switches[0].x;W.activate(s);assert(s.levelData.v14.bridges[0].open);W.onRune(s,s.levelData.shrines[2]);assert(s.levelData.v14.bridges[1].open,'firefly rune unlocks second path');
s=demo(7);b=s.levelData.platforms.find(x=>x.v14Type==='sink');s.player.x=b.x+b.w/2;s.player.y=b.y-62;s.player.grounded=true;for(let k=0;k<60;k++){s.elapsed+=.016;W.tick(s,.016)}assert(b.y>b.v14BaseY+30,'swamp must physically sink');
s=demo(8);s.player.x=s.levelData.v14.switches[0].x;W.activate(s);b=s.levelData.platforms.find(x=>x.v14Type==='lift');s.player.x=0;for(let k=0;k<30;k++){s.elapsed+=.033;W.tick(s,.033)}assert.notEqual(b.y,b.v14BaseY,'lift must physically move');
s=demo(9);s.player.x=700;W.tick(s,.03);assert(s.player.vx>0,'storm wind must accelerate player');b=s.levelData.platforms.find(x=>x.v14Type==='crumble');s.player.x=b.x+b.w/2;s.player.y=b.y-62;s.player.grounded=true;for(let k=0;k<65;k++){s.elapsed+=.016;W.tick(s,.016)}assert(b.v14Broken>0,'storm platform must actually collapse');
s=demo(10);s.keys=4;s.bossHp=2;W.tick(s,.016);assert.equal(s.levelData.v14.bossPhase,2);s.bossHp=1;W.tick(s,.016);assert.equal(s.levelData.v14.bossPhase,3);assert.equal(s.levelData.v14.bossPhases.length,3);
const art=fs.readFileSync(path.join(__dirname,'../src/world1_v14_art.js'),'utf8');for(const token of ['mushroom','waterfall','cottage','temple','lantern','rootTunnel','windmill','heartTree','pointedArch','crystal','cypress'])assert(art.includes(token));
const renderer=fs.readFileSync(path.join(__dirname,'../src/premium.js'),'utf8');assert(renderer.includes('WorldOneArt.background'));assert(renderer.includes('paintWorldOneTerrain'),'v14.1 modular terrain must render in World 1');assert(renderer.includes('WorldOneArt.featureObjects'));assert(renderer.includes('WorldOneArt.foreground'));
console.log('PASS v14: 10 authored locations; physics-backed bounce, sinking, wind, crumble, switch bridges and lifts; three boss phases; preserved Worlds 2–10 and all 100 levels.');
