'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('../src/world1_v14.js');const X=require('../src/worlds_v15.js'),L=require('../src/levels.js'),C=require('../src/curriculum.js');
assert.equal(X.scenes.length,10);assert.equal(X.settings.length,10);assert.equal(new Set(X.settings.slice(1).map(a=>a[0])).size,9);
const ids=[],combinations=new Set();
for(let n=1;n<=100;n++){
 const d=L.make(n);ids.push(d.id);assert.equal(d.shrines.length,4);assert.deepEqual(new Set(d.shrines.map(q=>q.subject)),new Set(C.SUBJECTS));
 assert.equal(d.title.length,3);assert.equal(d.platforms.length>=7,true);assert(d.checkpoints.length>=2);
 if(n<=10){assert(d.v14&&!d.v15);continue;}
 assert(d.v15&&!d.v14);assert.equal(d.title[0],X.scenes[d.world][d.stage-1]);combinations.add(`${d.v15.kind}:${d.v15.mode}`);assert(d.v15.sources.length>=2);assert(d.v15.switches.length>=1);
 assert(d.platforms.some(q=>q.v15Type));
 const s={levelData:d,elapsed:0,player:{x:d.v15.switches[0].x,y:480,h:62,vx:0,vy:0,grounded:false},keys:0,bossHp:3};
 X.reset(d);assert.equal(d.v15.triggerCount,0);assert(X.activate(s));assert(d.v15.active);X.onRune(s,d.shrines[0]);assert(d.v15.runeBoost>0);assert(d.v15.events.some(x=>x.type==='learning'));
 const changed=d.platforms.find(q=>['gear','cloud','buoyant','rune','shadow'].includes(q.v15Type));if(changed){s.elapsed=1.7;X.tick(s,.03);if(changed.v15Type!=='shadow')assert.notEqual(changed.y,changed.v15BaseY,`stage ${n} moving surface`);}
 const spring=d.platforms.find(q=>['resonate','thermal','buoyant','starlift'].includes(q.v15Type));if(spring){s.player.vy=100;assert(X.contact(s,spring));assert(s.player.vy<0);}
 X.reset(d);assert(d.platforms.every(p=>p.y===p.v15BaseY&&p.x===p.v15BaseX));
 }
assert.equal(new Set(ids).size,100);assert.equal(combinations.size,90,'All 90 new world/stage design combinations are distinct.');
const read=n=>fs.readFileSync(path.join(__dirname,'../src',n),'utf8');assert(read('premium.js').includes('paintExpeditionBackdrop'));assert(read('premium.js').includes('paintExpeditionTerrain'));assert(read('premium.js').includes('paintExpeditionDetails'));
assert(read('game.js').includes('Expedition.tick(s,dt)'));assert(read('game.js').includes('Expedition.onRune'));
assert(fs.readFileSync(path.join(__dirname,'../index.html'),'utf8').includes('src/worlds_v15.js'));
console.log('PASS v15: 90 stage identities across 9 expanded worlds, 9 functional biome mechanics, 10 stage variations per world, 100 levels, 4 shrines, progression and curriculum unchanged.');
