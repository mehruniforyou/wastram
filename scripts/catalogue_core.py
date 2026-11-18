import os, sys, json, re, urllib.parse
from PIL import Image
import numpy as np
import colorsys
from collections import defaultdict

def classify_color(rgb):
    r, g, b = [x / 255.0 for x in rgb]
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    h_deg = h * 360.0
    hex_code = '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))
    
    if v < 0.22:
        return 'Midnight Black', '#18181B'
    if s < 0.12 and v > 0.78:
        return 'Ivory Cream', '#FAF7F2'
    if s < 0.16:
        if v > 0.55:
            return 'Pebble Grey', '#94A3B8'
        else:
            return 'Charcoal Slate', '#334155'
            
    if h_deg < 15 or h_deg >= 345:
        if v < 0.45:
            return 'Ruby Crimson', '#991B1B'
        elif s < 0.45 or v > 0.75:
            return 'Blush Rose', '#FB7185'
        else:
            return 'Scarlet Red', '#DC2626'
    elif 15 <= h_deg < 42:
        if v < 0.50:
            return 'Rust Terracotta', '#C2410C'
        elif s > 0.60:
            return 'Sunset Tangerine', '#EA580C'
        else:
            return 'Warm Caramel', '#D97706'
    elif 42 <= h_deg < 70:
        if v < 0.45:
            return 'Bronze Ochre', '#854D0E'
        elif s < 0.40:
            return 'Sand Ochre', '#CA8A04'
        else:
            return 'Mustard Gold', '#EAB308'
    elif 70 <= h_deg < 165:
        if v < 0.40:
            return 'Forest Emerald', '#14532D'
        elif s < 0.35:
            return 'Sage Olive', '#4D7C0F'
        else:
            return 'Emerald Green', '#16A34A'
    elif 165 <= h_deg < 210:
        if v < 0.45:
            return 'Deep Teal', '#115E59'
        elif s < 0.35:
            return 'Teal Slate', '#0E7490'
        else:
            return 'Aqua Marine', '#06B6D4'
    elif 210 <= h_deg < 260:
        if v < 0.35:
            return 'Midnight Navy', '#1E1B4B'
        elif s < 0.35:
            return 'Steel Slate', '#475569'
        elif v < 0.60:
            return 'Indigo Royal', '#1D4ED8'
        else:
            return 'Sky Azure', '#38BDF8'
    elif 260 <= h_deg < 315:
        if v < 0.45:
            return 'Plum Wine', '#581C87'
        else:
            return 'Lavender Violet', '#7C3AED'
    elif 315 <= h_deg < 345:
        if v < 0.50:
            return 'Berry Magenta', '#831843'
        else:
            return 'Orchid Pink', '#DB2777'
            
    return 'Artisan Earth', hex_code

IMAGE_FEATURE_CACHE = {}

def get_image_features(rel_path):
    if rel_path in IMAGE_FEATURE_CACHE:
        return IMAGE_FEATURE_CACHE[rel_path]
    clean = rel_path.lstrip('/')
    if not os.path.exists(clean):
        clean = os.path.join('public', clean)
    if not os.path.exists(clean):
        clean = urllib.parse.unquote(clean)
    if not os.path.exists(clean):
        return None
    try:
        im = Image.open(clean).convert('RGB')
        w, h = im.size
        # Crop garment central region
        crop = im.crop((int(w * 0.20), int(h * 0.20), int(w * 0.80), int(h * 0.80)))
        arr = np.array(crop)
        # Background mask (> 220 in all channels)
        mask = ~((arr[:, :, 0] > 220) & (arr[:, :, 1] > 220) & (arr[:, :, 2] > 220))
        valid = arr[mask] if np.any(mask) else arr.reshape(-1, 3)
        med_rgb = np.median(valid, axis=0).astype(int).tolist()
        
        # dHash 8x8
        gray = crop.convert('L').resize((9, 8), Image.Resampling.LANCZOS)
        g_arr = np.array(gray)
        dh = (g_arr[:, 1:] > g_arr[:, :-1]).flatten()
        
        c_name, c_hex = classify_color(med_rgb)
        
        # Extract filename metadata
        fn = os.path.basename(clean)
        meta = {'type': 'other', 'seq': 0, 'family': ''}
        if fn.startswith('_MG_'):
            m = re.search(r'_MG_(\d+)', fn)
            meta = {'type': 'mg', 'seq': int(m.group(1)) if m else 0, 'family': 'mg'}
        elif fn.startswith('IMG-'):
            m = re.search(r'IMG-(\d+)-WA(\d+)', fn)
            if m:
                meta = {'type': 'wa', 'seq': int(m.group(2)), 'family': m.group(1)}
        elif fn.startswith('FB_IMG_'):
            m = re.search(r'FB_IMG_(\d+)', fn)
            meta = {'type': 'fb', 'seq': int(m.group(1)) if m else 0, 'family': 'fb'}
        elif re.match(r'^\d+\.jpg', fn):
            m = re.search(r'^(\d+)', fn)
            meta = {'type': 'num', 'seq': int(m.group(1)) if m else 0, 'family': 'num'}
        elif re.match(r'^[0-9a-f]{32}', fn):
            stem = fn[:32]
            meta = {'type': 'hash', 'seq': 0, 'family': stem}
            
        res = {
            'path': rel_path,
            'filename': fn,
            'rgb': med_rgb,
            'dh': dh,
            'w': w,
            'h': h,
            'color_name': c_name,
            'color_hex': c_hex,
            'meta': meta
        }
        IMAGE_FEATURE_CACHE[rel_path] = res
        return res
    except Exception as e:
        return None

def cluster_images_for_product(images):
    """
    Given a list of images confirmed to belong to the same product design,
    group them into distinct color variants.
    """
    if not images:
        return []
    
    variants = []
    for img_path in images:
        feat = get_image_features(img_path)
        if not feat:
            rgb = [128, 128, 128]
            c_name = 'Artisan Earth'
            c_hex = '#888888'
        else:
            rgb = feat['rgb']
            c_name = feat['color_name']
            c_hex = feat['color_hex']
            
        matched_var = None
        for v in variants:
            dist = np.linalg.norm(np.array(rgb) - np.array(v['rep_rgb']))
            if dist < 35 or (c_name == v['name'] and dist < 50):
                matched_var = v
                break
                
        if matched_var:
            if img_path not in matched_var['images']:
                matched_var['images'].append(img_path)
        else:
            variants.append({
                'id': f"var-{len(variants) + 1}",
                'name': c_name,
                'colorCode': c_hex,
                'rep_rgb': rgb,
                'images': [img_path]
            })
            
    for v in variants:
        del v['rep_rgb']
        
    return variants

print("Visual clustering core ready.")
