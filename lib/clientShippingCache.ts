import { DEFAULT_SHIPPING_SETTINGS, ShippingSettings } from "@/utils/shipping";
import { safeSetLocalStorage, safeSetSessionStorage } from "@/lib/safeStorage";

const CACHE_KEY = "ixos_shipping_settings_cache";
const CACHE_TIME_KEY = "ixos_shipping_settings_time";
const TTL_MS = 2 * 60 * 1000; // 2 minutes client cache
const MIN_REQUEST_INTERVAL_MS = 15 * 1000; // Hard limit: maximum 1 network request per 15 seconds

let inMemoryData: ShippingSettings | null = null;
let lastNetworkFetchTime = 0;
let inflightPromise: Promise<ShippingSettings> | null = null;

export async function getCachedShippingSettings(force = false): Promise<ShippingSettings> {
  if (typeof window === "undefined") return { ...DEFAULT_SHIPPING_SETTINGS };

  const now = Date.now();

  // 1. In-flight promise reuse (deduplication)
  if (inflightPromise) {
    return inflightPromise;
  }

  // 2. Memory cache check within TTL
  if (!force && inMemoryData !== null && now - lastNetworkFetchTime < TTL_MS) {
    return inMemoryData;
  }

  // 3. Rate limiter guard: at most 1 network request per interval unless explicitly forced
  if (!force && inMemoryData !== null && now - lastNetworkFetchTime < MIN_REQUEST_INTERVAL_MS) {
    return inMemoryData;
  }

  // 3.5 Priority check: If localStorage has fresh settings within TTL, use immediately
  if (!force) {
    try {
      const local = localStorage.getItem("ixos_shipping_settings");
      const localTime = localStorage.getItem("ixos_shipping_updated_at");
      if (local && localTime && now - Number(localTime) < TTL_MS) {
        const parsed = JSON.parse(local);
        if (parsed) {
          if (parsed.germanyCourier && (/Express/i.test(parsed.germanyCourier) || /Parcel/i.test(parsed.germanyCourier))) {
            parsed.germanyCourier = "DHL Paket / Deutsche Post";
            safeSetLocalStorage("ixos_shipping_settings", JSON.stringify(parsed));
          }
          inMemoryData = parsed;
          return parsed;
        }
      }
    } catch {}
  }

  // 4. sessionStorage fallback within TTL
  if (!force) {
    try {
      const stored = sessionStorage.getItem(CACHE_KEY);
      const storedTime = sessionStorage.getItem(CACHE_TIME_KEY);
      if (stored && storedTime && now - Number(storedTime) < TTL_MS) {
        inMemoryData = JSON.parse(stored);
        if (inMemoryData) return inMemoryData;
      }
    } catch {}
  }

  // 5. Network fetch with safety latch
  lastNetworkFetchTime = now;
  inflightPromise = fetch("/api/shipping-settings" + (force ? "?t=" + now : ""))
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data && data.germanyCourier && (/Express/i.test(data.germanyCourier) || /Parcel/i.test(data.germanyCourier))) {
        data.germanyCourier = "DHL Paket / Deutsche Post";
      }
      const settings = data
        ? {
            ...DEFAULT_SHIPPING_SETTINGS,
            ...data,
            countryRates: data.countryRates !== undefined && data.countryRates !== null ? data.countryRates : {},
          }
        : inMemoryData || { ...DEFAULT_SHIPPING_SETTINGS };
      inMemoryData = settings;
      try {
        safeSetSessionStorage(CACHE_KEY, JSON.stringify(settings));
        safeSetSessionStorage(CACHE_TIME_KEY, String(Date.now()));
        // Persist to localStorage so all tabs and future page loads have fresh settings
        safeSetLocalStorage("ixos_shipping_settings", JSON.stringify(settings));
        safeSetLocalStorage("ixos_shipping_updated_at", String(Date.now()));
      } catch {}
      inflightPromise = null;
      return settings;
    })
    .catch(() => {
      inflightPromise = null;
      return inMemoryData || { ...DEFAULT_SHIPPING_SETTINGS };
    });

  return inflightPromise;
}

export function invalidateShippingCache() {
  inMemoryData = null;
  lastNetworkFetchTime = 0;
  inflightPromise = null;
  try {
    sessionStorage.removeItem(CACHE_KEY);
    sessionStorage.removeItem(CACHE_TIME_KEY);
    localStorage.removeItem("ixos_shipping_settings");
    localStorage.removeItem("ixos_shipping_updated_at");
  } catch {}
}
