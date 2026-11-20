"""Actual Chromium Canvas frames without blocked local/network navigation.
This is a renderer integration check, not a real-hosted mobile browser acceptance test.
"""
from pathlib import Path
from io import BytesIO
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
import base64,mimetypes,json
root=Path(__file__).resolve().parents[1]
assets=['ari.png','foe-01.webp','foe-02.webp','foe-03.webp','foe-04.webp','foe-05.webp','foe-06.webp','foe-07.webp','foe-08.webp','foe-09.webp','foe-10.webp','boss-01.webp','world-01.webp','premium/foliage.png','premium/organic_canopy.png','premium/flowers_1.png','premium/flowers_2.png','premium/flowers_3.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v6/cascade-vines.png','world1-v6/rune-shrine.png']
assets += [f'stage-forest/{i:02}.webp' for i in range(1,11)]
assets += [f'animation/ari/{part}.png' for part in ['body','cape','rear-arm','back-leg','front-leg','front-arm']]
# Rootkeeper sheets omitted in this World 1 early-stage scenery smoke test.
assetMap={}
for path in assets:
 file=root/'assets'/path
 mime=mimetypes.guess_type(path)[0] or 'image/png'
 assetMap[path]='data:'+mime+';base64,'+base64.b64encode(file.read_bytes()).decode('ascii')
raw=(root/'src/levels.js').read_text()
variety=(root/'src/diversity_v13.js').read_text()
anim=(root/'src/animation.js').read_text().replace('export function','function')
animV12=(root/'src/animation_v12.js').read_text().replace("import {heroPose} from './animation.js';",'const heroPose=window.heroPose;').replace('export class','class').replace('export function','function').replace('export const','const')
premium=(root/'src/premium.js').read_text().replace("import {heroPose,creaturePose} from './animation.js';",'const heroPose=window.heroPose,creaturePose=window.creaturePose;').replace("import {evaluateRootkeeperPose,drawRootkeeperRig} from './rootkeeper_rig.js';",'').replace("import {HeroAnimationMixer,RootkeeperAnimationMixer,atlasCoordinates,bossState} from './animation_v12.js';",'const {HeroAnimationMixer,RootkeeperAnimationMixer,atlasCoordinates,bossState}=window.AnimationV12;').replace('export class PainterWorld','class PainterWorld').replace('img.src=`assets/${path}`','img.src=window.assetData[path]||""')
html='<html><body style="margin:0;background:#122a2f"><canvas id="world" width="1280" height="720"></canvas><script>window.assetData='+json.dumps(assetMap)+';</script>'
html+='<script>'+raw+'</script><script>'+variety+'</script><script>(()=>{'+anim+'\nwindow.heroPose=heroPose;window.creaturePose=creaturePose;})();</script>'
html+='<script>(()=>{'+animV12+'\nwindow.AnimationV12={HeroAnimationMixer,RootkeeperAnimationMixer,atlasCoordinates,bossState};})();</script>'
html+='<script>(()=>{'+premium+'\nwindow.PainterWorld=PainterWorld;})();</script></body></html>'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
 page=browser.new_page(viewport={'width':1280,'height':720})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='load',timeout=40000)
 page.evaluate('''()=>{window.renderer=new window.PainterWorld(document.getElementById('world'));}''')
 page.wait_for_timeout(1100)
 frames=[]
 for level in [1,2,3]:
  page.evaluate('''levelId=>{window.level=window.LeapLevels.make(levelId);renderer.setStage(level);
   window.sim={scene:'play',levelData:level,camera:200,bossHp:3,bossHurt:0,bossDefeat:0,bossPulse:0,keys:0,
    player:{x:480,y:level.ground-62,h:62,w:38,face:1,vx:160,vy:0,grounded:true,inv:0,run:4,land:0,cast:0,hurt:0},projectiles:[],particles:[]};
   renderer.frame(sim,2000+levelId*20)}''',level)
  page.wait_for_timeout(100)
  img=Image.open(BytesIO(page.locator('#world').screenshot())).convert('RGB');img.thumbnail((640,360))
  frames.append(img)
 if errors:raise RuntimeError(errors)
 board=Image.new('RGB',(1280,720),'#102734');d=ImageDraw.Draw(board)
 for idx,img in enumerate(frames):
  x=(idx%2)*640;y=(idx//2)*360;board.paste(img,(x,y));d.rectangle((x+7,y+5,x+115,y+27),fill='#143d32');d.text((x+13,y+9),f'LEVEL {idx+1:02}',fill='#fff')
 board.save('/mnt/data/Learn-and-Leap-v13-Actual-Renderer-World1-Comparison.png')
 print('PASS: Chromium rendered three World 1 levels with v13 assets and no page errors.')
 browser.close()
