/* Learn & Leap Adventure v15: authored expansions for Worlds 2–10.
   No changes to core curriculum, existing artwork or saved-progress key. */
(function(root){'use strict';
const scenes=[null,
['Prism Threshold','Amethyst Gallery','Echoing Geodes','Quartz Bridges','Mirror Chamber','Gemstone Rapids','Sapphire Vault','Shimmering Labyrinth','Resonance Spires','Heart of the Prism'],
['Cloud Harbor','Kitewind Crossing','Sunlit Aerie','Zephyr Orchard','Floating Observatory','Thundercloud Pass','Balloon Bazaar','Skyrail Passage','Aurora Flight','Sanctum Above Storms'],
['Cinder Gate','Basalt Steps','Obsidian Citadel','Lavafall Canyon','Ember Forge','Ashwing Terrace','Molten River','Furnace Spires','Crater Rim','Magma Throne'],
['Snowdrop Trail','Frostglass Bridge','Pine-Snow Ridge','Icebound Observatory','Avalanche Shelf','Glacial Mirror','Aurora Grotto','Shiver Peak','Blizzard Traverse','Glacier Citadel'],
['Coral Gateway','Seagrass Meadow','Pearl Shell Banks','Anemone Arch','Sunken Library','Tidepool Ledges','Kelp Cathedral','Lagoon Geysers','Deepwater Palace','Leviathan Reef'],
['Brass Promenade','Pendulum Square','Steamworks Canal','Clockface Tower','Cogwheel Courtyard','Mechanical Foundry','Suspended Rail','Bell Tower','Grand Chronometer','Titan Engine'],
['Moonlit Crossing','Whispering Reeds','Lantern Bayou','Shadow Bridges','Lunar Willow','Mire Cathedral','Ghostlight Channel','Fading Causeway','Eclipse Garden','Nightmire Court'],
['Comet Garden','Meteor Terrace','Astral Walkway','Nebula Shrine','Celestial Lift','Starlight Bridge','Orbiting Stones','Constellation Hall','Meteor Shower','Phoenix Zenith'],
['Crown Gateway','Hall of Echoes','Twelve Pillars','Portal Court','Royal Archives','Elemental Causeway','Crystal Crownspire','Convergence Bridge','Throne of Runes','Harmony Crown']];
const settings=[null,
['crystal','resonate',['Jump on resonant crystals to rise higher.','借助共鸣水晶跳得更高。','Lompat di atas kristal bergema untuk naik lebih tinggi.']],
['sky','cloud',['Ride rising air and moving cloud platforms.','利用上升气流，跳上云端平台。','Naiki arus udara dan pelantar awan bergerak.']],
['ember','thermal',['Use heat plumes to leap across volcanic ledges.','借助热气流跨越火山平台。','Gunakan aliran haba untuk melompat antara pelantar.']],
['ice','ice',['Plan your stops: the frozen ground is slippery.','冰面很滑，提前规划停下的位置。','Rancang hentian: permukaan ais licin.']],
['reef','buoyant',['Bubble currents lift you through the coral reef.','利用气泡水流穿越珊瑚礁。','Arus gelembung mengangkat anda melalui terumbu.']],
['clockwork','gear',['Activate gear switches and ride moving lifts.','启动齿轮开关，搭乘升降台。','Aktifkan suis gear dan naik lif bergerak.']],
['moon','shadow',['Light moon lanterns as marsh ledges sink.','点亮月灯，穿过下沉的沼泽平台。','Nyalakan pelita bulan di atas pelantar yang tenggelam.']],
['star','starlift',['Time gravity pulses to reach high star ledges.','把握低重力时机跳上星辰平台。','Gunakan detik graviti rendah untuk ke pelantar bintang.']],
['crown','rune',['Activate runes to steady shifting royal bridges.','启动符文，稳定移动的皇家桥梁。','Aktifkan rune untuk menstabilkan jambatan diraja.']]];

const titlesZh=[null,
['棱镜入口','紫晶长廊','回响晶洞','石英之桥','镜面密室','宝石激流','蓝宝石宝库','闪光迷宫','共鸣尖塔','棱镜之心'],
['云港','风筝之路','阳光鸟巢','西风果园','浮空观星台','雷云山口','热气球集市','天空轨道','极光飞行','风暴之上'],
['余烬之门','玄武岩台阶','黑曜石城堡','熔岩瀑布峡谷','余烬锻造坊','灰翼露台','熔岩之河','火炉尖塔','火山口边缘','岩浆王座'],
['雪花小径','冰晶之桥','松雪山脊','冰封观星台','雪崩高台','冰川之镜','极光洞窟','寒颤峰顶','暴风雪穿越','冰川城堡'],
['珊瑚之门','海草草原','珍珠贝滩','海葵之拱','沉没图书馆','潮池高台','海带大教堂','泻湖喷泉','深海宫殿','海兽珊瑚礁'],
['黄铜大道','钟摆广场','蒸汽运河','钟面高塔','齿轮庭院','机械铸造厂','悬空轨道','钟楼','巨型时计','巨人引擎'],
['月光渡口','低语芦苇','灯笼河湾','暗影之桥','月影垂柳','沼泽大教堂','鬼火水道','隐没栈道','日蚀花园','夜沼王庭'],
['彗星花园','流星台地','星界步道','星云圣坛','天体升降台','星光之桥','环绕飞石','星座大厅','流星雨','凤凰天顶'],
['王冠之门','回声大厅','十二根柱子','传送门庭院','皇家档案馆','元素大道','水晶王冠塔','汇聚之桥','符文王座','和谐王冠']];
const titlesMs=[null,
['Gerbang Prisma','Galeri Amethyst','Geod Bergema','Jambatan Kuarza','Ruang Cermin','Jeram Permata','Khazanah Nilam','Liku Berkilau','Menara Resonans','Jantung Prisma'],
['Pelabuhan Awan','Lintasan Angin Layang','Sarang Bersinar','Dusun Bayu','Balai Cerap Terapung','Laluan Awan Petir','Bazar Belon','Landasan Langit','Penerbangan Aurora','Kudus Atas Ribut'],
['Gerbang Bara','Tangga Basalt','Kota Obsidian','Gaung Air Terjun Lava','Tempa Bara','Teres Sayap Abu','Sungai Lava','Menara Relau','Bibir Kawah','Takhta Magma'],
['Jejak Salji','Jambatan Ais','Banjaran Bersalji','Balai Cerap Beku','Pelantar Salji Runtuh','Cermin Glasier','Gua Aurora','Puncak Dingin','Lintasan Ribut Salji','Kota Glasier'],
['Gerbang Karang','Padang Rumput Laut','Tebing Mutiara','Gerbang Anemon','Perpustakaan Tenggelam','Pelantar Kolam Pasang','Katedral Kelp','Pancutan Laguna','Istana Air Dalam','Terumbu Leviathan'],
['Persiaran Loyang','Dataran Bandul','Terusan Stim','Menara Jam','Laman Roda Gigi','Kilang Mekanikal','Landasan Gantung','Menara Loceng','Kronometer Agung','Enjin Titan'],
['Lintasan Bulan','Buluh Berbisik','Teluk Pelita','Jambatan Bayang','Dedalu Bulan','Katedral Paya','Terusan Cahaya Roh','Tambak Pudar','Taman Gerhana','Istana Malam'],
['Taman Komet','Teres Meteor','Laluan Astral','Kuil Nebula','Lif Cakerawala','Jambatan Bintang','Batu Beredar','Balai Buruj','Hujan Meteor','Kemuncak Phoenix'],
['Gerbang Mahkota','Dewan Gema','Dua Belas Tiang','Laman Portal','Arkib Diraja','Tambak Unsur','Menara Mahkota Kristal','Jambatan Pertemuan','Takhta Rune','Mahkota Harmoni']];

const modes=['arrival','crossing','vertical','mechanism','hazard','secret','precision','moving','mastery','guardian'];
const chinese=['','水晶洞窟','天空群岛','熔岩火山','冰封雪峰','沉没珊瑚礁','齿轮机械城','月影沼泽','星坠山巅','万界王冠'];
const malay=['','Gua Kristal','Pulau Langit','Gunung Berapi','Puncak Beku','Terumbu Tenggelam','Kota Jam Mekanikal','Paya Bayang Bulan','Puncak Bintang','Mahkota Dunia'];
function decorateLevel(d){if(d.world<1||d.world>9)return d;
 const w=d.world,stage=d.stage-1,[kind,material,cue]=settings[w];
 d.v15={world:w,stage:stage+1,kind,material,mode:modes[stage],landmark:scenes[w][stage],cue:cue.slice(),triggerCount:0,runeBoost:0,events:[],switches:[],active:false};
 d.title=[scenes[w][stage],titlesZh[w][stage],titlesMs[w][stage]];d.subtitle=cue.slice();
 d.v15.sources=[{x:450+stage*13,power:1},{x:1730+stage*17,power:1.12},{x:3020+stage*9,power:1.20}].filter(x=>x.x<d.length-450);
 d.v15.switches=[{x:1140+stage*7,active:false},{x:2480+stage*3,active:false}].filter(x=>x.x<d.length-410);
 d.platforms.forEach((p,i)=>{p.v15BaseY=p.y;p.v15BaseX=p.x;p.v15Phase=i*1.71+stage*.63;p.v15Contact=0;p.v15Type=(i+stage)%3===0?material:(w===6&&i%2===0?'gear':w===7&&i%2===1?'shadow':null);});return d;
}
function reset(d){const v=d?.v15;if(!v)return;v.triggerCount=0;v.runeBoost=0;v.active=false;v.events=[];for(const q of v.switches)q.active=false;for(const p of d.platforms){p.y=p.v15BaseY;p.x=p.v15BaseX;p.v15Contact=0;}}
function activate(s){const v=s.levelData?.v15;if(!v)return null;const sw=v.switches.find(q=>Math.abs(q.x-s.player.x)<120);if(!sw)return null;sw.active=!sw.active;v.active=v.switches.some(q=>q.active);v.triggerCount++;v.events.push({type:'switch',x:sw.x,active:sw.active});return (sw.active?{en:'Mechanism activated',zh:'机关已启动',ms:'Mekanisme diaktifkan'}:{en:'Mechanism reset',zh:'机关已重置',ms:'Mekanisme ditetapkan semula'})[s.lang||'en'];}
function onRune(s,shrine){const v=s.levelData?.v15;if(!v)return;v.runeBoost=Math.min(15,v.runeBoost+7);v.triggerCount++;v.events.push({type:'learning',subject:shrine.subject});if(v.switches.length&&!v.active){v.switches[0].active=true;v.active=true;}}
function contact(s,p){const v=s.levelData?.v15;if(!v||!p)return false;
 if(['resonate','thermal','buoyant','starlift'].includes(p.v15Type)&&s.player.vy>=0){const force={resonate:-810,thermal:-775,buoyant:-750,starlift:-840}[p.v15Type];s.player.vy=force-(v.runeBoost>0?65:0)-(v.mode==='vertical'?85:0);s.player.grounded=false;v.triggerCount++;v.events.push({type:'spring',surface:p.v15Type});return true;}return false;}
function tick(s,dt){const d=s.levelData,v=d?.v15;if(!v)return;const p=s.player,time=s.elapsed||0;v.runeBoost=Math.max(0,v.runeBoost-dt);let motion=false;
 if(['sky','reef','ember'].includes(v.kind)){for(const z of v.sources)if(Math.abs(p.x-z.x)<170&&p.y+p.h>d.ground-270&&!p.grounded){p.vy=Math.max(-600,p.vy-({sky:440,reef:350,ember:390}[v.kind]+(v.runeBoost>0?180:0))*z.power*dt);motion=true;}}
 if(v.kind==='crystal'){for(const z of v.sources)if(Math.abs(p.x-z.x)<130&&!p.grounded){p.vx+=Math.sin(time*4+z.x)*88*dt;motion=true;}}
 if(v.kind==='ice'&&p.grounded){p.vx*=Math.pow(.995,dt*60);motion=true;}
 if(v.kind==='moon'&&v.active&&p.grounded){p.vx+=Math.sin(time*2.6)*32*dt;motion=true;}
 if(v.kind==='star'&&!p.grounded&&Math.sin(time*2.1+v.stage*.4)>.1){p.vy-=Math.min(380,170+(v.runeBoost>0?200:0))*dt;motion=true;}
 if(v.kind==='crown'&&!p.grounded&&v.active){p.vy-=Math.min(180,120+(v.runeBoost>0?60:0))*dt;motion=true;}
 // Distinct stage objectives alter live physics, rather than changing only scenery labels.
 if(v.mode==='crossing'&&!p.grounded){p.vx+=Math.sin(time*2.3+v.world)*90*dt;motion=true;}
 if(v.mode==='hazard'&&!p.grounded){p.vx+=Math.sin(time*3.4+v.world)*135*dt;motion=true;}
 if(v.mode==='mastery'&&!p.grounded&&v.runeBoost>0){p.vy-=175*dt;motion=true;}
 if(v.mode==='secret'&&!p.grounded&&v.runeBoost>0){p.vy-=110*dt;motion=true;}
 if(v.mode==='guardian'&&s.keys===4){v.bossPhase=s.bossHp>2?1:s.bossHp>1?2:3;}
 for(const q of d.platforms){const old=q.y,oldX=q.x;
  if(v.mode==='precision'&&q.v15Type){q.x=q.v15BaseX+Math.sin(time*1.65+q.v15Phase)*24;}
  if(v.mode==='moving'&&q.v15Type){q.x=q.v15BaseX+Math.sin(time*1.23+q.v15Phase)*29;}if(v.mode==='mechanism'&&v.active&&q.v15Type){q.y=q.v15BaseY+Math.sin(time*1.8+q.v15Phase)*19;}
  if(q.v15Type==='gear')q.y=q.v15BaseY+Math.sin(time*(v.active?1.75:.72)+q.v15Phase)*(v.active?37:14);
 if(q.v15Type==='cloud')q.y=q.v15BaseY+Math.sin(time*1.45+q.v15Phase)*11;
 if(q.v15Type==='buoyant')q.y=q.v15BaseY+Math.sin(time*1.5+q.v15Phase)*16;
 if(q.v15Type==='rune'&&v.active)q.y=q.v15BaseY+Math.sin(time*.92+q.v15Phase)*24;
 if(q.v15Type==='shadow'){const atop=p.grounded&&p.x>q.x&&p.x<q.x+q.w&&Math.abs(p.y+p.h-old)<11;q.v15Contact=Math.max(0,Math.min(1,q.v15Contact+dt*(atop?.8:-.6)));q.y=q.v15BaseY+q.v15Contact*(v.runeBoost>0?8:46);}
 if(p.grounded&&p.x>q.x&&p.x<q.x+q.w&&Math.abs(p.y+p.h-old)<12){p.y+=q.y-old;p.x+=q.x-oldX;}
 }if(motion)v.triggerCount++;
}
const api={scenes,titlesZh,titlesMs,settings,modes,decorateLevel,reset,activate,onRune,contact,tick};root.LeapWorldExpedition=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
