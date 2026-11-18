import json

with open('data/product-overrides.json', 'r', encoding='utf-8') as f:
    ovs = json.load(f)

cleaned = {}
for k, v in ovs.items():
    if v.get('deleted') or v.get('purged'):
        print(f"Pruned stale deleted override: {k}")
        continue
    cleaned[k] = v

with open('data/product-overrides.json', 'w', encoding='utf-8') as f:
    json.dump(cleaned, f, indent=2)

print(f"Cleaned product-overrides.json: {len(cleaned)} active overrides remaining.")
