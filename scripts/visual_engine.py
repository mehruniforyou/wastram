import os, glob
from PIL import Image
import numpy as np

def analyze_image(path):
    if not os.path.exists(path):
        return None
    try:
        im = Image.open(path)
        w, h = im.size
        # Center crop garment area (skip face and floor)
        crop_box = (int(w * 0.15), int(h * 0.20), int(w * 0.85), int(h * 0.85))
        cropped = im.crop(crop_box).resize((64, 64), Image.Resampling.LANCZOS)
        arr = np.asarray(cropped.convert('RGB'))
        
        # Mask out white/light studio background
        non_bg = ~((arr[:, :, 0] > 220) & (arr[:, :, 1] > 220) & (arr[:, :, 2] > 220))
        if np.any(non_bg):
            pixels = arr[non_bg]
        else:
            pixels = arr.reshape(-1, 3)
            
        mean_rgb = np.median(pixels, axis=0).astype(int)
        
        # dHash
        gray = cropped.convert('L').resize((9, 8), Image.Resampling.LANCZOS)
        g_arr = np.asarray(gray)
        dh = (g_arr[:, 1:] > g_arr[:, :-1]).flatten()
        
        return {
            'rgb': tuple(mean_rgb),
            'dh': dh,
            'aspect': round(w / h, 2)
        }
    except Exception as e:
        return None

def color_name_from_rgb(rgb):
    r, g, b = rgb
    # Basic named color classifier
    if r > 180 and g > 180 and b > 180:
        return 'Ivory Cream', '#FAF7F2'
    if r < 50 and g < 50 and b < 50:
        return 'Midnight Onyx', '#1E1E1E'
    if r > 130 and g < 70 and b < 70:
        return 'Crimson Maroon', '#881337'
    if r > 160 and g > 80 and b < 80:
        return 'Terracotta Rust', '#C2410C'
    if r > 160 and g > 130 and b < 80:
        return 'Mustard Ochre', '#D97706'
    if b > 110 and b > r + 20 and b > g:
        return 'Indigo Royal Blue', '#1E3A8A'
    if g > 100 and g > r and g > b:
        return 'Sage Olive Green', '#15803D'
    if r > 160 and g > 120 and b > 120 and r > g + 20:
        return 'Blush Rose', '#FB7185'
    if r > 150 and b > 130 and g < 100:
        return 'Plum Berry', '#701A75'
    if r > 100 and g > 100 and b > 100 and abs(r - g) < 20 and abs(g - b) < 20:
        return 'Charcoal Slate', '#475569'
    return 'Artisan Natural', f'#{r:02x}{g:02x}{b:02x}'

print('Visual analysis engine ready!')
