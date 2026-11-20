"""Real Chromium game-control smoke test using inlined *exact* project modules.
Navigation is unavailable in this environment; this tests actual rendering and
DOM interaction, not the external staging URL or an iPhone.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,base64,mimetypes
root=Path(__file__).resolve().parents[1]
paths=['ari.png','foe-01.webp','foe-03.webp','boss-01.webp','world-01.webp','premium/foliage.png','premium/organic_canopy.png','premium/flowers_1.png','premium/flowers_2.png','premium/flowers_3.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','world1-v6/ferns-and-blossoms.png','world1-v6/cascade-vines.png','world1-v6/rune-shrine.png']
paths += [x.relative_to(root/'assets').as_posix() for x in (root/'assets/animation').rglob('*.png')]
paths += [x.relative_to(root/'assets').as_posix() for x in (root/'assets/animation/rootkeeper-rig').glob('*.jpg')]
assets={k:'data:'+mimetypes.guess_type(str(root/'assets'/k))[0]+';base64,'+base64.b64encode((root/'assets'/k).read_bytes()).decode() for k in paths}
read=lambda p:(root/p).read_text()
html=read('index.html').split('<script>')[0]
html=html.replace('<link rel="stylesheet" href="src/style.css">','<style>'+read('src/style.css')+'</style>')
painter=read('src/premium.js').replace("import {heroPose,creaturePose} from './animation.js';",'').replace("import {evaluateRootkeeperPose,drawRootkeeperRig} from './rootkeeper_rig.js';",'').replace('export class PainterWorld','class PainterWorld').replace('img.src=`assets/${path}`','img.src=window.assetData[path]||""')
anim=read('src/animation.js').replace('export function','function')
rig=read('src/rootkeeper_rig.js').replace('export function','function').replace('export const','const')
scripts=['window.assetData='+json.dumps(assets)+';',read('src/curriculum.js'),read('src/levels.js'),
 '(function(){'+anim+';window.heroPose=heroPose;window.creaturePose=creaturePose;})();',
 '(function(){'+rig+';window.evalRK=evaluateRootkeeperPose;window.drawRK=drawRootkeeperRig;})();',
 '(function(){const heroPose=window.heroPose,creaturePose=window.creaturePose,evaluateRootkeeperPose=window.evalRK,drawRootkeeperRig=window.drawRK;'+painter+';window.LeapScene3D=PainterWorld;})();',read('src/game.js')]
html+=''.join('<script>'+s+'</script>' for s in scripts)+'</body></html>'
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu'])
 page=browser.new_page(viewport={'width':1280,'height':760})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='load');page.wait_for_function('!!window.__LEAP_DEBUG__')
 page.locator('[data-action="start"]').first.click()
 page.wait_for_timeout(250)
 assert page.evaluate('__LEAP_DEBUG__.state.scene')=='play'
 x0=page.evaluate('__LEAP_DEBUG__.state.player.x');page.keyboard.down('ArrowRight');page.wait_for_timeout(300);page.keyboard.up('ArrowRight')
 assert page.evaluate('__LEAP_DEBUG__.state.player.x')>x0+10
 page.keyboard.press('Space');page.wait_for_timeout(110)
 assert page.evaluate('__LEAP_DEBUG__.state.player.vy')<0
 # Real learning interaction and key reward.
 page.evaluate('''()=>{let s=__LEAP_DEBUG__.state;s.player.x=s.levelData.shrines[0].x;s.player.y=s.levelData.ground-62;s.player.vy=0;s.player.grounded=true;}''')
 page.evaluate('__LEAP_DEBUG__.interact()');assert page.evaluate('__LEAP_DEBUG__.state.scene')=='question'
 correct=page.evaluate('__LEAP_DEBUG__.state.question.correct');page.locator('#answers button').nth(correct).click()
 page.wait_for_timeout(750);assert page.evaluate('__LEAP_DEBUG__.state.keys')==1
 # Guardian scene initialized with actual boss actor, injury and attack timer signals.
 page.evaluate('__LEAP_DEBUG__.startLevel(10)')
 page.evaluate('''()=>{const D=__LEAP_DEBUG__,s=D.state; s.keys=4;s.camera=s.levelData.bossX-650;s.player.x=s.levelData.bossX-180;s.player.y=s.levelData.ground-62;s.player.grounded=true;s.bossPulse=.85;}''')
 page.wait_for_timeout(160)
 assert page.evaluate('__LEAP_DEBUG__.state.level')==10
 assert page.evaluate('__LEAP_DEBUG__.getRenderer().renderer').startswith('Cinematic')
 assert not errors,errors
 print('PASS v10 actual Chromium game: running, jumping, complete shrine question/reward, boss scene & animated painter, no JS exceptions')
 browser.close()
