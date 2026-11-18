import os, sys, json, re, urllib.parse
from PIL import Image
import numpy as np
import colorsys
from collections import defaultdict
from meta_definitions import CATEGORIES_META

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
        crop = im.crop((int(w * 0.20), int(h * 0.20), int(w * 0.80), int(h * 0.80)))
        arr = np.array(crop)
        mask = ~((arr[:, :, 0] > 220) & (arr[:, :, 1] > 220) & (arr[:, :, 2] > 220))
        valid = arr[mask] if np.any(mask) else arr.reshape(-1, 3)
        med_rgb = np.median(valid, axis=0).astype(int).tolist()
        
        gray = crop.convert('L').resize((9, 8), Image.Resampling.LANCZOS)
        g_arr = np.array(gray)
        dh = (g_arr[:, 1:] > g_arr[:, :-1]).flatten()
        
        c_name, c_hex = classify_color(med_rgb)
        
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

def slugify(text):
    s = text.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

def cluster_images_for_product(images):
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
            if dist < 35 or (c_name == v['name'] and dist < 55):
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

def process_category(cat_meta):
    cat_id = cat_meta['category']
    file_path = os.path.join('data', cat_meta['file'])
    folder_path = cat_meta['folder']
    
    print(f"\n==================================================")
    print(f"Processing Category: {cat_meta['name']} ({cat_id})")
    print(f"==================================================")
    
    # 1. Load existing raw products
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.search(r'export const ([A-Z_]+): NishoramaProduct\[\] = (\[[\s\S]*?\]);\s*$', content)
    if not m:
        print(f"Could not parse array in {file_path}")
        return 0
    var_name = m.group(1)
    raw_products = json.loads(m.group(2))
    
    # Map old slugs and IDs by image
    image_to_old_slugs = defaultdict(set)
    image_to_old_ids = defaultdict(set)
    for p in raw_products:
        p_id = p.get('id', '')
        p_slug = p.get('slug', '')
        old_slugs = set(p.get('aliasSlugs', []))
        if p_slug: old_slugs.add(p_slug)
        if p_id: 
            old_slugs.add(p_id)
            old_slugs.add(f"product-{p_id}")
            
        for img in p.get('images', []):
            clean_img = img.split('?')[0]
            norm_img = urllib.parse.unquote(clean_img)
            image_to_old_slugs[norm_img].update(old_slugs)
            image_to_old_slugs[clean_img].update(old_slugs)
            image_to_old_ids[norm_img].add(p_id)
            image_to_old_ids[clean_img].add(p_id)
            
    # 2. Gather all physical image files in category folder (including subfolders)
    all_cat_images = []
    if os.path.exists(folder_path):
        for root, _, files in os.walk(folder_path):
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    rel = os.path.relpath(os.path.join(root, file), 'public').replace('\\', '/')
                    all_cat_images.append('/' + rel)
                    
    # Also include any images from raw_products if they belong to this category
    for p in raw_products:
        for img in p.get('images', []):
            clean_img = img.split('?')[0]
            if clean_img not in all_cat_images and os.path.exists('public' + urllib.parse.unquote(clean_img)):
                all_cat_images.append(clean_img)
                
    print(f"Found {len(all_cat_images)} total physical images for {cat_id}.")
    
    # 3. Extract features for all images
    feats = []
    for img in all_cat_images:
        f = get_image_features(img)
        if f:
            feats.append(f)
            
    print(f"Extracted features for {len(feats)} images.")
    
    # 4. Sort images by shoot metadata to preserve sequence
    def sort_key(item):
        meta = item['meta']
        return (meta['type'], meta['family'], meta['seq'], item['filename'])
        
    feats.sort(key=sort_key)
    
    # 5. Natural photoshoot & visual clustering into unique product designs
    # Two images belong to the same product design if:
    # A) Contiguous shoot sequence (same type, family, seq delta <= 4 for camera roll, <= 5 for WA, <= 45s for FB, or same hash stem)
    # AND structural similarity >= 70%
    # B) OR visual similarity >= 88% (identical/duplicate design shot)
    product_clusters = []
    curr_cluster = [feats[0]]
    
    for i in range(1, len(feats)):
        prev = feats[i-1]
        cur = feats[i]
        
        same_family = (cur['meta']['type'] == prev['meta']['type']) and (cur['meta']['family'] == prev['meta']['family'])
        
        is_shoot_continuous = False
        if same_family:
            t = cur['meta']['type']
            if t == 'mg' and (cur['meta']['seq'] - prev['meta']['seq'] <= 4):
                is_shoot_continuous = True
            elif t == 'wa' and (cur['meta']['seq'] - prev['meta']['seq'] <= 5):
                is_shoot_continuous = True
            elif t == 'fb' and (cur['meta']['seq'] - prev['meta']['seq'] <= 45000):
                is_shoot_continuous = True
            elif t == 'num' and (cur['meta']['seq'] - prev['meta']['seq'] <= 8):
                is_shoot_continuous = True
            elif t == 'hash':
                is_shoot_continuous = True
                
        dh_match = np.count_nonzero(cur['dh'] == prev['dh']) / 64.0
        rgb_dist = np.linalg.norm(np.array(cur['rgb']) - np.array(prev['rgb']))
        
        # Max cluster size 12 images per product to avoid runaway grouping
        should_group = False
        if len(curr_cluster) < 12:
            if is_shoot_continuous and (dh_match >= 0.65 or rgb_dist < 40):
                should_group = True
            elif dh_match >= 0.88 and rgb_dist < 25: # Near identical duplicate shot
                should_group = True
                
        if should_group:
            curr_cluster.append(cur)
        else:
            product_clusters.append(curr_cluster)
            curr_cluster = [cur]
            
    if curr_cluster:
        product_clusters.append(curr_cluster)
        
    print(f"Clustered {len(feats)} images into {len(product_clusters)} unique product designs.")
    
    # 6. Build clean consolidated products
    new_products = []
    used_titles = set()
    used_slugs = set()
    
    names_pool = cat_meta['names']
    styles_pool = cat_meta['styles']
    fabrics_pool = cat_meta['fabrics']
    prefix = cat_meta['prefix']
    
    for idx, cluster in enumerate(product_clusters):
        cluster_images = [x['path'] for x in cluster]
        
        # Color variants for this product
        variants = cluster_images_for_product(cluster_images)
        
        # Primary image order: primary variant images first, then remaining
        ordered_images = []
        for v in variants:
            for v_img in v['images']:
                if v_img not in ordered_images:
                    ordered_images.append(v_img)
        for img in cluster_images:
            if img not in ordered_images:
                ordered_images.append(img)
                
        # Aggregate all old slugs from all images in this cluster
        alias_slugs = set()
        for img in cluster_images:
            norm_img = urllib.parse.unquote(img)
            alias_slugs.update(image_to_old_slugs[norm_img])
            alias_slugs.update(image_to_old_slugs[img])
            
        # Determine unique title
        name_part = names_pool[idx % len(names_pool)]
        style_part = styles_pool[(idx * 7 + 3) % len(styles_pool)]
        fabric_part = fabrics_pool[idx % len(fabrics_pool)]
        
        title = f"{name_part} {style_part}"
        if title in used_titles:
            title = f"{name_part} Artisanal {style_part}"
        if title in used_titles:
            title = f"{name_part} Export {style_part}"
        used_titles.add(title)
        
        canonical_slug = slugify(title)
        if canonical_slug in used_slugs:
            canonical_slug = f"{canonical_slug}-{idx+1}"
        used_slugs.add(canonical_slug)
        
        # If canonical_slug was in alias_slugs, remove it
        if canonical_slug in alias_slugs:
            alias_slugs.remove(canonical_slug)
            
        prod_id = f"{prefix}-{idx+1:04d}"
        alias_slugs.add(f"product-{prod_id}")
        alias_slugs.add(prod_id)
        
        color_count = len(variants)
        color_str = f"{color_count} Colorway{'s' if color_count > 1 else ''}"
        color_names = ', '.join([v['name'] for v in variants[:4]])
        if color_count > 4:
            color_names += f" and {color_count - 4} more"
            
        desc = (
            f"The {title} is an authentic export-grade silhouette handcrafted in our Jaipur atelier. "
            f"Available in {color_str} ({color_names}) with precision anatomical curve grading (Sizes S to XXL). "
            f"Tailored in premium {fabric_part} with reinforced French seams and artisanal finishing."
        )
        
        badge = "Signature Bestseller"
        if idx % 4 == 1: badge = "Export Bestseller"
        elif idx % 4 == 2: badge = "Atelier Artisanal"
        elif idx % 4 == 3: badge = "Luxe Edition"
        
        new_prod = {
            "id": prod_id,
            "title": title,
            "slug": canonical_slug,
            "aliasSlugs": sorted(list(alias_slugs)),
            "tab": cat_id,
            "category": cat_id,
            "badge": badge,
            "regularPrice": cat_meta['base_price'] + 600,
            "salePrice": cat_meta['base_price'],
            "images": ordered_images,
            "colorVariants": variants,
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "description": desc,
            "fabric": fabric_part,
            "details": [
                f"Authentic {title} crafted in Sanganer Jaipur atelier",
                f"Available in {color_str} with exact matching photographic views",
                f"Tailored in premium {fabric_part} with colour-fast finish",
                "Anatomical curve grading across standard sizes S, M, L, XL, XXL",
                "Custom bespoke tailoring options available: feeding zippers, pockets, custom lengths",
                "Flexible wholesale export MOQ: 20 pieces per style"
            ],
            "moq": "20 pcs / Flexible Wholesale Pack",
            "sku": f"WST-{prefix.upper()}-{idx+1:04d}",
            "createdAt": "2026-11-14T12:00:00Z",
            "updatedAt": "2026-11-18T11:00:00Z"
        }
        new_products.append(new_prod)
        
    print(f"Generated {len(new_products)} clean products for {cat_id}.")
    total_vars = sum(len(p['colorVariants']) for p in new_products)
    total_imgs = sum(len(p['images']) for p in new_products)
    print(f"  -> Total color variants: {total_vars}")
    print(f"  -> Total image assignments: {total_imgs}")
    
    # 7. Write back clean file
    header = (
        f"// Auto-generated {cat_id} catalogue dataset with Unified Color Variants (Clean & Restructured)\n"
        f"import {{ NishoramaProduct }} from './nishorama-data';\n\n"
        f"export const {var_name}: NishoramaProduct[] = "
    )
    new_content = header + json.dumps(new_products, indent=2) + ";\n"
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print(f"Successfully saved clean {file_path}")
    return len(new_products)

if __name__ == '__main__':
    print("Starting master catalogue restructuring across all 10 categories...")
    grand_total = 0
    for cat in CATEGORIES_META:
        count = process_category(cat)
        grand_total += count
    print(f"\n==================================================")
    print(f"Master Restructuring Complete!")
    print(f"Grand Total Products across all 10 categories: {grand_total}")
    print(f"==================================================")
