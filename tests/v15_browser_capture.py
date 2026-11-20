"""Capture real local Canvas renderer frames for one level per world using Chromium.
In-memory DOM + actual game code; not a hosted/physical-device test."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
import base64, json, re, time
r=Path(__file__).resolve().parents[1]; out=r/'evidence/v15-local-chromium';out.mkdir(parents=True,exist_ok=True)
html=(r/'index.html').read_text();html=re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.S)
html=html.replace('<link rel="stylesheet" href="src/style.css">','<style>'+(r/'src/style.css').read_text()+'</style>')
names=['ari.png','premium/moss_stone.webp','world1-v6/rune-shrine.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v6/cascade-vines.png','world1-v143/mistwalk-cinematic-scenery.webp']
names += [f'world-{i:02d}.webp' for i in range(1,11)]
names += [f'foe-{i:02d}.webp' for i in range(1,11)]
names += [f'boss-{i:02d}.webp' for i in range(1,11)]
names += [f'world1-v143/{k}-stone-moss.webp' for k in ['forest','mushroom','waterfall','timber','temple','firefly','swamp','cave','storm','sacred']]
names += [f'animation/ari/{k}' for k in ['body-v1411-clean.png','cape.png','rear-arm.png','back-leg-v141.png','front-leg.png','front-arm-v1411-clean.png','rear-shin-v145.png','rear-boot-forward-v146.png','front-shin-v145.png','front-boot-v145.png']]
names += [f'animation/rootkeeper-v11/{k}.webp' for k in ['idle','stalk','attack','hurt','defeat']]
assets={}
for k in set(names):
 p=r/'assets'/k
 if p.exists():
  typ='image/png' if p.suffix=='.png' else 'image/webp'
  assets[k]='data:'+typ+';base64,'+base64.b64encode(p.read_bytes()).decode()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu-sandbox'])
 ctx=b.new_context(viewport={'width':1280,'height':800},device_scale_factor=1);pg=ctx.new_page();errors=[];pg.on('pageerror',lambda err:errors.append(str(err)))
 pg.goto('about:blank');pg.set_content(html)
 pg.evaluate('(data)=>window.__ASSET_DATA__=data',assets)
 def run(text):pg.evaluate('(s)=>(0,eval)(s)',text)
 for f in ['diversity_v13.js','world1_v14.js','worlds_v15.js','curriculum.js','levels.js']:run((r/'src'/f).read_text())
 def module(f,exports,head=''):
  src=(r/'src'/f).read_text();src=re.sub(r'^import\s+.*?;\s*$', '',src,flags=re.M);src=re.sub(r'\bexport\s+', '',src)
  body=head+src+'\nreturn {'+','.join(exports)+'};'
  pg.evaluate('([name,code])=>window[name]=new Function(code)()', ['__'+f.replace('.js',''),body])
 module('animation.js',['heroPose','creaturePose','heroSoleHeights'])
 module('rootkeeper_rig.js',['evaluateRootkeeperPose','drawRootkeeperRig'])
 module('animation_v12.js',['HeroAnimationMixer','RootkeeperAnimationMixer','atlasCoordinates','bossState'],'const {heroPose}=window.__animation;\n')
 module('world1_v14_art.js',['WorldOneArt'])
 module('world1_terrain_v141.js',['paintWorldOneTerrain','TERRAIN_V141_MATERIALS'])
 module('worlds_v15_art.js',['paintExpeditionBackdrop','paintExpeditionTerrain','paintExpeditionDetails','fullWorldPalette'])
 painter=(r/'src/premium.js').read_text();painter=re.sub(r'^import\s+.*?;\s*$', '',painter,flags=re.M).replace('export class PainterWorld','class PainterWorld')
 painter=painter.replace('img.src=`assets/${path}`;', 'img.src=(window.__ASSET_DATA__?.[path]||`assets/${path}`);')
 head='const {heroPose,creaturePose,heroSoleHeights}=window.__animation;\nconst {WorldOneArt}=window.__world1_v14_art;\nconst {paintWorldOneTerrain}=window.__world1_terrain_v141;\nconst {paintExpeditionBackdrop,paintExpeditionTerrain,paintExpeditionDetails}=window.__worlds_v15_art;\nconst {evaluateRootkeeperPose,drawRootkeeperRig}=window.__rootkeeper_rig;\nconst {HeroAnimationMixer,RootkeeperAnimationMixer,atlasCoordinates,bossState}=window.__animation_v12;\n'
 pg.evaluate('(code)=>window.LeapScene3D=new Function(code)().PainterWorld',head+painter+'\nreturn {PainterWorld};')
 run((r/'src/game.js').read_text());pg.wait_for_timeout(1250)
 status=[]
 for num in [1,11,21,31,41,51,61,71,81,91]:
  x=pg.evaluate('''n=>{let d=window.__LEAP_DEBUG__;d.startLevel(n);let s=d.state,L=s.levelData;L.enemies.forEach(e=>e.alive=false);s.player.x=670;s.player.y=L.ground-s.player.h;s.player.vx=0;s.player.vy=0;s.player.grounded=true;s.player.inv=0;s.camera=180;return {id:n,title:L.title[0],kind:L.v15?.kind||'forest',stage:L.stage}}''',num)
  pg.wait_for_timeout(240);pg.screenshot(path=str(out/f'world-{(num-1)//10+1:02d}.png'))
  status.append(x);print('CAPTURE',x,flush=True)
 # Verify every level's actual game scene startup and first rendered frame in Chromium.
 all_stages=pg.evaluate('''()=>{const dbg=window.__LEAP_DEBUG__,out=[];
   for(let id=1;id<=100;id++){
     try{dbg.startLevel(id);let state=dbg.state;state.levelData.enemies.forEach(e=>e.alive=false);
       dbg.getEngine().frame(state,performance.now()+id*17);
       out.push({id,world:state.levelData.world+1,title:state.levelData.title[0],scene:state.scene,rendered:dbg.getRenderer().drawnFrames});
     }catch(e){out.push({id,error:String(e)});}
   }return out;}''')
 print('ALL_LEVEL_BROWSER_SMOKE',len(all_stages),'failures',len([s for s in all_stages if 'error' in s]),flush=True)
 (out/'all-100-local-browser-startups.json').write_text(json.dumps(all_stages,ensure_ascii=False,indent=2))
 move=pg.evaluate('''()=>{let d=window.__LEAP_DEBUG__;d.startLevel(71);d.state.player.x=230;d.state.player.y=d.state.levelData.ground-d.state.player.h;d.state.player.grounded=true;return d.state.player.x}''')
 pg.keyboard.down('ArrowRight');pg.wait_for_timeout(360);pg.keyboard.up('ArrowRight')
 delta=pg.evaluate('()=>window.__LEAP_DEBUG__.state.player.x')-move
 qcheck=pg.evaluate('''()=>{let d=window.__LEAP_DEBUG__;d.startLevel(51);let s=d.state;s.player.x=s.levelData.shrines[0].x;d.interact();return {subject:s.shrineActive?.subject,prompt:s.question?.prompt,answers:s.question?.options.length,scene:s.scene}}''')
 # Browser-level sample of all subjects, age bands and interface languages.
 educational=[]
 for age in ['5-6','7-9','10-12','13-15','16+']:
  for lang in ['en','zh','ms']:
   result=pg.evaluate('''([age,lang])=>{let d=window.__LEAP_DEBUG__;d.state.age=age;d.state.lang=lang;d.startLevel(51);
     let s=d.state;s.player.x=s.levelData.shrines[0].x;d.interact();return {age,lang,subject:s.shrineActive?.subject,prompt:s.question?.prompt,optionCount:s.question?.options?.length,scene:s.scene};}''',[age,lang])
   educational.append(result)
 sample_fps=[]
 for level in [11,21,31,41,51,61,71,81,91]:
  pg.evaluate('''n=>{let d=window.__LEAP_DEBUG__;d.startLevel(n);d.state.player.x=670;d.state.player.y=d.state.levelData.ground-d.state.player.h;d.state.player.grounded=true;}''',level)
  pg.wait_for_timeout(100);f0=pg.evaluate('()=>window.__LEAP_DEBUG__.getRenderer().drawnFrames');t0=time.monotonic();pg.wait_for_timeout(420);elapsed=time.monotonic()-t0;f1=pg.evaluate('()=>window.__LEAP_DEBUG__.getRenderer().drawnFrames');sample_fps.append({'level':level,'fps_headless':round((f1-f0)/elapsed,1)})
 print('AGE_LANGUAGE_BROWSER_SAMPLES',len(educational),'FPS_SAMPLES',sample_fps,flush=True)
 info={'capture':'in-memory Chromium real Canvas renderer; NOT a deployed or physical device game','scenes':status,'all_100_browser_starts':len(all_stages),'browser_start_failures':[z for z in all_stages if 'error' in z],'movement_delta':round(delta,2),'question':qcheck,'education_age_language_samples':educational,'headless_browser_performance':sample_fps,'javascript_errors':errors}
 (out/'qa-observations.json').write_text(json.dumps(info,ensure_ascii=False,indent=2))
 ctx.close();b.close()
print('ERRORS',errors,flush=True)
sheet=Image.new('RGB',(640*5,400*2),'#182e39');dr=ImageDraw.Draw(sheet)
for i,num in enumerate([1,11,21,31,41,51,61,71,81,91]):
 src=out/f'world-{(num-1)//10+1:02d}.png'
 if src.exists():
  im=Image.open(src).convert('RGB').crop((0,0,1280,720));im.thumbnail((640,362));xx=(i%5)*640;yy=(i//5)*400;sheet.paste(im,(xx,yy+30));dr.text((xx+10,yy+7),f'WORLD {i+1:02d} / LEVEL {num:03d}',fill='#f8ebc8')
sheet.save(out/'ten-worlds-real-game-contact-sheet.jpg',quality=86)
print('SHEET',out/'ten-worlds-real-game-contact-sheet.jpg')
