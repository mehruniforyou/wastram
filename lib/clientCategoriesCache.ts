import { CATEGORIES, Category } from "@/data/categories";

const CACHE_KEY = "ixos_categories_cache";
const CACHE_TIME_KEY = "ixos_categories_time";
const TTL_MS = 5 * 60 * 1000; // 5 minutes client cache
const MIN_REQUEST_INTERVAL_MS = 15 * 1000; // Hard rate-limit: max 1 network request per 15s

let inMemoryCategories: Category[] | null = null;
let lastNetworkFetchTime = 0;
let inflightPromise: Promise<Category[]> | null = null;

function mergeWithLocalOverrides(base: Category[]): Category[] {
  if (typeof window === "undefined") return base;
  try {
    const stored = localStorage.getItem("ixos_categories_overrides");
    if (!stored) return base;
    const overrides = JSON.parse(stored);
    if (!overrides || typeof overrides !== "object") return base;

    let list = [...base];
    for (const [id, ov] of Object.entries(overrides as Record<string, any>)) {
      if (!ov) continue;
      const normId = (ov.id || id).toLowerCase().trim();
      const normSlug = (ov.slug || normId).toLowerCase().trim();

      // If category is marked deleted or hidden, remove it completely from list!
      if (ov.deleted || ov.is_hidden) {
        list = list.filter((c) => {
          const cId = c.id.toLowerCase().trim();
          const cSlug = (c.slug || "").toLowerCase().trim();
          return cId !== normId && cId !== normSlug && cSlug !== normId && cSlug !== normSlug;
        });
        continue;
      }

      const existingIdx = list.findIndex(
        (c) => c.id.toLowerCase() === normId || c.slug.toLowerCase() === normSlug
      );

      if (existingIdx !== -1) {
        list[existingIdx] = {
          ...list[existingIdx],
          ...ov,
          name: ov.name || list[existingIdx].name,
          slug: ov.slug || list[existingIdx].slug,
          image: ov.image_url || ov.image || list[existingIdx].image,
        };
      }
    }
    return list;
  } catch {
    return base;
  }
}

export function invalidateCategoriesCache(): void {
  inMemoryCategories = null;
  lastNetworkFetchTime = 0;
  inflightPromise = null;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(CACHE_KEY);
      sessionStorage.removeItem(CACHE_TIME_KEY);
    } catch {}
  }
}

export async function getCachedCategories(force = false): Promise<Category[]> {
  const baseCategories = mergeWithLocalOverrides(CATEGORIES);
  if (typeof window === "undefined") return baseCategories;

  const now = Date.now();

  // 1. In-flight promise reuse (deduplication)
  if (inflightPromise) {
    return inflightPromise;
  }

  // 2. Memory cache check within TTL
  if (!force && inMemoryCategories !== null && now - lastNetworkFetchTime < TTL_MS) {
    return mergeWithLocalOverrides(inMemoryCategories);
  }

  // 3. Rate limiter guard
  if (!force && inMemoryCategories !== null && now - lastNetworkFetchTime < MIN_REQUEST_INTERVAL_MS) {
    return mergeWithLocalOverrides(inMemoryCategories);
  }

  // 4. sessionStorage fallback within TTL
  if (!force) {
    try {
      const stored = sessionStorage.getItem(CACHE_KEY);
      const storedTime = sessionStorage.getItem(CACHE_TIME_KEY);
      if (stored && storedTime && now - Number(storedTime) < TTL_MS) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryCategories = parsed;
          return mergeWithLocalOverrides(parsed);
        }
      }
    } catch {}
  }

  // 5. Network fetch with deduplication and safety latch
  inflightPromise = (async () => {
    try {
      const res = await fetch("/api/categories", {
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped: Category[] = data
            .filter((cat: any) => !cat.deleted && !cat.is_hidden)
            .map((cat: any) => {
              const baseCat = CATEGORIES.find(
                (c) => c.id.toLowerCase() === cat.id?.toLowerCase() || c.slug.toLowerCase() === cat.slug?.toLowerCase()
              );
              return {
                ...(baseCat || {}),
                id: cat.id,
                name: cat.name,
                slug: cat.slug || cat.id,
                description: cat.description || baseCat?.description || "",
                image: cat.image_url || cat.image || baseCat?.image || "/speaker-surround-popout.png",
                image_url: cat.image_url || cat.image || baseCat?.image || "/speaker-surround-popout.png",
                itemCount: cat.product_count ?? cat.itemCount ?? 0,
                is_hidden: false,
                translations: cat.translations,
                isCustomCategory: cat.isCustomCategory ?? !baseCat,
                sort_order: cat.sort_order ?? 99,
              } as Category;
            });

          inMemoryCategories = mapped;
          lastNetworkFetchTime = Date.now();

          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
            sessionStorage.setItem(CACHE_TIME_KEY, String(lastNetworkFetchTime));
          } catch {}

          return mergeWithLocalOverrides(mapped);
        }
      }
    } catch (err) {
      console.warn("[ClientCategoriesCache] Background categories fetch warning:", err);
    } finally {
      inflightPromise = null;
    }

    return baseCategories;
  })();

  return inflightPromise;
}
