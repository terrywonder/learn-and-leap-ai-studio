"""Render the genuine v12 Canvas scene inside Chromium without network navigation.
This is a renderer/frame test, not a hosted-gameplay or mobile-device test.
"""
from pathlib import Path
from io import BytesIO
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
import base64,mimetypes,json
root=Path(__file__).resolve().parents[1]
assets=['ari.png','foe-01.webp','foe-03.webp','boss-01.webp','world-01.webp','premium/foliage.png','premium/organic_canopy.png','premium/flowers_1.png','premium/flowers_2.png','premium/flowers_3.png','premium/whispering_woods_backdrop.webp','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v6/cascade-vines.png','world1-v6/rune-shrine.png']
assets += [f'animation/ari/{part}.png' for part in ['body','cape','rear-arm','back-leg','front-leg','front-arm']]
assets += [f'animation/rootkeeper-v11/{mode}.webp' for mode in ['idle','stalk','attack','hurt','defeat']]
assetMap={}
for path in assets:
 file=root/'assets'/path
 mime=mimetypes.guess_type(path)[0] or 'image/png'
 assetMap[path]='data:'+mime+';base64,'+base64.b64encode(file.read_bytes()).decode('ascii')
raw=(root/'src/levels.js').read_text()
anim=(root/'src/animation.js').read_text().replace('export function','function')
animV12=(root/'src/animation_v12.js').read_text().replace("import {heroPose} from './animation.js';",'const heroPose=window.heroPose;').replace('export class','class').replace('export function','function').replace('export const','const')
premium=(root/'src/premium.js').read_text().replace("import {heroPose,creaturePose} from './animation.js';",'const heroPose=window.heroPose,creaturePose=window.creaturePose;').replace("import {evaluateRootkeeperPose,drawRootkeeperRig} from './rootkeeper_rig.js';",'').replace("import {HeroAnimationMixer,RootkeeperAnimationMixer,atlasCoordinates,bossState} from './animation_v12.js';",'const {HeroAnimationMixer,RootkeeperAnimationMixer,atlasCoordinates,bossState}=window.AnimationV12;').replace('export class PainterWorld','class PainterWorld').replace('img.src=`assets/${path}`','img.src=window.assetData[path]||""')
html='<html><body style="margin:0;background:#122a2f"><canvas id="world" width="1280" height="720"></canvas><script>window.assetData='+json.dumps(assetMap)+';</script>'
html+='<script>'+raw+'</script><script>(()=>{'+anim+'\nwindow.heroPose=heroPose;window.creaturePose=creaturePose;})();</script>'
html+='<script>(()=>{'+animV12+'\nwindow.AnimationV12={HeroAnimationMixer,RootkeeperAnimationMixer,atlasCoordinates,bossState};})();</script>'
html+='<script>(()=>{'+premium+'\nwindow.PainterWorld=PainterWorld;})();</script></body></html>'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
 page=browser.new_page(viewport={'width':1280,'height':720})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='load',timeout=40000)
 page.evaluate('''()=>{
  window.level=window.LeapLevels.make(10);
  window.renderer=new window.PainterWorld(document.getElementById('world'));
  renderer.setStage(level);
  window.sim={scene:'play',levelData:level,camera:level.bossX-650,bossHp:3,bossHurt:0,bossDefeat:0,bossPulse:0,keys:4,
    player:{x:level.bossX-260,y:level.ground-62,h:62,w:38,face:1,vx:220,vy:0,grounded:true,inv:0,run:0,land:0,cast:0,hurt:0},projectiles:[],particles:[]};
 }''')
 page.wait_for_timeout(1500)
 if errors:raise RuntimeError(errors)
 frames=[];selected=[]
 for i in range(27):
  t=2000+i*46; pulse=max(.005,1.15-i*.046)
  page.evaluate('''a=>{
   sim.bossPulse=a.pulse;sim.bossHurt=0;sim.bossDefeat=0;sim.bossHp=3;
   sim.player.run=a.i*.50;sim.player.vx=a.i<13?240:0;sim.player.vy=a.i<19?0:a.i<23?-320:260;
   sim.player.grounded=a.i<19;sim.player.cast=0;sim.player.land=0;
   renderer.frame(sim,a.time);
  }''',{'i':i,'time':t,'pulse':pulse})
  img=Image.open(BytesIO(page.locator('#world').screenshot())).convert('RGB')
  crop=img.crop((250,150,1070,690)).resize((656,432),Image.Resampling.LANCZOS)
  frames.append(crop)
  if i in (0,6,12,18,24):selected.append((i,crop.copy()))
 if errors:raise RuntimeError(errors)
 out=root/'docs';out.mkdir(exist_ok=True)
 frames[10].save(out/'v12-actual-world1-battle-frame.png')
 frames[0].save('/mnt/data/Learn-and-Leap-v12-Actual-Game-Frame.png')
 framesReduced=[f.resize((410,270),Image.Resampling.BILINEAR).quantize(colors=80,method=Image.Quantize.FASTOCTREE) for f in frames[::2]]
 framesReduced[0].save('/mnt/data/Learn-and-Leap-v12-Actual-Motion-Preview.gif',save_all=True,append_images=framesReduced[1:],duration=92,loop=0,optimize=False)
 comparison=Image.new('RGB',(5*270,220),'#19332a');draw=ImageDraw.Draw(comparison)
 for j,(i,im) in enumerate(selected):
  comparison.paste(im.resize((270,190),Image.Resampling.LANCZOS),(270*j,26));draw.text((270*j+8,5),f'Frame {i:02d}',fill='white')
 comparison.save('/mnt/data/Learn-and-Leap-v12-Motion-Frames.png')
 print('PASS v12: Chromium drew 27 game-renderer frames; player run/jump and Rootkeeper wind-up/strike; no browser exceptions.')
 browser.close()
