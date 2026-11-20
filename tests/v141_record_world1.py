import os,re,base64,json,time
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
out=root/'evidence/v141-gameplay-clips';out.mkdir(parents=True,exist_ok=True)
html=(root/'index.html').read_text()
html=re.sub(r'<script[^>]*>.*?</script>', '',html, flags=re.S)
html=html.replace('<link rel="stylesheet" href="src/style.css">','<style>'+ (root/'src/style.css').read_text()+'</style>')
files=['diversity_v13.js','world1_v14.js','curriculum.js','levels.js']
# inject real project sprites as data URIs solely to work around browser navigation block in this environment
names=[f'animation/ari/{x}.png' for x in ['body','cape','rear-arm','front-arm','back-leg','front-leg']]+[f'foe-{i:02d}.webp' for i in range(1,11)]+[f'animation/rootkeeper-v11/{x}.webp' for x in ['idle','attack','hurt','stalk','defeat']]+['world1-v6/rune-shrine.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','premium/moss_stone.webp','ari.png','animation/ari/back-leg-v141.png','animation/ari/body-v1411-clean.png','animation/ari/front-arm-v1411-clean.png']
assets={}
for n in names:
 p=root/'assets'/n
 mime='image/webp' if p.suffix=='.webp' else 'image/png'
 assets[n]='data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu-sandbox','--disable-dev-shm-usage'])
 ctx=b.new_context(viewport={'width':1280,'height':800},device_scale_factor=1,record_video_dir=str(out),record_video_size={'width':1280,'height':800})
 page=ctx.new_page()
 videoStart=time.monotonic()
 errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 page.goto('about:blank')
 page.set_content(html)
 page.evaluate('(data)=>window.__ASSET_DATA__=data',assets)
 def code_run(code):page.evaluate('(s)=>{ (0,eval)(s); }',code)
 for n in files:code_run((root/'src'/n).read_text())
 def script_module(n,export,head=''):
  src=(root/'src'/n).read_text()
  src=re.sub(r'^import\s+.*?;\s*$', '',src,flags=re.M)
  src=re.sub(r'\bexport\s+', '',src)
  body=head+src+'\nreturn {'+','.join(export)+'};'
  page.evaluate('([name,body])=>{window[name]=new Function(body)()}', ['__'+n.replace('.js','').replace('-','_'),body])
 script_module('animation.js',['heroPose','creaturePose'])
 script_module('rootkeeper_rig.js',['evaluateRootkeeperPose','drawRootkeeperRig'])
 script_module('animation_v12.js',['HeroAnimationMixer','RootkeeperAnimationMixer','atlasCoordinates','bossState'], 'const {heroPose}=window.__animation;\n')
 script_module('world1_v14_art.js',['WorldOneArt'])
 script_module('world1_terrain_v141.js',['paintWorldOneTerrain','TERRAIN_V141_MATERIALS'])
 painter=(root/'src/premium.js').read_text()
 painter=re.sub(r'^import\s+.*?;\s*$', '',painter,flags=re.M).replace('export class PainterWorld','class PainterWorld')
 painter=painter.replace('img.src=`assets/${path}`;', 'img.src=(window.__ASSET_DATA__?.[path]||`assets/${path}`);')
 head='const {heroPose,creaturePose}=window.__animation;\nconst {WorldOneArt}=window.__world1_v14_art;\nconst {paintWorldOneTerrain}=window.__world1_terrain_v141;\nconst {evaluateRootkeeperPose,drawRootkeeperRig}=window.__rootkeeper_rig;\nconst {HeroAnimationMixer,RootkeeperAnimationMixer,atlasCoordinates,bossState}=window.__animation_v12;\n'
 page.evaluate('(code)=>{window.LeapScene3D=new Function(code)().PainterWorld}',head+painter+'\nreturn {PainterWorld};')
 code_run((root/'src/game.js').read_text())

 page.wait_for_timeout(650)
 timestamps=[]
 for level in range(1,11):
  start=time.monotonic()-videoStart
  detail=page.evaluate("""(id)=>{const d=window.__LEAP_DEBUG__;d.startLevel(id);
    const stage=d.state.levelData;let platform=stage.platforms.find(p=>p.v14Type&&!p.v14Broken)||stage.platforms[0];
    const spot=platform||{x:680,y:stage.ground};
    d.state.player.x=spot.x+Math.min(40,(spot.w||80)*.25);
    d.state.player.y=spot.y-62;d.state.player.vx=0;d.state.player.vy=0;d.state.player.grounded=true;
    d.state.camera=Math.max(0,d.state.player.x-550);
    return {name:stage.title[0],mechanic:stage.v14.mechanic};} """,level)
  page.keyboard.down('ArrowRight');page.wait_for_timeout(2300);page.keyboard.up('ArrowRight')
  page.keyboard.down('Space');page.wait_for_timeout(180);page.keyboard.up('Space')
  page.wait_for_timeout(2800)
  # Script-assisted relocation; no claim of continuous manual completion.
  page.evaluate("""()=>{const d=window.__LEAP_DEBUG__;d.state.player.x=d.state.levelData.shrines[0].x;d.state.player.y=d.state.levelData.ground-62;d.state.player.grounded=true;d.state.player.vx=0;d.state.player.vy=0;d.state.camera=Math.max(0,d.state.player.x-580);d.interact();}""")
  page.wait_for_timeout(2450)
  result=page.evaluate("""()=>{const d=window.__LEAP_DEBUG__;if(d.state.question){const correct=d.state.question.correct;const el=document.querySelectorAll('#answers button.answer')[correct];d.answer(correct,el)}return {scene:d.state.scene,keys:d.state.keys}}""")
  page.wait_for_timeout(2600)
  page.keyboard.down('ArrowRight');page.wait_for_timeout(2400);page.keyboard.up('ArrowRight')
  page.wait_for_timeout(2450)
  end=time.monotonic()-videoStart
  timestamps.append({'level':level,'start':round(start,3),'duration':round(end-start,3),'mechanic':detail['mechanic'],'shrine_result':result})
  print('CAPTURED',level,detail['name'],'seconds',round(end-start,1),flush=True)
 ctx.close()
 video=page.video.path()
 import shutil
 final=out/'v141-all-world1-levels-raw.webm'
 shutil.copy2(video,final)
 (out/'capture-timestamps.json').write_text(json.dumps(timestamps,indent=2))
 print('RAW_VIDEO',final,final.stat().st_size,flush=True)
 b.close()
