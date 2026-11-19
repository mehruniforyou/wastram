import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getFirebaseDb } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Storage file for Image Productisation state (local dev fallback)
const DATA_FILE = path.join(process.cwd(), 'data', 'image-productisation.json');

export interface VariantSubset {
  id: string;
  name: string;
  colorCode?: string;
  images: string[];
  coverImage?: string;
}

export interface ProductGroup {
  id: string;
  name: string;
  categoryId: string;
  generalImages: string[];
  variants: VariantSubset[];
  coverImage?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryState {
  categoryId: string;
  categoryName: string;
  status: 'not_started' | 'in_progress' | 'completed';
  approvedExclusions?: string[];
  lastUpdated: string;
}

export interface ProductisationStore {
  groups: ProductGroup[];
  categoriesState: Record<string, CategoryState>;
  updatedAt: string;
}

// Categories list
const CATEGORY_DEFINITIONS = [
  { id: 'traditional-gowns', name: 'Traditional Gowns', folder: 'traditional-gowns' },
  { id: 'western-dresses', name: 'Western Dresses', folder: 'western-dresses' },
  { id: 'cord-sets', name: 'Co-ord Sets', folder: 'cord-sets' },
  { id: 'tops-shirts', name: 'Tops & Shirts', folder: 'tops-shirts' },
  { id: 'ethnic-wear-sets', name: 'Ethnic Wear Sets', folder: 'ethnic-wear-sets' },
  { id: 'short-long-kaftan', name: 'Short & Long Kaftans', folder: 'short-long-kaftan' },
  { id: 'umbrella-dresses', name: 'Umbrella Dresses', folder: 'umbrella-dresses' },
  { id: 'denim-collection', name: 'Denim Collection', folder: 'denim-collection' },
  { id: 't-shirts', name: 'T-Shirts', folder: 't-shirts' },
  { id: 'hoodies-sweatshirts', name: 'Hoodies & Sweatshirts', folder: 'hoodies-sweatshirts' },
  { id: 'dresses-images', name: 'Dresses & Studio Shoots', folder: 'dresses-images' },
  { id: 'mix-category-product-images', name: 'Mix Category Images', folder: 'mix-category-product-images' },
];

let inMemoryProductisationStore: ProductisationStore | null = null;
let lastStoreLoadedTime = 0;
const STORE_CACHE_TTL = 5 * 1000; // 5 seconds

async function readStore(): Promise<ProductisationStore> {
  const now = Date.now();
  if (inMemoryProductisationStore && now - lastStoreLoadedTime < STORE_CACHE_TTL) {
    return inMemoryProductisationStore;
  }

  // 1. Try Firestore Admin SDK (Primary production storage on Vercel)
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const snap = await adminDb.collection('orders').doc('_image_productisation_store').get();
      if (snap.exists) {
        const data = snap.data() as ProductisationStore;
        if (data && Array.isArray(data.groups)) {
          inMemoryProductisationStore = {
            groups: data.groups,
            categoriesState: data.categoriesState || {},
            updatedAt: data.updatedAt || new Date().toISOString()
          };
          lastStoreLoadedTime = now;
          return inMemoryProductisationStore;
        }
      }
    }
  } catch (err: any) {
    console.warn('[ImageProductisation] Firestore Admin read notice:', err.message);
  }

  // 2. Try Firebase Client SDK
  try {
    const clientDb = getFirebaseDb();
    if (clientDb) {
      const snap = await getDoc(doc(clientDb, 'orders', '_image_productisation_store'));
      if (snap.exists()) {
        const data = snap.data() as ProductisationStore;
        if (data && Array.isArray(data.groups)) {
          inMemoryProductisationStore = {
            groups: data.groups,
            categoriesState: data.categoriesState || {},
            updatedAt: data.updatedAt || new Date().toISOString()
          };
          lastStoreLoadedTime = now;
          return inMemoryProductisationStore;
        }
      }
    }
  } catch (err: any) {
    console.warn('[ImageProductisation] Firebase Client read notice:', err.message);
  }

  // 3. Fallback to local disk file (Development environment)
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.groups)) {
        inMemoryProductisationStore = parsed;
        lastStoreLoadedTime = now;
        return parsed;
      }
    }
  } catch (err: any) {
    console.warn('[ImageProductisation] Disk read notice:', err.message);
  }

  return {
    groups: [],
    categoriesState: {},
    updatedAt: new Date().toISOString()
  };
}

async function writeStore(store: ProductisationStore): Promise<void> {
  inMemoryProductisationStore = store;
  lastStoreLoadedTime = Date.now();

  // 1. Save to Firestore Admin SDK (Primary)
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection('orders').doc('_image_productisation_store').set(store, { merge: true });
    }
  } catch (err: any) {
    console.warn('[ImageProductisation] Firestore Admin write notice:', err.message);
  }

  // 2. Save to Firebase Client SDK
  try {
    const clientDb = getFirebaseDb();
    if (clientDb) {
      await setDoc(doc(clientDb, 'orders', '_image_productisation_store'), store, { merge: true });
    }
  } catch (err: any) {
    console.warn('[ImageProductisation] Firebase Client write notice:', err.message);
  }

  // 3. Save to local disk (safely ignored in read-only Vercel environments)
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (_) {}
}

// Scan public folder for all available images
function scanCategoryImages() {
  const publicDir = path.join(process.cwd(), 'public');
  const imagesByCategory: Record<string, { filename: string; url: string; categoryId: string; categoryName: string }[]> = {};

  for (const cat of CATEGORY_DEFINITIONS) {
    const catFolder = path.join(publicDir, cat.folder);
    const catImages: { filename: string; url: string; categoryId: string; categoryName: string }[] = [];

    if (fs.existsSync(catFolder)) {
      try {
        const files = fs.readdirSync(catFolder);
        files.forEach((f) => {
          if (/\.(jpg|jpeg|png|webp|avif)$/i.test(f)) {
            catImages.push({
              filename: f,
              url: `/${cat.folder}/${f}`,
              categoryId: cat.id,
              categoryName: cat.name
            });
          }
        });
      } catch (err) {
        console.error(`Error reading folder ${catFolder}:`, err);
      }
    }

    imagesByCategory[cat.id] = catImages;
  }

  return imagesByCategory;
}

export async function GET(req: NextRequest) {
  try {
    const imagesByCategory = scanCategoryImages();
    const store = await readStore();

    // Ensure all categories have a state entry
    for (const cat of CATEGORY_DEFINITIONS) {
      if (!store.categoriesState[cat.id]) {
        store.categoriesState[cat.id] = {
          categoryId: cat.id,
          categoryName: cat.name,
          status: 'not_started',
          approvedExclusions: [],
          lastUpdated: new Date().toISOString()
        };
      }
    }

    return NextResponse.json({
      success: true,
      categories: CATEGORY_DEFINITIONS,
      imagesByCategory,
      groups: store.groups,
      categoriesState: store.categoriesState,
      updatedAt: store.updatedAt
    }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const currentStore = await readStore();

    if (body.action === 'save') {
      const updatedStore: ProductisationStore = {
        groups: Array.isArray(body.groups) ? body.groups : currentStore.groups,
        categoriesState: body.categoriesState || currentStore.categoriesState,
        updatedAt: new Date().toISOString()
      };
      await writeStore(updatedStore);
      return NextResponse.json({ success: true, updatedAt: updatedStore.updatedAt });
    }

    if (body.action === 'import') {
      if (!body.data || !Array.isArray(body.data.groups)) {
        return NextResponse.json({ success: false, error: 'Invalid backup data format' }, { status: 400 });
      }
      const importedStore: ProductisationStore = {
        groups: body.data.groups,
        categoriesState: body.data.categoriesState || {},
        updatedAt: new Date().toISOString()
      };
      await writeStore(importedStore);
      return NextResponse.json({ success: true, message: 'Backup successfully imported', updatedAt: importedStore.updatedAt });
    }

    if (body.action === 'reset_category') {
      const categoryId = body.categoryId;
      if (!categoryId) {
        return NextResponse.json({ success: false, error: 'Missing categoryId' }, { status: 400 });
      }
      // Remove all groups belonging to this category
      currentStore.groups = currentStore.groups.filter(g => g.categoryId !== categoryId);
      if (currentStore.categoriesState[categoryId]) {
        currentStore.categoriesState[categoryId].status = 'not_started';
        currentStore.categoriesState[categoryId].approvedExclusions = [];
        currentStore.categoriesState[categoryId].lastUpdated = new Date().toISOString();
      }
      currentStore.updatedAt = new Date().toISOString();
      await writeStore(currentStore);
      return NextResponse.json({ success: true, message: `Category ${categoryId} reset to unproductised state` });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
