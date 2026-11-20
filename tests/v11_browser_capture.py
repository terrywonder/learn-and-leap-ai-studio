from pathlib import Path
from io import BytesIO
import time
from playwright.sync_api import sync_playwright
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720})
 issues=[];page.on('pageerror',lambda e:issues.append(str(e)))
 page.goto('http://127.0.0.1:8679/index.html',wait_until='domcontentloaded',timeout=25000)
 page.wait_for_function('window.__LEAP_DEBUG__ && window.__LEAP_DEBUG__.startLevel',timeout=20000)
 page.evaluate('''()=>{const d=window.__LEAP_DEBUG__;d.startLevel(10);let s=d.state;s.camera=s.levelData.bossX-650;s.keys=4;s.player.x=s.levelData.bossX-280;s.player.y=s.levelData.ground-s.player.h;s.player.grounded=true;s.player.vx=0;s.bossClock=0;}''')
 page.wait_for_timeout(1200)
 view=Image.open(BytesIO(page.locator('#world').screenshot())).convert('RGB');view.save(root/'docs'/'v11-actual-boss-scene.png')
 pages=[]
 for i,(name,phase,hurt,dead) in enumerate([('idle',0,0,0),('windup',.7,0,0),('impact',.08,0,0),('hurt',0,.3,0),('defeat',0,0,.5)]):
  page.evaluate('''a=>{const d=window.__LEAP_DEBUG__,s=d.state;s.bossPulse=a.pulse;s.bossHurt=a.hurt;s.bossDefeat=a.dead;s.bossHp=a.dead?0:3;s.bossClock=0;}''',dict(pulse=phase,hurt=hurt,dead=dead))
  page.wait_for_timeout(110)
  pages.append(Image.open(BytesIO(page.locator('#world').screenshot())).convert('RGB'))
 sheet=Image.new('RGB',(5*320,238),'#123');dr=ImageDraw.Draw(sheet)
 for i,im in enumerate(pages):
  crop=im.crop((380,280,960,685));crop.thumbnail((315,220));sheet.paste(crop,(i*320,16));dr.text((i*320+8,1),['IDLE','WINDUP','IMPACT','HURT','DEFEAT'][i],fill='white')
 sheet.save(root/'docs'/'v11-actual-browser-pose-strip.png')
 print('RENDER',page.evaluate('window.__LEAP_DEBUG__.getRenderer()'))
 assert not issues,issues
 browser.close()
print('PASS Chromium rendered boss + gameplay scene')
