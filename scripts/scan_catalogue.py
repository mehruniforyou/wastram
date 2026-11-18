import os, sys, re, json
from PIL import Image
import numpy as np
import colorsys

CATEGORIES_META = [
  {"file": "cord-sets.ts", "category": "cord-sets", "name": "Co-ord Sets", "folder": "public/cord-sets", "base_price": 2199, "prefix": "cs"},
  {"file": "umbrella-dresses.ts", "category": "umbrella-dresses", "name": "Umbrella Dresses", "folder": "public/umbrella-dresses", "base_price": 1999, "prefix": "ud"},
  {"file": "denim-collection.ts", "category": "denim-collection", "name": "Denim Collection", "folder": "public/denim-collection", "base_price": 2499, "prefix": "dn"},
  {"file": "hoodies-sweatshirts.ts", "category": "hoodies-sweatshirts", "name": "Hoodies & Sweatshirts", "folder": "public/hoodies-sweatshirts", "base_price": 1899, "prefix": "hd"},
  {"file": "t-shirts.ts", "category": "t-shirts", "name": "T-Shirts", "folder": "public/t-shirts", "base_price": 899, "prefix": "ts"},
  {"file": "tops-shirts.ts", "category": "tops-shirts", "name": "Tops & Shirts", "folder": "public/tops-shirts", "base_price": 1299, "prefix": "tp"},
  {"file": "ethnic-wear-sets.ts", "category": "ethnic-wear-sets", "name": "Ethnic Wear Sets", "folder": "public/ethnic-wear-sets", "base_price": 2799, "prefix": "ew"},
  {"file": "short-long-kaftan.ts", "category": "short-long-kaftan", "name": "Kaftans (Short & Long)", "folder": "public/short-long-kaftan", "base_price": 1699, "prefix": "kf"},
  {"file": "traditional-gowns.ts", "category": "traditional-gowns", "name": "Traditional Gowns", "folder": "public/traditional-gowns", "base_price": 3499, "prefix": "tg"},
  {"file": "western-dresses.ts", "category": "western-dresses", "name": "Western Dresses", "folder": "public/western-dresses", "base_price": 1899, "prefix": "wd"}
]

def get_garment_features(img_path):
    # Normalize path
    clean = img_path.lstrip('/')
    if not os.path.exists(clean):
        clean = os.path.join('public', clean)
    if not os.path.exists(clean):
        # try unquoting
        import urllib.parse
        clean = urllib.parse.unquote(clean)
    if not os.path.exists(clean):
        return None
    try:
        im = Image.open(clean).convert('RGB')
        w, h = im.size
        # Crop garment center (20% to 80% width, 20% to 80% height)
        crop = im.crop((int(w * 0.20), int(h * 0.20), int(w * 0.80), int(h * 0.80)))
        arr = np.array(crop)
        # Background filter (studio background > 220)
        mask = ~((arr[:, :, 0] > 220) & (arr[:, :, 1] > 220) & (arr[:, :, 2] > 220))
        valid = arr[mask] if np.any(mask) else arr.reshape(-1, 3)
        med_rgb = np.median(valid, axis=0).astype(int)
        
        # dHash 8x8
        gray = crop.convert('L').resize((9, 8), Image.Resampling.LANCZOS)
        g_arr = np.array(gray)
        dh = (g_arr[:, 1:] > g_arr[:, :-1]).flatten()
        return {'rgb': med_rgb.tolist(), 'dh': dh, 'w': w, 'h': h}
    except Exception as e:
        return None

print("Engine ready.")
