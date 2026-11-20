/** Learn & Leap — Three.js 3D rendering engine.
 * Gameplay and collision detection remain in original, tested 100-level 2D physics.
 * All visible gameplay objects are 3D geometry in an orthographic 2.5D world.
 * Three.js is pinned and provided via CDN to allow deployment without a build step.
 */
import * as T from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

const S=0.01, W=1280,H=720;
const ypix=n=>(H-n)*S;
const rgba=s=>new T.Color(s);
const frac=x=>x-Math.floor(x);
const hash=n=>frac(Math.sin(n*71.723+2.1)*43758.5453);
const cap=(a,b,c)=>Math.max(b,Math.min(c,a));

function mat(hex,metalness=0,roughness=.78,emissive=null){return new T.MeshStandardMaterial({color:hex,roughness,metalness,emissive:emissive||0x000000,emissiveIntensity:emissive?.65:0});}
const emissive=(hex,intensity=1.3)=>new T.MeshStandardMaterial({color:hex,emissive:hex,emissiveIntensity:intensity,roughness:.24,metalness:.22});
const basic=hex=>new T.MeshBasicMaterial({color:hex,transparent:true,opacity:.95});
function mesh(parent,geo,material,x=0,y=0,z=0){const o=new T.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function sphere(parent,r,material,x=0,y=0,z=0,segments=14){return mesh(parent,new T.SphereGeometry(r,segments,10),material,x,y,z)}
function box(parent,w,h,d,material,x=0,y=0,z=0){return mesh(parent,new T.BoxGeometry(w,h,d),material,x,y,z)}
function cone(parent,r,h,material,x=0,y=0,z=0,segments=8){return mesh(parent,new T.ConeGeometry(r,h,segments),material,x,y,z)}
function cyl(parent,rt,rb,h,material,x=0,y=0,z=0,segments=10){return mesh(parent,new T.CylinderGeometry(rt,rb,h,segments),material,x,y,z)}
function torus(parent,r,t,material,x=0,y=0,z=0){return mesh(parent,new T.TorusGeometry(r,t,8,24),material,x,y,z)}
function plane(parent,w,h,material,x=0,y=0,z=0){return mesh(parent,new T.PlaneGeometry(w,h),material,x,y,z)}
function group(parent,x=0,y=0,z=0){const o=new T.Group();o.position.set(x,y,z);parent.add(o);return o;}
function part(parent,length,rad,material,x,y,z,rz=0){const o=cyl(parent,rad*.78,rad,length,material,x,y,z);o.rotation.z=rz;return o;}
function setShadow(o){o.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true;}});return o}
const worldColor=[
 {leaf:0x397d49,grass:0x78b94f,rock:0x556b61,accent:0xbaff86,sky:0x9acdc2,wood:0x705037},
 {leaf:0x7568bc,grass:0x8d8bd8,rock:0x51496e,accent:0xc7a3ff,sky:0x9689bc,wood:0x65517d},
 {leaf:0x6ab3e7,grass:0x94daae,rock:0x62849a,accent:0xffe7a6,sky:0x95cfff,wood:0x7a9da3},
 {leaf:0xc4543c,grass:0xda8d4a,rock:0x54383c,accent:0xff9e43,sky:0xcf7366,wood:0x69403a},
 {leaf:0x8de0ef,grass:0xa1ecff,rock:0x7c92aa,accent:0xdbf8ff,sky:0xa6d5ea,wood:0x8ab0bf},
 {leaf:0x23ac9b,grass:0x4fd6af,rock:0x477f96,accent:0xffdca0,sky:0x86d6d0,wood:0x3b938b},
 {leaf:0x9f85b6,grass:0x9cbba5,rock:0x665773,accent:0xffbd6e,sky:0xac9cac,wood:0x8f684a},
 {leaf:0x5d6ca4,grass:0x728e90,rock:0x49466a,accent:0xc6fb9f,sky:0x5e718e,wood:0x575177},
 {leaf:0x5d5ed0,grass:0x8b94d9,rock:0x545f93,accent:0xf7e4a7,sky:0x9996d3,wood:0x73659c},
 {leaf:0x9b5dc1,grass:0xc78ad6,rock:0x6e577e,accent:0xffe6a5,sky:0xa288c6,wood:0x957aa2}
];

/** Original low-poly hero. The hierarchy is a real 3D animated joint rig, not a flat sprite. */
function createHero(){
 const root=new T.Group(), body=group(root,0,.53,0),skin=mat(0xffd3aa),hair=mat(0x3e2426),eyes=mat(0x172b3e,.05,.23),white=mat(0xffffff),shirt=mat(0xf0ede7),jacket=mat(0x2c8ba6),pants=mat(0x2a4159),boot=mat(0x493c35),red=mat(0xd93441,.12,.48),metal=mat(0xc7b075,.72,.26);
 // Backpack + layered torso
 box(body,.33,.43,.25,jacket,0,.10,-.12);sphere(body,.29,jacket,0,.08,.01).scale.set(1,.85,.69);
 sphere(body,.34,skin,0,.57,.03).scale.set(.93,1.05,.9);
 sphere(body,.32,hair,0,.76,-.04).scale.set(1.08,.60,1);
 for(let i=0;i<7;i++){const x=(i-3)*.087;cone(body,.12,.19,hair,x,.94+hash(i)*.1,0).rotation.z=(i-3)*-.16}
 for(const x of [-.125,.125]){sphere(body,.061,white,x,.61,.31);sphere(body,.033,eyes,x+.014,.61,.367);sphere(body,.015,white,x+.022,.621,.395)}
 sphere(body,.06,skin,0,.48,.33).scale.set(.72,.52,.6);
 torus(body,.10,.018,mat(0x9b4a42),0,.405,.335).scale.set(1,.35,1);
 box(body,.42,.16,.21,red,0,.30,.13);const scarf=group(body,-.16,.31,-.05);const tail=box(scarf,.38,.09,.065,red,-.15,-.04,0);tail.rotation.z=.19;
 box(body,.45,.33,.13,shirt,0,.11,.25);box(body,.32,.035,.145,metal,0,.03,.328);
 const arms=[],legs=[];
 for(let side of [-1,1]){
  const a=group(body,side*.31,.23,0);arms.push(a);part(a,.36,.085,jacket,side*.05,-.15,0,side*.22);sphere(a,.11,skin,side*.09,-.34,.02);
  const l=group(root,side*.16,.51,0);legs.push(l);part(l,.33,.103,pants,0,-.17,0,side*.09);sphere(l,.135,boot,.06,-.38,.10).scale.set(1.35,.65,1.0);
 }
 const belt=box(body,.49,.09,.34,boot,0,-.105,0);box(body,.11,.07,.36,metal,0,-.105,0);
 root.userData={arms,legs,body,scarf,tail};return root;
}

function createEnemy(world,kind){
 const root=new T.Group(),palette=worldColor[world],main=mat(palette.leaf),dark=mat(palette.rock),gold=emissive(palette.accent,.7),ivory=mat(0xfff3d5),black=mat(0x172331);
 const shape=(world+kind)%6;
 const limbs=[];
 if(shape===0){ // Forest sprite / mushroom crab
  sphere(root,.37,main,0,.32,0).scale.set(1.1,.78,.85);cone(root,.47,.31,dark,0,.70,0);for(let i=0;i<7;i++)sphere(root,.075,ivory,Math.sin(i*2)*.25,.65,Math.cos(i*2)*.2);
 }else if(shape===1){ // Crystal rockling
  sphere(root,.37,dark,0,.39,0).scale.set(1,.83,.9);for(let i=0;i<5;i++){const p=cone(root,.125,.42,main,(i-2)*.15,.69,0);p.rotation.z=(i-2)*.16}torus(root,.29,.045,gold,0,.43,.28);
 }else if(shape===2){ // Winged dusk creature
  sphere(root,.27,main,0,.42,0);for(const d of [-1,1]){const wing=cone(root,.27,.46,dark,d*.42,.5,-.10);wing.rotation.z=d*1.1;limbs.push(wing)}
 }else if(shape===3){ // Mechanical orb
  sphere(root,.34,dark,0,.37,0);torus(root,.35,.055,gold,0,.42,.06);sphere(root,.18,main,0,.42,.29);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;cone(root,.11,.22,dark,Math.sin(a)*.35,.39+Math.cos(a)*.35,0).rotation.z=-a}
 }else if(shape===4){ // Armoured shell beast
  sphere(root,.47,dark,0,.34,0).scale.set(1.1,.6,1);sphere(root,.27,main,.17,.27,.25);for(let i=0;i<3;i++)cone(root,.12,.26,gold,(i-1)*.27,.69,-.04);
 }else{ // Celestial bug
  sphere(root,.32,main,0,.39,0).scale.set(1,.85,.7);for(const d of [-1,1]){const wing=sphere(root,.27,dark,d*.25,.6,-.18);wing.scale.set(.7,1.2,.35);limbs.push(wing)}
 }
 for(const d of [-1,1]){sphere(root,.082,ivory,d*.13,.43,.29);sphere(root,.043,black,d*.13,.43,.364);let foot=group(root,d*.24,.22,.04);sphere(foot,.14,dark,0,0,0).scale.set(1,.45,1);limbs.push(foot)}
 root.userData.limbs=limbs;return root;
}

function createBoss(world){
 const p=worldColor[world],root=new T.Group(),stone=mat(p.rock),leaf=mat(p.leaf),ivory=mat(0xffe6b0),glow=emissive(p.accent,1.15),obsidian=mat(0x182d3c,.35,.3),arms=[],leg=[];
 const shape=world%5;
 // Tall articulated torso and separate jointed hands + legs.
 const torso=group(root,0,1.5,-.12);
 const chest=sphere(torso,.79,stone,0,0,0);chest.scale.set(1.0,1.16,.72);
 const breast=mesh(torso,new T.DodecahedronGeometry(.53,0),leaf,0,.13,.44);breast.scale.set(1,.8,.37);
 sphere(torso,.22,glow,0,.04,.72);torus(torso,.35,.055,ivory,0,.04,.69);
 const head=group(torso,0,1.07,.18);sphere(head,.46,stone,0,0,0).scale.set(.94,.95,.85);
 for(const d of [-1,1]){sphere(head,.12,glow,d*.19,.05,.38);cone(head,.19,.58,shape===3?glow:leaf,d*.35,.40,-.10).rotation.z=d*-.48}
 // Uniquely shaped world-specific equipment.
 if(world===0){for(let i=0;i<7;i++) {const x=(i-3)*.16;cone(torso,.16,.55,leaf,x,.55,-.30).rotation.z=(i-3)*-.16}for(const d of [-1,1]){const twig=cone(head,.10,.62,leaf,d*.39,.45,.02);twig.rotation.z=d*-.48}}
 if(world===1||world===8){for(let i=0;i<9;i++){const a=i/9*Math.PI*2;mesh(torso,new T.OctahedronGeometry(.20+hash(i)*.16),glow,Math.sin(a)*.79,.28+Math.cos(a)*.52,.10)}}
 if(world===2){for(let d of [-1,1]){const wing=cone(root,.61,2.1,ivory,d*1.15,2.18,-.2,3);wing.rotation.z=d*.95} }
 if(world===3){for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const flame=cone(root,.16,.53,glow,Math.cos(a)*.85,1.65+Math.sin(a)*.66,-.2);flame.rotation.z=-Math.cos(a)*.38}}
 if(world===4){for(let i=0;i<6;i++){const spike=cone(root,.17,.47,ivory,(i-2.5)*.24,2.85,-.3);spike.rotation.z=(i-2.5)*-.12}}
 if(world===5){for(let d of [-1,1]){for(let j=0;j<3;j++){const t=cone(torso,.17,.83,leaf,d*(.80+j*.15),-.22+j*.31,0);t.rotation.z=d*.9}}}
 if(world===6){for(let d of [-1,1])torus(torso,.44,.10,glow,d*.5,.53,-.1).rotation.y=d*.7;}
 if(world===7){for(let d of [-1,1]){const wing=cone(torso,.58,1.7,obsidian,d*.96,.22,-.38,3);wing.rotation.z=d*.78}}
 if(world===9){for(let i=0;i<5;i++){const tine=cone(head,.14,.7,glow,(i-2)*.21,.62,0);tine.rotation.z=(i-2)*-.18}}
 for(let d of [-1,1]){
   const a=group(torso,d*.81,.36,.0);const upper=part(a,.86,.28,stone,d*.25,-.31,0,d*-.4);sphere(a,.26,leaf,d*.47,-.73,.08);arms.push(a);
   const l=group(root,d*.43,.99,-.06);part(l,.96,.33,stone,0,-.52,0);sphere(l,.39,stone,d*.09,-1.0,.24).scale.set(1.3,.44,1.0);leg.push(l);
 }
 const aura=torus(root,1.23,.03,glow,0,1.55,-.44);aura.rotation.x=.2;
 root.userData={arms,leg,head,torso,aura};return root;
}

function createTree(world,scale=1){const root=new T.Group(),p=worldColor[world],bark=mat(p.wood),foliage=mat(p.leaf,.05,.90),secondary=mat(p.grass),trunk=cyl(root,.14,.24,2.0,bark,0,1,0);trunk.rotation.z=(hash(scale)*.24-.12);for(let i=0;i<3;i++){const leaf=sphere(root,.63+i*.08,i%2?foliage:secondary,(i-1)*.21,2.25+i*.32,0);leaf.scale.set(1.16,.78,.77)}if(world===3||world===6){for(let i=0;i<4;i++)cone(root,.18,.5,mat(p.accent),.22*(i-1),3+i*.1,.03)}if(world===4)for(let i=0;i<5;i++)sphere(root,.25,mat(0xe4faff),(i-2)*.2,2.7,.3);root.scale.setScalar(scale);return root}
function createBuilding(world,scale=1){const p=worldColor[world],r=new T.Group(),stone=mat(p.rock,.08,.83),trim=mat(p.wood),fire=emissive(p.accent,.7);box(r,.83,2.2,.7,stone,0,1.1,-.2);box(r,1.03,.15,.9,trim,0,2.28,-.2);const roof=cone(r,.81,1.07,stone,0,2.84,-.2,4);roof.rotation.y=Math.PI/4;for(let y=.5;y<=1.8;y+=.56){const window=box(r,.17,.30,.025,fire,0,y,.155);window.castShadow=false}r.scale.setScalar(scale);return r}

export class World3D{
 constructor(canvas,worlds){
  this.worlds=worlds;
  this.scene=new T.Scene();this.scene.background=new T.Color('#a6c8cf');
  this.scene.fog=new T.FogExp2('#b7cad2',.018);
  this.camera=new T.OrthographicCamera(-6.4,6.4,3.6,-3.6,.1,100);
  this.renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance',stencil:false});
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.matchMedia('(pointer:coarse)').matches?1.25:1.65));
  this.renderer.setSize(W,H,false);this.renderer.outputColorSpace=T.SRGBColorSpace;
  this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.22;
  this.isMobile=window.matchMedia('(pointer:coarse)').matches;
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
  this.ambient=new T.HemisphereLight(0xc8efff,0x355247,2.25);this.scene.add(this.ambient);
  this.sun=new T.DirectionalLight(0xfff3c8,3.5);this.sun.position.set(2.5,12,7);this.sun.castShadow=true;this.sun.shadow.mapSize.set(this.isMobile?512:1024,this.isMobile?512:1024);
  Object.assign(this.sun.shadow.camera,{left:-10,right:10,top:8,bottom:-8,near:.5,far:50});this.sun.shadow.bias=-.0014;this.sun.shadow.normalBias=.02;this.scene.add(this.sun);
  this.fill=new T.DirectionalLight(0x8ebcff,1.45);this.fill.position.set(-6,5,-5);this.scene.add(this.fill);
  this.heroLight=new T.PointLight(0xffd69c,3.5,6,2);this.scene.add(this.heroLight);
  this.backdrop=null;this.backdropTexture=null;this.backdropTextures={};
  this.levelRoot=group(this.scene);this.dynamicRoot=group(this.levelRoot);this.terrainRoot=group(this.levelRoot);
  this.stage=null;this.stageId=null;this.p=this.worlds[0];this.biome=worldColor[0];
  this.hero=createHero();this.levelRoot.add(this.hero);
  this.coinObjects=[];this.enemyObjects=[];this.shrineObjects=[];this.checkpointObjects=[];this.hazardObjects=[];this.projectiles=[];this.particles=[];
  this.gate=null;this.boss=null;this.fx=[];this.clock=0;
  this.starField=new T.Points(new T.BufferGeometry(),new T.PointsMaterial({color:0xffeed2,size:.032,transparent:true,opacity:.7,depthWrite:false}));this.scene.add(this.starField);
  this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();window.dispatchEvent(new CustomEvent('leap-renderer-error',{detail:'WebGL context was lost. Reload the game.'}))});
 }
 color(hex){return new T.Color(hex)}
 setStage(d){if(!d)return;if(this.stageId===d.id&&this.stage===d)return;this.stage=d;this.stageId=d.id;this.p=this.worlds[d.world];this.biome=worldColor[d.world];
  this.clearLevel();const p=this.biome;
  this.scene.background=this.color(p.sky);this.scene.fog.color.copy(this.color(p.sky));this.scene.fog.density=d.world===7?.023:.011;
  this.sun.color.setHex(d.world===3?0xffb38c:d.world===8?0xffdbf4:0xffe1a8);this.ambient.color.setHex(d.world===3?0xffb07d:0xc9e8ff);
  this.setBackdrop(d.world);
  this.buildGround(d);this.buildPlatforms(d);this.buildDecor(d);this.buildCoins(d);this.buildEnemies(d);this.buildHazards(d);this.buildShrines(d);this.buildGate(d);this.buildBoss(d);
  this.hero=createHero();this.levelRoot.add(this.hero);
 }
 clearLevel(){
  this.scene.remove(this.levelRoot);
  this.levelRoot.traverse(o=>{if(o.isMesh){o.geometry?.dispose();const list=Array.isArray(o.material)?o.material:[o.material];for(const m of list)m?.dispose()} });
  this.levelRoot=group(this.scene);this.terrainRoot=group(this.levelRoot);this.dynamicRoot=group(this.levelRoot);
  this.coinObjects=[];this.enemyObjects=[];this.shrineObjects=[];this.checkpointObjects=[];this.hazardObjects=[];this.projectiles=[];this.particles=[];this.gate=null;this.boss=null;
 }
 setBackdrop(world){
  if(this.backdrop){this.scene.remove(this.backdrop);this.backdrop.geometry.dispose();this.backdrop.material.dispose();this.backdrop=null;}
  const idx=String(world+1).padStart(2,'0');const tex=this.backdropTextures[world]||new T.TextureLoader().load(`assets/world-${idx}.webp`,undefined,undefined,()=>{});
  this.backdropTextures[world]=tex;tex.colorSpace=T.SRGBColorSpace;
  const m=new T.MeshBasicMaterial({map:tex,depthWrite:false,side:T.DoubleSide,fog:false,color:0xffffff});this.backdrop=plane(this.scene,14.7,8.55,m,6.4,3.62,-25);this.backdrop.castShadow=false;this.backdrop.receiveShadow=false;
 }
 buildGround(d){const p=this.biome,soil=mat(p.rock),gr=mat(p.grass),trim=mat(p.leaf),under=mat(p.wood);
  // Gap-exclusion from exactly the same pit data as gameplay collision.
  const gaps=[{x:0,w:0},...d.pits.slice().sort((a,b)=>a.x-b.x),{x:d.length,w:0}];const surface=ypix(d.ground);
  for(let i=0;i<gaps.length-1;i++){const left=gaps[i].x+gaps[i].w,right=gaps[i+1].x;if(right-left<8)continue;let lo=left;while(lo<right){let hi=Math.min(lo+400,right),width=(hi-lo)*S,cx=(lo+hi)*S/2;
    box(this.terrainRoot,width,1.8,3.1,soil,cx,surface-.9,0);
    box(this.terrainRoot,width,.14,3.18,gr,cx,surface-.035,0);
    box(this.terrainRoot,width,.10,3.16,trim,cx,surface-.11,-.06);
    for(let r=0;r<Math.max(1,Math.floor(width*3));r++){const rx=lo*S+hash((i+1)*221+r)*width;const stone=mesh(this.terrainRoot,new T.DodecahedronGeometry(.13+hash(r*7)*.08),under,rx,surface-.25+hash(r)*.19,1.54);stone.scale.z=.22}
    lo=hi;}
  }
 }
 buildPlatforms(d){const p=this.biome,rock=mat(p.rock),gr=mat(p.grass),gold=mat(p.wood);for(const [i,s] of d.platforms.entries()){
  const x=(s.x+s.w/2)*S,y=ypix(s.y)-.14,w=s.w*S;
  box(this.terrainRoot,w,.26,2.05,rock,x,y,0);box(this.terrainRoot,w,.095,2.16,gr,x,y+.19,0);
  for(let j=0;j<Math.max(2,Math.floor(s.w/55));j++){const xx=s.x*S+(j+.5)*(w/Math.max(2,Math.floor(s.w/55)));const stone=mesh(this.terrainRoot,new T.DodecahedronGeometry(.10,0),gold,xx,y-.19,.78);stone.scale.set(1.1,.5,.9)}
  if(i%3===0){for(let j=0;j<3;j++){const xx=s.x*S+.2+j*.3;const tu=cone(this.terrainRoot,.045,.17,mat(p.leaf),xx,y+.28,.30);tu.rotation.z=.1*j}}
 }}
 buildDecor(d){const p=this.biome,ground=ypix(d.ground),length=d.length*S;
  // Distant silhouettes, physically behind the play plane, with parallax under a real camera.
  for(let i=0;i<Math.floor(length/2.8)+6;i++){let xx=i*2.8+hash(i+d.world)*1.2;const r=d.world===6?createBuilding(d.world,.73+hash(i)*.7):createTree(d.world,.45+hash(i*3)*.8);r.position.set(xx,ground-.15,-7.0-hash(i*22)*2);this.terrainRoot.add(r);r.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false}})}
  for(let i=0;i<Math.floor(length/1.6);i++){
   const x=(.3+i*1.6+hash(i*23+d.id)*.65);if(x>length)break;
   const inGap=d.pits.some(v=>x*100>v.x&&x*100<v.x+v.w);if(inGap)continue;
   const r=hash(i*2+d.id);
   if(i%3===0&&![3,4,7].includes(d.world)){const tr=createTree(d.world,.52+.35*r);tr.position.set(x,ground,.95);this.terrainRoot.add(tr)}
   else if(i%5===0){const rock=mesh(this.terrainRoot,new T.DodecahedronGeometry(.21+.22*r),mat(p.rock),x,ground+.08,1.13);rock.scale.set(1.35,.77,.7)}
   else{const tufts=group(this.terrainRoot,x,ground,.96);for(let t=0;t<3;t++)cone(tufts,.05,.16,mat(t%2?p.leaf:p.grass),(t-1)*.09,.08,.0,5)}
  }
  // World-specific geometric set dressing.
  if(d.world===1){for(let i=0;i<25;i++){const x=hash(i*11+d.id)*length;const crystal=mesh(this.terrainRoot,new T.OctahedronGeometry(.12+hash(i)*.30),emissive(i%2?0x9bdcff:0xcba8ff,.65),x,ground+.5,-1.9);crystal.rotation.z=i*.27}}
  if(d.world===3){for(let i=0;i<20;i++){const x=hash(i*35+d.id)*length;const flame=cone(this.terrainRoot,.19,.56,emissive(0xff8b3d,.8),x,ground+.24,-.8);flame.rotation.z=.13}}
  if(d.world===4){for(let i=0;i<22;i++){const x=hash(i*13+d.id)*length;cone(this.terrainRoot,.2,.55,mat(0xc9f5ff),x,ground+.31,-1.9,5)}}
  if(d.world===5){for(let i=0;i<28;i++){const x=hash(i*17+d.id)*length;cyl(this.terrainRoot,.07,.14,.45,mat(i%2?0xffb2a8:0x4dd4d0),x,ground+.22,-2.0,7)}}
  if(d.world===6){for(let i=0;i<Math.floor(length/4);i++){const x=i*4+1.5;const cog=torus(this.terrainRoot,.44,.095,mat(0xcc9d68,.67,.26),x,ground+1.85,-3);cog.rotation.y=.5;cog.userData.spin=true;this.fx.push(cog)}}
  if(d.world===8){for(let i=0;i<20;i++){const x=hash(i*23+d.id)*length;mesh(this.terrainRoot,new T.IcosahedronGeometry(.13+hash(i)*.08),emissive(0xffe0ad,.8),x,ground+1.5,-3)}}
 }
 buildCoins(d){const gold=mat(0xffc54a,.75,.16),rim=mat(0xffec9e,.85,.22),core=emissive(0xffeeb0,.35);for(const c of d.coins){const root=group(this.dynamicRoot,c.x*S,ypix(c.y),.25);const ring=torus(root,.115,.035,gold);ring.rotation.y=.17;const centre=cyl(root,.045,.045,.014,rim,0,0,0,24);centre.rotation.x=Math.PI/2;const gem=mesh(root,new T.OctahedronGeometry(.048),core);gem.position.z=.04;this.coinObjects.push({item:c,root})}}
 buildEnemies(d){for(const e of d.enemies){const root=createEnemy(d.world,e.kind);root.position.set(e.x*S,ypix(d.ground),.25);this.dynamicRoot.add(root);this.enemyObjects.push({item:e,root,phase:hash(e.x)*6})}}
 buildHazards(d){const p=this.biome;for(const h of d.hazards){const o=group(this.dynamicRoot,h.x*S,ypix(d.ground),.8);if(h.kind===0){for(let i=-2;i<=2;i++)cone(o,.065,.28,mat(0x9eaea7),i*.14,.10,0)}else if(h.kind===1){cone(o,.27,.9,emissive(0xff8c31,1.5),0,.43,0);sphere(o,.20,emissive(0xffd56c,1.8),0,.17,0)}else if(h.kind===2){for(let i=0;i<3;i++)torus(o,.35+i*.1,.028,emissive(0x9ce8ff,1),0,.38+i*.35,0).rotation.x=.9}else if(h.kind===3){box(o,.85,.035,.55,emissive(0xb3e7ff,.45),0,.055,0)}else{mesh(o,new T.OctahedronGeometry(.26),emissive(p.accent,.9),0,.77,0)}this.hazardObjects.push({item:h,root:o})}}
 buildShrines(d){const palette=[0xeebd60,0xba96ff,0x74e5b0,0x8cc9ff];const names=['math','english','science','general'];for(const [i,s] of d.shrines.entries()){
  const x=s.x*S,root=group(this.dynamicRoot,x,ypix(d.ground),.15),color=palette[names.indexOf(s.subject)],stone=mat(this.biome.rock),gold=mat(0xd5bd84,.5,.36),lum=emissive(color,1.6);
  cyl(root,.38,.46,.27,stone,0,.12,0);for(const side of [-1,1]){box(root,.14,.88,.14,stone,side*.33,.59,0);sphere(root,.14,gold,side*.33,1.09,0)}
  const ring=torus(root,.30,.058,lum,0,1.19,0);const spin=torus(root,.39,.023,lum,0,1.19,0);spin.rotation.y=.46;const inner=mesh(root,new T.OctahedronGeometry(.17,0),lum,0,1.18,0);const light=new T.PointLight(color,2.2,3,.9);light.position.set(0,1.2,.30);root.add(light);
  this.shrineObjects.push({item:s,root,ring,spin,inner,light})
 }}
 buildGate(d){const o=group(this.dynamicRoot,(d.length-160)*S,ypix(d.ground),.1),rock=mat(this.biome.rock),lit=emissive(this.biome.accent,1.25),closed=mat(0x132931,.7,.3);
  for(const dx of [-.65,.65]){box(o,.27,2.2,.38,rock,dx,1.1,0);cyl(o,.23,.3,.25,lit,dx,2.25,0)}
  box(o,1.62,.26,.51,rock,0,2.28,0);
  const arch=torus(o,.63,.06,lit,0,1.25,.20);arch.scale.y=1.53;const veil=plane(o,1.1,2.1,closed,0,1.18,.10);veil.rotation.y=0;
  const light=new T.PointLight(this.biome.accent,2,4);light.position.set(0,1.3,.3);o.add(light);this.gate={root:o,arch,veil,light,open:false,lit,closed};
 }
 buildBoss(d){this.boss=null;if(!d.boss)return;const root=createBoss(d.world);root.position.set(d.bossX*S,ypix(d.ground)+.05,-.1);this.dynamicRoot.add(root);this.boss={root,baseline:ypix(d.ground),alive:true};const p=new T.PointLight(this.biome.accent,4,6);p.position.set(0,1.8,2);root.add(p)}
 /** Apply authoritative 2D game state to animated 3D meshes; no game rules duplicated. */
 frame(state,time){this.clock=time/1000;
   const demo=!['play','question','answering','pause','win','dead'].includes(state.scene);
   const d=demo?this.stage:state.levelData;if(!d)return;if(this.stageId!==d.id)this.setStage(d);
   const player=demo?{x:910,y:d.ground-62,vx:20,vy:0,h:62,face:-1,grounded:true,inv:0,run:time*.003}:state.player;
   const cam=demo?0:state.camera;const tx=(cam+640)*S;
   this.camera.position.set(tx+(state.shake||0)*S*Math.sin(this.clock*73)*.3,5.1+(state.shake||0)*S*Math.cos(this.clock*91)*.2,19.3);this.camera.lookAt(tx,3.60,0);
   this.sun.position.set(tx+4.8,13,9);this.sun.target.position.set(tx,1.6,0);this.sun.target.updateMatrixWorld();
   if(this.backdrop){this.backdrop.position.x=tx+Math.sin(this.clock*.15)*.13;this.backdrop.position.y=3.55}
   this.hero.position.set(player.x*S,ypix(player.y+player.h),.40);
   this.hero.scale.x=player.face<0?-1:1;
   const h=this.hero.userData,v=Math.abs(player.vx)/315,air=!player.grounded;
   this.hero.position.y+=air?.09:Math.abs(Math.sin(player.run*1.15))*.04*v;
   this.hero.rotation.z=air?-.11:Math.sin(player.run)*.028*v;
   h.arms.forEach((a,i)=>{a.rotation.z=(i===0?-1:1)*(air?-.8:Math.sin(player.run*1.4+i*Math.PI)*.65*v)});
   h.legs.forEach((leg,i)=>{leg.rotation.z=air?(i===0?.52:-.4):Math.sin(player.run*1.4+i*Math.PI)*.72*v});
   h.body.rotation.z=Math.sin(this.clock*2)*.015;h.scarf.rotation.z=Math.sin(this.clock*7+player.run)*.18-v*.11;
   const invBlink=player.inv>0&&Math.sin(player.inv*29)>0;this.hero.visible=!invBlink;
   this.heroLight.position.set(player.x*S,ypix(player.y+player.h)+1.5,2);
   this.coinObjects.forEach((q,i)=>{q.root.visible=!q.item.got;if(q.root.visible){q.root.position.y=ypix(q.item.y)+Math.sin(this.clock*3+i)*.055;q.root.rotation.y=this.clock*1.6+i*.26}});
   this.enemyObjects.forEach((q,i)=>{q.root.visible=q.item.alive;if(q.item.alive){q.root.position.x=q.item.x*S;q.root.position.y=ypix(d.ground)+.04+Math.abs(Math.sin(this.clock*3+q.phase))*.09;q.root.rotation.y=Math.sin(this.clock*2+q.phase)*.16;const limbs=q.root.userData.limbs||[];limbs.forEach((o,j)=>o.rotation.z=Math.sin(this.clock*4+j*2+q.phase)*.23)}});
   this.shrineObjects.forEach((q,i)=>{q.inner.rotation.y=this.clock*1.4+i;q.inner.rotation.z=this.clock*.8;q.spin.rotation.z=this.clock*.36;q.spin.rotation.y=Math.sin(this.clock*.6)*.25;q.root.position.y=ypix(d.ground)+Math.sin(this.clock*1.6+i)*.022;q.light.intensity=q.item.done?.85:2.2;q.ring.material.emissiveIntensity=q.item.done?.3:1.6;q.inner.scale.setScalar(q.item.done?.55:1)});
   this.hazardObjects.forEach(({item,root},i)=>{const phase=Math.sin(this.clock*(item.kind===1?2.4:2.8)+item.phase);if(item.kind===1)root.scale.y=.4+Math.max(0,phase)*1.4;else if(item.kind===4)root.position.y=ypix(d.ground)+Math.sin(this.clock*2+item.phase)*.35;else if(item.kind===2)root.rotation.y=this.clock*1.3});
   if(this.gate){const open=state.keys===4&&(!d.boss||state.bossHp<=0);this.gate.veil.material=open?this.gate.lit:this.gate.closed;this.gate.veil.scale.x=open?.02:1;this.gate.arch.rotation.z=Math.sin(this.clock*1.1)*.035;this.gate.light.intensity=open?4:1.5}
   if(this.boss){this.boss.root.visible=state.bossHp>0&&!demo;const rig=this.boss.root.userData;if(this.boss.root.visible){this.boss.root.position.y=this.boss.baseline+Math.sin(this.clock*1.6)*.06;rig.arms.forEach((o,i)=>{o.rotation.z=Math.sin(this.clock*2+i*Math.PI)*.14*(state.bossPulse>0?2.5:1)});rig.head.rotation.z=Math.sin(this.clock*.95)*.1;rig.aura.rotation.z=this.clock*.65;rig.aura.material.emissiveIntensity=state.bossPulse>0?2.7:1.0}}
   // Pooled per-shot 3D emissive projectiles and magic impact particles.
   while(this.projectiles.length<state.projectiles.length){const pr=group(this.dynamicRoot);sphere(pr,.10,emissive(0xd6ffc9,2));const aura=torus(pr,.19,.023,emissive(0xffe9ad,1.4));pr.userData.aura=aura;this.projectiles.push(pr)}
   this.projectiles.forEach((pr,i)=>{const s=state.projectiles[i];pr.visible=!!s;if(s){pr.position.set(s.x*S,ypix(s.y),.65);pr.userData.aura.rotation.x=this.clock*4;pr.userData.aura.rotation.y=this.clock*2}});
   // Atmosphere: points in world units relative to camera, different hue per biome.
   const pos=this.starField.geometry.attributes.position?.array||new Float32Array(130*3);
   for(let i=0;i<130;i++){pos[i*3]=tx-7+hash(i*3+d.world)*14;pos[i*3+1]=.7+hash(i*11+d.world)*6;pos[i*3+2]=-6+hash(i*7)*9;pos[i*3+1]+=Math.sin(this.clock+i)*.018}
   if(!this.starField.geometry.attributes.position)this.starField.geometry.setAttribute('position',new T.BufferAttribute(pos,3));else this.starField.geometry.attributes.position.needsUpdate=true;
   this.renderer.render(this.scene,this.camera);
 }
 getDiagnostics(){return{renderer:'Three.js WebGL',version:T.REVISION,world:this.stage?.world,level:this.stage?.id,meshes:(()=>{let n=0;this.levelRoot.traverse(o=>{if(o.isMesh)n++});return n})(),heroRig:!!this.hero?.userData?.arms,hasBoss:!!this.boss,renderSize:[this.renderer.domElement.width,this.renderer.domElement.height]}}
 dispose(){this.clearLevel();this.renderer.dispose();}
}
