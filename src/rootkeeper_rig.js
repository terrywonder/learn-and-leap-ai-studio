/**
 * Rootkeeper v9: actual articulated 2D skeleton with a hierarchical torso,
 * shoulder/elbow/wrist and hip/knee/ankle chains, planted-foot gait and
 * analytic two-bone inverse kinematics. No per-frame sprite atlases, zoom,
 * whole-character warps or detached limb cut-out holes.
 *
 * Coordinate convention: 300 x 340 design units; feet planted at y=322.
 * Poses returned are deterministic and render independently of game physics.
 */
const PI=Math.PI,TAU=PI*2;
export const ROOTKEEPER_BONE_NAMES=Object.freeze([
 'root','pelvis','spine','neck','head',
 'shoulderLeft','elbowLeft','wristLeft','shoulderRight','elbowRight','wristRight',
 'hipLeft','kneeLeft','ankleLeft','hipRight','kneeRight','ankleRight'
]);
export const ROOTKEEPER_RIG_VERSION='v10-organic-skin-17-bone';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const pt=(x,y)=>({x,y});
const dist=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
const polar=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const add=(a,b)=>pt(a.x+b.x,a.y+b.y);
const mul=(a,k)=>pt(a.x*k,a.y*k);
/** Solve one articulated limb: endpoints stay attached, both segments keep length. */
export function solveTwoBoneIK(origin,target,upperLength,lowerLength,bend=1){
 const d=dist(origin,target);
 const L=clamp(d,Math.abs(upperLength-lowerLength)+.001,upperLength+lowerLength-.001);
 const ux=d>1e-6?(target.x-origin.x)/d:1,uy=d>1e-6?(target.y-origin.y)/d:0;
 const far=pt(origin.x+ux*L,origin.y+uy*L);
 const along=(upperLength*upperLength+L*L-lowerLength*lowerLength)/(2*L);
 const across=Math.sqrt(Math.max(0,upperLength*upperLength-along*along));
 const joint=pt(origin.x+ux*along-uy*across*bend,origin.y+uy*along+ux*across*bend);
 return {start:origin,joint,end:far,lengths:[dist(origin,joint),dist(joint,far)],clamped:Math.abs(d-L)>.005};
}
function footCycle(f,base,move){
 // 61% stance, 39% toe-off/flight; planted feet move opposite the translating root.
 if(move<.02)return pt(base,322);
 f=(f%1+1)%1;
 const stride=move*25.62;
 if(f<.61)return pt(base+stride*(.5-f/.61),322);
 const swing=smooth((f-.61)/.39);
 return pt(base+stride*(-.5+swing),322-21*move*Math.sin(PI*swing));
}
/**
 * state: idle|stalk|attack|hurt|defeat
 * phase: 0..1 state-cycle phase, locomotion: 0..1, stridePhase: ground-distance driven,
 * facing: +/-1. World physics and collision boxes are NOT modified by this rig.
 */
export function evaluateRootkeeperPose(options={}){
 const mode=['idle','stalk','attack','hurt','defeat'].includes(options.mode)?options.mode:'idle';
 const phase=clamp(options.phase??0,0,1),speed=clamp(options.locomotion??(mode==='stalk'?1:0),0,1);
 const gait=options.stridePhase??phase;
 const cyc=gait*TAU;
 const wind=mode==='attack'?smooth(phase/.48)*(1-smooth((phase-.69)/.13)):0;
 const impact=mode==='attack'?smooth((phase-.69)/.16)*(1-smooth((phase-.90)/.1)):0;
 const recoil=mode==='hurt'?Math.sin(PI*phase):0;
 const collapse=mode==='defeat'?smooth(phase):0;
 const breath=Math.sin((options.time??phase*2000)*.003)*1.45;
 const gaitBob=speed*(1.3*Math.cos(cyc*2));
 const hipX=150+speed*Math.sin(cyc)*1.8-9*wind+12*impact-9*recoil-35*collapse;
 const hipY=218+breath*.3+gaitBob+12*wind+7*impact-8*recoil+54*collapse;
 const lean=speed*.025*Math.sin(cyc)+.06*wind-.13*impact+.19*recoil+.60*collapse;
 const pelvis=pt(hipX,hipY),spine=pt(hipX-8+lean*37,hipY-72),neck=pt(spine.x+3+lean*12,spine.y-46);
 const shoulderLeft=pt(spine.x-47,spine.y-8),shoulderRight=pt(spine.x+53,spine.y-5);
 const hipLeft=pt(pelvis.x-28,pelvis.y+3),hipRight=pt(pelvis.x+33,pelvis.y+1);
 const walking=speed>.02?speed:0;
 const leftFoot=footCycle(gait,113,walking),rightFoot=footCycle(gait+.5,196,walking);
 // Feet remain at ground contact in stance and retain a true swing arc.
 const ankleLeft=pt(leftFoot.x+2*collapse,leftFoot.y+5*collapse),ankleRight=pt(rightFoot.x+3*collapse,rightFoot.y+3*collapse);
 const legLeft=solveTwoBoneIK(hipLeft,ankleLeft,56,62,-1);
 const legRight=solveTwoBoneIK(hipRight,ankleRight,56,62,1);
 const baseLeft=pt(62+10*Math.sin(cyc)*walking,250-4*Math.cos(cyc)*walking);
 let baseRight=pt(257-13*Math.sin(cyc)*walking,253+3*Math.cos(cyc)*walking);
 // Wind up -> hold -> arm acceleration -> impact -> follow-through / recovery.
 if(mode==='attack'){
  const guard=smooth(phase/.50),strike=smooth((phase-.69)/.16),recover=smooth((phase-.88)/.12);
  const from=pt(255-3*guard,250-142*guard);
  const to=pt(273,276);
  baseRight=pt(mix(from.x,to.x,strike),mix(from.y,to.y,strike));
  baseRight=pt(mix(baseRight.x,257,recover),mix(baseRight.y,253,recover));
 }
 if(recoil){baseRight=pt(245-48*recoil,255-32*recoil);baseLeft.x-=20*recoil;}
 if(collapse){baseRight.y+=32*collapse;baseLeft.y+=30*collapse;baseRight.x-=34*collapse;}
 const armLeft=solveTwoBoneIK(shoulderLeft,baseLeft,76,78,-1);
 const armRight=solveTwoBoneIK(shoulderRight,baseRight,76,78,1);
 const head=pt(neck.x+4+6*recoil+6*impact,neck.y-17+breath*.7+4*wind+17*collapse);
 const joints={root:pt(150,322),pelvis,spine,neck,head,
  shoulderLeft,elbowLeft:armLeft.joint,wristLeft:armLeft.end,
  shoulderRight,elbowRight:armRight.joint,wristRight:armRight.end,
  hipLeft,kneeLeft:legLeft.joint,ankleLeft:legLeft.end,
  hipRight,kneeRight:legRight.joint,ankleRight:legRight.end};
 return {mode,phase,wind,impact,recoil,collapse,lean,facing:options.facing===-1?-1:1,joints,
  bones:{legLeft,legRight,armLeft,armRight},locomotion:walking,footContacts:[leftFoot.y===322,rightFoot.y===322],
  attackImpact:mode==='attack'&&phase>=.81&&phase<.91};
}

// --- v10 Organic character skin ---
// Rendered by bones rather than whole-body image transforms. A continuous bark
// silhouette spans every IK knee/elbow, with layered fibres over the joints.
const hash=(v)=>{let n=Math.sin(v*127.1+18.7)*43758.5453;return n-Math.floor(n)};
const interp=(a,b,t)=>a+(b-a)*t;
const vadd=(a,b,s=1)=>pt(a.x+b.x*s,a.y+b.y*s);
function leaf(c,x,y,size,angle,color){
 c.save();c.translate(x,y);c.rotate(angle);
 c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(size*.63,-size*.53,size,0);c.quadraticCurveTo(size*.63,size*.43,0,0);c.closePath();c.fillStyle=color;c.fill();
 c.strokeStyle='#ccde9190';c.lineWidth=.7;c.beginPath();c.moveTo(1,0);c.lineTo(size*.83,0);c.stroke();c.restore();
}
function rootStroke(c,a,b,thick,shade='#624829'){
 c.save();c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(a.x,a.y);c.quadraticCurveTo(a.x+(b.x-a.x)*.58-4,a.y+(b.y-a.y)*.32,b.x,b.y);
 c.lineWidth=thick+3;c.strokeStyle='#16291e';c.stroke();c.lineWidth=thick;c.strokeStyle=shade;c.stroke();c.lineWidth=Math.max(1,thick*.17);c.strokeStyle='#d7be8366';c.stroke();c.restore();
}
function sampleIK(chain){
 const P=[chain.start,chain.joint,chain.end];const out=[];
 // Catmull-style Hermite spline; contiguous at knee/elbow with no gaps.
 const tang=[pt((P[1].x-P[0].x)*.82,(P[1].y-P[0].y)*.82),pt((P[2].x-P[0].x)*.45,(P[2].y-P[0].y)*.45),pt((P[2].x-P[1].x)*.82,(P[2].y-P[1].y)*.82)];
 for(let seg=0;seg<2;seg++)for(let i=0;i<22;i++){
  const t=i/22,t2=t*t,t3=t2*t,h0=2*t3-3*t2+1,h1=t3-2*t2+t,h2=-2*t3+3*t2,h3=t3-t2;
  out.push(pt(h0*P[seg].x+h1*tang[seg].x+h2*P[seg+1].x+h3*tang[seg+1].x,h0*P[seg].y+h1*tang[seg].y+h2*P[seg+1].y+h3*tang[seg+1].y));
 }
 out.push(P[2]);return out;
}
function paintBarkChain(c,chain,thick,resources,seed,side=1){
 const path=sampleIK(chain),left=[],right=[];
 for(let i=0;i<path.length;i++){
  const p=path[i],a=path[Math.max(0,i-1)],b=path[Math.min(path.length-1,i+1)],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;
  const n=pt(-dy/d,dx/d),t=i/(path.length-1),r=thick*(.54-.20*t)*(1+.044*Math.sin(t*36+seed)+.026*Math.sin(t*80+seed));
  left.push(vadd(p,n,r));right.push(vadd(p,n,-r));
 }
 c.save();c.beginPath();c.moveTo(left[0].x,left[0].y);
 for(let i=1;i<left.length;i++)c.lineTo(left[i].x,left[i].y);
 for(let i=right.length-1;i>=0;i--)c.lineTo(right[i].x,right[i].y);c.closePath();
 const grad=c.createLinearGradient(chain.start.x-35,chain.start.y-20,chain.end.x+45,chain.end.y+28);
 grad.addColorStop(0,'#bca074');grad.addColorStop(.24,'#7a603a');grad.addColorStop(.51,'#3b3021');grad.addColorStop(.79,'#59673a');grad.addColorStop(1,'#202c1e');
 c.fillStyle=grad;c.strokeStyle='#17261c';c.lineWidth=4;c.lineJoin='round';c.fill();c.stroke();c.clip();
 const bb={x:Infinity,y:Infinity,x2:-Infinity,y2:-Infinity};for(const p of [...left,...right]){bb.x=Math.min(bb.x,p.x);bb.y=Math.min(bb.y,p.y);bb.x2=Math.max(bb.x2,p.x);bb.y2=Math.max(bb.y2,p.y)}
 if(resources.bark?.naturalWidth){c.globalAlpha=.52;c.drawImage(resources.bark,bb.x-10,bb.y-10,Math.max(80,bb.x2-bb.x+20),Math.max(80,bb.y2-bb.y+20));c.globalAlpha=1}
 // Interlaced fibres follow the curvature across the real joint.
 for(let k=-4;k<=4;k++){
  c.beginPath();for(let i=0;i<path.length;i+=2){const p=path[i],a=path[Math.max(0,i-1)],b=path[Math.min(path.length-1,i+1)],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;
   const t=i/(path.length-1),offset=(k/5*thick*.37)+Math.sin(t*14+seed+k)*2.9,q=pt(p.x-dy/d*offset,p.y+dx/d*offset);
   if(i===0)c.moveTo(q.x,q.y);else c.lineTo(q.x,q.y);
  }
  c.strokeStyle=k%2===0?'#c5a66e81':'#241e18b0';c.lineWidth=k%2===0?1.35:2.5;c.stroke();
 }
 c.restore();
 // Organic moss patches grow from the same bone-parametric coordinates every frame.
 for(let j=0;j<14;j++){
  const t=.10+(j/14)*.81,p=path[Math.floor(t*(path.length-1))],a=path[Math.max(0,Math.floor(t*(path.length-1))-1)],b=path[Math.min(path.length-1,Math.floor(t*(path.length-1))+1)],d=Math.hypot(b.x-a.x,b.y-a.y)||1;
  const nx=-(b.y-a.y)/d,ny=(b.x-a.x)/d,sign=j%3===0?-1:1,off=thick*.38*sign;
  const x=p.x+nx*off,y=p.y+ny*off;if(j%3===0){leaf(c,x,y,8+5*hash(j+seed),Math.atan2(ny,nx)+(sign<0?PI:0),'#6c983fba');}
  else{c.fillStyle=j%2?'#a1bb6e':'#477637';c.beginPath();c.ellipse(x,y,2.8+hash(j)*2,1.8,0,0,TAU);c.fill()}
 }
}
function paintRootHand(c,p,dir,cast=0){
 const palm=pt(p.x+dir*2,p.y+3);c.save();
 // Exaggerated branching claw silhouette; deliberately NO discs or circles.
 const knuckle=[pt(palm.x-dir*8,palm.y-6),pt(palm.x+dir*12,palm.y+6)];
 rootStroke(c,knuckle[0],knuckle[1],20,'#76512d');
 const tips=[pt(palm.x-dir*24,palm.y+26),pt(palm.x-dir*4,palm.y+36),pt(palm.x+dir*18,palm.y+32)];
 for(let i=0;i<3;i++){
  const start=pt(palm.x+dir*(i-1)*9,palm.y+5),end=tips[i];
  rootStroke(c,start,end,8-i,'#5b4b2d');
  c.fillStyle='#d7c797';c.beginPath();c.moveTo(end.x-4,end.y-5);c.lineTo(end.x+dir*3,end.y+13);c.lineTo(end.x+4,end.y-5);c.closePath();c.fill();
 }
 if(cast>.03){c.globalAlpha=Math.min(.85,cast*.65);c.shadowColor='#79ff96';c.shadowBlur=16;c.strokeStyle='#8cffa2';c.lineWidth=2;c.beginPath();c.arc(palm.x,palm.y,16+cast*10,-PI*.5,PI*.7);c.stroke();}
 c.restore();
}
function paintRootFoot(c,p,dir,phase=0){
 // Three splayed roots converge at the animated ankle. Toes reach the actual ground.
 const sole=pt(p.x,p.y+2),forward=dir>0?1:-1;c.save();
 rootStroke(c,pt(sole.x,sole.y-17),pt(sole.x+forward*3,sole.y+1),22,'#58462b');
 for(let i=-1;i<=1;i++){
  const end=pt(sole.x+forward*(i+1)*14+dir*6,sole.y+10-(Math.abs(i)*1.5));
  rootStroke(c,pt(sole.x+dir*(i-1)*4,sole.y-2),end,10-Math.abs(i)*2,'#554329');
  c.fillStyle='#c7b282';c.beginPath();c.moveTo(end.x-2,end.y-4);c.lineTo(end.x+forward*8,end.y+4);c.lineTo(end.x+2,end.y-6);c.fill();
 }
 c.restore();
}
function paintRootTorso(c,pose,res){
 const J=pose.joints,spine=J.spine,pelvis=J.pelvis,neck=J.neck,shoulders=[J.shoulderLeft,J.shoulderRight];
 // Natural continuous shape with bark plates; image art is attached to the rig.
 c.save();c.beginPath();c.moveTo(shoulders[0].x-19,shoulders[0].y-10);
 c.bezierCurveTo(shoulders[0].x-34,shoulders[0].y+32,pelvis.x-66,pelvis.y+4,pelvis.x-39,pelvis.y+26);
 c.quadraticCurveTo(pelvis.x,pelvis.y+40,pelvis.x+38,pelvis.y+23);
 c.bezierCurveTo(pelvis.x+65,pelvis.y-25,shoulders[1].x+27,shoulders[1].y+20,shoulders[1].x+18,shoulders[1].y-10);
 c.bezierCurveTo(spine.x+36,spine.y-34,spine.x-41,spine.y-44,shoulders[0].x-19,shoulders[0].y-10);c.closePath();
 let bg=c.createLinearGradient(pelvis.x-50,spine.y-35,pelvis.x+60,pelvis.y+20);bg.addColorStop(0,'#9c8458');bg.addColorStop(.3,'#4a3b28');bg.addColorStop(.7,'#36432b');bg.addColorStop(1,'#172a1d');c.fillStyle=bg;c.lineWidth=4;c.strokeStyle='#20321f';c.fill();c.stroke();c.clip();
 if(res.bark?.naturalWidth){c.globalAlpha=.8;c.drawImage(res.bark,pelvis.x-92,spine.y-57,190,202);c.globalAlpha=1}
 c.restore();
 // The original illustration becomes the centrepiece instead of an empty brown bib.
 if(res.chest?.naturalWidth){c.save();c.globalAlpha=.98;
  c.drawImage(res.chest,spine.x-76,spine.y-36,156,169);c.restore()}
 // Three braided roots cross the chest to bridge the shoulder transitions.
 for(let i=0;i<3;i++){
  const a=pt(spine.x-44+i*7,spine.y+25+i*3),b=pt(spine.x+45-i*6,spine.y+60+i*9);
  rootStroke(c,a,b,6.4-i*.8,i%2===0?'#6a5633':'#9a7847');
 }
 // Ornamental hanging vines, animated with the torso but never disconnected.
 for(let i=0;i<7;i++){
  const x=pelvis.x-42+i*14,y=pelvis.y-17;
  c.strokeStyle=i%2?'#75a957a9':'#426c36d0';c.lineWidth=2.3;c.beginPath();c.moveTo(x,y-42);
  c.quadraticCurveTo(x+6*Math.sin(i+pose.phase*4),y-3,x-3,y+14);c.stroke();
  if(i%2===0)leaf(c,x-3,y-9,9,i*.34,'#729a4d');
 }
 // Shoulder pauldrons made of overlapping, tapered bark scales.
 for(let side of [-1,1]){
  const s=side<0?J.shoulderLeft:J.shoulderRight;
  for(let i=0;i<3;i++){
   const x=s.x+side*(-7+i*7),y=s.y-13+i*8;
   c.fillStyle=['#644b2e','#85633b','#3c5530'][i];c.beginPath();c.moveTo(x-side*20,y-8);
   c.quadraticCurveTo(x+side*2,y-19,x+side*28,y+2);
   c.quadraticCurveTo(x+side*6,y+18,x-side*20,y-8);c.closePath();c.fill();
   c.strokeStyle='#d0b07881';c.lineWidth=1;c.stroke();
  }
 }
}
function paintRootHead(c,pose,res){
 const h=pose.joints.head;c.save();c.translate(h.x,h.y);c.rotate(pose.lean*.29+pose.recoil*.13+pose.collapse*.22);
 if(res.head?.naturalWidth){
  // Deep, leaf-edged antlers keep the dramatic face of the original boss.
  c.shadowColor='#11251b88';c.shadowBlur=5;c.drawImage(res.head,-93,-107,187,147);
 }else{
  c.fillStyle='#5b4730';c.beginPath();c.ellipse(0,-21,40,55,0,0,TAU);c.fill();
 }
 const f=.75+.25*Math.sin(pose.phase*TAU);
 c.globalAlpha=.78*f;c.shadowBlur=10;c.shadowColor='#8cfb70';c.fillStyle='#adff7c';
 c.beginPath();c.ellipse(-15,-18,3.4,2.5,0,0,TAU);c.ellipse(18,-18,3.4,2.5,0,0,TAU);c.fill();c.restore();
}
export function drawRootkeeperRig(c,resources,x,y,w,h,pose,debug=false){
 if(!pose?.joints)return false;
 c.save();c.translate(x,y);c.scale(w/300,h/340);
 if(pose.facing===-1){c.translate(300,0);c.scale(-1,1)}
 const J=pose.joints,B=pose.bones;
 c.save();c.fillStyle='#102d2055';c.beginPath();c.ellipse(155,328,74,8,0,0,TAU);c.fill();c.restore();
 // Art-order yields convincing occlusion (rear limb, torso, front limb).
 paintBarkChain(c,B.legLeft,44,resources,13,-1);paintRootFoot(c,J.ankleLeft,-1);
 paintBarkChain(c,B.armLeft,40,resources,21,-1);paintRootHand(c,J.wristLeft,-1);
 paintBarkChain(c,B.legRight,49,resources,35,1);paintRootFoot(c,J.ankleRight,1);
 paintRootTorso(c,pose,resources);
 paintRootHead(c,pose,resources);
 paintBarkChain(c,B.armRight,43,resources,47,1);paintRootHand(c,J.wristRight,1,pose.wind+pose.impact);
 // Green magic remains a readable attack telegraph, tied to actual strike frames.
 if(pose.attackImpact){c.save();c.globalAlpha=.72;c.strokeStyle='#a1ff85';c.shadowColor='#83ff88';c.shadowBlur=15;c.lineWidth=4;
  c.beginPath();c.arc(J.wristRight.x+6,J.wristRight.y+2,21,-PI*.5,PI*.8);c.stroke();c.restore()}
 if(debug){
  c.save();c.lineWidth=2;c.font='10px monospace';
  for(const limb of Object.values(B)){for(const [a,b] of [[limb.start,limb.joint],[limb.joint,limb.end]]){
   c.strokeStyle='#00eaff';c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}}
  for(const [name,p] of Object.entries(J)){c.fillStyle='#fa7d62';c.beginPath();c.arc(p.x,p.y,3.2,0,TAU);c.fill();
   if(['shoulderRight','elbowRight','wristRight','hipRight','kneeRight','ankleRight'].includes(name)){c.fillStyle='white';c.fillText(name,p.x+4,p.y-5)}}c.restore();
 }
 c.restore();return true;
}
