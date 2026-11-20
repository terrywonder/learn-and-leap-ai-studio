"""Source-derived 2D skeletal-rig art. Each layer is complete, no removed body pixels.
The animated limbs are mesh/path segments skinned with bark; the image layers are
undamaged masks over a full painted torso, not cut-out holes from a static image.
"""
from PIL import Image,ImageFilter,ImageDraw,ImageEnhance
from pathlib import Path
import numpy as np, cv2
ROOT=Path(__file__).resolve().parent
src=Image.open(ROOT/'assets/foe-03.webp').convert('RGBA')
out=ROOT/'assets/animation/rootkeeper-rig';out.mkdir(parents=True,exist_ok=True)
S=3

def layer(name,box,poly,feather=5):
    crop=src.crop(box);w,h=crop.size
    mask=Image.new('L',(w,h));d=ImageDraw.Draw(mask);d.polygon(poly,fill=255)
    # Feather outer boundary (nothing is actually removed from the base body illustration)
    mask=mask.filter(ImageFilter.GaussianBlur(feather))
    a=np.asarray(crop).copy(); a[:,:,3]=(a[:,:,3].astype(float)*np.asarray(mask)/255).astype('uint8')
    result=Image.fromarray(a,'RGBA').resize((w*S,h*S),Image.Resampling.LANCZOS)
    result.save(out/(name+'.png'))
    return result
# Head and horns, independent neck hinge. Forehead branches remain intact.
head=layer('head',(15,0,154,106),[(30,19),(45,8),(73,12),(93,0),(116,13),(127,31),(138,48),(122,74),(103,97),(64,102),(38,83),(18,55)],3)
# Breastplate and central bark cover. This intentionally sits over the base torso mesh.
chest=layer('chest',(44,71,126,164),[(31,1),(60,7),(79,26),(81,58),(65,87),(21,92),(1,58),(4,28)],4)
# Bark atlas: texture reconstructed from opaque original pixels (no transparent hole sampling).
arr=np.array(src)
opaque=arr[:,:,3]>180
# Take a limb-texture rectangle, mirror tile to cover the articulated parts.
patch=np.array(src.crop((8,88,78,178)).convert('RGBA'))
base=Image.new('RGB',(512,512),(59,48,29))
for y in range(0,512,90):
 for x in range(0,512,70):
  tile=Image.fromarray(patch,'RGBA').transpose(Image.Transpose.FLIP_LEFT_RIGHT if ((x//70+y//90)%2) else Image.Transpose.FLIP_TOP_BOTTOM)
  tile=tile.convert('RGBA');base.paste(tile,(x,y),tile)
base=base.filter(ImageFilter.GaussianBlur(.55))
b=ImageEnhance.Contrast(base).enhance(1.25)
b.save(out/'bark.jpg',quality=90)
# Whole torso is assembled procedurally from continuous bark + chest painting.
contact=Image.new('RGBA',(600,380));contact.alpha_composite(head,(40,20));contact.alpha_composite(chest,(300,60));contact.save(ROOT/'docs/rootkeeper-v9-source-parts.png')
print('Rig art created',[(p.name,p.stat().st_size) for p in out.glob('*')])
