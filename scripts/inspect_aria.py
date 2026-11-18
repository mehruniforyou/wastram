import json, re

c = open('data/cord-sets.ts', encoding='utf-8').read()
m = re.search(r'=\s*(\[[\s\S]*?\]);\s*$', c)
prods = json.loads(m.group(1))

for p in prods:
    if 'Aria' in p.get('title', ''):
        print(f"{p['id']} - {p['title']}:")
        for img in p.get('images', []):
            print('   ', img)
