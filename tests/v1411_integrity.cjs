'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'..'),base=path.join(root,'assets/animation/ari');
function pngAlpha(fp){
 const bin=fs.readFileSync(fp);
 assert(bin.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),`PNG signature for ${fp}`);
 let w=0,h=0,channels=0,parts=[];let offset=8;
 while(offset<bin.length){const len=bin.readUInt32BE(offset),type=bin.toString('ascii',offset+4,offset+8),data=bin.subarray(offset+8,offset+8+len);offset+=12+len;
  if(type==='IHDR'){w=data.readUInt32BE(0);h=data.readUInt32BE(4);assert.equal(data[8],8,'8 bit PNG');assert.equal(data[9],6,'RGBA');channels=4}
  else if(type==='IDAT')parts.push(data);else if(type==='IEND')break;
 }
 const raw=zlib.inflateSync(Buffer.concat(parts)),stride=w*channels,alpha=new Uint8Array(w*h);let prev=new Uint8Array(stride),i=0;
 for(let y=0;y<h;y++){
  const filter=raw[i++],line=new Uint8Array(stride);
  for(let j=0;j<stride;j++){
   const x=raw[i++],left=j>=channels?line[j-channels]:0,up=prev[j],ul=j>=channels?prev[j-channels]:0;
   let predictor=0;
   if(filter===1)predictor=left;
   if(filter===2)predictor=up;
   if(filter===3)predictor=(left+up)>>1;
   if(filter===4){const p=left+up-ul,pa=Math.abs(p-left),pb=Math.abs(p-up),pc=Math.abs(p-ul);predictor=pa<=pb&&pa<=pc?left:pb<=pc?up:ul;}
   assert(filter<=4,'supported PNG filter');line[j]=(x+predictor)&255;
  }
  for(let x=0;x<w;x++)alpha[y*w+x]=line[x*4+3];prev=line;
 }
 return {w,h,alpha};
}
function clusters({w,h,alpha}){
 const seen=new Uint8Array(w*h),components=[];
 for(let q=0;q<alpha.length;q++){
  if(seen[q]||alpha[q]<=20)continue;let queue=[q],j=0,ct=0;seen[q]=1;
  while(j<queue.length){const idx=queue[j++],x=idx%w,y=(idx/w)|0;ct++;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
    const xx=x+dx,yy=y+dy;if(!dx&&!dy||xx<0||yy<0||xx>=w||yy>=h)continue;
    const n=yy*w+xx;if(!seen[n]&&alpha[n]>20){seen[n]=1;queue.push(n)}
   }
  }components.push(ct);
 }
 return components.sort((a,b)=>b-a);
}
const content=fs.readFileSync(path.join(root,'src/premium.js'),'utf8');
for (const [oldFile,cleanFile,minEliminated] of [['body.png','body-v1411-clean.png',400],['front-arm.png','front-arm-v1411-clean.png',10]]){
 const old=pngAlpha(path.join(base,oldFile)),fixed=pngAlpha(path.join(base,cleanFile));
 assert.equal(old.w,285);assert.equal(old.h,235);assert.equal(fixed.w,285);assert.equal(fixed.h,235);
 const previous=clusters(old),current=clusters(fixed);
 assert.equal(current.length,1,`${cleanFile} should have one intact foreground component`);
 assert.equal(current[0],previous[0],`${cleanFile} must preserve original primary silhouette and alpha core`);
 const removed=previous.reduce((a,b)=>a+b,0)-current[0];
 assert(removed>=minEliminated,`${cleanFile} must remove detached fragments, got ${removed}`);
 assert(content.includes(`animation/ari/${cleanFile}`),`${cleanFile} must be active in real renderer`);
 console.log(`PASS Ari ${cleanFile}: detached visible pixels removed ${removed}; source ${previous.length} components -> clean ${current.length}`);
}
assert(content.includes("limbPart('animation/ari/back-leg-v141.png'"),'rear boot remains articulated');
for (const name of ['cape.png','rear-arm.png','front-leg.png','back-leg-v141.png']) assert.equal(fs.existsSync(path.join(base,name)),true);
require('../src/world1_v14.js');const levels=require('../src/levels.js');for(let i=1;i<=100;i++)assert(levels.make(i));
console.log('PASS v14.1.1: original character preserved, clean layers active, rear boot intact, all 100 levels retained');
