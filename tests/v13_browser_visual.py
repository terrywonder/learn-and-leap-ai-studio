from playwright.sync_api import sync_playwright
from pathlib import Path
import http.server,socketserver,threading
root=Path(__file__).resolve().parents[1];out=root/'docs';out.mkdir(exist_ok=True)
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(root),**kwargs)
 def log_message(self,*args):pass
class Server(socketserver.TCPServer):allow_reuse_address=True
s=Server(('127.0.0.1',0),Handler);threading.Thread(target=s.serve_forever,daemon=True).start()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':800},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:%d/'%s.server_address[1],wait_until='load',timeout=20000)
 page.wait_for_function('!!window.__LEAP_DEBUG__',timeout=12000)
 result=[]
 for lvl in [1,2,3,5,7,10,11,21]:
  page.evaluate('(id)=>window.__LEAP_DEBUG__.startLevel(id)',lvl)
  page.wait_for_timeout(420)
  page.screenshot(path=str(out/f'v13-stage-{lvl:02}.png'))
  result.append([lvl,page.locator('#hudLevel').inner_text(),page.locator('#missionTag').inner_text()])
 print('Chrome screens:',result)
 # check one challenge style while remaining 100-level curriculum unchanged
 page.evaluate('()=>{ const d=window.__LEAP_DEBUG__;d.startLevel(1);d.state.player.x=d.state.levelData.shrines[0].x;d.interact();}')
 print('Question mode',page.locator('.question-card').get_attribute('data-mode'),'Options',page.locator('#answers button').count())
 assert page.locator('#answers button').count()==4
 assert not errors,errors
 browser.close()
s.shutdown()
