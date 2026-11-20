"""Render actual World 1 boss frame using the bundled Canvas renderer in Chromium."""
from pathlib import Path
from io import BytesIO
import base64,mimetypes,json
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
paths=['ari.png','foe-01.webp','foe-03.webp','boss-01.webp','world-01.webp','premium/foliage.png','premium/organic_canopy.png','premium/flowers_1.png','premium/flowers_2.png','premium/flowers_3.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v6/cascade-vines.png','world1-v6/rune-shrine.png']
paths += [x.relative_to(root/'assets').as_posix() for x in (root/'assets/animation').rglob('*.png')]
paths += [x.relative_to(root/'assets').as_posix() for x in (root/'assets/animation/rootkeeper-v11').glob('*.webp')]
asset={k:'data:'+mimetypes.guess_type(k)[0]+';base64,'+base64.b64encode((root/'assets'/k).read_bytes()).decode() for k in paths}
levels=(root/'src/levels.js').read_text()
anim=(root/'src/animation.js').read_text().replace('export function','function')
premium=(root/'src/premium.js').read_text().replace("import {heroPose,creaturePose} from './animation.js';",'').replace("import {evaluateRootkeeperPose,drawRootkeeperRig} from './rootkeeper_rig.js';",'').replace('export class PainterWorld','class PainterWorld').replace('img.src=`assets/${path}`','img.src=window.assetData[path]||""')
html='<html><body style="margin:0;background:black"><canvas id="world" width="1280" height="720"></canvas><script>window.assetData='+json.dumps(asset)+';</script><script>'+levels+'</script><script>'+anim+'\n'+premium+'\nwindow.PainterWorld=PainterWorld;</script></body></html>'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='load')
 page.evaluate('''()=>{window.world=window.LeapLevels.make(10);window.renderer=new window.PainterWorld(document.querySelector('canvas'));renderer.setStage(world);window.state={scene:'play',levelData:world,camera:world.bossX-650,bossHp:3,bossHurt:0,bossDefeat:0,bossPulse:0,keys:4,player:{x:world.bossX-270,y:world.ground-62,h:62,w:38,face:1,vx:120,vy:0,grounded:true,inv:0,run:2,land:0,cast:0,hurt:0},projectiles:[],particles:[]};}''')
 page.wait_for_timeout(1800)
 cases=[('idle',1000,0,0,0),('windup',1300,.65,0,0),('strike',1640,.05,0,0),('hurt',2100,0,.24,0),('defeat',2350,0,0,.50)]
 sheet=Image.new('RGB',(5*320,240),'#163129');d=ImageDraw.Draw(sheet)
 for i,(label,t,pulse,hurt,death) in enumerate(cases):
  page.evaluate('''a=>{state.bossPulse=a.pulse;state.bossHurt=a.hurt;state.bossDefeat=a.death;state.bossHp=a.death?0:3;renderer.frame(state,a.t)}''',{'pulse':pulse,'hurt':hurt,'death':death,'t':t})
  im=Image.open(BytesIO(page.locator('canvas').screenshot())).convert('RGB')
  im.save(root/'docs'/('v11-actual-battle-'+label+'.png'))
  crop=im.crop((405,300,915,695));crop.thumbnail((316,218))
  sheet.paste(crop,(i*320,20));d.text((i*320+8,3),label.upper(),fill='white')
 sheet.save(root/'docs'/'v11-actual-pose-strip.png')
 assert not errors,errors
 print('PASS: Chromium actual game-rendered Rootkeeper v11 poses')
 browser.close()
