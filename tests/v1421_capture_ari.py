import os,re,base64,json,time
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
out=root/'evidence/v1421-local-chromium';out.mkdir(parents=True,exist_ok=True)
html=(root/'index.html').read_text()
html=re.sub(r'<script[^>]*>.*?</script>', '',html, flags=re.S)
html=html.replace('<link rel="stylesheet" href="src/style.css">','<style>'+ (root/'src/style.css').read_text()+'</style>')
files=['diversity_v13.js','world1_v14.js','curriculum.js','levels.js']
# inject real project sprites as data URIs solely to work around browser navigation block in this environment
names=[f'animation/ari/{x}.png' for x in ['body','cape','rear-arm','front-arm','back-leg','front-leg']]+[f'foe-{i:02d}.webp' for i in range(1,11)]+[f'animation/rootkeeper-v11/{x}.webp' for x in ['idle','attack','hurt','stalk','defeat']]+['world1-v6/rune-shrine.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','premium/moss_stone.webp','ari.png','animation/ari/back-leg-v141.png','animation/ari/body-v1411-clean.png','animation/ari/front-arm-v1411-clean.png','world1-v142/crystal-waterfall-scenery.webp']
assets={}
for n in names:
 p=root/'assets'/n
 mime='image/webp' if p.suffix=='.webp' else 'image/png'
 assets[n]='data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu-sandbox','--disable-dev-shm-usage'])
 ctx=b.new_context(viewport={'width':1280,'height':800},device_scale_factor=1)
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
 d=page.evaluate("""()=>{const d=window.__LEAP_DEBUG__;d.startLevel(3);d.state.player.x=d.state.levelData.length-410;d.state.player.y=d.state.levelData.ground-62;d.state.player.vx=0;d.state.player.grounded=true;d.state.camera=d.state.levelData.length-1030;d.state.energy=4;d.state.levelData.enemies.forEach(e=>e.alive=false);d.state.levelData.hazards=[];return {scene:d.state.scene,renderer:d.getRenderer()}}""")
 print('RUNTIME',d,flush=True)
 page.wait_for_timeout(500) # Idle
 page.screenshot(path=str(out/'ari-idle.png'))
 page.keyboard.down('ArrowRight');page.wait_for_timeout(260);page.keyboard.up('ArrowRight')
 page.screenshot(path=str(out/'ari-run-right.png'))
 page.wait_for_timeout(450)
 page.keyboard.down('ArrowLeft');page.wait_for_timeout(270);page.keyboard.up('ArrowLeft')
 page.screenshot(path=str(out/'ari-run-left.png'))
 page.wait_for_timeout(450)
 page.keyboard.down('ArrowRight');page.keyboard.press('Space');page.wait_for_timeout(130);page.keyboard.up('ArrowRight')
 page.screenshot(path=str(out/'ari-jump.png'))
 page.wait_for_timeout(350)
 page.keyboard.press('KeyJ');page.wait_for_timeout(100)
 page.screenshot(path=str(out/'ari-cast.png'))
 page.keyboard.down('ArrowRight');page.wait_for_timeout(240);page.keyboard.up('ArrowRight')
 page.wait_for_timeout(850)
 print('FINAL',page.evaluate('()=>({scene:window.__LEAP_DEBUG__.state.scene,player:window.__LEAP_DEBUG__.state.player,getRenderer:window.__LEAP_DEBUG__.getRenderer()})'),flush=True)
 print('ERRORS',errors,'COUNT',len(errors),flush=True)
 page.screenshot(path=str(out/'ari-v1421-local-gameplay.png'))
 ctx.close()

 b.close()

# Reproducible, real-renderer contact-sheet poses for v14.2.1 (not separately generated art).
# Each screenshot above comes from the live renderer, but normal gameplay changes the camera.
try:
    stages=['ari-idle.png','ari-run-right.png','ari-run-left.png','ari-jump.png','ari-cast.png']
    w,h=600,380
    summary=Image.new('RGB',(w*3,h*2),'#152733');dr=ImageDraw.Draw(summary)
    for i,name in enumerate(stages):
        pic=Image.open(out/name).convert('RGB').resize((w,h));xx=i%3*w;yy=i//3*h;summary.paste(pic,(xx,yy))
        dr.rectangle((xx,yy,xx+210,yy+32),fill='#162f40')
        dr.text((xx+12,yy+8),name.replace('.png','').upper(),fill='white')
    summary.save(out/'ari-v1421-five-states.jpg',quality=90)
except Exception as e:print('contact sheet error',str(e))
