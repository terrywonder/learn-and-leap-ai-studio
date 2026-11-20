import os,re,base64,json,time
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
out=root/'evidence/v1411-local-chromium';out.mkdir(parents=True,exist_ok=True)
html=(root/'index.html').read_text()
html=re.sub(r'<script[^>]*>.*?</script>', '',html, flags=re.S)
html=html.replace('<link rel="stylesheet" href="src/style.css">','<style>'+ (root/'src/style.css').read_text()+'</style>')
files=['diversity_v13.js','world1_v14.js','curriculum.js','levels.js']
# inject real project sprites as data URIs solely to work around browser navigation block in this environment
names=[f'animation/ari/{x}.png' for x in ['body','cape','rear-arm','front-arm','back-leg','front-leg']]+[f'foe-{i:02d}.webp' for i in range(1,11)]+[f'animation/rootkeeper-v11/{x}.webp' for x in ['idle','attack','hurt','stalk','defeat']]+['world1-v6/rune-shrine.png','world1-v6/cliff-masonry.webp','world1-v6/living-ledge.webp','premium/moss_stone.webp','ari.png','animation/ari/back-leg-v141.png','animation/ari/body-v1411-clean.png','animation/ari/front-arm-v1411-clean.png']
assets={}
for n in names:
 p=root/'assets'/n
 mime='image/webp' if p.suffix=='.webp' else 'image/png'
 assets[n]='data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-gpu-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 page.goto('about:blank')
 page.set_content(html)
 page.evaluate('(data)=>window.__ASSET_DATA__=data',assets)
 def code_run(code):page.evaluate('(s)=>{ (0,eval)(s); }',code)
 for n in files:code_run((root/'src'/n).read_text())
 def script_module(n,export,head=''):
  src=(root/'src'/n).read_text()
  src=re.sub(r'^import\s+.*?;\s*$', '',src,flags=re.M)
  src=re.sub(r'\bexport\s+', '',src)
  body=head+src+'\nreturn {'+','.join(export)+'};'
  page.evaluate('([name,body])=>{window[name]=new Function(body)()}', ['__'+n.replace('.js','').replace('-','_'),body])
 script_module('animation.js',['heroPose','creaturePose'])
 script_module('rootkeeper_rig.js',['evaluateRootkeeperPose','drawRootkeeperRig'])
 script_module('animation_v12.js',['HeroAnimationMixer','RootkeeperAnimationMixer','atlasCoordinates','bossState'], 'const {heroPose}=window.__animation;\n')
 script_module('world1_v14_art.js',['WorldOneArt'])
 script_module('world1_terrain_v141.js',['paintWorldOneTerrain','TERRAIN_V141_MATERIALS'])
 painter=(root/'src/premium.js').read_text()
 painter=re.sub(r'^import\s+.*?;\s*$', '',painter,flags=re.M).replace('export class PainterWorld','class PainterWorld')
 painter=painter.replace('img.src=`assets/${path}`;', 'img.src=(window.__ASSET_DATA__?.[path]||`assets/${path}`);')
 head='const {heroPose,creaturePose}=window.__animation;\nconst {WorldOneArt}=window.__world1_v14_art;\nconst {paintWorldOneTerrain}=window.__world1_terrain_v141;\nconst {evaluateRootkeeperPose,drawRootkeeperRig}=window.__rootkeeper_rig;\nconst {HeroAnimationMixer,RootkeeperAnimationMixer,atlasCoordinates,bossState}=window.__animation_v12;\n'
 page.evaluate('(code)=>{window.LeapScene3D=new Function(code)().PainterWorld}',head+painter+'\nreturn {PainterWorld};')
 code_run((root/'src/game.js').read_text())
 page.wait_for_timeout(1800)
 print('start',page.evaluate('()=>window.__LEAP_DEBUG__?.getRenderer()'))
 for id in range(1,11):
  page.evaluate('(id)=>{const d=window.__LEAP_DEBUG__;d.startLevel(id);d.state.player.x=id===10?d.state.levelData.bossX-460:680;d.state.player.y=460;d.state.player.vx=0;d.state.player.grounded=true;d.state.camera=id===10?d.state.levelData.bossX-1080:0;if(id===10)d.state.keys=4;}',id)
  page.wait_for_timeout(170)
  data=page.evaluate('()=>{const d=window.__LEAP_DEBUG__;return {id:d.state.levelData.id,location:d.state.levelData.title[0],mechanic:d.state.levelData.v14.mechanic,render:d.getRenderer(),scene:d.state.scene,keys:d.state.keys}}')
  base64png=page.evaluate('()=>document.querySelector("canvas").toDataURL("image/png").split(",")[1]')
  (out/f'level-{id:02d}.png').write_bytes(base64.b64decode(base64png))
  print(json.dumps(data))
 # keyboard real browser gameplay movement
 page.evaluate('()=>{const d=window.__LEAP_DEBUG__;d.startLevel(1);d.state.player.y=522;d.state.player.grounded=true;}')
 pre=page.evaluate('()=>window.__LEAP_DEBUG__.state.player.x')
 page.keyboard.down('ArrowRight');page.wait_for_timeout(340);page.keyboard.up('ArrowRight')
 post=page.evaluate('()=>window.__LEAP_DEBUG__.state.player.x')
 print('keyboard_dx',post-pre)
 # four subjects, incorrect answer feedback, correct answer state change
 interaction=[]
 for sub in ['math','english','science','general']:
  page.evaluate('(sub)=>{const d=window.__LEAP_DEBUG__;const shrine=d.state.levelData.shrines.find(x=>x.subject===sub);d.state.player.x=shrine.x;d.interact();}',sub)
  page.wait_for_timeout(70)
  res=page.evaluate('()=>{const d=window.__LEAP_DEBUG__;return {subject:d.state.question?.subject,scene:d.state.scene,lang:d.state.lang,prompt:d.state.question?.prompt,correct:d.state.question?.correct}}')
  page.evaluate('()=>{const d=window.__LEAP_DEBUG__;let bad=(d.state.question.correct+1)%4;d.answer(bad,document.querySelectorAll("#answers button.answer")[bad]);}')
  errtxt=page.locator('#feedback').inner_text()
  page.evaluate('()=>{const d=window.__LEAP_DEBUG__;const idx=d.state.question.correct;d.answer(idx,document.querySelectorAll("#answers button.answer")[idx]);}')
  page.wait_for_timeout(930)
  res.update({'wrong_feedback':errtxt,'keys_after':page.evaluate('()=>window.__LEAP_DEBUG__.state.keys')});interaction.append(res)
 print('education',json.dumps(interaction,ensure_ascii=False))
 # Try change age+languages and make actual question interaction in Chromium
 multi=[]
 for age in ['5-6','7-9','10-12','13-15','16+']:
  for lang in ['en','zh','ms']:
   val=page.evaluate('([age,lang])=>{const d=window.__LEAP_DEBUG__;d.state.age=age;d.state.lang=lang;d.startLevel(2);d.state.player.x=d.state.levelData.shrines[0].x;d.interact();return {age,lang,prompt:d.state.question.prompt,subject:d.state.question.subject,choices:d.state.question.options.length}}',[age,lang]);multi.append(val)
 print('age_language_sample',json.dumps(multi,ensure_ascii=False))
 # Actual Chromium game code: complete all World 1 levels with valid shrine answers and boss hits.
 level_results=[]
 for id in range(1,11):
  report=page.evaluate("""(id)=>{window.setTimeout=(f)=>{f();return 0};const d=window.__LEAP_DEBUG__;d.startLevel(id);
    const answerResults=[];for(const shrine of d.state.levelData.shrines){d.state.player.x=shrine.x;d.state.player.y=522;d.state.player.grounded=true;d.interact();
      const correct=d.state.question.correct;d.answer(correct,{classList:{add(){}},disabled:false});answerResults.push({subject:shrine.subject,done:shrine.done,keys:d.state.keys});}
    const beforeBoss=d.state.bossHp;const hp=[];if(d.state.levelData.boss){d.state.player.x=d.state.levelData.bossX-180;d.state.player.y=450;d.state.player.face=1;
      for(let j=0;j<beforeBoss;j++){d.cast();for(let k=0;k<25;k++)d.update(.018);hp.push(d.state.bossHp);}}
    d.state.player.x=d.state.levelData.length-208;d.state.player.y=500;d.update(.016);
    return {id,subjects:answerResults,bossBefore:beforeBoss,bossHpAfter:d.state.bossHp,bossHitPath:hp,scene:d.state.scene,progress:d.state.progress[d.state.age]?.[id]||0};
   }""",id)
  level_results.append(report)
 print('browser_ten_level_completion',json.dumps(level_results,ensure_ascii=False))
 print('errors',errors[:10], 'count',len(errors))
 # Real headless Chromium timing, NOT physical-device FPS.
 perf=[]
 for stage in [1,2,5,7,9,10]:
  page.evaluate('(id)=>{const d=window.__LEAP_DEBUG__;d.startLevel(id);d.state.player.x=650;d.state.player.y=450;d.state.player.vx=105;d.state.player.grounded=true;}',stage)
  page.wait_for_timeout(130)
  startFrames=page.evaluate('()=>window.__LEAP_DEBUG__.getRenderer().drawnFrames')
  began=time.monotonic()
  page.wait_for_timeout(1050)
  elapsed=time.monotonic()-began
  endFrames=page.evaluate('()=>window.__LEAP_DEBUG__.getRenderer().drawnFrames')
  perf.append({'level':stage,'frames':endFrames-startFrames,'elapsed_sec':round(elapsed,3),'observed_fps':round((endFrames-startFrames)/elapsed,1)})
 print('headless_chromium_fps',json.dumps(perf))
 page.set_viewport_size({'width':390,'height':844})
 page.evaluate('()=>window.__LEAP_DEBUG__.startLevel(1)')
 page.wait_for_timeout(300)
 page.screenshot(path=str(out/'chromium-390x844-viewport-simulation.png'))
 print('mobile_sized_viewport',page.evaluate('()=>({width:innerWidth,height:innerHeight,canvas:document.querySelector("canvas").getBoundingClientRect().toJSON()})'))
 b.close()
# contact sheet 2 cols × 5 rows of original gameplay captures; thumbnails only, do not treat as unique evidence files
thumbw,thumbh=640,360;sheet=Image.new('RGB',(thumbw*2, (thumbh+42)*5),'#0d1d29');draw=ImageDraw.Draw(sheet)
for idx in range(10):
 im=Image.open(out/f'level-{idx+1:02d}.png').convert('RGB').resize((thumbw,thumbh));x=(idx%2)*thumbw;y=(idx//2)*(thumbh+42);sheet.paste(im,(x,y));draw.rectangle((x,y+thumbh,x+thumbw,y+thumbh+42),fill='#142631');draw.text((x+18,y+thumbh+12),f'{idx+1:02d}  {['Enchanted Forest Entrance','Giant Mushroom Valley','Crystal Waterfall Gorge','Treetop Village','Forgotten Temple','Firefly Forest','Misty Swamplands','Underground Root Caverns','Stormwood Highlands','Heart of the Ancient Forest'][idx]}',fill='white')
sheet.save(out/'v14-world1-runtime-comparison.jpg',quality=90)
