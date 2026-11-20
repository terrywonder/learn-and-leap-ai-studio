const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.join(__dirname,'../assets');const f=[];
for(let i=1;i<=10;i++){const s=String(i).padStart(2,'0');for(const stem of ['world','boss','foe'])f.push(`${stem}-${s}.webp`)}
f.push('rock-moss.webp','forest-matte.webp','ari.png');
for(const name of f){const p=path.join(base,name);assert(fs.existsSync(p),`Missing ${name}`);const data=fs.readFileSync(p);assert(data.length>800,`Empty ${name}`);if(name.endsWith('webp'))assert.equal(data.toString('ascii',0,4),'RIFF');else assert(data.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')))}
console.log(`PASS: ${f.length} self-contained, nonempty asset files present with correct signatures.`);
