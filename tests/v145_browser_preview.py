"""In-memory *actual Canvas game renderer* preview. HTTP navigation is disallowed in this environment.
This does NOT certify hosted Cloudflare or physical browser/mobile device testing."""
import os,re,base64,json,time,hashlib
from pathlib import Path
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
out=root/'evidence/v145-local-renderer';out.mkdir(parents=True,exist_ok=True)
html=(root/'index.html').read_text()
html=re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.S)
html=html.replace('<link rel="stylesheet" href="src/style.css">', '<style>'+(root/'src/style.css').read_text()+'</style>')
files=['diversity_v13.js','world1_v14.js','curriculum.js','levels.js']
names=['ari.png', 'premium/moss_stone.webp','world1-v6/rune-shrine.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v142/crystal-waterfall-scenery.webp','world1-v143/mistwalk-cinematic-scenery.webp']
names += [f'animation/ari/{n}' for n in ['body-v1411-clean.png','cape.png','rear-arm.png','back-leg-v141.png','front-leg.png','front-arm-v1411-clean.png','rear-shin-v145.png','rear-boot-v145.png','front-shin-v145.png','front-boot-v145.png']]
names += [f'world1-v143/{k}-stone-moss.webp' for k in ['forest','mushroom','waterfall','timber','temple','firefly','swamp','cave','storm','sacred']]
names += [f'foe-{i:02d}.webp' for i in range(1,11)]
names += [f'animation/rootkeeper-v11/{k}.webp' for k in ['idle','attack','hurt','stalk','defeat']]
names += [f'boss-{i:02d}.webp' for i in range(1,11)]
assets={}
for n in names:
 p=root/'assets'/n
 if not p.exists():raise RuntimeError('missing asset '+n)
 mime={'webp':'image/webp','png':'image/png','jpg':'image/jpeg'}.get(p.suffix[1:])
 assets[n]='data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu-sandbox'])
 ctx=b.new_context(viewport={'width':1280,'height':800},device_scale_factor=1)
 page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('about:blank');page.set_content(html);page.evaluate('(data)=>window.__ASSET_DATA__=data',assets)
 def code_run(code):page.evaluate('(s)=>{ (0,eval)(s); }',code)
 for n in files:code_run((root/'src'/n).read_text())
 def script_module(n,exports,head=''):
  src=(root/'src'/n).read_text();src=re.sub(r'^import\s+.*?;\s*$', '',src,flags=re.M);src=re.sub(r'\bexport\s+', '',src)
  body=head+src+'\nreturn {'+','.join(exports)+'};'
  page.evaluate('([name,body])=>{window[name]=new Function(body)()}', ['__'+n.replace('.js','').replace('-','_'),body])
 script_module('animation.js',['heroPose','creaturePose','heroSoleHeights'])
 script_module('rootkeeper_rig.js',['evaluateRootkeeperPose','drawRootkeeperRig'])
 script_module('animation_v12.js',['HeroAnimationMixer','RootkeeperAnimationMixer','atlasCoordinates','bossState'], 'const {heroPose}=window.__animation;\n')
 script_module('world1_v14_art.js',['WorldOneArt'])
 script_module('world1_terrain_v141.js',['paintWorldOneTerrain','TERRAIN_V141_MATERIALS'])
 painter=(root/'src/premium.js').read_text()
 painter=re.sub(r'^import\s+.*?;\s*$', '',painter,flags=re.M).replace('export class PainterWorld','class PainterWorld')
 painter=painter.replace('img.src=`assets/${path}`;', 'img.src=(window.__ASSET_DATA__?.[path]||`assets/${path}`);')
 head='const {heroPose,creaturePose,heroSoleHeights}=window.__animation;\nconst {WorldOneArt}=window.__world1_v14_art;\nconst {paintWorldOneTerrain}=window.__world1_terrain_v141;\nconst {evaluateRootkeeperPose,drawRootkeeperRig}=window.__rootkeeper_rig;\nconst {HeroAnimationMixer,RootkeeperAnimationMixer,atlasCoordinates,bossState}=window.__animation_v12;\n'
 page.evaluate('(code)=>{window.LeapScene3D=new Function(code)().PainterWorld}',head+painter+'\nreturn {PainterWorld};')
 code_run((root/'src/game.js').read_text())
 page.wait_for_timeout(1300)
 results=[]
 for i in range(1,11):
  try:
   result=page.evaluate('''n=>{let dbg=window.__LEAP_DEBUG__;dbg.startLevel(n);let s=dbg.state,d=s.levelData;
      s.player.x=d.length-395;
      s.player.y=d.ground-s.player.h;s.player.vx=0;s.player.vy=0;s.player.grounded=true;
      s.camera=Math.max(0,d.length-1030);s.player.inv=0;d.enemies.forEach(e=>e.alive=false);
      return {id:n,title:d.title[0],length:d.length,ground:d.ground,scene:s.scene,assets:dbg.getRenderer()};}''',i)
   page.wait_for_timeout(260)
   page.screenshot(path=str(out/f'level-{i:02d}.png'))
   result['screenshot']=f'level-{i:02d}.png';results.append(result)
   print(i,result['title'], result['scene'], 'asset count',result['assets'].get('assetsLoaded'),flush=True)
  except Exception as e:print('ERROR LEVEL',i,str(e),flush=True);errors.append('Level '+str(i)+': '+str(e))
 # Dynamic native game input check for Level 3
 page.evaluate('''()=>{let d=window.__LEAP_DEBUG__;d.startLevel(3);d.state.player.x=d.state.levelData.length-390;
 d.state.player.y=d.state.levelData.ground-d.state.player.h;d.state.player.grounded=true;d.state.player.inv=0;
 d.state.camera=Math.max(0,d.state.player.x-780);d.state.levelData.enemies.forEach(e=>e.alive=false)}''')
 page.wait_for_timeout(600)
 page.screenshot(path=str(out/'level-03-hero-idle.png'))
 page.keyboard.down('ArrowRight');page.wait_for_timeout(280);page.keyboard.up('ArrowRight');page.screenshot(path=str(out/'level-03-hero-run.png'))
 page.wait_for_timeout(120)
 page.keyboard.press('Space');page.wait_for_timeout(170);page.screenshot(path=str(out/'level-03-hero-jump.png'))
 # Real DOM gameplay input, answer feedback and age/language samples in the in-memory game.
 gameplay={}
 page.evaluate('''()=>{let dbg=window.__LEAP_DEBUG__;dbg.startLevel(1);let s=dbg.state;
   s.player.y=s.levelData.ground-s.player.h;s.player.grounded=true;s.player.inv=0;
   s.levelData.enemies.forEach(e=>e.alive=false)}''')
 x0=page.evaluate('()=>window.__LEAP_DEBUG__.state.player.x')
 page.keyboard.down('ArrowRight');page.wait_for_timeout(330);page.keyboard.up('ArrowRight')
 x1=page.evaluate('()=>window.__LEAP_DEBUG__.state.player.x')
 gameplay['keyboard_horizontal_delta']=round(x1-x0,2)
 subjects=[]
 for sub in ['math','english','science','general']:
  page.evaluate('''sub=>{let d=window.__LEAP_DEBUG__,s=d.state,sh=s.levelData.shrines.find(q=>q.subject===sub);
    s.player.x=sh.x;s.player.y=s.levelData.ground-s.player.h;s.player.grounded=true;d.interact()}''',sub)
  page.wait_for_timeout(60)
  opened=page.evaluate('''()=>{let s=window.__LEAP_DEBUG__.state;return {subject:s.question?.subject,scene:s.scene,correct:s.question?.correct}}''')
  if opened['correct'] is None: raise RuntimeError('education UI not opened for '+sub+': '+str(opened))
  page.evaluate('''()=>{let d=window.__LEAP_DEBUG__,bad=(d.state.question.correct+1)%4;
     d.answer(bad,document.querySelectorAll('#answers button.answer')[bad]);}''')
  wrong=page.locator('#feedback').inner_text()
  page.evaluate('''()=>{let d=window.__LEAP_DEBUG__,c=d.state.question.correct;
     d.answer(c,document.querySelectorAll('#answers button.answer')[c]);}''')
  page.wait_for_timeout(925)
  subjects.append({'subject':sub,'incorrect_answer_feedback':wrong,'keys_after':page.evaluate('()=>window.__LEAP_DEBUG__.state.keys')})
 gameplay['subjects']=subjects
 samples=[]
 for age in ['5-6','7-9','10-12','13-15','16+']:
  for lang in ['en','zh','ms']:
   samples.append(page.evaluate('''([age,lang])=>{const d=window.__LEAP_DEBUG__;d.state.age=age;d.state.lang=lang;
     d.startLevel(2);d.state.player.x=d.state.levelData.shrines[0].x;d.interact();
     return {age,lang,prompt:d.state.question?.prompt,options:d.state.question?.options?.length||0}}''',[age,lang]))
 gameplay['age_language_samples']=samples
 performance=[]
 for lvl in [1,3,5,7,9,10]:
  page.evaluate('''n=>{let d=window.__LEAP_DEBUG__;d.startLevel(n);d.state.player.x=600;
    d.state.player.y=d.state.levelData.ground-d.state.player.h;d.state.player.grounded=true}''',lvl)
  page.wait_for_timeout(90)
  f0=page.evaluate('()=>window.__LEAP_DEBUG__.getRenderer().drawnFrames')
  start=time.monotonic();page.wait_for_timeout(780);elapsed=time.monotonic()-start
  f1=page.evaluate('()=>window.__LEAP_DEBUG__.getRenderer().drawnFrames')
  performance.append({'level':lvl,'fps_headless_chromium':round((f1-f0)/elapsed,1),'elapsed_sec':round(elapsed,3)})
 gameplay['performance_observations']=performance
 print('GAMEPLAY',json.dumps({'movement_dx':gameplay['keyboard_horizontal_delta'],'subjects':subjects,'age_language_count':len(samples),'performance':performance},ensure_ascii=False),flush=True)
 (out/'functional-browser-observations.json').write_text(json.dumps(gameplay,ensure_ascii=False,indent=2))
 print('BROWSER_ERRORS',errors,flush=True)
 (out/'browser-observations.json').write_text(json.dumps({'tests':results,'errors':errors,'method':'in-memory actual game renderer; not hosted or physical-device'},indent=2))
 ctx.close();b.close()
# screenshot sheet assembled from game renders, never concept art.
W,H=640,398;sheet=Image.new('RGB',(W*5,H*2),'#112933');d=ImageDraw.Draw(sheet)
for j in range(10):
 p=out/f'level-{j+1:02d}.png'
 if p.exists():
  im=Image.open(p).convert('RGB');im=im.crop((0,0,1280,720)).resize((W,H-30),Image.Resampling.LANCZOS)
  xx=(j%5)*W;yy=(j//5)*H;sheet.paste(im,(xx,yy+30))
  d.rectangle((xx,yy,xx+W,yy+30),fill='#092735');d.text((xx+12,yy+7),f'WORLD 1 / LEVEL {j+1:02d}',fill='#fce8a7')
sheet.save(out/'v145-actual-ten-level-game-renderer.jpg',quality=89,subsampling=0)
print('CONTACT_SHEET',out/'v145-actual-ten-level-game-renderer.jpg')
