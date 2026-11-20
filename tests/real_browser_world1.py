"""Real browser smoke and screenshot of the v6 painterly game (not a renderer stub)."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import mimetypes
root=Path(__file__).resolve().parents[1]
url='https://learn-leap-local.test/'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--disable-gpu-sandbox'])
 for mobile in (False,True):
  ctx=browser.new_context(viewport={'width':390 if mobile else 1366,'height':844 if mobile else 820},device_scale_factor=1,is_mobile=mobile,has_touch=mobile)
  page=ctx.new_page();errs=[]; failed=[];page.on('pageerror',lambda e:errs.append(str(e)));page.on('requestfailed',lambda r:failed.append(f'{r.url}: {r.failure}'))
  def serve(route):
   pathname=route.request.url.split('://',1)[-1].split('/',1)[-1].split('?',1)[0]
   f=(root/pathname).resolve() if pathname else root/'index.html'
   if f.is_file() and f.is_relative_to(root):
    ct=mimetypes.guess_type(str(f))[0] or 'application/octet-stream'
    return route.fulfill(status=200,content_type=ct,body=f.read_bytes())
   return route.fulfill(status=404,body='Not found')
  page.route('**/*',serve)
  page.goto(url,wait_until='load');page.wait_for_function('!!window.__LEAP_DEBUG__',timeout=12000)
  page.wait_for_timeout(1800)
  print('browser state',mobile,page.evaluate('''()=>({scene:window.__LEAP_DEBUG__.state.scene,canvas:document.querySelector('canvas').getBoundingClientRect().toJSON(),stats:window.__LEAP_DEBUG__.getRenderer()})'''))
  page.locator('[data-action="play"]').click() if page.locator('[data-action="play"]').count() else None
  page.wait_for_timeout(900)
  print('playing',mobile,page.evaluate('window.__LEAP_DEBUG__.state.scene'))
  if page.evaluate('window.__LEAP_DEBUG__.state.scene')!='play':
   print('buttons',page.locator('button').all_text_contents()[:15]);
  # Use saved debug interface to place player in an actual world-one scene without modifying logic.
  page.evaluate('''()=>{const D=window.__LEAP_DEBUG__; if(D.state.scene!=='play'){D.state.scene='play';D.state.level=1;D.state.levelData=window.LeapLevels.make(1);}D.state.player={...D.state.player,x:610,y:D.state.levelData.ground-62,grounded:true,vx:115,vy:0,h:62,face:1,inv:0,run:5};D.state.camera=140}''')
  page.wait_for_timeout(800)
  path=root/'docs'/('actual-world1-browser-mobile.png' if mobile else 'actual-world1-browser-desktop.png')
  page.screenshot(path=str(path),full_page=False)
  assert not errs,errs
  assert not failed,failed[:10]
  print('PASS real Chromium', 'mobile' if mobile else 'desktop','rendered',path)
  ctx.close()
 browser.close()
