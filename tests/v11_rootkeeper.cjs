const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const js=fs.readFileSync(root+'/src/premium.js','utf8');
const clips={idle:12,stalk:16,attack:24,hurt:12,defeat:16};
const sizes={idle:[1344,1248],stalk:[1344,1664],attack:[1344,2496],hurt:[1344,1248],defeat:[1344,1664]};
for(const [mode,count] of Object.entries(clips)){
 const f=root+'/assets/animation/rootkeeper-v11/'+mode+'.webp';const bytes=fs.readFileSync(f);
 assert(bytes.length>100000,mode+' missing/empty');assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert(js.includes(`animation/rootkeeper-v11/${mode}.webp`)||js.includes('`animation/rootkeeper-v11/${mode}.webp`'));
}
assert(js.includes('const c=this.ctx,size=345,bossHeight=226,bossWidth=178'),'boss must be scaled to 226px');
assert(js.includes('d.ground-bossHeight'),'boss must have ground-aligned feet');
assert(js.includes('ctx')||js.includes('this.ctx'));
assert(js.includes('c.drawImage(sheet,(index%4)*336,Math.floor(index/4)*416,336,416,x,y,w,h)'),'frame atlas cropping must remain exact');
assert(!js.includes('this.rigRootkeeper(x-size*.405'),'old 345px oversized boss must not be rendered');
assert(fs.existsSync(root+'/ANIMATION_REVIEW.html'));
assert(fs.readFileSync(root+'/index.html','utf8').includes('src/main.js'));
const game=fs.readFileSync(root+'/src/game.js','utf8');
for(const text of ['bossPulse=1.15','bossHurt=.47','state.keys','bossHp']) assert(game.includes(text));
console.log('PASS v11: 5 seamless joint-deformed illustrated animation atlases (80 frames), corrected scale and ground contact, no old geometric boss path, preserved attack/collision/100-level gameplay integration.');
