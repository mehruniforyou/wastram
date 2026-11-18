import os, re
from PIL import Image
import numpy as np
import colorsys

files = sorted(os.listdir('public/denim-collection'))
print(f"Total denim images: {len(files)}")

def get_garment_info(f):
    im = Image.open(os.path.join('public/denim-collection', f)).convert('RGB')
    w, h = im.size
    crop = im.crop((int(w*0.25), int(h*0.25), int(w*0.75), int(h*0.75)))
    arr = np.array(crop)
    mask = ~((arr[:,:,0] > 220) & (arr[:,:,1] > 220) & (arr[:,:,2] > 220))
    valid = arr[mask] if np.any(mask) else arr.reshape(-1, 3)
    med = np.median(valid, axis=0).astype(int).tolist()
    
    gray = crop.convert('L').resize((9, 8), Image.Resampling.LANCZOS)
    dh = (np.array(gray)[:, 1:] > np.array(gray)[:, :-1]).flatten()
    
    r, g, b = [x / 255.0 for x in med]
    h_val, s_val, v_val = colorsys.rgb_to_hsv(r, g, b)
    
    m = re.search(r'IMG-(\d+)-WA(\d+)', f)
    date = m.group(1) if m else ''
    num = int(m.group(2)) if m else 0
    return {'file': f, 'date': date, 'num': num, 'rgb': med, 'hsv': (round(h_val*360, 1), round(s_val, 2), round(v_val, 2)), 'dh': dh}

infos = [get_garment_info(f) for f in files]

# Find sequences of WA numbers on the same date with similar color
groups = []
curr = [infos[0]]
for i in range(1, len(infos)):
    prev = infos[i-1]
    cur = infos[i]
    wa_diff = cur['num'] - prev['num']
    rgb_dist = np.linalg.norm(np.array(cur['rgb']) - np.array(prev['rgb']))
    dh_dist = np.count_nonzero(cur['dh'] != prev['dh'])
    
    # Same shoot if:
    # 1. contiguous or small gap WA numbers on same date (< 25) AND similar color (rgb_dist < 45)
    # OR identical colorway/model session (rgb_dist < 25 and dh_dist < 28)
    if cur['date'] == prev['date'] and ((wa_diff <= 25 and rgb_dist < 45) or (wa_diff <= 50 and rgb_dist < 25)):
        curr.append(cur)
    else:
        groups.append(curr)
        curr = [cur]
if curr:
    groups.append(curr)

print(f"Detected {len(groups)} natural photoshoot groups from 162 denim images:")
for idx, g in enumerate(groups):
    files_str = ', '.join([x['file'] for x in g[:3]])
    if len(g) > 3:
        files_str += f" ... (+{len(g)-3} more)"
    print(f"Group {idx+1} ({len(g)} imgs): avg_rgb={np.mean([x['rgb'] for x in g], axis=0).astype(int).tolist()} | {files_str}")
