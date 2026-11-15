import { PRODUCTS, Product, ColorVariant } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
export type NishoramaProduct = Product;
import { getFirebaseDb } from "@/lib/firebaseClient";
import { getAdminDb } from "@/lib/firebaseAdmin";
import * as fs from "fs";
import * as path from "path";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export interface ProductOverride {
  id: string;
  name?: string;
  title?: string;
  slug?: string;
  originalSlug?: string;
  category?: string;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  tab?: string;
  badge?: string;
  tag?: string;
  price?: number;
  regularPrice?: number;
  salePrice?: number;
  stock?: number;
  stockQty?: number;
  inStock?: boolean;
  images?: string[];
  gallery?: string[];
  featured_image?: string;
  mainImage?: string;
  colorVariants?: ColorVariant[];
  sizes?: string[];
  fabric?: string;
  description?: string;
  short_desc?: string;
  shortDescription?: string;
  long_desc?: string;
  descriptionHtml?: string;
  details?: string[];
  moq?: string;
  sku?: string;
  partNumber?: string;
  brand?: string;
  is_hidden?: boolean;
  is_featured?: boolean;
  isCustomProduct?: boolean;
  deleted?: boolean;
  purged?: boolean;
  technical_specs?: Record<string, any>;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

let inMemoryProductOverrides: Record<string, ProductOverride> = {};
let inMemoryMergedLiveProducts: Product[] | null = null;
let lastOverridesLoadedTime = 0;
let lastMergedLiveProductsTime = 0;
let serverProductsCacheVersion = 1;

const OVERRIDES_CACHE_TTL_MS = 60 * 1000; // 60 seconds
const MERGED_PRODUCTS_CACHE_TTL_MS = 60 * 1000;

const FIRESTORE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "wastram-a7300";
const FIRESTORE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBB62kPVeyIFKv4llhEnfNGSbVuwG46dvA";

export function getServerProductsCacheVersion(): number {
  return serverProductsCacheVersion;
}

export function bumpServerProductsCacheVersion(): void {
  serverProductsCacheVersion++;
  inMemoryMergedLiveProducts = null;
  lastMergedLiveProductsTime = 0;
}

export function invalidateLiveProductsCache(): void {
  inMemoryMergedLiveProducts = null;
  lastMergedLiveProductsTime = 0;
}

export function cleanTechnicalSpecs(specs: any): Record<string, string> | null {
  if (!specs || typeof specs !== "object") return null;
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(specs)) {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      cleaned[k] = String(v).trim();
    }
  }
  return Object.keys(cleaned).length > 0 ? cleaned : null;
}

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

async function fetchOverridesFromFirestoreRest(): Promise<Record<string, ProductOverride>> {
  const result: Record<string, ProductOverride> = {};
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/product_overrides?key=${FIRESTORE_API_KEY}`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.documents)) {
        for (const docItem of data.documents) {
          const docId = docItem.name ? docItem.name.split("/").pop() : "";
          if (!docId) continue;
          const fields = docItem.fields || {};
          const parsed: Record<string, any> = { id: docId };
          for (const [k, v] of Object.entries<any>(fields)) {
            if (v.stringValue !== undefined) {
              try { parsed[k] = JSON.parse(v.stringValue); } catch { parsed[k] = v.stringValue; }
            } else if (v.booleanValue !== undefined) {
              parsed[k] = v.booleanValue;
            } else if (v.doubleValue !== undefined || v.integerValue !== undefined) {
              parsed[k] = Number(v.doubleValue ?? v.integerValue);
            } else if (v.arrayValue?.values) {
              parsed[k] = v.arrayValue.values.map((item: any) => item.stringValue || item);
            }
          }
          result[docId] = parsed as ProductOverride;
          const base = PRODUCTS.find((p) => p.id?.toLowerCase() === docId.toLowerCase() || p.slug?.toLowerCase() === docId.toLowerCase());
          if (base?.slug) {
            result[base.slug] = { ...parsed, id: base.id, slug: base.slug } as ProductOverride;
          }
          if (base?.id) {
            result[base.id] = { ...parsed, id: base.id, slug: base.slug } as ProductOverride;
          }
        }
      }
    }
  } catch (err: any) {
    console.warn("[ProductsStore] Firestore REST fetch notice:", err.message);
  }
  return result;
}

async function syncDocToFirestoreRest(collectionName: string, docId: string, data: any): Promise<void> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/${collectionName}/${encodeURIComponent(docId)}?key=${FIRESTORE_API_KEY}`;
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v === undefined) continue;
      if (typeof v === "string") fields[k] = { stringValue: v };
      else if (typeof v === "boolean") fields[k] = { booleanValue: v };
      else if (typeof v === "number") fields[k] = { doubleValue: v };
      else if (Array.isArray(v)) {
        fields[k] = { arrayValue: { values: v.map((item) => (typeof item === "string" ? { stringValue: item } : { stringValue: JSON.stringify(item) })) } };
      } else if (v && typeof v === "object") {
        fields[k] = { stringValue: JSON.stringify(v) };
      }
    }
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
  } catch (err: any) {
    console.warn(`[ProductsStore] REST sync to ${collectionName}/${docId} notice:`, err.message);
  }
}

export async function getProductOverrides(forceRefresh = false): Promise<Record<string, ProductOverride>> {
  const now = Date.now();
  if (
    !forceRefresh &&
    Object.keys(inMemoryProductOverrides).length > 0 &&
    now - lastOverridesLoadedTime < OVERRIDES_CACHE_TTL_MS
  ) {
    return { ...inMemoryProductOverrides };
  }

  // 1. Try disk cache
  const diskData = loadOverridesFromDisk();
  if (diskData) {
    inMemoryProductOverrides = { ...diskData };
  }

  // 2. Try Firestore Admin SDK (Server environment)
  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      const masterSnap = await adminDb.collection("orders").doc("_products_store").get();
      if (masterSnap.exists) {
        const data = masterSnap.data();
        if (data?.products && typeof data.products === "object") {
          inMemoryProductOverrides = { ...inMemoryProductOverrides, ...data.products };
        }
      }

      const snap = await adminDb.collection("product_overrides").get();
      snap.forEach((docSnap) => {
        const data = docSnap.data() as ProductOverride;
        inMemoryProductOverrides[docSnap.id] = { ...data, id: docSnap.id };
      });

      lastOverridesLoadedTime = now;
      saveOverridesToDisk(inMemoryProductOverrides);
      return { ...inMemoryProductOverrides };
    } catch (err: any) {
      console.warn("[ProductsStore] Firestore Admin read notice:", err.message);
    }
  }

  // 3. Try Firebase Client SDK
  const clientDb = getFirebaseDb();
  if (clientDb) {
    try {
      const masterSnap = await getDoc(doc(clientDb, "orders", "_products_store"));
      if (masterSnap.exists()) {
        const data = masterSnap.data();
        if (data?.products && typeof data.products === "object") {
          inMemoryProductOverrides = { ...inMemoryProductOverrides, ...data.products };
        }
      }

      const snap = await getDocs(collection(clientDb, "product_overrides"));
      snap.forEach((docSnap) => {
        const data = docSnap.data() as ProductOverride;
        inMemoryProductOverrides[docSnap.id] = { ...data, id: docSnap.id };
      });

      lastOverridesLoadedTime = now;
      saveOverridesToDisk(inMemoryProductOverrides);
      return { ...inMemoryProductOverrides };
    } catch (err: any) {
      console.warn("[ProductsStore] Firebase Client read notice:", err.message);
    }
  }

  // 4. Fallback to Firestore REST API
  try {
    const restData = await fetchOverridesFromFirestoreRest();
    if (Object.keys(restData).length > 0) {
      inMemoryProductOverrides = { ...inMemoryProductOverrides, ...restData };
      lastOverridesLoadedTime = now;
      saveOverridesToDisk(inMemoryProductOverrides);
    }
  } catch (_) {}

  return { ...inMemoryProductOverrides };
}

export async function saveProductOverride(
  id: string,
  data: Partial<ProductOverride>
): Promise<ProductOverride> {
  await getProductOverrides();
  const cleanId = String(id).trim().toLowerCase();
  const existing: Partial<ProductOverride> =
    inMemoryProductOverrides[id] ||
    Object.values(inMemoryProductOverrides).find(
      (o) => (o.slug && o.slug.toLowerCase() === cleanId) || (o.id && o.id.toLowerCase() === cleanId)
    ) ||
    {};

  const rawSlug = data.slug || existing.slug;
  const cleanSlug = rawSlug
    ? rawSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : undefined;

  let resolvedCategoryFields: Record<string, any> = {};
  if (data.category_id !== undefined || data.category !== undefined) {
    const rawCat = data.category_id !== undefined ? data.category_id : data.category;
    const strRaw = String(rawCat ?? "").trim();
    if (!strRaw || strRaw === "none" || strRaw === "unassigned") {
      resolvedCategoryFields = {
        category_id: "",
        category_slug: "",
        category_name: "",
        category: "",
      };
    } else {
      const catMeta = CATEGORIES.find(
        (c) => c.id.toLowerCase() === strRaw.toLowerCase() || c.slug.toLowerCase() === strRaw.toLowerCase()
      );
      const catId = catMeta ? catMeta.id : strRaw;
      const catName = catMeta ? catMeta.name : (data.category_name || data.category || catId);
      resolvedCategoryFields = {
        category_id: catId,
        category_slug: catId,
        category_name: catName,
        category: catName,
      };
    }
  }

  const rawSpecs = data.technical_specs !== undefined ? data.technical_specs : existing.technical_specs;
  const cleanedSpecs = cleanTechnicalSpecs(rawSpecs);

  const override: ProductOverride = {
    ...existing,
    ...data,
    technical_specs: cleanedSpecs || undefined,
    ...resolvedCategoryFields,
    id,
    ...(cleanSlug ? { slug: cleanSlug } : {}),
    updated_at: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryProductOverrides[id] = override;

  // Prune any duplicate slug-keyed entries so only canonical IDs remain
  if (override.slug && override.slug !== id && inMemoryProductOverrides[override.slug]) {
    delete inMemoryProductOverrides[override.slug];
  }
  if (cleanSlug && cleanSlug !== id && inMemoryProductOverrides[cleanSlug]) {
    delete inMemoryProductOverrides[cleanSlug];
  }
  if (existing.slug && existing.slug !== id && inMemoryProductOverrides[existing.slug]) {
    delete inMemoryProductOverrides[existing.slug];
  }

  lastOverridesLoadedTime = 0;
  invalidateLiveProductsCache();
  bumpServerProductsCacheVersion();
  saveOverridesToDisk(inMemoryProductOverrides);

  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.collection("orders").doc("_products_store").set(
        {
          products: inMemoryProductOverrides,
          updated_at: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (_) {}

    try {
      await adminDb.collection("product_overrides").doc(id).set(override, { merge: true });
    } catch (_) {}
  } else {
    const clientDb = getFirebaseDb();
    if (clientDb) {
      try {
        await setDoc(doc(clientDb, "orders", "_products_store"), {
          products: inMemoryProductOverrides,
          updated_at: new Date().toISOString(),
        }, { merge: true });
      } catch (_) {}
      try {
        await setDoc(doc(clientDb, "product_overrides", id), override, { merge: true });
      } catch (_) {}
    }
  }

  await syncDocToFirestoreRest("product_overrides", id, override);
  await syncDocToFirestoreRest("products", id, override);

  return override;
}

export async function deleteProductOverride(idOrSlug: string): Promise<void> {
  const cleanId = String(idOrSlug).trim().toLowerCase();
  await getProductOverrides(true);

  const matchingKeys: string[] = [];
  let foundOverride: ProductOverride | null = null;

  for (const [key, ov] of Object.entries(inMemoryProductOverrides)) {
    const keyLower = key.toLowerCase().trim();
    const ovId = (ov.id || "").toLowerCase().trim();
    const ovSlug = (ov.slug || "").toLowerCase().trim();
    const ovPart = (ov.partNumber || ov.sku || "").toLowerCase().trim();

    if (
      keyLower === cleanId ||
      ovId === cleanId ||
      ovSlug === cleanId ||
      ovPart === cleanId
    ) {
      matchingKeys.push(key);
      if (!foundOverride) foundOverride = ov;
    }
  }

  const baseProd = PRODUCTS.find((p) => {
    const pId = p.id.toLowerCase().trim();
    const pSlug = p.slug.toLowerCase().trim();
    const pPart = (p.partNumber || (p as any).sku || "").toLowerCase().trim();
    return (
      pId === cleanId ||
      pSlug === cleanId ||
      pPart === cleanId ||
      p.aliasSlugs?.some((a) => a.toLowerCase().trim() === cleanId) ||
      (foundOverride &&
        (pId === (foundOverride.id || "").toLowerCase().trim() ||
          pSlug === (foundOverride.slug || "").toLowerCase().trim()))
    );
  });

  const targetId = foundOverride?.id || baseProd?.id || cleanId;
  const targetSlug = foundOverride?.slug || baseProd?.slug || cleanId;
  const isBase = Boolean(baseProd);

  if (isBase && baseProd) {
    const tombstone: ProductOverride = {
      ...(foundOverride || {}),
      id: targetId,
      slug: targetSlug,
      name: foundOverride?.name || foundOverride?.title || baseProd.name || (baseProd as any).title,
      partNumber: foundOverride?.partNumber || baseProd.partNumber || (baseProd as any).sku,
      is_hidden: true,
      deleted: true,
      purged: true,
      updated_at: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryProductOverrides[targetId] = tombstone;
    if (targetSlug) inMemoryProductOverrides[targetSlug] = tombstone;
    matchingKeys.forEach((k) => {
      inMemoryProductOverrides[k] = tombstone;
    });

    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        await adminDb.collection("orders").doc("_products_store").set(
          { products: inMemoryProductOverrides, updated_at: new Date().toISOString() },
          { merge: true }
        );
      } catch (_) {}
      try {
        await adminDb.collection("product_overrides").doc(targetId).set(tombstone, { merge: true });
        if (targetSlug && targetSlug !== targetId) {
          await adminDb.collection("product_overrides").doc(targetSlug).set(tombstone, { merge: true });
        }
      } catch (_) {}
    } else {
      const db = getFirebaseDb();
      if (db) {
        try {
          await setDoc(doc(db, "orders", "_products_store"), {
            products: inMemoryProductOverrides,
            updated_at: new Date().toISOString(),
          }, { merge: true });
        } catch (_) {}
        try {
          await setDoc(doc(db, "product_overrides", targetId), tombstone, { merge: true });
          if (targetSlug && targetSlug !== targetId) {
            await setDoc(doc(db, "product_overrides", targetSlug), tombstone, { merge: true });
          }
        } catch (_) {}
      }
    }
    await syncDocToFirestoreRest("product_overrides", targetId, tombstone);
    if (targetSlug && targetSlug !== targetId) {
      await syncDocToFirestoreRest("product_overrides", targetSlug, tombstone);
    }
  } else {
    matchingKeys.forEach((k) => {
      delete inMemoryProductOverrides[k];
    });
    delete inMemoryProductOverrides[cleanId];
    delete inMemoryProductOverrides[targetId];
    if (targetSlug) delete inMemoryProductOverrides[targetSlug];

    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        await adminDb.collection("product_overrides").doc(targetId).delete();
      } catch (_) {}
      if (targetSlug && targetSlug !== targetId) {
        try {
          await adminDb.collection("product_overrides").doc(targetSlug).delete().catch(() => {});
        } catch (_) {}
      }
      try {
        await adminDb.collection("orders").doc("_products_store").set(
          { products: inMemoryProductOverrides, updated_at: new Date().toISOString() },
          { merge: false }
        );
      } catch (_) {}
    } else {
      const db = getFirebaseDb();
      if (db) {
        try {
          await deleteDoc(doc(db, "product_overrides", targetId));
        } catch (_) {}
        if (targetSlug && targetSlug !== targetId) {
          try {
            await deleteDoc(doc(db, "product_overrides", targetSlug)).catch(() => {});
          } catch (_) {}
        }
        try {
          await setDoc(doc(db, "orders", "_products_store"), {
            products: inMemoryProductOverrides,
            updated_at: new Date().toISOString(),
          }, { merge: false });
        } catch (_) {}
      }
    }
  }

  lastOverridesLoadedTime = 0;
  invalidateLiveProductsCache();
  bumpServerProductsCacheVersion();
  saveOverridesToDisk(inMemoryProductOverrides);
}

export function applyOverrideToProduct(
  p: Product,
  override?: ProductOverride
): Product & { is_hidden?: boolean; is_featured?: boolean } {
  if (!override) return p;

  const price = override.salePrice !== undefined ? override.salePrice : (override.price !== undefined ? override.price : (override.regularPrice !== undefined ? override.regularPrice : p.price));
  const regularPrice = override.regularPrice !== undefined ? override.regularPrice : (p.regularPrice ?? price);
  const salePrice = override.salePrice !== undefined ? override.salePrice : (p.salePrice ?? price);
  const stockQty = override.stock !== undefined ? override.stock : (override.stockQty !== undefined ? override.stockQty : (p.stockQty ?? 25));
  const inStock = override.inStock !== undefined ? override.inStock : (override.stock !== undefined ? override.stock > 0 : p.inStock);
  const name = override.name || override.title || p.name || (p as any).title || "Atelier Dress";
  const title = override.title || override.name || (p as any).title || p.name || "Atelier Dress";

  let cleanSlug = p.slug;
  if (override.slug && override.slug.trim()) {
    cleanSlug = override.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  const is_hidden = override.is_hidden !== undefined ? override.is_hidden : (override.deleted || override.purged ? true : false);
  const is_featured = override.is_featured !== undefined ? override.is_featured : (p.isHomeSpecial || false);
  const tag = override.tag !== undefined ? override.tag : (override.badge || p.tag || (p as any).badge);
  const badge = override.badge !== undefined ? override.badge : (override.tag || (p as any).badge || p.tag);
  const shortDescription = override.short_desc || override.shortDescription || p.shortDescription || (p as any).short_desc || override.description || p.description;

  // Resolve custom gallery and featured image seamlessly
  const hasCustomFeatured = override.featured_image !== undefined && override.featured_image !== null && String(override.featured_image).trim() !== "";
  const customGalleryArray = Array.isArray(override.gallery) && override.gallery.length > 0
    ? override.gallery
    : (Array.isArray(override.images) && override.images.length > 0 ? override.images : null);
  const hasCustomGallery = customGalleryArray !== null;

  let resolvedMainImage = p.mainImage || (p.images && p.images[0]) || "";
  let resolvedGalleryUrls: string[] = Array.isArray(p.images) && p.images.length > 0
    ? [...p.images]
    : ((p.galleryImages || []).map((img) => img.url));

  if (hasCustomFeatured || hasCustomGallery) {
    if (hasCustomFeatured && hasCustomGallery) {
      resolvedMainImage = override.featured_image!;
      resolvedGalleryUrls = customGalleryArray!;
      if (resolvedMainImage && !resolvedGalleryUrls.includes(resolvedMainImage)) {
        resolvedGalleryUrls = [resolvedMainImage, ...resolvedGalleryUrls];
      }
    } else if (hasCustomFeatured) {
      resolvedMainImage = override.featured_image!;
      resolvedGalleryUrls = [override.featured_image!];
    } else if (hasCustomGallery) {
      resolvedGalleryUrls = customGalleryArray!;
      resolvedMainImage = resolvedGalleryUrls[0] || "";
    }
  }

  const mainImage = resolvedMainImage || p.mainImage || (resolvedGalleryUrls.length > 0 ? resolvedGalleryUrls[0] : "");
  const galleryImages = resolvedGalleryUrls.length > 0
    ? resolvedGalleryUrls.map((url) => ({ url, caption: name }))
    : [{ url: mainImage, caption: name }];

  const aliasSlugs = [
    ...(p.aliasSlugs || []),
    p.slug,
    p.partNumber,
    (p as any).sku,
    p.id,
    ...(override.slug ? [override.slug, cleanSlug] : []),
  ].filter(Boolean) as string[];

  // Category normalization
  const resolvedCategory = (() => {
    if (override.category_id !== undefined || override.category !== undefined) {
      const val = String(override.category_id || override.category || "").trim();
      if (!val || val === "none" || val === "unassigned") return "";
      const catMeta = CATEGORIES.find((c) => c.id.toLowerCase() === val.toLowerCase() || c.slug.toLowerCase() === val.toLowerCase());
      return catMeta ? catMeta.name : (override.category_name || val);
    }
    const rawCat = (p as any).category_id || p.category;
    const str = String(rawCat || "").trim();
    if (!str || str === "none" || str === "unassigned") return "";
    const catMeta = CATEGORIES.find(
      (c) => c.id.toLowerCase() === str.toLowerCase() || c.slug.toLowerCase() === str.toLowerCase()
    );
    return catMeta ? catMeta.name : (typeof p.category === "string" ? p.category : str);
  })();

  const resolvedCategoryId = (() => {
    if (override.category_id !== undefined || override.category !== undefined) {
      const val = String(override.category_id || override.category || "").trim();
      if (!val || val === "none" || val === "unassigned") return "";
      const catMeta = CATEGORIES.find((c) => c.id.toLowerCase() === val.toLowerCase() || c.slug.toLowerCase() === val.toLowerCase());
      return catMeta ? catMeta.id : val;
    }
    const rawCat = (p as any).category_id || p.category;
    const str = String(rawCat || "").trim();
    if (!str || str === "none" || str === "unassigned") return "";
    const catMeta = CATEGORIES.find(
      (c) => c.id.toLowerCase() === str.toLowerCase() || c.slug.toLowerCase() === str.toLowerCase()
    );
    return catMeta ? catMeta.id : str;
  })();

  return {
    ...p,
    id: p.id,
    name,
    title,
    slug: cleanSlug,
    aliasSlugs,
    price,
    regularPrice,
    salePrice,
    inStock,
    stockQty,
    isHomeSpecial: is_featured,
    is_featured,
    is_hidden,
    tag,
    badge,
    shortDescription,
    short_desc: shortDescription,
    description: override.description || p.description || shortDescription,
    mainImage,
    featured_image: mainImage,
    images: resolvedGalleryUrls,
    gallery: resolvedGalleryUrls,
    galleryImages,
    brand: override.brand || p.brand || "Wastram Atelier",
    partNumber: override.partNumber || override.sku || p.partNumber || (p as any).sku,
    sku: override.sku || override.partNumber || (p as any).sku || p.partNumber,
    category: resolvedCategory,
    category_id: resolvedCategoryId,
    category_name: resolvedCategory,
    category_slug: resolvedCategoryId,
    colorVariants: Array.isArray(override.colorVariants) ? override.colorVariants : p.colorVariants,
    sizes: Array.isArray(override.sizes) && override.sizes.length > 0 ? override.sizes : p.sizes,
    fabric: override.fabric !== undefined ? override.fabric : p.fabric,
    details: Array.isArray(override.details) ? override.details : p.details,
    moq: override.moq !== undefined ? override.moq : p.moq,
    deleted: override.deleted || override.purged || false,
    purged: override.purged || override.deleted || false,
  } as any;
}

export async function getLiveProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;
  const rawClean = decodeURIComponent(slug).replace(/\.html$/, "").trim().toLowerCase();
  const clean = rawClean;
  const dashedClean = rawClean.replace(/\s+/g, "-");
  const normalizedClean = rawClean.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const overrides = await getProductOverrides();

  // 1. Look for matching override first (handles products with customized slugs, IDs, or SKUs)
  const overrideValues = Object.values(overrides);
  let matchingOverride = overrideValues.find((o) => {
    const oSlug = (o.slug || "").toLowerCase().trim();
    const oDashed = oSlug.replace(/\s+/g, "-");
    const oNorm = oSlug.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const oId = (o.id || "").toLowerCase().trim();
    const oPart = (o.partNumber || o.sku || "").toLowerCase().trim();

    return (
      oSlug === clean ||
      oDashed === clean ||
      oSlug === dashedClean ||
      oDashed === dashedClean ||
      oNorm === normalizedClean ||
      oId === clean ||
      oPart === clean
    );
  });

  if (!matchingOverride) {
    matchingOverride = overrideValues.find((o) => {
      const oOrig = (o.originalSlug || "").toLowerCase().trim();
      return (
        oOrig === clean ||
        oOrig.replace(/\s+/g, "-") === dashedClean ||
        (oOrig && oOrig.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === normalizedClean)
      );
    });
  }

  // If permanently deleted, return null immediately (instant 404, no clues remain)
  if (matchingOverride?.deleted || matchingOverride?.purged) {
    return null;
  }

  if (matchingOverride) {
    const baseProd = PRODUCTS.find(
      (p) =>
        p.id.toLowerCase() === matchingOverride!.id.toLowerCase() ||
        p.slug.toLowerCase() === (matchingOverride!.slug || "").toLowerCase() ||
        (matchingOverride!.partNumber && (p.partNumber || (p as any).sku || "").toLowerCase() === matchingOverride!.partNumber.toLowerCase()) ||
        p.aliasSlugs?.some((a) => a.toLowerCase() === matchingOverride!.id.toLowerCase())
    );

    if (baseProd) {
      return applyOverrideToProduct(baseProd, matchingOverride);
    }

    // Custom product added via admin
    const cleanCustomSlug = (matchingOverride.slug || matchingOverride.id).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const rawCat = matchingOverride.category_id !== undefined ? matchingOverride.category_id : matchingOverride.category;
    const strRaw = String(rawCat ?? "").trim();
    let targetCatId = "";
    let targetCatName = "";
    if (strRaw && strRaw !== "none" && strRaw !== "unassigned") {
      const catMeta = CATEGORIES.find(
        (c) => c.id.toLowerCase() === strRaw.toLowerCase() || c.slug.toLowerCase() === strRaw.toLowerCase()
      );
      targetCatId = catMeta ? catMeta.id : strRaw;
      targetCatName = catMeta ? catMeta.name : (matchingOverride.category_name || targetCatId);
    }

    const customGalleryUrls = Array.isArray(matchingOverride.gallery) && matchingOverride.gallery.length > 0
      ? matchingOverride.gallery
      : (Array.isArray(matchingOverride.images) && matchingOverride.images.length > 0 ? matchingOverride.images : []);

    const customMainImg = matchingOverride.featured_image || (customGalleryUrls.length > 0 ? customGalleryUrls[0] : "");

    return {
      id: matchingOverride.id,
      partNumber: matchingOverride.partNumber || matchingOverride.sku || matchingOverride.id,
      sku: matchingOverride.sku || matchingOverride.partNumber || matchingOverride.id,
      name: matchingOverride.name || matchingOverride.title || "Custom Atelier Ensemble",
      title: matchingOverride.title || matchingOverride.name || "Custom Atelier Ensemble",
      slug: cleanCustomSlug || matchingOverride.id,
      price: matchingOverride.salePrice || matchingOverride.price || matchingOverride.regularPrice || 0,
      regularPrice: matchingOverride.regularPrice || matchingOverride.price || 0,
      salePrice: matchingOverride.salePrice || matchingOverride.price || 0,
      inStock: matchingOverride.inStock ?? true,
      stockQty: matchingOverride.stock ?? 25,
      rating: 5,
      reviewCount: 0,
      freeShipping: true,
      brand: matchingOverride.brand || "Wastram Atelier",
      category: targetCatName,
      category_id: targetCatId,
      category_name: targetCatName,
      category_slug: targetCatId,
      mainImage: customMainImg,
      featured_image: customMainImg,
      images: customGalleryUrls,
      gallery: customGalleryUrls,
      galleryImages: customGalleryUrls.map((url) => ({ url, caption: matchingOverride!.name || "" })),
      shortDescription: matchingOverride.short_desc || matchingOverride.shortDescription || matchingOverride.description || "",
      short_desc: matchingOverride.short_desc || matchingOverride.shortDescription || matchingOverride.description || "",
      description: matchingOverride.description || matchingOverride.short_desc || "",
      isHomeSpecial: matchingOverride.is_featured || false,
      is_featured: matchingOverride.is_featured || false,
      tag: matchingOverride.tag || matchingOverride.badge,
      badge: matchingOverride.badge || matchingOverride.tag,
      colorVariants: matchingOverride.colorVariants || [],
      sizes: matchingOverride.sizes || ["XS", "S", "M", "L", "XL", "XXL"],
      fabric: matchingOverride.fabric || "Pure Handloom Silk & Cotton",
      details: matchingOverride.details || [],
      moq: matchingOverride.moq || "20 pcs / Flexible Wholesale Pack",
    } as any;
  }

  // 2. Check static PRODUCTS
  const staticProduct = PRODUCTS.find((p) => {
    const pSlug = p.slug.toLowerCase().trim();
    const pDashed = pSlug.replace(/\s+/g, "-");
    const pNorm = pSlug.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const pId = p.id.toLowerCase().trim();
    const pPart = (p.partNumber || (p as any).sku || "").toLowerCase().trim();

    return (
      pSlug === clean ||
      pDashed === dashedClean ||
      pNorm === normalizedClean ||
      pPart === clean ||
      pId === clean ||
      p.aliasSlugs?.some((a) => {
        const aLower = a.toLowerCase().trim();
        return (
          aLower === clean ||
          aLower === dashedClean ||
          aLower.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === normalizedClean
        );
      })
    );
  });

  if (staticProduct) {
    const ov =
      overrides[staticProduct.id] ||
      overrides[staticProduct.slug] ||
      Object.values(overrides).find(
        (o) =>
          (o.slug && o.slug.toLowerCase().trim() === staticProduct.slug.toLowerCase().trim()) ||
          (o.id && o.id.toLowerCase().trim() === staticProduct.id.toLowerCase().trim()) ||
          (o.partNumber && o.partNumber.toLowerCase().trim() === (staticProduct.partNumber || "").toLowerCase().trim())
      );

    if (ov?.deleted || ov?.purged) {
      return null;
    }

    return applyOverrideToProduct(staticProduct, ov);
  }

  return null;
}

export async function getAllMergedProducts(options?: {
  includeHidden?: boolean;
  forceRefresh?: boolean;
}): Promise<Product[]> {
  const now = Date.now();
  if (
    !options?.forceRefresh &&
    inMemoryMergedLiveProducts &&
    now - lastMergedLiveProductsTime < MERGED_PRODUCTS_CACHE_TTL_MS
  ) {
    let cached = inMemoryMergedLiveProducts.filter((p) => !(p as any).deleted && !(p as any).purged);
    if (!options?.includeHidden) {
      cached = cached.filter((p) => !(p as any).is_hidden);
    }
    return cached;
  }

  const overrides = await getProductOverrides(options?.forceRefresh);

  const overridesBySlug = new Map<string, ProductOverride>();
  const overridesByPart = new Map<string, ProductOverride>();
  for (const [id, ov] of Object.entries(overrides)) {
    if (ov.slug) overridesBySlug.set(ov.slug.toLowerCase().trim(), ov);
    if (ov.partNumber) overridesByPart.set(ov.partNumber.toLowerCase().trim(), ov);
    if (ov.sku) overridesByPart.set(ov.sku.toLowerCase().trim(), ov);
  }

  let list: Product[] = PRODUCTS.filter((p) => {
    const pSlugLower = p.slug.toLowerCase().trim();
    const pPartLower = (p.partNumber || (p as any).sku || "").toLowerCase().trim();
    const ov =
      overrides[p.id] ||
      overrides[p.slug] ||
      overridesBySlug.get(pSlugLower) ||
      overridesByPart.get(pPartLower);
    return !ov?.deleted && !ov?.purged;
  }).map((p) => {
    const pSlugLower = p.slug.toLowerCase().trim();
    const pPartLower = (p.partNumber || (p as any).sku || "").toLowerCase().trim();
    const ov =
      overrides[p.id] ||
      overrides[p.slug] ||
      overridesBySlug.get(pSlugLower) ||
      overridesByPart.get(pPartLower);
    return applyOverrideToProduct(p, ov);
  });

  // Include custom products added in admin
  for (const [id, ov] of Object.entries(overrides)) {
    if (ov.deleted || ov.purged) continue;
    if (ov.isCustomProduct && !list.some((p) => p.id === id || p.slug === ov.slug)) {
      const cleanCustomSlug = (ov.slug || ov.id).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const rawCat = ov.category_id !== undefined ? ov.category_id : ov.category;
      const strRaw = String(rawCat ?? "").trim();
      let targetCatId = "";
      let targetCatName = "";
      if (strRaw && strRaw !== "none" && strRaw !== "unassigned") {
        const catMeta = CATEGORIES.find(
          (c) => c.id.toLowerCase() === strRaw.toLowerCase() || c.slug.toLowerCase() === strRaw.toLowerCase()
        );
        targetCatId = catMeta ? catMeta.id : strRaw;
        targetCatName = catMeta ? catMeta.name : (ov.category_name || targetCatId);
      }

      const customGalleryUrls = Array.isArray(ov.gallery) && ov.gallery.length > 0
        ? ov.gallery
        : (Array.isArray(ov.images) && ov.images.length > 0 ? ov.images : []);

      const customMainImg = ov.featured_image || (customGalleryUrls.length > 0 ? customGalleryUrls[0] : "");

      const customProd: Product & { category_name?: string; category_slug?: string } = {
        id: ov.id,
        partNumber: ov.partNumber || ov.sku || ov.id,
        sku: ov.sku || ov.partNumber || ov.id,
        name: ov.name || ov.title || "Custom Atelier Ensemble",
        title: ov.title || ov.name || "Custom Atelier Ensemble",
        slug: cleanCustomSlug || ov.id,
        price: ov.salePrice || ov.price || ov.regularPrice || 0,
        regularPrice: ov.regularPrice || ov.price || 0,
        salePrice: ov.salePrice || ov.price || 0,
        inStock: ov.inStock ?? true,
        stockQty: ov.stock ?? 25,
        rating: 5,
        reviewCount: 0,
        freeShipping: true,
        brand: ov.brand || "Wastram Atelier",
        category: targetCatName,
        category_id: targetCatId,
        category_name: targetCatName,
        category_slug: targetCatId,
        mainImage: customMainImg,
        featured_image: customMainImg,
        images: customGalleryUrls,
        gallery: customGalleryUrls,
        galleryImages: customGalleryUrls.map((url) => ({ url, caption: ov.name || "" })),
        shortDescription: ov.short_desc || ov.shortDescription || ov.description || "",
        short_desc: ov.short_desc || ov.shortDescription || ov.description || "",
        description: ov.description || ov.short_desc || "",
        isHomeSpecial: ov.is_featured || false,
        is_featured: ov.is_featured || false,
        tag: ov.tag || ov.badge,
        badge: ov.badge || ov.tag,
        colorVariants: ov.colorVariants || [],
        sizes: ov.sizes || ["XS", "S", "M", "L", "XL", "XXL"],
        fabric: ov.fabric || "Pure Handloom Silk & Cotton",
        details: ov.details || [],
        moq: ov.moq || "20 pcs / Flexible Wholesale Pack",
      } as any;
      list.push(customProd);
    }
  }

  list = list.filter((p) => !(p as any).deleted && !(p as any).purged);

  inMemoryMergedLiveProducts = list;
  lastMergedLiveProductsTime = now;

  if (!options?.includeHidden) {
    list = list.filter((p) => !(p as any).is_hidden);
  }

  return list;
}

export const getLiveProducts = getAllMergedProducts;
