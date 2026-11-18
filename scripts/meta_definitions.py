import os, sys, json, re, urllib.parse
from PIL import Image
import numpy as np
import colorsys
from collections import defaultdict

CATEGORIES_META = [
  {
    "file": "cord-sets.ts",
    "category": "cord-sets",
    "name": "Co-ord Sets",
    "folder": "public/cord-sets",
    "base_price": 2199,
    "prefix": "cs",
    "names": ["Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia", "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi", "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha", "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika", "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha", "Kriti", "Disha", "Bhumi", "Yami", "Taapsee", "Tamannaah", "Rashmika", "Samantha", "Nayanthara", "Pooja", "Keerthy", "Sai", "Kajal", "Hansika", "Raashii", "Mrinal", "Sanya", "Fatima", "Sobhita", "Mithila", "Ahsaas", "Prajakta", "Kusha", "Dolly", "Navya", "Alanna", "Aaliyah", "Palak", "Roohi", "Inaaya", "Samisha", "Vamika", "Devi", "Malti", "Raha", "Zehra", "Arya", "Lavanya", "Niharika", "Tanya", "Bhavya", "Charu", "Devika", "Esha", "Gauri", "Hansa", "Jahnavi", "Komal", "Lopa", "Mansi"],
    "styles": [
      "Linen Tunic & Wide-Leg Trousers Set", "Silk Kimono & Tailored Pant Co-ord Set", "Embroidered Peplum Top & Dhoti Pant Set",
      "Pleated Blazer & High-Waist Trouser Set", "Hand-Block Chanderi Top & Culottes Set", "Printed Kaftan & Straight Pant Co-ord Set",
      "Tiered Crop Top & Flared Palazzo Set", "Schiffli Cotton Shirt & Relaxed Pant Set", "Handcrafted Corset & Wide Palazzo Set",
      "Organza Draped Cape & Trousers Set", "Jacquard Belted Kurta & Cigarette Pant Set", "Monochromatic Satin Shirt & Trouser Set",
      "Bandhani Peplum Kurti & Sharara Pant Set", "Embroidered Vest & Wide-Leg Pant Set", "Chikankari Short Kurta & Flared Pant Set",
      "Minimalist Linen Wrap Top & Pant Set", "Notch-Collar Silk Shirt & Trouser Co-ord Set", "Asymmetric Flounce Top & Slim Pants Set",
      "Sleeveless Draped Tunic & Cigarette Pant Set", "Geometric Print Blazer & Culottes Co-ord Set"
    ],
    "fabrics": ["Pure Cotton 60:60 with Soft Wash", "Chanderi Silk with Cotton Crepe Lining", "Belgian Linen Blend", "Artisanal Flowing Satin Crepe", "Hand-Block Modal Silk Blend"]
  },
  {
    "file": "umbrella-dresses.ts",
    "category": "umbrella-dresses",
    "name": "Umbrella Dresses",
    "folder": "public/umbrella-dresses",
    "base_price": 1999,
    "prefix": "ud",
    "names": ["Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia", "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi", "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha", "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika", "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha", "Kriti", "Disha", "Bhumi", "Yami", "Taapsee", "Tamannaah", "Rashmika", "Samantha", "Nayanthara", "Pooja", "Keerthy", "Sai", "Kajal", "Hansika", "Raashii", "Mrinal", "Sanya", "Fatima", "Sobhita", "Mithila", "Ahsaas", "Prajakta", "Kusha", "Dolly", "Navya", "Alanna", "Aaliyah", "Palak", "Roohi", "Inaaya", "Samisha", "Vamika", "Devi", "Malti", "Raha", "Zehra", "Arya", "Lavanya", "Niharika", "Tanya", "Bhavya", "Charu", "Devika", "Esha", "Gauri", "Hansa", "Jahnavi", "Komal", "Lopa", "Mansi"],
    "styles": [
      "Handcrafted Chanderi Silk Umbrella Dress", "Pure Mulmul Cotton Flared Umbrella Dress", "Tiered Georgette Circular Umbrella Maxi",
      "Hand-Block Print Cotton Gown Umbrella Dress", "Angrakha Kalidar Umbrella Flare Dress", "Embroidered Yoke Draped Umbrella Dress",
      "Bandhani Pleated High-Volume Umbrella Dress", "Asymmetric Hemline Flowing Umbrella Dress", "Tiered Schiffli Cotton Umbrella Gown",
      "Brocade Trimmed Festive Umbrella Maxi Dress", "Sleeveless Minimalist Linen Umbrella Dress", "Belted Wrap Tiered Umbrella Dress"
    ],
    "fabrics": ["Pure Mulmul Cotton with Hand-Blocked Motifs", "Chanderi Silk with Full Soft Lining", "Lightweight Flowing Georgette", "Fine Modal Silk", "Organic Handloom Cotton"]
  },
  {
    "file": "denim-collection.ts",
    "category": "denim-collection",
    "name": "Denim Collection",
    "folder": "public/denim-collection",
    "base_price": 2499,
    "prefix": "dn",
    "names": ["Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia", "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi", "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha", "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika", "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha", "Kriti", "Disha", "Bhumi", "Yami", "Taapsee", "Tamannaah", "Rashmika", "Samantha", "Nayanthara", "Pooja", "Keerthy", "Sai", "Kajal", "Hansika", "Raashii", "Mrinal", "Sanya", "Fatima", "Sobhita", "Mithila", "Ahsaas", "Prajakta", "Kusha", "Dolly", "Navya", "Alanna", "Aaliyah", "Palak", "Roohi", "Inaaya", "Samisha", "Vamika", "Devi", "Malti", "Raha", "Zehra", "Arya", "Lavanya", "Niharika", "Tanya", "Bhavya", "Charu", "Devika", "Esha", "Gauri", "Hansa", "Jahnavi", "Komal", "Lopa", "Mansi"],
    "styles": [
      "High-Rise Vintage Flared Denim Jeans", "Wide-Leg Rigid Selvedge Denim Trousers", "Acid-Washed Barrel Leg Slouchy Jeans",
      "Raw Indigo Relaxed Tapered Denim Pants", "Boyfriend Fit Distressed Everyday Denim", "Clean-Cut High-Waisted Indigo Denim",
      "Utility Cargo Pocket Relaxed Denim Jeans", "Stone-Washed Slouchy Skate Denim Trousers", "Pleated Wide-Leg Tailored Denim",
      "Cropped Kick-Flare Raw Hem Denim Jeans", "Classic Straight-Leg Vintage Denim", "Draped Belted Paperbag Waist Denim"
    ],
    "fabrics": ["13.5 Oz 100% Rigid Ring-Spun Cotton Denim", "12 Oz Comfort-Stretch Cotton Denim", "14 Oz Japanese Selvedge Cotton Denim", "11.5 Oz Organic Eco-Washed Denim", "13 Oz Vintage Acid-Washed Cotton Denim"]
  },
  {
    "file": "hoodies-sweatshirts.ts",
    "category": "hoodies-sweatshirts",
    "name": "Hoodies & Sweatshirts",
    "folder": "public/hoodies-sweatshirts",
    "base_price": 1899,
    "prefix": "hd",
    "names": ["Aria", "Zephyr", "Kaya", "Sienna", "Milan", "Orion", "Nova", "Rowan", "Zuri", "Elysia", "Kyoto", "Vesper", "Astrid", "Terra", "Luxe", "Solstice", "Blakely", "Emerson", "Oslo", "Vance", "Reese", "Cruz", "Harlow", "Kenzo", "Sage", "Dallas", "Nico", "Indie", "Marlow", "Bodhi", "Sora", "Remi", "Eden", "Atlas", "Juno", "Phoenix", "Sterling", "Koa", "Jasper", "Axel"],
    "styles": [
      "Heavyweight Brushed Cotton Boxy Hoodie", "Vintage Acid-Washed Oversized Sweatshirt", "Drop-Shoulder Diagonal French Terry Pullover",
      "Kangaroo Pocket Cozy Fleece Streetwear Hoodie", "Ribbed Trim Relaxed Crewneck Sweatshirt", "Garment-Dyed Minimalist Heavy Fleece Hoodie",
      "Clean-Edge Luxury French Terry Sweatshirt", "Raglan Sleeve Export Streetwear Pullover Hoodie", "Pastel Graphic Print French Terry Pullover",
      "Double-Stitched Heavyweight Fleece Sweatshirt", "Classic Streetwear Relaxed Oversized Hoodie", "Subtle Graphic Embroidered Fleece Pullover"
    ],
    "fabrics": ["380 GSM Heavyweight 100% Combed Cotton Brushed Fleece", "400 GSM Heavyweight Acid-Washed Loopback French Terry", "420 GSM Luxury Diagonal Loopback Cotton Terry", "360 GSM Carbon-Brushed Super-Soft Jersey Fleece", "390 GSM Urban Loopback Terry Cotton"]
  },
  {
    "file": "t-shirts.ts",
    "category": "t-shirts",
    "name": "T-Shirts",
    "folder": "public/t-shirts",
    "base_price": 899,
    "prefix": "ts",
    "names": ["Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia", "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi", "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha", "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika"],
    "styles": [
      "Heavyweight Combed Cotton Oversized T-Shirt", "Relaxed Drop-Shoulder Boxy Tee", "Vintage Washed Organic Cotton Graphic T-Shirt",
      "Ribbed Crewneck Classic Fit Bio-Washed Tee", "Artisanal Screen-Printed Acid-Wash T-Shirt", "Minimalist Embroidered Chest Pocket Tee",
      "French Terry Cotton Boxy Crop T-Shirt", "Distressed Hem Streetwear Oversized Tee", "Garment-Dyed Heavyweight Relaxed T-Shirt",
      "Premium Ring-Spun Cotton Lounge Tee", "Contrast Ribbed Collar Retro Ringer T-Shirt", "Slub Jersey Breathable Casual Tee"
    ],
    "fabrics": ["240 GSM Heavyweight 100% Combed Cotton Single Jersey", "220 GSM Bio-Washed Ring-Spun Organic Cotton", "Acid-Washed Vintage Cotton with Silicone Soft Wash", "French Terry 260 GSM Loopback Cotton", "Breathable Slub Cotton Jersey with Pre-Shrunk Finish"]
  },
  {
    "file": "tops-shirts.ts",
    "category": "tops-shirts",
    "name": "Tops & Shirts",
    "folder": "public/tops-shirts",
    "base_price": 1299,
    "prefix": "tp",
    "names": ["Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia", "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi", "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha", "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika", "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha", "Kriti", "Disha", "Bhumi", "Yami", "Taapsee", "Tamannaah", "Rashmika", "Samantha", "Nayanthara", "Pooja", "Keerthy", "Sai", "Kajal", "Hansika", "Raashii", "Mrinal", "Sanya", "Fatima", "Sobhita", "Mithila", "Ahsaas", "Prajakta", "Kusha", "Dolly", "Navya", "Alanna", "Aaliyah", "Palak", "Roohi", "Inaaya", "Samisha", "Vamika", "Devi", "Malti", "Raha", "Zehra", "Arya", "Lavanya", "Niharika", "Tanya", "Bhavya", "Charu", "Devika", "Esha", "Gauri", "Hansa", "Jahnavi", "Komal", "Lopa", "Mansi"],
    "styles": [
      "Schiffli Embroidered Peplum Cotton Top", "Hand-Block Printed Mandarin Collar Shirt", "Chanderi Silk Pintuck Draped Blouse",
      "Linen Wrap Front Tie-Up Artisan Top", "Floral Printed Notch Neck Relaxed Shirt", "Smocked Waist Tiered Flutter Sleeve Top",
      "Chikankari Handloom Short Tunic Blouse", "Asymmetric High-Low Modal Satin Shirt", "Bandhani Yoke Gathered Artisan Top",
      "Tailored Collared Silk Resort Shirt", "Embroidered Button-Down Mulmul Cotton Shirt", "Balloon Sleeve Keyhole Neck Artisan Blouse"
    ],
    "fabrics": ["Pure Mulmul Cotton 60:60", "Lustrous Chanderi Silk Blend", "Fine Belgian Linen Cotton", "Lightweight Modal Satin", "Organic Slub Khadi Cotton"]
  },
  {
    "file": "ethnic-wear-sets.ts",
    "category": "ethnic-wear-sets",
    "name": "Ethnic Wear Sets",
    "folder": "public/ethnic-wear-sets",
    "base_price": 2799,
    "prefix": "ew",
    "names": ["Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia", "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi", "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha", "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika", "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha", "Kriti", "Disha", "Bhumi", "Yami", "Taapsee", "Tamannaah", "Rashmika", "Samantha", "Nayanthara", "Pooja", "Keerthy", "Sai", "Kajal", "Hansika", "Raashii", "Mrinal", "Sanya", "Fatima", "Sobhita", "Mithila", "Ahsaas", "Prajakta", "Kusha", "Dolly", "Navya", "Alanna", "Aaliyah", "Palak", "Roohi", "Inaaya", "Samisha", "Vamika", "Devi", "Malti", "Raha", "Zehra", "Arya", "Lavanya", "Niharika", "Tanya", "Bhavya", "Charu", "Devika", "Esha", "Gauri", "Hansa", "Jahnavi", "Komal", "Lopa", "Mansi"],
    "styles": [
      "Embroidered Kurta, Pant & Organza Dupatta 3-Piece Set", "Chanderi Silk Kalidar Anarkali & Dupatta 3-Piece Set", "Handcrafted Gota Patti Kurti & Sharara 3-Piece Set",
      "Zari Flared Angrakha & Palazzo Dupatta 3-Piece Set", "Chikankari Hand-Embroidered Kurta & Pant Set with Dupatta", "Bandhani Silk Straight Kurti & Cigarette Pant Set",
      "Tiered Flared Anarkali with Embroidered Net Dupatta", "Banarasi Brocade Yoke Kurta & Trousers Set", "Hand-Block Floral Printed Kurti & Flared Palazzo Set",
      "Draped Asymmetric Kurta & Dhoti Pant 3-Piece Set", "Georgette Mirror Work Kurti & Sharara Set", "Pure Chiffon Draped Kurta & Culottes Set"
    ],
    "fabrics": ["Pure Chanderi Silk with Mulmul Lining", "Handloom Silk Cotton with Organza Dupatta", "Fine Muslin with Delicate Thread Detailing", "Pure Mulmul Cotton with Gota Patti Trim", "Modal Silk with Zari Accents"]
  },
  {
    "file": "short-long-kaftan.ts",
    "category": "short-long-kaftan",
    "name": "Kaftans (Short & Long)",
    "folder": "public/short-long-kaftan",
    "base_price": 1699,
    "prefix": "kf",
    "names": ["Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia", "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi", "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha", "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika", "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha", "Kriti", "Disha", "Bhumi", "Yami", "Taapsee", "Tamannaah", "Rashmika", "Samantha", "Nayanthara", "Pooja", "Keerthy", "Sai", "Kajal", "Hansika", "Raashii", "Mrinal", "Sanya", "Fatima", "Sobhita", "Mithila", "Ahsaas", "Prajakta", "Kusha", "Dolly", "Navya", "Alanna", "Aaliyah", "Palak", "Roohi", "Inaaya", "Samisha", "Vamika", "Devi", "Malti", "Raha", "Zehra", "Arya", "Lavanya", "Niharika", "Tanya", "Bhavya", "Charu", "Devika", "Esha", "Gauri", "Hansa", "Jahnavi", "Komal", "Lopa", "Mansi"],
    "styles": [
      "Pure Cotton Hand-Block Print Drawstring Long Kaftan", "Chanderi Silk Embroidered V-Neck Resort Short Kaftan", "Flowing Georgette Tiered Floor-Length Kaftan",
      "Bandhani Modal Silk Kimono Sleeve Maxi Kaftan", "Handcrafted Tassel-Tie Bohemian Summer Short Kaftan", "Schiffli Embroidered Scalloped Hem Resort Kaftan",
      "Printed Satin Crepe Belted Evening Kaftan", "Artisanal Draped Asymmetric Silhouette Long Kaftan", "Pure Mulmul Cotton Breathable Lounge Short Kaftan",
      "Organza Bordered Festive Silk Kaftan Gown", "Chikankari Hand-Embroidered Relaxed Fit Kaftan", "High-Slit Draped Silk Resort Maxi Kaftan"
    ],
    "fabrics": ["Pure Mulmul Cotton 60:60 with Soft Wash", "Chanderi Silk with Full Soft Lining", "Lightweight Modal Satin Blend", "Artisanal Georgette with Fluid Drape", "Pure Handloom Cotton"]
  },
  {
    "file": "traditional-gowns.ts",
    "category": "traditional-gowns",
    "name": "Traditional Gowns",
    "folder": "public/traditional-gowns",
    "base_price": 3499,
    "prefix": "tg",
    "names": ["Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia", "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi", "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha", "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika", "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha", "Kriti", "Disha", "Bhumi", "Yami", "Taapsee", "Tamannaah", "Rashmika", "Samantha", "Nayanthara", "Pooja", "Keerthy", "Sai", "Kajal", "Hansika", "Raashii", "Mrinal", "Sanya", "Fatima", "Sobhita", "Mithila", "Ahsaas", "Prajakta", "Kusha", "Dolly", "Navya", "Alanna", "Aaliyah", "Palak", "Roohi", "Inaaya", "Samisha", "Vamika", "Devi", "Malti", "Raha", "Zehra", "Arya", "Lavanya", "Niharika", "Tanya", "Bhavya", "Charu", "Devika", "Esha", "Gauri", "Hansa", "Jahnavi", "Komal", "Lopa", "Mansi"],
    "styles": [
      "Royal Kalidar Zari Embroidered Anarkali Gown", "Chanderi Silk Gota Patti Floor-Length Gown", "Brocade Banarasi Festive Kalidar Gown",
      "Handcrafted Mirror Work Draped Royal Gown", "Organza Tiered Heritage Anarkali Gown", "Bandhani Silk Grand Volume Traditional Gown",
      "Embroidered Yoke Pleated Georgette Gown", "Heritage Angrakha Flared Silk Anarkali Gown", "Chikankari Hand-Embroidered Regal Gown",
      "Sequinned Velvet Bordered Grand Gala Gown", "Artisanal Draped Silk Cape Kalidar Gown", "Flared Raw Silk Festive Court Gown"
    ],
    "fabrics": ["Pure Chanderi Silk with Heavy Zari Embroidery", "Banarasi Brocade with Satin Crepe Lining", "Fine Mulmul Cotton with Elaborate Gota Patti", "Rich Modal Silk Blend", "Lustrous Raw Silk with Micro Crepe Lining"]
  },
  {
    "file": "western-dresses.ts",
    "category": "western-dresses",
    "name": "Western Dresses",
    "folder": "public/western-dresses",
    "base_price": 1899,
    "prefix": "wd",
    "names": ["Aria", "Sienna", "Elena", "Zoya", "Maya", "Kavya", "Rhea", "Mira", "Noor", "Alia", "Tara", "Siya", "Diya", "Ananya", "Ishita", "Shanaya", "Suhana", "Zara", "Avani", "Tanvi", "Naira", "Riddhi", "Sitara", "Aanya", "Saanvi", "Kiara", "Reet", "Pari", "Meera", "Isha", "Radhika", "Shreya", "Aditi", "Simran", "Trisha", "Vanya", "Sara", "Janvi", "Khushi", "Deepika", "Kareena", "Anushka", "Priyanka", "Katrina", "Shraddha", "Kriti", "Disha", "Bhumi", "Yami", "Taapsee", "Tamannaah", "Rashmika", "Samantha", "Nayanthara", "Pooja", "Keerthy", "Sai", "Kajal", "Hansika", "Raashii", "Mrinal", "Sanya", "Fatima", "Sobhita", "Mithila", "Ahsaas", "Prajakta", "Kusha", "Dolly", "Navya", "Alanna", "Aaliyah", "Palak", "Roohi", "Inaaya", "Samisha", "Vamika", "Devi", "Malti", "Raha", "Zehra", "Arya", "Lavanya", "Niharika", "Tanya", "Bhavya", "Charu", "Devika", "Esha", "Gauri", "Hansa", "Jahnavi", "Komal", "Lopa", "Mansi"],
    "styles": [
      "Tiered Flared Cotton Midi Dress", "Pleated Wrap V-Neck Resort Maxi Dress", "Schiffli Embroidered Button-Down Shirt Dress",
      "Floral Printed Tiered Sundress with Pockets", "Smocked Waist A-Line Silhouette Dress", "Asymmetric Ruffle Hemline Cocktail Dress",
      "Handcrafted Linen Tie-Belt Shift Dress", "Balloon Sleeve Empire Waist Babydoll Dress", "Draped Silk Cowl Neck Evening Dress",
      "Tiered Flutter Sleeve Midi Sundress", "Minimalist Column Cut Sleeveless Dress", "Fit & Flare Sweetheart Neckline Midi Dress"
    ],
    "fabrics": ["Pure Cotton 60:60 with Soft Garment Wash", "Lightweight Flowing Rayon Georgette", "Belgian Linen Cotton Blend", "Soft Modal Satin with Fluid Drape", "Pure Mulmul Cotton with Hand-Blocked Motifs"]
  }
]

print("Metadata loaded for all 10 categories.")
