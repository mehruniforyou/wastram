const fs = require('fs');

const file = 'app/admin/AdminClientPage.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStart = '  // Build unified initial specs rows: loads all technical_specs directly into the editor table';
const targetEnd = '  const initialTag = (product as any)?.tag || product?.seo_meta?.badge_text || "";';

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers:', { startIndex, endIndex });
  process.exit(1);
}

const replacement = `  // Build unified initial specs rows: loads all technical_specs directly into the editor table
  const initialSpecsRows: Array<{ key: string; value: string }> = [];
  const existingTechSpecs = (product?.technical_specs || (product as any)?.technical_specs);

  if (existingTechSpecs && typeof existingTechSpecs === "object" && Object.keys(existingTechSpecs).length > 0) {
    for (const [key, value] of Object.entries(existingTechSpecs)) {
      if (suppressedSpecKeys.has(key.toLowerCase().trim())) continue;
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        initialSpecsRows.push({ key, value: String(value) });
      }
    }
    const hasKey = (k: string) => initialSpecsRows.some(r => r.key.toLowerCase().trim() === k.toLowerCase().trim());
    if (!hasKey("Fabric") && initialFabric) {
      initialSpecsRows.push({ key: "Fabric", value: initialFabric });
    }
    if (!hasKey("Craft") && initialCraft) {
      initialSpecsRows.push({ key: "Craft", value: initialCraft });
    }
    if (!hasKey("SKU") && !hasKey("Part Number") && initialPartNumber) {
      initialSpecsRows.push({ key: "SKU", value: initialPartNumber });
    }
  } else {
    initialSpecsRows.push({ key: "Condition", value: "Brand New (Export Grade)" });
    if (initialFabric) initialSpecsRows.push({ key: "Fabric", value: initialFabric });
    if (initialCraft) initialSpecsRows.push({ key: "Craft", value: initialCraft });
    if (initialPartNumber) initialSpecsRows.push({ key: "SKU", value: initialPartNumber });
  }

`;

content = content.slice(0, startIndex) + replacement + content.slice(endIndex);
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched specs block in AdminClientPage.tsx');
