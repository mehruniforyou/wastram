// Singleton module — shared across all components in the same browser tab
// Prevents multiple parallel fetches, cross-tab event loops, and runaway requests

const CACHE_KEY = "ixos_discounts_cache";
const CACHE_TIME_KEY = "ixos_discounts_cache_time";
const TTL_MS = 60 * 60 * 1000; // 1 hour client cache
const MIN_REQUEST_INTERVAL_MS = 60 * 1000; // Hard limit: maximum 1 network request per minute

let inMemoryData: any[] | null = null;
let lastNetworkFetchTime = 0;
let inflightPromise: Promise<any[]> | null = null;

export async function getCachedDiscounts(force = false): Promise<any[]> {
  if (typeof window === "undefined") return [];

  const now = Date.now();

  // 1. If there is already an active in-flight request, reuse it (prevents concurrent calls)
  if (inflightPromise) {
    return inflightPromise;
  }

  // 2. If memory cache is valid and not forced, return immediately
  if (!force && inMemoryData !== null) {
    return inMemoryData;
  }

  // 3. Rate limiter guard: If a network fetch completed less than 60s ago, do NOT fetch again
  // even if forced! (Completely breaks any possible loop)
  if (inMemoryData !== null && now - lastNetworkFetchTime < MIN_REQUEST_INTERVAL_MS) {
    return inMemoryData;
  }

  // 4. Try reading from sessionStorage first (fast, per-tab, ZERO cross-tab storage events)
  if (!force) {
    try {
      const stored = sessionStorage.getItem(CACHE_KEY);
      const storedTime = sessionStorage.getItem(CACHE_TIME_KEY);
      if (stored && storedTime && now - Number(storedTime) < TTL_MS) {
        inMemoryData = JSON.parse(stored);
        return inMemoryData || [];
      }
    } catch {}
  }

  // 5. Perform the network request with safety latch
  lastNetworkFetchTime = now;
  inflightPromise = fetch("/api/discounts")
    .then((r) => (r.ok ? r.json() : []))
    .then((data) => {
      const list = Array.isArray(data) ? data : [];
      inMemoryData = list;
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
        sessionStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      } catch {}
      inflightPromise = null;
      return list;
    })
    .catch(() => {
      inflightPromise = null;
      return inMemoryData || [];
    });

  return inflightPromise;
}

export function invalidateDiscountCache() {
  inMemoryData = null;
  lastNetworkFetchTime = 0;
  inflightPromise = null;
  try {
    sessionStorage.removeItem(CACHE_KEY);
    sessionStorage.removeItem(CACHE_TIME_KEY);
  } catch {}
}

export function getActiveDiscounts(discounts: any[]): any[] {
  if (!Array.isArray(discounts)) return [];
  const now = new Date();
  return discounts.filter(
    (d) => d.is_active !== false && (!d.expires_at || new Date(d.expires_at) > now)
  );
}
