(function(){'use strict';
const $=id=>document.getElementById(id),canvas=$('world');
const W=1280,H=720,C=window.LearnCurriculum,L=window.LeapLevels,WorldOne=window.LeapWorldOne,Expedition=window.LeapWorldExpedition,V=window.LeapDiversity||{enemyOffset:(id,i,t,s,p)=>Math.sin(t*(1.25+s*.8)+p)*65,challenge:()=> 'runes',label:()=>'',objective:()=>({kind:'coins',target:10}),goalMet:(g,stats)=>stats.coins>=10,goalText:()=>''};
const Feel=window.LeapAdventureFeel||null;
const Sfx=window.LeapAudioAAA||null;
const STR={
 en:{eyebrow:'FANTASY LEARNING ADVENTURE',tag:'Leap across ten enchanted realms, awaken ancient shrines, and master every challenge.',start:'Begin Adventure',levels:'World Map',age:'Player Age',lang:'Language',play:'Play chapter',continue:'Continue',back:'Back',pause:'Adventure Paused',resume:'Resume Journey',restart:'Restart Chapter',menu:'Main Menu',shrine:'Press E / ✧ to awaken shrine',gate:'Find all four rune keys to open the gate',boss:'Guardian · cast ✦ after awakening all four runes',answer:'Correct! Rune awakened · +2 magic',wrong:'Not quite. Try again!',hint:'Show hint',close:'Return to adventure',done:'Chapter Complete',next:'Next Chapter',win:'The realm remembers your courage and wisdom.',demo:'100 playable chapters · 10 distinct worlds',locked:'Choose any world and chapter. Stars save by age group.',checkpoint:'Checkpoint Awakened',power:'Need magic? Solve a shrine!',hurt:'Ari needs a moment to recover',finish:'All four runes restored! The gate awakens!',guardian:'World Guardian',guide:'Move · Double Jump · Dash · Solve',bossDemo:'Guardian demo',ageInfo:'Questions adapt to age. Progress saves automatically.',key:'Runes',death:'The realm grants you another leap',retry:'Try Again',chapter:'CHAPTER',learning:'Rune of',exit:'Guardian defeated! The gate opens!',cast:'Cast ✦ near the guardian',settings:'Settings',time:'Time',streak:'Best Streak',coinsLbl:'Coins',soundOn:'Sound On',soundOff:'Sound Off'},
 zh:{eyebrow:'原创奇幻学习冒险',tag:'跨越十大奇幻王国，唤醒远古符文圣坛，迎接每一次智慧挑战。',start:'开始冒险',levels:'世界地图',age:'玩家年龄',lang:'语言',play:'进入章节',continue:'继续',back:'返回',pause:'冒险暂停',resume:'继续冒险',restart:'重新开始',menu:'主菜单',shrine:'按 E / ✧ 唤醒圣坛',gate:'收集四把符文钥匙，开启出口',boss:'守护者 · 点亮四个符文后使用✦魔法',answer:'答对了！符文已唤醒 · +2魔法',wrong:'还差一点，再试一次！',hint:'显示提示',close:'返回冒险',done:'章节完成',next:'下一章节',win:'这个世界记住了你的勇气与智慧。',demo:'100个可玩关卡 · 10个奇幻世界',locked:'自由选择任何关卡，每个年龄组分别保存星星。',checkpoint:'检查点已激活',power:'魔法不足？去完成圣坛挑战！',hurt:'阿里需要一点时间恢复',finish:'四座符文全部恢复！出口已开启！',guardian:'世界守护者',guide:'奔跑 · 二段跳 · 冲刺 · 解谜',bossDemo:'守护者试玩',ageInfo:'题目随年龄调整，进度自动保存在此设备。',key:'符文',death:'森林愿意再给你一次机会',retry:'重试',chapter:'章节',learning:'符文：',exit:'守护者已被击败！出口已打开！',cast:'靠近守护者释放✦魔法',settings:'设置',time:'耗时',streak:'最高连击',coinsLbl:'金币',soundOn:'音效开',soundOff:'音效关'},
 ms:{eyebrow:'PENGEMBARAAN PEMBELAJARAN FANTASI',tag:'Lompat merentasi sepuluh alam ajaib, aktifkan kuil purba dan kuasai setiap cabaran.',start:'Mula Pengembaraan',levels:'Peta Dunia',age:'Umur Pemain',lang:'Bahasa',play:'Main bab',continue:'Sambung',back:'Kembali',pause:'Pengembaraan Dijeda',resume:'Sambung Perjalanan',restart:'Mula Semula Bab',menu:'Menu Utama',shrine:'Tekan E / ✧ untuk aktifkan kuil',gate:'Cari empat kunci rune untuk membuka pintu',boss:'Penjaga · guna ✦ selepas aktifkan empat rune',answer:'Betul! Rune diaktifkan · +2 kuasa',wrong:'Belum tepat. Cuba lagi!',hint:'Tunjuk petunjuk',close:'Kembali bermain',done:'Bab Selesai',next:'Bab Seterusnya',win:'Alam ini mengingati keberanian dan kebijaksanaan anda.',demo:'100 tahap boleh dimainkan · 10 dunia unik',locked:'Pilih mana-mana dunia dan tahap. Bintang disimpan mengikut umur.',checkpoint:'Pusat Semak Diaktifkan',power:'Perlukan kuasa? Selesaikan kuil!',hurt:'Ari perlu pulih sebentar',finish:'Keempat-empat rune dipulihkan! Pintu dibuka!',guardian:'Penjaga Dunia',guide:'Lari · Lompat Berganda · Laju · Jawab',bossDemo:'Demo penjaga',ageInfo:'Soalan mengikut umur. Kemajuan disimpan secara automatik.',key:'Rune',death:'Alam memberi anda peluang lagi',retry:'Cuba Lagi',chapter:'BAB',learning:'Rune',exit:'Penjaga tewas! Pintu kini terbuka!',cast:'Guna ✦ dekat penjaga',settings:'Tetapan',time:'Masa',streak:'Kombo Terbaik',coinsLbl:'Syiling',soundOn:'Bunyi Hidup',soundOff:'Bunyi Mati'}};
for(const [lang,add] of Object.entries({
 en:{world:'WORLD',allWorlds:'World Map',worldSelect:'Explore the Ten Realms',completed:'Completed',stars:'Stars',first:'First level',final:'All 100 Chapters Complete!',nextWorld:'Next world',bossTitle:'GUARDIAN BATTLE',worldTag:'100 handcrafted chapters across 10 enchanted worlds',worldTip:'All chapters are open to explore. Earn up to 3 stars per chapter.',bonus:'Combo bonus! +1 Magic',progress:'Your progress'},
 zh:{world:'世界',allWorlds:'世界地图',worldSelect:'探索十大奇幻世界',completed:'已完成',stars:'星星',first:'第一关',final:'恭喜！100关全部完成！',nextWorld:'下一个世界',bossTitle:'守护者之战',worldTag:'100个可玩关卡 · 10大奇幻王国',worldTip:'所有关卡均可自由探索，每关最多可获得3颗星。',bonus:'连击奖励！+1 魔法',progress:'游戏进度'},
 ms:{world:'DUNIA',allWorlds:'Peta Dunia',worldSelect:'Terokai Sepuluh Alam',completed:'Selesai',stars:'Bintang',first:'Tahap pertama',final:'Tahniah! Semua 100 tahap selesai!',nextWorld:'Dunia seterusnya',bossTitle:'PERTARUNGAN PENJAGA',worldTag:'100 tahap merentasi 10 alam fantasi',worldTip:'Semua tahap terbuka untuk diterokai. Kumpul 3 bintang setiap bab.',bonus:'Bonus kombo! +1 Kuasa',progress:'Kemajuan anda'}
}))Object.assign(STR[lang],add);
const subjectSymbol={math:'∑',english:'Aa',science:'⚗',general:'✧'},subjectColor={math:'#f4c46c',english:'#b4a8ff',science:'#8ce8b2',general:'#91d8ff'};
const state={scene:'title',lang:'en',age:'10-12',sound:true,level:1,selectedWorld:0,progress:{},lastLevels:{},coins:0,energy:0,keys:0,hearts:3,checkpoint:110,attempts:{},bossHp:3,elapsed:0,camera:0,player:{x:120,y:450,vx:0,vy:0,w:38,h:62,grounded:false,face:1,inv:0,run:0,land:0,cast:0,hurt:0},projectiles:[],particles:[],enemies:[],shrineActive:null,levelData:null,last:0,flash:0,shake:0,bossClock:0,bossPulse:0,bossHurt:0,bossDefeat:0,gateNotice:0,near:null,toastTimer:0,enemiesDefeated:0,wrongAnswers:0,feel:Feel?Feel.createFeelState():null,runSnapshot:null};
const keys={left:false,right:false,jump:false,attack:false,interact:false,dash:false};
function txt(k){return STR[state.lang][k]||STR.en[k]||k}function tr(a){return C.local(a,state.lang)}
function setBodyState(s){if(typeof document!=='undefined'&&document.body&&document.body.dataset)document.body.dataset.state=s}
function save(){try{localStorage.setItem('learn-leap-v2-full',JSON.stringify({age:state.age,lang:state.lang,sound:state.sound,progress:state.progress,lastLevels:state.lastLevels}))}catch{}}
try{const s=JSON.parse(localStorage.getItem('learn-leap-v2-full')||localStorage.getItem('learn-leap-v2-slice')||'null');if(s){if(C.AGE.includes(s.age))state.age=s.age;if(['en','zh','ms'].includes(s.lang))state.lang=s.lang;if(typeof s.sound==='boolean')state.sound=s.sound;state.progress=s.progress||{};state.lastLevels=s.lastLevels||{}}}catch{}
if(Sfx)Sfx.setEnabled(state.sound);
function stageComplete(id){return Number(state.progress[state.age]?.[id])>0}function stageStars(id){const v=state.progress[state.age]?.[id];return v===true?1:(Number(v)||0)}function markComplete(id){state.progress[state.age]??={};const stars=1+(state.hearts>=2?1:0)+(V.goalMet(V.objective(id),{coins:state.coins,enemiesDefeated:state.enemiesDefeated,hearts:state.hearts,wrong:state.wrongAnswers,keys:state.keys,elapsed:state.elapsed})?1:0);state.progress[state.age][id]=Math.max(stageStars(id),stars);state.lastLevels[state.age]=Math.min(100,id+1);save()}
function rand(a,b){return a+Math.random()*(b-a)}function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function toast(message){const el=$('toast');if(!el)return;el.textContent=message;el.classList.add('show');state.toastTimer=2.8}
function audio(freq=540,duration=.08,type='sine'){if(!state.sound)return;try{const A=window.AudioContext||window.webkitAudioContext;const ac=audio.ctx||(audio.ctx=new A);if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(freq,ac.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(80,freq*.65),ac.currentTime+duration);g.gain.setValueAtTime(.065,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+duration)}catch{}}
function worldName(id){return tr(L.worlds[id].name)}
function worldLabel(){return `${txt('world')} ${String(Math.floor((state.level-1)/10+1)).padStart(2,'0')} · ${worldName(Math.floor((state.level-1)/10))}`}
function formatTime(sec){const s=Math.max(0,Math.round(sec));const m=Math.floor(s/60);return `${m}:${String(s%60).padStart(2,'0')}`}

function titleCrestSVG(){
 return `<svg class="title-crest" viewBox="0 0 420 128" role="img" aria-label="Learn and Leap">
  <defs>
   <linearGradient id="goldTitle" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fffbe4"/>
    <stop offset="48%" stop-color="#f7da8b"/>
    <stop offset="100%" stop-color="#c99546"/>
   </linearGradient>
   <linearGradient id="emeraldStar" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#d8ffe6"/>
    <stop offset="100%" stop-color="#53c994"/>
   </linearGradient>
  </defs>
  <g transform="translate(0, 6)">
   <path d="M12 20H118" stroke="#f2cf84" stroke-width="1.2" opacity="0.55"/>
   <path d="M164 20H270" stroke="#f2cf84" stroke-width="1.2" opacity="0.55"/>
   <path d="M141 6L145 16L155 20L145 24L141 34L137 24L127 20L137 16L141 6Z" fill="url(#emeraldStar)" stroke="#123029" stroke-width="1.4"/>
   <circle cx="141" cy="20" r="2.6" fill="#fffdf0"/>
   <text x="6" y="78" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="54" letter-spacing="2" fill="#0b2029" dx="0" dy="4">LEARN &amp; LEAP</text>
   <text x="6" y="78" font-family="'Cinzel', Georgia, serif" font-weight="900" font-size="54" letter-spacing="2" fill="url(#goldTitle)" stroke="#2c2416" stroke-width="1.2" paint-order="stroke fill">LEARN &amp; LEAP</text>
   <path d="M8 94L280 94" stroke="#f3d48c" stroke-width="1.5" opacity="0.65"/>
   <polygon points="286,94 294,89 302,94 294,99" fill="#f7da8b"/>
  </g>
 </svg>`;
}

function menuHTML(){
 const done=Object.keys(state.progress[state.age]||{}).filter(k=>stageComplete(+k)).length;
 const totalStars=Object.keys(state.progress[state.age]||{}).reduce((sum,k)=>sum+stageStars(+k),0);
 const nextLvl=state.lastLevels[state.age]||1;
 const startLabel=done>0?`${txt('continue')} · Ch. ${String(nextLvl).padStart(2,'0')}`:txt('start');
 return `<div class="screen-inner title-layout">
  <p class="eyebrow">${txt('eyebrow')}</p>
  ${titleCrestSVG()}
  <p class="subtitle">${txt('tag')}</p>
  <div class="button-row title-actions">
   <button class="button-primary" data-action="start" data-start="true"><span>${startLabel}</span><span aria-hidden="true">→</span></button>
   <button class="button-secondary" data-action="chapters">${txt('levels')}</button>
   <button class="button-secondary sound-btn" data-action="sound" aria-label="Toggle Sound">${state.sound?txt('soundOn'):txt('soundOff')}</button>
  </div>
  <div class="setup">
   <label><span>${txt('age')}</span><select id="ageSelect">${C.AGE.map(x=>`<option value="${x}" ${x===state.age?'selected':''}>${x}</option>`).join('')}</select></label>
   <label><span>${txt('lang')}</span><select id="langSelect"><option value="en" ${state.lang==='en'?'selected':''}>English</option><option value="zh" ${state.lang==='zh'?'selected':''}>中文</option><option value="ms" ${state.lang==='ms'?'selected':''}>Bahasa Melayu</option></select></label>
  </div>
  <p class="title-meta">${done}/100 ${txt('completed')} · ${totalStars}/300 ${txt('stars')} · ${txt('ageInfo')}</p>
  <p class="title-hint-bar">← → Move · Space Double Jump · Shift Dash · E Shrine · J Magic</p>
 </div>`;
}

function chaptersHTML(){
 const w=L.worlds[state.selectedWorld],first=state.selectedWorld*10+1,done=Object.keys(state.progress[state.age]||{}).filter(k=>stageComplete(+k)).length;
 const worldStars=Array.from({length:10},(_,i)=>stageStars(first+i)).reduce((a,b)=>a+b,0);
 return `<div class="screen-inner world-map">
  <div class="world-map-head">
   <div>
    <p class="eyebrow">${txt('allWorlds')} · ${done}/100 ${txt('completed')}</p>
    <h2 class="screen-title">${txt('worldSelect')}</h2>
   </div>
   <div class="button-row compact-row">
    <button class="button-secondary" data-action="worldPrev" aria-label="Previous World">◀</button>
    <button class="button-secondary" data-action="worldNext" aria-label="Next World">▶</button>
    <button class="button-secondary" data-action="title">← ${txt('back')}</button>
   </div>
  </div>
  <div class="world-tabs">${L.worlds.map((v,i)=>`<button data-world="${i}" class="world-tab ${i===state.selectedWorld?'active':''}" title="${tr(v.name)}"><span>${v.symbol}</span><small>${String(i+1).padStart(2,'0')}</small></button>`).join('')}</div>
  <p class="world-heading" style="--world-accent:${w.light}">${w.symbol} ${String(state.selectedWorld+1).padStart(2,'0')} · ${tr(w.name)} <small>${txt('stars')} ${worldStars}/30 · ♛ ${tr(w.boss)}</small></p>
  <div class="level-choices">${L.levels.slice(first-1,first+9).map(l=>`<button class="level-choice ${l.boss?'boss-level':''}" data-level="${l.id}" title="${tr(l.title)}"><strong>${String(l.id).padStart(2,'0')} ${l.boss?'♛':''}</strong><small>${tr(l.title)}</small><span class="level-stars">${'★'.repeat(stageStars(l.id))}${'☆'.repeat(3-stageStars(l.id))}</span></button>`).join('')}</div>
  <p class="small-tag">${txt('worldTip')}</p>
 </div>`;
}

function pauseHTML(){
 const perfLabel=renderer3d?.perfMode?'Smooth 60FPS':'High Quality';
 return `<div class="screen-inner status-modal">
  <p class="eyebrow">${worldLabel()}</p>
  <h2 class="screen-title">${txt('pause')}</h2>
  <p class="screen-copy">${tr(state.levelData.title)}</p>
  <div class="stat-strip">
   <div class="stat-tile"><strong>${state.keys}/4</strong><span>${txt('key')}</span></div>
   <div class="stat-tile"><strong>${state.coins}</strong><span>${txt('coinsLbl')}</span></div>
   <div class="stat-tile"><strong>${formatTime(state.elapsed)}</strong><span>${txt('time')}</span></div>
  </div>
  <div class="button-row">
   <button class="button-primary" data-action="resume" data-start="true">${txt('resume')} →</button>
   <button class="button-secondary" data-action="restart">${txt('restart')}</button>
   <button class="button-secondary" data-action="chapters">${txt('levels')}</button>
   <button class="button-secondary" data-action="title">${txt('menu')}</button>
   <button class="button-secondary" data-action="sound">${state.sound?txt('soundOn'):txt('soundOff')}</button>
   <button class="button-secondary" data-action="perf">${perfLabel}</button>
  </div>
 </div>`;
}

function winHTML(){
 const snap=state.runSnapshot||{level:state.level,coins:state.coins,keys:state.keys,elapsed:state.elapsed,stars:stageStars(state.level),maxCombo:state.feel?.maxComboReached||0};
 const next=Math.min(100,snap.level+1);
 return `<div class="screen-inner status-modal victory-modal">
  <p class="eyebrow">${worldLabel()} · ${String(snap.level).padStart(2,'0')}</p>
  <div class="victory-stars" aria-label="${snap.stars} out of 3 stars">${'★'.repeat(snap.stars)}${'☆'.repeat(3-snap.stars)}</div>
  <h2 class="screen-title">${snap.level===100?txt('final'):txt('done')}</h2>
  <p class="screen-copy">${txt('win')}</p>
  <div class="stat-strip">
   <div class="stat-tile"><strong>${formatTime(snap.elapsed)}</strong><span>${txt('time')}</span></div>
   <div class="stat-tile"><strong>${snap.coins}</strong><span>${txt('coinsLbl')}</span></div>
   <div class="stat-tile"><strong>×${Math.max(1,snap.maxCombo)}</strong><span>${txt('streak')}</span></div>
  </div>
  <div class="button-row">
   ${snap.level<100?`<button class="button-primary" data-action="next" data-next="${next}" data-start="true">${txt('next')} →</button>`:`<button class="button-primary" data-action="restart" data-start="true">${txt('restart')}</button>`}
   <button class="button-secondary" data-action="chapters">${txt('allWorlds')}</button>
   <button class="button-secondary" data-action="title">${txt('menu')}</button>
  </div>
 </div>`;
}

function deadHTML(){
 const snap=state.runSnapshot||{keys:state.keys,coins:state.coins,elapsed:state.elapsed};
 return `<div class="screen-inner status-modal defeat-modal">
  <p class="eyebrow">${worldLabel()}</p>
  <h2 class="screen-title">${txt('death')}</h2>
  <div class="stat-strip">
   <div class="stat-tile"><strong>${snap.keys}/4</strong><span>${txt('key')}</span></div>
   <div class="stat-tile"><strong>${snap.coins}</strong><span>${txt('coinsLbl')}</span></div>
   <div class="stat-tile"><strong>${formatTime(snap.elapsed)}</strong><span>${txt('time')}</span></div>
  </div>
  <div class="button-row">
   <button class="button-primary" data-action="restart" data-start="true">${txt('retry')} →</button>
   <button class="button-secondary" data-action="chapters">${txt('allWorlds')}</button>
   <button class="button-secondary" data-action="title">${txt('menu')}</button>
  </div>
 </div>`;
}

function syncSoundButton(){
 const btn=$('soundHudBtn');
 if(!btn)return;
 btn.classList?.toggle?.('muted-btn',!state.sound);
 btn.setAttribute?.('aria-pressed',String(state.sound));
 const wave=$('soundWavePath');
 if(wave&&wave.style)wave.style.opacity=state.sound?'1':'0.2';
}

function showScreen(scene){
 state.scene=scene;
 setBodyState(scene==='title'||scene==='chapters'?'title':scene==='pause'?'paused':'gameover');
 if(['title','chapters'].includes(scene)&&typeof renderer3d!=='undefined'){renderer3d.setStage(L.make(state.selectedWorld*10+1))}
 $('screen').hidden=false;$('hud').hidden=true;$('touchControls').hidden=true;$('hint').hidden=true;$('question').hidden=true;
 const mt=$('missionTag');if(mt)mt.hidden=true;
 const body=scene==='title'?menuHTML():scene==='chapters'?chaptersHTML():scene==='pause'?pauseHTML():scene==='win'?winHTML():deadHTML();
 $('screenBody').innerHTML=body;
 $('screen').querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{
  b.blur?.();
  const a=b.dataset.action;
  if(a==='title')showScreen('title');
  else if(a==='chapters')showScreen('chapters');
  else if(a==='start')startLevel(state.lastLevels[state.age]||1);
  else if(a==='restart')startLevel(state.level);
  else if(a==='next')startLevel(+b.dataset.next);
  else if(a==='resume')resume();
  else if(a==='worldPrev'){state.selectedWorld=(state.selectedWorld+9)%10;showScreen('chapters')}
  else if(a==='worldNext'){state.selectedWorld=(state.selectedWorld+1)%10;showScreen('chapters')}
  else if(a==='sound'){toggleSound();showScreen(scene)}
  else if(a==='perf'){if(typeof renderer3d!=='undefined'&&renderer3d.togglePerfMode){renderer3d.togglePerfMode()}showScreen(scene)}
 }));
 $('screen').querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>{b.blur?.();startLevel(+b.dataset.level)}));
 $('screen').querySelectorAll('[data-world]').forEach(b=>b.addEventListener('click',()=>{state.selectedWorld=+b.dataset.world;showScreen('chapters')}));
 if($('ageSelect'))$('ageSelect').addEventListener('change',e=>{state.age=e.target.value;save();showScreen('title')});
 if($('langSelect'))$('langSelect').addEventListener('change',e=>{state.lang=e.target.value;save();showScreen('title')});
}

function toggleSound(){
 state.sound=!state.sound;
 if(Sfx)Sfx.setEnabled(state.sound);
 save();
 syncSoundButton();
}

function resetKeys(){for(const k in keys)keys[k]=false}

function startLevel(id){
 const data=L.make(id);state.level=id;state.selectedWorld=data.world;state.lastLevels[state.age]=id;save();state.levelData=data;renderer3d.setStage(data);
 state.scene='play';setBodyState('playing');
 state.elapsed=0;state.coins=0;state.enemiesDefeated=0;state.wrongAnswers=0;state.energy=0;state.keys=0;state.hearts=3;state.checkpoint=110;state.camera=0;state.bossHp=data.boss?3+Math.floor(data.world/3):0;state.bossClock=0;state.bossPulse=0;state.bossHurt=0;state.bossDefeat=0;state.shake=0;state.flash=0;state.near=null;state.attempts={};state.projectiles=[];state.particles=[];state.runSnapshot=null;
 if(WorldOne)WorldOne.reset(data);if(Expedition)Expedition.reset(data);
 if(Feel&&state.feel){
  Feel.resetFeelState(state.feel,{
   world:`${txt('world')} ${String(data.world+1).padStart(2,'0')} · ${worldName(data.world)}`,
   title:tr(data.title),
   subtitle:(data.v14||data.v15)?tr(data.subtitle):''
  });
 }
 state.player={x:120,y:450,vx:0,vy:0,w:38,h:62,grounded:false,face:1,inv:0,run:0,land:0,cast:0,hurt:0};
 data.shrines.forEach(s=>s.done=false);
 data.enemies.forEach(e=>{e.alive=true;e.base=e.x;e.dir=1;e.phase=Math.random()*6});
 data.coins=data.coins.map(x=>({x,y:440+Math.sin(x*.01)*35,got:false}));
 $('screen').hidden=true;$('question').hidden=true;$('hud').hidden=false;$('touchControls').hidden=false;$('hint').hidden=true;
 const mt=$('missionTag');if(mt)mt.hidden=false;
 if(typeof document!=='undefined'&&document.activeElement?.blur)document.activeElement.blur();
 resetKeys();syncSoundButton();updateHUD();canvas.focus({preventScroll:true});
}

function resume(){
 state.scene='play';setBodyState('playing');
 $('screen').hidden=true;$('hud').hidden=false;$('touchControls').hidden=false;
 const mt=$('missionTag');if(mt)mt.hidden=false;
 resetKeys();syncSoundButton();canvas.focus({preventScroll:true});
}

function pause(){if(state.scene==='play')showScreen('pause');else if(state.scene==='pause')resume()}

function updateHUD(){
 const hEl=$('hearts');
 if(hEl){
  const full=Math.max(0,state.hearts),empty=3-full;
  hEl.innerHTML=`${'<span class="heart-full">♥</span>'.repeat(full)}${'<span class="heart-empty">♡</span>'.repeat(empty)}`;
 }
 $('coins').textContent=state.coins;
 $('energy').textContent=state.energy;
 const kEl=$('keys');
 if(kEl){
  kEl.innerHTML=`${'<span class="rune-lit">✦</span>'.repeat(state.keys)}${'<span class="rune-slot">◇</span>'.repeat(4-state.keys)}`;
 }
 $('hudLevel').textContent=`${worldLabel()} · ${String(state.level).padStart(2,'0')}`;
 const task=$('missionTag');
 if(task)task.textContent=V.goalText(V.objective(state.level),state.lang,{coins:state.coins,enemiesDefeated:state.enemiesDefeated,hearts:state.hearts,wrong:state.wrongAnswers,keys:state.keys,elapsed:state.elapsed});
}

function ask(shrine){
 if(state.scene!=='play'||shrine.done)return;state.scene='question';state.shrineActive=shrine;
 const attempt=state.attempts[shrine.subject]||0;
 const q=C.makeQuestion({age:state.age,subject:shrine.subject,level:state.level,slot:Math.round(shrine.x/100),attempt,lang:state.lang});state.question=q;
 const mode=V.challenge(state.level,shrine.subject,state.levelData.shrines.indexOf(shrine));
 const card=$('question').querySelector?.('.question-card');if(card)card.dataset.mode=mode;
 $('question').hidden=false;$('touchControls').hidden=true;
 $('questionSubject').textContent=`${subjectSymbol[shrine.subject]} ${tr(C.SUBJECT_LABELS[shrine.subject])}`;
 $('questionTitle').textContent=q.prompt;$('feedback').textContent='';$('hintBtn').textContent='✧ '+txt('hint');$('closeQuestion').textContent=txt('close');
 const instruction=$('challengeInstruction');if(instruction)instruction.textContent=V.label(mode,state.lang);
 const area=$('answers');area.innerHTML='';const stale=document.getElementById('bridgeTarget');if(stale)stale.remove?.();
 if(mode==='bridge'){
  const target=document.createElement('div');target.className='bridge-target';target.id='bridgeTarget';target.textContent=state.lang==='zh'?'⇣ 把正确的木板放在这里':state.lang==='ms'?'⇣ Seret papan yang betul ke sini':'⇣ Drop the correct plank here';target.setAttribute('role','group');target.setAttribute('aria-label','Bridge repair answer target');
  const clickOption=(i)=>answer(i,area.querySelectorAll('button.answer')[i]);
  target.addEventListener('dragover',e=>e.preventDefault());target.addEventListener('drop',e=>{e.preventDefault();const i=Number(e.dataTransfer.getData('text/plain'));if(Number.isInteger(i)&&i>=0&&i<4)clickOption(i)});
  q.options.forEach((opt,i)=>{const b=document.createElement('button');b.className='answer plank';b.draggable=true;b.textContent='▰ '+opt;b.dataset.option=String(i);b.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',String(i)));b.addEventListener('click',()=>clickOption(i));area.appendChild(b)});
  if(area.after)area.after(target);
 } else {
  q.options.forEach((opt,i)=>{const b=document.createElement('button');b.className='answer'+(mode==='compass'?' compass-answer':mode==='reveal'?' reveal-answer':'');
   if(mode==='compass'){const directions=['↑','→','↓','←'];b.textContent=directions[i]+'  '+opt}
   else if(mode==='reveal'){b.dataset.revealed='false';b.textContent='✦  '+String(i+1);b.setAttribute('aria-label',`Reveal choice ${i+1}`)}
   else b.textContent='◈  '+opt;
   b.addEventListener('click',()=>{if(mode==='reveal'&&b.dataset.revealed!=='true'){b.dataset.revealed='true';b.textContent=opt;b.setAttribute('aria-label',opt);return}answer(i,b)});
   area.appendChild(b)});
 }
 resetKeys();
}

function answer(i,button){
 if(state.scene!=='question')return;
 if(i===state.question.correct){
  button.classList.add('correct');state.shrineActive.done=true;state.keys++;state.energy+=2;
  if(WorldOne)WorldOne.onRune(state,state.shrineActive);
  if(Expedition)Expedition.onRune(state,state.shrineActive);
  state.scene='answering';$('feedback').textContent=txt('answer');
  if(Sfx)Sfx.playRuneAwaken(); else audio(900,.24);
  spark(state.shrineActive.x,480,30,'#ffe79e');
  if(Feel&&state.feel){
   Feel.pushShockwave(state.feel,state.shrineActive.x,490,'#ffe696',140,.46);
   Feel.pushCallout(state.feel,state.shrineActive.x,430,'RUNE AWAKENED +2 ✦','#fff2a8',1.2);
   Feel.triggerVignette(state.feel,'140, 245, 195',.35);
   Feel.addTrauma(state.feel,.38);
  }
  updateHUD();
  setTimeout(()=>{
   if(state.scene!=='answering')return;
   $('question').hidden=true;$('touchControls').hidden=false;state.scene='play';
   if(state.keys===4){
    toast(txt('finish'));
    if(Feel&&state.feel)Feel.triggerVignette(state.feel,'120, 255, 220',.42);
   }
  },800);
 }else{
  button.classList.add('wrong');state.wrongAnswers++;$('feedback').textContent=txt('wrong');
  if(Sfx)Sfx.playWrong(); else audio(240,.15,'triangle');
  state.attempts[state.shrineActive.subject]=(state.attempts[state.shrineActive.subject]||0)+1;
  button.disabled=true;
  const opts=[...$('answers').children];
  if(opts.every((x,j)=>j===state.question.correct||x.disabled)){setTimeout(()=>{if(state.scene==='question')askAgain()},600)}
 }
}

function askAgain(){state.scene='play';$('question').hidden=true;ask(state.shrineActive)}
$('hintBtn').onclick=()=>{if(state.question)$('feedback').textContent=state.question.hint};
$('closeQuestion').onclick=()=>{if(state.scene==='question'){state.scene='play';$('question').hidden=true;$('touchControls').hidden=false;resetKeys()}};
$('pauseBtn').onclick=()=>{const b=$('pauseBtn');b?.blur?.();pause()};
const soundHud=$('soundHudBtn');if(soundHud)soundHud.onclick=()=>{soundHud.blur?.();toggleSound()};

function spark(x,y,count,color){for(let i=0;i<count;i++)state.particles.push({x,y,vx:rand(-210,210),vy:rand(-270,-50),life:rand(.3,.95),size:rand(2.2,6.2),color})}

function hurt(){
 const p=state.player;if(p.inv>0)return;
 state.hearts--;p.inv=1.7;p.vy=-360;p.vx=-p.face*230;p.hurt=.25;state.shake=12;state.flash=.45;
 if(Feel&&state.feel){
  Feel.addTrauma(state.feel,.72);
  Feel.triggerHitstop(state.feel,true);
  Feel.triggerVignette(state.feel,'225, 58, 62',.58);
  Feel.pushCallout(state.feel,p.x,p.y-10,'-1 ♥','#ff9c94',1.05);
 }
 if(Sfx)Sfx.playHurt(); else audio(140,.2,'sawtooth');
 updateHUD();
 if(state.hearts<=0){
  state.runSnapshot={level:state.level,keys:state.keys,coins:state.coins,elapsed:state.elapsed};
  showScreen('dead');
 }else toast(txt('hurt'));
}

function doJump(){
 const p=state.player;
 if(Feel&&state.feel){
  Feel.queueJump(state.feel);
  const res=Feel.consumeJump(state.feel,p);
  if(res==='ground'){
   spark(p.x,p.y+p.h,9,'#c4f2b8');
   if(Sfx)Sfx.playJump(false); else audio(480,.11);
  }else if(res==='double'){
   spark(p.x,p.y+p.h-8,14,'#a4f9e4');
   Feel.pushShockwave(state.feel,p.x,p.y+p.h-6,'#b6ffe8',56,.26);
   if(Sfx)Sfx.playJump(true); else audio(640,.13);
  }
  return;
 }
 if(p.grounded){p.vy=-685;p.grounded=false;p.land=0;spark(p.x,p.y+p.h,7,'#c4e7b4');audio(480,.11)}
}

function doDash(){
 if(state.scene!=='play'||!Feel||!state.feel)return;
 const dir=(keys.right?1:0)-(keys.left?1:0);
 if(Feel.triggerDash(state.feel,state.player,dir)){
  spark(state.player.x,state.player.y+state.player.h*.5,14,'#9ff8ef');
  Feel.pushShockwave(state.feel,state.player.x,state.player.y+state.player.h*.5,'#9df7eb',62,.24);
  Feel.addTrauma(state.feel,.22);
  if(Sfx)Sfx.playDash();
 }
}

function interact(){
 if(state.scene!=='play')return;
 const p=state.player,shr=state.levelData.shrines.find(s=>!s.done&&Math.abs(s.x-p.x)<125);
 if(shr)ask(shr);
 else if(WorldOne&&state.levelData.v14){
  const result=WorldOne.activate(state);
  if(result){toast(tr(state.levelData.subtitle));if(Sfx)Sfx.playCheckpoint();}
  else if(Math.abs(p.x-(state.levelData.length-165))<165){if(state.keys<4)toast(txt('gate'));else if(state.levelData.boss&&state.bossHp>0)toast(txt('boss'));else finish()}
 }else if(Expedition&&state.levelData.v15){
  const result=Expedition.activate(state);
  if(result){toast(result);if(Sfx)Sfx.playCheckpoint();}
  else if(Math.abs(p.x-(state.levelData.length-165))<165){if(state.keys<4)toast(txt('gate'));else if(state.levelData.boss&&state.bossHp>0)toast(txt('boss'));else finish()}
 }else if(Math.abs(p.x-(state.levelData.length-165))<165){
  if(state.keys<4)toast(txt('gate'));else if(state.levelData.boss&&state.bossHp>0)toast(txt('boss'));else finish()
 }
}

function cast(){
 if(state.scene!=='play')return;
 if(state.energy<1){toast(txt('power'));return}
 const p=state.player;p.cast=.28;state.energy--;
 state.projectiles.push({x:p.x+p.face*28,y:p.y+25,vx:p.face*880,life:1.25});
 spark(p.x+p.face*32,p.y+28,10,'#9ff9d0');
 if(Feel&&state.feel){
  Feel.pushShockwave(state.feel,p.x+p.face*30,p.y+26,'#a8ffd8',42,.2);
  Feel.addTrauma(state.feel,.18);
 }
 if(Sfx)Sfx.playCast(); else audio(650,.12);
 updateHUD();
}

function finish(){
 markComplete(state.level);
 state.runSnapshot={level:state.level,coins:state.coins,keys:state.keys,elapsed:state.elapsed,stars:stageStars(state.level),maxCombo:state.feel?.maxComboReached||0};
 if(Sfx)Sfx.playVictory(); else audio(880,.3);
 showScreen('win');
}

function bindTouch(){
 document.querySelectorAll('[data-control]').forEach(b=>{
  const k=b.dataset.control;let activePointer=null;
  const down=e=>{
   e.preventDefault();if(state.scene!=='play')return;activePointer=e.pointerId;
   try{b.setPointerCapture?.(e.pointerId)}catch{}
   b.classList.add('pressed');
   if(k==='jump')doJump();
   else if(k==='attack')cast();
   else if(k==='interact')interact();
   else if(k==='dash')doDash();
   else keys[k]=true;
  };
  const up=e=>{
   if(activePointer!==null&&e.pointerId!==undefined&&e.pointerId!==activePointer)return;
   e.preventDefault();activePointer=null;
   try{b.releasePointerCapture?.(e.pointerId)}catch{}
   b.classList.remove('pressed');
   if(k==='left'||k==='right')keys[k]=false;
   if(k==='jump'&&Feel)Feel.applyVariableJumpCut(state.player);
  };
  b.addEventListener('pointerdown',down);
  ['pointerup','pointercancel'].forEach(ev=>b.addEventListener(ev,up));
 });
}
bindTouch();

const controls={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',ArrowUp:'jump',KeyW:'jump',KeyE:'interact',KeyQ:'interact',KeyJ:'attack',KeyZ:'attack',ShiftLeft:'dash',ShiftRight:'dash',KeyK:'dash'};
window.addEventListener('keydown',e=>{
 // Title / outcome screen Enter & Space start handshake
 if(state.scene==='title'&&(e.code==='Enter'||e.code==='Space')){
  const tag=e.target?.tagName;
  if(tag!=='SELECT'&&tag!=='INPUT'){e.preventDefault();startLevel(state.lastLevels[state.age]||1);return}
 }
 if(e.code==='KeyM'&&!e.repeat&&e.target?.tagName!=='SELECT'){toggleSound();if(state.scene==='title'||state.scene==='pause')showScreen(state.scene);return}
 const key=controls[e.code];
 if(key&&state.scene==='play'){
  e.preventDefault();
  if(key==='jump'&&!e.repeat)doJump();
  else if(key==='attack'&&!e.repeat)cast();
  else if(key==='interact'&&!e.repeat)interact();
  else if(key==='dash'&&!e.repeat)doDash();
  else keys[key]=true;
 }
 if(e.code==='Escape'||(e.code==='KeyP'&&!e.repeat&&(state.scene==='play'||state.scene==='pause'))){
  e.preventDefault();if(state.scene==='question')$('closeQuestion').click();else pause();
 }
});
window.addEventListener('keyup',e=>{
 const key=controls[e.code];
 if(key){
  keys[key]=false;
  if(key==='jump'&&state.scene==='play'&&Feel)Feel.applyVariableJumpCut(state.player);
 }
});
window.addEventListener('blur',()=>{resetKeys()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){resetKeys();if(state.scene==='play')pause()}});

function surfaceY(x,oldFeet,newFeet){const d=state.levelData;state._landingPlatform=null;const inPit=d.pits.some(z=>x>z.x&&x<z.x+z.w);let y=inPit?null:d.ground;for(const p of d.platforms){if(x+20>p.x&&x-20<p.x+p.w&&oldFeet<=p.y+12&&newFeet>=p.y&& (y===null||p.y<y)){y=p.y;state._landingPlatform=p}}if(d.v14)for(const b of d.v14.bridges||[]){if(b.open&&x+20>b.x&&x-20<b.x+b.w&&oldFeet<=b.y+12&&newFeet>=b.y&&(y===null||b.y<y)){y=b.y;state._landingPlatform=b}}return y}
function respawn(){const p=state.player;p.x=state.checkpoint;p.y=450;p.vx=0;p.vy=0;hurt()}

function update(dt){
 const s=state,p=s.player,d=s.levelData;
 s.elapsed+=dt;
 p.land=Math.max(0,(p.land||0)-dt);p.cast=Math.max(0,(p.cast||0)-dt);p.hurt=Math.max(0,(p.hurt||0)-dt);p.inv=Math.max(0,p.inv-dt);
 s.flash=Math.max(0,s.flash-dt);s.bossHurt=Math.max(0,(s.bossHurt||0)-dt);s.bossDefeat=Math.max(0,(s.bossDefeat||0)-dt);s.shake=Math.max(0,s.shake-25*dt);s.toastTimer-=dt;
 if(s.toastTimer<=0)$('toast').classList.remove('show');

 if(Feel&&s.feel)Feel.tickSimFeel(s.feel,p,dt);

 const dir=(keys.right?1:0)-(keys.left?1:0);
 const slippery=d.world===4||d.hazards.some(h=>h.kind===3&&Math.abs(h.x-p.x)<100);
 const acceleration=slippery?700:(p.grounded?2100:1550);
 const gust=d.hazards.find(h=>h.kind===2&&Math.abs(h.x-p.x)<95);
 if(!(s.feel?.dashTimer>0)){
  const target=dir*325+(gust?60*Math.sin(s.elapsed*2+gust.phase):0);
  p.vx+=(target-p.vx)*Math.min(1,acceleration*dt/325);
  if(Math.abs(p.vx)<4)p.vx=0;
  if(dir)p.face=dir;
 }
 p.run+=Math.abs(p.vx)*dt*.035;
 p.vy=Math.min(1050,p.vy+(s.feel?.dashTimer>0?240:1700)*dt);
 const wasGrounded=p.grounded,impactVelocity=p.vy;
 const oldFeet=p.y+p.h;
 p.x=clamp(p.x+p.vx*dt,40,d.length-65);
 p.y+=p.vy*dt;
 const newFeet=p.y+p.h;
 const floor=surfaceY(p.x,oldFeet,newFeet);
 if(floor!==null&&p.vy>=0&&oldFeet<=floor+10&&newFeet>=floor){
  p.y=floor-p.h;p.vy=0;p.grounded=true;
  if(!wasGrounded&&impactVelocity>170){
   p.land=.19;
   spark(p.x,p.y+p.h,6,'#d4eec0');
   if(Feel&&s.feel&&impactVelocity>560)Feel.addTrauma(s.feel,.16);
  }
  if((WorldOne&&WorldOne.contact(s,s._landingPlatform))||(Expedition&&Expedition.contact(s,s._landingPlatform))){
   spark(p.x,p.y+p.h,16,'#f8d2fd');
   if(Feel&&s.feel){Feel.pushShockwave(s.feel,p.x,p.y+p.h,'#f5c4ff',72,.28);Feel.addTrauma(s.feel,.22);}
   if(Sfx)Sfx.playJump(true); else audio(700,.09);
  }
  // Consume buffered jump on landing frame!
  if(Feel&&s.feel&&s.feel.jumpBufferTimer>0){
   const res=Feel.consumeJump(s.feel,p);
   if(res==='ground'){spark(p.x,p.y+p.h,9,'#c4f2b8');if(Sfx)Sfx.playJump(false); else audio(480,.11);}
  }
 }else p.grounded=false;

 if(p.y>H+180){respawn();if(s.scene!=='play')return}

 d.coins.forEach(c=>{
  if(!c.got&&Math.abs(c.x-p.x)<44&&Math.abs(c.y-(p.y+26))<92){
   c.got=true;s.coins++;
   const combo=Feel&&s.feel?Feel.registerCombo(s.feel,1):1;
   if(s.coins%12===0){s.energy++;toast(txt('bonus'));if(Feel&&s.feel)Feel.pushCallout(s.feel,c.x,c.y-24,'+1 MAGIC ✦','#9fffe0',1.15);}
   else if(Feel&&s.feel){Feel.pushCallout(s.feel,c.x,c.y-14,combo>=3?`+1 · ×${combo}`:'+1','#ffe998',combo>=4?1.12:.92);}
   spark(c.x,c.y,11,'#ffe4a4');
   if(Sfx)Sfx.playCoin(combo); else audio(940,.08);
   updateHUD();
  }
 });

 d.checkpoints.forEach(x=>{
  if(x>state.checkpoint&&p.x>x){
   s.checkpoint=x;toast(txt('checkpoint'));spark(x,510,20,'#b0f4c9');
   if(Feel&&s.feel){
    Feel.pushShockwave(s.feel,x,530,'#a6f7c8',95,.42);
    Feel.pushCallout(s.feel,x,470,txt('checkpoint'),'#b8ffda',1.05);
   }
   if(Sfx)Sfx.playCheckpoint();
  }
 });

 d.enemies.forEach((e,eIdx)=>{
  if(!e.alive)return;
  e.x=e.base+V.enemyOffset(d.id,eIdx,s.elapsed,e.speed,e.phase);
  if(Math.abs(e.x-p.x)<50&&Math.abs(540-(p.y+30))<70){
   if(p.vy>180&&p.y+p.h<550){
    e.alive=false;s.enemiesDefeated++;p.vy=-470;
    spark(e.x,540,20,'#b7ffcb');
    if(Feel&&s.feel){
     const combo=Feel.registerCombo(s.feel,1);
     const foeSprite=V.enemyIndex?V.enemyIndex(d.id,eIdx):1;
     Feel.pushEnemyKO(s.feel,e,foeSprite,p.face);
     Feel.pushShockwave(s.feel,e.x,545,'#b8ffd0',78,.32);
     Feel.pushCallout(s.feel,e.x,500,combo>=2?`STOMP ×${combo}!`:'STOMP!','#b8ffd8',1.12);
     Feel.triggerHitstop(s.feel,false);
     Feel.addTrauma(s.feel,.4);
    }
    if(Sfx)Sfx.playEnemyHit(); else audio(610,.13);
   }else hurt();
  }
 });

 for(const h of d.hazards){const dx=Math.abs(h.x-p.x),nearGround=p.y+p.h>d.ground-38,phase=Math.sin(s.elapsed*(h.kind===1?2.4:2.8)+h.phase);if(dx<35&&p.inv===0){if(h.kind===0&&nearGround)hurt();if(h.kind===1&&phase>.35&&p.y+p.h>d.ground-115)hurt();if(h.kind===4&&phase>.85&&p.y+p.h>d.ground-105)hurt();}}

 for(const proj of s.projectiles){
  proj.x+=proj.vx*dt;proj.life-=dt;
  for(let eIdx=0;eIdx<d.enemies.length;eIdx++){
   const e=d.enemies[eIdx];
   if(e.alive&&Math.abs(e.x-proj.x)<46&&Math.abs(535-proj.y)<62){
    e.alive=false;s.enemiesDefeated++;proj.life=0;
    spark(e.x,535,20,'#d8ffb3');
    if(Feel&&s.feel){
     const combo=Feel.registerCombo(s.feel,1);
     const foeSprite=V.enemyIndex?V.enemyIndex(d.id,eIdx):1;
     Feel.pushEnemyKO(s.feel,e,foeSprite,Math.sign(proj.vx)||1);
     Feel.pushShockwave(s.feel,e.x,535,'#ccffbe',84,.32);
     Feel.pushCallout(s.feel,e.x,492,combo>=2?`✦ BLAST ×${combo}`:'✦ BLAST!','#d4ffba',1.1);
     Feel.triggerHitstop(s.feel,false);
     Feel.addTrauma(s.feel,.36);
    }
    if(Sfx)Sfx.playEnemyHit(); else audio(640,.15);
   }
  }
  if(d.boss&&s.keys===4&&s.bossHp>0&&Math.abs(proj.x-d.bossX)<115&&Math.abs(proj.y-490)<160){
   s.bossHp--;proj.life=0;s.bossHurt=.47;s.shake=13;
   spark(d.bossX,440,34,'#f8d8a1');
   if(Feel&&s.feel){
    Feel.pushShockwave(s.feel,d.bossX,455,'#ffe09c',150,.44);
    Feel.pushCallout(s.feel,d.bossX,380,'CRITICAL HIT!','#ffe48e',1.28);
    Feel.triggerHitstop(s.feel,true);
    Feel.addTrauma(s.feel,.75);
   }
   if(s.bossHp===0){
    s.bossDefeat=.95;s.bossPulse=0;toast(txt('exit'));spark(d.bossX,440,80,'#b6f7c7');
    if(Feel&&s.feel){
     Feel.pushShockwave(s.feel,d.bossX,460,'#9effda',240,.65);
     Feel.triggerVignette(s.feel,'140, 255, 210',.45);
     Feel.addTrauma(s.feel,.95);
    }
    if(Sfx)Sfx.playBossDefeat(); else audio(180,.3,'triangle');
   }else{
    if(Sfx)Sfx.playBossHit(); else audio(180,.3,'triangle');
   }
  }
 }
 s.projectiles=s.projectiles.filter(x=>x.life>0);

 if(d.boss&&s.keys===4&&s.bossHp>0){
  const bossNear=Math.abs(p.x-d.bossX)<600;
  if(bossNear){
   s.bossClock+=dt;
   if(s.bossClock>(d.v14?.mechanic==='heart'?(s.bossHp<=1?2.6:s.bossHp===2?3.35:4.6):4.6)){
    s.bossClock=0;s.bossPulse=1.15;
    if(d.v14?.mechanic==='heart'){d.v14.triggerCount++;d.v14.bossStrike={phase:d.v14.bossPhase||1,x:p.x,remaining:1.15}}
   }
  }
  if(s.bossPulse>0){
   s.bossPulse=Math.max(0,s.bossPulse-dt);
   if(d.v14?.bossStrike)d.v14.bossStrike.remaining=s.bossPulse;
   if(s.bossPulse===0&&bossNear){
    if(Feel&&s.feel)Feel.addTrauma(s.feel,.45);
    if(d.v14?.mechanic==='heart'){
     const strike=d.v14.bossStrike;
     const impact=strike?.phase===1?(Math.abs(p.x-d.bossX)<430&&p.grounded):strike?.phase===2?(Math.abs(p.x-strike.x)<120&&p.y+p.h>d.ground-145):(Math.abs(p.x-d.bossX)<570&&p.grounded);
     if(impact)hurt();
    }else if(Math.abs(p.x-d.bossX)<510&&p.grounded)hurt();
   }
  }
 }

 if(WorldOne)WorldOne.tick(s,dt);if(Expedition)Expedition.tick(s,dt);
 s.particles=s.particles.filter(pt=>{pt.life-=dt;pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;pt.vy+=360*dt;return pt.life>0});
 const targetCam=Feel&&s.feel?Feel.computeCameraTarget(p.x,s.feel.lookAheadX,d.length,W):clamp(p.x-410,0,Math.max(0,d.length-W));
 s.camera+=(targetCam-s.camera)*Math.min(1,dt*6.2);
 if((s.elapsed*2|0)!==((s.elapsed-dt)*2|0))updateHUD();

 let hint='';
 const shrine=d.shrines.find(q=>!q.done&&Math.abs(q.x-p.x)<145);
 const lever=(d.v14?.switches||d.v15?.switches||[]).find(q=>Math.abs(q.x-p.x)<122);
 if(shrine)hint=`${subjectSymbol[shrine.subject]} ${txt('shrine')} · ${tr(C.SUBJECT_LABELS[shrine.subject])}`;
 else if(lever)hint=tr(d.subtitle)+' · E / ✧';
 else if(Math.abs(p.x-(d.length-165))<220)hint=txt('gate');
 else if(d.boss&&s.keys===4&&s.bossHp>0&&Math.abs(p.x-d.bossX)<590)hint=txt('boss');
 $('hint').textContent=hint;$('hint').hidden=!hint;
 if(p.x>d.length-230&&s.keys===4&&(!d.boss||s.bossHp===0)&&p.y<d.ground)finish();
}

const renderer3d=new window.LeapScene3D(canvas,L.worlds);
function render(time){
 const rawDt=state.last?Math.min(0.05,(time-state.last)/1000):0.016;state.last=time;
 if(state.scene==='play'){
  let simDt=rawDt;
  if(Feel&&state.feel){
   const stepInfo=Feel.tickVisualFeel(state.feel,rawDt);
   simDt=stepInfo.simDt;
  }
  let rem=simDt;
  while(rem>0){
   const step=Math.min(rem,0.02);
   update(step);
   rem-=step;
  }
 }else if(Feel&&state.feel){
  Feel.tickVisualFeel(state.feel,rawDt);
 }
 renderer3d.frame(state,time);
 requestAnimationFrame(render);
}

function init(){
 renderer3d.setStage(L.make(1));
 syncSoundButton();
 const auto=typeof location!=='undefined'&&typeof URLSearchParams!=='undefined'&&new URLSearchParams(location.search).get('autostart')==='1';
 if(auto){startLevel(1)}else{showScreen('title')}
 requestAnimationFrame(render);
}
init();
window.__LEAP_DEBUG__={state,startLevel,interact,cast,doDash,answer,update,showScreen,getRenderer:()=>renderer3d.getDiagnostics(),getEngine:()=>renderer3d};
})();
