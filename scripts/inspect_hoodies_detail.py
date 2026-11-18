import json, re, os
import numpy as np

txt = open('data/hoodies-sweatshirts.ts', encoding='utf-8').read()
m = re.search(r'=\s*(\[[\s\S]*?\]);\s*$', txt)
prods = json.loads(m.group(1))

print(f"Total products in hoodies-sweatshirts.ts: {len(prods)}")

all_assigned_images = []
for p in prods:
    imgs = p.get('images', [])
    all_assigned_images.extend(imgs)

print(f"Total image references: {len(all_assigned_images)}, Unique images: {len(set(all_assigned_images))}")

# Check for duplicate titles or Edition N
title_map = {}
for p in prods:
    t = p['title']
    title_map.setdefault(t, []).append(p['id'])

print(f"Unique titles: {len(title_map)}")
for t, ids in title_map.items():
    if len(ids) > 1:
        print(f"Duplicate title '{t}': {ids}")

# Check base titles (stripping Edition N)
base_map = {}
for p in prods:
    b = re.sub(r'\s*Edition \d+', '', p['title'], flags=re.I).strip()
    base_map.setdefault(b, []).append((p['id'], p['title'], p.get('images', [])))

print(f"\nUnique base titles: {len(base_map)}")
for b, items in base_map.items():
    print(f"Base: '{b}' -> {len(items)} listings:")
    for id, title, imgs in items:
        print(f"   [{id}] {title} ({len(imgs)} imgs): {imgs}")
