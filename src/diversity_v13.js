/* Learn & Leap v13 — reproducible level variety. No random global state, no save migration. */
(function(root){'use strict';
const moods=[
 {name:['Golden Dawn','金色黎明','Fajar Keemasan'],tone:'#ffdd9d',shade:.075,weather:'pollen'},
 {name:['Fern Glade','蕨叶幽谷','Lembah Pakis'],tone:'#90dfbc',shade:.065,weather:'spores'},
 {name:['Mistwalk','雾中小径','Laluan Kabus'],tone:'#c7e9e8',shade:.15,weather:'mist'},
 {name:['Sunlit Ruins','阳光遗迹','Runtuhan Cerah'],tone:'#ffd8a3',shade:.09,weather:'petals'},
 {name:['Firefly Hollow','萤火森林','Lembah Kelip-kelip'],tone:'#7b9cff',shade:.16,weather:'fireflies'},
 {name:['Rainfall Crossing','雨林之桥','Jambatan Hujan'],tone:'#7ca9bc',shade:.12,weather:'rain'},
 {name:['Ancient Roots','远古树根','Akar Purba'],tone:'#c5b6a2',shade:.115,weather:'spores'},
 {name:['Blooming Meadow','繁花草地','Padang Bunga'],tone:'#ffe1c1',shade:.08,weather:'petals'},
 {name:['Twilight Canopy','暮光树冠','Kanopi Senja'],tone:'#938abf',shade:.18,weather:'fireflies'},
 {name:["Guardian's Heart",'守护者之心','Jantung Penjaga'],tone:'#b4f9b2',shade:.09,weather:'magic'}];
const subjects=['math','english','science','general'];
const modes=['runes','compass','reveal','bridge'];
function stage(id){if(!Number.isInteger(id)||id<1||id>100)throw Error('Stage 1–100 required');const world=Math.floor((id-1)/10),index=(id-1)%10;return {id,world,index, ...moods[index], difficulty:Math.floor(index/3),title:moods[index].name};}
function enemyIndex(id,which){if(!Number.isInteger(which)||which<0)throw Error('Invalid enemy index');const {world,index}=stage(id);return (world*3+index*7+which*3)%10+1;}
function enemyPattern(id,which){return ['patrol','flutter','pounce','stagger','sentry'][(id*7+which*3)%5]}
function enemyOffset(id,which,elapsed,speed,phase){const a=elapsed*(.98+speed*.48)+phase*0.9;const pattern=enemyPattern(id,which);switch(pattern){case 'flutter':return Math.sin(a)*43+Math.sin(a*2.15)*26;case 'pounce':return Math.sin(a)*52+Math.sin(a*3.4)**5*30;case 'stagger':return Math.sin(a)*45+Math.sin(a*.5)*28;case 'sentry':return Math.sin(a*.55)*34;default:return Math.sin(a)*65}}
function challenge(id,subject,ordinal=0){if(!subjects.includes(subject))throw Error('Invalid subject');return modes[(id+ordinal)%modes.length]}
function label(mode,lang){const labels={runes:['Choose the correct rune','选择正确符文','Pilih rune yang betul'],compass:['Choose a compass direction','选择罗盘方向','Pilih arah kompas'],reveal:['Reveal the answer stones','揭开答案石板','Dedahkan batu jawapan'],bridge:['Restore the bridge: drag or tap the correct plank','修复桥梁：拖动或点击正确木板','Pulihkan jambatan: seret atau ketik papan yang betul']};return (labels[mode]||labels.runes)[({en:0,zh:1,ms:2})[lang]??0]}
const goals=['coins','enemies','healthy','flawless','speed'];
function objective(id){stage(id);const kind=goals[(id-1)%goals.length];return{kind,target:kind==='coins'?8:kind==='enemies'?2:kind==='healthy'?2:kind==='speed'?95:0}}
function goalMet(g,stats){switch(g.kind){case 'coins':return stats.coins>=g.target;case 'enemies':return stats.enemiesDefeated>=g.target;case 'healthy':return stats.hearts>=g.target;case 'flawless':return stats.wrong===0&&stats.keys===4;case 'speed':return stats.elapsed<=g.target;default:return false}}
function goalText(g,lang,stats){const l=({en:0,zh:1,ms:2})[lang]??0;
 const labels={coins:[`Collect ${g.target} coins (${stats.coins}/${g.target})`,`收集${g.target}枚金币 (${stats.coins}/${g.target})`,`Kutip ${g.target} syiling (${stats.coins}/${g.target})`],enemies:[`Defeat ${g.target} enemies (${stats.enemiesDefeated}/${g.target})`,`击败${g.target}个敌人 (${stats.enemiesDefeated}/${g.target})`,`Kalahkan ${g.target} musuh (${stats.enemiesDefeated}/${g.target})`],healthy:[`Finish with ${g.target}+ hearts`,`至少剩${g.target}颗爱心通关`,`Tamatkan dengan ${g.target}+ hati`],flawless:['Solve every shrine without a wrong answer','四道题全部答对，不出错','Jawab semua kuil tanpa kesilapan'],speed:[`Finish in ${g.target}s of movement`,`移动时间${g.target}秒内通关`,`Selesai dalam ${g.target}s bergerak`]};return labels[g.kind][l]}
const api={moods,modes,stage,enemyIndex,enemyPattern,enemyOffset,challenge,label,objective,goalMet,goalText};root.LeapDiversity=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
