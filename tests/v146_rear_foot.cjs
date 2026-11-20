'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
(async()=>{
 const code=fs.readFileSync(path.join(root,'src/animation.js'),'utf8');
 const {heroPose,heroSoleHeights,ARI_FOOT_RIG}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const painter=fs.readFileSync(path.join(root,'src/premium.js'),'utf8');
 const boot=fs.readFileSync(path.join(root,'assets/animation/ari/rear-boot-forward-v146.png'));
 assert.equal(boot.subarray(1,4).toString(),'PNG');
 assert.equal(boot.readUInt32BE(16),285);assert.equal(boot.readUInt32BE(20),235);
 assert(painter.includes('rear-boot-forward-v146.png'), 'rear forward-facing boot must load and draw in real renderer');
 assert(painter.includes("limb==='rear'?'rear-boot-forward-v146'"),'renderer must not display old backward boot during stance');
 assert(ARI_FOOT_RIG.rear.sole[0][0]>ARI_FOOT_RIG.rear.ankle[0], 'rear toe must extend FORWARD of ankle, not backwards');
 const P=phase=>heroPose({vx:315,grounded:true,vy:0,run:phase},0);
 const p0=P(0),p2=P(Math.PI),end=P(Math.PI*2);
 assert(p0.legLift[0]===0&&p0.legLift[1]<-10, 'front planted at first contact');
 assert(p2.legLift[1]===0&&p2.legLift[0]<-10, 'rear planted on alternating contact');
 for(const [pose,side] of [[p0,0],[p2,1]]){
   const hip=pose.legs[side]*(side===0?.79:.78);
   const combinedPitch=hip+pose.ankles[side];
   assert(Math.abs(combinedPitch-ARI_FOOT_RIG[side===0?'front':'rear'].plantPitch)<.07,'planted foot levels painted heel-to-toe line after hip motion');
 }
 assert(heroSoleHeights(p0)[0]-heroSoleHeights(p0)[1]>15,'swinging rear boot clears ground in first stance');
 assert(heroSoleHeights(p2)[1]-heroSoleHeights(p2)[0]>15,'swinging front boot clears ground in next stance');
 for(let k=0;k<=720;k++){
   const phase=k*2*Math.PI/720,pose=P(phase), soles=heroSoleHeights(pose);
   assert(pose.mode==='run');assert(pose.legs.every(x=>Number.isFinite(x)&&Math.abs(x)<.25));
   assert(pose.ankles.every(x=>Number.isFinite(x)&&Math.abs(x)<1.15));
   assert(pose.legLift.every(x=>x<=0&&x>=-12));
   assert(soles.every(x=>Number.isFinite(x)));
   const lock=Math.max(-8,Math.min(8,(218-Math.max(...soles))*125/235));
   const ground=Math.max(...soles)*125/235-116+lock;
   assert(ground>-10&&ground<7,`visual foot collision plane ${phase}`);
 }
 const r0=P(0),r2=P(2*Math.PI);
 for(const key of ['legs','legLift','ankles'])r0[key].forEach((v,i)=>assert(Math.abs(v-r2[key][i])<1e-9,'cyclic pose is seamless'));
 for(const state of [{grounded:false,vx:200,vy:-200},{grounded:false,vx:200,vy:300},{grounded:true,vx:0}]){
  const p=heroPose(state,1000);assert(heroSoleHeights(p).every(Number.isFinite));
 }
 const levels=require('../src/levels.js');for(let id=1;id<=100;id++)assert(levels.make(id),'all 100 levels still exist');
 assert(!painter.includes('player.y+=this.ariContactOffset'),'visual correction must not modify collision physics');
 console.log('PASS v14.6: independent ankle and forward rear sole; 721 phases; planted-foot alignment; support swaps; continuity; air/idle; 100 levels');
})().catch(e=>{console.error(e);process.exitCode=1});
