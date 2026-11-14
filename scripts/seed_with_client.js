/**
 * Wastram - Client SDK Firestore Seeder
 * 
 * Uses your Firebase Web Client Configuration directly without needing a service account key!
 * (Requires Firestore Rules to allow write or be in test mode)
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, writeBatch } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBB62kPVeyIFKv4llhEnfNGSbVuwG46dvA",
  authDomain: "wastram-a7300.firebaseapp.com",
  projectId: "wastram-a7300",
  storageBucket: "wastram-a7300.firebasestorage.app",
  messagingSenderId: "745350832764",
  appId: "1:745350832764:web:fa54c467e3c45288badff9",
  measurementId: "G-H1TL4EBKB8"
};

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
    const filePath = path.join(__dirname, '..', 'data', f);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/export const [A-Z_]+: NishoramaProduct\[] = (\[[\s\S]*?\]);\s*$/);
    if (match) {
      try {
        const prods = JSON.parse(match[1]);
        all.push(...prods);
      } catch (err) {
        console.error(`Error parsing ${f}:`, err.message);
      }
    }
  }
  return all;
}

async function runSeed() {
  console.log('=== WASTRAM CLIENT FIRESTORE SEEDER ===');
  const products = loadAllProducts();
  console.log(`Loaded ${products.length} products across all 10 categories.`);

  console.log('Connecting to Firebase project: wastram-a7300...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const BATCH_SIZE = 400; // Firestore limit is 500 ops per batch
  const totalBatches = Math.ceil(products.length / BATCH_SIZE);

  console.log(`Starting upload in ${totalBatches} batches...`);

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const chunk = products.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);

    for (const p of chunk) {
      const docRef = doc(db, 'products', p.id);
      batch.set(docRef, {
        ...p,
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }

    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    process.stdout.write(`Writing batch ${batchNum} of ${totalBatches} (${chunk.length} products)... `);
    try {
      await batch.commit();
      console.log('DONE');
    } catch (err) {
      console.log('FAILED');
      console.error(`\nBatch ${batchNum} error:`, err.message);
      if (err.message.includes('PERMISSION_DENIED')) {
        console.error('\n--> PERMISSION DENIED: Please update your Firestore Security Rules in the Firebase Console:');
        console.error('    1. Open https://console.firebase.google.com/project/wastram-a7300/firestore/rules');
        console.error('    2. Set `allow read, write: if true;`');
        console.error('    3. Click Publish and re-run this script!\n');
      }
      process.exit(1);
    }
  }

  console.log('\nAll products successfully uploaded to Firestore!');
}

runSeed().catch(console.error);
