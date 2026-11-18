import os, sys, json, re
from catalogue_core import get_image_features, cluster_images_for_product, classify_color
import numpy as np

# Load original cluster definitions from scripts/generate_hoodies.js
txt = open('scripts/generate_hoodies.js', encoding='utf-8').read()

# Current products in data/hoodies-sweatshirts.ts
cur_txt = open('data/hoodies-sweatshirts.ts', encoding='utf-8').read()
m = re.search(r'=\s*(\[[\s\S]*?\]);\s*$', cur_txt)
raw_prods = json.loads(m.group(1))

# Build a lookup of which old products had which images
old_prod_by_img = {}
for p in raw_prods:
    for img in p.get('images', []):
        old_prod_by_img.setdefault(img, []).append(p)

print(f"Loaded {len(raw_prods)} raw products, mapped across {len(old_prod_by_img)} images.")

# Let's inspect the files in public/hoodies-sweatshirts
files = sorted([f for f in os.listdir('public/hoodies-sweatshirts') if f.lower().endswith(('.jpg', '.jpeg', '.png'))])

# Group files by true garment design
# 1. Numeric files (16885 to 16951)
numeric_files = sorted([f for f in files if re.match(r'^\d+\.jpg', f)], key=lambda x: int(re.search(r'^\d+', x).group(0)))

# Let's see step-by-step distance between adjacent numeric files
num_clusters = []
curr_num = [numeric_files[0]]
for i in range(1, len(numeric_files)):
    prev_f = numeric_files[i-1]
    cur_f = numeric_files[i]
    prev_info = get_image_features(f"/hoodies-sweatshirts/{prev_f}")
    cur_info = get_image_features(f"/hoodies-sweatshirts/{cur_f}")
    
    # Gap in file numbers
    num_diff = cur_info['meta']['seq'] - prev_info['meta']['seq']
    rgb_dist = np.linalg.norm(np.array(cur_info['rgb']) - np.array(prev_info['rgb']))
    dh_match = np.count_nonzero(cur_info['dh'] == prev_info['dh']) / 64.0
    
    # If same design: num_diff <= 2, OR high structural match and color match
    if (num_diff <= 2 and dh_match >= 0.70) or (num_diff <= 1):
        # But if shoot changed (e.g. 5 shots per hoodie)
        if len(curr_num) >= 5:
            num_clusters.append(curr_num)
            curr_num = [cur_f]
        else:
            curr_num.append(cur_f)
    else:
        num_clusters.append(curr_num)
        curr_num = [cur_f]
if curr_num:
    num_clusters.append(curr_num)

print(f"Numeric files ({len(numeric_files)} imgs) clustered into {len(num_clusters)} distinct designs:")
for idx, c in enumerate(num_clusters):
    print(f"  Design {idx+1} ({len(c)} imgs): {c}")

# 2. FB files
fb_files = sorted([f for f in files if f.startswith('FB_IMG_')], key=lambda x: int(re.search(r'FB_IMG_(\d+)', x).group(1)))
fb_clusters = []
curr_fb = [fb_files[0]]
for i in range(1, len(fb_files)):
    prev_f = fb_files[i-1]
    cur_f = fb_files[i]
    prev_t = int(re.search(r'FB_IMG_(\d+)', prev_f).group(1))
    cur_t = int(re.search(r'FB_IMG_(\d+)', cur_f).group(1))
    if (cur_t - prev_t <= 30000) and len(curr_fb) < 5:
        curr_fb.append(cur_f)
    else:
        fb_clusters.append(curr_fb)
        curr_fb = [cur_f]
if curr_fb:
    fb_clusters.append(curr_fb)

print(f"\nFB files ({len(fb_files)} imgs) clustered into {len(fb_clusters)} distinct designs:")
for idx, c in enumerate(fb_clusters):
    print(f"  Design {idx+1} ({len(c)} imgs): {c}")

# 3. Hash files
hash_files = sorted([f for f in files if re.match(r'^[0-9a-f]{32}', f)])
hash_stems = defaultdict(list)
for f in hash_files:
    stem = f[:32]
    hash_stems[stem].append(f)

print(f"\nHash files ({len(hash_files)} imgs) clustered into {len(hash_stems)} distinct designs:")
for stem, c in hash_stems.items():
    print(f"  Design {stem[:8]} ({len(c)} imgs): {c}")
