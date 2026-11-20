from PIL import Image,ImageEnhance,ImageOps,ImageFilter
from pathlib import Path
import colorsys
base=Path(__file__).resolve().parent
out=base/'assets/stage-forest'
out.mkdir(exist_ok=True)
source=[Image.open(base/'assets/world-01.webp').convert('RGB'),Image.open(base/'assets/premium/whispering_woods_backdrop.webp').convert('RGB'),Image.open(base/'assets/forest-matte.webp').convert('RGB')]
shifts=[(-0.10,0),(0.07,0.02),(0.15,0.01),(-.06,.00),(.08,.02),(-.03,.08),(.13,.02),(-.08,.03),(.04,.05),(0,0)]
tints=['#fbd7aa','#89d6b2','#d3eee8','#ffd5a1','#789bd3','#8ab4c6','#d6beaa','#ffd5c0','#7d7abb','#9fdda5']
indices=[0,1,2,1,0,2,1,0,2,0]
for i in range(10):
 im=source[indices[i]]
 w,h=im.size
 scale=[1.0,1.07,1.11,1.07,1.13,1.09,1.08,1.14,1.12,1.07][i]
 crop_w=int(w/scale);crop_h=int(crop_w*9/16)
 if crop_h>h:crop_h=int(h/scale);crop_w=int(crop_h*16/9)
 sx,sy=shifts[i];left=int(max(0,min(w-crop_w,(w-crop_w)*(.5+sx*2))));top=int(max(0,min(h-crop_h,(h-crop_h)*(.5+sy*3))))
 im=im.crop((left,top,left+crop_w,top+crop_h)).resize((1600,900),Image.Resampling.LANCZOS)
 if i in [3,7,8]: im=ImageOps.mirror(im)
 im=ImageEnhance.Color(im).enhance([1.07,1.12,.78,1.2,.8,.8,.88,1.13,.72,1.2][i])
 im=ImageEnhance.Contrast(im).enhance([1.02,1.06,.86,1.1,1.1,.85,.97,1.07,.87,1.13][i])
 import numpy as np
 a=np.asarray(im).astype('float32');color=tuple(int(tints[i][j:j+2],16) for j in (1,3,5))
 strength=[.10,.10,.20,.11,.27,.18,.17,.12,.29,.12][i]
 a=a*(1-strength)+np.array(color)[None,None,:]*strength
 if i in (2,5,8):
  yy=np.linspace(0,1,900)[:,None,None];a=a*(1-.11*yy)+np.array([195,216,220])[None,None,:]*(.11*yy)
 im=Image.fromarray(a.clip(0,255).astype('uint8'),'RGB')
 im.save(out/f'{i+1:02}.webp',quality=86,method=3)
print('Produced ten distinct scene treatments for World 1 using existing licensed-to-this-project artwork.')
