const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
(async()=>{
 const src=fs.readFileSync(path.join(__dirname,'../src/animation_v12.js'),'utf8');
 // Module loader via source file URL; project is otherwise static, no build required.
 const tmp=path.join(__dirname,'../src/animation_v12.js');
 const pkg=path.join(__dirname,'../package.json');
 // Node can import as ES module because package.json has type=module only in the
 // temporary loader sandbox; avoid touching deployment files.
 const {execFileSync}=require('node:child_process');
 const url='data:text/javascript;base64,'+Buffer.from(src.replace("import {heroPose} from './animation.js';",'const heroPose=globalThis.__heroPose;')).toString('base64');
 const rawAnim=fs.readFileSync(path.join(__dirname,'../src/animation.js'),'utf8');
 const anim=await import('data:text/javascript;base64,'+Buffer.from(rawAnim).toString('base64'));
 globalThis.__heroPose=anim.heroPose;
 const {HeroAnimationMixer,RootkeeperAnimationMixer,bossState,atlasCoordinates}=await import(url);
 const boss=new RootkeeperAnimationMixer();
 let r=boss.update({bossPulse:0},1000);assert.equal(r.mode,'idle');
 r=boss.update({bossPulse:1.15},1100);assert.equal(r.mode,'attack');assert(r.previous&&r.previous.mode==='idle','attack must blend from idle');
 r=boss.update({bossPulse:.48},1780);assert(r.phase>.45,'boss must progress toward impact');
 r=boss.update({bossPulse:.04},2200);assert(r.phase>.95,'strike must approach damage at end of pulse');
 assert.equal(boss.update({bossHurt:.37,bossPulse:.04},2300).mode,'hurt','hurt has priority over attack');
 assert.equal(boss.update({bossDefeat:.75,bossPulse:.04,bossHurt:.2},2400).mode,'defeat','defeat has highest priority');
 let c=atlasCoordinates('idle',.9999);assert(c.next===0,'idle must loop without dead frame');
 c=atlasCoordinates('attack',.9999);assert.equal(c.current,23);assert.equal(c.next,23,'one-shot clips must not wrap');
 assert.throws(()=>atlasCoordinates('unknown',.5));
 for(const mode of ['idle','stalk','attack','hurt','defeat']){for(const p of [.001,.15,.37,.7,.999]){
  const coord=atlasCoordinates(mode,p);assert(coord.current>=0&&coord.next<coord.count);assert(coord.sub>=0&&coord.sub<1)
 }}
 const ari=new HeroAnimationMixer();let idle=ari.update({grounded:true,vx:0,vy:0,run:0},0);assert.equal(idle.mode,'idle');
 const states=[];
 for(let i=1;i<=60;i++){
  const t=i*16.7,p={grounded:true,vx:270,vy:0,run:i*.42,land:0,cast:0,face:1};const pose=ari.update(p,t);states.push(pose);
  for(const key of ['lean','bob','scarf','squash'])assert(Number.isFinite(pose[key]));
  assert(pose.legs.every(Number.isFinite)&&pose.arms.every(Number.isFinite));
 }
 assert(states.some(x=>x.mode==='run'));
 assert(states.some(x=>x.events.some(e=>e.type==='footstep')),'footstep events are contact-triggered');
 let jump=ari.update({grounded:false,vx:190,vy:-350,run:20},1020);assert.equal(jump.mode,'jump');
 for(let j=0;j<20;j++){jump=ari.update({grounded:false,vx:190,vy:-350,run:20},1036+j*16.7);assert(jump.events.every(e=>e.type!=='footstep'),'no footstep sounds in air')}
 const falling=ari.update({grounded:false,vx:190,vy:290,run:20},1400);assert.equal(falling.mode,'fall');
 const land=ari.update({grounded:true,vx:190,vy:0,run:20,land:.19},1416);assert.equal(land.mode,'land');assert(land.events.some(e=>e.type==='landing'));
 const again=ari.update({grounded:true,vx:190,vy:0,run:20,land:.16},1432);assert(!again.events.some(e=>e.type==='landing'),'land event must not repeat');
 const rendered=fs.readFileSync(path.join(__dirname,'../src/premium.js'),'utf8');
 assert(rendered.includes('this.heroMixer.update(player,t)')&&rendered.includes('this.bossMixer.update(state,t)'));
 assert(rendered.includes('this.drawRootFrame(mode,clip.current')&&rendered.includes('animation/rootkeeper-v11'));
 assert(!rendered.includes('c.scale(1,1+bossPulse)'),'avoid whole-body zoom');
 console.log('PASS v12: smooth Ari pose blending, contact events, fall/jump/land/cast state logic, priority boss state machine, attack-timing synchronization, safe animation atlas blending and preserved boss visuals.');
 delete globalThis.__heroPose;
})().catch(e=>{console.error(e);process.exitCode=1});
