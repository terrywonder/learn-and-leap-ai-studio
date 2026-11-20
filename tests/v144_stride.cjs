'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const animation=fs.readFileSync(path.join(root,'src/animation.js'),'utf8');
const premium=fs.readFileSync(path.join(root,'src/premium.js'),'utf8');
const mixer=fs.readFileSync(path.join(root,'src/animation_v12.js'),'utf8');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
(async()=>{
 const {heroPose,heroSoleHeights}=await import('data:text/javascript;base64,'+Buffer.from(animation).toString('base64'));
 const stances=[];
 for(let i=0;i<=240;i++){
  const phase=i*Math.PI/120, player={grounded:true,vx:265,vy:0,run:phase};
  const pose=heroPose(player,i*16.7);
  assert.equal(pose.mode,'run');
  assert(pose.legs.every(a=>Math.abs(a)<.30),'no exaggerated hip rotation');
  assert(pose.legLift.every(a=>a<=0&&a>=-12),'swing foot clearance is bounded');
  const [front,rear]=heroSoleHeights(pose);
  const max=Math.max(front,rear);
  const contact=clamp((218-max)*(125/235),-8,8);
  const low=(max*125/235-116)+contact;
  assert(low>=-10&&low<7,`one boot must remain close to collision plane (${i})`);
  stances.push([front,rear]);
 }
 const a=heroPose({grounded:true,vx:265,vy:0,run:0},1400);
 const b=heroPose({grounded:true,vx:265,vy:0,run:Math.PI},1500);
 assert(a.legLift[1]<-10&&a.legLift[0]===0,'front supports, rear lifts');
 assert(b.legLift[0]<-9&&b.legLift[1]===0,'rear supports, front lifts');
 assert(stances[0][0]-stances[0][1]>15,'rear clears ground in front stance');
 assert(stances[120][1]-stances[120][0]>15,'front clears ground in rear stance');
 const idle=heroPose({grounded:true,vx:0,run:2},0);
 assert.deepEqual(idle.legLift,[0,0]);
 for(let i=0;i<20;i++){
  const p=heroPose({grounded:false,vx:180,vy:i%2?-340:340,run:i},i*14);
  assert.deepEqual(p.legLift,[0,0],'jump/fall preserve art without ground-lock overlays');
 }
 assert(mixer.includes('out.legLift=b.legLift.map'),'the animation mixer blends clearance on transitions');
 assert(premium.includes('pose.legLift?.[1]||0')&&premium.includes('pose.legLift?.[0]||0'),'new offsets are drawn on articulated sprites');
 assert(premium.includes('heroSoleHeights(pose)'),'contact lock uses true rotated ankle sole points');
 assert(premium.includes('back-leg-v141.png')&&premium.includes('front-leg.png'),'approved sprite layers are unchanged');
 assert(!animation.includes('player.y='),'animation pose must not modify physics');
 const levels=require('../src/levels.js');for(let id=1;id<=100;id++)assert(levels.make(id));
 console.log('PASS v14.4: 241 real gait-phase samples, alternating planted boot and trailing foot, bounded art-only rig, jump/fall, blending and 100 levels');
})().catch(e=>{console.error(e);process.exitCode=1});
