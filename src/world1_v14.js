/* Learn & Leap v14 — World 1 authored locations and game-mechanic configuration.
   Original 100-level content, save format, curriculum and approved characters are retained. */
(function(root){'use strict';
const locations=[
 {name:['Enchanted Forest Entrance','魔法森林入口','Pintu Masuk Hutan Ajaib'],mechanic:'forest',landmark:'root arch and ancient gateway',cue:['Follow the glowing trail','沿着发光小径前进','Ikut laluan bercahaya']},
 {name:['Giant Mushroom Valley','巨型蘑菇山谷','Lembah Cendawan Gergasi'],mechanic:'bounce',landmark:'colossal layered mushroom caps',cue:['Land on giant mushrooms to spring higher','跳上巨型蘑菇，弹得更高','Lompat di cendawan gergasi untuk melantun']},
 {name:['Crystal Waterfall Gorge','水晶瀑布峡谷','Gaung Air Terjun Kristal'],mechanic:'waterfall',landmark:'tiered waterfalls, cliff bridges and crystals',cue:['Time jumps across wet canyon gaps','把握时机跳过峡谷','Lompat merentasi jurang dengan tepat']},
 {name:['Treetop Village','树冠村落','Perkampungan Puncak Pokok'],mechanic:'treetop',landmark:'suspended cottages, ladders and ropewalks',cue:['Choose a high or low route','选择树上的高路或低路','Pilih laluan atas atau bawah']},
 {name:['Forgotten Temple','遗忘神殿','Kuil Terlupa'],mechanic:'temple',landmark:'monolithic sun temple and rune pillars',cue:['Use ✧ near a stone lever to raise a bridge','靠近石杠按✧升起石桥','Tekan ✧ dekat tuil batu untuk buka jambatan']},
 {name:['Firefly Forest','萤火虫森林','Hutan Kelip-kelip'],mechanic:'firefly',landmark:'luminous lantern-tree canopy and golden swarms',cue:['Activate lanterns to reveal hidden light paths','点亮灯笼，让隐藏的光路出现','Nyalakan pelita untuk dedahkan laluan']},
 {name:['Misty Swamplands','迷雾沼泽','Paya Berkabus'],mechanic:'swamp',landmark:'cypress roots, lily pads and misty pools',cue:['Keep moving: marsh platforms will sink','不断前进：沼泽平台会下沉','Terus bergerak: pelantar paya akan tenggelam']},
 {name:['Underground Root Caverns','地下树根洞穴','Gua Akar Bawah Tanah'],mechanic:'cavern',landmark:'root tunnels, geodes and vertical lifts',cue:['Operate root switches to move cave lifts','使用树根开关驱动升降台','Guna suis akar untuk gerakkan lif']},
 {name:['Stormwood Highlands','风暴森林高地','Tanah Tinggi Hutan Ribut'],mechanic:'storm',landmark:'lightning ridge, windmills and broken bridges',cue:['Fight the wind; cracked ledges crumble','抵抗狂风：裂开的平台会坍塌','Lawan angin; pelantar retak akan runtuh']},
 {name:['Heart of the Ancient Forest','远古森林之心','Jantung Hutan Purba'],mechanic:'heart',landmark:'towering ancient heart-tree and Rootkeeper',cue:['Awaken four runes; defeat the three-phase Rootkeeper','点亮四座符文，击败三阶段根脉守护者','Aktifkan empat rune; tewaskan Rootkeeper tiga fasa']}
];
const bridges={5:[{x:1300,w:205},{x:2540,w:215},{x:3520,w:225}],6:[{x:1290,w:205},{x:2500,w:205}]};
function decorateLevel(level){if(level.world!==0)return level;const n=level.id-1,loc=locations[n];level.title=loc.name.slice();level.subtitle=loc.cue.slice();level.v14={scene:n+1,mechanic:loc.mechanic,landmark:loc.landmark};
 level.platforms.forEach((p,i)=>{p.v14BaseY=p.y;if(n===1&&i%2===0)p.v14Type='bounce';if(n===6&&i%2===0)p.v14Type='sink';if(n===7&&i%3===0)p.v14Type='lift';if(n===8&&i%2===0)p.v14Type='crumble';if(n===3&&i%3===0)p.v14Type='branch'});
 if(n===2){level.pits.push({x:1325,w:116},{x:2450,w:124},{x:3100,w:121});}
 if(n===3){level.platforms.push({x:1040,y:376,w:205,v14BaseY:376,v14Type:'branch'},{x:1620,y:388,w:193,v14BaseY:388,v14Type:'branch'},{x:2650,y:373,w:209,v14BaseY:373,v14Type:'branch'},{x:3630,y:392,w:210,v14BaseY:392,v14Type:'branch'});}
 if(n===4){level.pits.push({x:1335,w:120},{x:2580,w:127});level.v14.switches=[{x:1150,group:0},{x:2400,group:1},{x:3420,group:2}];level.v14.bridges=bridges[5].map((b,i)=>({...b,y:level.ground-8,group:i,open:false}));}
 if(n===5){level.pits.push({x:1330,w:120},{x:2535,w:126});level.v14.switches=[{x:1150,group:0},{x:2420,group:1}];level.v14.bridges=bridges[6].map((b,i)=>({...b,y:level.ground-7,group:i,open:false}));}
 if(n===7){level.v14.switches=[{x:1070,group:0},{x:2450,group:1},{x:3600,group:2}];}
 if(n===8)level.v14.winds=[{x:560,w:620,force:165},{x:1920,w:670,force:-180},{x:3250,w:760,force:205}];
 if(n===9)level.v14.bossPhases=['Vine Swipe','Falling Roots','Ancient Storm'];
 return level;
}
function reset(d){if(!d?.v14)return;for(const p of d.platforms){p.y=p.v14BaseY??p.y;p.v14Contact=0;p.v14Down=0;p.v14Recover=0;p.v14Broken=0;}
 for(const b of d.v14.bridges||[])b.open=false;
 for(const x of d.v14.switches||[])x.active=false;
 d.v14.mechanicEvents=[];d.v14.triggerCount=0;d.v14.windForce=0;d.v14.bossPhase=1;}
function activate(s){const v=s.levelData?.v14;if(!v)return null;const p=s.player;
 const sw=(v.switches||[]).find(x=>Math.abs(x.x-p.x)<125);
 if(!sw)return null;sw.active=!sw.active;for(const b of v.bridges||[])if(b.group===sw.group)b.open=sw.active;
 v.triggerCount++;v.mechanicEvents.push({type:'switch',group:sw.group,active:sw.active});return sw.active?'A hidden passage awakens!':'The mechanism rests.';
}
function onRune(s,shrine){const v=s.levelData?.v14;if(!v)return;const kind=v.mechanic;
 v.triggerCount++;v.mechanicEvents.push({type:'educational-rune',subject:shrine.subject});
 if(kind==='bounce')v.bounceBoostTimer=8;
 if(kind==='waterfall')v.steadyCurrentTimer=8;
 if(kind==='swamp')v.marshSafeTimer=8;
 if(kind==='storm')v.calmWindTimer=8;
 if(kind==='temple'||kind==='firefly'){
  const idx=s.levelData.shrines.findIndex(x=>x.subject===shrine.subject);
  const group=Math.min(Math.floor(idx/2),v.bridges.length-1);
  if(group>=0){v.bridges[group].open=true;const sw=v.switches.find(q=>q.group===group);if(sw)sw.active=true;}
 }
 if(kind==='cavern'){const sw=v.switches.find(q=>!q.active);if(sw)sw.active=true;}
}
function tick(s,dt){const d=s.levelData,v=d?.v14;if(!v)return;const p=s.player;
 for(const k of ['bounceBoostTimer','steadyCurrentTimer','marshSafeTimer','calmWindTimer'])v[k]=Math.max(0,(v[k]||0)-dt);
 for(const q of d.platforms){
  if(q.v14Type==='sink'){if(v.marshSafeTimer>0){q.y+=(q.v14BaseY-q.y)*Math.min(1,dt*5);q.v14Contact=0;continue;}
   q.v14Contact=Math.max(0,q.v14Contact-dt*.25);
   if(p.grounded&&Math.abs(p.x-(q.x+q.w/2))<q.w/2+12&&Math.abs(p.y+p.h-q.y)<10)q.v14Contact+=dt*1.5;
   const before=q.y;q.y=Math.min(q.v14BaseY+95,q.v14BaseY+Math.max(0,q.v14Contact-.2)*112);
   if(p.grounded&&Math.abs(p.y+p.h-before)<12&&p.x>q.x&&p.x<q.x+q.w)p.y+=q.y-before;
   if(q.y>q.v14BaseY+30)v.triggerCount=Math.max(v.triggerCount,1);
  }
  if(q.v14Type==='lift'){
   const active=(v.switches||[]).some(x=>x.active);
   const before=q.y;q.y=q.v14BaseY+(active?Math.sin(s.elapsed*1.4+q.x*.004)*48:0);
   if(p.grounded&&Math.abs(p.y+p.h-before)<12&&p.x>q.x&&p.x<q.x+q.w)p.y+=q.y-before;
  }
  if(q.v14Type==='crumble'){
   if(q.v14Broken>0){q.v14Broken-=dt;if(q.v14Broken<=0){q.y=q.v14BaseY;q.v14Contact=0;}}
   else if(q.v14Contact>0){q.v14Contact+=dt;if(q.v14Contact>.70){q.v14Broken=2.4;q.y=d.ground+180;v.triggerCount++;}}
   if(q.v14Broken<=0&&!q.v14Contact&&p.grounded&&p.x>q.x&&p.x<q.x+q.w&&Math.abs(p.y+p.h-q.y)<12)q.v14Contact=.001;
  }
 }
 if(v.mechanic==='waterfall'){
  const x=Math.floor((p.x-400)/1100),zone=550+x*1100;
  if(Math.abs(p.x-zone)<140&&!p.grounded&&!(v.steadyCurrentTimer>0)){p.vx+=Math.sin(s.elapsed*3+x)*95*dt;v.triggerCount++;}
 }
 if(v.mechanic==='storm'){
  const region=v.winds.find(z=>p.x>z.x&&p.x<z.x+z.w);
  v.windForce=region?region.force*(.8+.2*Math.sin(s.elapsed*4)):0;
  if(region&&!(v.calmWindTimer>0)){p.vx=Math.max(-410,Math.min(410,p.vx+v.windForce*dt));v.triggerCount++;}
 }else v.windForce=0;
 if(v.mechanic==='heart'&&s.keys===4&&s.bossHp>0)v.bossPhase=s.bossHp>=3?1:s.bossHp===2?2:3;
}
function contact(s,surface){const v=s.levelData?.v14;if(!v||!surface)return false;const q=surface;
 if(q.v14Type==='bounce'&&s.player.vy>=0){s.player.vy= v.bounceBoostTimer>0?-1010:-875;s.player.grounded=false;v.triggerCount++;v.mechanicEvents.push({type:'bounce',at:q.x});return true;}return false;
}
const api={locations,decorateLevel,reset,activate,onRune,tick,contact};root.LeapWorldOne=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
