import os, re
from PIL import Image
import numpy as np

def get_img_color_and_hash(filepath):
    try:
        im = Image.open(filepath).convert('RGB')
        w, h = im.size
        crop = im.crop((int(w * 0.15), int(h * 0.15), int(w * 0.85), int(h * 0.85)))
        small = crop.resize((32, 32), Image.Resampling.LANCZOS)
        arr = np.asarray(small)
        mask = ~((arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230))
        valid = arr[mask] if np.any(mask) else arr.reshape(-1, 3)
        med_rgb = np.median(valid, axis=0).astype(int)
        
        gray = crop.convert('L').resize((9, 8), Image.Resampling.LANCZOS)
        g_arr = np.asarray(gray)
        dh = (g_arr[:, 1:] > g_arr[:, :-1]).flatten()
        return {'rgb': tuple(med_rgb), 'dh': dh, 'w': w, 'h': h}
    except Exception as e:
        return None

def color_name_from_rgb(rgb):
    r, g, b = rgb
    if r > 190 and g > 190 and b > 190:
        return 'Ivory Cream', '#FAF7F2'
    if r < 55 and g < 55 and b < 55:
        return 'Midnight Black', '#18181B'
    if r > 140 and g < 75 and b < 75:
        return 'Ruby Crimson', '#991B1B'
    if r > 170 and g > 70 and b < 70:
        return 'Rust Terracotta', '#C2410C'
    if r > 170 and g > 130 and b < 70:
        return 'Mustard Gold', '#D97706'
    if b > 120 and b > r + 15 and b > g + 15:
        return 'Indigo Royal', '#1E3A8A'
    if g > 110 and g > r + 10 and g > b + 10:
        return 'Sage Olive', '#166534'
    if r > 160 and g > 120 and b > 130 and r > g + 15:
        return 'Blush Rose', '#FB7185'
    if r > 130 and b > 120 and g < 100:
        return 'Plum Berry', '#701A75'
    if r > 110 and g > 120 and b > 130 and abs(r - g) < 25:
        return 'Steel Slate', '#475569'
    return 'Artisan Earth', f'#{r:02x}{g:02x}{b:02x}'

print('Loaded color analysis functions.')
