import os, re
from collections import defaultdict

def analyze_filenames(folder):
    files = sorted(os.listdir(folder))
    prefixes = defaultdict(list)
    for f in files:
        if f.startswith('_MG_'):
            num = re.search(r'_MG_(\d+)', f)
            prefixes['_MG_'].append((int(num.group(1)) if num else 0, f))
        elif f.startswith('IMG-'):
            m = re.search(r'IMG-(\d+)-WA(\d+)', f)
            if m:
                prefixes[f"WA_{m.group(1)}"].append((int(m.group(2)), f))
            else:
                prefixes['IMG-'].append((0, f))
        elif f.startswith('FB_IMG_'):
            m = re.search(r'FB_IMG_(\d+)', f)
            prefixes['FB_IMG_'].append((int(m.group(1)) if m else 0, f))
        elif re.match(r'^\d+\.jpg', f):
            m = re.search(r'^(\d+)', f)
            prefixes['NUM'].append((int(m.group(1)) if m else 0, f))
        else:
            prefixes['OTHER'].append((0, f))
            
    print(f"\n--- {folder} ({len(files)} files) ---")
    for pfx, items in prefixes.items():
        print(f"Prefix: {pfx} ({len(items)} files)")
        # Show min and max or sequence gaps
        if pfx in ['_MG_', 'FB_IMG_', 'NUM'] or pfx.startswith('WA_'):
            items.sort()
            # print chunks
            chunks = []
            curr_chunk = [items[0]]
            for i in range(1, len(items)):
                diff = items[i][0] - items[i-1][0]
                if (pfx == '_MG_' and diff > 3) or (pfx.startswith('WA_') and diff > 4) or (pfx == 'FB_IMG_' and diff > 50000) or (pfx == 'NUM' and diff > 20):
                    chunks.append(curr_chunk)
                    curr_chunk = [items[i]]
                else:
                    curr_chunk.append(items[i])
            if curr_chunk:
                chunks.append(curr_chunk)
            print(f"  -> Natural photoshoot chunks: {len(chunks)} groups")
            for idx, c in enumerate(chunks[:5]):
                print(f"     Group {idx+1} ({len(c)} imgs): {[x[1] for x in c[:4]]} ...")
            if len(chunks) > 5:
                print(f"     ... and {len(chunks)-5} more groups")

analyze_filenames('public/hoodies-sweatshirts')
analyze_filenames('public/denim-collection')
