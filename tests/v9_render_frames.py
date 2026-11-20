"""Capture actual Chromium Canvas render, not concept artwork or a sprite mockup."""
from pathlib import Path
from PIL import Image,ImageDraw
from io import BytesIO
from playwright.sync_api import sync_playwright
import base64,mimetypes,json
root=Path(__file__).resolve().parents[1]
paths=['ari.png','foe-01.webp','foe-03.webp','boss-01.webp','world-01.webp','premium/foliage.png','premium/organic_canopy.png','premium/flowers_1.png','premium/flowers_2.png','premium/flowers_3.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v6/cascade-vines.png','world1-v6/rune-shrine.png']
paths += [x.relative_to(root/'assets').as_posix() for x in (root/'assets/animation').rglob('*.png')]
paths += [x.relative_to(root/'assets').as_posix() for x in (root/'assets/animation/rootkeeper-rig').glob('*.jpg')]
assets={k:'data:'+mimetypes.guess_type(str(root/'assets'/k))[0]+';base64,'+base64.b64encode((root/'assets'/k).read_bytes()).decode() for k in paths}
levels=(root/'src/levels.js').read_text()
anim=(root/'src/animation.js').read_text().replace('export function','function')
rig=(root/'src/rootkeeper_rig.js').read_text().replace('export function','function').replace('export const','const')
premium=(root/'src/premium.js').read_text().replace("import {heroPose,creaturePose} from './animation.js';",'').replace("import {evaluateRootkeeperPose,drawRootkeeperRig} from './rootkeeper_rig.js';",'').replace('export class PainterWorld','class PainterWorld').replace('img.src=`assets/${path}`','img.src=window.assetData[path]||""')
html='<html><body style="margin:0;background:black"><canvas id="world" width="1280" height="720"></canvas><script>window.assetData='+json.dumps(assets)+';</script><script>'+levels+'</script><script>(function(){'+anim+'\nwindow.heroPose=heroPose;window.creaturePose=creaturePose;})();</script><script>(function(){'+rig+'\nwindow.evalRK=evaluateRootkeeperPose;window.drawRK=drawRootkeeperRig;})();</script><script>(function(){const heroPose=window.heroPose,creaturePose=window.creaturePose,evaluateRootkeeperPose=window.evalRK,drawRootkeeperRig=window.drawRK;'+premium+'\nwindow.PainterWorld=PainterWorld;})();</script></body></html>'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='load')
 page.evaluate('''()=>{window.world=window.LeapLevels.make(10);window.renderer=new window.PainterWorld(document.querySelector('canvas'));renderer.setStage(world);window.state={scene:'play',levelData:world,camera:world.bossX-650,bossHp:3,bossHurt:0,bossDefeat:0,bossPulse:0,keys:4,player:{x:world.bossX-200,y:world.ground-62,h:62,w:38,face:1,vx:0,vy:0,grounded:true,inv:0,run:0,land:0,cast:0,hurt:0},projectiles:[],particles:[]};}''')
 page.wait_for_timeout(1000)
 cases=[('idle',1000,0,0,0),('windup',1300,.65,0,0),('slam',1640,.05,0,0),('recover',1930,0,0,0),('hurt',2100,0,.24,0),('defeat',2350,0,0,.50)]
 sheet=Image.new('RGB',(420*len(cases),460),'#1c3b38');draw=ImageDraw.Draw(sheet)
 for i,(label,t,pulse,hurt,death) in enumerate(cases):
  if label=='recover':
   page.evaluate('''a=>{state.bossPulse=0;renderer.frame(state,a)}''',t-330)
  page.evaluate('''a=>{state.bossPulse=a.pulse;state.bossHurt=a.hurt;state.bossDefeat=a.death;state.bossHp=a.death?0:3;renderer.frame(state,a.t)}''',{'pulse':pulse,'hurt':hurt,'death':death,'t':t})
  im=Image.open(BytesIO(page.locator('canvas').screenshot())).convert('RGB')
  im=im.crop((435,180,850,630)).resize((415,450))
  sheet.paste(im,(i*420,10));draw.text((i*420+10,0),label.upper(),fill='white')
 sheet.save(root/'docs/v9-rootkeeper-actual-pose-strip.png')
 clips=[]
 for i in range(30):
  page.evaluate('''a=>{state.bossHp=3;state.bossHurt=0;state.bossDefeat=0;state.bossPulse=a.pulse;renderer.frame(state,a.t)}''',{'pulse':1.15*(1-i/29),'t':2900+i*45})
  im=Image.open(BytesIO(page.locator('canvas').screenshot())).convert('RGB').crop((435,180,850,630)).resize((415,450))
  clips.append(im)
 for i in range(8):
  page.evaluate('''a=>{state.bossPulse=0;renderer.frame(state,a)}''',4300+i*50)
  im=Image.open(BytesIO(page.locator('canvas').screenshot())).convert('RGB').crop((435,180,850,630)).resize((415,450))
  clips.append(im)
 clips[0].save(root/'docs/v9-rootkeeper-actual-attack.gif',save_all=True,append_images=clips[1:],duration=55,loop=0,optimize=True)
 print('Renderer diagnostics',page.evaluate('renderer.getDiagnostics()'))
 assert not errors,errors
 browser.close()
print('PASS: actual v9 Chromium canvas rendering, multi-pose strip and 38-frame attack/recovery GIF')
