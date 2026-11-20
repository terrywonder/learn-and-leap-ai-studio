"""Test real browser UI with a rendering stub; real Three.js GPU pixels are NOT validated."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import mimetypes
root=Path(__file__).resolve().parents[1]
url='https://learn-leap-test.example/'
stub='''export class World3D {
 constructor(){this.id=null;this.frames=0}
 setStage(d){this.id=d.id;this.stage=d}
 frame(){this.frames++}
 getDiagnostics(){return {renderer:'WebGL test adapter',level:this.id,frames:this.frames}}
}'''
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu-sandbox'])
    for mobile in [False,True]:
        page=browser.new_page(viewport={'width':390 if mobile else 1340,'height':844 if mobile else 820},is_mobile=mobile,has_touch=mobile)
        errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
        def serve(route):
            pathname=route.request.url.split('://',1)[-1].split('/',1)[-1].split('?',1)[0]
            if pathname=='src/scene3d.js':
                return route.fulfill(status=200,content_type='text/javascript',body=stub)
            f=(root/pathname).resolve() if pathname else root/'index.html'
            if f.is_file() and f.is_relative_to(root):
                ct=mimetypes.guess_type(str(f))[0] or 'application/octet-stream'
                return route.fulfill(status=200,content_type=ct,body=f.read_bytes())
            return route.fulfill(status=404,body='Not found')
        page.route('**/*',serve)
        page.goto(url,wait_until='load')
        page.wait_for_function('!!window.__LEAP_DEBUG__',timeout=10000)
        assert not errors,errors
        assert page.locator('.brand-title').is_visible()
        page.locator('[data-action="chapters"]').click()
        assert page.locator('[data-level="10"]').is_visible()
        page.locator('[data-level="10"]').click()
        assert page.evaluate('window.__LEAP_DEBUG__.state.level')==10
        assert page.evaluate('window.__LEAP_DEBUG__.getRenderer().level')==10
        assert page.locator('#hud').is_visible()
        page.evaluate('''()=>{const D=window.__LEAP_DEBUG__;D.state.player.x=D.state.levelData.shrines[0].x;D.interact()}''')
        assert page.locator('#question').is_visible()
        page.locator('#answers .answer').nth(page.evaluate('window.__LEAP_DEBUG__.state.question.correct')).click()
        page.wait_for_timeout(900)
        assert page.evaluate('window.__LEAP_DEBUG__.state.keys')==1
        assert not errors,errors
        page.close()
        print('PASS:', 'mobile' if mobile else 'desktop', 'menu, map, level selection, renderer integration, shrine flow')
    browser.close()
