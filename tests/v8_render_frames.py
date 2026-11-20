"""Capture runtime Canvas images for the full-silhouette Rootkeeper v8.
Navigational hosting test is separate; this loads exact local modules/assets into a real Chromium Canvas.
"""
from pathlib import Path
from PIL import Image,ImageDraw
from io import BytesIO
from playwright.sync_api import sync_playwright
import base64,mimetypes,json
root=Path(__file__).resolve().parents[1]
paths=['ari.png','foe-01.webp','foe-03.webp','boss-01.webp','world-01.webp','premium/foliage.png','premium/organic_canopy.png','premium/flowers_1.png','premium/flowers_2.png','premium/flowers_3.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v6/cascade-vines.png','world1-v6/rune-shrine.png']
paths += [str(x.relative_to(root/'assets')).replace('\\','/') for x in (root/'assets/animation').rglob('*.png')]
paths += [str(x.relative_to(root/'assets')).replace('\\','/') for x in (root/'assets/animation/rootkeeper-v8').glob('*.webp')]
assets={k:'data:'+mimetypes.guess_type(str(root/'assets'/k))[0]+';base64,'+base64.b64encode((root/'assets'/k).read_bytes()).decode() for k in paths}
levels=(root/'src/levels.js').read_text()
anim=(root/'src/animation.js').read_text().replace('export function','function')
premium=(root/'src/premium.js').read_text().replace("import {heroPose,creaturePose} from './animation.js';",'').replace('export class PainterWorld','class PainterWorld').replace('img.src=`assets/${path}`','img.src=window.assetData[path]||""')
html='<html><body style="margin:0;background:black"><canvas id="world" width="1280" height="720"></canvas><script>window.assetData='+json.dumps(assets)+';</script><script>'+levels+'</script><script>(function(){'+anim+'\nwindow.heroPose=heroPose;window.creaturePose=creaturePose;})();</script><script>(function(){const heroPose=window.heroPose,creaturePose=window.creaturePose;'+premium+'\nwindow.PainterWorld=PainterWorld;})();</script></body></html>'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu'])
 page=browser.new_page(viewport={'width':1280,'height':720})
 errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
 page.set_content(html,wait_until='load')
 page.evaluate('''()=>{window.world=window.LeapLevels.make(10);window.renderer=new window.PainterWorld(document.querySelector('canvas'));renderer.setStage(world);window.state={scene:'play',levelData:world,camera:world.bossX-650,bossHp:3,bossHurt:0,bossDefeat:0,bossPulse:0,keys:4,player:{x:world.bossX-200,y:world.ground-62,h:62,w:38,face:1,vx:0,vy:0,grounded:true,inv:0,run:0,land:0,cast:0,hurt:0},projectiles:[],particles:[]};}''')
 page.wait_for_timeout(1200)
 print('Asset diagnostics:',page.evaluate('renderer.getDiagnostics()'))
 out=root/'docs';out.mkdir(exist_ok=True)
 cases=[('idle',1000,0,0,0),('stalk',1300,0,0,0),('windup',1600,.95,0,0),('strike',1700,.51,0,0),('recovery',1800,.18,0,0),('hurt',1900,0,.25,0),('defeat',2000,0,0,.55)]
 sheet=Image.new('RGB',(380*len(cases),430),'#203d42');painter=ImageDraw.Draw(sheet)
 for i,(label,t,pulse,hurt,death) in enumerate(cases):
  page.evaluate('''arg=>{state.bossPulse=arg.pulse;state.bossHurt=arg.hurt;state.bossDefeat=arg.death;state.bossHp=arg.death?0:3;renderer.frame(state,arg.t)}''',{'pulse':pulse,'hurt':hurt,'death':death,'t':t})
  im=Image.open(BytesIO(page.locator('canvas').screenshot())).convert('RGB')
  # Rootkeeper rendering centre at x=650; enlarged crop with floor still visible
  crop=im.crop((465,230,835,640)).resize((370,410))
  sheet.paste(crop,(380*i,20))
  painter.text((380*i+10,4),label.upper(),fill='white',stroke_width=1,stroke_fill='#182c35')
 sheet.save(out/'v8-rootkeeper-real-render-poses.png')
 anim_frames=[]
 for i in range(24):
  pulse=max(.02,1.15-(i/23)*1.15)
  page.evaluate('''args=>{state.bossHp=3;state.bossHurt=0;state.bossDefeat=0;state.bossPulse=args.pulse;renderer.frame(state,args.t)}''',{'pulse':pulse,'t':3100+i*70})
  im=Image.open(BytesIO(page.locator('canvas').screenshot())).convert('RGB').crop((465,230,835,640)).resize((370,410))
  anim_frames.append(im)
 anim_frames[0].save(out/'v8-rootkeeper-runtime-attack.gif',save_all=True,append_images=anim_frames[1:],duration=70,loop=0,optimize=True)
 assert not errors,errors
 assert page.evaluate('renderer.getDiagnostics().assetsLoaded')>24
 print('PASS actual Chromium Canvas renderer, 7 states, 24-frame runtime attack GIF, no page errors')
 browser.close()
