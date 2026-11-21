import {heroPose,creaturePose,heroSoleHeights} from './animation.js';
import {WorldOneArt} from './world1_v14_art.js';
import {paintWorldOneTerrain} from './world1_terrain_v141.js';
import {paintExpeditionBackdrop,paintExpeditionTerrain,paintExpeditionDetails} from './worlds_v15_art.js';
import {evaluateRootkeeperPose,drawRootkeeperRig} from './rootkeeper_rig.js';
import {HeroAnimationMixer,RootkeeperAnimationMixer,atlasCoordinates,bossState} from './animation_v12.js';
import {AAAVisualEngine} from './vfx_aaa.js';
import {evaluateMonsterMotion,evaluateBossMotion,evaluateHeroMotionFX} from './creature_anim.js';
import {evaluateAriSkeleton} from './ari_rig.js';
import {drawAthleticAri} from './ari_renderer.js';
/**
 * Learn & Leap — playable cinematic illustrated 2.5D renderer.
 * This is a real scene renderer. It uses foreground/midground scenery art,
 * per-level collision geometry and animated actor sprites.
 * No baking of UI, actors or question answers into the screenshot/background.
 * The archived Three.js scene3d.js remains available via ?renderer=three.
 */
const WIDTH=1280,HEIGHT=720,TAU=Math.PI*2;
const Variety=window.LeapDiversity||{stage:id=>({shade:0,tone:'#ffffff',weather:'spores'}),enemyIndex:(id,i)=>(Math.floor((id-1)/10)+i)%10+1};
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
const frac=n=>n-Math.floor(n);
const hash=n=>frac(Math.sin(n*92.723+4.03)*54761.88);
const artList=['ari.png','foe-01.webp','foe-03.webp','boss-01.webp','premium/moss_stone.webp','premium/whispering_woods_backdrop.webp','premium/foliage.png','premium/organic_canopy.png','premium/flowers_1.png','premium/flowers_2.png','premium/flowers_3.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v6/cascade-vines.png','world1-v6/rune-shrine.png',...Array.from({length:10},(_,i)=>`world-${String(i+1).padStart(2,'0')}.webp`),...Array.from({length:10},(_,i)=>`foe-${String(i+1).padStart(2,'0')}.webp`),...Array.from({length:10},(_,i)=>`boss-${String(i+1).padStart(2,'0')}.webp`)];
artList.push(...Array.from({length:10},(_,i)=>`stage-forest/${String(i+1).padStart(2,'0')}.webp`));
artList.push('world1-v142/crystal-waterfall-scenery.webp'); // Previous scenic plate kept for comparison/rollback.
artList.push('world1-v143/mistwalk-cinematic-scenery.webp');
artList.push(...['forest','mushroom','waterfall','timber','temple','firefly','swamp','cave','storm','sacred'].map(k=>`world1-v143/${k}-stone-moss.webp`));
const articulatedAssets=["animation/ari/body-v1411-clean.png", "animation/ari/cape.png", "animation/ari/rear-arm.png", "animation/ari/back-leg-v141.png", "animation/ari/front-leg.png", "animation/ari/rear-shin-v145.png", "animation/ari/rear-boot-v145.png", "animation/ari/rear-boot-forward-v146.png", "animation/ari/front-shin-v145.png", "animation/ari/front-boot-v145.png", "animation/ari/front-arm-v1411-clean.png", "animation/glow-frog/body.png", "animation/glow-frog/tail.png", "animation/glow-frog/left-leg.png", "animation/glow-frog/right-leg.png"];artList.push(...articulatedAssets);
// v11 replaces visible primitive body geometry with a single seamless, bone-deformed
// illustration exported as compact animation atlases. Original IK rig remains archived.
const ROOTKEEPER_V11_COUNTS={idle:12,stalk:16,attack:24,hurt:12,defeat:16};
const ROOTKEEPER_V11_FILES=Object.keys(ROOTKEEPER_V11_COUNTS).map(k=>`animation/rootkeeper-v11/${k}.webp`);
artList.push(...ROOTKEEPER_V11_FILES);
const images={};for(const path of artList){if(images[path])continue;const img=new Image();img.decoding='async';img.src=`assets/${path}`;images[path]=img}
function ready(k){const img=images[k];return img?.complete&&(img.naturalWidth||img.width)>0?img:null}
if(typeof window!=='undefined')window.__LEAP_READY__=ready;
function color(world){return [['#8dd4bd','#b8df75','#fff0b4'],['#c6b5ed','#97afff','#dfbbff'],['#a7d9ff','#cbe8b5','#fff4bd'],['#ffb07e','#d7aa54','#ffd7a5'],['#c4f1f7','#a8dbec','#efffff'],['#9eddd4','#64cfc6','#feeab9'],['#c8c2f1','#b6d8cb','#ffd8a3'],['#9ea6e0','#93c1b1','#dfeccb'],['#aea7f5','#b0bfed','#fff7c7'],['#edc9e5','#cbb7ef','#ffe6bb']][world]}
function pathRound(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
export class PainterWorld{
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});if(!this.ctx)throw Error('Canvas 2D not supported');this.canvas.width=WIDTH;this.canvas.height=HEIGHT;this.stage=null;this.stageId=null;this.wave=0;this.sparkles=[];this.lastT=0;this.graphics='Cinematic painterly 2.5D AAA';this.fitWorld=0;this._bossPulsePrevious=0;this._bossRecoveryStart=-1;this.frames=0;this.sceneObjects=0;this.extraBloom=!matchMedia('(prefers-reduced-motion: reduce)').matches;this.heroMixer=new HeroAnimationMixer();this.bossMixer=new RootkeeperAnimationMixer();this.footstepVisuals=[];this.debugCharacter=false;this.vfx=new AAAVisualEngine();
  const isMobile=typeof navigator!=='undefined'&&((navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||(navigator.deviceMemory&&navigator.deviceMemory<=4)||/Mobi|Android|Tablet|iPad|iPhone/i.test(navigator.userAgent||''));
  this.perfMode=typeof localStorage!=='undefined'&&localStorage.getItem('leap-perf')!==null?(localStorage.getItem('leap-perf')==='1'):isMobile;
  this._lastFpsCheck=0;this._fpsFrames=0;
 }
 togglePerfMode(){this.perfMode=!this.perfMode;try{localStorage.setItem('leap-perf',this.perfMode?'1':'0')}catch(e){}return this.perfMode;}
 setStage(d){if(!d)return;this.stage=d;this.stageId=d.id;this.fitWorld=d.world;this._bossPulsePrevious=0;this._bossRecoveryStart=-1;this.heroMixer.reset();this.bossMixer.reset();this.footstepVisuals=[];const rnd=()=>hash(d.id*27+this.sparkles.length*19);this.sparkles=Array.from({length:150},(_,i)=>({x:(hash(d.id*3+i*17)*d.length),y:110+hash(i*21+d.id)*460,r:1+hash(i*11)*3,p:i*.58}));this.sceneObjects=d.platforms.length+d.enemies.length+d.coins.length+d.shrines.length+(d.boss?1:0)}
 drawImage(img,x,y,w,h){if((img?.naturalWidth||img?.width)&&w>0&&h>0)this.ctx.drawImage(img,x,y,w,h)}
 drawFill(x,y,w,h,a,b){const c=this.ctx,g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,a);g.addColorStop(1,b);c.fillStyle=g;c.fillRect(x,y,w,h)}
 shadowText(text,x,y,font='22px Georgia',fill='#fff9e9',stroke='#182e26'){const c=this.ctx;c.font=font;c.textAlign='center';c.lineWidth=4;c.strokeStyle=stroke;c.strokeText(text,x,y);c.fillStyle=fill;c.fillText(text,x,y)}
 background(world,cam,t){
  if(this.stage?.v15){paintExpeditionBackdrop(this.ctx,this.stage,cam,t,ready);return;}
  // v14.3: professional scenic colour and light based on the approved waterfall reference.
  // All moving characters, HUD, collision geometry, text and collectibles stay independent.
  // Collision platforms, enemies, coins, shrines, gate and Ari remain independent renderer layers.
  if(world===0&&this.stage?.v14&&this.stage.id===3){
   const image=ready('world1-v143/mistwalk-cinematic-scenery.webp') || ready('world1-v142/crystal-waterfall-scenery.webp');
   if(image){
    const c=this.ctx;c.save();c.fillStyle='#7ebbd0';c.fillRect(0,0,WIDTH,HEIGHT);
    const pan=Math.sin(cam*.00063)*8;this.drawImage(image,-12+pan,-8,1304,736);
    // Subtle cinematic daylight, anchored to the sky only (not the collision plane).
    const daylight=c.createRadialGradient(1060,85,16,1020,110,570);
    daylight.addColorStop(0,'rgba(255,252,222,.15)');daylight.addColorStop(1,'rgba(255,250,215,0)');
    c.fillStyle=daylight;c.fillRect(0,0,WIDTH,480);
    // Falling light streaks are live, and stay behind the walkable geometry.
    c.globalAlpha=.2;c.strokeStyle='#e4fffc';c.lineWidth=2.1;
    for(let i=0;i<17;i++){let xx=470+(i*39)%345,yy=((t*.075+i*87)%370)+156;
      c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+2,yy+22);c.stroke();}
    c.restore();return;
   }
  }
  if(world===0&&this.stage?.v14)return WorldOneArt.background(this.ctx,this.stage,cam,t);const c=this.ctx,[sky]=color(world),stageIdx=((this.stageId||1)-1)%10,img=ready(world===0?`stage-forest/${String(stageIdx+1).padStart(2,'0')}.webp`:`world-${String(world+1).padStart(2,'0')}.webp`);c.fillStyle=sky;c.fillRect(0,0,WIDTH,HEIGHT);
  if(img){const h=810,w=h*(img.naturalWidth||img.width)/(img.naturalHeight||img.height);const shift=(cam*.038)%Math.max(1,w-120);const base=-70-shift;
   // Fixed scene plates with slow, independent horizontal camera motion.
   this.drawImage(img,base,-44,w,h);if(base+w<WIDTH)this.drawImage(img,base+w,-44,w,h);
  }
  // v13: ten deliberately differentiated moods per world, keyed to level ID.
  const mood=Variety.stage(this.stageId||world*10+1);
  c.save();c.globalAlpha=mood.shade;
  c.fillStyle=mood.tone;c.fillRect(0,0,WIDTH,HEIGHT);
  c.restore();
  let sun=c.createRadialGradient(870,90,20,870,90,690);sun.addColorStop(0,'rgba(255,244,192,.34)');sun.addColorStop(.45,'rgba(255,222,160,.12)');sun.addColorStop(1,'rgba(254,222,180,0)');c.fillStyle=sun;c.fillRect(0,0,WIDTH,HEIGHT);
  // A little atmospheric haze at water line, but avoid washing out gameplay.
  let mist=c.createLinearGradient(0,310,0,720);mist.addColorStop(0,'#bddfe500');mist.addColorStop(.82,'#9cdadd22');mist.addColorStop(1,'#0d585b55');c.fillStyle=mist;c.fillRect(0,300,WIDTH,420);
  c.globalCompositeOperation='screen';for(let i=0;i<17;i++){let x=(hash(i*17+world)*1400-cam*.085+200)%1600-150,y=hash(i*4+1)*500;const glow=c.createRadialGradient(x,y,0,x,y,22+hash(i)*36);glow.addColorStop(0,'#fff3aa66');glow.addColorStop(1,'#ffffff00');c.fillStyle=glow;c.beginPath();c.arc(x,y,48,0,TAU);c.fill()}c.globalCompositeOperation='source-over';
 }
 tree(x,y,scale=1,depth=0,t=0){const c=this.ctx,s=scale;const leaf=ready('premium/organic_canopy.png')||ready('premium/foliage.png');
  // Dark wood with actual bark, backlit side and winding vines.
  c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#473827';c.beginPath();c.moveTo(-20,7);c.bezierCurveTo(-13,-85,-28,-153,-7,-236);c.lineTo(12,-235);c.bezierCurveTo(16,-158,15,-50,24,8);c.closePath();c.fill();
  c.strokeStyle='#91734d';c.lineWidth=4;c.beginPath();c.moveTo(-7,0);c.bezierCurveTo(-13,-95,3,-129,2,-208);c.stroke();c.strokeStyle='#172f23';c.lineWidth=3;for(let k=0;k<4;k++){let a=-140-k*27;c.beginPath();c.moveTo(3,a+15);c.quadraticCurveTo((k%2?34:-33),a,0,a-31);c.stroke()}
  if(leaf){c.translate(4+Math.sin(t*.0004+x)*3,-200);c.drawImage(leaf,-145,-150,310,300);c.globalAlpha=.53;c.drawImage(leaf,-108,-145,253,233);c.globalAlpha=1;}c.restore()}
 bush(x,y,s=1,i=0){if(this.fitWorld===0){const img=ready('world1-v6/ferns-and-blossoms.png');if(img){this.drawImage(img,x-99*s,y-105*s,198*s,115*s);return}}
 const img=ready(`premium/flowers_${i%3+1}.png`);this.drawImage(img,x-96*s,y-102*s,192*s,115*s)}
 layeredForest(cam,d,t){if(d.v15)return;if(d.world===0)return;const c=this.ctx,offset=cam*.68,ground=d.ground;
  for(let i=0;i<Math.ceil(d.length/375);i++){const wx=195+i*362+hash(i*13+d.id)*98;const sx=wx-offset;if(sx<-245||sx>1500)continue;const sc=.6+hash(i*3+d.id)*.49;c.save();c.globalAlpha=.62;this.tree(sx,ground+20,sc,0,t);c.restore()}
  for(let i=0;i<Math.ceil(d.length/390);i++){const wx=360+i*390+hash(d.id*31+i)*110;const sx=wx-cam;if(sx<-250||sx>1470)continue;const sc=.45+hash(i*34+d.id)*.65;this.tree(sx,d.ground-2,sc,1,t)}
 }
 tileTerrain(x,y,w,h,index=0,platform=false){if(this.stage?.v15)return paintExpeditionTerrain(this.ctx,this.stage,x,y,w,h,index,platform,ready);if(this.fitWorld===0&&this.stage?.v14)return paintWorldOneTerrain(this.ctx,this.stage,x,y,w,h,index,platform,this._v14Platform,this.wave*500,ready);if(this.fitWorld===0)return this.worldOneTerrain(x,y,w,h,index,platform);const c=this.ctx;if(w<2||h<1)return;const rock=ready('premium/moss_stone.webp');c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  c.fillStyle='#655945';c.fillRect(x,y,w,h);
  if(rock){const tileW=330,tileH=Math.max(185,h),tiles=Math.ceil(w/tileW)+1;for(let i=0;i<tiles;i++){c.save();const sx=x+i*tileW;if((i+index)%2===1){c.translate(sx+tileW,0);c.scale(-1,1);c.drawImage(rock,0,y-4,tileW,tileH)}else c.drawImage(rock,sx,y-4,tileW,tileH);c.restore()}}
  let grad=c.createLinearGradient(0,y+10,0,y+h);grad.addColorStop(0,'#142f1500');grad.addColorStop(.6,'#10272012');grad.addColorStop(1,'#071b2266');c.fillStyle=grad;c.fillRect(x,y,w,h);c.restore();
  // Graceful ledge silhouette, grass edge and small highlights at the actual collision top.
  const moss=c.createLinearGradient(0,y,0,y+24);moss.addColorStop(0,'#def6a4');moss.addColorStop(.18,'#b2e06e');moss.addColorStop(.6,'#39793d');moss.addColorStop(1,'#213b2a88');c.fillStyle=moss;c.fillRect(x,y-7,w,22);
  c.fillStyle='#395e24';for(let i=0;i<w/13;i++){let px=x+i*13+hash(index*30+i)*9,yy=y+10+hash(i*2)*8;c.beginPath();c.ellipse(px,yy,6+hash(i)*7,6,0,0,TAU);c.fill()}
  if(platform){c.strokeStyle='#f7e9a456';c.lineWidth=2;c.beginPath();c.moveTo(x,y-6);c.lineTo(x+w,y-6);c.stroke();}
 }
 worldOneTerrain(x,y,w,h,index=0,platform=false){const c=this.ctx;
  if(w<2||h<1)return;
  const cliff=ready('world1-v6/cliff-masonry.webp'),ledge=ready('world1-v6/living-ledge.webp'),vines=ready('world1-v6/cascade-vines.png');
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  c.fillStyle='#586254';c.fillRect(x,y,w,h);
  if(cliff){const tileW=375,tileH=210;for(let tx=0;tx<w;tx+=tileW){for(let ty=12;ty<h;ty+=tileH){const sw=Math.min(tileW,w-tx),sh=Math.min(tileH,h-ty);c.drawImage(cliff,(index*79+tx*.03)%100,20,950,475,x+tx,y+ty,sw,sh)}}}
  let shade=c.createLinearGradient(0,y,0,y+h);shade.addColorStop(0,'#0a2b2300');shade.addColorStop(.45,'#122c2338');shade.addColorStop(1,'#0b181ab8');c.fillStyle=shade;c.fillRect(x,y,w,h);c.restore();
  // The relief cap conforms to the existing collision top: no visual/collision divergence.
  if(ledge){c.save();c.beginPath();c.rect(x,y-11,w,Math.max(95,Math.min(h+28,150)));c.clip();const tw=375;for(let tx=0;tx<w;tx+=tw){const sw=Math.min(tw,w-tx);c.drawImage(ledge,0,0,1000,245,x+tx,y-12,sw,115)}c.restore()}
  else{c.fillStyle='#5e994d';c.fillRect(x,y-8,w,14)}
  // Fine overhanging ivy at sparse points, not a repeated wall of grass pixels.
  if(vines){for(let j=0;j<Math.max(1,Math.floor(w/190));j++){const px=x+((j*199+index*43)%Math.max(1,w));const scale=.55+hash(index*12+j)*.42;c.save();c.globalAlpha=.65;c.drawImage(vines,px-35,y+33,94*scale,120*scale);c.restore()}}
  if(platform){c.strokeStyle='#fff1bc66';c.lineWidth=2;c.beginPath();c.moveTo(x+3,y+1);c.lineTo(x+w-3,y+1);c.stroke();}
 }
 ground(d,cam){const c=this.ctx,sorted=[{x:0,w:0},...d.pits.slice().sort((a,b)=>a.x-b.x),{x:d.length,w:0}];for(let k=0;k<sorted.length-1;k++){const left=sorted[k].x+sorted[k].w,right=sorted[k+1].x;if(right-left<=0)continue;const x=left-cam,w=right-left;if(x>WIDTH+200||x+w<-200)continue;this.tileTerrain(x,d.ground,w,HEIGHT-d.ground+260,k,false)}
  // Water in visible ravines, animated reflection strokes.
  for(const pit of d.pits){let x=pit.x-cam;if(x>WIDTH||x+pit.w<0)continue;this.drawFill(x,d.ground+13,pit.w,HEIGHT-d.ground,'#287e89b3','#092d4f');c.strokeStyle='#a2f7e5ba';c.lineWidth=2;for(let i=0;i<8;i++){let px=x+hash(i+pit.x)*(pit.w-20);let yy=d.ground+16+i*15+Math.sin(this.wave+i)*3;c.beginPath();c.moveTo(px,yy);c.lineTo(px+16,yy);c.stroke()}}
 }
 platforms(d,cam,t){const c=this.ctx;for(let i=0;i<d.platforms.length;i++){const p=d.platforms[i],x=p.x-cam;if(x>WIDTH+70||x+p.w<-70)continue;
  const h=82+hash(i*3)*15;this._v14Platform=p;this.tileTerrain(x,p.y,p.w,h,i,true);this._v14Platform=null;
  if(d.world===0){
   // Lush forest roots, hanging vines & blossoms for Whispering Woods
   c.strokeStyle='#245e34';for(let j=0;j<7;j++){const px=x+(j+.5)*p.w/7;const ext=12+hash(i*60+j)*48;c.lineWidth=2+hash(j)*2;c.beginPath();c.moveTo(px,p.y+h-5);c.quadraticCurveTo(px+8,p.y+h+ext*.3,px-5,p.y+h+ext);c.stroke()}
   if(i%2===0)this.bush(x+p.w*.14,p.y+3,.46,i);
  }else{
   // Biome-matched undersides (icicles, magma shards, crystal tips, brass brackets, coral)
   const underCol=['#5e994d','#b794f4','#d8f2ff','#ff8f42','#c8f5ff','#6ee7d8','#eab354','#7edbb4','#d6b8ff','#f6d486'][d.world]||'#a8d4e6';
   c.save();c.fillStyle=underCol;c.globalAlpha=.55;
   for(let j=0;j<5;j++){const px=x+(j+.5)*p.w/5,ext=10+hash(i*41+j)*22;c.beginPath();c.moveTo(px-6,p.y+h-2);c.lineTo(px,p.y+h+ext);c.lineTo(px+6,p.y+h-2);c.closePath();c.fill();}
   c.restore();
  }
 }}
 drawCoin(x,y,t,index){const c=this.ctx;const bobY=y+Math.sin(t*.0032+index)*4.5;const dx=Math.cos(t*.0024+index*.45)*.22+.78;this.vfx.drawGlow(c,x,bobY,32,'gold',.52);c.save();c.translate(x,bobY);c.scale(dx,1);const grd=c.createLinearGradient(-17,-12,18,18);grd.addColorStop(0,'#fffad1');grd.addColorStop(.3,'#f8c63d');grd.addColorStop(.68,'#e89a1c');grd.addColorStop(1,'#8c4a12');c.fillStyle=grd;c.strokeStyle='#fff4bf';c.lineWidth=2.6;c.beginPath();c.ellipse(0,0,15,18,0,0,TAU);c.fill();c.stroke();c.strokeStyle='#9e5e10';c.lineWidth=1.8;c.beginPath();c.ellipse(0,0,10,13,0,0,TAU);c.stroke();c.fillStyle='#fff4ba';c.font='bold 18px Georgia';c.textAlign='center';c.fillText('✦',0,6);c.restore()}
 /** v14.2.1: approximate painted boot-sole contact from the actual joint and sole locations.
  * Return a small render-only foot lock offset in WORLD pixels. The collision body
  * and world-space player position are deliberately untouched. */
 ariContactOffset(pose,player){
  if(!player.grounded||pose.mode==='jump'||pose.mode==='fall'||pose.mode==='hurt')return 0;
  // Evaluate the transformed soles including the new ankle rotations.
  // Purely visual correction: player.y, physics and collision remain unchanged.
  const [front,rear]=heroSoleHeights(pose);
  const sole=Math.max(front,rear),target=218;
  return clamp((target-sole)*(125/235),-8,8);
 }
 /** Draw original approved artwork, now split at the real ankle pivot.
  * First rotate the trouser/leg around the hip, then independently pivot the correctly forward-facing boot.
  * No stretched or mirrored replacement foot sprites are introduced. */
 articulatedLeg(limb,hip,ankle,hipAngle,ankleAngle,lift=0){
  const upper=ready(`animation/ari/${limb}-shin-v145.png`),boot=ready(`animation/ari/${limb==='rear'?'rear-boot-forward-v146':limb+'-boot-v145'}.png`);
  if(!upper||!boot)return false;
  const c=this.ctx;c.save();c.translate(hip[0],hip[1]+lift);c.rotate(hipAngle);
  c.drawImage(upper,-hip[0],-hip[1]);
  c.save();c.translate(ankle[0]-hip[0],ankle[1]-hip[1]);c.rotate(ankleAngle);
  c.drawImage(boot,-ankle[0],-ankle[1]);c.restore();c.restore();return true;
 }
 // Animated character parts retain the original illustrations; never animate a whole flat sprite only.
 limbPart(asset,pivot,angle,shiftX=0,shiftY=0){const img=ready(asset);if(!img)return;const c=this.ctx;c.save();c.translate(pivot[0]+shiftX,pivot[1]+shiftY);c.rotate(angle);c.drawImage(img,-pivot[0],-pivot[1]);c.restore()}
 // Genuine pose rig: 17 connected bones, two-bone IK for each arm and leg.
 // Rendered from permanent painted layers and textured continuous geometry.
 // No v7 severed limb masks and no v8 frame zoom/warp atlas are used.
 /** Draw exact v11 frame geometry with fluid intra-clip pacing, no whole-body scaling. */
 drawRootFrame(mode,index,x,y,w,h,opacity=1){
  const sheet=ready(`animation/rootkeeper-v11/${mode}.webp`);
  if(!sheet||opacity<=.001)return false;
  const c=this.ctx;c.save();c.globalAlpha*=opacity;
  c.drawImage(sheet,(index%4)*336,Math.floor(index/4)*416,336,416,x,y,w,h);
  c.restore();return true;
 }
 rigRootkeeper(x,y,w,h,opts={}){
  const mode=ROOTKEEPER_V11_COUNTS[opts.mode]?opts.mode:'idle';
  const phase=opts.stridePhase!==undefined?opts.stridePhase:(opts.phase??((opts.time||0)*.0008));
  const sheet=ready(`animation/rootkeeper-v11/${mode}.webp`);
  if(!sheet)return false;
  const c=this.ctx;c.save();
  if(opts.facing===-1){c.translate(x+w,0);c.scale(-1,1);x=0}
  // Separate action clips crossfade on transitions. No zoom, torso stretching or cutouts.
  const prev=opts.previous;
  if(prev&&ROOTKEEPER_V11_COUNTS[prev.mode]){
   const old=atlasCoordinates(prev.mode,prev.phase);
   this.drawRootFrame(prev.mode,old.current,x,y,w,h,Math.min(1,prev.alpha));
  }
  const fg=prev?1-Math.min(1,prev.alpha):1;
  const clip=atlasCoordinates(mode,phase);
  const low=fg*(1-Math.min(.18,clip.sub*.18));
  const high=fg-low;
  this.drawRootFrame(mode,clip.current,x,y,w,h,low);
  if(high>.001)this.drawRootFrame(mode,clip.next,x,y,w,h,high);
  c.restore();return true;
 }

 rigCreature(type,img,x,y,w,h,pose,motion=null){
  const c=this.ctx,head='animation/glow-frog/';
  if(type==='rootkeeper')return this.rigRootkeeper(x,y,w,h,pose);
  if(!ready(head+'body.png'))return false;
  const m=motion||{facing:1,turnScale:1,hopY:pose.bob||0,scaleX:1,scaleY:pose.scaleY||1,shearX:0,tilt:pose.bodyLean||0};
  const sw=img.naturalWidth||220,sh=img.naturalHeight||220;
  const cx=x+w*.5,by=y+h;
  // Sync frog leg extension smoothly to real hop height so legs never flail robotically
  const airFactor=clamp(-m.hopY/20,0,1);
  const legKick=airFactor*.36-.08*(1-airFactor);
  c.save();
  c.translate(cx,by+m.hopY);
  c.scale(m.facing*m.turnScale*m.scaleX,m.scaleY);
  if(m.shearX)c.transform(1,0,m.shearX*.65,1,0,0);
  c.rotate(m.tilt*.85);
  c.scale(w/sw,h/sh);
  c.translate(-sw*.5,-sh);
  this.limbPart(head+'tail.png',[70,117],(pose.tail||0)*.55-airFactor*.18);
  this.limbPart(head+'left-leg.png',[60,139],-legKick);
  this.limbPart(head+'right-leg.png',[154,139],legKick*.85);
  this.limbPart(head+'body.png',[106,110],0);
  c.restore();return true;
 }
 // Seamless grounded bottom-pivot elastic locomotion (replaces harsh rectangular cutout slicing
 // while keeping the illustrated creature artwork 100% unified, expressive, and weighted).
 elasticCreature(img,x,y,w,h,pose,motion=null){
  const c=this.ctx;
  const m=motion||{facing:1,turnScale:1,hopY:pose?.bob||0,scaleX:1,scaleY:pose?.scaleY||1,shearX:0,tilt:pose?.bodyLean||0,hurtFlash:0,defeatFade:1};
  const cx=x+w*.5,by=y+h;
  c.save();
  if(m.defeatFade!==undefined&&m.defeatFade<1)c.globalAlpha*=clamp(m.defeatFade,0.05,1);
  c.translate(cx,by+m.hopY);
  c.scale(m.facing*m.turnScale*m.scaleX,m.scaleY);
  if(m.shearX)c.transform(1,0,m.shearX,1,0,0);
  if(m.tilt)c.rotate(m.tilt);
  c.drawImage(img,-w*.5,-h,w,h);
  if(m.hurtFlash>0.08){
   c.globalCompositeOperation='lighter';
   c.globalAlpha=m.hurtFlash*.52;
   c.drawImage(img,-w*.5,-h,w,h);
  }
  c.restore();
 }
 drawEnemies(d,cam,t,state){const c=this.ctx;for(let i=0;i<d.enemies.length;i++){const e=d.enemies[i];if(!e.alive)continue;const x=e.x-cam;if(x<-140||x>WIDTH+140)continue;const index=Variety.enemyIndex(d.id,i);const key=`foe-${String(index).padStart(2,'0')}.webp`,img=ready(key);if(!img)continue;
   const size=87+(e.kind%2)*8,near=state?.player?Math.abs(state.player.x-e.x)<155:0,ptype=index===1?'glow-frog':index===3?'rootkeeper':'fallback',pose=creaturePose(t,i+e.phase,ptype,near?1:0);
   const motion=evaluateMonsterMotion(e,t,state?.player,index);
   c.save();
   // Height-responsive grounded shadow
   c.fillStyle=`rgba(5,26,28,${motion.shadowAlpha.toFixed(2)})`;
   c.beginPath();c.ellipse(x,d.ground+3,size*.31*motion.shadowScale,6.2*motion.shadowScale,0,0,TAU);c.fill();
   // Alert / float aura glow
   if(motion.alert>0.12){this.vfx.drawGlow(c,x,d.ground-size*.45+motion.hopY,50,'ember',.22+motion.alert*.24);}
   else if(motion.archetype==='floater'){this.vfx.drawGlow(c,x,d.ground-size*.45+motion.hopY,42,index===2||index===9?'violet':'cyan',.22);}
   const dx=x-size/2,dy=d.ground-size+10;
   if(ptype==='rootkeeper'){const dxTravel=e._rkX===undefined?0:e.x-e._rkX;
      e._rkDistance=(e._rkDistance||0)+Math.abs(dxTravel);e._rkX=e.x;
      const face=dxTravel>0?1:dxTravel<0?-1:(e._rkFace||1);e._rkFace=face;
      this.rigRootkeeper(dx,dy,size*.79,size,{mode:'stalk',locomotion:1,stridePhase:e._rkDistance/42+e.phase*.31,phase:(t*.0007)%1,time:t,facing:face});}
   else if(ptype==='fallback'||!this.rigCreature(ptype,img,dx,dy,size,size,pose,motion))this.elasticCreature(img,dx,dy,size,size,pose,motion);
   // Subtle monster landing/step dust cue
   if((motion.justLanded||motion.footstep)&&this.footstepVisuals.length<24){
    this.footstepVisuals.push({x,feet:d.ground+1,created:t,intensity:motion.justLanded?.55:.3,dir:motion.facing});
   }
   c.restore();}
 }
 stageAtmosphere(d,cam,t){const c=this.ctx,m=Variety.stage(d.id);c.save();const kind=m.weather;
  for(let i=0;i<50;i++){const seed=d.id*31+i*13;
   let x=(hash(seed+4)*1500-cam*(kind==='rain'?.13:.055)+t*(kind==='rain'?.12:.012)+1600)%1600-150;
   let y=(hash(seed*3)*HEIGHT+t*(kind==='rain'?.22:.015))%HEIGHT;
   if(kind==='mist'){c.fillStyle='#d4f8f322';c.beginPath();c.ellipse(x,y,45+hash(seed)*40,7,0,0,TAU);c.fill();continue}
   if(kind==='rain'){c.strokeStyle='#d6f4ff52';c.lineWidth=1.35;c.beginPath();c.moveTo(x,y);c.lineTo(x-7,y+22);c.stroke();continue}
   const glow=kind==='fireflies'||kind==='magic';
   if(glow&&i%2===0)this.vfx.drawGlow(c,x,y,14,'emerald',.36);
   c.fillStyle=glow?'#dcffd7cc':kind==='petals'?'#ffbddccc':'#f9ecc3bb';
   c.beginPath();c.ellipse(x,y,glow?2.4:3.3,glow?2.4:1.7,i*.4,0,TAU);c.fill();
  }c.restore();}
 drawBoss(d,cam,t,state){
  if(!d.boss||(state.bossHp<=0&&!(state.bossDefeat>0))||state.scene==='title')return;
  const x=d.bossX-cam;if(x<-280||x>WIDTH+260)return;
  const c=this.ctx,size=345,bossHeight=226,bossWidth=178,near=state?.player?Math.abs(state.player.x-d.bossX)<430:0;
  this.vfx.drawGlow(c,x,d.ground-bossHeight*.52,155,state.bossHurt>0?'white':state.bossPulse>0?'ember':'emerald',state.bossHurt>0?.85:state.bossPulse>0?.55:.32);
  c.save();
  // Boss ground danger telegraph ring during attack windup
  if(state.bossPulse>0&&state.keys===4){
   const prog=clamp((1.15-state.bossPulse)/1.15,0,1);
   c.save();c.strokeStyle=prog>.7?'#ff8d6b':'#f8e08e';c.lineWidth=3+prog*4;c.globalAlpha=.28+prog*.55;
   c.beginPath();c.ellipse(x,d.ground-4,95+prog*260,18+prog*10,0,0,TAU);c.stroke();
   c.restore();
  }
  let animated=false;
  if(d.world===0){
   const animation=this.bossMixer.update(state,t);
   const clip=animation.mode;
   animated=this.rigRootkeeper(x-bossWidth*.5,d.ground-bossHeight,bossWidth,bossHeight,{...animation,time:t,facing:state.player?.x<d.bossX?-1:1});

   if(clip==='attack'){
    // Physical wind-up -> impact -> recovery, coupled to the timed boss attack.
    const focus=(1.15-state.bossPulse)/1.15;
    if(focus>.18&&focus<.87){const r=clamp((focus-.18)/.69,0,1);
     c.save();c.globalAlpha=.38*(1-Math.abs(.5-r)*1.2);c.strokeStyle='#bdf98e';c.lineWidth=4+8*r;
     c.beginPath();c.arc(x+130,d.ground-35,45+200*r,Math.PI*1.13,Math.PI*1.92);c.stroke();c.restore();}
   }
  }
  if(!animated){
   const img=ready(d.world===0?'foe-03.webp':`boss-${String(d.world+1).padStart(2,'0')}.webp`);
   if(img){
    const pose=creaturePose(t,8,'fallback',state.bossPulse>0?1:0);
    const bm=evaluateBossMotion(state,t,d.world,state.player?.x??0,d.bossX);
    c.fillStyle='rgba(5,20,24,0.52)';
    c.beginPath();c.ellipse(x,d.ground+4,size*.34*bm.scaleX,12,0,0,TAU);c.fill();
    if(bm.chargeGlow>0.1){this.vfx.drawGlow(c,x,d.ground-size*.45+bm.hopY,140,'ember',bm.chargeGlow*.55);}
    this.elasticCreature(img,x-size*.49,d.ground-size+32,size*.98,size,pose,{facing:bm.facing,turnScale:1,hopY:bm.hopY,scaleX:bm.scaleX,scaleY:bm.scaleY,shearX:bm.shearX,tilt:bm.lean,hurtFlash:bm.hurtFlash,defeatFade:bm.defeatFade});
   }
  }
  c.restore();
 }
 decorations(d,cam,t){if(d.v15){paintExpeditionDetails(this.ctx,d,cam,t);return;}if(d.world===0&&d.v14){WorldOneArt.featureObjects(this.ctx,d,cam,t);return;}const c=this.ctx;for(let i=0;i<Math.ceil(d.length/230);i++){const wx=i*234+hash(i*22+d.id)*110;const x=wx-cam;if(x<-180||x>WIDTH+180||d.pits.some(p=>wx>p.x&&wx<p.x+p.w))continue;if(d.world===0){if((i+d.stage)%3!==0)this.bush(x,d.ground+3,.60+hash(i*.8+d.id)*.52,i+d.id)}else if(i%3!==0)this.bush(x,d.ground+6,.65+hash(i*.8)*.50,i)}
   for(let i=0;i<d.hazards.length;i++){const h=d.hazards[i],x=h.x-cam;if(x<-100||x>WIDTH+100)continue;const pulse=Math.sin(t*.003+h.phase);c.save();if(!this.perfMode){c.shadowColor='#fa972b';c.shadowBlur=20;}c.fillStyle=h.kind===1?'#ff9e45':h.kind===3?'#a7edff':'#d9e7b4';c.globalAlpha=.6+.4*(pulse+1)/2;c.beginPath();c.moveTo(x-27,d.ground);c.lineTo(x,d.ground-50-pulse*20);c.lineTo(x+27,d.ground);c.closePath();c.fill();c.restore()}}
 drawShrines(d,cam,t){if(d.world===0){const c=this.ctx,frame=ready('world1-v6/rune-shrine.png');const sym={math:'∑',english:'Aa',science:'⚗',general:'✧'},clr={math:'#f8d27e',english:'#d1acff',science:'#a5ffcf',general:'#8defff'};
  for(const s of d.shrines){const x=s.x-cam;if(x<-150||x>WIDTH+150)continue;const y=d.ground-190;const fade=s.done?.58:1;
    c.save();c.globalAlpha=fade;
    // Opaque luminous centre prevents walls and platforms from showing through the live rune.
    const portal=c.createRadialGradient(x,y+84,6,x,y+84,82);
    portal.addColorStop(0,s.done?'#245254ee':'#337e88fb');portal.addColorStop(.55,'#214d5bf2');portal.addColorStop(1,'#122f3dee');
    c.fillStyle=portal;c.beginPath();c.ellipse(x,y+90,49,75,0,0,TAU);c.fill();
    if(frame){c.drawImage(frame,x-87,y-25,174,220);}else{c.fillStyle='#315e5c';pathRound(c,x-61,y,122,178,30);c.fill()}
    const color=clr[s.subject];const bob=Math.sin(t*.0024+s.x)*5;
    c.textAlign='center';c.font='bold 31px Georgia';c.fillStyle='#ecfff1';c.fillText(s.done?'✓':sym[s.subject],x,y+96+bob);
    const labels={math:'MATH',english:'ENGLISH',science:'SCIENCE',general:'DISCOVER'};
    // The owner requested highly legible shrine/gate wording at real gameplay scale.
    // This plaque covers the low-contrast lettering baked into the approved stone-frame artwork.
    c.fillStyle='#133240';c.strokeStyle='#f2cf88';c.lineWidth=2;
    pathRound(c,x-73,y+154,146,32,7);c.fill();c.stroke();
    c.textAlign='center';c.font='800 17px system-ui, sans-serif';c.lineWidth=2.5;
    c.strokeStyle='#0a2530';c.strokeText(labels[s.subject],x,y+176);
    c.fillStyle='#fff2ca';c.fillText(labels[s.subject],x,y+176);
    if(!s.done){for(let j=0;j<7;j++){const a=t*.0012+j*TAU/7;const px=x+Math.sin(a)*54,py=y+88+Math.cos(a)*36;c.fillStyle=color;c.globalAlpha=.52+.24*Math.sin(t*.002+j);c.fillRect(px,py,3.5,3.5)}}c.restore();
  }return}
const c=this.ctx;const sym={math:'∑',english:'Aa',science:'⚗',general:'✧'},clr={math:'#ffce68',english:'#c8a8ff',science:'#88f2c3',general:'#8eddfa'};
 for(const [i,s] of d.shrines.entries()){const x=s.x-cam;if(x<-120||x>WIDTH+120)continue;const y=d.ground-96;const glow=clr[s.subject];c.save();c.translate(x,y);c.globalAlpha=s.done?.55:1;
  // Ornate carved stone shrine arch matching World 1 visual fidelity
  const stone=c.createLinearGradient(0,-72,0,86);stone.addColorStop(0,'#697987');stone.addColorStop(.5,'#384858');stone.addColorStop(1,'#1e2c3a');
  c.fillStyle=stone;c.strokeStyle='#e8ca85';c.lineWidth=3.2;pathRound(c,-56,-56,112,146,44);c.fill();c.stroke();
  c.strokeStyle='rgba(255,244,205,0.28)';c.lineWidth=1.5;pathRound(c,-48,-48,96,130,38);c.stroke();
  // Keystone gem at apex
  c.fillStyle=glow;c.strokeStyle='#142732';c.lineWidth=2;c.beginPath();c.moveTo(0,-66);c.lineTo(10,-52);c.lineTo(0,-38);c.lineTo(-10,-52);c.closePath();c.fill();c.stroke();
  // Luminous inner rune portal
  const portal=c.createRadialGradient(0,6,4,0,6,56);portal.addColorStop(0,s.done?'#2a5f5f':'#3ea3b0');portal.addColorStop(.65,'#193c4d');portal.addColorStop(1,'#0d2332');
  c.fillStyle=portal;c.beginPath();c.ellipse(0,8,36,52,0,0,TAU);c.fill();
  c.strokeStyle=glow;c.lineWidth=3;c.beginPath();c.ellipse(0,8,32,48,0,0,TAU);c.stroke();
  const bob=Math.sin(t*.0024+s.x)*4.5;
  c.fillStyle='#fffbe2';c.font='bold 34px Georgia';c.textAlign='center';c.fillText(s.done?'✓':sym[s.subject],0,19+bob);
  // Crisp bronze plaque
  c.fillStyle='#0e2736';c.strokeStyle='#f2cf88';c.lineWidth=2.2;pathRound(c,-64,66,128,30,8);c.fill();c.stroke();
  c.fillStyle='#fff4d2';c.font='800 15px system-ui, sans-serif';c.fillText((s.subject==='general'?'DISCOVER':s.subject.toUpperCase()),0,87);
  for(let j=0;j<8;j++){const a=t*.0011+j*TAU/8;const px=Math.sin(a)*54,py=Math.cos(a)*44;c.fillStyle=glow;c.globalAlpha=s.done?.12:.58;c.fillRect(px-2,py-2,3.5,3.5)}c.restore();}}
 drawGate(d,cam,state,t){if(d.world===0){const c=this.ctx;const x=d.length-165-cam;if(x<-220||x>WIDTH+220)return;const y=d.ground;const unlocked=state.keys===4&&(!d.boss||state.bossHp===0);const img=ready('world1-v6/rune-shrine.png');c.save();c.globalAlpha=unlocked?1:.88;if(img){c.drawImage(img,x-119,y-264,238,285)}c.textAlign='center';c.fillStyle=unlocked?'#d2fff6':'#f9e7bc';c.font='bold 37px Georgia';c.fillText(unlocked?'✦':'◇',x,y-124);// Readable typography is drawn above the scene, never baked into scenery pixels.
  c.globalAlpha=1;
  c.fillStyle=unlocked?'#124d51':'#0d3545';c.strokeStyle='#f8d490';c.lineWidth=4;
  pathRound(c,x-94,y-68,188,44,10);c.fill();c.stroke();
  c.font='900 21px system-ui, sans-serif';c.lineWidth=3.4;c.strokeStyle='#092634';
  c.strokeText('DISCOVER',x,y-40);c.fillStyle='#fff3ca';c.fillText('DISCOVER',x,y-40);
  if(unlocked){c.font='bold 12px system-ui';c.fillStyle='#c5fff1';c.fillText('OPEN',x,y-18);}
  c.restore();return}const c=this.ctx;const x=d.length-165-cam;if(x<-180||x>WIDTH+180)return;const y=d.ground;const open=state.keys===4&&(!d.boss||state.bossHp===0);
 c.save();c.translate(x,y);
 // Ornate monolithic Exit Arch for Worlds 2-10
 const arch=c.createLinearGradient(0,-230,0,0);arch.addColorStop(0,'#7c8a98');arch.addColorStop(.5,'#455364');arch.addColorStop(1,'#24313f');
 c.fillStyle=arch;c.strokeStyle='#f0cf88';c.lineWidth=4;pathRound(c,-94,-226,188,226,86);c.fill();c.stroke();
 c.strokeStyle='rgba(255,244,210,0.32)';c.lineWidth=2;pathRound(c,-80,-212,160,204,74);c.stroke();
 // Inner glowing portal
 const pg=c.createRadialGradient(0,-105,8,0,-105,86);
 pg.addColorStop(0,open?'#b8fff0':'#347088');pg.addColorStop(.55,open?'#299e9c':'#1a435a');pg.addColorStop(1,'#0c2233');
 c.fillStyle=pg;c.beginPath();c.ellipse(0,-102,58,92,0,0,TAU);c.fill();
 c.strokeStyle=open?'#b8ffe8':'#f6da94';c.lineWidth=5;c.stroke();
 // Keystone crystal
 c.fillStyle=open?'#a8ffea':'#f8d88a';c.strokeStyle='#152834';c.lineWidth=2.4;
 c.beginPath();c.moveTo(0,-240);c.lineTo(14,-218);c.lineTo(0,-196);c.lineTo(-14,-218);c.closePath();c.fill();c.stroke();
 c.font='bold 42px Georgia';c.fillStyle=open?'#ecfff8':'#f4e5b8';c.textAlign='center';c.fillText(open?'✦':'◇',0,-94);
 // Crisp DISCOVER / OPEN plaque
 c.fillStyle=open?'#124d51':'#0d3545';c.strokeStyle='#f8d490';c.lineWidth=3.5;
 pathRound(c,-88,-54,176,40,10);c.fill();c.stroke();
 c.font='900 19px system-ui, sans-serif';c.fillStyle='#fff3ca';c.fillText('DISCOVER',0,-28);
 if(open){c.font='bold 11px system-ui';c.fillStyle='#c5fff1';c.fillText('OPEN',0,-8);}
 c.restore()}
 actor(state,cam,t){
 const c=this.ctx;
 // Heroic grounded lookout stance on the Title screen (no awkward moonwalking!)
 const titleGround=this.stage?.ground||584;
 const player=state.scene==='title'?{x:cam+815,y:titleGround-62,w:38,h:62,vx:0,vy:0,face:1,inv:0,run:0,grounded:true,cast:0,land:0}:state.player;
 if(!player)return;
 const x=player.x-cam,feet=player.y+player.h;if(player.inv>0&&!(state.feel?.dashTimer>0)&&Math.sin(player.inv*28)>0)return;
 const pose=this.heroMixer.update(player,t),sheets=['cape.png','rear-arm.png','back-leg-v141.png','body-v1411-clean.png','front-leg.png','front-arm-v1411-clean.png'];
 const fullyLoaded=sheets.every(k=>ready(`animation/ari/${k}`));
 const groundY=state.scene==='title'?titleGround:(state.levelData?.ground??feet);
 const fx=evaluateHeroMotionFX(player,pose,state.scene==='title'?null:state.feel,t,groundY,this._heroFXScratch||(this._heroFXScratch={lastFace:1,turnScale:1,lastTime:t}));
 const face=player.face===-1?-1:1;
 c.save();
 // Height-accurate grounded shadow (shrinks softly as Ari leaps high!)
 c.fillStyle=`rgba(5,24,30,${fx.shadowAlpha.toFixed(2)})`;
 c.beginPath();c.ellipse(x,Math.min(groundY+3,feet+3),34*fx.shadowScale,6.2*fx.shadowScale,0,0,TAU);c.fill();
 // Anchor volume-preserving squash-stretch AT FEET PIVOT so landing never floats Ari off the ground
 if(!this.useLegacyAriRig){
  const skel=evaluateAriSkeleton(player,pose,state.scene==='title'?null:state.feel,t);
  const athleticScale=1.04;
  const softSy=1+(fx.scaleY-1)*0.52;
  const softSx=1/Math.sqrt(clamp(softSy,0.85,1.18));
  c.translate(x,feet);
  c.scale(player.face===-1?-1:1,1);
  c.scale(softSx*fx.turnScale*athleticScale,softSy*athleticScale);
  drawAthleticAri(c,skel);
  if(fx.castGlow>0.05&&skel.frontArm?.hand){
   this.vfx.drawGlow(c,skel.frontArm.hand.x+4,skel.frontArm.hand.y-1,38*fx.castGlow,'cyan',.75*fx.castGlow);
  }
 }else{
  c.translate(x,feet+pose.bob+this.ariContactOffset(pose,player));
  c.scale(player.face===-1?-1:1,1);
  c.scale(fx.scaleX*fx.turnScale,fx.scaleY);
  c.rotate(pose.lean+fx.extraLean);
  if(fullyLoaded){c.translate(-74,-116);c.scale(149/285,125/235);
   const capeWave=state.scene==='title'?Math.sin(t*.0042)*.14:Math.sin(t*.008+fx.capeBoost*4)*(.05+fx.capeBoost*.22);
   this.limbPart('animation/ari/cape.png',[145,80],pose.scarf-fx.capeBoost*.65+capeWave,-2*Math.sin(t*.007),0);
   c.fillStyle='#2c4564';c.beginPath();c.ellipse(149,146,13,10,0,0,TAU);c.ellipse(185,143,13,10,0,0,TAU);c.fill();
   this.limbPart('animation/ari/rear-arm.png',[132,94],pose.arms[0]);
   if(!this.articulatedLeg('rear',[147,145],[120,168],clamp(pose.legs[1]*.78,-.49,.49),pose.ankles?.[1]||0,pose.legLift?.[1]||0))
    this.limbPart('animation/ari/back-leg-v141.png',[147,145],clamp(pose.legs[1]*.78,-.49,.49),0,pose.legLift?.[1]||0);
   this.drawImage(ready('animation/ari/body-v1411-clean.png'),0,0,285,235);
   if(!this.articulatedLeg('front',[187,141],[217,166],clamp(pose.legs[0]*.79,-.49,.49),pose.ankles?.[0]||0,pose.legLift?.[0]||0))
    this.limbPart('animation/ari/front-leg.png',[187,141],clamp(pose.legs[0]*.79,-.49,.49),0,pose.legLift?.[0]||0);
   this.limbPart('animation/ari/front-arm-v1411-clean.png',[209,101],pose.arms[1]);
   if(this.debugCharacter){const cc=this.ctx;cc.save();cc.lineWidth=1.6;cc.strokeStyle='#fef56b';cc.strokeRect(0,0,285,235);for(const [px,py,col] of [[147,145,'#ff8b8b'],[187,141,'#88f0ff']]){cc.strokeStyle=col;cc.beginPath();cc.arc(px,py,6,0,Math.PI*2);cc.stroke();}cc.restore();}
  }else{this.drawImage(ready('ari.png'),-74,-116,149,125)}
 }
 c.restore();
 // Trigger footstep cues only on contact changes. Effects follow the grounded foot.
 for(const event of pose.events){
  if(event.type==='footstep'||event.type==='landing')this.footstepVisuals.push({x,feet,created:t,intensity:event.type==='landing'?1:.5,dir:player.face||1});
 }
 this.footstepVisuals=this.footstepVisuals.filter(f=>t-f.created<420);
 for(const f of this.footstepVisuals){const age=clamp((t-f.created)/420,0,1);
  c.save();c.globalAlpha=(1-age)*f.intensity*.30;c.fillStyle='#e6e7b7';
  for(let i=0;i<3;i++){c.beginPath();c.ellipse(f.x-f.dir*(7+age*22)+i*6,f.feet-2-i*2-age*(6+i*3),2.5+age*3,2+age*2,0,0,TAU);c.fill()}
  c.restore();}

 }
 particles(cam,state,t){const c=this.ctx;const par=state.particles||[];for(const pt of par){const x=pt.x-cam;if(x<-30||x>WIDTH+30)continue;const a=clamp(pt.life,0,1);this.vfx.drawGlow(c,x,pt.y,(pt.size||3)*3.4,'gold',a*.45);c.save();c.globalAlpha=a;c.fillStyle=pt.color||'#ffe9ac';c.beginPath();c.arc(x,pt.y,pt.size||3,0,TAU);c.fill();c.restore()}
 const d=this.stage;for(let i=0;i<this.sparkles.length;i+=(this.perfMode?3:2)){const p=this.sparkles[i];const x=p.x-cam;if(x<0||x>WIDTH||p.y>this.stage.ground-10)continue;const a=.32+.34*Math.sin(t*.0022+p.p);const py=p.y+Math.sin(t*.0008+p.p)*8;if(i%4===0)this.vfx.drawGlow(c,x,py,p.r*5.5,'gold',a*.4);c.save();c.globalAlpha=a;c.fillStyle='#fff4b8';c.beginPath();c.arc(x,py,p.r*.62,0,TAU);c.fill();c.restore()}}
 drawMistwalkWaterline(t){
  // World 1 / Level 3 only. This is decorative water below the collision surface.
  // It does not change pits, platform solidity or player hitboxes.
  const c=this.ctx;c.save();const top=681;
  const g=c.createLinearGradient(0,top,0,720);
  g.addColorStop(0,'rgba(31,126,148,0)');g.addColorStop(.37,'rgba(23,120,145,.28)');g.addColorStop(1,'rgba(12,57,79,.71)');
  c.fillStyle=g;c.fillRect(0,top,WIDTH,HEIGHT-top);
  for(let i=0;i<28;i++){
   const x=(i*79+41)%WIDTH,y=690+(i*17%27),drift=Math.sin(t*.0008+i)*5;
   c.globalAlpha=.08+.13*(.5+.5*Math.sin(i*2+t*.0007));
   c.fillStyle=i%3===0?'#f7fff3':'#a5eff1';c.beginPath();
   c.ellipse(x+drift,y,13+(i%5)*6,1.05+(i%2)*.65,0,0,TAU);c.fill();
  }
  c.globalAlpha=1;c.restore();
 }
 fogForeground(t){const c=this.ctx;const a=c.createLinearGradient(0,500,0,720);a.addColorStop(0,'#a0e9d300');a.addColorStop(.77,'#99edd10d');a.addColorStop(1,'#072d2966');c.fillStyle=a;c.fillRect(0,500,WIDTH,220);const b=c.createRadialGradient(640,310,430,640,310,900);b.addColorStop(0,'#101e1700');b.addColorStop(1,'#081a2875');c.fillStyle=b;c.fillRect(0,0,WIDTH,HEIGHT)}
 frame(state,time){const ctx=this.ctx;if(!this.ctx)return;this.frames++;this.wave=time*.002;const allowed=['play','question','answering','pause','win','dead'];const demo=!allowed.includes(state.scene),d=demo?this.stage:state.levelData;if(!d)return;if(this.stageId!==d.id)this.setStage(d);const demoPan=demo?Math.sin(time*.00028)*140+160:0;const camera=demo?demoPan:state.camera;
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality=this.perfMode?'low':'medium';if(!this._lastFpsCheck)this._lastFpsCheck=time;this._fpsFrames++;if(time-this._lastFpsCheck>3000){const fps=(this._fpsFrames*1000)/(time-this._lastFpsCheck);if(fps<30&&!this.perfMode){this.perfMode=true;try{localStorage.setItem('leap-perf','1')}catch(e){}}this._lastFpsCheck=time;this._fpsFrames=0;}
 // Apply trauma-squared camera shake in gameplay
 const shakeX=!demo&&state.feel?Math.sin(time*.067)*(state.feel.trauma*state.feel.trauma*14):(!demo&&state.shake>0?Math.sin(time*.07)*state.shake*.5:0);
 const shakeY=!demo&&state.feel?Math.cos(time*.089)*(state.feel.trauma*state.feel.trauma*10):(!demo&&state.shake>0?Math.cos(time*.09)*state.shake*.35:0);
 if(shakeX||shakeY)ctx.translate(shakeX,shakeY);
 this.background(d.world,camera,time);
 this.vfx.drawVolumetricRays(ctx,d.world,camera,time,this.perfMode);
 if(!d.v14)this.stageAtmosphere(d,camera,time);
 this.vfx.drawAmbientLife(ctx,d,camera,time,this.perfMode);
 this.layeredForest(camera,d,time);this.ground(d,camera);this.platforms(d,camera,time);this.decorations(d,camera,time);
 this.vfx.drawAdventureBeacons(ctx,d,state,camera,time);
 this.drawCoins(d,camera,time);this.drawShrines(d,camera,time);this.drawGate(d,camera,state,time);this.drawEnemies(d,camera,time,state);
 this.vfx.drawEnemyKOGhosts(ctx,state,camera,ready);
 this.drawBoss(d,camera,time,state);
 this.vfx.drawHeroAuraAndEffects(ctx,state,camera,time,ready);
 this.actor(state,camera,time);this.projectiles(state,camera,time);this.particles(camera,state,time);
 this.vfx.drawCallouts(ctx,state,camera);
 this.fogForeground(time);if(d.world===0&&d.id===3)this.drawMistwalkWaterline(time);if(d.world===0){if(d.v14)WorldOneArt.foreground(ctx,d,camera,time);else this.worldOneForeground(time,camera);}
 this.vfx.drawCinematicFraming(ctx,d,camera,time);
 ctx.restore();
 // Screen-space overlays (unshaken HUD/compass/boss bar/vignette)
 this.vfx.drawHitVignette(ctx,state);
 this.vfx.drawCinematicOverlays(ctx,d,state,time);
 }
 worldOneForeground(t,cam){const c=this.ctx,ferns=ready('world1-v6/ferns-and-blossoms.png'),vines=ready('world1-v6/cascade-vines.png');if(!ferns)return;
  // Edge framing uses subdued translucent foreground, preserving enemy readability.
  c.save();c.globalAlpha=.34;this.drawImage(ferns,-95,610,270,225);this.drawImage(ferns,1145,619,270,225);c.restore();
 }
 drawCoins(d,cam,t){for(let i=0;i<d.coins.length;i++){const coin=d.coins[i];if(coin.got)continue;const x=coin.x-cam;if(x<-50||x>WIDTH+50)continue;this.drawCoin(x,coin.y,t,i)}}
 projectiles(state,cam,t){this.vfx.drawArcaneProjectiles(this.ctx,state,cam,t)}
 getDiagnostics(){return{renderer:this.graphics,level:this.stage?.id,world:this.stage?.world,assetsLoaded:Object.values(images).filter(x=>x.complete&&(x.naturalWidth||x.width)>0).length,assetTotal:Object.keys(images).length,drawnFrames:this.frames,sceneObjects:this.sceneObjects,renderSize:[this.canvas.width,this.canvas.height]}}
 dispose(){}
}
