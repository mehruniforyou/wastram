import os, glob
from PIL import Image
import numpy as np

def get_image_features(filepath):
    try:
        im = Image.open(filepath).convert('RGB')
        w, h = im.size
        # Center crop garment
        crop = im.crop((int(w * 0.15), int(h * 0.15), int(w * 0.85), int(h * 0.85)))
        small = crop.resize((32, 32), Image.Resampling.LANCZOS)
        arr = np.asarray(small)
        
        # Dominant color
        mask = ~((arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230))
        valid_pixels = arr[mask] if np.any(mask) else arr.reshape(-1, 3)
        med_rgb = np.median(valid_pixels, axis=0).astype(int)
        
        # dHash
        gray = crop.convert('L').resize((9, 8), Image.Resampling.LANCZOS)
        g_arr = np.asarray(gray)
        dh = (g_arr[:, 1:] > g_arr[:, :-1]).flatten()
        
        return {
            'file': os.path.basename(filepath),
            'rgb': tuple(med_rgb),
            'dh': dh,
            'aspect': round(w / h, 2)
        }
    except Exception as e:
        return None

def hamming_dist(h1, h2):
    return np.count_nonzero(h1 != h2)

# Test on MG files in cord-sets
mg_files = sorted([f for f in os.listdir('public/cord-sets') if f.startswith('_MG_')])
print(f'Testing on {len(mg_files)} _MG_ files in cord-sets...')
features = [get_image_features(os.path.join('public/cord-sets', f)) for f in mg_files]
features = [f for f in features if f is not None]

# Compare sequential
for i in range(len(features) - 1):
    f1 = features[i]
    f2 = features[i+1]
    dist = hamming_dist(f1['dh'], f2['dh'])
    rgb_diff = np.linalg.norm(np.array(f1['rgb']) - np.array(f2['rgb']))
    print(f"{f1['file']} -> {f2['file']}: hash_dist={dist:2}, color_dist={rgb_diff:5.1f}, rgb1={f1['rgb']}, rgb2={f2['rgb']}")
