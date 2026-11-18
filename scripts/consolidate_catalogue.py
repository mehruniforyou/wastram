"""
Wastram Catalogue Consolidation — Stage 2
Merges all name-prefixed duplicate listings into canonical products.
Preserves every image and every existing slug/ID as an aliasSlugs entry.
"""
import os, re, json, colorsys
from collections import defaultdict, OrderedDict
from PIL import Image
import numpy as np

KNOWN_NAMES = {
    "Aria","Sienna","Elena","Zoya","Maya","Kavya","Rhea","Mira","Noor","Alia","Tara","Siya","Diya",
    "Ananya","Ishita","Shanaya","Suhana","Zara","Avani","Tanvi","Naira","Riddhi","Sitara","Aanya",
    "Saanvi","Kiara","Reet","Pari","Meera","Isha","Radhika","Shreya","Aditi","Simran","Trisha",
    "Vanya","Sara","Janvi","Khushi","Deepika","Kareena","Anushka","Priyanka","Katrina","Shraddha",
    "Kriti","Disha","Bhumi","Yami","Taapsee","Tamannaah","Rashmika","Samantha","Nayanthara","Pooja",
    "Keerthy","Sai","Kajal","Hansika","Raashii","Mrinal","Sanya","Fatima","Sobhita","Mithila",
    "Ahsaas","Prajakta","Kusha","Dolly","Navya","Alanna","Aaliyah","Palak","Roohi","Inaaya",
    "Samisha","Vamika","Devi","Malti","Raha","Zehra","Arya","Lavanya","Niharika","Tanya","Bhavya",
    "Charu","Devika","Esha","Gauri","Hansa","Jahnavi","Komal","Lopa","Mansi",
    "Zephyr","Kaya","Milan","Orion","Nova","Rowan","Zuri","Elysia","Kyoto","Vesper","Astrid",
    "Terra","Luxe","Solstice","Blakely","Emerson","Oslo","Vance","Reese","Cruz","Harlow","Kenzo",
    "Sage","Dallas","Nico","Indie","Marlow","Bodhi","Sora","Remi","Eden","Atlas","Juno","Phoenix",
    "Sterling","Koa","Jasper","Axel"
}

def strip_name(title):
    parts = title.split(' ', 1)
    if len(parts) > 1 and parts[0] in KNOWN_NAMES:
        return parts[1]
    return title

def slugify(text):
    s = text.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

def classify_color(rgb):
    r, g, b = [x / 255.0 for x in rgb]
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    h_deg = h * 360.0
    if v < 0.22: return 'Midnight Black', '#18181B'
    if s < 0.12 and v > 0.78: return 'Ivory Cream', '#FAF7F2'
    if s < 0.16:
        return ('Pebble Grey', '#94A3B8') if v > 0.55 else ('Charcoal Slate', '#334155')
    if h_deg < 15 or h_deg >= 345:
        if v < 0.45: return 'Ruby Crimson', '#991B1B'
        elif s < 0.45 or v > 0.75: return 'Blush Rose', '#FB7185'
        else: return 'Scarlet Red', '#DC2626'
    elif 15 <= h_deg < 42:
        if v < 0.50: return 'Rust Terracotta', '#C2410C'
        elif s > 0.60: return 'Sunset Tangerine', '#EA580C'
        else: return 'Warm Caramel', '#D97706'
    elif 42 <= h_deg < 70:
        if v < 0.45: return 'Bronze Ochre', '#854D0E'
        elif s < 0.40: return 'Sand Ochre', '#CA8A04'
        else: return 'Mustard Gold', '#EAB308'
    elif 70 <= h_deg < 165:
        if v < 0.40: return 'Forest Emerald', '#14532D'
        elif s < 0.35: return 'Sage Olive', '#4D7C0F'
        else: return 'Emerald Green', '#16A34A'
    elif 165 <= h_deg < 210:
        if v < 0.45: return 'Deep Teal', '#115E59'
        elif s < 0.35: return 'Teal Slate', '#0E7490'
        else: return 'Aqua Marine', '#06B6D4'
    elif 210 <= h_deg < 260:
        if v < 0.35: return 'Midnight Navy', '#1E1B4B'
        elif s < 0.35: return 'Steel Slate', '#475569'
        elif v < 0.60: return 'Indigo Royal', '#1D4ED8'
        else: return 'Sky Azure', '#38BDF8'
    elif 260 <= h_deg < 315:
        return ('Plum Wine', '#581C87') if v < 0.45 else ('Lavender Violet', '#7C3AED')
    elif 315 <= h_deg < 345:
        return ('Berry Magenta', '#831843') if v < 0.50 else ('Orchid Pink', '#DB2777')
    return 'Artisan Earth', '#8B7355'

IMG_CACHE = {}

def img_color(rel_path):
    if rel_path in IMG_CACHE:
        return IMG_CACHE[rel_path]
    clean = rel_path.lstrip('/')
    for base in [clean, os.path.join('public', clean)]:
        if os.path.exists(base):
            try:
                im = Image.open(base).convert('RGB')
                w, h = im.size
                crop = im.crop((int(w*0.2), int(h*0.2), int(w*0.8), int(h*0.8)))
                arr = np.array(crop)
                mask = ~((arr[:,:,0]>220)&(arr[:,:,1]>220)&(arr[:,:,2]>220))
                valid = arr[mask] if np.any(mask) else arr.reshape(-1,3)
                med = np.median(valid, axis=0).astype(int).tolist()
                result = classify_color(med)
                IMG_CACHE[rel_path] = result
                return result
            except:
                pass
    IMG_CACHE[rel_path] = ('Artisan Earth', '#8B7355')
    return ('Artisan Earth', '#8B7355')

# ─────────────────────────────────────────────────────────────
# CANONICAL WASTRAM TITLES — human-curated, brand-appropriate
# ─────────────────────────────────────────────────────────────

CANONICAL_TITLES = {
    # WESTERN DRESSES
    "Floral Printed Tiered Sundress with Pockets": "Floral Tiered Sundress",
    "Minimalist Column Cut Sleeveless Dress": "Sleeveless Column Dress",
    "Asymmetric Ruffle Hemline Cocktail Dress": "Ruffle Hem Asymmetric Dress",
    "Tiered Flared Cotton Midi Dress": "Tiered Cotton Midi Dress",
    "Balloon Sleeve Empire Waist Babydoll Dress": "Balloon Sleeve Babydoll Dress",
    "Schiffli Embroidered Button-Down Shirt Dress": "Schiffli Embroidered Shirt Dress",
    "Tiered Flutter Sleeve Midi Sundress": "Flutter Sleeve Tiered Sundress",
    "Smocked Waist A-Line Silhouette Dress": "Smocked Waist A-Line Dress",
    "Wrap Front Tiered Boho Maxi Dress": "Wrap Front Boho Maxi Dress",
    "Off-Shoulder Ruched Bodycon Midi Dress": "Off-Shoulder Ruched Midi Dress",
    "Embroidered Yoke Puff Sleeve Dress": "Embroidered Yoke Puff Sleeve Dress",
    "Geometric Print Pleated Midi Dress": "Geometric Print Pleated Dress",

    # UMBRELLA DRESSES
    "Hand-Block Print Cotton Gown Umbrella Dress": "Handblock Print Umbrella Dress",
    "Sleeveless Minimalist Linen Umbrella Dress": "Sleeveless Linen Umbrella Dress",
    "Embroidered Yoke Draped Umbrella Dress": "Embroidered Yoke Umbrella Dress",
    "Handcrafted Chanderi Silk Umbrella Dress": "Chanderi Silk Umbrella Dress",
    "Asymmetric Hemline Flowing Umbrella Dress": "Asymmetric Hem Umbrella Dress",
    "Angrakha Kalidar Umbrella Flare Dress": "Angrakha Kalidar Umbrella Dress",
    "Tiered Georgette Circular Umbrella Maxi": "Tiered Georgette Umbrella Maxi",
    "Brocade Trimmed Festive Umbrella Maxi Dress": "Brocade Trimmed Festive Umbrella Dress",
    "Pure Mulmul Cotton Flared Umbrella Dress": "Mulmul Cotton Flared Umbrella Dress",
    "Bandhani Pleated High-Volume Umbrella Dress": "Bandhani Pleated Umbrella Dress",
    "Tiered Schiffli Cotton Umbrella Gown": "Schiffli Tiered Umbrella Gown",
    "Belted Wrap Tiered Umbrella Dress": "Belted Wrap Umbrella Dress",

    # CO-ORD SETS
    "Pleated Blazer & High-Waist Trouser Set": "Pleated Blazer & Trouser Set",
    "Jacquard Belted Kurta & Cigarette Pant Set": "Jacquard Kurta & Cigarette Pant Set",
    "Asymmetric Flounce Top & Slim Pants Set": "Flounce Top & Slim Pants Set",
    "Hand-Block Chanderi Top & Culottes Set": "Chanderi Top & Culottes Set",
    "Monochromatic Satin Shirt & Trouser Set": "Satin Shirt & Trouser Set",
    "Sleeveless Draped Tunic & Cigarette Pant Set": "Draped Tunic & Cigarette Pant Set",
    "Printed Kaftan & Straight Pant Co-ord Set": "Kaftan & Straight Pant Co-ord",
    "Bandhani Peplum Kurti & Sharara Pant Set": "Peplum Kurti & Sharara Set",
    "Linen Tunic & Wide-Leg Trousers Set": "Linen Tunic & Wide-Leg Trouser Set",
    "Silk Kimono & Tailored Pant Co-ord Set": "Silk Kimono & Tailored Pant Set",
    "Embroidered Peplum Top & Dhoti Pant Set": "Embroidered Peplum & Dhoti Pant Set",
    "Schiffli Cotton Shirt & Relaxed Pant Set": "Schiffli Shirt & Relaxed Pant Set",
    "Handcrafted Corset & Wide Palazzo Set": "Corset & Wide Palazzo Set",
    "Organza Draped Cape & Trousers Set": "Organza Cape & Trouser Set",
    "Jacquard Belted Kurta & Cigarette Pant Set": "Jacquard Kurta & Cigarette Pant Set",
    "Notch-Collar Silk Shirt & Trouser Co-ord Set": "Silk Shirt & Trouser Set",
    "Asymmetric Flounce Top & Slim Pants Set": "Flounce Top & Slim Pants Set",
    "Chikankari Short Kurta & Flared Pant Set": "Chikankari Kurta & Flared Pant Set",
    "Minimalist Linen Wrap Top & Pant Set": "Linen Wrap Top & Pant Set",
    "Geometric Print Blazer & Culottes Co-ord Set": "Geometric Blazer & Culottes Set",

    # TOPS & SHIRTS
    "Schiffli Embroidered Peplum Cotton Top": "Schiffli Peplum Cotton Top",
    "Hand-Block Printed Mandarin Collar Shirt": "Handblock Mandarin Collar Shirt",
    "Chanderi Silk Pintuck Draped Blouse": "Chanderi Silk Pintuck Blouse",
    "Linen Wrap Front Tie-Up Artisan Top": "Linen Wrap Tie-Up Top",
    "Floral Printed Notch Neck Relaxed Shirt": "Floral Print Notch Neck Shirt",
    "Smocked Waist Tiered Flutter Sleeve Top": "Smocked Waist Flutter Sleeve Top",
    "Chikankari Handloom Short Tunic Blouse": "Chikankari Short Tunic",
    "Asymmetric High-Low Modal Satin Shirt": "Asymmetric Modal Satin Shirt",
    "Bandhani Yoke Gathered Artisan Top": "Bandhani Yoke Gathered Top",
    "Tailored Collared Silk Resort Shirt": "Silk Resort Collared Shirt",
    "Embroidered Button-Down Mulmul Cotton Shirt": "Embroidered Mulmul Cotton Shirt",
    "Balloon Sleeve Keyhole Neck Artisan Blouse": "Balloon Sleeve Keyhole Blouse",

    # ETHNIC WEAR SETS
    "Embroidered Kurta, Pant & Organza Dupatta 3-Piece Set": "Embroidered Kurta & Dupatta Set",
    "Chanderi Silk Kalidar Anarkali & Dupatta 3-Piece Set": "Chanderi Anarkali & Dupatta Set",
    "Handcrafted Gota Patti Kurti & Sharara 3-Piece Set": "Gota Patti Kurti & Sharara Set",
    "Zari Flared Angrakha & Palazzo Dupatta 3-Piece Set": "Zari Angrakha & Palazzo Set",
    "Chikankari Hand-Embroidered Kurta & Pant Set with Dupatta": "Chikankari Kurta & Dupatta Set",
    "Bandhani Silk Straight Kurti & Cigarette Pant Set": "Bandhani Kurti & Cigarette Pant Set",
    "Tiered Flared Anarkali with Embroidered Net Dupatta": "Tiered Anarkali & Net Dupatta Set",
    "Banarasi Brocade Yoke Kurta & Trousers Set": "Banarasi Brocade Kurta Set",
    "Hand-Block Floral Printed Kurti & Flared Palazzo Set": "Handblock Kurti & Palazzo Set",
    "Draped Asymmetric Kurta & Dhoti Pant 3-Piece Set": "Draped Kurta & Dhoti Pant Set",
    "Georgette Mirror Work Kurti & Sharara Set": "Mirror Work Georgette Sharara Set",
    "Pure Chiffon Draped Kurta & Culottes Set": "Chiffon Draped Kurta & Culottes Set",

    # KAFTANS
    "Bandhani Modal Silk Kimono Sleeve Maxi Kaftan": "Bandhani Silk Kimono Kaftan",
    "Chikankari Hand-Embroidered Relaxed Fit Kaftan": "Chikankari Embroidered Kaftan",
    "Schiffli Embroidered Scalloped Hem Resort Kaftan": "Schiffli Scalloped Hem Kaftan",
    "Pure Cotton Hand-Block Print Drawstring Long Kaftan": "Handblock Cotton Drawstring Kaftan",
    "Artisanal Draped Asymmetric Silhouette Long Kaftan": "Draped Asymmetric Long Kaftan",
    "Flowing Georgette Tiered Floor-Length Kaftan": "Tiered Georgette Maxi Kaftan",
    "Organza Bordered Festive Silk Kaftan Gown": "Organza Bordered Festive Kaftan",
    "Handcrafted Tassel-Tie Bohemian Summer Short Kaftan": "Tassel-Tie Bohemian Short Kaftan",
    "Printed Boho Bell Sleeve Kaftan": "Boho Bell Sleeve Kaftan",
    "Relaxed Fit Linen Kaftan Tunic": "Linen Kaftan Tunic",
    "Embroidered Yoke Kaftan Dress": "Embroidered Yoke Kaftan Dress",
    "Tie-Dye Shibori Long Resort Kaftan": "Shibori Long Resort Kaftan",

    # TRADITIONAL GOWNS
    "Handcrafted Mirror Work Draped Royal Gown": "Mirror Work Draped Anarkali",
    "Artisanal Draped Silk Cape Kalidar Gown": "Silk Cape Kalidar Gown",
    "Bandhani Silk Grand Volume Traditional Gown": "Bandhani Silk Anarkali Gown",
    "Royal Kalidar Zari Embroidered Anarkali Gown": "Zari Embroidered Kalidar Anarkali",
    "Heritage Angrakha Flared Silk Anarkali Gown": "Angrakha Flared Silk Anarkali",
    "Brocade Banarasi Festive Kalidar Gown": "Banarasi Brocade Festive Gown",
    "Sequinned Velvet Bordered Grand Gala Gown": "Velvet Sequin Gala Gown",
    "Organza Tiered Heritage Anarkali Gown": "Organza Tiered Anarkali",
    "Embroidered Net Overlay Festive Gown": "Embroidered Net Overlay Gown",
    "Chikankari High-Volume Anarkali Gown": "Chikankari High-Volume Anarkali",
    "Zardozi Work Bridal Flare Gown": "Zardozi Bridal Flare Gown",
    "Printed Georgette Layered Floor-Length Gown": "Georgette Layered Floor Gown",

    # DENIM
    "Raw Indigo Relaxed Tapered Denim Pants": "Raw Indigo Tapered Jeans",
    "Classic Straight-Leg Vintage Denim": "Straight-Leg Vintage Jeans",
    "Clean-Cut High-Waisted Indigo Denim": "High-Waisted Indigo Jeans",
    "High-Rise Vintage Flared Denim Jeans": "High-Rise Flared Jeans",
    "Stone-Washed Slouchy Skate Denim Trousers": "Stonewash Slouchy Denim",
    "Acid-Washed Barrel Leg Slouchy Jeans": "Acid-Wash Barrel Leg Jeans",
    "Cropped Kick-Flare Raw Hem Denim Jeans": "Kick-Flare Raw Hem Jeans",
    "Boyfriend Fit Distressed Everyday Denim": "Distressed Boyfriend Jeans",
    "Wide-Leg Rigid Selvedge Denim Trousers": "Wide-Leg Selvedge Denim",
    "Pleated Wide-Leg Tailored Denim": "Pleated Wide-Leg Denim",
    "Utility Cargo Pocket Relaxed Denim Jeans": "Cargo Pocket Denim Jeans",
    "Draped Belted Paperbag Waist Denim": "Paperbag Waist Denim",

    # T-SHIRTS
    "Heavyweight Combed Cotton Oversized T-Shirt": "240 GSM Oversized Tee",
    "Relaxed Drop-Shoulder Boxy Tee": "Drop-Shoulder Boxy Tee",
    "Vintage Washed Organic Cotton Graphic T-Shirt": "Vintage Wash Graphic Tee",
    "Ribbed Crewneck Classic Fit Bio-Washed Tee": "Bio-Washed Crewneck Tee",
    "Artisanal Screen-Printed Acid-Wash T-Shirt": "Acid-Wash Screen Print Tee",
    "Minimalist Embroidered Chest Pocket Tee": "Embroidered Pocket Tee",
    "French Terry Cotton Boxy Crop T-Shirt": "French Terry Crop Tee",
    "Distressed Hem Streetwear Oversized Tee": "Distressed Hem Oversized Tee",
    "Garment-Dyed Heavyweight Relaxed T-Shirt": "Garment-Dyed Relaxed Tee",
    "Premium Ring-Spun Cotton Lounge Tee": "Ring-Spun Cotton Lounge Tee",
    "Contrast Ribbed Collar Retro Ringer T-Shirt": "Retro Ringer Tee",
    "Slub Jersey Breathable Casual Tee": "Slub Jersey Casual Tee",
    "Pigment-Dyed Boxy Heavyweight Tee": "Pigment-Dyed Boxy Tee",
    "Bio-Washed Pique Polo T-Shirt": "Bio-Washed Pique Polo",
    "Raglan Sleeve Colour-Block Tee": "Raglan Colour-Block Tee",
    "Floral Embroidered Summer Tee": "Floral Embroidered Tee",
    "Striped Organic Cotton Jersey Tee": "Striped Organic Cotton Tee",
    "Mesh Panel Athletic Performance Tee": "Mesh Panel Athletic Tee",
    "Longline Curved Hem Streetwear Tee": "Longline Curved Hem Tee",
    "Bleach Splash Tie-Dye Oversized Tee": "Bleach Splash Tie-Dye Tee",
    "Oversized Half-Sleeve Linen-Touch Tee": "Linen-Touch Oversized Tee",
    "Heavyweight Pocket Tee with Dropped Shoulders": "Heavyweight Pocket Tee",
    "Stone-Washed Summer Tee": "Stonewash Summer Tee",
    "Pastel Terry Cloth Mini Tee": "Terry Cloth Pastel Tee",

    # HOODIES & SWEATSHIRTS
    "Kangaroo Pocket Cozy Fleece Streetwear Hoodie": "Kangaroo Pocket Fleece Hoodie",
    "Classic Streetwear Relaxed Oversized Hoodie": "Oversized Relaxed Hoodie",
    "Garment-Dyed Minimalist Heavy Fleece Hoodie": "Garment-Dyed Heavy Hoodie",
    "Heavyweight Brushed Cotton Boxy Hoodie": "Heavyweight Boxy Hoodie",
    "Raglan Sleeve Export Streetwear Pullover Hoodie": "Raglan Sleeve Pullover Hoodie",
    "Vintage Acid-Washed Oversized Sweatshirt": "Acid-Wash Oversized Sweatshirt",
    "Drop-Shoulder Diagonal French Terry Pullover": "French Terry Drop-Shoulder Pullover",
    "Ribbed Trim Relaxed Crewneck Sweatshirt": "Ribbed Trim Crewneck Sweatshirt",
    "Clean-Edge Luxury French Terry Sweatshirt": "Luxury French Terry Sweatshirt",
    "Pastel Graphic Print French Terry Pullover": "Pastel Graphic Pullover",
    "Double-Stitched Heavyweight Fleece Sweatshirt": "Heavyweight Fleece Sweatshirt",
    "Subtle Graphic Embroidered Fleece Pullover": "Embroidered Fleece Pullover",
}

CATEGORY_META = {
    "western-dresses": {
        "file": "western-dresses.ts",
        "export_const": "WESTERN_DRESSES",
        "prefix": "wd",
        "tab": "western-dresses",
        "moq": "20 pcs / Flexible Wholesale Pack",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "badge": "Atelier Bestseller",
        "fabric_default": "100% Cambric Cotton 60:60 with Soft Wash Finish",
    },
    "umbrella-dresses": {
        "file": "umbrella-dresses.ts",
        "export_const": "UMBRELLA_DRESSES",
        "prefix": "ud",
        "tab": "umbrella-dresses",
        "moq": "20 pcs / Flexible Wholesale Pack",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "badge": "Signature Bestseller",
        "fabric_default": "Pure Mulmul Cotton with Hand-Blocked Motifs",
    },
    "cord-sets": {
        "file": "cord-sets.ts",
        "export_const": "CORD_SETS",
        "prefix": "cs",
        "tab": "cord-sets",
        "moq": "20 pcs / Flexible Wholesale Pack",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "badge": "Resort Edit",
        "fabric_default": "Pure Cotton 60:60 with Soft Wash",
    },
    "tops-shirts": {
        "file": "tops-shirts.ts",
        "export_const": "TOPS_SHIRTS",
        "prefix": "tp",
        "tab": "tops-shirts",
        "moq": "20 pcs / Flexible Wholesale Pack",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "badge": "Atelier Edit",
        "fabric_default": "Pure Mulmul Cotton 60:60",
    },
    "ethnic-wear-sets": {
        "file": "ethnic-wear-sets.ts",
        "export_const": "ETHNIC_WEAR_SETS",
        "prefix": "ew",
        "tab": "ethnic-wear-sets",
        "moq": "20 pcs / Flexible Wholesale Pack",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "badge": "Heritage Craft",
        "fabric_default": "Pure Cotton with Organza Dupatta",
    },
    "short-long-kaftan": {
        "file": "short-long-kaftan.ts",
        "export_const": "SHORT_LONG_KAFTAN",
        "prefix": "kf",
        "tab": "short-long-kaftan",
        "moq": "20 pcs / Flexible Wholesale Pack",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "badge": "Resort Essential",
        "fabric_default": "Pure Cotton with Artisanal Hand-Block Motifs",
    },
    "traditional-gowns": {
        "file": "traditional-gowns.ts",
        "export_const": "TRADITIONAL_GOWNS",
        "prefix": "tg",
        "tab": "traditional-gowns",
        "moq": "20 pcs / Flexible Wholesale Pack",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "badge": "Royal Jaipur",
        "fabric_default": "Chanderi Silk with Full Lining",
    },
    "denim-collection": {
        "file": "denim-collection.ts",
        "export_const": "DENIM_COLLECTION",
        "prefix": "dn",
        "tab": "denim-collection",
        "moq": "20 pcs / Flexible Wholesale Pack",
        "sizes": ["28", "30", "32", "34", "36"],
        "badge": "Selvedge Craft",
        "fabric_default": "13.5 Oz 100% Ring-Spun Cotton Denim",
    },
    "t-shirts": {
        "file": "t-shirts.ts",
        "export_const": "T_SHIRTS",
        "prefix": "ts",
        "tab": "t-shirts",
        "moq": "30 pcs / Flexible Wholesale Pack",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "badge": "Streetwear Essential",
        "fabric_default": "240 GSM 100% Combed Cotton Single Jersey",
    },
    "hoodies-sweatshirts": {
        "file": "hoodies-sweatshirts.ts",
        "export_const": "HOODIES_SWEATSHIRTS",
        "prefix": "hd",
        "tab": "hoodies-sweatshirts",
        "moq": "20 pcs / Flexible Wholesale Pack",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "badge": "Heavyweight Craft",
        "fabric_default": "380 GSM 100% Combed Cotton Brushed Fleece",
    },
}

def get_description(title, fabric, images_count):
    return (
        f"The {title} is an export-grade silhouette handcrafted at Wastram's Jaipur atelier. "
        f"Available in {images_count} photographic views, tailored in {fabric} with "
        f"precision anatomical grading across sizes S to XXL. Reinforced French seams, "
        f"artisanal colour-fast finishing, and flexible wholesale MOQ for boutique supply."
    )

def get_details(title, fabric):
    return [
        f"Authentic {title} handcrafted at Wastram's Sanganer, Jaipur atelier",
        f"Tailored in {fabric} with colour-fast herbal and reactive dyes",
        "Precision anatomical grading: S (36\"), M (38\"), L (40\"), XL (42\"), XXL (44\")",
        "Reinforced French seams and double-needle topstitching throughout",
        "Wholesale export MOQ: 20 pieces per style with flexible size breakdown",
        "Custom bespoke options: sleeve length, pocket placements, private labelling"
    ]

def consolidate_category(cat_id, meta):
    file_path = os.path.join('data', meta['file'])
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    m = re.search(r'export const ([A-Z_]+): NishoramaProduct\[\] = (\[[\s\S]*?\]);\s*$', text)
    if not m:
        print(f"  ERROR: Could not parse {meta['file']}")
        return None, 0, 0

    old_prods = json.loads(m.group(2))
    old_count = len(old_prods)

    # Group by style stem
    groups = OrderedDict()
    for p in old_prods:
        stem = strip_name(p.get('title', ''))
        if stem not in groups:
            groups[stem] = []
        groups[stem].append(p)

    # Build canonical products
    canonical = []
    for idx, (stem, prods_in_group) in enumerate(groups.items(), start=1):
        # Pick canonical title from map, fallback to stem
        can_title = CANONICAL_TITLES.get(stem, stem)

        # Collect all images (deduplicated, preserving order)
        seen_imgs = set()
        all_imgs = []
        for p in prods_in_group:
            for img in p.get('images', []):
                clean = img.split('?')[0]
                if clean not in seen_imgs:
                    seen_imgs.add(clean)
                    all_imgs.append(clean)

        # Collect all aliasSlugs from merged listings
        all_aliases = set()
        for p in prods_in_group:
            pid = p.get('id', '')
            pslug = p.get('slug', '')
            all_aliases.update(p.get('aliasSlugs', []))
            if pslug: all_aliases.add(pslug)
            if pid:
                all_aliases.add(pid)
                all_aliases.add(f"product-{pid}")

        # Pick the canonical ID (first product in group)
        can_id = f"{meta['prefix']}-{idx:04d}"
        can_slug = slugify(can_title)
        all_aliases.add(can_slug)
        all_aliases.add(can_id)
        # Remove the new canonical slug from aliases so it's the primary
        all_aliases.discard(can_slug)

        # Pick best fabric from group (longest/most detailed)
        best_p = max(prods_in_group, key=lambda p: len(p.get('images', [])))
        fabric = best_p.get('fabric') or meta['fabric_default']
        price_sale = best_p.get('salePrice') or 1899
        price_reg = best_p.get('regularPrice') or (price_sale + 600)
        sku = f"WST-{can_id.upper()}"

        # Build color variants from images
        color_variants = []
        seen_colors = {}
        for img in all_imgs:
            cname, chex = img_color(img)
            if cname not in seen_colors:
                seen_colors[cname] = {
                    'id': f"var-{len(color_variants)+1}",
                    'name': cname,
                    'colorCode': chex,
                    'images': []
                }
                color_variants.append(seen_colors[cname])
            seen_colors[cname]['images'].append(img)

        # If color detection failed, put all images in one variant
        if not color_variants:
            color_variants = [{
                'id': 'var-1',
                'name': 'Artisan Multicolour',
                'colorCode': '#8B7355',
                'images': all_imgs
            }]

        can_prod = {
            "id": can_id,
            "title": can_title,
            "slug": can_slug,
            "aliasSlugs": sorted(list(all_aliases)),
            "tab": meta['tab'],
            "category": cat_id,
            "badge": meta['badge'],
            "regularPrice": price_reg,
            "salePrice": price_sale,
            "images": all_imgs,
            "colorVariants": color_variants,
            "sizes": meta['sizes'],
            "description": get_description(can_title, fabric, len(all_imgs)),
            "fabric": fabric,
            "details": get_details(can_title, fabric),
            "moq": meta['moq'],
            "sku": sku,
            "createdAt": "2026-11-18T12:00:00Z",
            "updatedAt": "2026-11-18T12:00:00Z"
        }
        canonical.append(can_prod)

    return canonical, old_count, len(canonical)


def write_category_file(cat_id, meta, canonical):
    const_name = meta['export_const']
    file_path = os.path.join('data', meta['file'])

    # Build TypeScript content
    lines = [
        f"// Wastram Atelier — {cat_id} catalogue (consolidated {len(canonical)} canonical products)",
        "import { NishoramaProduct } from './nishorama-data';",
        "",
        f"export const {const_name}: NishoramaProduct[] = {json.dumps(canonical, indent=2, ensure_ascii=False)};",
        ""
    ]
    with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(lines))


if __name__ == '__main__':
    print("=" * 60)
    print("Wastram Catalogue Consolidation — Stage 2")
    print("=" * 60)
    total_before = 0
    total_after = 0
    all_results = {}

    for cat_id, meta in CATEGORY_META.items():
        print(f"\nProcessing: {cat_id}")
        canonical, before, after = consolidate_category(cat_id, meta)
        if canonical is None:
            continue
        all_results[cat_id] = canonical
        write_category_file(cat_id, meta, canonical)
        print(f"  {before} listings → {after} canonical products")
        total_before += before
        total_after += after

    print(f"\n{'='*60}")
    print(f"DONE: {total_before} listings → {total_after} canonical products")
    print(f"All images preserved. All old slugs kept as aliasSlugs.")
    print(f"Now run: node scripts/compile_all_products_ts.js")
