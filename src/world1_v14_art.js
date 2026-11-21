/** Learn & Leap v14 — World 1 original runtime scenery, not screenshots or recoloured stage-forest plates.
 * Ten independently constructed scenes; location-specific strata, silhouettes, landmarks, material finishes.
 * All paintings are authored Canvas paths rendered behind real game physics/characters.
 */
const TAU=Math.PI*2,W=1280,H=720;
const rgba=(hex,a)=>{if(hex[0]!=='#'||hex.length!==7)return hex;return `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${a})`};
const hash=n=>{let k=Math.sin(n*97.271+2.118)*45628.918;return k-Math.floor(k)};
const palettes=[
 ['#284d62','#94cfae','#e2d9a8','#31534b','#b4c67b','#e8dca9'],
 ['#473e70','#a9abda','#ffd0ae','#43395f','#ec9f82','#b9a7f9'],
 ['#164b73','#77c6d2','#e6f6d9','#38627a','#79e8e3','#e9deba'],
 ['#36576b','#b9d9a4','#ffe2ab','#594e40','#90c67d','#dcb480'],
 ['#444c65','#dbb78b','#fbebc4','#635c63','#a4c4a5','#e4b67f'],
 ['#111f4b','#424680','#889fc4','#253351','#b0ddbd','#fad68b'],
 ['#3e6470','#88aaa7','#cad6bd','#3b5553','#879a5e','#96b8a0'],
 ['#18283d','#44546e','#8baab0','#383e4f','#79b8a9','#b4e2db'],
 ['#293756','#657796','#b6bdd3','#4c526c','#82bec6','#eee0ba'],
 ['#1c364f','#588784','#b6c4ad','#344f45','#a1dca5','#f8dba0']
];
function poly(c,pts,fill,stroke,line=1){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=line;c.stroke()}}
function ell(c,x,y,rx,ry,fill,rotation=0){c.save();c.translate(x,y);c.rotate(rotation);c.beginPath();c.ellipse(0,0,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();c.restore()}
function line(c,pts,color,w=2){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.lineWidth=w;c.strokeStyle=color;c.lineCap='round';c.lineJoin='round';c.stroke()}
function glow(c,x,y,r,color,a=.6){const g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,rgba(color,a));g.addColorStop(.3,rgba(color,a*.34));g.addColorStop(1,rgba(color,0));c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
function pointedArch(c,x,y,rx,ry,fill,thickness=25){c.save();c.translate(x,y);c.fillStyle=fill;c.beginPath();c.moveTo(-rx,-10);c.bezierCurveTo(-rx,-ry*.65,-rx*.42,-ry*.95,0,-ry);c.bezierCurveTo(rx*.42,-ry*.95,rx,-ry*.65,rx,-10);c.lineTo(rx-thickness,2);c.bezierCurveTo(rx-thickness,-ry*.52,rx*.28,-ry*.68,0,-ry+thickness);c.bezierCurveTo(-rx*.28,-ry*.68,-rx+thickness,-ry*.52,-rx+thickness,2);c.closePath();c.fill();c.restore()}
function mountain(c,x,y,span,height,front,back){poly(c,[[x-span/2,y],[x-span*.33,y-height*.65],[x-span*.15,y-height*.4],[x,y-height],[x+span*.27,y-height*.45],[x+span*.42,y-height*.73],[x+span/2,y]],back);poly(c,[[x-span*.18,y-height*.2],[x,y-height],[x+span*.1,y-height*.63],[x+span*.07,y-height*.6],[x+span*.03,y-height*.67],[x,y-height*.42]],front)}
function tree(c,x,y,scale=1,type='broad',tone='#263e42',crown='#52816c',seed=0){c.save();c.translate(x,y);c.scale(scale,scale);let w=20+hash(seed)*12,h=180+hash(seed*3)*70;
 c.beginPath();c.moveTo(-w,0);c.bezierCurveTo(-w*.7,-h*.39,-w*2,-h*.64,-w*.22,-h);c.bezierCurveTo(w*.7,-h*.75,w*1.5,-h*.42,w,0);c.closePath();c.fillStyle=tone;c.fill();line(c,[[-w*.26,0],[-w*.15,-h*.55],[w*.09,-h*.85]],rgba('#b6a488',.27),3);
 for(let j=0;j<3;j++)line(c,[[0,-h*(.6+j*.1)],[(j%2?1:-1)*(55+j*9),-h*(.83+j*.06)]],tone,9-j*2);
 if(type==='broad'){for(let i=0;i<6;i++){const a=i*TAU/6,x=Math.cos(a)*(65+hash(seed+i)*30),y=-h+Math.sin(a)*30;ell(c,x,y,66+hash(i+seed)*25,44+hash(seed+i)*20,crown);ell(c,x-11,y-18,49,20,rgba('#d0edb4',.12))}}
 if(type==='cypress'){for(let i=0;i<4;i++){ell(c,-25+i*16,-h-15-i*15,39,75-i*7,crown,-.15);ell(c,15+i*8,-h-30,30,83,crown,.2)}for(const sign of [-1,1])line(c,[[sign*7,-30],[sign*85,-20],[sign*105,13]],tone,10)}
 if(type==='pine'){for(let i=0;i<5;i++){const w=100-i*12;poly(c,[[-w,-50-i*44],[0,-h-40-i*13],[w,-50-i*44]],crown)}}
 c.restore()}
function mushroom(c,x,y,scale=1,cap='#e8a27f',stem='#f5cfab',big=false){c.save();c.translate(x,y);c.scale(scale,scale);
 poly(c,[[-21,0],[-17,-96],[15,-97],[25,0]],stem,'#bd9d9c',2);ell(c,0,-91,37,17,rgba('#6f5278',.28));
 c.beginPath();c.moveTo(-92,-90);c.bezierCurveTo(-86,-148,-46,-176,0,-180);c.bezierCurveTo(58,-179,91,-134,98,-90);c.bezierCurveTo(55,-79,-54,-78,-92,-90);c.closePath();const g=c.createLinearGradient(0,-183,0,-81);g.addColorStop(0,rgba('#fff4d3',.85));g.addColorStop(.2,cap);g.addColorStop(1,'#5e4669');c.fillStyle=g;c.fill();line(c,[[-92,-90],[-42,-82],[40,-81],[98,-90]],'#fcecc7',3);
 for(let j=0;j<14;j++){const sx=(hash(j*7+scale)*150)-75,sy=-150+hash(j*11)*48;const edge=(1-(sx/95)**2);if(edge>.1&&sy>-174&&sy<-90)ell(c,sx,sy,3+hash(j)*6,2+hash(j+3)*5,'#fff2d6',j*.29)}
 if(big){for(let j=0;j<4;j++)glow(c,-40+j*32,-84,21,'#fbeea7',.28)}c.restore()}
function crystal(c,x,y,scale=1,color='#b8fff2'){c.save();c.translate(x,y);c.scale(scale,scale);for(let j=-1;j<=1;j++){const z=hash(x*.1+j+4),h=56+z*40,a=j*18;poly(c,[[a-12,0],[a-11,-h*.75],[a,-h],[a+12,-h*.73],[a+16,0]],rgba(color,.7),'#c5faff',1.5);poly(c,[[a,-h],[a+12,-h*.73],[a+16,0],[a+1,0]],rgba('#238496',.43));line(c,[[a,-h],[a,0]],'#f2fffa',1.5)}c.restore()}
function waterfall(c,x,y,width=150,height=300){c.save();const g=c.createLinearGradient(x,0,x+width,0);g.addColorStop(0,'#76bad4');g.addColorStop(.24,'#d1fcf2');g.addColorStop(.44,'#68b9dd');g.addColorStop(.73,'#bdfff2');g.addColorStop(1,'#559bb8');c.fillStyle=g;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-22,y+130,x+12,y+210,x-4,y+height);c.lineTo(x+width,y+height);c.bezierCurveTo(x+width+5,y+190,x+width-15,y+80,x+width,y);c.closePath();c.fill();for(let i=0;i<18;i++){const dx=x+hash(i+width)*width,yy=y+hash(i*7)*height;line(c,[[dx,yy],[dx+Math.sin(i)*5,yy+22]],'#edfffa',2+hash(i)*3)}for(let i=0;i<8;i++)ell(c,x+i*width/7,y+height,25,7,'#d5fff1');c.restore()}
function cottage(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#a77b54';c.fillRect(-65,-110,130,106);c.fillStyle='#4b6558';c.fillRect(-60,-105,120,96);poly(c,[[-91,-112],[0,-174],[94,-112]],'#8a645b','#ebcba4',6);for(let j=-2;j<=2;j++){line(c,[[-65,-116+j*6],[65,-116+j*6]],'#be9270',2)}c.fillStyle='#f7dba2';c.fillRect(-35,-89,27,29);c.fillRect(11,-89,27,29);line(c,[[-22,-89],[-22,-61]],'#735443',3);line(c,[[24,-89],[24,-61]],'#735443',3);c.fillStyle='#795b49';c.fillRect(-12,-52,25,52);line(c,[[-80,-7],[80,-7]],'#d4b38d',8);for(let i=-2;i<=2;i++)line(c,[[i*32,-7],[i*32,16]],'#a87954',4);c.restore()}
function temple(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);let rock='#a39c86';poly(c,[[-185,0],[-161,-75],[-144,-75],[-116,-140],[-97,-140],[-61,-212],[60,-212],[99,-140],[120,-140],[153,-75],[171,-75],[189,0]],'#746f73','#dbb99a',4);for(let i=0;i<5;i++)c.fillStyle=i%2?'#b8ad93':'#898879',c.fillRect(-180+i*21,-i*38,360-i*42,24);c.fillStyle='#263e4b';c.fillRect(-40,-158,80,158);pointedArch(c,0,-42,52,137,'#d0b68d',11);for(let i=-1;i<=1;i++){line(c,[[i*82,-135],[i*82,-10]],'#c1b49d',11);ell(c,i*82,-160,18,16,'#e9c599');for(let j=0;j<4;j++)ell(c,i*83,-123+j*26,5,4,'#655d5b')};glow(c,0,-152,110,'#f2d99b',.4);c.restore()}
function lantern(c,x,y,r=14,t=0){line(c,[[x,y-76],[x,y-14]],'#a7bba6',2);glow(c,x,y,r*3,'#fef2a4',.6+.1*Math.sin(t*.002+x));ell(c,x,y,r,r*1.23,'#ffd78c');ell(c,x,y,r*.5,r*.7,'#fff7d3');line(c,[[x-r,y-r*.8],[x+r,y-r*.8]],'#9f9f8b',3)}
function rootTunnel(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);const dark='#1a263c',bark='#654c52';c.strokeStyle=bark;c.lineWidth=42;c.beginPath();c.moveTo(-140,60);c.bezierCurveTo(-210,-210,-100,-270,-3,-360);c.bezierCurveTo(130,-260,202,-210,150,80);c.stroke();line(c,[[-155,20],[-153,-220],[-4,-330],[145,-210],[152,36]],'#9b7969',5);pointedArch(c,0,50,115,285,dark,29);for(let j=0;j<8;j++){let xx=-129+j*36,yy=-20-j*17;line(c,[[xx,yy],[xx+13,yy-57],[xx+30,yy-82]],'#896c65',4)}c.restore()}
function windmill(c,x,y,s=1,t=0){c.save();c.translate(x,y);c.scale(s,s);poly(c,[[-20,0],[-10,-220],[13,-220],[24,0]],'#6d6669','#a9a4a1',3);const r=t*.0007;c.translate(0,-224);c.rotate(r);for(let j=0;j<4;j++){c.rotate(Math.PI/2);poly(c,[[0,0],[-15,-23],[-28,-111],[7,-107],[13,-9]],'#b6c6be','#668391',3)}ell(c,0,0,16,16,'#d7c799');c.restore()}
function heartTree(c,x,y,s=1,t=0){c.save();c.translate(x,y);c.scale(s,s);glow(c,0,-190,350,'#a8ffbd',.34);c.beginPath();c.moveTo(-85,75);c.bezierCurveTo(-95,-40,-75,-140,-39,-235);c.bezierCurveTo(-20,-300,-70,-350,-128,-375);c.bezierCurveTo(-46,-360,-5,-324,0,-266);c.bezierCurveTo(8,-355,64,-386,145,-381);c.bezierCurveTo(43,-341,20,-303,51,-222);c.bezierCurveTo(87,-107,89,-23,86,75);c.closePath();const g=c.createLinearGradient(-140,-260,140,40);g.addColorStop(0,'#2d4b49');g.addColorStop(.5,'#766f5c');g.addColorStop(1,'#314c3f');c.fillStyle=g;c.fill();c.strokeStyle='#a8d4a0';c.lineWidth=8;c.stroke();for(let k=0;k<7;k++)line(c,[[-70+k*22,60],[-50+k*18,-128],[(k-3)*28,-240]],'#a0b98b',3);for(let j=0;j<19;j++){let a=j*2.4,r=130+hash(j+5)*115;ell(c,Math.sin(a)*r,-337+Math.cos(a*.8)*78,61+hash(j)*46,45+hash(j*3)*32,'#2d6158');ell(c,Math.sin(a)*r-13,-351+Math.cos(a*.8)*78,41,30,rgba('#a8e6a4',.23))}glow(c,0,-178,114,'#ddffb9',.8+.1*Math.sin(t*.002));poly(c,[[0,-233],[45,-190],[0,-134],[-45,-190]],'#b8ffd0','#e8ffe1',3);for(let i=0;i<8;i++){const a=i*TAU/8;line(c,[[0,-185],[Math.cos(a)*78,-185+Math.sin(a)*81]],rgba('#f5ffd5',.55),2)}c.restore()}
function lightning(c,x,y,t){const active=Math.sin(t*.0035+x)>0.7;if(!active)return;line(c,[[x,y],[x-24,y+52],[x+7,y+45],[x-20,y+121],[x+46,y+44],[x+12,y+53],[x+32,y]],'#e5f8ff',4);glow(c,x,y+62,150,'#dbefff',.25)}
function sky(c,i,t){const p=palettes[i],g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,p[0]);g.addColorStop(.55,p[1]);g.addColorStop(1,p[2]);c.fillStyle=g;c.fillRect(0,0,W,H);
 if(i===7){c.fillStyle='#101b31';for(let j=0;j<12;j++)poly(c,[[j*150-70,0],[j*150+38,0],[j*150-5,120+hash(j)*100]],'#111e2f')}
 if(i!==7){glow(c,i===5?920:1000,i===5?120:80,i===5?175:260,i===5?'#e6d2ad':'#fff0cb',i===5?.13:.33);ell(c,990,80,i===5?34:51,i===5?34:51,i===5?'#d6e0ec':'#f9e6c0');}
 if(i===8||i===5){for(let j=0;j<25;j++){const x=hash(j+32)*W,y=hash(j*6+30)*260,r=hash(j*7)*2+1;ell(c,x,y,r,r,'#f4f8de')}}
 for(let j=0;j<5;j++){const xx=130+j*310+hash(i*40+j)*110;const yy=240+hash(j+i*7)*80;const mountainColor=rgba(p[3],.35+j*.045);if(![1,3,4,5,7,9].includes(i))mountain(c,xx,520,430,yy,mountainColor,rgba(p[3],.25));}
}
function landscape(c,i,cam,t){const p=palettes[i];c.save();let d=cam*.13; // distant panorama in view coordinates
 if(i===2||i===8||i===6){for(let j=-1;j<7;j++)mountain(c,j*370-d,540,460,300+hash(j+i)*100,rgba(p[3],.48),rgba(p[3],.68));}
 if(i===7){for(let j=-1;j<9;j++){const x=j*175-d;poly(c,[[x,0],[x+85,0],[x+120,120+hash(j)*150],[x+65,170],[x-15,75]],'#253047');for(let k=0;k<4;k++){poly(c,[[x+k*37,0],[x+15+k*37,75],[x+35+k*37,0]],'#132336')}}}
 if(i===0||i===3||i===5||i===6||i===9){for(let j=-1;j<11;j++){const x=j*165+hash(i+j)*60-d;tree(c,x,550,.8+hash(j+23)*.35,i===6?'cypress':'broad',p[3],i===5?'#2c4a66':'#446c65',j+i)}}
 if(i===1){for(let j=-1;j<12;j++){const x=j*160+hash(j*7)*30-d;mushroom(c,x,550,1.0+hash(j)*.7,['#e6a7aa','#df8cbd','#d8a2ee'][Math.abs(j)%3],'#cbb6d3');}}
 if(i===4){for(let j=-1;j<8;j++){const x=j*220-d;temple(c,x,570,.46+hash(j)*.2)}}
 if(i===2){for(let j=-1;j<8;j++)waterfall(c,j*220-d,173+hash(j)*25,77+hash(j)*24,380)}
 if(i===8){for(let j=-1;j<8;j++){ell(c,j*200-d,102,180,75,'#374561');ell(c,j*240+30-d,175,175,60,'#46546a');}}
 c.restore();
}
function landmarks(c,i,cam,t){const p=palettes[i];c.save();const step=1450;for(let k=0;k<5;k++){const origin=620+k*step-cam*.72;if(origin<-1100||origin>2350)continue;
 if(i===0){tree(c,origin-185,593,2.1,'broad','#30443c','#497666',k);tree(c,origin+205,593,2.05,'broad','#30443c','#456c5a',k+11);pointedArch(c,origin,568,226,445,'#695b48',40);glow(c,origin,245,172,'#ffecb6',.27);for(let q=0;q<9;q++)ell(c,origin-128+q*31,145+Math.sin(q)*12,8,4,'#e2d8a5');}
 else if(i===1){for(const [dx,s,col] of [[-240,1.6,'#e69c94'],[80,2.2,'#d4a6e7'],[290,1.55,'#f4b27c']])mushroom(c,origin+dx,592,s,col,'#f3d9c5',true);for(let q=0;q<20;q++){let xx=origin-340+hash(q*4+k)*620,yy=170+hash(q*7)*340;glow(c,xx,yy,14,'#fff0be',.23)}}
 else if(i===2){mountain(c,origin+110,590,600,430,'#537c8c','#375771');mountain(c,origin-200,590,400,400,'#52758e','#244865');waterfall(c,origin-120,205,218,350);crystal(c,origin-295,570,1.6);crystal(c,origin+215,578,1.3,'#bbdcff');for(let j=0;j<5;j++)line(c,[[origin-320+j*100,570],[origin-295+j*100,556]],'#a7e6ee',3)}
 else if(i===3){tree(c,origin,605,2.9,'broad','#5a4b3e','#6e9078',k);cottage(c,origin-175,310,1.0);cottage(c,origin+155,264,.9);line(c,[[origin-114,325],[origin-15,310],[origin+90,277]],'#9a7b59',12);for(let j=0;j<20;j++)line(c,[[origin-112+j*10,319],[origin-112+j*10,330]],'#e9c796',2);for(let j=0;j<4;j++)lantern(c,origin-180+j*120,250,8,t)}
 else if(i===4){temple(c,origin,585,2.1);for(const dx of [-355,356]){c.fillStyle='#928c7b';c.fillRect(origin+dx-17,270,34,315);ell(c,origin+dx,265,30,24,'#e3ba7e')}glow(c,origin,222,75,'#ffe5a7',.3)}
 else if(i===5){tree(c,origin-115,599,2.25,'cypress','#2d344a','#32466e',k);tree(c,origin+210,605,2.15,'broad','#252e4b','#384d67',k+20);for(let q=0;q<12;q++)lantern(c,origin-300+q*56,185+hash(q+k)*240,5+hash(q)*4,t)}
 else if(i===6){for(const [dx,s] of [[-255,1.85],[115,1.65],[360,1.5]])tree(c,origin+dx,575,s,'cypress','#344845','#496965',k+dx);ell(c,origin,580,450,53,'#557a7a');for(let j=0;j<12;j++){let xx=origin-320+j*56;ell(c,xx,550+hash(j)*25,25+hash(j)*13,8,'#83a970')}}
 else if(i===7){rootTunnel(c,origin,601,1.75);crystal(c,origin-320,576,1.65,'#b3f3e7');crystal(c,origin+342,579,1.5,'#e8beff');for(let j=0;j<8;j++)line(c,[[origin+j*95-300,60],[origin+j*95-260,185+hash(j)*85],[origin+j*95-240,205]],'#5a7369',12)}
 else if(i===8){windmill(c,origin-220,572,1.5,t);tree(c,origin+140,576,1.75,'pine','#3c3b46','#556e65',k);lightning(c,origin+280,25,t);for(let q=0;q<11;q++){let xx=origin-400+q*75,yy=280+hash(q+k)*140;line(c,[[xx,yy],[xx+55,yy-17]],'#d0dfe0',2)}}
 else if(i===9){heartTree(c,origin,592,1.65,t);for(let j=0;j<8;j++){const xx=origin-405+j*115,yy=350+hash(j)*165;glow(c,xx,yy,18,'#e2ffc5',.6)}}
 }c.restore()}
function finishAtmosphere(c,i,t){if(i===5||i===9||i===1||i===7){for(let j=0;j<20;j++){const x=hash(j*7+i*33)*W+Math.sin(t*.001+j)*8,y=hash(j*12+i)*555+Math.cos(t*.001+j)*8,rad=(i===1?2.6:2)+hash(j)*2;c.fillStyle=i===1?'rgba(255,223,170,0.22)':'rgba(219,255,190,0.22)';c.beginPath();c.arc(x,y,rad*4.2,0,TAU);c.fill();ell(c,x,y,rad,rad,'#ffffd3')}}
 if(i===6||i===2){const g=c.createLinearGradient(0,470,0,710);g.addColorStop(0,rgba('#eefafa',0));g.addColorStop(1,rgba('#b3e3dc',.26));c.fillStyle=g;c.fillRect(0,470,W,250)}
 if(i===8){for(let j=0;j<17;j++){let xx=(hash(j+12)*W+t*.03)%W,yy=hash(j*8)*500;line(c,[[xx,yy],[xx-18,yy+13]],rgba('#d9e8e8',.35),1)}}
}
function background(c,d,cam,t){
 const i=d.id-1,p=palettes[i]||palettes[0];
 const readyFn=typeof window!=='undefined'?window.__LEAP_READY__:null;
 const plate=readyFn&&(readyFn(`stage-forest/${String(i+1).padStart(2,'0')}.webp`)||readyFn('premium/whispering_woods_backdrop.webp'));
 if(plate){
  const pan=Math.sin(cam*.00055)*24;
  c.save();
  c.drawImage(plate,-28-pan,-10,W+56,H+20);
  // Subtle stage-specific colour harmony & atmospheric distance mist
  const harmony=c.createLinearGradient(0,0,0,H);
  harmony.addColorStop(0,rgba(p[0],.22));
  harmony.addColorStop(.58,rgba(p[1],.08));
  harmony.addColorStop(1,rgba(p[3],.34));
  c.fillStyle=harmony;c.fillRect(0,0,W,H);
  glow(c,i===5?920:985,95,380,i===5?'#c8dcff':'#fff1c2',i===5?.16:.24);
  c.restore();
 }else{
  sky(c,i,t);
  landscape(c,i,cam,t);
  landmarks(c,i,cam,t);
 }
 finishAtmosphere(c,i,t);
}
function terrain(c,d,x,y,w,h,index=0,platform=false,p=null,t=0){const i=d.id-1,stage=palettes[i];if(w<=0||h<=0)return;const base=[['#59735b','#344e47'],['#86627c','#403c69'],['#4a8190','#345370'],['#7a6654','#4a574b'],['#97907e','#55576a'],['#546982','#273b5a'],['#596d62','#344e4f'],['#536376','#2b364e'],['#616b79','#373f5a'],['#697665','#344d47']][i];
 c.save();const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,base[0]);g.addColorStop(1,base[1]);c.fillStyle=g;c.fillRect(x,y,w,h);c.beginPath();c.rect(x,y,w,h);c.clip();
 const count=Math.min(160,Math.ceil(w/26));for(let j=0;j<count;j++){const xx=x+(j*37+index*13)%Math.max(1,w),yy=y+16+hash(j*9+index)*Math.max(15,h-25);line(c,[[xx,yy],[xx+9+hash(j)*19,yy+7],[xx+6,yy+15]],rgba('#d6dbc8',.13),1.6)}
 if(i===2||i===7){for(let j=0;j<Math.min(23,w/32);j++)crystal(c,x+j*34,y+26, .19,i===2?'#96f9f7':'#b1dff2')}
 if(i===4){for(let j=0;j<w/54;j++)line(c,[[x+j*54,y+3],[x+j*54,y+48]],rgba('#f9e7bd',.3),3);for(let j=0;j<8;j++)line(c,[[x+hash(index*9+j)*w,y+28+j*21],[x+hash(index*9+j)*w+30,y+28+j*21]],'#aa9d7b',2)}
 if(i===6){for(let j=0;j<w/65;j++)ell(c,x+j*65,y+28,24,4,'#849e83');}
 if(i===8){for(let j=0;j<w/80;j++)line(c,[[x+j*80,y+12],[x+j*80+14,y+24],[x+j*80+7,y+37]],'#4d576b',3)}
 c.restore();
 const edge=i===1?'#d8a6c2':i===2?'#a5efea':i===4?'#d5c4a5':i===5?'#a3c6bb':i===6?'#8fa98b':i===7?'#b6c9be':i===8?'#aab6ba':i===9?'#a2d6ab':'#b4c984';
 c.fillStyle=edge;c.fillRect(x,y-8,w,11);c.fillStyle=rgba('#fff9da',.27);c.fillRect(x,y-8,w,2);
 if(i===1&&platform){for(let j=0;j<Math.max(2,w/42);j++)ell(c,x+13+j*42,y-13,19,12,'#e9b4d6')}
 else if(i===6&&platform){for(let j=0;j<Math.max(2,w/58);j++)ell(c,x+j*58+20,y-9,22,8,'#8caf7e')}
 if(i===3&&platform)for(let j=0;j<w/34;j++)line(c,[[x+j*34,y],[x+j*34,y+48]],rgba('#f8d9af',.45),2);
 if(i===8&&p?.v14Type==='crumble'){for(let j=0;j<Math.ceil(w/50);j++)line(c,[[x+j*45,y+6],[x+j*45+26,y+19],[x+j*45+17,y+40]],'#212d47',3)}
 if(i===1&&p?.v14Type==='bounce'){glow(c,x+w/2,y,65,'#ffddce',.32);line(c,[[x+6,y+2],[x+w/2,y-21],[x+w-6,y+2]],'#f1ccff',8)}
}
function featureObjects(c,d,cam,t){const v=d.v14;if(!v)return;const i=d.id-1;
 for(const sw of v.switches||[]){const x=sw.x-cam;if(x<-70||x>1350)continue;c.save();c.fillStyle='#988b7c';c.fillRect(x-18,d.ground-67,36,67);ell(c,x,d.ground-72,22,14,sw.active?'#c1f5b2':'#e0d0b0');line(c,[[x,d.ground-80],[x+(sw.active?31:-21),d.ground-118]],sw.active?'#a9edbd':'#f8cf8c',9);glow(c,x,d.ground-80,40,sw.active?'#baffb5':'#ffd7a2',.37);c.restore();}
 for(const b of v.bridges||[]){if(!b.open)continue;const x=b.x-cam;terrain(c,d,x,b.y,b.w,28,b.group,true);for(let j=0;j<b.w/24;j++)line(c,[[x+j*24,b.y],[x+j*24,b.y+28]],'#d4c29a',2)}
 if(i===5){for(let j=0;j<7;j++){let x=210+j*690-cam;if(x<-100||x>1400)continue;lantern(c,x,d.ground-185,14,t);}}
 if(i===7){for(let j=0;j<6;j++){const x=440+j*860-cam;if(x<-200||x>1450)continue;crystal(c,x,d.ground,1.2,'#8be5dd')}}
 if(i===8){for(const wind of v.winds||[]){const x=wind.x-cam;if(x>1350||x+wind.w<-100)continue;for(let j=0;j<8;j++){const xx=x+j*wind.w/9,yy=d.ground-155-j%3*38;line(c,[[xx,yy],[xx+wind.force*.22,yy-8]],rgba('#d1e6e9',.58),3)}}}
 if(i===9){const x=d.bossX-cam;glow(c,x,d.ground-170,240,'#bdfbb5',.42);
  const strike=v.bossStrike;if(strike?.remaining>0){const strength=(1.15-strike.remaining)/1.15;
   if(strike.phase===2){const sx=strike.x-cam;glow(c,sx,d.ground-14,125,'#f9a984',.35+strength*.45);line(c,[[sx-80,d.ground],[sx-45,d.ground-75*strength],[sx-10,d.ground-102*strength],[sx+40,d.ground]],'#ffcf9b',4)}
   else if(strike.phase===3){glow(c,x,d.ground-10,170+300*strength,'#befacb',.19);c.strokeStyle='#d3ffbc';c.lineWidth=3+strength*5;c.beginPath();c.ellipse(x,d.ground-8,90+430*strength,17+12*strength,0,Math.PI,TAU);c.stroke();}
   else{c.strokeStyle='#c6f2ac';c.lineWidth=3+strength*6;c.beginPath();c.arc(x,d.ground-30,50+370*strength,Math.PI*1.12,Math.PI*1.92);c.stroke();}
  }
 }
}
function foreground(c,d,cam,t){
 const i=d.id-1,p=palettes[i];
 const readyFn=typeof window!=='undefined'?window.__LEAP_READY__:null;
 const ferns=readyFn&&readyFn('world1-v6/ferns-and-blossoms.png');
 c.save();
 if(ferns){
  c.globalAlpha=.36;
  const shift=(cam*.18)%420;
  c.drawImage(ferns,-90-shift*.15,612,265,165);
  c.drawImage(ferns,1110+shift*.12,616,265,165);
 }else{
  c.globalAlpha=.28;
  for(let j=0;j<9;j++){const sx=j*193+hash(j+i*9)*60-((cam*.91)%193);if(sx<-80||sx>1350)continue;
  if(i===1)mushroom(c,sx,725,.5,'#ebc48b','#f3e8d5');
  else if(i===2||i===7)crystal(c,sx,735,.48,i===2?'#bbfff5':'#d0b9e3');
  else if(i===6)ell(c,sx,712,79,18,'#678a74');
  else if(i===8)tree(c,sx,725,.4,'pine',p[3],p[4],j);
  else if(i!==4)tree(c,sx,740,.45,'broad',p[3],p[4],j);
  }
 }
 c.restore();
 if(i===7){const g=c.createLinearGradient(0,0,0,130);g.addColorStop(0,'#111e34');g.addColorStop(1,'#111e3400');c.fillStyle=g;c.fillRect(0,0,W,130)}
}
export const WorldOneArt={background,terrain,featureObjects,foreground,locations:10};
