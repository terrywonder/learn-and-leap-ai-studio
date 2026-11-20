const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const rr=n=>fs.readFileSync(path.join(root,n));
const leg=rr('assets/animation/ari/back-leg-v141.png');const old=rr('assets/animation/ari/back-leg.png');
assert(!leg.equals(old),'repaired rear boot must differ from defective source');
assert(leg.slice(1,4).toString()==='PNG'.slice(0,3)||leg[0]===137);
assert.equal(leg.readUInt32BE(16),285);assert.equal(leg.readUInt32BE(20),235);
const prem=rr('src/premium.js').toString();assert(prem.includes("limbPart('animation/ari/back-leg-v141.png'"),'the rear boot must remain attached to the articulated rig');
assert(prem.includes('paintWorldOneTerrain('),'new terrain must be used by real gameplay renderer');
const terrain=rr('src/world1_terrain_v141.js').toString();
for(const family of ['forest','mushroom','waterfall','timber','temple','firefly','swamp','cave','storm','sacred'])assert(terrain.includes(`kind:'${family}'`));
for(const part of ['front-leg.png','body.png','cape.png'])assert(fs.statSync(path.join(root,'assets/animation/ari',part)).size>1000);
require('../src/world1_v14.js');const level=require('../src/levels.js');for(let i=1;i<=100;i++){let d=level.make(i);assert(d&&d.shrines.length===4);assert.equal(Boolean(d.v14),i<=10);}
console.log('PASS v14.1: missing rear-foot sprite frame repaired; new painted sprite is articulated; ten modular terrain material families are active; all 100 levels preserved.');
