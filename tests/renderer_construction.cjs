/* Construct and tick actual scene3d.js code against a lightweight Three API adapter.
   This catches scene-graph integration issues, but explicitly does not test GPU rendering. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),L=require('../src/levels.js');
class Vec{constructor(){this.x=0;this.y=0;this.z=0}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}setScalar(n){return this.set(n,n,n)}copy(p){return this.set(p.x,p.y,p.z)}}
class Obj{constructor(){this.children=[];this.position=new Vec;this.scale=new Vec;this.rotation=new Vec;this.scale.set(1,1,1);this.userData={};this.visible=true;this.castShadow=false;this.receiveShadow=false}add(o){this.children.push(o)}remove(o){this.children=this.children.filter(x=>x!==o)}traverse(fn){fn(this);for(const c of this.children)c.traverse(fn)}lookAt(){ }updateMatrixWorld(){ }}
class Mesh extends Obj{constructor(geo,material){super();this.geometry=geo;this.material=material;this.isMesh=true}}
class Geo{constructor(){this.attributes={}}dispose(){}setAttribute(k,v){this.attributes[k]=v}}
class Mat{constructor(opts){Object.assign(this,opts);this.emissiveIntensity??=0;}dispose(){}}
class Col{constructor(value){this.value=value}copy(other){this.value=other.value}setHex(v){this.value=v}}
class Light extends Obj{constructor(){super();this.color=new Col(0);this.shadow={mapSize:{set(){}},camera:{},bias:0,normalBias:0};this.target=new Obj;this.intensity=1}}
class Fog{constructor(value){this.color=new Col(value);this.density=.01}}
class Renderer{constructor(opt){this.domElement=opt.canvas;this.shadowMap={}}setPixelRatio(){}setSize(){}render(){this.draws=(this.draws||0)+1}dispose(){}}
class Points extends Obj{constructor(geo,material){super();this.geometry=geo;this.material=material}}
const T={Color:Col,Scene:Obj,Group:Obj,Mesh,WebGLRenderer:Renderer,OrthographicCamera:Obj,DirectionalLight:Light,HemisphereLight:Light,PointLight:Light,FogExp2:Fog,Points,MeshStandardMaterial:Mat,MeshBasicMaterial:Mat,PointsMaterial:Mat,
 BoxGeometry:Geo,SphereGeometry:Geo,ConeGeometry:Geo,CylinderGeometry:Geo,TorusGeometry:Geo,PlaneGeometry:Geo,DodecahedronGeometry:Geo,OctahedronGeometry:Geo,IcosahedronGeometry:Geo,BufferGeometry:Geo,BufferAttribute:class{constructor(array){this.array=array}},
 TextureLoader:class{load(){return {colorSpace:null}}},SRGBColorSpace:1,ACESFilmicToneMapping:2,PCFSoftShadowMap:3,REVISION:'test-adapter'};
const file=fs.readFileSync(path.join(__dirname,'../src/scene3d.js'),'utf8').replace(/import \* as T from '[^']+';/,'const T = globalThis.__T;').replace('export class World3D','class World3D')+'\nglobalThis.TestScene=World3D;';
const ctx={__T:T,window:{devicePixelRatio:1,matchMedia:()=>({matches:false}),dispatchEvent(){}},CustomEvent:class{},console};vm.runInNewContext(file,ctx);
const canvas={addEventListener(){},width:1280,height:720},scene=new ctx.TestScene(canvas,L.worlds);
let sceneCount=0;for(let id=1;id<=100;id++){
 const d=L.make(id);d.enemies.forEach(e=>{e.alive=true;e.phase=.3});scene.setStage(d);
 const player={x:120,y:450,vx:60,vy:0,h:62,face:1,grounded:true,inv:0,run:2};
 const state={scene:'play',player,levelData:d,camera:0,shake:0,elapsed:1,projectiles:[],bossHp:d.boss?3:0,keys:0};
 scene.frame(state,id*16.667);
 const diag=scene.getDiagnostics();assert.equal(diag.level,id);assert(diag.meshes>170,`Only ${diag.meshes} 3D meshes in level ${id}`);assert.equal(diag.hasBoss,!!d.boss);
 sceneCount++;
}
assert.equal(sceneCount,100);assert.equal(scene.renderer.draws,100);scene.dispose();console.log('PASS: constructed and ticked 100 complete Three-style 3D scene graphs, including all 10 guardians and world decorations (mock Three API, no GPU pixels).');
