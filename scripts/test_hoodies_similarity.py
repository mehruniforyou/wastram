import os, sys, json, re
from PIL import Image
import numpy as np
import colorsys

dir_path = 'public/hoodies-sweatshirts'
files = sorted([f for f in os.listdir(dir_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])

def get_garment_info(f):
    p = os.path.join(dir_path, f)
    im = Image.open(p).convert('RGB')
    w, h = im.size
    crop = im.crop((int(w*0.20), int(h*0.20), int(w*0.80), int(h*0.80)))
    arr = np.array(crop)
    mask = ~((arr[:,:,0] > 220) & (arr[:,:,1] > 220) & (arr[:,:,2] > 220))
    valid = arr[mask] if np.any(mask) else arr.reshape(-1, 3)
    med = np.median(valid, axis=0).astype(int).tolist()
    
    gray = crop.convert('L').resize((9, 8), Image.Resampling.LANCZOS)
    dh = (np.array(gray)[:, 1:] > np.array(gray)[:, :-1]).flatten()
    return {'file': f, 'rgb': med, 'dh': dh, 'w': w, 'h': h}

img_cache = {f: get_garment_info(f) for f in files}

# Current products in data/hoodies-sweatshirts.ts
txt = open('data/hoodies-sweatshirts.ts', encoding='utf-8').read()
m = re.search(r'=\s*(\[[\s\S]*?\]);\s*$', txt)
prods = json.loads(m.group(1))

print(f"Loaded {len(prods)} current products in hoodies-sweatshirts.")

# Check pairwise visual similarity between products
# A product's visual signature is its primary image's dHash & RGB
for i in range(len(prods)):
    p1 = prods[i]
    img1 = p1.get('images', [''])[0].replace('/hoodies-sweatshirts/', '')
    if img1 not in img_cache: continue
    f1 = img_cache[img1]
    
    for j in range(i+1, len(prods)):
        p2 = prods[j]
        img2 = p2.get('images', [''])[0].replace('/hoodies-sweatshirts/', '')
        if img2 not in img_cache: continue
        f2 = img_cache[img2]
        
        dh_match = np.count_nonzero(f1['dh'] == f2['dh']) / 64.0
        rgb_dist = np.linalg.norm(np.array(f1['rgb']) - np.array(f2['rgb']))
        
        if dh_match >= 0.88 and rgb_dist < 30:
            print(f"IDENTICAL DUPLICATE: [{p1['id']} {p1['title']}] and [{p2['id']} {p2['title']}] (struct={dh_match*100:.1f}%, rgb_dist={rgb_dist:.1f})")
        elif dh_match >= 0.82 and rgb_dist >= 45:
            print(f"COLOR VARIANT: [{p1['id']} {p1['title']}] and [{p2['id']} {p2['title']}] (struct={dh_match*100:.1f}%, rgb_dist={rgb_dist:.1f})")
