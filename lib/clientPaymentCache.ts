export interface PublicPaymentSettings {
  enablePaypal: boolean;
  paypalClientId: string;
  environment: string;
  defaultCurrency: string;
  taxVatRate: number;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  workshopAddress: string;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
  googleTagManagerId: string;
  googleAnalytics4Id: string;
  metaPixelId: string;
  customHeadScript: string;
  [key: string]: any;
}

const DEFAULT_PUBLIC_PAYMENT_SETTINGS: PublicPaymentSettings = {
  enablePaypal: true,
  paypalClientId: "",
  environment: "sandbox",
  defaultCurrency: "EUR",
  taxVatRate: 19,
  storeName: "IXOS Audio",
  storeEmail: "ixos@drampalis.de",
  storePhone: "01606705008",
  workshopAddress: "Welps Esch 5, Saerbox Nr-12, 48369 Saerbeck, NRW, Germany",
  freeShippingThreshold: 75,
  maintenanceMode: false,
  googleTagManagerId: "GTM-IXOS2008",
  googleAnalytics4Id: "G-IXOS4AUDIO",
  metaPixelId: "982341908234112",
  customHeadScript: "<!-- Global IXOS Audio Precision Tag -->",
};

const CACHE_KEY = "ixos_payment_settings_cache";
const CACHE_TIME_KEY = "ixos_payment_settings_time";
const TTL_MS = 60 * 60 * 1000; // 1 hour client cache
const MIN_REQUEST_INTERVAL_MS = 60 * 1000; // Hard limit: maximum 1 network request per 60 seconds

let inMemoryData: PublicPaymentSettings | null = null;
let lastNetworkFetchTime = 0;
let inflightPromise: Promise<PublicPaymentSettings> | null = null;

export async function getCachedPaymentSettings(force = false): Promise<PublicPaymentSettings> {
  if (typeof window === "undefined") return { ...DEFAULT_PUBLIC_PAYMENT_SETTINGS };

  const now = Date.now();

  // 1. In-flight promise reuse
  if (inflightPromise) {
    return inflightPromise;
  }

  // 2. Memory cache check
  if (!force && inMemoryData !== null) {
    return inMemoryData;
  }

  // 3. Rate limiter guard
  if (inMemoryData !== null && now - lastNetworkFetchTime < MIN_REQUEST_INTERVAL_MS) {
    return inMemoryData;
  }

  // 4. sessionStorage fallback
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
  inflightPromise = fetch("/api/payment-settings")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      const settings = data
        ? { ...DEFAULT_PUBLIC_PAYMENT_SETTINGS, ...data }
        : inMemoryData || { ...DEFAULT_PUBLIC_PAYMENT_SETTINGS };
      inMemoryData = settings;
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(settings));
        sessionStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      } catch {}
      inflightPromise = null;
      return settings;
    })
    .catch(() => {
      inflightPromise = null;
      return inMemoryData || { ...DEFAULT_PUBLIC_PAYMENT_SETTINGS };
    });

  return inflightPromise;
}

export function invalidatePaymentCache() {
  inMemoryData = null;
  lastNetworkFetchTime = 0;
  inflightPromise = null;
  try {
    sessionStorage.removeItem(CACHE_KEY);
    sessionStorage.removeItem(CACHE_TIME_KEY);
  } catch {}
}
