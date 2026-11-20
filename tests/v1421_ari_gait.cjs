'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const animation=fs.readFileSync(path.join(root,'src/animation.js'),'utf8');
const prem=fs.readFileSync(path.join(root,'src/premium.js'),'utf8');
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
(async()=>{
 const {heroPose}=await import('data:text/javascript;base64,'+Buffer.from(animation).toString('base64'));
 const {heroSoleHeights}=await import('data:text/javascript;base64,'+Buffer.from(animation).toString('base64'));
 assert(prem.includes('heroSoleHeights(pose)'), 'renderer must ground-lock the independently rotated ankle soles');
 const contact=(pose,player)=>!player.grounded||['jump','fall','hurt'].includes(pose.mode)?0:clamp((218-Math.max(...heroSoleHeights(pose)))*(125/235),-8,8);
 const idle=heroPose({grounded:true,vx:0,vy:0,run:0},0);
 assert(Math.abs(idle.legs[0])<.2&&Math.abs(idle.legs[1])<.2,'rested boots should not be crossed');
 const run=[];
 for(let i=0;i<=120;i++){
  const player={grounded:true,vx:315,vy:0,run:i*Math.PI/30};const pose=heroPose(player,i*16.6);
  const worldOff=contact(pose,player);
  assert(Number.isFinite(worldOff)&&Math.abs(worldOff)<=8,'bounded render-only contact adjustment');
  const sole=Math.max(...heroSoleHeights(pose));
  const onscreen=(sole*125/235-116)+worldOff;
  assert(onscreen>-10&&onscreen<7,'rotated boot sole should align with collision ground');
  run.push([pose.legs[0],pose.legs[1]]);
 }
 assert(Math.abs(run[0][0]-run[30][0])>.01,'front leg has visible stride motion');
 assert(Math.abs(run[0][1]-run[30][1])>.01,'rear leg has visible stride motion');
 const jump=heroPose({grounded:false,vx:190,vy:-420,run:0},1000);
 const fall=heroPose({grounded:false,vx:190,vy:430,run:0},1100);
 assert(jump.legs[0]<fall.legs[0]&&jump.legs[1]>fall.legs[1],'jump and fall remain distinct');
 assert.equal(contact(jump,{grounded:false}),0,'no phantom grounded foot lock in air');
 assert.equal(contact(fall,{grounded:false}),0,'fall unaffected by grounding offset');
 assert(prem.includes('feet+pose.bob+this.ariContactOffset(pose,player)'),'foot correction is wired into actual game actor');
 assert(prem.includes('c.scale(player.face===-1?-1:1,1)'),'left/right symmetry retained');
 assert(prem.includes("back-leg-v141.png")&&prem.includes("front-leg.png"),'approved painted boots preserved');
 assert(!prem.includes('player.y+=this.ariContactOffset'),'physics not modified');
 const levels=require('../src/levels.js');for(let id=1;id<=100;id++)assert(levels.make(id),'all levels intact');
 console.log('PASS v14.2.1: 121 stride samples, planted-sole tolerance, idle/run/jump/fall, 2 boots, symmetric facing, untouched physics and 100 levels');
})().catch(e=>{console.error(e);process.exitCode=1});
