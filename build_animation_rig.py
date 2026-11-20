"""Create individually articulated, transparent visual layers from original Ari art.

Keep the exact original character artwork, recolor nothing, and export body, cape,
rear/front arm and rear/front leg as independently animatable pieces. Collision
geometry remains owned by src/game.js; rig is visual only.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops
import numpy as np
p=Path(__file__).resolve().parent
source=Image.open(p/'assets/ari.png').convert('RGBA')
def clean_transparent(layer):
    pix=np.array(layer)
    pix[pix[:,:,3]==0]=0
    return Image.fromarray(pix,'RGBA')
out=p/'assets/animation/ari'
out.mkdir(parents=True,exist_ok=True)
w,h=source.size
parts={
  'cape':[(39,64),(46,54),(62,43),(76,39),(98,38),(118,48),(138,61),(164,76),(157,92),(136,83),(119,79),(106,85),(72,82),(52,84)],
  'rear-arm':[(111,86),(126,83),(142,94),(149,106),(146,119),(134,131),(109,131),(98,120),(98,107)],
  'back-leg':[(130,136),(157,133),(176,140),(186,154),(165,173),(150,186),(133,187),(115,196),(95,193),(84,185),(99,162),(115,150)],
  'front-leg':[(170,132),(194,128),(206,132),(220,151),(239,154),(261,170),(262,194),(239,206),(216,201),(208,185),(197,170),(173,161)],
  'front-arm':[(203,95),(219,91),(235,93),(253,104),(258,123),(247,137),(219,134),(203,122),(198,106)],
}
used=Image.new('L',source.size,0)
for name,poly in parts.items():
    m=Image.new('L',source.size,0)
    d=ImageDraw.Draw(m);d.polygon(poly,fill=255)
    # Ensure artwork edges keep original alpha, while regions remain disjoint.
    m=ImageChops.subtract(m,used)
    used=ImageChops.lighter(used,m)
    layer=source.copy()
    layer.putalpha(ImageChops.multiply(source.getchannel('A'),m))
    clean_transparent(layer).save(out/(name+'.png'),optimize=True)
base=source.copy()
base.putalpha(ImageChops.multiply(source.getchannel('A'),ImageChops.invert(used)))
clean_transparent(base).save(out/'body.png',optimize=True)
# Pixel-level reconstruction: masks are exact partitions and no image detail is lost.
reconstructed=Image.new('RGBA',source.size)
for name in parts:reconstructed.alpha_composite(Image.open(out/(name+'.png')))
reconstructed.alpha_composite(base)
difference=ImageChops.difference(reconstructed,source)
# RGB pixels under transparent images are immaterial, compare composite against backdrop.
bg=Image.new('RGBA',source.size,(21,44,54,255))
a=Image.alpha_composite(bg,reconstructed); b=Image.alpha_composite(bg,source)
assert ImageChops.difference(a,b).getbbox() is None,ImageChops.difference(a,b).getbbox()
print('PASS: original illustration preserved exactly in six articulated layers; source',source.size)

# Segmented forelimbs and feet for the World 1 Rootkeeper illustration.
# The silhouette is retained, but each piece is controlled independently.
creatures={
 'rootkeeper':{
  'source':'foe-03.webp',
  'parts':{
   'left-arm':[(0,85),(29,73),(57,89),(67,108),(61,137),(56,161),(35,180),(9,174),(0,153)],
   'right-arm':[(114,77),(147,66),(167,84),(167,165),(149,182),(129,171),(117,149),(120,117)],
   'left-leg':[(47,134),(82,130),(92,147),(89,183),(75,203),(51,191),(42,174)],
   'right-leg':[(93,126),(131,124),(144,154),(141,188),(118,206),(94,187),(88,150)],
  },
 },
 'glow-frog':{
  'source':'foe-01.webp',
  'parts':{
   'tail':[(8,90),(24,49),(45,24),(71,17),(98,18),(132,4),(158,11),(197,3),(211,30),(181,69),(151,99),(123,119),(98,127),(76,120),(52,117),(24,132)],
   'left-leg':[(37,133),(79,138),(89,160),(72,181),(49,213),(7,201),(9,169)],
   'right-leg':[(126,130),(170,133),(192,157),(208,185),(186,213),(150,198),(116,165)],
  },
 }
}
for creature,info in creatures.items():
    source=Image.open(p/'assets'/info['source']).convert('RGBA');w,h=source.size
    output=p/'assets/animation'/creature;output.mkdir(parents=True,exist_ok=True)
    used=Image.new('L',source.size,0)
    for name,polygon in info['parts'].items():
        mask=Image.new('L',source.size,0);d=ImageDraw.Draw(mask);d.polygon(polygon,fill=255)
        mask=ImageChops.subtract(mask,used);used=ImageChops.lighter(used,mask)
        layer=source.copy();layer.putalpha(ImageChops.multiply(source.getchannel('A'),mask))
        clean_transparent(layer).save(output/(name+'.png'),optimize=True)
    base=source.copy();base.putalpha(ImageChops.multiply(source.getchannel('A'),ImageChops.invert(used)));clean_transparent(base).save(output/'body.png',optimize=True)
    bg=Image.new('RGBA',source.size,(21,44,54,255));re=Image.new('RGBA',source.size)
    for name in info['parts']:re.alpha_composite(Image.open(output/(name+'.png')))
    re.alpha_composite(base)
    assert ImageChops.difference(Image.alpha_composite(bg,re),Image.alpha_composite(bg,source)).getbbox() is None
    print('PASS:',creature,'exact-preservation',source.size)
