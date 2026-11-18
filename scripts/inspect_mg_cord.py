import os, re
from PIL import Image
import numpy as np
import colorsys

dir_path = 'public/cord-sets'
mg_files = sorted([f for f in os.listdir(dir_path) if f.startswith('_MG_')])

def get_image_info(filename):
    p = os.path.join(dir_path, filename)
    im = Image.open(p).convert('RGB')
    w, h = im.size
    crop = im.crop((int(w*0.25), int(h*0.25), int(w*0.75), int(h*0.75)))
    arr = np.array(crop)
    mask = ~((arr[:,:,0] > 220) & (arr[:,:,1] > 220) & (arr[:,:,2] > 220))
    if not np.any(mask):
        med = [128, 128, 128]
    else:
        med = np.median(arr[mask], axis=0).astype(int).tolist()
    
    # 8x8 dhash
    gray = crop.convert('L').resize((9, 8), Image.Resampling.LANCZOS)
    g_arr = np.array(gray)
    dh = (g_arr[:, 1:] > g_arr[:, :-1]).flatten()
    
    r, g, b = [x / 255.0 for x in med]
    h_val, s_val, v_val = colorsys.rgb_to_hsv(r, g, b)
    
    return {'file': filename, 'rgb': med, 'hsv': (round(h_val*360, 1), round(s_val, 2), round(v_val, 2)), 'dh': dh}

infos = [get_image_info(f) for f in mg_files]

for i in range(len(infos)):
    cur = infos[i]
    diff_prev = ""
    if i > 0:
        prev = infos[i-1]
        dh_dist = np.count_nonzero(cur['dh'] != prev['dh'])
        rgb_dist = np.linalg.norm(np.array(cur['rgb']) - np.array(prev['rgb']))
        diff_prev = f" | dist to prev: dH={dh_dist:2d}, rgb={rgb_dist:5.1f}"
    print(f"{cur['file']:<22} rgb={cur['rgb']} hsv={cur['hsv']}{diff_prev}")
