"""v14.1 image-boundary regression for the previously missing rear boot.
Requires Pillow. Screen-level/physical-device review still mandatory.
"""
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
assets=ROOT/'assets/animation/ari'
a=Image.open(assets/'back-leg.png').convert('RGBA').getchannel('A')
b=Image.open(assets/'back-leg-v141.png').convert('RGBA').getchannel('A')
assert a.size==b.size==(285,235)
rect=(65,174,125,212)
old=sum(px>100 for px in a.crop(rect).getdata())
new=sum(px>100 for px in b.crop(rect).getdata())
assert new>=old+700,(old,new)
assert b.getbbox()[0]<a.getbbox()[0]
assert b.getbbox()[3]>a.getbbox()[3]
for n in ('body','front-leg','rear-arm','front-arm','cape'):
 im=Image.open(assets/f'{n}.png').convert('RGBA')
 assert im.size==(285,235),n
print(f'PASS v14.1 alpha integrity: rear boot region opaque pixels {old} -> {new}, all 6 Ari sprite layers 285x235; original artwork retained.')
