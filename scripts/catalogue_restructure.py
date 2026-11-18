import os, sys, json, re
from PIL import Image
import numpy as np

CATEGORIES_META = [
  {"file": "cord-sets.ts", "category": "cord-sets", "name": "Co-ord Sets", "folder": "public/cord-sets", "base_price": 2199},
  {"file": "umbrella-dresses.ts", "category": "umbrella-dresses", "name": "Umbrella Dresses", "folder": "public/umbrella-dresses", "base_price": 1999},
  {"file": "denim-collection.ts", "category": "denim-collection", "name": "Denim Collection", "folder": "public/denim-collection", "base_price": 2499},
  {"file": "hoodies-sweatshirts.ts", "category": "hoodies-sweatshirts", "name": "Hoodies & Sweatshirts", "folder": "public/hoodies-sweatshirts", "base_price": 1899},
  {"file": "t-shirts.ts", "category": "t-shirts", "name": "T-Shirts", "folder": "public/t-shirts", "base_price": 899},
  {"file": "tops-shirts.ts", "category": "tops-shirts", "name": "Tops & Shirts", "folder": "public/tops-shirts", "base_price": 1299},
  {"file": "ethnic-wear-sets.ts", "category": "ethnic-wear-sets", "name": "Ethnic Wear Sets", "folder": "public/ethnic-wear-sets", "base_price": 2799},
  {"file": "short-long-kaftan.ts", "category": "short-long-kaftan", "name": "Kaftans (Short & Long)", "folder": "public/short-long-kaftan", "base_price": 1699},
  {"file": "traditional-gowns.ts", "category": "traditional-gowns", "name": "Traditional Gowns", "folder": "public/traditional-gowns", "base_price": 3499},
  {"file": "western-dresses.ts", "category": "western-dresses", "name": "Western Dresses", "folder": "public/western-dresses", "base_price": 1899}
]

IMAGE_CACHE = {}

def analyze_image(path):
    if path in IMAGE_CACHE:
        return IMAGE_CACHE[path]
    clean_path = path.lstrip('/')
    if not os.path.exists(clean_path):
        clean_path = os.path.join('public', clean_path)
    if not os.path.exists(clean_path):
        return None
    try:
        im = Image.open(clean_path).convert('RGB')
        w, h = im.size
        # Crop garment center
        crop = im.crop((int(w * 0.15), int(h * 0.15), int(w * 0.85), int(h * 0.85)))
        small = crop.resize((32, 32), Image.Resampling.LANCZOS)
        arr = np.asarray(small)
        mask = ~((arr[:, :, 0] > 230) & (arr[:, :, 1] > 230) & (arr[:, :, 2] > 230))
        valid = arr[mask] if np.any(mask) else arr.reshape(-1, 3)
        med_rgb = np.median(valid, axis=0).astype(int)
        
        gray = crop.convert('L').resize((9, 8), Image.Resampling.LANCZOS)
        g_arr = np.asarray(gray)
        dh = (g_arr[:, 1:] > g_arr[:, :-1]).flatten()
        res = {'rgb': tuple(med_rgb), 'dh': dh, 'w': w, 'h': h}
        IMAGE_CACHE[path] = res
        return res
    except Exception:
        return None

def color_name_and_hex(rgb):
    r, g, b = rgb
    if r > 195 and g > 195 and b > 195:
        return 'Ivory Cream', '#FAF7F2'
    if r < 55 and g < 55 and b < 55:
        return 'Midnight Black', '#18181B'
    if r > 130 and g < 70 and b < 70:
        return 'Ruby Crimson', '#991B1B'
    if r > 160 and g > 60 and b < 60:
        return 'Rust Terracotta', '#C2410C'
    if r > 170 and g > 130 and b < 70:
        return 'Mustard Gold', '#D97706'
    if b > 120 and b > r + 15 and b > g + 15:
        return 'Indigo Royal', '#1E3A8A'
    if g > 110 and g > r + 10 and g > b + 10:
        return 'Sage Olive', '#166534'
    if r > 160 and g > 115 and b > 120 and r > g + 15:
        return 'Blush Rose', '#FB7185'
    if r > 130 and b > 120 and g < 100:
        return 'Plum Berry', '#701A75'
    if r > 110 and g > 120 and b > 130 and abs(r - g) < 25:
        return 'Steel Slate', '#475569'
    return 'Artisan Earth', f'#{r:02x}{g:02x}{b:02x}'

def slugify(text):
    s = text.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

def cluster_images_into_variants(images):
    """
    Given a list of images belonging to the same product design,
    group them into distinct color variants based on color distance and shoot continuity.
    """
    if not images:
        return []
    
    # Analyze all images
    img_data = []
    for img in images:
        feat = analyze_image(img)
        if feat:
            c_name, c_hex = color_name_and_hex(feat['rgb'])
            img_data.append({
                'path': img,
                'rgb': feat['rgb'],
                'color_name': c_name,
                'color_hex': c_hex
            })
        else:
            img_data.append({
                'path': img,
                'rgb': (128, 128, 128),
                'color_name': 'Artisan Natural',
                'color_hex': '#888888'
            })
            
    # Group images with similar color (Euclidean distance in RGB < 45)
    variants = []
    for item in img_data:
        matched_var = None
        for v in variants:
            dist = np.linalg.norm(np.array(item['rgb']) - np.array(v['rep_rgb']))
            if dist < 45 or (item['color_name'] == v['name'] and dist < 65):
                matched_var = v
                break
        if matched_var:
            matched_var['images'].append(item['path'])
        else:
            variants.append({
                'id': f"var-{len(variants) + 1}",
                'name': item['color_name'],
                'colorCode': item['color_hex'],
                'rep_rgb': item['rgb'],
                'images': [item['path']]
            })
            
    # Clean up rep_rgb before returning
    for v in variants:
        del v['rep_rgb']
        
    return variants

print('Loaded clustering engine.')

def process_category(cat_meta):
    file_path = os.path.join('data', cat_meta['file'])
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    m = re.search(r'export const ([A-Z_]+): NishoramaProduct\[\] = (\[[\s\S]*?\]);\s*$', content)
    if not m:
        print(f"Could not parse array in {cat_meta['file']}")
        return
        
    var_name = m.group(1)
    raw_products = json.loads(m.group(2))
    cat_id = cat_meta['category']
    cat_folder = cat_meta['folder']
    
    # Valid files in category public folder
    public_files = set()
    if os.path.exists(cat_folder):
        for root, _, files in os.walk(cat_folder):
            for file in files:
                rel = os.path.relpath(os.path.join(root, file), 'public').replace('\\', '/')
                public_files.add('/' + rel)
                
    # Group products by base title
    by_base = {}
    for p in raw_products:
        base_title = re.sub(r'\s*Edition \d+', '', p.get('title', p.get('name', '')), flags=re.I).strip()
        if not base_title:
            base_title = f"{cat_meta['name']} Artisan Style"
        by_base.setdefault(base_title, []).append(p)
        
    new_products = []
    prod_idx = 1
    
    for base_title, prods in by_base.items():
        # Gather all valid images for this base design
        all_imgs = []
        seen_imgs = set()
        alias_slugs = set()
        
        for p in prods:
            if p.get('slug'):
                alias_slugs.add(p['slug'])
            for a in p.get('aliasSlugs', []):
                alias_slugs.add(a)
            alias_slugs.add(f"product-{p['id']}")
            
            for img in p.get('images', []):
                # Ensure image belongs to this category folder and exists
                clean_img = img.split('?')[0]
                if clean_img in public_files or os.path.exists('public' + clean_img):
                    if clean_img not in seen_imgs:
                        seen_imgs.add(clean_img)
                        all_imgs.append(clean_img)
                        
        if not all_imgs:
            # Fallback to any images from the first product
            all_imgs = prods[0].get('images', [])
            
        # Cluster images into color variants
        variants = cluster_images_into_variants(all_imgs)
        
        # Order images: primary variant images first, then remaining
        ordered_images = []
        for v in variants:
            for v_img in v['images']:
                if v_img not in ordered_images:
                    ordered_images.append(v_img)
        for img in all_imgs:
            if img not in ordered_images:
                ordered_images.append(img)
                
        # Primary reference product
        ref_p = prods[0]
        
        # Prefix for ID: e.g. cs-0001, wd-0001
        prefix_map = {
            'cord-sets': 'cs',
            'umbrella-dresses': 'ud',
            'denim-collection': 'dn',
            'hoodies-sweatshirts': 'hd',
            't-shirts': 'ts',
            'tops-shirts': 'tp',
            'ethnic-wear-sets': 'ew',
            'short-long-kaftan': 'kf',
            'traditional-gowns': 'tg',
            'western-dresses': 'wd'
        }
        prefix = prefix_map.get(cat_id, 'pr')
        new_id = f"{prefix}-{prod_idx:04d}"
        prod_idx += 1
        
        canonical_slug = slugify(base_title)
        if canonical_slug in alias_slugs:
            alias_slugs.remove(canonical_slug)
            
        color_summary = f"{len(variants)} Colorway{'s' if len(variants) > 1 else ''}"
        color_names = ', '.join([v['name'] for v in variants[:4]])
        if len(variants) > 4:
            color_names += f" and {len(variants) - 4} more"
            
        desc = (
            f"The {base_title} is an authentic export-grade silhouette handcrafted in our Sanganer atelier. "
            f"Available in {color_summary} ({color_names}) with precision anatomical curve grading (Sizes S to XXL). "
            f"Tailored in premium {ref_p.get('fabric', 'Handloom Cotton & Silk')} with reinforced seams and artisanal finishing."
        )
        
        new_prod = {
            "id": new_id,
            "title": base_title,
            "slug": canonical_slug,
            "aliasSlugs": sorted(list(alias_slugs)),
            "tab": cat_id,
            "category": cat_id,
            "badge": ref_p.get('badge', 'Signature Bestseller'),
            "regularPrice": ref_p.get('regularPrice', cat_meta['base_price'] + 600),
            "salePrice": ref_p.get('salePrice', cat_meta['base_price']),
            "images": ordered_images,
            "colorVariants": variants,
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "description": desc,
            "fabric": ref_p.get('fabric', 'Pure Handloom Silk & Cotton'),
            "details": [
                f"Authentic {base_title} crafted in Jaipur atelier",
                f"Available in {color_summary} with matching image views",
                f"Tailored in premium {ref_p.get('fabric', 'Handloom Cotton')}",
                "Anatomical curve grading across sizes S, M, L, XL, XXL",
                "Bespoke adjustments available: feeding zippers, pockets, custom lengths",
                "Flexible wholesale MOQ starting at 20 pieces per style"
            ],
            "moq": "20 pcs / Flexible Wholesale Pack",
            "sku": f"WST-{prefix.upper()}-{prod_idx:04d}",
            "createdAt": ref_p.get('createdAt', "2026-11-14T12:00:00Z"),
            "updatedAt": "2026-11-18T11:00:00Z"
        }
        new_products.append(new_prod)
        
    print(f"[{cat_id}] Consolidated {len(raw_products)} edition listings into {len(new_products)} unique product designs.")
    total_variants = sum(len(p['colorVariants']) for p in new_products)
    total_imgs = sum(len(p['images']) for p in new_products)
    print(f"   -> {total_variants} total color variants, {total_imgs} total image associations.")
    
    # Write back clean file
    header = (
        f"// Auto-generated {cat_id} catalogue dataset with Unified Color Variants (Clean & Restructured)\n"
        f"import {{ NishoramaProduct }} from './nishorama-data';\n\n"
        f"export const {var_name}: NishoramaProduct[] = "
    )
    new_content = header + json.dumps(new_products, indent=2) + ";\n"
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    return len(new_products)

if __name__ == '__main__':
    print("Starting complete catalogue audit and restructuring...")
    grand_total_prods = 0
    for cat in CATEGORIES_META:
        count = process_category(cat)
        grand_total_prods += count or 0
    print(f"\nCompleted! Total restructured products across all categories: {grand_total_prods}")
