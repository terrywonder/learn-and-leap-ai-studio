const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');const root=path.resolve(__dirname,'..'),L=require('../src/levels.js');
const premium=fs.readFileSync(path.join(root,'src/premium.js'),'utf8');const main=fs.readFileSync(path.join(root,'src/main.js'),'utf8');
assert(premium.includes('class PainterWorld'));assert(main.includes("import('./premium.js')"));assert(main.includes("import('./scene3d.js')"));
assert(!premium.includes('https://'));for(const pathName of ['ari.png','foe-01.webp','foe-03.webp','premium/moss_stone.webp','premium/organic_canopy.png','premium/whispering_woods_backdrop.webp','premium/flowers_1.png','premium/flowers_2.png','premium/flowers_3.png']){const f=path.join(root,'assets',pathName);assert(fs.existsSync(f),pathName);assert(fs.statSync(f).size>1000,pathName)}
for(let id=1;id<=100;id++){const d=L.make(id);assert.equal(d.id,id);assert.equal(d.shrines.length,4);assert(d.enemies.length>=3)}
for(const name of ['index.html','src/main.js','src/game.js','src/levels.js','src/curriculum.js','src/premium.js','src/scene3d.js'])assert(fs.statSync(path.join(root,name)).size>100);
console.log('PASS: Premium World 1 illustrated assets, self-contained default renderer, optional legacy Three.js path, preserved 100 level definitions and four subject shrines per level.');
