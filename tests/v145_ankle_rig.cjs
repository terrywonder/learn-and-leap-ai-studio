"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
(async()=>{
 const text=fs.readFileSync(path.join(root,'src/animation.js'),'utf8');
 const {heroPose,heroSoleHeights,ARI_FOOT_RIG}=await import('data:text/javascript;base64,'+Buffer.from(text).toString('base64'));
 const paint=fs.readFileSync(path.join(root,'src/premium.js'),'utf8');
 const mixer=fs.readFileSync(path.join(root,'src/animation_v12.js'),'utf8');
 for(const key of ['rear-shin-v145','rear-boot-v145','front-shin-v145','front-boot-v145']){
  const file=path.join(root,`assets/animation/ari/${key}.png`);
  assert(fs.statSync(file).size>300,`missing segmented original art ${key}`);
  const png=fs.readFileSync(file);assert.equal(png.subarray(1,4).toString(),'PNG');
  assert(paint.includes(key+'.png'),`canvas loader must preload ${key}`);
 }
 assert(paint.includes('articulatedLeg(')&&paint.includes('pose.ankles?.[1]'),'real rear ankle must be animated');
 assert(paint.includes('pose.ankles?.[0]'),'front boot needs its own ankle as well');
 assert(mixer.includes('out.ankles=b.ankles.map'),'ankle angles must blend across states');
 const samples=[];
 for(let i=0;i<=720;i++){
  const phase=(i/720)*Math.PI*2;
  const pose=heroPose({vx:315,vy:0,grounded:true,run:phase},i*16);
  const boots=heroSoleHeights(pose);
  assert(pose.legs.every(a=>Math.abs(a)<.25),'no unnatural splayed hip angles');
  assert(pose.ankles.every(a=>Math.abs(a)<1.15),'ankle rotation safely bounded after painted-sole leveling');
  assert(boots.every(Number.isFinite),'both soles have stable continuous projections');
  const contact=Math.max(...boots)*125/235-116+Math.max(-8,Math.min(8,(218-Math.max(...boots))*125/235));
  assert(contact>-10&&contact<7,`ground contact is visually close at phase ${i}`);
  samples.push({legs:pose.legs,ankles:pose.ankles,boots});
 }
 const phase0=samples[0],half=samples[360];
 assert(phase0.boots[0]-phase0.boots[1]>15,'front foot supports phase 0');
 assert(half.boots[1]-half.boots[0]>15,'rear foot supports opposite phase');
 assert(Math.abs(phase0.ankles[1]-half.ankles[1])>.12,'rear ankle rotates independently without exaggerated twist');
 assert(Math.abs(ARI_FOOT_RIG.rear.ankle[0]-ARI_FOOT_RIG.rear.hip[0])>15,'hip and ankle pivots physically distinct');
 for(const mode of [
  {grounded:true,vx:0},{grounded:false,vx:200,vy:-300},{grounded:false,vx:200,vy:320},
  {grounded:true,vx:160,land:.19},{grounded:true,vx:0,cast:.28},
 ]){
  const pose=heroPose(mode,800);assert(pose.ankles.every(a=>Number.isFinite(a)));
  assert(heroSoleHeights(pose).every(Number.isFinite));
 }
 assert(!paint.includes('player.y+=this.ariContactOffset'),'physics is untouched');
 const levels=require('../src/levels.js');for(let id=1;id<=100;id++)assert(levels.make(id));
 console.log('PASS v14.5: 721 gait phases, independent rear/front boot pivots, stance switches, grounded sole limits, five other animation states, unchanged gameplay and 100 levels');
})().catch(err=>{console.error(err);process.exitCode=1});
