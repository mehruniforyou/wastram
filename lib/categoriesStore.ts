import { CATEGORIES, Category } from "@/data/categories";
import { getLiveProducts } from "@/lib/productsStore";
import { getProductNormalizedCategoryId } from "@/data/compatibility";
import { getFirebaseDb } from "@/lib/firebaseClient";
import { getAdminDb } from "@/lib/firebaseAdmin";
import fs from "fs";
import path from "path";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

function getCategoryOverridesFilePath(): string {
  return path.join(process.cwd(), "src", "data", "category-overrides.json");
}

function loadCategoryOverridesFromDisk(): Record<string, CategoryOverride> | null {
  try {
    const filePath = getCategoryOverridesFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[CategoriesStore] Notice reading disk fallback:", err);
  }
  return null;
}

function saveCategoryOverridesToDisk(overrides: Record<string, CategoryOverride>): void {
  try {
    const filePath = getCategoryOverridesFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(overrides, null, 2), "utf8");
  } catch (err) {
    console.warn("[CategoriesStore] Notice writing disk fallback:", err);
  }
}

export interface CategoryOverride {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  is_hidden?: boolean;
  sort_order?: number;
  seo_meta?: any;
  isCustomCategory?: boolean;
  deleted?: boolean;
  updated_at?: string;
  [key: string]: any;
}

let inMemoryCategoryOverrides: Record<string, CategoryOverride> = {};

export function isBannedOrPurgedCategory(key: string, ov?: Partial<CategoryOverride> | null): boolean {
  const normKey = String(key || "").toLowerCase().trim();
  const normId = String(ov?.id || "").toLowerCase().trim();
  const normSlug = String(ov?.slug || "").toLowerCase().trim();
  const normName = String(ov?.name || "").toLowerCase().trim();

  // Specifically purge "Bead repair" (any casing, dashes, underscores, spaces)
  if (
    normKey === "bead-repair" ||
    normKey === "bead_repair" ||
    normKey === "bead repair" ||
    normId === "bead-repair" ||
    normId === "bead_repair" ||
    normId === "bead repair" ||
    normSlug === "bead-repair" ||
    normSlug === "bead_repair" ||
    normSlug === "bead repair" ||
    normName === "bead repair" ||
    normName === "bead-repair" ||
    normName === "bead_repair" ||
    normName.includes("bead repair") ||
    normSlug.includes("bead-repair") ||
    normId.includes("bead-repair")
  ) {
    return true;
  }

  // Specifically purge accidental empty duplicate "etui-inlays" (0 products)
  // while strictly keeping the real 4-product category "etui inlaysetui-inlays" untouched!
  if (
    (normKey === "etui-inlays" || normId === "etui-inlays" || normSlug === "etui-inlays") &&
    normKey !== "etui inlaysetui-inlays" &&
    normId !== "etui inlaysetui-inlays" &&
    normSlug !== "etui inlaysetui-inlays"
  ) {
    return true;
  }

  return false;
}

function sanitizeOverridesMap(map: Record<string, CategoryOverride>): void {
  for (const [k, v] of Object.entries(map)) {
    if (isBannedOrPurgedCategory(k, v) || (v?.deleted && v?.isCustomCategory)) {
      delete map[k];
    }
  }
}

// TTL cache: skip Firestore reads if data is fresh (5 minutes)
const CATEGORY_CACHE_TTL_MS = 5 * 60 * 1000;
let lastCategoryLoadedTime = 0;

export async function getCategoryOverrides(force = false): Promise<Record<string, CategoryOverride>> {
  sanitizeOverridesMap(inMemoryCategoryOverrides);

  // 1. Initial disk fallback load if memory cache is empty
  if (Object.keys(inMemoryCategoryOverrides).length === 0) {
    const diskData = loadCategoryOverridesFromDisk();
    if (diskData) {
      for (const [k, v] of Object.entries(diskData)) {
        if (!isBannedOrPurgedCategory(k, v) && !(v?.deleted && v?.isCustomCategory)) {
          inMemoryCategoryOverrides[k] = v;
        }
      }
    }
  }

  // Return in-memory cache if fresh (avoids Firestore on every category page ISR hit)
  const now = Date.now();
  if (!force && now - lastCategoryLoadedTime < CATEGORY_CACHE_TTL_MS && Object.keys(inMemoryCategoryOverrides).length > 0) {
    return { ...inMemoryCategoryOverrides };
  }

  try {
    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        const masterSnap = await adminDb.collection("orders").doc("_categories_store").get();
        if (masterSnap.exists) {
          const data = masterSnap.data();
          if (data?.categories && typeof data.categories === "object") {
            for (const [k, v] of Object.entries(data.categories as Record<string, CategoryOverride>)) {
              if (!isBannedOrPurgedCategory(k, v) && !(v?.deleted && v?.isCustomCategory)) {
                inMemoryCategoryOverrides[k] = v;
              }
            }
          }
        }
      } catch (_) {}

      try {
        const snap = await adminDb.collection("category_overrides").get();
        snap.forEach((d) => {
          const data = d.data() as CategoryOverride;
          if (!isBannedOrPurgedCategory(d.id, data) && !(data?.deleted && data?.isCustomCategory)) {
            inMemoryCategoryOverrides[d.id] = { ...data, id: d.id };
          } else if (isBannedOrPurgedCategory(d.id, data)) {
            try {
              d.ref.delete().catch(() => {});
            } catch (_) {}
          }
        });
      } catch (_) {}

      sanitizeOverridesMap(inMemoryCategoryOverrides);
      saveCategoryOverridesToDisk(inMemoryCategoryOverrides);
      lastCategoryLoadedTime = Date.now();
      return { ...inMemoryCategoryOverrides };
    }

    const db = getFirebaseDb();
    if (db) {
      // 1. Try reading from master document orders/_categories_store
      try {
        const masterSnap = await getDoc(doc(db, "orders", "_categories_store"));
        if (masterSnap.exists()) {
          const data = masterSnap.data();
          if (data?.categories && typeof data.categories === "object") {
            for (const [k, v] of Object.entries(data.categories as Record<string, CategoryOverride>)) {
              if (!isBannedOrPurgedCategory(k, v) && !(v?.deleted && v?.isCustomCategory)) {
                inMemoryCategoryOverrides[k] = v;
              }
            }
          }
        }
      } catch (masterErr) {
        // Fallback silently
      }

      // 2. Also check collection category_overrides
      try {
        const snap = await getDocs(collection(db, "category_overrides"));
        snap.forEach((d) => {
          const data = d.data() as CategoryOverride;
          if (!isBannedOrPurgedCategory(d.id, data) && !(data?.deleted && data?.isCustomCategory)) {
            inMemoryCategoryOverrides[d.id] = { ...data, id: d.id };
          }
        });
      } catch (err) {
        // Fallback silently
      }
    }
  } catch (err) {
    console.warn("[CategoriesStore] Notice loading overrides from Firestore:", err);
  }

  sanitizeOverridesMap(inMemoryCategoryOverrides);
  saveCategoryOverridesToDisk(inMemoryCategoryOverrides);
  // Stamp cache time after any Firestore attempt
  lastCategoryLoadedTime = Date.now();
  return { ...inMemoryCategoryOverrides };
}

export async function saveCategoryOverride(
  id: string,
  data: Partial<CategoryOverride>
): Promise<CategoryOverride> {
  const existing = inMemoryCategoryOverrides[id] || {};
  const override: CategoryOverride = {
    ...existing,
    ...data,
    id,
    updated_at: new Date().toISOString(),
  };

  inMemoryCategoryOverrides[id] = override;
  // Invalidate TTL so next category read gets the new data immediately
  lastCategoryLoadedTime = 0;


  const adminDb = getAdminDb();
  if (adminDb) {
    try {
      await adminDb.collection("orders").doc("_categories_store").set(
        {
          categories: inMemoryCategoryOverrides,
          updated_at: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (orderDocErr) {
      console.warn("[CategoriesStore] Failed writing orders/_categories_store via AdminDB:", orderDocErr);
    }

    try {
      await adminDb.collection("category_overrides").doc(id).set(override, { merge: true });
    } catch (err) {
      console.warn("[CategoriesStore] Notice writing override to Firestore via AdminDB:", err);
    }

    saveCategoryOverridesToDisk(inMemoryCategoryOverrides);
    return override;
  }

  const db = getFirebaseDb();
  if (db) {
    let hasWriteError = false;
    // 1. Persist to orders/_categories_store master document
    try {
      await setDoc(
        doc(db, "orders", "_categories_store"),
        {
          categories: inMemoryCategoryOverrides,
          updated_at: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (orderDocErr: any) {
      console.warn("[CategoriesStore] Failed writing orders/_categories_store:", orderDocErr);
      if (orderDocErr?.code === "permission-denied" || String(orderDocErr).includes("permission-denied") || String(orderDocErr).includes("PERMISSION_DENIED")) {
        hasWriteError = true;
      }
    }

    // 2. Also write to direct category_overrides collection
    try {
      await setDoc(doc(db, "category_overrides", id), override, { merge: true });
    } catch (err: any) {
      console.warn("[CategoriesStore] Notice writing override to Firestore:", err);
      if (err?.code === "permission-denied" || String(err).includes("permission-denied") || String(err).includes("PERMISSION_DENIED")) {
        hasWriteError = true;
      }
    }

    if (hasWriteError) {
      (override as any)._warning = "FIRESTORE_PERMISSION_DENIED";
    }
  }

  saveCategoryOverridesToDisk(inMemoryCategoryOverrides);
  return override;
}

export async function deleteCategoryOverride(id: string): Promise<void> {
  const normId = id.toLowerCase().trim();
  const isBaseCategory = CATEGORIES.some(
    (c) => c.id.toLowerCase() === normId || c.slug.toLowerCase() === normId
  );

  const adminDb = getAdminDb();
  const db = getFirebaseDb();

  // Load disk entries to ensure all matching keys are found
  const diskData = loadCategoryOverridesFromDisk() || {};
  const allKnown = { ...diskData, ...inMemoryCategoryOverrides };

  if (isBaseCategory) {
    const existing = allKnown[id] || allKnown[normId] || { id };
    const deletedOverride: CategoryOverride = {
      ...existing,
      is_hidden: true,
      deleted: true,
      updated_at: new Date().toISOString(),
    };
    inMemoryCategoryOverrides[id] = deletedOverride;
    inMemoryCategoryOverrides[normId] = deletedOverride;
    lastCategoryLoadedTime = 0;

    if (adminDb) {
      try {
        await adminDb.collection("orders").doc("_categories_store").set(
          {
            categories: inMemoryCategoryOverrides,
            updated_at: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (_) {}

      try {
        await adminDb.collection("category_overrides").doc(id).set(deletedOverride, { merge: true });
        if (normId !== id) {
          await adminDb.collection("category_overrides").doc(normId).set(deletedOverride, { merge: true });
        }
      } catch (_) {}
      saveCategoryOverridesToDisk(inMemoryCategoryOverrides);
      return;
    }

    if (db) {
      try {
        await setDoc(
          doc(db, "orders", "_categories_store"),
          {
            categories: inMemoryCategoryOverrides,
            updated_at: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (_) {}

      try {
        await setDoc(doc(db, "category_overrides", id), deletedOverride, { merge: true });
        if (normId !== id) {
          await setDoc(doc(db, "category_overrides", normId), deletedOverride, { merge: true });
        }
      } catch (err) {
        console.warn("[CategoriesStore] Notice deleting category override:", err);
      }
    }
    saveCategoryOverridesToDisk(inMemoryCategoryOverrides);
    return;
  }

  // Custom category: Permanently delete!
  const targetSlug = allKnown[id]?.slug || allKnown[normId]?.slug || normId;
  const targetName = (allKnown[id]?.name || allKnown[normId]?.name || "").toLowerCase().trim();
  const keysToDelete = new Set<string>([id, normId, targetSlug, targetSlug.toLowerCase().trim()]);

  for (const [k, ov] of Object.entries(allKnown)) {
    const kNorm = k.toLowerCase().trim();
    const ovId = (ov?.id || "").toLowerCase().trim();
    const ovSlug = (ov?.slug || "").toLowerCase().trim();

    if (
      kNorm === normId ||
      ovId === normId ||
      ovSlug === normId ||
      (targetSlug && (ovSlug === targetSlug.toLowerCase().trim() || kNorm === targetSlug.toLowerCase().trim())) ||
      isBannedOrPurgedCategory(k, ov)
    ) {
      keysToDelete.add(k);
      keysToDelete.add(kNorm);
      if (ov?.id) keysToDelete.add(ov.id);
      if (ov?.slug) keysToDelete.add(ov.slug);
    }
  }

  // 1. Remove from active memory cache
  for (const k of keysToDelete) {
    delete inMemoryCategoryOverrides[k];
  }
  lastCategoryLoadedTime = 0;

  // 2. Persist deletion to disk
  saveCategoryOverridesToDisk(inMemoryCategoryOverrides);

  // 3. Persist deletion to Firestore (AdminDB or client DB)
  if (adminDb) {
    try {
      await adminDb.collection("orders").doc("_categories_store").set({
        categories: inMemoryCategoryOverrides,
        updated_at: new Date().toISOString(),
      });
    } catch (_) {}

    for (const k of keysToDelete) {
      try {
        await adminDb.collection("category_overrides").doc(k).delete();
      } catch (_) {}
    }
    return;
  }

  if (db) {
    try {
      await setDoc(doc(db, "orders", "_categories_store"), {
        categories: inMemoryCategoryOverrides,
        updated_at: new Date().toISOString(),
      });
    } catch (_) {}

    for (const k of keysToDelete) {
      try {
        await deleteDoc(doc(db, "category_overrides", k));
      } catch (_) {}
    }
  }
}

export interface LiveCategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_hidden: boolean;
  sort_order: number;
  seo_meta: any;
  product_count: number;
  translations?: Record<string, any>;
}

export async function getLiveCategories(options?: {
  includeHidden?: boolean;
  includeVirtual?: boolean;
  forceRefresh?: boolean;
}): Promise<LiveCategoryWithCount[]> {
  const overrides = await getCategoryOverrides(options?.forceRefresh);
  const liveProducts = await getLiveProducts({
    includeHidden: options?.includeHidden,
    forceRefresh: options?.forceRefresh,
  });

  // Precompute product counts per category ID
  const countsByCat: Record<string, number> = {};
  for (const prod of liveProducts) {
    const catId = getProductNormalizedCategoryId(prod);
    countsByCat[catId] = (countsByCat[catId] || 0) + 1;
  }

  // Base taxonomy categories (excludes virtual collections like "all-parts" and "specials" by default)
  const baseCategories = options?.includeVirtual
    ? CATEGORIES
    : CATEGORIES.filter((c) => c.id !== "all-parts" && c.id !== "specials" && !c.isVirtual);

  let list: LiveCategoryWithCount[] = baseCategories.map((c, i) => {
    const ov = overrides[c.id] || overrides[c.slug];
    const isHidden = ov?.is_hidden !== undefined ? ov.is_hidden : (ov?.deleted ?? false);
    const count =
      c.id === "dust-caps"
        ? (countsByCat["dust-caps"] || 0) + (countsByCat["dust-cap"] || 0)
        : countsByCat[c.id] ?? c.itemCount ?? 0;

    return {
      id: c.id,
      name: ov?.name || c.name,
      slug: ov?.slug || c.slug,
      description: ov?.description || c.description || "High precision acoustic components & repair parts.",
      image_url: ov?.image_url || c.image || "/speaker-surround-popout.png",
      is_hidden: isHidden,
      sort_order: ov?.sort_order ?? (i + 1),
      seo_meta: ov?.seo_meta || {
        title: `${ov?.name || c.name} | IXOS Audio`,
        description: ov?.description || c.description || c.name,
      },
      product_count: count,
      translations: ov?.translations || (c as any).translations,
    };
  });

  // Deduplicate dust-cap / dust-caps and merge custom categories added from admin
  Object.keys(overrides).forEach((id) => {
    const ov = overrides[id];
    if (!ov) return;

    // Never return deleted or banned categories
    if (ov.deleted) return;
    if (isBannedOrPurgedCategory(id, ov)) return;

    const normId = id === "dust-cap" ? "dust-caps" : id;
    const normSlug = ov.slug === "dust-cap" ? "dust-caps" : (ov.slug || ov.id);

    // If override is for dust-cap, merge into existing dust-caps entry
    if ((id === "dust-cap" || ov.slug === "dust-cap") && list.some((c) => c.id === "dust-caps")) {
      const idx = list.findIndex((c) => c.id === "dust-caps");
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          name: ov.name || list[idx].name,
          description: ov.description || list[idx].description,
          image_url: ov.image_url || list[idx].image_url,
          is_hidden: ov.is_hidden !== undefined ? ov.is_hidden : list[idx].is_hidden,
        };
      }
      return;
    }

    const isCustom = ov.isCustomCategory || !baseCategories.some((c) => c.id === id || c.id === normId || c.slug === ov.slug || c.slug === normSlug);
    if (isCustom && !list.some((c) => c.id === id || c.id === normId || c.slug === ov.slug || c.slug === normSlug)) {
      list.push({
        id: ov.id || id,
        name: ov.name || "Custom Category",
        slug: ov.slug || ov.id || id,
        description: ov.description || "Custom audio component category.",
        image_url: ov.image_url || "/speaker-surround-popout.png",
        is_hidden: ov.is_hidden ?? false,
        sort_order: ov.sort_order ?? (list.length + 1),
        seo_meta: ov.seo_meta || null,
        product_count: countsByCat[ov.id] || (ov.slug ? countsByCat[ov.slug] : 0) || 0,
        translations: ov.translations,
      });
    }
  });

  // Filter out any banned category
  list = list.filter((c) => !isBannedOrPurgedCategory(c.id, c));

  // ALWAYS filter out permanently deleted categories (both base and custom)
  list = list.filter((c) => {
    const ov = overrides[c.id] || overrides[c.slug];
    return !ov?.deleted && !(c as any).deleted;
  });

  if (!options?.includeHidden) {
    list = list.filter((c) => !c.is_hidden);
  }

  list.sort((a, b) => a.sort_order - b.sort_order);

  return list;
}
