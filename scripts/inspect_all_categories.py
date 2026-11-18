import os, json, re

categories = [
  {"cat": "cord-sets", "dir": "public/cord-sets", "data": "data/cord-sets.ts"},
  {"cat": "umbrella-dresses", "dir": "public/umbrella-dresses", "data": "data/umbrella-dresses.ts"},
  {"cat": "denim-collection", "dir": "public/denim-collection", "data": "data/denim-collection.ts"},
  {"cat": "hoodies-sweatshirts", "dir": "public/hoodies-sweatshirts", "data": "data/hoodies-sweatshirts.ts"},
  {"cat": "t-shirts", "dir": "public/t-shirts", "data": "data/t-shirts.ts"},
  {"cat": "tops-shirts", "dir": "public/tops-shirts", "data": "data/tops-shirts.ts"},
  {"cat": "ethnic-wear-sets", "dir": "public/ethnic-wear-sets", "data": "data/ethnic-wear-sets.ts"},
  {"cat": "short-long-kaftan", "dir": "public/short-long-kaftan", "data": "data/short-long-kaftan.ts"},
  {"cat": "traditional-gowns", "dir": "public/traditional-gowns", "data": "data/traditional-gowns.ts"},
  {"cat": "western-dresses", "dir": "public/western-dresses", "data": "data/western-dresses.ts"}
]

for c in categories:
    f_count = 0
    if os.path.exists(c['dir']):
        f_count = sum(len(files) for _, _, files in os.walk(c['dir']))
    
    prod_count = 0
    if os.path.exists(c['data']):
        txt = open(c['data'], encoding='utf-8').read()
        m = re.search(r'=\s*(\[[\s\S]*?\]);\s*$', txt)
        if m:
            try:
                prods = json.loads(m.group(1))
                prod_count = len(prods)
            except Exception as e:
                prod_count = f"Error: {e}"
                
    print(f"{c['cat']:<22} | Physical Images: {f_count:<5} | Current Listings: {prod_count}")
