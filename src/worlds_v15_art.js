/* v15 expansion art: nine biome-specific Canvas landscapes, grounded platforms,
   moving landmarks, clear interaction cues. Rendered scenery is not a collision mask. */
const P=[null,
 ['#141431','#44336f','#93c6df','#b991f6','#453859','#2e1e4e'],
 ['#327ca4','#94d6ee','#f9e5b2','#f7e7be','#637e95','#386f8e'],
 ['#271b36','#a93c43','#f3a14e','#ff9e42','#523044','#291b2c'],
 ['#285474','#91cadd','#f8fcff','#dff7ff','#6d91a3','#3f708d'],
 ['#03465f','#1c9b9b','#9ae3bd','#e7bb99','#367c82','#20566d'],
 ['#29273f','#736682','#e5ac63','#ffc674','#68526b','#373146'],
 ['#101d36','#2d4266','#90b3bb','#a1ffd3','#394f52','#233343'],
 ['#0f1546','#494a9b','#d6c3f6','#fce3aa','#5958a7','#323466'],
 ['#211633','#694b81','#cda6bc','#ffe2ac','#796284','#453254']
];
const TAU=Math.PI*2;
const frac=x=>x-Math.floor(x),rnd=x=>frac(Math.sin(x*78.233+13.43)*43758.5453);
function poly(c,pts,color,stroke){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(color){c.fillStyle=color;c.fill()}if(stroke){c.strokeStyle=stroke;c.stroke()}}
function circle(c,x,y,r,col){c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=col;c.fill()}
function glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
function crystal(c,x,y,s,accent){c.save();c.translate(x,y);c.scale(s,s);poly(c,[[0,-65],[32,-24],[25,32],[0,66],[-30,26],[-34,-20]],accent,'#f4fcff99');poly(c,[[0,-65],[3,60],[-31,23],[-34,-20]],'#1225478f');poly(c,[[0,-65],[32,-24],[3,60]],'#ffffff55');poly(c,[[-31,22],[3,60],[25,32]],'#16204444');c.restore()}
function gear(c,x,y,r,rotation,color){c.save();c.translate(x,y);c.rotate(rotation);c.fillStyle=color;c.beginPath();for(let i=0;i<32;i++){const a=i*TAU/32,rr=i%4<2?r:r*.83;const xx=Math.cos(a)*rr,yy=Math.sin(a)*rr;i?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.closePath();c.fill();circle(c,0,0,r*.55,'#293347');circle(c,0,0,r*.19,'#f8d69b');for(let i=0;i<8;i++){const a=i*TAU/8;c.strokeStyle='#cfc69d';c.lineWidth=5;c.beginPath();c.moveTo(Math.cos(a)*r*.28,Math.sin(a)*r*.28);c.lineTo(Math.cos(a)*r*.69,Math.sin(a)*r*.69);c.stroke()}c.restore()}
function cloud(c,x,y,r){c.fillStyle='#f9ffffa6';for(let i=0;i<6;i++){c.beginPath();c.ellipse(x+(i-2.5)*r*.45,y+(i%2)*r*.07,r*(.35+(i%3)*.12),r*.38,0,0,TAU);c.fill()}}
function coral(c,x,y,h,seed,light){c.save();c.translate(x,y);c.strokeStyle=light;c.lineCap='round';for(let j=0;j<5;j++){const xx=(j-2)*12;const len=h*(.7+rnd(seed+j)*.5);c.lineWidth=5+j%3;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(xx*1.5,-len*.45,xx*2,-len);c.stroke();c.beginPath();c.moveTo(xx*1.2,-len*.52);c.lineTo(xx*2.9,-len*.73);c.stroke()}c.restore()}
function temple(c,x,y,size,col){c.save();c.translate(x,y);c.fillStyle=col;for(let i=0;i<4;i++){c.fillRect(-size*.48+i*size*.3,-size*.65,size*.12,size*.72);c.fillRect(-size*.51+i*size*.3,-size*.67,size*.18,size*.10)}poly(c,[[-size*.6,-size*.71],[0,-size],[size*.6,-size*.71]],col);c.fillRect(-size*.65,-size*.04,size*1.3,size*.13);c.restore()}
function mountain(c,x,y,w,h,color,snow){poly(c,[[x-w/2,y],[x,y-h],[x+w/2,y]],color);if(snow)poly(c,[[x,y-h],[x-w*.12,y-h*.67],[x-w*.02,y-h*.74],[x+w*.08,y-h*.62],[x+w*.16,y-h*.69]],snow)}
function sceneGeometry(c,d,cam,t){const w=d.world,v=d.v15,p=P[w],stage=v.stage,slow=cam*.15;
 // One dominant landmark and stage-variant silhouettes per level, rather than recoloured copies.
 const shift=(stage*117)%480;
 for(let i=0;i<6;i++){
  const x=i*325+shift-slow-(Math.floor((i*325+shift-slow)/1600))*1600-80;
  const size=.58+rnd(d.id*8+i)*.65,base=490+rnd(i*11+d.id)*36;
  if(w===1){crystal(c,x,base-108*size,size*1.5,p[3]);for(let j=0;j<3;j++)crystal(c,x+(j-1)*49,base-30-(j%2)*30,size*.6,p[2]);}
  if(w===2){cloud(c,x,base-150,110*size);poly(c,[[x-95*size,base-80],[x,base-114],[x+85*size,base-70],[x+70,base-40],[x-60,base-35]],'#466b86');if(i%2===0){c.strokeStyle='#816e4b';c.lineWidth=4;c.beginPath();c.moveTo(x,base-90);c.lineTo(x,base-250);c.stroke();poly(c,[[x,base-250],[x+90,base-184],[x,base-198]],'#f6d69f')}}
  if(w===3){mountain(c,x,base+25,350*size,260*size,p[5]);poly(c,[[x-12,base-205*size],[x+16,base-205*size],[x+25,base+25]],'#ff8a31');for(let j=0;j<7;j++){circle(c,x+(rnd(i+j+d.id)-.5)*160,base-180*size-j*24,9+j*1.5,'#d8b1a438')}}
  if(w===4){mountain(c,x,base+20,355*size,280*size,p[4],p[2]);for(let j=0;j<6;j++){poly(c,[[x+j*18-65,base-25],[x+j*18-65,base-50-j*7],[x+j*18-50,base-25]],'#e6ffffa8')}}
  if(w===5){coral(c,x,base+55,135*size,i+d.id,i%2?p[3]:p[2]);for(let j=0;j<7;j++)circle(c,x+Math.sin(i*8+j)*86,base-110-j*34,2+j%3,'#bbfff58a')}
  if(w===6){gear(c,x,base-185,78*size,t*.0003*(i%2?1:-1),p[3]);c.fillStyle='#352e42';c.fillRect(x-20,base-85,35,145);for(let j=0;j<6;j++){c.fillStyle='#edc58b88';c.fillRect(x+26,base-80+j*25,9,9)}}
  if(w===7){mountain(c,x,base+15,320*size,165*size,p[5]);c.strokeStyle=p[4];c.lineWidth=15;c.beginPath();c.moveTo(x,base+45);c.quadraticCurveTo(x-40,base-120,x-15,base-290);c.stroke();for(let j=0;j<6;j++)glow(c,x-45+j*30,base-110-j*16,21,p[3]+'88')}
  if(w===8){crystal(c,x,base-90,size*1.2,p[3]);c.strokeStyle='#fff2c477';c.lineWidth=2;for(let j=0;j<6;j++){const x1=x+Math.cos(j*TAU/6)*160,y1=base-210+Math.sin(j*TAU/6)*80;circle(c,x1,y1,4,'#ffefa5');c.beginPath();c.moveTo(x1,y1);c.lineTo(x+Math.cos((j+1)*TAU/6)*160,base-210+Math.sin((j+1)*TAU/6)*80);c.stroke()}}
  if(w===9){temple(c,x,base+35,180*size,p[4]);crystal(c,x,base-155,1.0,p[3]);}
 }
}
// Authored structural silhouettes distinguish all ten stage identities inside a biome.
function stageSignature(c,d,cam,t){
 const v=d.v15,p=P[d.world],s=v.stage,x=680-cam*.035+(s%3-1)*80,y=495;
 c.save();c.globalAlpha=.82;c.lineCap='round';
 if(s===1){ // entrance monument
   c.strokeStyle=p[3];c.lineWidth=17;c.beginPath();c.moveTo(x-110,y+12);c.lineTo(x-110,y-154);c.quadraticCurveTo(x,y-270,x+110,y-154);c.lineTo(x+110,y+12);c.stroke();crystal(c,x,y-195,.7,p[3]);
 }else if(s===2){ // long suspended crossing
   c.strokeStyle=p[3];c.lineWidth=5;c.beginPath();c.moveTo(x-330,y-132);c.quadraticCurveTo(x,y-63,x+330,y-132);c.stroke();for(let i=-5;i<=5;i++){let xx=x+i*58,yy=y-75-67*Math.pow(i/5,2);c.beginPath();c.moveTo(xx,yy);c.lineTo(xx,yy+47);c.stroke()}c.fillStyle=p[4];c.fillRect(x-338,y-35,675,13);
 }else if(s===3){ // tall vertical tower
   temple(c,x,y+50,270,p[4]);for(let i=0;i<5;i++){glow(c,x,y-225-i*38,28,p[3]+'99');circle(c,x,y-225-i*38,5,p[2]);}
 }else if(s===4){ // working mechanism
   gear(c,x-65,y-155,77,t*.0004,p[3]);gear(c,x+77,y-93,55,-t*.00052,p[2]);c.fillStyle=p[4];c.fillRect(x-22,y-15,46,72);
 }else if(s===5){ // fracture and danger zone
   for(let j=0;j<4;j++){let xx=x-230+j*160;poly(c,[[xx-44,y+15],[xx,y-125-j%2*65],[xx+63,y+15]],p[j%2?5:4]);glow(c,xx,y-80,70,p[3]+'76');}
 }else if(s===6){ // secret illuminated hollow
   c.fillStyle=p[5];c.beginPath();c.ellipse(x,y-95,190,150,0,0,TAU);c.fill();c.strokeStyle=p[3];c.lineWidth=7;c.beginPath();c.ellipse(x,y-95,130,115,0,0,TAU);c.stroke();crystal(c,x,y-90,1.25,p[2]);
 }else if(s===7){ // narrow precision stepping stones
   for(let i=0;i<6;i++){let xx=x-245+i*99,yy=y-52-Math.sin(i*1.45)*45;poly(c,[[xx-44,yy],[xx,yy-27],[xx+47,yy],[xx+33,yy+18],[xx-33,yy+18]],p[4],p[2]);}
 }else if(s===8){ // moving suspended rail and carriage
   c.strokeStyle=p[3];c.lineWidth=7;c.beginPath();c.moveTo(x-330,y-260);c.bezierCurveTo(x-90,y-330,x+125,y-225,x+330,y-270);c.stroke();let xx=x+Math.sin(t*.0005)*115;c.fillStyle=p[4];c.fillRect(xx-75,y-160,150,35);c.strokeStyle=p[2];c.beginPath();c.moveTo(xx-50,y-160);c.lineTo(xx-50,y-245);c.moveTo(xx+50,y-160);c.lineTo(xx+50,y-245);c.stroke();
 }else if(s===9){ // mastery standing stones
   for(let i=-3;i<=3;i++){let xx=x+i*88;poly(c,[[xx-21,y+10],[xx-25,y-85-(3-Math.abs(i))*22],[xx+12,y-120-(3-Math.abs(i))*22],[xx+24,y+10]],p[4],p[3]);circle(c,xx,y-80-(3-Math.abs(i))*22,6,p[2]);}
 }else if(s===10){ // guardian citadel landmark
   temple(c,x,y+62,360,p[4]);glow(c,x,y-240,145,p[3]+'8f');crystal(c,x,y-220,1.65,p[3]);
 }
 c.restore();
}
export function paintExpeditionBackdrop(c,d,cam,t,ready){const w=d.world,p=P[w],v=d.v15;
 c.save();const g=c.createLinearGradient(0,0,0,720);g.addColorStop(0,p[0]);g.addColorStop(.55,p[1]);g.addColorStop(1,p[2]);c.fillStyle=g;c.fillRect(0,0,1280,720);
 // Existing illustrated plates are used as distant atmosphere, not stretched platform art.
 const img=ready(`world-${String(w+1).padStart(2,'0')}.webp`);if(img){c.globalAlpha=.3;c.drawImage(img,-40-cam*.012,-25,1370,775);c.globalAlpha=1;}
 const sky=c.createRadialGradient(980,80,5,900,120,590);sky.addColorStop(0,p[2]+'80');sky.addColorStop(1,p[2]+'00');c.fillStyle=sky;c.fillRect(0,0,1280,600);
 if(w===7||w===8||w===1){for(let i=0;i<100;i++){const x=rnd(i*8+d.id)*1280,y=rnd(i*14+d.id)*430;circle(c,x,y,1+(i%3)*.5,'#f7f4ff9c')}}
 if(w===4){cloud(c,970,126,130);cloud(c,270,98,90)}
 if(w===7){circle(c,1060,125,84,'#e2f3d2a3');circle(c,1080,109,81,p[0])}
 if(w===8){circle(c,1010,85,48,'#fff7d1c4');glow(c,1010,85,180,'#f7dcb663')}
 for(let i=0;i<8;i++){const x=i*210-(cam*.05%210),size=.6+rnd(i*17+d.id)*.7;mountain(c,x,510,365*size,220*size,p[4],w===4?p[2]:null)}
 sceneGeometry(c,d,cam,t);stageSignature(c,d,cam,t);
 const mist=c.createLinearGradient(0,330,0,590);mist.addColorStop(0,p[2]+'00');mist.addColorStop(1,p[2]+'5a');c.fillStyle=mist;c.fillRect(0,300,1280,290);
 c.restore();}
export function paintExpeditionTerrain(c,d,x,y,w,h,index=0,platform=false,ready){if(w<1||h<1)return;const theme=P[d.world],kind=d.v15.kind;const dark=theme[5],mid=theme[4],light=theme[3],top=theme[2];c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
 c.fillStyle=dark;c.fillRect(x,y,w,h);const tile=ready('premium/moss_stone.webp');if(tile&&kind!=='sky'){c.globalAlpha=.14;for(let xx=x;xx<x+w;xx+=230)c.drawImage(tile,xx,y,235,175);c.globalAlpha=1;}
 // Hand-authored-looking repeating modular strata with seeded variation.
 const count=Math.min(100,Math.ceil(w/73));for(let i=0;i<count;i++){const xx=x+i*73,offs=rnd(index*59+i*41+d.id)*24,yy=y+20+offs,hh=26+rnd(i*2+index)*35;
  if(kind==='crystal'||kind==='ice'||kind==='star'){poly(c,[[xx-28,yy],[xx+7,yy-16],[xx+48,yy+7],[xx+24,yy+hh],[xx-11,yy+hh+9]],i%3===0?light+'80':mid+'c8',top+'60');}
  else if(kind==='clockwork'||kind==='crown'){c.fillStyle=i%2?mid:dark;c.fillRect(xx-10,yy,65,42);c.strokeStyle=light+'72';c.lineWidth=2;c.strokeRect(xx-10,yy,65,42);circle(c,xx+44,yy+8,3,top);}
  else {poly(c,[[xx-27,yy],[xx+19,yy-10],[xx+57,yy+9],[xx+42,yy+hh],[xx-15,yy+hh+10]],i%3===0?mid:dark,light+'5a');}
  if(kind==='reef'){coral(c,xx+25,yy+18,32,xx,top)}
  if(kind==='ember'){c.strokeStyle='#ff823c8f';c.lineWidth=2;c.beginPath();c.moveTo(xx+12,yy+5);c.lineTo(xx+34,yy+32);c.stroke()}
  if(kind==='moon'){c.strokeStyle='#8dd1a286';c.lineWidth=2;c.beginPath();c.moveTo(xx,yy+22);c.quadraticCurveTo(xx+35,yy+42,xx+55,yy+9);c.stroke()}
 }
 const rim=c.createLinearGradient(0,y,0,y+34);rim.addColorStop(0,light);rim.addColorStop(.2,top);rim.addColorStop(.72,mid);rim.addColorStop(1,dark);c.fillStyle=rim;c.fillRect(x,y,w,26);
 const pitch=kind==='ice'?26:kind==='clockwork'?45:kind==='reef'?32:18;
 for(let i=0;i<Math.min(140,Math.ceil(w/pitch));i++){let xx=x+i*pitch+rnd(i*12+index+d.id)*pitch*.4;
 if(kind==='sky'){cloud(c,xx,y+4,20)}
 else if(kind==='crystal'||kind==='star'){if(i%3===0)crystal(c,xx,y,0.19,light)}
 else if(kind==='ice'){poly(c,[[xx-8,y+1],[xx,y-9],[xx+9,y+2]],'#f1fdff99')}
 else if(kind==='ember'){if(i%4===0)glow(c,xx,y+6,22,'#ffb14d74')}
 else if(kind==='clockwork'){if(i%3===0){circle(c,xx,y+3,3,'#ffe2a9')}}
 else if(kind==='reef'){if(i%3===0)coral(c,xx,y+8,18,xx,top)}
 else if(kind==='moon'){c.strokeStyle=light+'a8';c.lineWidth=2;c.beginPath();c.moveTo(xx,y+8);c.lineTo(xx+4,y-6);c.stroke()}
 else if(kind==='crown'){if(i%3===0)crystal(c,xx,y-3,.12,light)}
 }
 if(platform){c.strokeStyle=top+'bd';c.lineWidth=2;c.beginPath();c.moveTo(x+2,y);c.lineTo(x+w-2,y);c.stroke()}
 c.restore();}
export function paintExpeditionDetails(c,d,cam,t){const v=d.v15,p=P[d.world];if(!v)return;c.save();const base=d.ground;
 for(const z of v.sources){const x=z.x-cam;if(x<-200||x>1480)continue;const lift=['sky','reef','ember'].includes(v.kind);if(lift){const col=v.kind==='ember'?'#ffb46f':v.kind==='reef'?'#89ffed':'#eefbff';let g=c.createLinearGradient(x,base-300,x,base);g.addColorStop(0,col+'00');g.addColorStop(.56,col+'30');g.addColorStop(1,col+'a0');c.fillStyle=g;c.beginPath();c.moveTo(x-60,base);c.quadraticCurveTo(x-125,base-160,x-44,base-280);c.lineTo(x+44,base-280);c.quadraticCurveTo(x+125,base-160,x+60,base);c.closePath();c.fill();for(let j=0;j<6;j++)circle(c,x+Math.sin(t*.001+j)*38,base-((t*.045+j*57)%290),3+j%3,col)}else if(v.kind==='crystal'||v.kind==='star'){glow(c,x,base-110,90,p[3]+'88');crystal(c,x,base-60,0.65,p[3])}}
 for(const sw of v.switches){const x=sw.x-cam;if(x<-65||x>1345)continue;const col=sw.active?'#baf9bf':p[3];glow(c,x,base-53,60,col+'80');c.fillStyle='#303344';c.fillRect(x-14,base-66,28,66);c.strokeStyle=col;c.lineWidth=4;c.beginPath();c.moveTo(x,base-62);c.lineTo(x+(sw.active?23:-21),base-93);c.stroke();circle(c,x,base-62,8,col);
  c.fillStyle='#102c3add';c.strokeStyle='#e6d2aa';c.lineWidth=2;c.fillRect(x-31,base-120,62,22);c.strokeRect(x-31,base-120,62,22);c.fillStyle='#fff4d8';c.textAlign='center';c.font='bold 12px system-ui';c.fillText('E / ✧',x,base-104)}
 // Animated hazard markers stay visible and grounded, matching the actual collision positions.
 for(const hz of d.hazards){const x=hz.x-cam;if(x<-75||x>1355)continue;const active=.5+.5*Math.sin(t*.004+hz.phase);const col=v.kind==='ember'?'#ff963d':v.kind==='ice'?'#cefcff':v.kind==='reef'?'#91fee3':p[3];
  glow(c,x,base-28,33,col+'a0');c.fillStyle=col;c.globalAlpha=.5+active*.45;
  if(hz.kind===3){c.beginPath();c.ellipse(x,base-3,35,7,0,0,TAU);c.fill();}
  else {poly(c,[[x-18,base],[x,base-35-active*18],[x+18,base]],col);}
  c.globalAlpha=1;
 }
 // Stage-specific big prop above the terrain near a checkpoint, uniquely composed.
 const anchor=d.checkpoints[0]||1500,ax=anchor-cam;if(ax>-260&&ax<1540){if(v.kind==='crystal'||v.kind==='star')crystal(c,ax,base-125,1.55,p[3]);if(v.kind==='clockwork')gear(c,ax,base-145,85,t*.0007,p[3]);if(v.kind==='reef')coral(c,ax,base,175,d.id,p[3]);if(v.kind==='crown')temple(c,ax,base,180,p[4]);if(v.kind==='moon'){circle(c,ax,base-135,22,'#ffedb5');glow(c,ax,base-135,65,'#dff7c5aa')}}
 c.restore();}
export const fullWorldPalette=P;
