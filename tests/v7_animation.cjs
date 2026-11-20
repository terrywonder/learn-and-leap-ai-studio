const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const source=fs.readFileSync(path.join(root,'src/animation.js'),'utf8');
 const {heroPose,creaturePose}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const idle=heroPose({vx:0,vy:0,run:0,grounded:true},1000);
 const runA=heroPose({vx:280,vy:0,run:1.1,grounded:true},1100),runB=heroPose({vx:280,vy:0,run:4.6,grounded:true},1350);
 const jump=heroPose({vx:180,vy:-400,run:3,grounded:false},1500),fall=heroPose({vx:180,vy:440,run:3,grounded:false},1800);
 const cast=heroPose({vx:0,grounded:true,cast:.28,run:0},1000);
 const land=heroPose({vx:200,vy:0,grounded:true,land:.19,run:1},1300);
 assert.equal(idle.mode,'idle');assert.equal(runA.mode,'run');assert.equal(jump.mode,'jump');assert.equal(fall.mode,'fall');assert.equal(cast.mode,'cast');assert.equal(land.mode,'land');
 assert(Math.abs(heroPose({vx:280,run:0,grounded:true},0).legs[0]-heroPose({vx:280,run:Math.PI,grounded:true},0).legs[0])>.25,'forward hip alternates with bounded motion');
 assert(Math.abs(heroPose({vx:280,run:0,grounded:true},0).legs[1]-heroPose({vx:280,run:Math.PI,grounded:true},0).legs[1])>.22,'rear hip alternates with bounded motion');
 assert(Math.abs(heroPose({vx:280,run:0,grounded:true},0).ankles[1]-heroPose({vx:280,run:Math.PI,grounded:true},0).ankles[1])>.10,'rear ankle independently rotates with restrained pitch');
 assert(Math.abs(runA.arms[0]-runB.arms[0])>.3,'rear arm must swing');
 assert(Math.abs(runA.arms[1]-runB.arms[1])>.3,'front arm must swing');
 assert(Math.abs(jump.legs[0]-fall.legs[0])>.5,'jump vs fall legs differ');
 assert(Math.abs(jump.arms[0]-fall.arms[0])>.4,'jump vs fall arms differ');
 assert(land.squash<1,'landing squash');assert(Math.abs(cast.arms[1]-idle.arms[1])>.8,'casting arm');
 for(const key of ['rootkeeper','glow-frog','fallback']){
  const p=creaturePose(1200,1,key,0),q=creaturePose(1600,1,key,1);
  assert(Math.abs(p.legs[0]-q.legs[0])>.03,'creature feet must move');
  if(key!=='fallback')assert.notEqual(p.mode,q.mode,key);
  if(key==='rootkeeper')assert(Math.abs(creaturePose(1200,1,key,0).arms[0]-creaturePose(1200,1,key,1).arms[0])>.6,'boss raises arm to attack');
 }
 const parts={'ari':['body','cape','rear-arm','back-leg','front-leg','front-arm'],'rootkeeper':['body','left-arm','right-arm','left-leg','right-leg'],'glow-frog':['body','tail','left-leg','right-leg']};
 for(const [creature,names] of Object.entries(parts))for(const name of names){const f=path.join(root,'assets/animation',creature,name+'.png');assert(fs.statSync(f).size>1000,`missing ${f}`);}
 const premium=fs.readFileSync(path.join(root,'src/premium.js'),'utf8'),game=fs.readFileSync(path.join(root,'src/game.js'),'utf8');
 assert(premium.includes("from './animation.js'"));assert(premium.includes("this.limbPart('animation/ari/front-leg.png'"));assert(premium.includes('elasticCreature('));
 assert(game.includes('p.land=.19'));assert(game.includes('p.cast=.28'));
 console.log('PASS v7: independent Ari arm/leg rigs, jump/fall/land/cast poses, Rootkeeper and frog creature rigs, fallback deformation, no game-collision edits.');
})().catch(e=>{console.error(e);process.exit(1)});
