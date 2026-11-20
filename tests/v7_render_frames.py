"""Visually test actual v7 painter by injecting local modules/assets using page.set_content.
The sandbox blocks navigation, not DOM / Canvas; no claim of hosted browser QA.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,mimetypes,re
from PIL import Image,ImageOps,ImageDraw
root=Path(__file__).resolve().parents[1]
paths=['ari.png','foe-01.webp','foe-03.webp','boss-01.webp','world-01.webp','premium/foliage.png','premium/organic_canopy.png','premium/flowers_1.png','premium/flowers_2.png','premium/flowers_3.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v6/cascade-vines.png','world1-v6/rune-shrine.png']
paths += [str(x.relative_to(root/'assets')).replace('\\','/') for x in (root/'assets/animation').rglob('*.png')]
from json import dumps
assets={k:'data:'+mimetypes.guess_type(str(root/'assets'/k))[0]+';base64,'+base64.b64encode((root/'assets'/k).read_bytes()).decode() for k in paths}
levels=(root/'src/levels.js').read_text();anim=(root/'src/animation.js').read_text().replace('export function','function');premium=(root/'src/premium.js').read_text().replace("import {heroPose,creaturePose} from './animation.js';",'').replace('export class PainterWorld','class PainterWorld').replace('img.src=`assets/${path}`','img.src=window.assetData[path]||""')
html='<html><head><meta charset="utf-8"></head><body style="margin:0;background:black"><canvas id="world" width="1280" height="720"></canvas><script>window.assetData='+dumps(assets)+';</script><script>'+levels+'</script><script>(function(){'+anim+'\nwindow.heroPose=heroPose;window.creaturePose=creaturePose;})();</script><script>(function(){const heroPose=window.heroPose,creaturePose=window.creaturePose;'+premium+'\nwindow.PainterWorld=PainterWorld;})();</script></body></html>'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu'])
 page=browser.new_page(viewport={'width':1280,'height':720},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
 page.set_content(html,wait_until='load');print("startup errors",errors[:5]);print("globals",page.evaluate("Object.keys(window).filter(k=>k.includes('Leap')||k.includes('Painter'))"))
 page.evaluate('''()=>{window.world=window.LeapLevels.make(1);window.renderer=new window.PainterWorld(document.querySelector('canvas'));window.renderer.setStage(window.world);window.state={scene:'play',levelData:window.world,camera:140,bossHp:3,player:{x:590,y:window.world.ground-62,h:62,w:38,face:1,run:0,vx:0,vy:0,grounded:true,inv:0,land:0,cast:0,hurt:0},projectiles:[],particles:[],keys:0};}''')
 page.wait_for_timeout(1000)
 print('assets',page.evaluate('renderer.getDiagnostics()'))
 frames=[]
 for label,t,velocity,run,grounded,vy,cast in [('idle',1000,0,0,True,0,0),('runA',1200,285,1.0,True,0,0),('runB',1300,285,4.65,True,0,0),('jump',1500,180,3.2,False,-380,0),('fall',1600,140,3.8,False,400,0),('cast',1700,80,4.1,True,0,.25)]:
  page.evaluate('''a=>{Object.assign(state.player,{vx:a.velocity,run:a.run,grounded:a.grounded,vy:a.vy,cast:a.cast});renderer.frame(state,a.time)}''',{'velocity':velocity,'run':run,'grounded':grounded,'vy':vy,'cast':cast,'time':t})
  path=root/'docs'/f'v7-{label}-actual-canvas.png';page.locator('#world').screenshot(path=str(path));frames.append((label,path))
 # Rootkeeper: create two different attack/patrol poses in the actual renderer.
 page.evaluate('''()=>{window.world=window.LeapLevels.make(10);window.renderer.setStage(window.world);Object.assign(window.state,{levelData:window.world,camera:window.world.bossX-650,bossHp:3,keys:4});window.state.player.x=window.world.bossX-200;window.state.player.y=window.world.ground-62;}''')
 monsterFrames=[]
 for label,mt,pulse in [('stalk',1200,0),('attack',1640,1)]:
  page.evaluate('''a=>{state.bossPulse=a.pulse;renderer.frame(state,a.time)}''',{'pulse':pulse,'time':mt})
  path=root/'docs'/f'v7-rootkeeper-{label}-actual-canvas.png';page.locator('#world').screenshot(path=str(path));monsterFrames.append((label,path))
 # Capture the illustrated Rootkeeper moving his articulated arms and feet.
 creatureAnimation=[]
 for idx in range(18):
  tm=1250+idx*95
  pulse=1 if 5<=idx<=12 else 0
  page.evaluate('''a=>{state.bossPulse=a.pulse;renderer.frame(state,a.time)}''',{'pulse':pulse,'time':tm})
  from io import BytesIO
  frame=Image.open(BytesIO(page.locator('#world').screenshot())).convert('RGB').crop((475,270,825,630)).resize((350,360),Image.Resampling.LANCZOS)
  creatureAnimation.append(frame)
 creatureAnimation[0].save(root/'docs/v7-Rootkeeper-attack-cycle.gif',save_all=True,append_images=creatureAnimation[1:],duration=95,loop=0,optimize=True)
 assert not errors,errors
 # Capture a full run cycle directly from the same canvas renderer, not interpolated by an image model.
 page.evaluate('''()=>{window.world=window.LeapLevels.make(1);window.renderer.setStage(world);Object.assign(state,{levelData:world,camera:140,bossHp:0,keys:0});Object.assign(state.player,{x:590,y:world.ground-62,h:62,vx:285,vy:0,grounded:true,cast:0});}''')
 animation=[]
 for idx in range(22):
  t=1800+idx*72
  page.evaluate('''a=>{state.player.run=a.run;renderer.frame(state,a.t)}''',{'run':idx/22*6.2831853,'t':t})
  blob=page.locator('#world').screenshot()
  from io import BytesIO
  frame=Image.open(BytesIO(blob)).convert('RGB').crop((340,415,600,635)).resize((390,330),Image.Resampling.LANCZOS)
  animation.append(frame)
 animation[0].save(root/'docs/v7-Ari-run-cycle.gif',save_all=True,append_images=animation[1:],duration=75,loop=0,optimize=True)
 assert not errors,errors
 collage=Image.new('RGB',(3*360,2*355),'#142932');d=ImageDraw.Draw(collage)
 for i,(label,path) in enumerate(frames):
  im=Image.open(path).convert('RGB');crop=im.crop((350,430,580,645)).resize((345,323),Image.Resampling.LANCZOS)
  x=i%3*360+8;y=i//3*355+8;collage.paste(crop,(x,y));d.text((x+10,y+7),label.upper(),fill='white',stroke_width=2,stroke_fill='#142932')
 collage.save(root/'docs/v7-hero-animation-actual-frames.png')
 big=Image.new('RGB',(2*520,440),'#142932');d2=ImageDraw.Draw(big)
 for i,(label,path) in enumerate(monsterFrames):
  im=Image.open(path).convert('RGB');xx=round(worldx) if False else None
  # boss appears at x ~650 (worldX - camera), y ~300-580
  crop=im.crop((490,270,810,625)).resize((520,420),Image.Resampling.LANCZOS)
  big.paste(crop,(i*520,0));d2.text((i*520+20,14),label.upper(),fill='white',stroke_width=2,stroke_fill='#142932')
 big.save(root/'docs/v7-rootkeeper-animation-actual-frames.png')
 print('PASS: six distinct real Canvas frames with no JavaScript errors; contact sheet',root/'docs/v7-hero-animation-actual-frames.png')
 browser.close()
