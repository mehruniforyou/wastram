import fs from 'fs';
import path from 'path';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getFirebaseDb } from '@/lib/firebaseClient';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import defaultHomeCovers from '@/data/home-covers.json';

export interface HeroCoverItem {
  id: string;
  label: string;
  section: string;
  image: string;
  tagText?: string;
  tagLink?: string;
  alt?: string;
}

export interface CategoryCoverItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  label: string;
}

export interface ChapterCoverItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  slug: string;
  image: string;
  tag?: string;
  label: string;
}

export interface ReelCoverItem {
  id: string;
  title: string;
  category: string;
  slug: string;
  thumbnail: string;
  caption: string;
  label: string;
}

export interface SingleCoverItem {
  id: string;
  image: string;
  label: string;
  alt?: string;
  caption?: string;
  subcaption?: string;
}

export interface HomeCoversStore {
  hero: {
    primary: HeroCoverItem;
    secondary: HeroCoverItem;
    tertiary: HeroCoverItem;
  };
  categories: Record<string, CategoryCoverItem>;
  chapters: ChapterCoverItem[];
  reels: ReelCoverItem[];
  craftStats: SingleCoverItem;
  wholesaleBanner: SingleCoverItem;
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'home-covers.json');
const FIRESTORE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'wastram-a7300';
const FIRESTORE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBB62kPVeyIFKv4llhEnfNGSbVuwG46dvA';

let inMemoryHomeCovers: HomeCoversStore | null = null;
let lastHomeCoversTime = 0;
const CACHE_TTL_MS = 5 * 1000; // 5 seconds

function unwrapFirestoreValue(val: any): any {
  if (!val || typeof val !== 'object') return val;
  if (val.stringValue !== undefined) {
    const s = val.stringValue;
    if (typeof s === 'string' && (s.startsWith('{') || s.startsWith('['))) {
      try { return JSON.parse(s); } catch { return s; }
    }
    return s;
  }
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.integerValue !== undefined) return parseInt(val.integerValue, 10);
  if (val.doubleValue !== undefined) return parseFloat(val.doubleValue);
  if (val.mapValue !== undefined) {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      res[k] = unwrapFirestoreValue(v);
    }
    return res;
  }
  if (val.arrayValue !== undefined) {
    return (val.arrayValue.values || []).map(unwrapFirestoreValue);
  }
  return val;
}

function wrapFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(wrapFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = wrapFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

export async function getHomeCovers(forceRefresh = false): Promise<HomeCoversStore> {
  const now = Date.now();
  if (!forceRefresh && inMemoryHomeCovers && now - lastHomeCoversTime < CACHE_TTL_MS) {
    return inMemoryHomeCovers;
  }

  // 1. Try Firestore Admin SDK (Server environment)
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      const snap = await adminDb.collection('orders').doc('_home_covers_store').get();
      if (snap.exists) {
        const data = snap.data() as HomeCoversStore;
        if (data && data.hero && data.categories) {
          inMemoryHomeCovers = { ...defaultHomeCovers, ...data } as HomeCoversStore;
          lastHomeCoversTime = now;
          return inMemoryHomeCovers;
        }
      }
    }
  } catch (err: any) {
    // silently continue to fallbacks
  }

  // 2. Try Firebase Client SDK
  try {
    const clientDb = getFirebaseDb();
    if (clientDb) {
      const snap = await getDoc(doc(clientDb, 'orders', '_home_covers_store'));
      if (snap.exists()) {
        const data = snap.data() as HomeCoversStore;
        if (data && data.hero && data.categories) {
          inMemoryHomeCovers = { ...defaultHomeCovers, ...data } as HomeCoversStore;
          lastHomeCoversTime = now;
          return inMemoryHomeCovers;
        }
      }
    }
  } catch (err: any) {
    // continue
  }

  // 3. Try Firestore REST API
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/orders/_home_covers_store?key=${FIRESTORE_API_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.fields) {
        const parsed: any = {};
        for (const [k, v] of Object.entries(json.fields)) {
          parsed[k] = unwrapFirestoreValue(v);
        }
        if (parsed.hero && parsed.categories) {
          inMemoryHomeCovers = { ...defaultHomeCovers, ...parsed } as HomeCoversStore;
          lastHomeCoversTime = now;
          return inMemoryHomeCovers;
        }
      }
    }
  } catch (_) {}

  // 4. Try local disk file
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.hero && parsed.categories) {
        inMemoryHomeCovers = { ...defaultHomeCovers, ...parsed } as HomeCoversStore;
        lastHomeCoversTime = now;
        return inMemoryHomeCovers;
      }
    }
  } catch (_) {}

  inMemoryHomeCovers = defaultHomeCovers as unknown as HomeCoversStore;
  lastHomeCoversTime = now;
  return inMemoryHomeCovers;
}

export async function saveHomeCovers(store: HomeCoversStore): Promise<HomeCoversStore> {
  store.updatedAt = new Date().toISOString();
  inMemoryHomeCovers = store;
  lastHomeCoversTime = Date.now();

  // 1. Save to local disk
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (_) {}

  // 2. Synchronize category cover images in data/categories.ts if changed
  try {
    const categoriesTsPath = path.join(process.cwd(), 'data', 'categories.ts');
    if (fs.existsSync(categoriesTsPath) && store.categories) {
      let content = fs.readFileSync(categoriesTsPath, 'utf8');
      let modified = false;
      for (const [catId, catObj] of Object.entries(store.categories)) {
        if (catObj && catObj.image) {
          // Replace image: "..." and heroImage: "..." for this category
          const regImage = new RegExp(`(id:\\s*["']${catId}["'][\\s\\S]*?image:\\s*["'])[^"']+`, 'g');
          const regHero = new RegExp(`(id:\\s*["']${catId}["'][\\s\\S]*?heroImage:\\s*["'])[^"']+`, 'g');
          if (regImage.test(content)) {
            content = content.replace(regImage, `$1${catObj.image}`);
            modified = true;
          }
          if (regHero.test(content)) {
            content = content.replace(regHero, `$1${catObj.image}`);
            modified = true;
          }
        }
      }
      if (modified) {
        fs.writeFileSync(categoriesTsPath, content, 'utf8');
      }
    }
  } catch (_) {}

  // 3. Save to Firestore Admin SDK
  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      await adminDb.collection('orders').doc('_home_covers_store').set(store, { merge: true });
    }
  } catch (err: any) {
    console.warn('[HomeCoversStore] Firestore Admin write notice:', err.message);
  }

  // 4. Save to Firebase Client SDK
  try {
    const clientDb = getFirebaseDb();
    if (clientDb) {
      await setDoc(doc(clientDb, 'orders', '_home_covers_store'), store, { merge: true });
    }
  } catch (_) {}

  // 5. Save to Firestore REST API
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/orders/_home_covers_store?key=${FIRESTORE_API_KEY}`;
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(store)) {
      fields[k] = wrapFirestoreValue(v);
    }
    await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });
  } catch (_) {}

  return store;
}
