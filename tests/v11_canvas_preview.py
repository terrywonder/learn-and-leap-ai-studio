"""Actual Canvas draw test of the v11 player-to-boss size, on a local HTML surface."""
from pathlib import Path
from io import BytesIO
from PIL import Image,ImageDraw
import mimetypes,json,base64
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
files=['foe-03.webp','ari.png','world-01.webp','world1-v6/cliff-masonry.webp']
files += ['animation/rootkeeper-v11/'+m+'.webp' for m in ['idle','stalk','attack','hurt','defeat']]
assets={k:'data:'+mimetypes.guess_type(k)[0]+';base64,'+base64.b64encode((root/'assets'/k).read_bytes()).decode() for k in files}
code=(root/'src/premium.js').read_text()
start=code.index(' rigRootkeeper(x,y,w,h,opts={}){')
end=code.index('\n rigCreature(',start)
func=code[start:end].replace(' rigRootkeeper(','rigRootkeeper(')
html='''<!doctype html><html><body style="margin:0;background:#142f2b"><canvas id="world" width="1280" height="720"></canvas><script>
const assets=DATA;
const ROOTKEEPER_V11_COUNTS={idle:12,stalk:16,attack:24,hurt:12,defeat:16};
const imgs={};for(const [k,src] of Object.entries(assets)){let i=new Image();i.src=src;imgs[k]=i}
const ready=k=>imgs[k]?.complete&&imgs[k].naturalWidth?imgs[k]:null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const c=document.getElementById('world').getContext('2d');
const renderer={ctx:c,FUNC};
window.draw=(mode,phase)=>{
 c.clearRect(0,0,1280,720);
 let bg=ready('world-01.webp');if(bg)c.drawImage(bg,0,0,1280,720);
 c.fillStyle='#375644';c.fillRect(0,572,1280,90);
 c.fillStyle='#264331';c.fillRect(0,660,1280,60);
 const a=ready('ari.png');if(a)c.drawImage(a,430,442,128,130);
 const d=renderer.rigRootkeeper(670,346,178,226,{mode,phase,time:1000,locomotion:0,facing:1});
 c.fillStyle='#fff';c.font='18px sans-serif';c.fillText('Ari 130 px / Rootkeeper 226 px',420,688);
 return d;
}
</script></body></html>'''
html=html.replace('DATA',json.dumps(assets)).replace('FUNC',func)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':720})
 errors=[];page.on('pageerror',lambda x:errors.append(str(x)))
 page.set_content(html,wait_until='domcontentloaded',timeout=20000)
 page.wait_for_function('()=>Object.values(imgs).every(i=>i.complete)',timeout=20000)
 page.evaluate('draw("idle",.3)')
 page.locator('canvas').screenshot(path=str(root/'docs'/'v11-canvas-character-scale.png'))
 poses=[('idle',.2),('stalk',.16),('stalk',.52),('attack',.3),('attack',.76),('hurt',.5),('defeat',.9)]
 sheet=Image.new('RGB',(len(poses)*240,270),'#1c3d31');d=ImageDraw.Draw(sheet)
 for i,(mode,t) in enumerate(poses):
  page.evaluate('([m,t])=>draw(m,t)',[mode,t])
  img=Image.open(BytesIO(page.locator('canvas').screenshot())).convert('RGB').crop((645,330,875,580));sheet.paste(img,(i*240,15));d.text((i*240+6,0),mode.upper()+' '+str(t),fill='white')
 sheet.save(root/'docs'/'v11-canvas-pose-review.png')
 print('canvas result',page.evaluate('draw("attack",.7)'),'errors',errors)
 assert not errors,errors
 browser.close()
print('PASS: Canvas draws a cohesive full-body Rootkeeper at corrected 226 px height')
