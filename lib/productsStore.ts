import { NISHORAMA_PRODUCTS, NishoramaProduct, ColorVariant } from "@/data/nishorama-data";
import { getFirebaseDb } from "@/lib/firebaseClient";
import { getAdminDb } from "@/lib/firebaseAdmin";
import fs from "fs";
import path from "path";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";

export interface ProductOverride {
  id: string;
  title?: string;
  slug?: string;
  category?: string;
  tab?: string;
  badge?: string;
  regularPrice?: number;
  salePrice?: number;
  images?: string[];
  colorVariants?: ColorVariant[];
  sizes?: string[];
  fabric?: string;
  description?: string;
  details?: string[];
  moq?: string;
  sku?: string;
  is_hidden?: boolean;
  is_featured?: boolean;
  isCustomProduct?: boolean;
  deleted?: boolean;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

let inMemoryProductOverrides: Record<string, ProductOverride> = {};
let lastFirestoreFetchTime = 0;
const FIRESTORE_CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

function getOverridesFilePath(): string {
  return path.join(process.cwd(), "data", "product-overrides.json");
}

function loadOverridesFromDisk(): Record<string, ProductOverride> | null {
  try {
    const filePath = getOverridesFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[ProductsStore] Error reading overrides from disk:", err);
  }
  return null;
}

function saveOverridesToDisk(overrides: Record<string, ProductOverride>): void {
  try {
    const filePath = getOverridesFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(overrides, null, 2), "utf-8");
  } catch (err) {
    console.warn("[ProductsStore] Error writing overrides to disk:", err);
  }
}

export async function getProductOverrides(): Promise<Record<string, ProductOverride>> {
  const now = Date.now();
  if (Object.keys(inMemoryProductOverrides).length > 0 && now - lastFirestoreFetchTime < FIRESTORE_CACHE_TTL_MS) {
    return inMemoryProductOverrides;
  }

  // 1. Try disk cache first
  const diskData = loadOverridesFromDisk();
  if (diskData) {
    inMemoryProductOverrides = { ...diskData };
  }

  // 2. Try Firestore Admin SDK (Server environment)
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      // Check master store first: orders/_products_store
      const masterSnap = await adminDb.collection("orders").doc("_products_store").get();
      if (masterSnap.exists) {
        const data = masterSnap.data();
        if (data?.products && typeof data.products === "object") {
          inMemoryProductOverrides = { ...inMemoryProductOverrides, ...data.products };
        }
      }

      // Check product_overrides collection
      const snap = await adminDb.collection("product_overrides").get();
      snap.forEach((docSnap) => {
        const data = docSnap.data() as ProductOverride;
        inMemoryProductOverrides[docSnap.id] = { ...data, id: docSnap.id };
      });

      lastFirestoreFetchTime = now;
      saveOverridesToDisk(inMemoryProductOverrides);
      return inMemoryProductOverrides;
    } catch (err: any) {
      console.warn("[ProductsStore] Firestore Admin read warning:", err.message);
    }
  }

  // 3. Try Firebase Client SDK
  const clientDb = getFirebaseDb();
  if (clientDb) {
    try {
      // Check master store: orders/_products_store
      const masterSnap = await getDoc(doc(clientDb, "orders", "_products_store"));
      if (masterSnap.exists()) {
        const data = masterSnap.data();
        if (data?.products && typeof data.products === "object") {
          inMemoryProductOverrides = { ...inMemoryProductOverrides, ...data.products };
        }
      }

      // Check product_overrides
      const snap = await getDocs(collection(clientDb, "product_overrides"));
      snap.forEach((docSnap) => {
        const data = docSnap.data() as ProductOverride;
        inMemoryProductOverrides[docSnap.id] = { ...data, id: docSnap.id };
      });

      lastFirestoreFetchTime = now;
      saveOverridesToDisk(inMemoryProductOverrides);
      return inMemoryProductOverrides;
    } catch (err: any) {
      console.warn("[ProductsStore] Firebase Client read notice:", err.message);
    }
  }

  return inMemoryProductOverrides;
}

export async function saveProductOverride(
  productId: string,
  override: Partial<ProductOverride>
): Promise<ProductOverride> {
  const now = new Date().toISOString();
  const cleanId = String(productId).trim();

  const existing = inMemoryProductOverrides[cleanId] || {};
  const updated: ProductOverride = {
    ...existing,
    ...override,
    id: cleanId,
    updated_at: now,
    updatedAt: now,
  };

  inMemoryProductOverrides[cleanId] = updated;
  saveOverridesToDisk(inMemoryProductOverrides);

  // Sync to Firestore Admin if configured
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.collection("products").doc(cleanId).set(updated, { merge: true });
      await adminDb.collection("product_overrides").doc(cleanId).set(updated, { merge: true });
      await adminDb.collection("orders").doc("_products_store").set(
        {
          products: inMemoryProductOverrides,
          updated_at: now,
        },
        { merge: true }
      );
    } catch (err: any) {
      console.warn("[ProductsStore] Firestore Admin write warning:", err.message);
    }
  } else {
    // Sync to Firestore Client
    const clientDb = getFirebaseDb();
    if (clientDb) {
      try {
        await setDoc(doc(clientDb, "products", cleanId), updated, { merge: true });
        await setDoc(doc(clientDb, "product_overrides", cleanId), updated, { merge: true });
        await setDoc(doc(clientDb, "orders", "_products_store"), {
          products: inMemoryProductOverrides,
          updated_at: now,
        }, { merge: true });
      } catch (err: any) {
        console.warn("[ProductsStore] Firestore Client write warning:", err.message);
      }
    }
  }

  return updated;
}

export async function deleteProductOverride(productId: string): Promise<boolean> {
  const cleanId = String(productId).trim();
  const now = new Date().toISOString();

  // Tombstone product override (soft delete: preserves history while hiding from store)
  const tombstone: ProductOverride = {
    ...(inMemoryProductOverrides[cleanId] || {}),
    id: cleanId,
    deleted: true,
    is_hidden: true,
    updated_at: now,
    updatedAt: now,
  };

  inMemoryProductOverrides[cleanId] = tombstone;
  saveOverridesToDisk(inMemoryProductOverrides);

  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.collection("products").doc(cleanId).set(tombstone, { merge: true });
      await adminDb.collection("product_overrides").doc(cleanId).set(tombstone, { merge: true });
      await adminDb.collection("orders").doc("_products_store").set(
        {
          products: inMemoryProductOverrides,
          updated_at: now,
        },
        { merge: true }
      );
    } catch (err: any) {
      console.warn("[ProductsStore] Firestore Admin tombstone write warning:", err.message);
    }
  }

  const clientDb = getFirebaseDb();
  if (clientDb) {
    try {
      await setDoc(doc(clientDb, "products", cleanId), tombstone, { merge: true });
      await setDoc(doc(clientDb, "product_overrides", cleanId), tombstone, { merge: true });
      await setDoc(doc(clientDb, "orders", "_products_store"), {
        products: inMemoryProductOverrides,
        updated_at: now,
      }, { merge: true });
    } catch (err: any) {
      console.warn("[ProductsStore] Firestore Client tombstone write warning:", err.message);
    }
  }

  return true;
}

export function applyOverrideToProduct(base: NishoramaProduct, override?: ProductOverride): NishoramaProduct {
  if (!override) return base;

  return {
    ...base,
    title: override.title !== undefined ? override.title : base.title,
    slug: override.slug !== undefined ? override.slug : base.slug,
    category: override.category !== undefined ? override.category : base.category,
    tab: override.tab !== undefined ? override.tab : base.tab,
    badge: override.badge !== undefined ? override.badge : base.badge,
    regularPrice: override.regularPrice !== undefined ? override.regularPrice : base.regularPrice,
    salePrice: override.salePrice !== undefined ? override.salePrice : base.salePrice,
    images: Array.isArray(override.images) && override.images.length > 0 ? override.images : base.images,
    colorVariants: Array.isArray(override.colorVariants) ? override.colorVariants : base.colorVariants,
    sizes: Array.isArray(override.sizes) && override.sizes.length > 0 ? override.sizes : base.sizes,
    fabric: override.fabric !== undefined ? override.fabric : base.fabric,
    description: override.description !== undefined ? override.description : base.description,
    details: Array.isArray(override.details) ? override.details : base.details,
    moq: override.moq !== undefined ? override.moq : base.moq,
    sku: override.sku !== undefined ? override.sku : base.sku,
  };
}

export async function getAllMergedProducts(): Promise<NishoramaProduct[]> {
  const overrides = await getProductOverrides();
  const activeProducts: NishoramaProduct[] = [];
  const handledIds = new Set<string>();

  // 1. Process base catalog with overrides
  for (const p of NISHORAMA_PRODUCTS) {
    handledIds.add(p.id);
    const ovr = overrides[p.id];
    if (ovr?.deleted) continue; // Deleted in admin
    if (ovr?.is_hidden) continue; // Hidden in admin

    activeProducts.push(applyOverrideToProduct(p, ovr));
  }

  // 2. Process custom products added via Admin
  for (const [id, ovr] of Object.entries(overrides)) {
    if (!handledIds.has(id) && ovr.isCustomProduct && !ovr.deleted && !ovr.is_hidden) {
      activeProducts.push({
        id,
        title: ovr.title || "Custom Atelier Ensemble",
        slug: ovr.slug || id,
        category: ovr.category || "western-dresses",
        tab: ovr.tab || ovr.category || "western-dresses",
        badge: ovr.badge || "Signature Collection",
        regularPrice: ovr.regularPrice || 0,
        salePrice: ovr.salePrice || 0,
        images: ovr.images || [],
        colorVariants: ovr.colorVariants || [],
        sizes: ovr.sizes || ["XS", "S", "M", "L", "XL", "XXL"],
        fabric: ovr.fabric || "Pure Handloom Silk & Cotton",
        description: ovr.description || "",
        details: ovr.details || [],
        moq: ovr.moq || "20 pcs / Flexible Wholesale Pack",
        sku: ovr.sku || `WST-CUSTOM-${id.substring(0, 6)}`,
        createdAt: ovr.createdAt || new Date().toISOString(),
        updatedAt: ovr.updatedAt || new Date().toISOString(),
      });
    }
  }

  return activeProducts;
}
