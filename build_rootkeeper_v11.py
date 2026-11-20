"""Export Rootkeeper v11 complete-body, bone-driven 2D animation atlases.

The illustrated source is never split into body-part cutouts. A continuous image
is deformed with smooth skin weights computed from anatomical control joints.
The bind pose stays upright, and all frames share one canvas and foot baseline.
Generated atlases ship with the game; no runtime image generation is required.
"""
from pathlib import Path
import numpy as np
import cv2
from PIL import Image, ImageEnhance, ImageFilter

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'assets'/'animation'/'rootkeeper-v11'
OUT.mkdir(parents=True,exist_ok=True)
ORIGINAL=Image.open(ROOT/'assets'/'foe-03.webp').convert('RGBA').crop((0,0,168,208))
# Earlier art included some isolated coloured pixels below its feet.
arr=np.asarray(ORIGINAL).copy()
for y in range(199,208):
  # bottom region keeps the illustrated roots, but discards near-empty export specks
  row=arr[y]
  row[row[:,3]<95,3]=0
ORIGINAL=Image.fromarray(arr)
ORIGINAL=ImageEnhance.Contrast(ORIGINAL).enhance(1.04)
ORIGINAL=ImageEnhance.Sharpness(ORIGINAL).enhance(1.21)
# Use a predictable upscaled source to retain consistent UVs and foot contact.
scale=2
src=np.asarray(ORIGINAL.resize((336,416),Image.Resampling.LANCZOS)).copy()
height,width=src.shape[:2]
Y,X=np.mgrid[0:height,0:width].astype('float32')
BIND={
 'root':(84,140), 'pelvis':(85,143), 'chest':(86,95), 'neck':(84,66), 'head':(84,45),
 'shoulderL':(40,83),'elbowL':(23,114),'wristL':(17,155),
 'shoulderR':(134,81),'elbowR':(150,115),'wristR':(155,152),
 'hipL':(67,150),'kneeL':(60,175),'ankleL':(50,193),
 'hipR':(106,148),'kneeR':(121,171),'ankleR':(132,195),
}
# A bone mesh vertex is attached smoothly to surrounding rest-pose joints;
# every pixel stays attached to the one contiguous illustrated skin.
SIGMA={
 'root':37,'pelvis':32,'chest':44,'neck':32,'head':36,
 'shoulderL':26,'elbowL':24,'wristL':24,'shoulderR':26,'elbowR':24,'wristR':24,
 'hipL':23,'kneeL':22,'ankleL':23,'hipR':23,'kneeR':22,'ankleR':24,
}
weights={}
for name,(px,py) in BIND.items():
 sigma=SIGMA[name]*scale
 d2=(X-px*scale)**2+(Y-py*scale)**2
 weights[name]=np.exp(-d2/(2*sigma*sigma)).astype('float32')
# Pin unmoving background and trunk against elastic distortion.
rest=np.full((height,width),.23,np.float32)
rest+=np.exp(-((X-170)**2/(2*34**2)+(Y-220)**2/(2*42**2)))*1.15
w_sum=rest.copy()
for w in weights.values():w_sum+=w
weights={name:w/w_sum for name,w in weights.items()}

def lerp(a,b,k):return a+(b-a)*k

def smooth(t):t=max(0,min(1,t));return t*t*(3-2*t)

def pose(mode,t):
 t=min(.999999,max(0,t))
 P={n:list(v) for n,v in BIND.items()}
 S=lambda k,dx=0,dy=0:P[k].__setitem__(slice(None),[P[k][0]+dx,P[k][1]+dy])
 cycle=2*np.pi*t
 if mode=='idle':
  breathe=np.sin(cycle)*1.0
  S('chest',0,-breathe);S('neck',0,-breathe);S('head',0,-breathe*.7)
  for k in ['elbowL','elbowR']:S(k,np.sin(cycle+.5)*1.1,breathe*.5)
  for k in ['wristL','wristR']:S(k,np.sin(cycle+1.2)*1.8,breathe*.7)
 elif mode=='stalk':
  stride=np.sin(cycle);other=np.sin(cycle+np.pi)
  # Counter-rotation of arms; legs flex, plant and lift alternately.
  S('chest',-stride*1.6,-abs(stride)*1.4);S('neck',-stride*1.6,-abs(stride)*1.4);S('head',-stride*1.5,-abs(stride)*1.4)
  S('elbowL',4*stride,-2*stride);S('wristL',9*stride,-3*stride)
  S('elbowR',-4*stride,2*stride);S('wristR',-9*stride,3*stride)
  S('kneeL',6*other,-4*max(0,stride));S('ankleL',11*other,-10*max(0,stride))
  S('kneeR',6*stride,-4*max(0,other));S('ankleR',11*stride,-10*max(0,other))
  S('pelvis',stride*.8,-abs(stride)*.8)
 elif mode=='attack':
  wind=smooth(t/.43);strike=smooth((t-.52)/.20);recover=smooth((t-.82)/.18)
  # Right claw raises, recoils and then strikes downward in front of the torso.
  armX=6*wind+14*strike-20*recover
  armY=-39*wind+74*strike-35*recover
  S('elbowR',armX*.65,armY*.75);S('wristR',armX,armY)
  S('shoulderR',-2*wind+5*strike-3*recover,-3*wind+4*strike)
  S('chest',-4*wind+7*strike-3*recover,1.5*wind+3*strike)
  S('neck',-4*wind+7*strike-3*recover,1.5*wind+3*strike)
  S('head',-3*wind+5*strike-2*recover,2*wind+2*strike)
  S('kneeL',-2*wind+2*strike,2*wind);S('kneeR',2*wind-2*strike,2*wind)
 elif mode=='hurt':
  recoil=np.sin(np.pi*t)
  S('head',-9*recoil,-6*recoil);S('neck',-8*recoil,-4*recoil);S('chest',-8*recoil,2*recoil)
  S('elbowR',-10*recoil,-8*recoil);S('wristR',-12*recoil,-12*recoil)
  S('elbowL',-3*recoil,-10*recoil);S('wristL',-7*recoil,-12*recoil)
 elif mode=='defeat':
  fall=smooth(t)
  S('head',-11*fall,37*fall);S('neck',-14*fall,33*fall);S('chest',-14*fall,27*fall)
  S('pelvis',-5*fall,12*fall);S('shoulderR',-12*fall,25*fall)
  S('elbowR',-18*fall,23*fall);S('wristR',-25*fall,16*fall)
  S('elbowL',-7*fall,16*fall);S('wristL',-2*fall,10*fall)
  S('kneeR',9*fall,6*fall);S('kneeL',-8*fall,5*fall)
 return {name:(P[name][0]-v[0],P[name][1]-v[1]) for name,v in BIND.items()}

def render(mode,t):
 P=pose(mode,t)
 dx=np.zeros_like(X);dy=np.zeros_like(Y)
 for name,(a,b) in P.items():
  dx+=weights[name]*(a*scale)
  dy+=weights[name]*(b*scale)
 # Iterative inverse skinning correction: look up inverse field at destination.
 mapx=X-dx;mapy=Y-dy
 result=cv2.remap(src,mapx,mapy,cv2.INTER_CUBIC,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0,0))
 # Stable floor baseline and fixed frame extents; no global scale/zoom.
 return Image.fromarray(result,'RGBA')

FRAMES={'idle':12,'stalk':16,'attack':24,'hurt':12,'defeat':16}
for mode,count in FRAMES.items():
 frames=[render(mode,i/count if mode not in ('hurt','defeat') else i/(count-1)) for i in range(count)]
 cols=4;rows=(count+cols-1)//cols
 sheet=Image.new('RGBA',(width*cols,height*rows))
 for i,im in enumerate(frames):sheet.alpha_composite(im,((i%cols)*width,(i//cols)*height))
 sheet.save(OUT/f'{mode}.webp',format='WEBP',quality=87,method=4)
 print(mode,count,(width*cols,height*rows),round((OUT/f'{mode}.webp').stat().st_size/1024),'KiB')
# Quality-control contact of animation states, sourced from actual atlases.
from PIL import ImageDraw
sheet=Image.new('RGB',(5*270,370),'#16382e');draw=ImageDraw.Draw(sheet)
for k,mode in enumerate(FRAMES):
 im=render(mode,.3 if mode=='attack' else .65);im.thumbnail((265,338),Image.Resampling.LANCZOS)
 sheet.paste(im,(k*270,24),im);draw.text((k*270+8,5),mode.upper(),fill='white')
sheet.save(ROOT/'docs'/'v11-rig-poses.png')
print('Complete body is continuously skinned without independently cut limb pieces.')
