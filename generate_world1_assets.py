"""Deterministic high-resolution original painterly game assets, local/offline.
No screenshot panels or AI mockups are substituted for playable world entities.
"""
from pathlib import Path
import math, random, io
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import cairosvg
BASE=Path(__file__).resolve().parent/'assets/world1-v6';BASE.mkdir(parents=True,exist_ok=True)
R=random.Random(20261019)

def glow_dot(d,x,y,r,col):
 d.ellipse((x-r,y-r,x+r,y+r),fill=col)

def stonewall():
 W,H=1000,520
 im=Image.new('RGBA',(W,H));a=np.zeros((H,W,4),dtype=np.uint8)
 Y,X=np.indices((H,W));rng=np.random.default_rng(81)
 grain=rng.normal(0,8,(H,W))+7*np.sin(X*.032+Y*.043)
 shade=np.clip(1-.24*(Y/H)+.055*np.sin(X*.007),.58,1.2)
 for k,val in enumerate((73,85,77)):
  a[:,:,k]=np.uint8(np.clip((val+grain)*shade,0,255))
 a[:,:,3]=255; im=Image.fromarray(a,'RGBA');d=ImageDraw.Draw(im,'RGBA')
 # Natural irregular masonry, deeply inset cracks, chipped facets and mineral highlights
 rows=[14,88,166,244,322,403,488];colors=[(97,105,90),(77,89,80),(125,117,96),(69,84,79),(100,101,89),(127,113,89),(83,101,96)]
 for j in range(len(rows)-1):
  y0,y1=rows[j],rows[j+1]
  step=135+(j%2)*13
  off=-R.randint(15,135)
  x=off
  while x<W+30:
   w=step+R.randint(-35,40)
   xa=x+R.randrange(7,17); xb=min(W+28,x+w-R.randrange(3,14))
   top=y0+R.randrange(0,13);bot=y1-R.randrange(6,17)
   pts=[(xa+12,top),(xb-15,top+R.randrange(-5,8)),(xb,top+12),(xb-5,bot-5),(xb-17,bot),(xa+8,bot+R.randrange(-5,6)),(xa-1,bot-12)]
   col=R.choice(colors)
   d.polygon([(xx+4,yy+6) for xx,yy in pts],fill=(14,31,28,190))
   d.polygon(pts,fill=(*col,240))
   d.line(pts[:4],fill=(196,183,143,110),width=3)
   d.line(pts[3:],fill=(22,36,32,110),width=5)
   # fractured facets for dimensional surface
   poly=[(xa+17,top+15),(xb-17,top+9),(xb-28,top+(bot-top)*.46),(xa+26,top+(bot-top)*.7)]
   d.polygon(poly,fill=(183,174,136,R.randrange(12,37)))
   # mineral chips / lichen patches
   for z in range(R.randint(6,13)):
    cx=R.randint(int(xa+10),int(max(xa+12,xb-12)));cy=R.randint(int(top+8),int(max(top+9,bot-8)))
    rr=R.randint(1,5)
    c=R.choice([(203,181,136,105),(173,183,139,140),(49,69,55,130),(19,34,29,95)])
    d.ellipse((cx-rr,cy-rr/2,cx+rr,cy+rr/2),fill=c)
   if R.random()<.38:
    qx=xa+R.randint(22,45);qy=top+R.randint(12,23)
    d.line([(qx,qy),(qx+R.randint(10,40),qy+R.randint(15,38)),(qx+R.randint(5,30),qy+R.randint(35,55))], fill=(17,34,31,160),width=2)
   x+=w
 # seam grooves and roots from top; deeper dark low gradient
 overlay=Image.new('RGBA',(W,H));o=ImageDraw.Draw(overlay,'RGBA')
 for i in range(55):
  x=R.randrange(W);y=R.randrange(H);r=R.randrange(3,16)
  o.ellipse((x-r,y-r/2,x+r,y+r/2),fill=(119,158,76,R.randrange(25,85)))
 for i in range(22):
  x=R.randrange(W);y=R.randrange(130);length=R.randrange(80,240)
  o.line([(x,y),(x+R.randrange(-20,20),y+length*.45),(x+R.randrange(-33,33),y+length)],fill=(22,56,36,R.randrange(120,205)),width=R.randrange(3,8))
 im=Image.alpha_composite(im,overlay)
 im.save(BASE/'cliff-masonry.webp',quality=91,method=4)

def ledge():
 W,H=1000,245;im=Image.new('RGBA',(W,H));d=ImageDraw.Draw(im,'RGBA')
 # natural structural ledge, uneven ground and beveled carved cliff edge
 d.polygon([(0,44),(29,27),(88,37),(142,27),(236,34),(308,22),(398,30),(471,22),(548,33),(633,22),(738,30),(816,20),(928,31),(1000,20),(1000,192),(953,186),(910,215),(845,203),(790,229),(728,209),(646,221),(564,205),(496,234),(422,205),(358,227),(305,194),(248,220),(172,193),(115,211),(56,187),(0,200)],fill=(72,77,58,255))
 # stratified dark soil, stone embedded, occluded cracks
 d.polygon([(0,61),(1000,58),(1000,183),(945,198),(782,205),(620,202),(500,222),(310,201),(120,195),(0,186)],fill=(79,83,65,240))
 for i in range(85):
  x=R.randrange(-20,W);y=R.randrange(62,200);w=R.randrange(22,100);h=R.randrange(12,37)
  pts=[(x,y),(x+w*.72,y-R.randint(2,12)),(x+w,y+h*.38),(x+w*.68,y+h),(x,y+h*.83)]
  d.polygon([(xx+3,yy+5) for xx,yy in pts],fill=(17,34,30,R.randint(80,170)))
  c=R.choice([(114,105,86,212),(98,108,92,220),(84,93,81,220),(148,128,91,220)])
  d.polygon(pts,fill=c);d.line(pts[:3],fill=(194,178,121,115),width=2)
 # roots and vines cascading off ledge
 for i in range(21):
  x=R.randrange(W);y=R.randrange(69,140);v=R.randrange(50,112)
  pts=[(x,y),(x+R.randrange(-21,20),y+v*.46),(x+R.randrange(-13,25),y+v)]
  d.line(pts,fill=(24,62,41,210),width=R.randrange(3,8))
  d.line([(z-1,w) for z,w in pts],fill=(96,132,61,115),width=1)
 # mossy crown: layers of tiny organic leaves with glimmer flowers
 d.polygon([(0,24),(69,17),(159,24),(238,13),(317,22),(442,14),(533,20),(649,13),(725,25),(827,13),(933,19),(1000,13),(1000,81),(0,81)],fill=(38,93,53,245))
 for i in range(1600):
  x=R.randrange(-5,W+5);y=R.randint(0,72);rr=R.randint(1,10)
  col=R.choice([(39,100,42,225),(68,120,45,220),(97,151,62,220),(135,180,74,255),(172,205,90,220),(207,220,116,210),(23,73,53,240)])
  d.ellipse((x-rr,y-rr/3,x+rr,y+rr/3),fill=col)
 # highlight edging adds dimensional lighting and separations
 d.line([(0,20),(100,12),(245,17),(390,9),(533,14),(721,10),(885,11),(1000,9)],fill=(231,235,147,190),width=4)
 for i in range(50):
  x=R.randrange(10,W-10);y=R.randrange(5,45)
  if R.random()<.35:
   d.ellipse((x-4,y-4,x+4,y+4),fill=R.choice([(238,202,145,230),(245,174,207,230),(250,227,159,210)]))
 im.save(BASE/'living-ledge.webp',quality=92,method=4)

def flora():
 W,H=430,380;im=Image.new('RGBA',(W,H));d=ImageDraw.Draw(im,'RGBA')
 # individually articulated fern fronds and flowers rather than circular clumps
 for stem in range(24):
  ox=R.randint(70,W-60); oy=R.randint(H-95,H-20); ang=R.uniform(-1.28,1.28); length=R.randint(110,290); ex=ox+math.sin(ang)*length*.58; ey=oy-length
  d.line([(ox,oy),(ex,ey)],fill=(46,98,55,225),width=R.randint(3,6))
  for j in range(9):
   t=j/10;px=ox+(ex-ox)*t;py=oy+(ey-oy)*t
   leaflen=(14+28*math.sin(t*math.pi))*(.8+R.random()*.6)
   for sg in [-1,1]:
    ex2=px+sg*leaflen+math.sin(ang)*11;ey2=py-10-R.randint(4,16)
    col=R.choice([(33,91,58,245),(67,129,65,240),(88,150,77,240),(127,175,83,225),(169,190,90,235)])
    d.polygon([(px,py),(px+sg*leaflen*.55,py-12),(ex2,ey2),(px+sg*leaflen*.3,py+4)],fill=col)
 for f in range(10):
  x=R.randint(75,W-75);y=R.randint(115,H-43);d.line((x,y+50,x,y),fill=(73,127,53,230),width=3)
  n=R.randint(5,8);palette=R.choice([[(251,225,178,238),(250,189,172,239)],[(239,206,250,230),(218,175,244,225)],[(253,231,165,240),(255,239,200,240)]])
  for a in range(n):
   ang=a*2*math.pi/n;px=x+math.cos(ang)*10;py=y+math.sin(ang)*10
   d.ellipse((px-7,py-11,px+7,py+11),fill=palette[a%2])
  d.ellipse((x-7,y-7,x+7,y+7),fill=(238,173,61,250))
 im.save(BASE/'ferns-and-blossoms.png')

def hanging():
 W,H=300,320;im=Image.new('RGBA',(W,H));d=ImageDraw.Draw(im,'RGBA');R2=random.Random(509)
 for k in range(12):
  x=R2.randint(18,W-20);start=R2.randrange(12,60);end=R2.randrange(150,300);swing=R2.randrange(-35,35)
  d.line([(x,start),(x+swing/2,(start+end)/2),(x+swing,end)],fill=(35,78,43,240),width=R2.randint(2,7))
  for j in range(7):
   t=j/7;xx=x+swing*t;yy=start+(end-start)*t
   side=1 if j%2 else -1
   pts=[(xx,yy),(xx+side*R2.randint(10,20),yy-12),(xx+side*R2.randint(13,29),yy+6),(xx+side*3,yy+11)]
   d.polygon(pts,fill=R2.choice([(36,91,43,240),(77,140,61,245),(121,162,75,235)]))
 im.save(BASE/'cascade-vines.png')

def stoneArch():
 # textured ornate rune shrine, center open for dynamic subject glyph, subject label and interaction
 W,H=540,690
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 540 690">
 <defs><linearGradient id="granite" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e6dcbd"/><stop offset=".25" stop-color="#94846b"/><stop offset=".65" stop-color="#5e6056"/><stop offset="1" stop-color="#343d39"/></linearGradient><linearGradient id="inner" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#122f37"/><stop offset=".47" stop-color="#16383e"/><stop offset="1" stop-color="#1e3039"/></linearGradient><linearGradient id="gold" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff1bb"/><stop offset=".38" stop-color="#cc9b4c"/><stop offset=".7" stop-color="#987644"/><stop offset="1" stop-color="#e8c37a"/></linearGradient><radialGradient id="magic"><stop stop-color="#b9fff1" stop-opacity=".65"/><stop offset=".48" stop-color="#4acfe4" stop-opacity=".32"/><stop offset="1" stop-color="#163c4b" stop-opacity="0"/></radialGradient><filter id="shadow"><feGaussianBlur stdDeviation="9"/></filter></defs>
 <!-- floating ambient aura --> <ellipse cx="270" cy="299" rx="240" ry="290" fill="url(#magic)" opacity=".65"/>
 <!-- grounded stair base --> <path d="M44 625 L496 625 522 669 18 669 Z" fill="#3b4e41" stroke="#ccbc8f" stroke-width="8"/><path d="M57 611 L480 611 498 637 42 637 Z" fill="url(#granite)" stroke="#ead49b" stroke-width="6"/>
 <!-- stone arch curved silhouette -->
 <path d="M53 625 L58 271 C58 104 144 30 267 28 C402 30 479 112 483 271 L489 625 398 625 394 270 C391 180 347 120 270 118 C190 120 145 177 145 270 L143 625 Z" fill="url(#granite)" stroke="#3f483f" stroke-width="17"/>
 <path d="M146 627 L148 271 C147 178 195 120 269 118 C345 118 393 184 392 271 L391 625" fill="none" stroke="#f3d9a0" stroke-width="12"/><path d="M157 621 L161 271 C162 192 199 135 270 133 C336 135 376 197 378 271 L379 619" fill="none" stroke="#66daef" stroke-width="7" opacity=".85"/>
 <path d="M71 615 L73 275 C74 143 150 43 267 42 C380 42 463 143 466 275 L472 615" fill="none" stroke="#e5ddbe" stroke-width="4" opacity=".7"/>
 <path d="M75 399 L142 409 M81 520 L141 531 M400 416 L469 407 M400 527 L465 515 M108 150 L169 182 M368 179 L430 148 M240 45 L238 119 M312 49 L304 120" fill="none" stroke="#433c32" stroke-width="11" opacity=".9"/>
 <path d="M78 407 L140 417 M83 529 L138 537 M399 424 L468 413 M399 535 L462 524" fill="none" stroke="#d8c89a" stroke-width="3"/>
 <!-- gold leaf filigree carved into keystone --> <path d="M269 45 L318 92 270 138 221 91 Z" fill="url(#gold)" stroke="#5f4932" stroke-width="9"/><path d="M269 50 L291 92 269 121 246 92 Z" fill="#5bcbda" stroke="#daf9ee" stroke-width="5"/>
 <path d="M268 61 L281 88 268 106 257 88 Z" fill="#b7ffff"/><g fill="none" stroke="url(#gold)" stroke-width="6"><path d="M117 309 Q95 288 106 261 Q139 266 137 292"/><path d="M422 310 Q442 293 432 259 Q400 264 403 289"/><path d="M115 369 q35 -31 22 -64 M424 369 q-35 -31 -21 -64"/></g>
 <!-- transparent center; interactive subject text drawn by game -->
 <g stroke="#aaddb1" stroke-width="3" fill="none" opacity=".8"><circle cx="104" cy="223" r="9"/><circle cx="436" cy="223" r="9"/><circle cx="108" cy="480" r="9"/><circle cx="433" cy="480" r="9"/></g>
 <!-- name plaque --> <path d="M124 543 Q270 531 416 543 L437 592 Q270 604 103 592 Z" fill="#344f44" stroke="url(#gold)" stroke-width="11"/><path d="M140 551 Q270 544 400 551" fill="none" stroke="#e9d297" stroke-width="3"/>
 <!-- vines follow real carved stone edges -->
 <path d="M71 162 Q30 194 37 235 Q61 269 50 330 M451 160 Q504 194 493 250 Q477 279 492 344" fill="none" stroke="#224e37" stroke-width="16"/><path d="M71 160 Q31 194 35 232 Q60 264 50 330 M451 158 Q504 194 490 248 Q473 276 492 340" fill="none" stroke="#599347" stroke-width="6"/>
 </svg>'''
 png=cairosvg.svg2png(bytestring=svg.encode(),output_width=540,output_height=690)
 im=Image.open(io.BytesIO(png)).convert('RGBA');d=ImageDraw.Draw(im,'RGBA')
 # fern leaves growing around arch shoulders, individual carved gems and blooms
 for seed in range(74):
  theta=R.random()*math.pi*1.6+.17
  centerx=60+R.random()*105 if seed%2 else 385+R.random()*98
  centery=R.randint(160,420)
  cx=centerx+math.sin(theta)*9;cy=centery
  dx=R.randint(-24,23);dy=R.randint(-25,20)
  d.ellipse((cx-9,cy-5,cx+9,cy+5),fill=R.choice([(48,113,53,235),(98,166,70,245),(144,194,85,220)]))
 for x,y in [(81,520),(460,501),(91,190),(450,173)]:
  for n in range(5):
   a=n*2*math.pi/5;xx=x+math.cos(a)*12;yy=y+math.sin(a)*12
   d.ellipse((xx-9,yy-5,xx+9,yy+5),fill=(251,222,174,235))
  d.ellipse((x-5,y-5,x+5,y+5),fill=(248,180,87,255))
 im.save(BASE/'rune-shrine.png')

if __name__=='__main__':
 stonewall();ledge();flora();hanging();stoneArch();print('Generated detailed World 1 environment sprites in',BASE)

def scrollPanel():
 W,H=930,730;im=Image.new('RGBA',(W,H));d=ImageDraw.Draw(im,'RGBA')
 # gold inlaid wooden magic book frame + warm readable parchment center
 d.rounded_rectangle((8,9,W-8,H-9),radius=58,fill=(44,63,43,255),outline=(235,195,119,255),width=12)
 d.rounded_rectangle((24,24,W-24,H-24),radius=46,fill=(112,75,43,255),outline=(85,48,29,255),width=18)
 d.rounded_rectangle((42,44,W-42,H-44),radius=33,fill=(224,201,159,255),outline=(249,222,161,255),width=9)
 Y,X=np.indices((H-114,W-114));rng=np.random.default_rng(5)
 grains=rng.normal(0,2.4,(H-114,W-114))+3*np.sin(X*.028+Y*.06)
 base=np.stack([249+grains,231+grains,190+grains*.65,np.full_like(grains,255)],axis=-1).clip(0,255).astype('uint8')
 paper=Image.fromarray(base,'RGBA')
 mask=Image.new('L',(W-114,H-114));ImageDraw.Draw(mask).rounded_rectangle((0,0,W-114-1,H-114-1),radius=22,fill=255)
 im.paste(paper,(57,57),mask)
 d=ImageDraw.Draw(im,'RGBA')
 d.rounded_rectangle((60,60,W-60,H-60),radius=25,outline=(196,154,93,125),width=4)
 # carved vine arabesques around border, not into answer area
 for y in (30,H-31):
  for i in range(34):
   x=47+i*25
   d.ellipse((x-12,y-4,x+12,y+5),fill=R.choice([(59,111,61,225),(114,158,75,220),(180,188,91,220)]))
 for x in (35,W-35):
  for i in range(17):
   y=70+i*35
   d.ellipse((x-7,y-15,x+7,y+15),fill=(51+R.randrange(40),108+R.randrange(35),49,225))
 for x,y in ((38,39),(W-38,39),(38,H-39),(W-38,H-39)):
  d.ellipse((x-26,y-26,x+26,y+26),fill=(108,82,44,255),outline=(248,213,135,255),width=6)
  d.polygon([(x,y-18),(x+15,y),(x,y+18),(x-15,y)],fill=(100,204,192,245),outline=(248,235,178,255))
 # decorative top crown, oval crest left empty for runic game subject heading
 d.rounded_rectangle((332,20,598,78),radius=27,fill=(38,84,64,255),outline=(240,199,114,255),width=7)
 im.save(BASE/'question-parchment.png')

if __name__=='__main__':
 scrollPanel()
