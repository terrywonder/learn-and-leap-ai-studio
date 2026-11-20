from PIL import Image, ImageDraw, ImageFilter
import math, random
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=Image.open(root/'docs/visual-references/owner-approved-waterfall-fullscene.png').convert('RGB')
outpath=root/'assets/world1-v142'
outpath.mkdir(parents=True,exist_ok=True)
W,H=1280,720
# The owner's approved image is a flattened composite; only a scenery-only region
# (above all coins, character, portals and platforms) is retained as a texture.
# We use a soft atmospheric extension rather than baking interactive foreground art.
base=Image.new('RGB',(W,H))
pixels=base.load()
for y in range(H):
 for x in range(W):
  # turquoise waterfall mist below the highest uncluttered section
  a=min(1,max(0,(y-300)/420))
  xx=(x-W/2)/W
  pixels[x,y]=(round((90+33*math.cos(xx*math.pi*.8))*(1-a)+91*a),round((174+38*(1-abs(xx)))*(1-a)+183*a),round((197+30*(1-abs(xx)))*(1-a)+211*a))
# the source area y 0..318 includes mountains, trees, sky and cascade,
# but begins to contain gameplay objects further down; exclude the latter.
region=source.crop((0,0,source.width,300)).resize((W,535),Image.Resampling.LANCZOS)
mask=Image.new('L',(W,535));mp=mask.load()
for y in range(535):
 alpha=255 if y<=338 else round(255*max(0,1-(y-338)/197)**1.45)
 for x in range(W): mp[x,y]=alpha
base.paste(region,(0,0),mask)
# Below the fade, preserve legible waterfall flow with a clean patch of water sampled
# from the owner-approved waterfall, not actors/coins/gate.
# Water texture is masked and feathered into the panoramic scene.
water=source.crop((780,130,930,380)).resize((255,480),Image.Resampling.LANCZOS)
wet=Image.new('L',water.size,0)
wpm=wet.load()
for y in range(water.height):
 for x in range(water.width):
  xx=min(x,water.width-1-x)/50
  yy=min(1,(water.height-y)/110)
  a=max(0,min(1,xx))**.7 * max(0,min(1,yy)) * (0.1+0.40*min(1,y/180))
  wpm[x,y]=round(255*a)
base.paste(water,(475,215),wet)
# soft foam and mist rays; no scenery object that could be mistaken for collidable ground
fx=Image.new('RGBA',(W,H),(0,0,0,0));fd=ImageDraw.Draw(fx)
random.seed(1442)
for k in range(36):
 x=360+random.randrange(540); y=482+random.randrange(180); r=random.randrange(34,115)
 fd.ellipse((x-r,y-8,x+r,y+11),fill=(233,251,255,random.randrange(4,19)))
fx=fx.filter(ImageFilter.GaussianBlur(13))
base=Image.alpha_composite(base.convert('RGBA'),fx).convert('RGB')
base.save(outpath/'crystal-waterfall-scenery.webp','WEBP',quality=90,method=6)
# Keep a small manifest explaining approved image derivation and its limits.
(outpath/'ART_SOURCE.md').write_text('''# Crystal Waterfall Background — v14.2\n\nSource: owner-approved `mystical_waterfall_valley_adventure.png`, a flattened illustration supplied in the conversation.\n\nTo avoid doubled hero, platform, coins and gate, ONLY the upper unobstructed scenic area of the approved image is sampled. The lower area is atmospheric matte/soft waterfall texture.\n\nRuntime location: World 1 Level 3 only (Crystal Waterfall Gorge). Gameplay entities, collisions, shrines, platform and gate typography remain dynamically rendered.\n\nThis is an art integration, not the original editable layered PSD/illustration. Side-by-side visual parity with the complete flattened concept cannot be claimed.\n''')
print('Created',outpath/'crystal-waterfall-scenery.webp',(outpath/'crystal-waterfall-scenery.webp').stat().st_size)
