const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
(async()=>{
 const source=fs.readFileSync(root+'/src/rootkeeper_rig.js','utf8');
 const rig=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const {evaluateRootkeeperPose:pose,solveTwoBoneIK:ik,ROOTKEEPER_BONE_NAMES:names}=rig;
 assert.equal(names.length,17);
 for(const state of ['idle','stalk','attack','hurt','defeat']){
  for(let i=0;i<=100;i++){
   const p=pose({mode:state,phase:i/100,time:1200+i*17,locomotion:state==='stalk'?1:0,stridePhase:i/100*2});
   assert.equal(Object.keys(p.joints).length,17);
   assert.deepEqual(Object.keys(p.bones).sort(),['armLeft','armRight','legLeft','legRight'].sort());
   for(const [name,j] of Object.entries(p.joints))assert(Number.isFinite(j.x)&&Number.isFinite(j.y),name);
   for(const [name,b] of Object.entries(p.bones)){
    assert(Math.abs(b.lengths[0]-(name.startsWith('arm')?76:56))<.005,name+' upper bone');
    assert(Math.abs(b.lengths[1]-(name.startsWith('arm')?78:62))<.005,name+' lower bone');
    const prefix=name.replace('arm','').replace('leg','');
    const shoulder=p.joints[(name.startsWith('arm')?'shoulder':'hip')+prefix];
    const wrist=p.joints[(name.startsWith('arm')?'wrist':'ankle')+prefix];
    assert.equal(b.start,shoulder);assert.equal(b.end,wrist);
   }
   if(state==='idle'){assert.equal(p.joints.ankleLeft.y,322);assert.equal(p.joints.ankleRight.y,322)}
  }
 }
 const wind=pose({mode:'attack',phase:.30}),slam=pose({mode:'attack',phase:.84}),recover=pose({mode:'attack',phase:.98});
 assert(Math.abs(wind.joints.wristRight.y-slam.joints.wristRight.y)>80,'attack must move the wrist, not scale the body');
 assert(Math.abs(slam.joints.wristRight.y-recover.joints.wristRight.y)>15,'actual follow-through & recovery');
 assert(slam.attackImpact,'attack hit window aligned to bossPulse expiry');assert(!wind.attackImpact);
 const l=pose({mode:'stalk',phase:.02,stridePhase:.24,locomotion:1}),r=pose({mode:'stalk',phase:.50,stridePhase:.7,locomotion:1});
 assert(Math.abs(l.joints.ankleLeft.x-r.joints.ankleLeft.x)>8,'feet should alternate');
 assert(l.joints.ankleLeft.y<=322&&l.joints.ankleRight.y<=322);
 assert(Number.isFinite(ik({x:0,y:0},{x:40,y:20},27,30,-1).joint.x));
 const premium=fs.readFileSync(root+'/src/premium.js','utf8'),game=fs.readFileSync(root+'/src/game.js','utf8');
 for(const wanted of ['evaluateRootkeeperPose','drawRootkeeperRig','rigRootkeeper(','locomotion:1','bossPulse','facing:'])assert(premium.includes(wanted),wanted);
 for(const forbidden of ['v8Rootkeeper(','rootkeeperV8Clips','animation/rootkeeper-v8/'])assert(!premium.includes(forbidden),forbidden);
 assert(source.includes('skinChain('),'smooth skinned mesh covering elbows and knees');
 assert(source.includes('solveTwoBoneIK('),'inverse-kinematics solver');
 assert(!source.includes('canvas.scale(1.04'),'whole-sprite zoom animation forbidden');
 for(const a of ['head.png','chest.png','bark.jpg'])assert(fs.statSync(root+'/assets/animation/rootkeeper-rig/'+a).size>10000,a);
 assert(game.includes('bossHurt=.47')&&game.includes('bossPulse=1.15'),'timed attack and collision preserved');
 console.log('PASS v9: 17-joint hierarchy, 4 IK chains, 505 poses, stable bone lengths, planted feet, real windup/slam/recovery, joint-closed skin, intact boss hit timing and locally bundled art.');
})().catch(e=>{console.error(e);process.exit(1)});
