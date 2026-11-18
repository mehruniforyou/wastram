import os, sys, json, re
from PIL import Image
import numpy as np
import colorsys
from collections import defaultdict

CATEGORIES_META = [
  {"file": "cord-sets.ts", "category": "cord-sets", "name": "Co-ord Sets", "folder": "public/cord-sets", "base_price": 2199, "prefix": "cs"},
  {"file": "umbrella-dresses.ts", "category": "umbrella-dresses", "name": "Umbrella Dresses", "folder": "public/umbrella-dresses", "base_price": 1999, "prefix": "ud"},
  {"file": "denim-collection.ts", "category": "denim-collection", "name": "Denim Collection", "folder": "public/denim-collection", "base_price": 2499, "prefix": "dn"},
  {"file": "hoodies-sweatshirts.ts", "category": "hoodies-sweatshirts", "name": "Hoodies & Sweatshirts", "folder": "public/hoodies-sweatshirts", "base_price": 1899, "prefix": "hd"},
  {"file": "t-shirts.ts", "category": "t-shirts", "name": "T-Shirts", "folder": "public/t-shirts", "base_price": 899, "prefix": "ts"},
  {"file": "tops-shirts.ts", "category": "tops-shirts", "name": "Tops & Shirts", "folder": "public/tops-shirts", "base_price": 1299, "prefix": "tp"},
  {"file": "ethnic-wear-sets.ts", "category": "ethnic-wear-sets", "name": "Ethnic Wear Sets", "folder": "public/ethnic-wear-sets", "base_price": 2799, "prefix": "ew"},
  {"file": "short-long-kaftan.ts", "category": "short-long-kaftan", "name": "Kaftans (Short & Long)", "folder": "public/short-long-kaftan", "base_price": 1699, "prefix": "kf"},
  {"file": "traditional-gowns.ts", "category": "traditional-gowns", "name": "Traditional Gowns", "folder": "public/traditional-gowns", "base_price": 3499, "prefix": "tg"},
  {"file": "western-dresses.ts", "category": "western-dresses", "name": "Western Dresses", "folder": "public/western-dresses", "base_price": 1899, "prefix": "wd"}
]

def classify_color(rgb):
    r, g, b = [x / 255.0 for x in rgb]
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    h_deg = h * 360.0
    hex_code = '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])
    
    if v < 0.20:
        return 'Midnight Black', '#18181B'
    if s < 0.12 and v > 0.80:
        return 'Ivory Cream', '#FAF7F2'
    if s < 0.15:
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

print("Color classifier loaded.")
