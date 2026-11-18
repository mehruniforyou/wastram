import json, re

with open('data/cord-sets.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const [A-Z_]+: NishoramaProduct\[\] = (\[[\s\S]*?\]);\s*$', text)
products = json.loads(m.group(1))

aria_editions = [p for p in products if 'Aria Embroidered' in p['title']]
print(f'Aria has {len(aria_editions)} editions:')
for p in aria_editions:
    imgs = p.get('images', [])
    print(f"{p['id']} - {p['title']}: {len(imgs)} images -> {imgs}")
