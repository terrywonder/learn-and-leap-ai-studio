const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const V=require('../src/diversity_v13.js'),L=require('../src/levels.js');
const root=path.resolve(__dirname,'..');
assert.equal(V.moods.length,10);assert.equal(V.modes.length,4);
for(let id=1;id<=100;id++){
 const d=L.make(id),m=V.stage(id),g=V.objective(id);
 assert.equal(m.world,d.world);assert.equal(m.index,d.stage-1);
 assert.equal(m.title.length,3);assert(m.title.every(Boolean));
 assert(['coins','enemies','healthy','flawless','speed'].includes(g.kind));
 assert.equal(new Set(d.shrines.map(s=>V.challenge(id,s.subject,d.shrines.indexOf(s)))).size,4);
 assert(d.enemies.every((e,i)=>V.enemyIndex(id,i)>=1&&V.enemyIndex(id,i)<=10));
 for(const lang of ['en','zh','ms']){
  for(const s of d.shrines)assert(V.label(V.challenge(id,s.subject,d.shrines.indexOf(s)),lang).length>=5);
  assert(V.goalText(g,lang,{coins:0,enemiesDefeated:0,hearts:3,wrong:0,keys:0,elapsed:0}));
 }
 for(let i=0;i<d.enemies.length;i++)for(const t of [0,1,2,4,8])assert(Number.isFinite(V.enemyOffset(id,i,t,d.enemies[i].speed,d.enemies[i].phase??1)));
}
for(let w=0;w<10;w++){
 const enemy=new Set(Array.from({length:10},(_,i)=>V.enemyIndex(w*10+i+1,0)));
 assert.equal(enemy.size,10,`world ${w+1}: first enemy artwork repeats between levels`);
 const scenes=new Set(Array.from({length:10},(_,i)=>V.stage(w*10+i+1).weather));assert(scenes.size>=6);
}
const g=V.objective(1);assert.equal(g.kind,'coins');assert(!V.goalMet(g,{coins:1}));assert(V.goalMet(g,{coins:8}));
const gt=V.objective(2);assert.equal(gt.kind,'enemies');assert(V.goalMet(gt,{enemiesDefeated:2}));
const g3=V.objective(3);assert.equal(g3.kind,'healthy');assert(V.goalMet(g3,{hearts:2}));
const g4=V.objective(4);assert.equal(g4.kind,'flawless');assert(V.goalMet(g4,{wrong:0,keys:4}));assert(!V.goalMet(g4,{wrong:1,keys:4}));
const g5=V.objective(5);assert.equal(g5.kind,'speed');assert(V.goalMet(g5,{elapsed:94}));assert(!V.goalMet(g5,{elapsed:96}));
for(let i=1;i<=10;i++){const p=root+`/assets/stage-forest/${String(i).padStart(2,'0')}.webp`;const bytes=fs.readFileSync(p);assert(bytes.length>15000);assert.equal(bytes.toString('latin1',8,12),'WEBP')}
const p=fs.readFileSync(root+'/src/premium.js','utf8');assert(p.includes('Variety.enemyIndex(d.id,i)'));assert(p.includes('stage-forest/'));assert(p.includes('stageAtmosphere(d,camera,time)'));
const game=fs.readFileSync(root+'/src/game.js','utf8');assert(game.includes('V.enemyOffset'));assert(game.includes('V.challenge'));assert(game.includes('V.goalMet'));
console.log('PASS v13: 100 age-independent level variety profiles; four different shrine interfaces per stage; ten first-enemy species per world; five optional goals; 10 World 1 illustrated environment variants; localized instructions and rewards.');
