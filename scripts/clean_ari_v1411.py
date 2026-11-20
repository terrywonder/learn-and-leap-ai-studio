"""Reproducibly remove detached segmentation debris from Ari's original art layers.

This is deliberately not an AI redraw. The alpha shape and original RGB pixels of
all retained primary components are preserved. Only detached islands and practically
invisible one-bit halo pixels are discarded. Original approved PNGs remain intact.

Usage: python scripts/clean_ari_v1411.py
Requires Pillow (for the asset build only, not to run the game).
"""
from collections import deque
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT/'assets'/'animation'/'ari'
SOURCES = {
    'body.png': 'body-v1411-clean.png',
    'front-arm.png': 'front-arm-v1411-clean.png',
}
ALPHA_THRESHOLD = 20

def primary_region(a, width, height):
    visited = bytearray(width*height)
    best = set()
    count = 0
    for py in range(height):
        for px in range(width):
            start=py*width+px
            if visited[start] or a[start] <= ALPHA_THRESHOLD:
                continue
            visited[start]=1
            q=deque([start]); region=set()
            while q:
                pos=q.popleft(); region.add(pos)
                y,x=divmod(pos,width)
                for dy in (-1,0,1):
                    ny=y+dy
                    if ny<0 or ny>=height: continue
                    for dx in (-1,0,1):
                        nx=x+dx
                        if nx<0 or nx>=width or (dx==dy==0): continue
                        ni=ny*width+nx
                        if not visited[ni] and a[ni] > ALPHA_THRESHOLD:
                            visited[ni]=1;q.append(ni)
            count+=1
            if len(region)>len(best): best=region
    return best,count

def cleanup(filename, output):
    image=Image.open(ART/filename).convert('RGBA');width,height=image.size
    pixels=list(image.getdata());mask=[pixel[3] for pixel in pixels]
    retain,components=primary_region(mask,width,height)
    # Keep feathered original antialias pixels only within one pixel of the
    # visible main component; do not remove or change retained RGB artwork.
    expanded=set(retain)
    for pos in retain:
        y,x=divmod(pos,width)
        for dy in (-1,0,1):
            for dx in (-1,0,1):
                nx=x+dx;ny=y+dy
                if 0<=nx<width and 0<=ny<height:expanded.add(ny*width+nx)
    cleaned=[];removed=0;removed_nonzero=0
    for i, rgba in enumerate(pixels):
        if i not in expanded or rgba[3]<=2:
            if rgba[3]:removed+=1
            if rgba[3]>ALPHA_THRESHOLD:removed_nonzero+=1
            cleaned.append((0,0,0,0))
        else:
            cleaned.append(rgba)
    result=Image.new('RGBA',image.size);result.putdata(cleaned)
    result.save(ART/output, optimize=True)
    print(f'{filename} -> {output}: components={components}, removed-alpha-pixels={removed}, removed-visible-pixels={removed_nonzero}, remaining-alpha-pixels={sum(p[3]>20 for p in cleaned)}')

if __name__=='__main__':
    for source,target in SOURCES.items():cleanup(source,target)
