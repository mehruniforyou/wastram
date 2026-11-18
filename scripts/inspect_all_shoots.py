import os, re
from PIL import Image
import numpy as np

def inspect_category_shoots(cat_folder):
    files = sorted([f for f in os.listdir(cat_folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    
    # Group by shoot signature
    # In fashion photography, a shoot is characterized by:
    # 1. Filename prefix and sequence (camera roll _MG_ sequence, WA date + sequence, FB timestamp range, numeric range, or hash stem)
    shoots = []
    curr_shoot = [files[0]]
    
    def get_file_meta(fn):
        if fn.startswith('_MG_'):
            m = re.search(r'_MG_(\d+)', fn)
            return ('MG', '', int(m.group(1)) if m else 0, fn)
        elif fn.startswith('IMG-'):
            m = re.search(r'IMG-(\d+)-WA(\d+)', fn)
            return ('WA', m.group(1) if m else '', int(m.group(2)) if m else 0, fn)
        elif fn.startswith('FB_IMG_'):
            m = re.search(r'FB_IMG_(\d+)', fn)
            return ('FB', '', int(m.group(1)) if m else 0, fn)
        elif re.match(r'^\d+\.jpg', fn):
            m = re.search(r'^(\d+)', fn)
            return ('NUM', '', int(m.group(1)) if m else 0, fn)
        elif re.match(r'^[0-9a-f]{32}', fn):
            stem = fn[:32]
            return ('HASH', stem, 0, fn)
        else:
            return ('OTHER', fn[:15], 0, fn)

    metas = [get_file_meta(f) for f in files]
    
    shoots = []
    curr = [metas[0]]
    for i in range(1, len(metas)):
        prev = metas[i-1]
        c = metas[i]
        
        is_same = False
        if c[0] == prev[0]:
            if c[0] == 'MG' and (c[2] - prev[2] <= 4):
                is_same = True
            elif c[0] == 'WA' and c[1] == prev[1] and (c[2] - prev[2] <= 6):
                is_same = True
            elif c[0] == 'FB' and (c[2] - prev[2] <= 45000):
                is_same = True
            elif c[0] == 'NUM' and (c[2] - prev[2] <= 8):
                is_same = True
            elif c[0] == 'HASH' and c[1] == prev[1]:
                is_same = True
                
        if is_same:
            curr.append(c)
        else:
            shoots.append([x[3] for x in curr])
            curr = [c]
    if curr:
        shoots.append([x[3] for x in curr])
        
    return shoots

categories = [
    ('cord-sets', 'public/cord-sets'),
    ('umbrella-dresses', 'public/umbrella-dresses'),
    ('denim-collection', 'public/denim-collection'),
    ('hoodies-sweatshirts', 'public/hoodies-sweatshirts'),
    ('t-shirts', 'public/t-shirts'),
    ('tops-shirts', 'public/tops-shirts'),
    ('ethnic-wear-sets', 'public/ethnic-wear-sets'),
    ('short-long-kaftan', 'public/short-long-kaftan'),
    ('traditional-gowns', 'public/traditional-gowns'),
    ('western-dresses', 'public/western-dresses')
]

for name, folder in categories:
    if os.path.exists(folder):
        shoots = inspect_category_shoots(folder)
        img_count = sum(len(s) for s in shoots)
        print(f"{name:<22}: {img_count} images -> {len(shoots)} authentic shoot designs")
