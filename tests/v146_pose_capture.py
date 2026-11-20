"""In-memory *actual Canvas game renderer* preview. HTTP navigation is disallowed in this environment.
This does NOT certify hosted Cloudflare or physical browser/mobile device testing."""
import os,re,base64,json,time,hashlib
from pathlib import Path
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
out=root/'evidence/v146-local-renderer';out.mkdir(parents=True,exist_ok=True)
html=(root/'index.html').read_text()
html=re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.S)
html=html.replace('<link rel="stylesheet" href="src/style.css">', '<style>'+(root/'src/style.css').read_text()+'</style>')
files=['diversity_v13.js','world1_v14.js','curriculum.js','levels.js']
names=['ari.png', 'premium/moss_stone.webp','world1-v6/rune-shrine.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v142/crystal-waterfall-scenery.webp','world1-v143/mistwalk-cinematic-scenery.webp']
names += [f'animation/ari/{n}' for n in ['body-v1411-clean.png','cape.png','rear-arm.png','back-leg-v141.png','front-leg.png','front-arm-v1411-clean.png','rear-shin-v145.png','rear-boot-v145.png','rear-boot-forward-v146.png','front-shin-v145.png','front-boot-v145.png']]
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
 page.wait_for_timeout(900)
 outputs=[]
 for direction in [1,-1]:
  for index,phase in enumerate([0,1.5707963267948966,3.141592653589793,4.71238898038469]):
   page.evaluate("""([direction,phase])=>{const d=window.__LEAP_DEBUG__,s=d.state;d.startLevel(3);const st=s.levelData;
     s.player.x=st.length-390;s.player.y=st.ground-s.player.h;s.player.grounded=true;
     s.player.vx=direction*315;s.player.vy=0;s.player.face=direction;s.player.run=phase;
     s.player.inv=0;s.camera=Math.max(0,s.player.x-810);st.enemies.forEach(e=>e.alive=false);
     s.scene='pause';d.getEngine().heroMixer.update=(player,t)=>({...window.__animation.heroPose({...player,grounded:true,vy:0,run:phase,vx:direction*315},t),events:[]});
     }""",[direction,phase])
   page.wait_for_timeout(220)
   file=out/f'final-{direction}-{index}.png';page.screenshot(path=str(file))
   outputs.append(str(file));print('captured',file.name,flush=True)
 print('errors',errors,flush=True)
 (out/'final-pose-errors.json').write_text(json.dumps({'errors':errors,'files':outputs},indent=2))
 ctx.close();b.close()
