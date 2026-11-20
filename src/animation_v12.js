/**
 * v12 character animation polish. Presentation-only, deterministic state/clip mixing.
 * No changes to collisions, damage, learning logic or approved character artwork.
 */
import {heroPose} from './animation.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
export const ROOTKEEPER_CLIPS=Object.freeze({idle:12,stalk:16,attack:24,hurt:12,defeat:16});

const channels=['bob','lean','squash','scarf'];
function blendPose(a,b,alpha){
 const out={...b};
 for(const key of channels)out[key]=mix(a[key],b[key],alpha);
 out.arms=b.arms.map((v,i)=>mix(a.arms[i],v,alpha));
 out.legs=b.legs.map((v,i)=>mix(a.legs[i],v,alpha));
 out.legLift=b.legLift.map((v,i)=>mix(a.legLift?.[i]??0,v,alpha));
 out.ankles=b.ankles.map((v,i)=>mix(a.ankles?.[i]??0,v,alpha));
 return out;
}
export class HeroAnimationMixer {
 constructor(){this.reset()}
 reset(){this.last=undefined;this.filteredSpeed=0;this.pose=null;this.mode='idle';this.lastFoot=-1;this.lastLand=false;this.lastCast=false;this.emitted=[]}
 update(player,t){
  const dt=this.last===undefined?1/60:clamp((t-this.last)/1000,0,.08);
  if(this.last!==undefined&&t<this.last)this.reset();
  this.last=t;
  const grounded=Boolean(player.grounded);
  const target=clamp(Math.abs(player.vx||0)/315,0,1.25);
  this.filteredSpeed=mix(this.filteredSpeed,target,1-Math.exp(-dt*(grounded?13:7)));
  const synthetic={...player,vx:Math.sign(player.vx||1)*this.filteredSpeed*265};
  const raw=heroPose(synthetic,t);
  // Pose blending provides continuity when moving between run/jump/fall/land/cast.
  const transition=raw.mode!==this.mode;
  const rate=raw.mode==='hurt'?24:raw.mode==='land'?21:transition?13:19;
  const alpha=1-Math.exp(-dt*rate);
  const next=this.pose?blendPose(this.pose,raw,alpha):raw;
  next.mode=raw.mode;next.velocity=this.filteredSpeed;
  // Footstep cue only on grounded running contact, never in air or during landing.
  const phase=((player.run||0)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
  const foot=Math.floor(phase/Math.PI);
  this.emitted=[];
  if(grounded&&this.filteredSpeed>.38&&raw.mode==='run'&&foot!==this.lastFoot&&this.lastFoot!==-1){
   this.emitted.push({type:'footstep',side:foot,time:t});
  }
  if(raw.mode==='land'&&!this.lastLand)this.emitted.push({type:'landing',time:t});
  if(raw.mode==='cast'&&!this.lastCast)this.emitted.push({type:'cast',time:t});
  this.lastLand=raw.mode==='land';this.lastCast=raw.mode==='cast';
  this.lastFoot=grounded?foot:-1;this.mode=raw.mode;this.pose=next;
  return {...next,events:this.emitted.slice()};
 }
}

/** Boss phase is tied to the real game attack cooldown, NOT an arbitrary clock. */
export function bossState(state,t=0){
 if((state.bossDefeat||0)>0)return {mode:'defeat',phase:clamp((.95-state.bossDefeat)/.95,0,.999),priority:4};
 if((state.bossHurt||0)>0)return {mode:'hurt',phase:clamp((.47-state.bossHurt)/.47,0,.999),priority:3};
 if((state.bossPulse||0)>0){
  const progress=clamp((1.15-state.bossPulse)/1.15,0,1);
  // Hold the wind-up, accelerate into impact near when gameplay applies damage.
  const phase=progress<.72?progress*.82/.72:.82+smooth((progress-.72)/.28)*.179;
  return {mode:'attack',phase,priority:2};
 }
 return {mode:'idle',phase:((t*.0007)%1+1)%1,priority:0};
}

/** Only control mixing here; renderer owns game art and draw calls. */
export class RootkeeperAnimationMixer {
 constructor(){this.reset()}
 reset(){this.prevMode=null;this.prevPhase=0;this.mode='idle';this.start=0;this.last=-1;this.facing=1}
 update(state,t){
  if(this.last>t)this.reset();this.last=t;
  const next=bossState(state,t);
  if(next.mode!==this.mode){
   this.prevMode=this.mode;
   this.prevPhase=this.lastPhase??0;
   this.mode=next.mode;
   this.start=t;
  }
  this.lastPhase=next.phase;
  const transitionMs=next.mode==='attack'?130:next.mode==='hurt'?75:next.mode==='defeat'?160:150;
  const blend=smooth((t-this.start)/transitionMs);
  const prior=blend>=1||!this.prevMode?null:{mode:this.prevMode,phase:this.prevPhase,alpha:1-blend};
  return {mode:next.mode,phase:next.phase,previous:prior,blend,groundLocked:true};
 }
}

export function atlasCoordinates(mode,phase){
 const count=ROOTKEEPER_CLIPS[mode];if(!count)throw Error('Unknown animation clip');
 const p=(mode==='idle'||mode==='stalk')?((phase%1+1)%1):clamp(phase,0,.99999);
 const x=p*count;
 const current=Math.min(count-1,Math.floor(x));
 const next=(mode==='idle'||mode==='stalk')?(current+1)%count:Math.min(count-1,current+1);
 return {current,next,sub:x-current,count};
}
