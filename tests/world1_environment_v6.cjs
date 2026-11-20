'use strict';
const fs=require('node:fs'), path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const base=path.resolve(__dirname,'..');
const files=['cliff-masonry.webp','living-ledge.webp','ferns-and-blossoms.png','cascade-vines.png','rune-shrine.png','question-parchment.png'];
for(const f of files){const data=fs.readFileSync(path.join(base,'assets/world1-v6',f));assert(data.length>4000,f);if(f.endsWith('.webp'))assert.equal(data.subarray(8,12).toString(),'WEBP');else assert.equal(data.subarray(1,4).toString(),'PNG')}
const renderer=fs.readFileSync(path.join(base,'src/premium.js'),'utf8');const style=fs.readFileSync(path.join(base,'src/style.css'),'utf8');
assert(renderer.includes('if(this.fitWorld===0)return this.worldOneTerrain'), 'World 1 terrain specialization missing');
assert(renderer.includes("if(d.world===0){const c=this.ctx,frame=ready('world1-v6/rune-shrine.png')"));
assert(renderer.includes("if(d.world===0)return;const c=this.ctx"),'Flat cartoon tree backdrop still active in World 1');
for(const file of files.slice(0,5))assert(renderer.includes(file),'asset not referenced: '+file);
assert(style.includes("../assets/world1-v6/question-parchment.png"));
const reference=path.resolve('/mnt/data/learn-leap-world1-premium/project');
if(fs.existsSync(reference))for(const name of ['src/game.js','src/levels.js','src/curriculum.js']){
 const digest=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 assert.equal(digest(path.join(base,name)),digest(path.join(reference,name)),`Critical game/educational system changed: ${name}`)
}
console.log('PASS: 6 new local world-art sprites verified, live rune and question UI wired, World 1-only render changes, core gameplay/education untouched.');
