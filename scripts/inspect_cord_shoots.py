import os, re
from PIL import Image
import numpy as np
import colorsys

dir_path = 'public/cord-sets'
files = [f for f in os.listdir(dir_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

print(f"Total files in {dir_path}: {len(files)}")

# Group by shoot prefix
shoots = {}
for f in files:
    if f.startswith('_MG_'):
        m = re.search(r'_MG_(\d+)', f)
        key = ('_MG_', 0)
        num = int(m.group(1)) if m else 0
    elif f.startswith('Screenshot_'):
        m = re.search(r'Screenshot_(\d+)', f)
        key = ('Screenshot', 0)
        num = int(m.group(1)) if m else 0
    elif f.startswith('IMG-'):
        m = re.search(r'IMG-(\d+)-WA(\d+)', f)
        key = ('WA', m.group(1) if m else '0')
        num = int(m.group(2)) if m else 0
    elif f.startswith('FB_IMG_'):
        m = re.search(r'FB_IMG_(\d+)', f)
        key = ('FB', 0)
        num = int(m.group(1)) if m else 0
    elif re.match(r'^\d+\.jpg', f):
        m = re.search(r'^(\d+)', f)
        key = ('NUM', 0)
        num = int(m.group(1)) if m else 0
    else:
        key = ('HASH', 0)
        num = 0
    shoots.setdefault(key, []).append((num, f))

for k, v in sorted(shoots.items(), key=lambda x: str(x[0])):
    v.sort(key=lambda x: x[0])
    print(f"Shoot family {k}: {len(v)} files (from {v[0][1]} to {v[-1][1]})")
