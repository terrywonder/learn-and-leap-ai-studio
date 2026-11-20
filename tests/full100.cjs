const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');const C=require('../src/curriculum.js'),L=require('../src/levels.js');
assert.equal(L.levels.length,100);assert.equal(L.worlds.length,10);assert.equal(new Set(L.levels.map(l=>l.title[0])).size,100);
const subjectSet=new Set(C.SUBJECTS);const langs=['en','zh','ms'];
for(let i=1;i<=100;i++){
 const l=L.make(i);assert.equal(l.id,i);assert.equal(l.world,Math.floor((i-1)/10));assert.equal(l.stage,(i-1)%10+1);assert.equal(l.boss,i%10===0);assert.equal(l.shrines.length,4);assert.deepEqual(new Set(l.shrines.map(s=>s.subject)),subjectSet);assert(l.length>3500);
 for(const s of l.shrines){assert(s.x>200&&s.x<l.length-250);for(const p of l.pits)assert(!(s.x>p.x-100&&s.x<p.x+p.w+100),`Level ${i} shrine inside pit`)}
 for(const cp of l.checkpoints)for(const p of l.pits)assert(!(cp>p.x-90&&cp<p.x+p.w+90),`Level ${i} unsafe checkpoint`);
 for(const p of l.pits)assert(p.w<=190,'pit too wide');
 for(const age of C.AGE)for(const sub of C.SUBJECTS)for(const lang of langs)for(let attempt=0;attempt<3;attempt++){
  const q=C.makeQuestion({age,subject:sub,lang,level:i,slot:i%4+1,attempt});assert(q.prompt&&q.hint&&q.options.length===4&&q.correct>=0&&q.correct<4,`bad question ${i}/${age}/${sub}/${lang}`);
 }
}
console.log('PASS: 100 unique level titles; 10 worlds; all level geometry, 4 shrines each, checkpoints, 18,000 generated age × subject × language × level × retry questions');
let raf=null;const nodes=new Map(),fakeGradient={addColorStop(){}};
const fakeCanvas=new Proxy({createLinearGradient:()=>fakeGradient,createRadialGradient:()=>fakeGradient}, {get(t,k){return k in t?t[k]:()=>{}},set(t,k,v){t[k]=v;return true}});
class E{constructor(id=''){this.id=id;this.hidden=false;this.textContent='';this.innerHTML='';this.value='';this.dataset={};this.classList={add(){},remove(){}};this.children=[];this.style={};this.events={};this.disabled=false;}addEventListener(k,fn){this.events[k]=fn}appendChild(e){this.children.push(e)}querySelectorAll(){return []}focus(){}click(){if(this.onclick)this.onclick()}}
const get=id=>{if(!nodes.has(id))nodes.set(id,new E(id));return nodes.get(id)};get('world').getContext=()=>fakeCanvas;get('screen').querySelectorAll=()=>[];
const doc={getElementById:get,createElement:()=>new E(),querySelectorAll:()=>[],addEventListener(){},hidden:false};
class FakeRenderer{constructor(){this.stage=null;this.rendered=0}setStage(d){this.stage=d}frame(){this.rendered++}getDiagnostics(){return{renderer:'Three.js WebGL (test stub)',level:this.stage?.id}}}
const storage={};const ctx=vm.createContext({window:{LearnCurriculum:C,LeapLevels:L,LeapScene3D:FakeRenderer,addEventListener(){}},document:doc,localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},requestAnimationFrame:fn=>raf=fn,Image:class{constructor(){this.complete=true;this.naturalWidth=200;this.naturalHeight=250}set src(v){this._src=v}get src(){return this._src}},performance:{now:()=>0},setTimeout:fn=>fn(),console,Math,Date});
vm.runInContext(fs.readFileSync(path.join(root,'src/game.js'),'utf8'),ctx);const D=vm.runInContext('window.__LEAP_DEBUG__',ctx);assert(raf);const run=s=>vm.runInContext(s,ctx);assert.equal(D.getRenderer().renderer,'Three.js WebGL (test stub)');
for(const age of C.AGE){D.state.age=age;for(let id=1;id<=100;id++){
 D.startLevel(id);assert.equal(D.state.level,id);assert.equal(D.state.levelData.id,id);assert.equal(D.state.scene,'play');
 // Render the full gameplay scene for each world, including the 10 bosses.
 raf(id*24);assert.equal(D.state.levelData.shrines.length,4);
 for(const shr of D.state.levelData.shrines){D.state.player.x=shr.x;D.interact();assert.equal(D.state.scene,'question',`level ${id}, shrine ${shr.subject}`);assert.equal(D.state.question.subject,shr.subject);const button={classList:{add(){}},disabled:false};D.answer(D.state.question.correct,button);assert.equal(D.state.scene,'play');}
 assert.equal(D.state.keys,4);assert.equal(D.state.energy,8);
 if(D.state.levelData.boss){assert(D.state.bossHp>0);D.state.player.x=D.state.levelData.bossX-180;D.state.player.y=450;D.state.player.face=1;const hp=D.state.bossHp;D.cast();for(let i=0;i<22;i++)D.update(.018);assert.equal(D.state.bossHp,hp-1,`boss hit level ${id}`);D.state.bossHp=0;}
 D.state.player.x=D.state.levelData.length-208;D.state.player.y=500;D.update(.016);assert.equal(D.state.scene,'win',`level ${id} finish`);assert(D.state.progress[age][id]>=1,`progress ${age}/${id}`);
 }}
assert.equal(Object.keys(D.state.progress).length,5);for(const age of C.AGE)assert.equal(Object.keys(D.state.progress[age]).length,100);
assert.equal(D.state.lastLevels[C.AGE[4]],100);
assert.equal(D.getEngine().stage.id,100);assert(D.getEngine().rendered>0);
console.log('PASS: 500 playable age/level combinations; 2,000 shrine answers; 50 guardian fights; 500 victory screens; age-isolated 100-level progress and HUD rendering');
