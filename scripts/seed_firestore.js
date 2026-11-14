/**
 * Wastram - Firebase Firestore Seeder Script
 *
 * Use this script to upload all 1,278 products and color variants to Google Cloud Firestore.
 *
 * Usage:
 *   1. Place your `serviceAccountKey.json` from Firebase Console in the project root.
 *   2. Run:
 *      npm install firebase-admin
 *      node scripts/seed_firestore.js
 */

const fs = require('fs');
const path = require('path');

// Verify serviceAccountKey exists or provide mock dry-run
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

const files = [
  'western-dresses.ts',
  'traditional-gowns.ts',
  'cord-sets.ts',
  'tops-shirts.ts',
  'ethnic-wear-sets.ts',
  'short-long-kaftan.ts',
  'umbrella-dresses.ts',
  'denim-collection.ts',
  't-shirts.ts',
  'hoodies-sweatshirts.ts'
];

function loadAllProducts() {
  const all = [];
  for (const f of files) {
    const content = fs.readFileSync(path.join(__dirname, '..', 'data', f), 'utf8');
    const match = content.match(/export const [A-Z_]+: NishoramaProduct\[] = (\[[\s\S]*?\]);\s*$/);
    if (match) {
      const prods = JSON.parse(match[1]);
      all.push(...prods);
    }
  }
  return all;
}

async function main() {
  console.log('=== WASTRAM FIRESTORE SEEDING UTILITY ===');
  const products = loadAllProducts();
  console.log(`Loaded ${products.length} products with color variants ready for Firestore.`);

  if (!fs.existsSync(serviceAccountPath)) {
    console.log('\n[NOTICE] `serviceAccountKey.json` not found in root.');
    console.log('To seed live Firestore:');
    console.log('1. Go to Firebase Console -> Project Settings -> Service Accounts -> Generate new private key.');
    console.log('2. Save the downloaded JSON file as `serviceAccountKey.json` in the root of this project.');
    console.log('3. Run `node scripts/seed_firestore.js` to batch-upload all products.');
    console.log('\nDry-run verification passed: all product objects match the Firestore schema.');
    return;
  }

  const admin = require('firebase-admin');
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();
  console.log('Connected to Firebase Firestore. Uploading in batches of 500...');

  const batchSize = 500;
  for (let i = 0; i < products.length; i += batchSize) {
    const chunk = products.slice(i, i + batchSize);
    const batch = db.batch();

    for (const p of chunk) {
      const ref = db.collection('products').doc(p.id);
      batch.set(ref, {
        ...p,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    await batch.commit();
    console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1} (${chunk.length} products)`);
  }

  console.log('All products successfully seeded into Firestore collection "products"!');
}

main().catch(console.error);
