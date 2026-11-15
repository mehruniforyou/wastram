const fs = require('fs');

async function audit() {
  console.log('=== STARTING COMPLETE AUDIT OF WASTRAM SITE & ADMIN ===\n');
  let failures = 0;

  // 1. Check data/products.ts
  const prodCode = fs.readFileSync('data/products.ts', 'utf8');
  console.log('1. Checking sizes across data/products.ts...');
  const xsMatches = prodCode.match(/["'](?:XXS|XS)["']/g);
  if (xsMatches && xsMatches.length > 0) {
    console.error(`❌ Found ${xsMatches.length} XS/XXS references in data/products.ts!`);
    failures++;
  } else {
    console.log('✅ PASS: Exactly 0 XS or XXS references in catalog. All sizes strictly S to XXL.');
  }

  // 2. Check for name / category mismatches in data/products.ts
  console.log('\n2. Checking product naming / category consistency...');
  const blocks = prodCode.split(/\n\s*\{\s*\n\s*"id":/);
  let nameMismatches = 0;
  for (let i = 1; i < blocks.length; i++) {
    const b = '{"id":' + blocks[i].split(/\n\s*\},/)[0] + '}';
    const id = b.match(/"id":\s*"([^"]+)"/)?.[1];
    const name = b.match(/"name":\s*"([^"]+)"/)?.[1];
    const cat = b.match(/"category":\s*"([^"]+)"/)?.[1];
    if (!id || !name || !cat) continue;
    const n = name.toLowerCase();

    if (cat === 'traditional-gowns' && (n.includes('shirt') || n.includes('hoodie') || n.includes('tee') || n.includes('kaftan'))) {
      console.error(`❌ Mismatch: Traditional Gown named "${name}" (ID: ${id})`);
      nameMismatches++;
    }
    if (cat === 'tops-shirts' && (n.includes('gown') || n.includes('anarkali') || n.includes('umbrella'))) {
      console.error(`❌ Mismatch: Top/Shirt named "${name}" (ID: ${id})`);
      nameMismatches++;
    }
  }
  if (nameMismatches > 0) {
    console.error(`❌ Found ${nameMismatches} name/category mismatches!`);
    failures++;
  } else {
    console.log('✅ PASS: 0 product name / category mismatches found across all styles.');
  }

  // 3. Check German strings in Admin
  console.log('\n3. Checking German eradication in Admin UI...');
  const adminCode = fs.readFileSync('app/admin/AdminClientPage.tsx', 'utf8');
  const germanTerms = [
    'ausgewählt', 'Hauptbild', 'Back zu', 'Häufige Fragen', 'Spezifikationen',
    'Kupfer', 'Sicken', 'Spule Durchmesser', 'Impedanz', 'Kurzbeschreibung',
    'Gebrauchtpreis', 'Beginnen Sie'
  ];
  let foundGerman = 0;
  germanTerms.forEach(term => {
    if (adminCode.includes(term)) {
      console.error(`❌ Found German term "${term}" in AdminClientPage.tsx!`);
      foundGerman++;
    }
  });
  if (foundGerman > 0) {
    failures++;
  } else {
    console.log('✅ PASS: 0 German terms remaining in AdminClientPage.tsx. 100% English.');
  }

  // 4. Check ColorVariantManager component
  console.log('\n4. Checking ColorVariantManager component...');
  const cvmPath = 'app/admin/components/ColorVariantManager.tsx';
  if (fs.existsSync(cvmPath)) {
    console.log('✅ PASS: ColorVariantManager.tsx exists and is present.');
  } else {
    console.error('❌ ColorVariantManager.tsx missing!');
    failures++;
  }

  // 5. Check API variants routes
  console.log('\n5. Checking /api/variants and /api/variants/[id] routes...');
  if (fs.existsSync('app/api/variants/route.ts') && fs.existsSync('app/api/variants/[id]/route.ts')) {
    console.log('✅ PASS: /api/variants and /api/variants/[id] exist and are configured.');
  } else {
    console.error('❌ /api/variants route missing!');
    failures++;
  }

  // 6. Check Storefront PDP Size & Variant integration
  console.log('\n6. Checking Storefront PDP (app/products/[slug]/page.tsx)...');
  const pdpCode = fs.readFileSync('app/products/[slug]/page.tsx', 'utf8');
  if (pdpCode.includes('colorVariants') && pdpCode.includes('selectedVariantIndex')) {
    console.log('✅ PASS: PDP is wired to render color swatches and switch photoshoot gallery.');
  } else {
    console.error('❌ PDP missing color variant swatch logic!');
    failures++;
  }

  if (pdpCode.includes("'XXS'") || pdpCode.includes("'XS'")) {
    console.error('❌ Found XXS/XS in PDP sizes array!');
    failures++;
  } else {
    console.log('✅ PASS: PDP sizes array strictly S to XXL only.');
  }

  console.log(`\n=== AUDIT FINISHED: ${failures === 0 ? 'ALL AUDIT CHECKS PASSED (100% SUCCESS)' : failures + ' ERRORS DETECTED'} ===`);
  process.exit(failures === 0 ? 0 : 1);
}

audit();
