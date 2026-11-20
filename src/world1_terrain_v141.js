/**
 * v14.1 modular illustrated terrain. Presentation-only: never moves collision tops.
 * Viewport-culls composition and uses only v14/approved legacy source art.
 * 10 distinct material families, reusable endcaps/rims/wall segments and decor.
 */
const W=1280,TAU=6.283185307179586;
const h=(n)=>{const v=Math.sin(n*127.173+13.27)*43758.5453;return v-Math.floor(v)};
const rgba=(rgb,a)=>{let q=rgb.replace('#','');let [r,g,b]=[0,2,4].map(i=>parseInt(q.slice(i,i+2),16));return `rgba(${r},${g},${b},${a})`};
const themes=[
 {kind:'forest',stone:'#596a61',deep:'#253c36',rim:'#9cbd65',shadow:'#183328'},
 {kind:'mushroom',stone:'#70546c',deep:'#373044',rim:'#e0a8bf',shadow:'#38263a'},
 {kind:'waterfall',stone:'#4b7685',deep:'#2c4b62',rim:'#a9e4d4',shadow:'#193e4a'},
 {kind:'timber',stone:'#765a45',deep:'#44372f',rim:'#c9ab75',shadow:'#332b2c'},
 {kind:'temple',stone:'#79766e',deep:'#474d51',rim:'#c9bb92',shadow:'#394139'},
 {kind:'firefly',stone:'#4f6671',deep:'#25384f',rim:'#81bb97',shadow:'#243c38'},
 {kind:'swamp',stone:'#596257',deep:'#2c403f',rim:'#779c6c',shadow:'#25382d'},
 {kind:'cave',stone:'#586b7d',deep:'#2a3e52',rim:'#a4c7bc',shadow:'#273747'},
 {kind:'storm',stone:'#66727d',deep:'#38414c',rim:'#bbc3b6',shadow:'#26333d'},
 {kind:'sacred',stone:'#627c67',deep:'#344c49',rim:'#b8d6a4',shadow:'#253d37'}
];
function line(c,points,color,width=1.5){c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.strokeStyle=color;c.lineWidth=width;c.stroke()}
function ellipse(c,x,y,rx,ry,col){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);c.fillStyle=col;c.fill()}
function leaf(c,x,y,a,s,col){c.save();c.translate(x,y);c.rotate(a);c.fillStyle=col;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-s*.42,-s*.34,0,-s);c.quadraticCurveTo(s*.6,-s*.52,0,0);c.fill();c.restore()}
function seed(d,index,j){return d.id*10009+index*53+j*293}
function face(c,x,y,w,hg,mat,ti,kind,tex){
 c.save();c.beginPath();c.rect(x,y,w,hg);c.clip();
 const grd=c.createLinearGradient(0,y,0,y+Math.min(300,hg));grd.addColorStop(0,mat.stone);grd.addColorStop(.32,mat.deep);grd.addColorStop(1,mat.shadow);c.fillStyle=grd;c.fillRect(x,y,w,hg);
 const tile=312;
 const j0=Math.floor(Math.max(0,-60-x)/tile),j1=Math.ceil(Math.min(w,W+60-x)/tile);
 const stone=tex?.('world1-v6/cliff-masonry.webp');
 const moss=tex?.('premium/moss_stone.webp');
 for(let j=j0;j<j1;j++){
  const sx=x+j*tile,ww=Math.min(tile,x+w-sx),id=ti+j*53;
  if(ww<1)continue;
  if(stone&&(stone.naturalWidth||stone.width)){
   const u=Math.floor(h(id)*580),v=60+Math.floor(h(id+13)*100);
   c.globalAlpha=kind==='timber'||kind==='swamp'?.22:kind==='mushroom'?.45:.73;
   c.drawImage(stone,u,v,300,260,sx,y+10,ww,Math.min(220,hg));c.globalAlpha=1;
  }
  if(moss&&(moss.naturalWidth||moss.width)&&!['timber','swamp'].includes(kind)){
   c.globalAlpha=.38;c.drawImage(moss,Math.floor(h(id+9)*550),5,440,120,sx,y,ww,Math.min(hg,82));c.globalAlpha=1;
  }
  // Hand-offset fracture and strata: anchored to the same world tile, not screen time.
  for(let k=0;k<7;k++){
   const xx=sx+24+h(id+k*19)*Math.max(16,ww-50),yy=y+34+h(id+k*7+2)*Math.min(170,Math.max(50,hg-34));
   const len=10+h(id+k*17+22)*33;
   line(c,[[xx,yy],[xx+len*.48,yy+4],[xx+len*.77,yy+14],[xx+len,yy+15]],rgba('#dde3cd',.11),1.4);
  }
  for(let k=0;k<3;k++){
   const xx=sx+h(id+k*35+55)*ww,yy=y+48+h(id+k*10+80)*135;
   ellipse(c,xx,yy,9+h(id+k*6)*14,3,rgba('#1c302d',.26));
   if(kind==='cave'||kind==='waterfall'){
    c.fillStyle=k%2?'#8bdace':'#aebfee';c.globalAlpha=.57;
    c.beginPath();c.moveTo(xx-7,yy+2);c.lineTo(xx+2,yy-13-h(id+k*3)*9);c.lineTo(xx+12,yy+3);c.fill();c.globalAlpha=1;
   }
  }
 }
 // Guaranteed smooth ambient shadow + rock relief remains subordinate to the game collision line.
 const sh=c.createLinearGradient(0,y+18,0,y+Math.min(hg,220));sh.addColorStop(0,'#081c1800');sh.addColorStop(.55,'#041b2413');sh.addColorStop(1,'#06141963');c.fillStyle=sh;c.fillRect(x,y,w,hg);c.restore();
}
function wood(c,x,y,w,seedNum,dark=false){
 const left=Math.max(x,-20),right=Math.min(x+w,1300);
 c.fillStyle=dark?'#54463d':'#745846';c.fillRect(left,y+1,right-left,31);
 c.fillStyle=dark?'#96725b':'#af885b';c.fillRect(left,y+1,right-left,5);
 for(let j=Math.floor((left-x)/75);j<Math.ceil((right-x)/75);j++){
  let xx=x+j*75,edge=Math.min(x+w,xx+75);
  line(c,[[xx,y+4],[xx+2,y+32]],dark?'#2e3435':'#47382d',2.2);
  line(c,[[xx+8,y+19],[edge-9,y+21]],rgba('#f3d8a2',.21),1);
  for(const tx of [xx+11,edge-12])ellipse(c,tx,y+9,2.1,2.4,dark?'#c2b5a4':'#d8b88b');
 }
 line(c,[[left,y+32],[right,y+32]],'#1a3132',4);
}
function fungusCap(c,x,y,w,seedNum){
 const left=Math.max(x,-40),right=Math.min(x+w,1320);
 c.save();c.beginPath();c.moveTo(left,y+9);
 for(let xx=left;xx<=right+4;xx+=8){let n=h(seedNum+Math.floor((xx-x)/45));c.lineTo(Math.min(xx,right),y-6-9*(.45+n));}
 c.lineTo(right,y+27);c.lineTo(left,y+27);c.closePath();c.fillStyle='#c384af';c.fill();
 const rg=c.createLinearGradient(0,y-21,0,y+23);rg.addColorStop(0,'#f3c7e2');rg.addColorStop(1,'#915c99');c.fillStyle=rg;c.fill();
 line(c,[[left,y+25],[right,y+25]],'#eedac8',3);
 for(let j=0;j<Math.min(45,w/27);j++){const xx=x+15+j*29;if(xx<left||xx>right)continue;ellipse(c,xx,y-9-h(seedNum+j)*5,4+h(j+seedNum)*3,2.5,'#fce8dd')}
 c.restore();
}
function grass(c,x,y,w,mat,seedNum,dark=false){
 const left=Math.max(x,-28),right=Math.min(x+w,1308);
 if(right<=left)return;
 const shadow=c.createLinearGradient(0,y-8,0,y+27);shadow.addColorStop(0,rgba(mat.rim,.05));shadow.addColorStop(.32,mat.rim);shadow.addColorStop(.62,dark?'#476148':'#476f3e');shadow.addColorStop(1,rgba(mat.shadow,.9));c.fillStyle=shadow;c.fillRect(left,y-5,right-left,26);
 c.fillStyle=dark?'#497b5a':'#72a64c';c.beginPath();c.moveTo(left,y+6);
 for(let xx=left;xx<=right;xx+=4){const j=Math.floor((xx-x)/4),height=3+h(seedNum+j*13)*7;c.lineTo(xx,y-height);}c.lineTo(right,y+13);c.lineTo(left,y+13);c.closePath();c.globalAlpha=.85;c.fill();c.globalAlpha=1;
 line(c,[[left,y-3],[right,y-3]],rgba('#f1f3b8',.45),1.8);
 const count=Math.min(75,Math.ceil((right-left)/23));for(let j=0;j<count;j++){
  const xx=left+j*23+h(seedNum+j*5)*7;
  const col=j%3===0?'#b5d579':j%3===1?'#588748':'#93b868';
  for(let k=0;k<3;k++)leaf(c,xx+k*3,y+7,-.15+k*.23,7+h(seedNum+j*6+k)*9,col);
  if(j%13===7){ellipse(c,xx,y-8,2.7,2.7,'#f7f1d0');ellipse(c,xx+2,y-10,2.1,2.4,'#e7c49f');ellipse(c,xx+1,y-8,1.4,1.4,'#e9b14d')}
 }
}
/** v14.3: modular, photo-illustrated material sampled only from the ground strip of
 * the owner's approved reference. It NEVER includes the baked HUD, Ari, portal or coins.
 * Existing physics bounds are unchanged and terrain patterns stay in local world space. */
function approvedMaterial(c,d,x,y,w,hg,seedNum,kind,tex){
 const image=tex?.(`world1-v143/${kind}-stone-moss.webp`);
 if(!image||(image.naturalWidth||image.width)<500)return false;
 const iw=image.naturalWidth||image.width;
 const tile=390,visibleLeft=Math.max(0,Math.floor((-40-x)/tile)),visibleRight=Math.min(Math.ceil(w/tile),Math.ceil((W+40-x)/tile));
 if(visibleRight<=visibleLeft)return true;
 c.save();c.beginPath();c.rect(x,y-6,w,Math.min(hg+6,116));c.clip();
 for(let j=visibleLeft;j<visibleRight;j++){
  const xx=x+j*tile,ww=Math.min(tile,x+w-xx);
  if(ww<=0)continue;
  const u=Math.floor(h(seedNum+j*29+141)*(iw-tile-2));
  c.drawImage(image,u,0,ww,112,xx,y-6,ww,112);
  // Natural painterly moss overhang remains decorative; physics top is always y.
 }
 c.restore();return true;
}
function details(c,d,x,y,w,hg,index,platform,kind,approved=false){
 const l=Math.max(x,-25),r=Math.min(x+w,1305),seedNum=seed(d,index,1);if(r<=l)return;
 if(kind==='timber'||kind==='swamp'){wood(c,x,y,w,seedNum,kind==='swamp');}
 else if(kind==='mushroom'&&platform){fungusCap(c,x,y,w,seedNum);}
 else if(kind==='temple'){
  c.fillStyle='#c4ad83';c.fillRect(l,y-4,r-l,8);
  for(let j=Math.floor((l-x)/65);j<Math.ceil((r-x)/65);j++){
   let xx=x+j*65;line(c,[[xx,y+8],[xx,y+58]],rgba('#e2cb99',.43),2.4);
   line(c,[[xx+8,y+34],[xx+47,y+34]],rgba('#292c3c',.48),2);
   ellipse(c,xx+34,y+14,2.5,2.5,'#d8bf91');
  }
 }
 else if(kind==='cave'){
  c.fillStyle='#819b97';c.fillRect(l,y-4,r-l,9);
  for(let j=Math.floor((l-x)/73);j<Math.ceil((r-x)/73);j++){
   const xx=x+j*73+25,q=h(seedNum+j*19);
   c.fillStyle=q>.5?'#b8d6ee':'#77c8b6';c.beginPath();c.moveTo(xx-8,y+2);c.lineTo(xx,y-14-q*11);c.lineTo(xx+10,y+3);c.fill();
  }
 }
 else if(kind==='storm'){
  c.fillStyle='#b7b8a5';c.fillRect(l,y-6,r-l,9);
  for(let j=Math.floor((l-x)/66);j<Math.ceil((r-x)/66);j++){
   const xx=x+j*66+21,off=h(seedNum+j*11)*12;
   line(c,[[xx,y],[xx+3,y+15+off],[xx-6,y+26+off],[xx+4,y+45+off]],'#2d3642',2.6);
  }
 }
 else if(kind==='waterfall'){
  c.fillStyle='#93beab';c.fillRect(l,y-4,r-l,9);
  for(let j=Math.floor((l-x)/99);j<Math.ceil((r-x)/99);j++){
   const xx=x+j*99+24;line(c,[[xx,y+12],[xx+2,y+30],[xx-3,y+50]],rgba('#b7f1ef',.27),3);
  }
 }
 else if(kind==='sacred'){
  c.fillStyle='#c3d6ae';c.fillRect(l,y-6,r-l,9);
  for(let j=Math.floor((l-x)/94);j<Math.ceil((r-x)/94);j++){
   const xx=x+j*94+34;c.beginPath();c.ellipse(xx,y+37,18,9,0,0,TAU);c.lineWidth=2;c.strokeStyle=rgba('#ccebb0',.5);c.stroke();
   line(c,[[xx,y+27],[xx+5,y+38],[xx,y+45]],rgba('#e8e1a7',.37),1.8);
  }
 }
 if(!approved&&(['forest','firefly','waterfall','swamp','sacred'].includes(kind)||(!platform&&kind==='mushroom')))grass(c,x,y,w,{...themes[d.id-1],rim:themes[d.id-1].rim},seedNum,kind==='swamp'||kind==='firefly');
 if(kind==='mushroom'&&!platform&&!approved)grass(c,x,y,w,themes[d.id-1],seedNum);
 // Endcaps visible on narrow ledges; respect true physics top y.
 if(platform&&w>27){
  line(c,[[x,y-3],[x,y+31]],rgba('#1b332f',.50),3);
  line(c,[[x+w,y-3],[x+w,y+31]],rgba('#1b332f',.50),3);
  if(kind==='swamp'){for(const xx of [x+7,x+w-7])line(c,[[xx,y-2],[xx,y+26]],'#ba9b74',2);}
 }
}
export function paintWorldOneTerrain(c,d,x,y,w,hg,index=0,platform=false,p=null,t=0,texture=null){
 if(d.world!==0||!d.v14||w<=0||hg<=0||x>W+80||x+w<-80)return;
 const mat=themes[d.id-1],kind=mat.kind,seedNum=seed(d,index,1);
 c.save();
 face(c,x,y,w,hg,mat,seedNum,kind,texture);
 // Paint original illustrated moss/stone atlas modules at true world-space positions.
 // Adjacent sections use distinct cropped portions: no global stretch or fixed repetition.
 if(['forest','firefly','sacred','waterfall','swamp'].includes(kind)){
  const ledge=texture?.('world1-v6/living-ledge.webp');
  if(ledge&&(ledge.naturalWidth||ledge.width)){
   const tile=310,start=Math.max(0,Math.floor((-25-x)/tile)),end=Math.min(Math.ceil(w/tile),Math.ceil((1310-x)/tile));
   for(let j=start;j<end;j++){
    const xx=x+j*tile,ww=Math.min(tile,x+w-xx);
    if(ww<1)continue;
    const u=Math.floor(h(seedNum+j*29)*565);
    c.save();c.globalAlpha=kind==='waterfall'?.77:kind==='swamp'?.56:.93;
    c.drawImage(ledge,u,0,435,188,xx,y-15,ww,99);c.restore();
   }
  }
 }
 // The approved natural-rock atlas upgrades all ten material palettes without flattening the levels.
 // Timber, fungal caps, temples, storm fractures and other special surfaces remain live art.
 const hasApprovedMaterial=approvedMaterial(c,d,x,y,w,hg,seedNum,kind,texture);
 // Functional collision always begins at y. Textured rim can protrude slightly for art only.
 details(c,d,x,y,w,hg,index,platform,kind,hasApprovedMaterial);
 if(platform){c.save();c.globalAlpha=.24;c.fillStyle='#132b27';c.fillRect(x+5,y+hg-3,Math.max(0,w-10),4);c.restore();}
 if(kind==='swamp'&&p?.v14Type==='sink'){
  for(let j=0;j<5;j++){let xx=x+18+j*(w-36)/5;ellipse(c,xx,y+33,2,4,rgba('#aac7ae',.56));}
 }
 if(kind==='storm'&&p?.v14Type==='crumble'){
  for(let j=0;j<4;j++){const xx=x+12+j*(w-30)/4;line(c,[[xx,y+6],[xx+9,y+21],[xx-3,y+36]],'#232e3d',2.8)}
 }
 c.restore();
}
export const TERRAIN_V141_MATERIALS=Object.freeze(themes.map(t=>t.kind));
