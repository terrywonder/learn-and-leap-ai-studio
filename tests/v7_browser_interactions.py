"""Runs complete game code, DOM controls, physics and renderer in Chromium via
page.set_content (sandbox blocks page navigation). This is NOT a hosted URL test.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,base64,mimetypes,re
root=Path(__file__).resolve().parents[1]
paths=['ari.png','foe-01.webp','foe-03.webp','boss-01.webp','world-01.webp','premium/foliage.png','premium/organic_canopy.png','premium/flowers_1.png','premium/flowers_2.png','premium/flowers_3.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v6/cascade-vines.png','world1-v6/rune-shrine.png']
paths += [x.relative_to(root/'assets').as_posix() for x in (root/'assets/animation').rglob('*.png')]
assets={k:'data:'+mimetypes.guess_type(str(root/'assets'/k))[0]+';base64,'+base64.b64encode((root/'assets'/k).read_bytes()).decode() for k in paths}
read=lambda name:(root/name).read_text()
html=read('index.html').split('<script>')[0]
html=html.replace('<link rel="stylesheet" href="src/style.css">','<style>'+read('src/style.css')+'</style>')
painter=read('src/premium.js').replace("import {heroPose,creaturePose} from './animation.js';",'').replace('export class PainterWorld','class PainterWorld').replace('img.src=`assets/${path}`','img.src=window.assetData[path]||""')
anim=read('src/animation.js').replace('export function','function')
scripts=[
 'window.assetData='+json.dumps(assets)+';',
 read('src/curriculum.js'),read('src/levels.js'),
 '(function(){'+anim+';window.heroPose=heroPose;window.creaturePose=creaturePose;})();',
 '(function(){const heroPose=window.heroPose,creaturePose=window.creaturePose;'+painter+';window.LeapScene3D=PainterWorld;})();',
 read('src/game.js')]
html+=''.join('<script>'+s+'</script>' for s in scripts)+'</body></html>'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu'])
 pg=browser.new_page(viewport={'width':1200,'height':780},device_scale_factor=1)
 errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.set_content(html,wait_until='load');pg.wait_for_function('!!window.__LEAP_DEBUG__',timeout=15000)
 pg.wait_for_timeout(350)
 assert pg.evaluate('__LEAP_DEBUG__.state.scene')=='title'
 pg.locator('[data-action="start"]').first.click()
 pg.wait_for_timeout(500)
 assert pg.evaluate('__LEAP_DEBUG__.state.scene')=='play'
 x0=pg.evaluate('__LEAP_DEBUG__.state.player.x');pg.keyboard.down('ArrowRight');pg.wait_for_timeout(400);pg.keyboard.up('ArrowRight')
 x1=pg.evaluate('__LEAP_DEBUG__.state.player.x');assert x1>x0+12,(x0,x1)
 pg.keyboard.press('Space');pg.wait_for_timeout(120)
 jump=pg.evaluate('({vy:__LEAP_DEBUG__.state.player.vy,grounded:__LEAP_DEBUG__.state.player.grounded})');assert jump['vy']<0 and not jump['grounded'],jump
 # Visit the first living education shrine and answer using actual DOM controls.
 pg.evaluate('''()=>{const D=__LEAP_DEBUG__;D.state.player.x=D.state.levelData.shrines[0].x;D.state.player.y=D.state.levelData.ground-62;D.state.player.vx=0;D.state.player.vy=0;D.state.player.grounded=true;}''')
 pg.evaluate('__LEAP_DEBUG__.interact()')
 pg.wait_for_timeout(100)
 assert pg.evaluate('__LEAP_DEBUG__.state.scene')=='question'
 correct=pg.evaluate('__LEAP_DEBUG__.state.question.correct')
 pg.locator('#answers button').nth(correct).click()
 pg.wait_for_timeout(1000)
 assert pg.evaluate('__LEAP_DEBUG__.state.keys')==1
 assert pg.evaluate('__LEAP_DEBUG__.state.scene')=='play'
 assert not errors,errors
 print('PASS v7 Chromium runtime: title -> play, keyboard running, jumping, real four-subject shrine UI and rewarded correct answer; no JS exceptions')
 browser.close()
