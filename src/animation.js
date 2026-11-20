/**
 * Learn & Leap v7 articulated animation poses.
 * Pure pose calculations: no canvas dependency; suitable for regression tests.
 * All angles are radians and tied to real gameplay velocity and state.
 */
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const lerp=(a,b,t)=>a+(b-a)*t;
// Painted foot rig joint positions, source-space 285×235. Shared with the Canvas
// rendering contact solver so ground lock evaluates the *rotated* sole, not hip
// positions estimated from the old single-piece sprites.
export const ARI_FOOT_RIG=Object.freeze({
 front:{hip:[187,141],ankle:[217,166],sole:[[236,202],[254,189],[245,201]],plantPitch:Math.atan2(13,18)},
 rear:{hip:[147,145],ankle:[120,168],sole:[[153,183],[137,204],[121,203]],plantPitch:Math.atan2(21,16)}
});
export function heroSoleHeights(pose){
 const calc=(part,hipAngle,ankleAngle,lift)=>{
  const {hip,ankle,sole}=ARI_FOOT_RIG[part],c=Math.cos(hipAngle),s=Math.sin(hipAngle),ac=Math.cos(ankleAngle),as=Math.sin(ankleAngle);
  return Math.max(...sole.map(([px,py])=>{
   const dx=px-ankle[0],dy=py-ankle[1];
   const fx=ankle[0]+dx*ac-dy*as,fy=ankle[1]+dx*as+dy*ac;
   return hip[1]+(fx-hip[0])*s+(fy-hip[1])*c+lift;
  }));
 };
 return [calc('front',pose.legs[0]*.79,pose.ankles?.[0]||0,pose.legLift?.[0]||0),
         calc('rear',pose.legs[1]*.78,pose.ankles?.[1]||0,pose.legLift?.[1]||0)];
}

export function heroPose(player,time=0){
 const p=player||{},velocity=clamp(Math.abs(p.vx||0)/265,0,1.25);
 const cycle=Number(p.run)||0,step=Math.sin(cycle),returnStep=Math.sin(cycle+Math.PI);
 const grounded=Boolean(p.grounded),air=!grounded,descending=(p.vy||0)>80;
 const land=clamp((p.land||0)/.19,0,1),cast=clamp((p.cast||0)/.28,0,1);
 const hurt=clamp((p.hurt||0)/.25,0,1);
 const rest=Math.sin(time*.0022)*.022;
 // v14.2.1: small relaxed stance avoids the exaggerated boot-crossing idle pose.
 let legs=[.10+.03*rest,-.11+.02*rest],arms=[-.08+.04*rest,.06-.02*rest];
 // Render-only sprite travel in the *existing 285x235 artwork coordinate system*.
 // Feet alternate contact: one painted boot plants while the other clears the turf.
 let legLift=[0,0],ankles=[0,0];
 let bob=Math.sin(time*.003)*.8,lean=.018*Math.sin(time*.0015),squash=1;
 let mode='idle';
 if(grounded&&velocity>.06){
  mode='run';
  // v14.6: 2-foot gait with rear sole turned FORWARD on support.
  // The approved rear boot was permanently backwards in the old atlas, even
  // while supporting weight. Its source pixels are ankle-mirrored in v14.6;
  // paint and shading are otherwise unchanged. Run logic is phase-continuous.
  const cadence=clamp(velocity,0,1),phase=((cycle%(Math.PI*2))+(Math.PI*2))%(Math.PI*2);
  const wave=Math.cos(phase);
  const frontSupport=(1+wave)*.5,rearSupport=1-frontSupport;
  // Positive rear-hip angle trails the leg; negative pulls it under the pelvis.
  // Keep rotations small because the illustrated thighs already have shape.
  legs=[(-.066+.17*wave)*cadence,(.225*wave)*cadence];
  legLift=[-12*rearSupport*cadence,-12*frontSupport*cadence];
  // The original painted boot atlas has a 35deg (front) and 53deg (rear)
  // toe-up bias. First level the original heel-to-toe contact line, then
  // cancel hip rotation at the ankle. Without the calibration, the foot
  // appears kicked up even when code thinks it is flat.
  // Apply modest pitch only during push-off/recovery.
  const frontHip=legs[0]*.79,rearHip=legs[1]*.78;
  const frontPitch=(-.025*frontSupport-.14*rearSupport)*cadence;
  const rearPitch=(-.02*rearSupport+.12*frontSupport)*cadence;
  ankles=[ARI_FOOT_RIG.front.plantPitch-frontHip+frontPitch,ARI_FOOT_RIG.rear.plantPitch-rearHip+rearPitch];
  arms=[-.06-returnStep*.55*velocity,.06-step*.58*velocity];
  bob=-Math.abs(Math.sin(cycle))*1.65*cadence;
  lean=-.045*cadence;
 }
 if(air){
  mode=descending?'fall':'jump';const descent=descending?1:0;
  legs=[lerp(-.34,.24,descent),lerp(.19,-.24,descent)];
  arms=[lerp(-.34,.24,descent),lerp(.25,-.32,descent)];
  bob=0;lean=clamp((p.vy||0)*.00011,-.15,.13);
 }
 if(land>0){mode='land';squash=1-.12*land;legs[0]+=.12*land;legs[1]-=.06*land;arms[0]+=.20*land;arms[1]-=.23*land;bob=1.5*land}
 if(cast){mode='cast';arms[1]-=1.04*cast;arms[0]+=.24*cast;lean-=.1*cast}
 if(hurt){mode='hurt';arms=[-.74*hurt,.67*hurt];lean+=.21*hurt}
 return {mode,legs,legLift,ankles,arms,bob,lean,squash,scarf:-.10+.09*Math.sin(time*.008+cycle*.55)*(grounded?.65:1.5),velocity,land,cast};
}
export function creaturePose(time=0,seed=0,type='rootkeeper',alert=0){
 const cycle=time*.006+seed*1.97;const stride=Math.sin(cycle),bounce=Math.abs(Math.sin(cycle));
 const attack=clamp(alert,0,1);
 if(type==='rootkeeper')return{mode:attack?'attack':'stalk',bodyLean:Math.sin(cycle*.4)*.045,scaleY:1-.015*bounce,bob:-3.5*bounce,legs:[.14+stride*.26,-.12-stride*.26],arms:[.1+stride*.38+attack*.68,-.1-stride*.38-attack*.72],tail:0};
 if(type==='glow-frog')return{mode:attack?'lunge':'hop',bodyLean:Math.sin(cycle*.5)*.03,scaleY:1-.07*(1-bounce),bob:-11*Math.pow(Math.max(0,Math.sin(cycle)),2),legs:[.12+stride*.33,-.12-stride*.33],arms:[],tail:Math.sin(cycle*.8)*.16};
 return{mode:'patrol',bodyLean:Math.sin(cycle)*.025,scaleY:1-.03*bounce,bob:-4*bounce,legs:[stride*.2,-stride*.2],arms:[stride*.1,-stride*.1],tail:Math.sin(cycle*.6)*.09};
}
