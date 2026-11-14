/**
 * Safe Browser Storage Utility
 * Prevents "QuotaExceededError" / "The quota has been exceeded" from crashing client apps.
 * Automatically recovers from quota limits by pruning non-critical/stale caches.
 */

// Ephemeral keys that can be safely discarded when web storage quota is near full
const DISPOSABLE_STORAGE_KEYS = [
  "ixos_shipping_settings_cache",
  "ixos_shipping_settings_time",
  "ixos_discounts_cache",
  "ixos_discounts_cache_time",
  "ixos_categories_cache",
  "ixos_admin_read_notifications",
  "ixos_admin_dashboard_period",
  "ixos_admin_dashboard_custom_start",
  "ixos_admin_dashboard_custom_end",
];

export function cleanStorageIfQuotaExceeded(): void {
  if (typeof window === "undefined") return;

  try {
    // 1. Clear sessionStorage caches first
    try {
      sessionStorage.clear();
    } catch {}

    // 2. Remove known disposable localStorage caches
    for (const key of DISPOSABLE_STORAGE_KEYS) {
      try {
        localStorage.removeItem(key);
      } catch {}
    }

    // 3. Prune sample orders if oversized (> 20 orders)
    try {
      const rawOrders = localStorage.getItem("gsp_sample_orders");
      if (rawOrders && rawOrders.length > 50000) {
        const parsed = JSON.parse(rawOrders);
        if (Array.isArray(parsed) && parsed.length > 20) {
          localStorage.setItem("gsp_sample_orders", JSON.stringify(parsed.slice(0, 20)));
        }
      }
    } catch {}
  } catch (err) {
    console.warn("[SafeStorage] Cleanup notice:", err);
  }
}

export function safeSetLocalStorage(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    const isQuotaError =
      err?.name === "QuotaExceededError" ||
      err?.name === "NS_ERROR_DOM_QUOTA_EXCEEDED_ERR" ||
      err?.code === 22 ||
      err?.code === 1014 ||
      err?.number === -2147024882 ||
      (typeof err?.message === "string" && err.message.toLowerCase().includes("quota"));

    if (isQuotaError) {
      console.warn(`[SafeStorage] Quota exceeded for "${key}". Cleaning up disposable caches...`);
      cleanStorageIfQuotaExceeded();

      try {
        localStorage.setItem(key, value);
        return true;
      } catch (retryErr) {
        console.warn(`[SafeStorage] Quota still exceeded after cleanup. Silently ignoring write for "${key}".`);
        return false;
      }
    }

    console.warn(`[SafeStorage] Failed to set localStorage key "${key}":`, err);
    return false;
  }
}

export function safeGetLocalStorage(key: string, fallback: string | null = null): string | null {
  if (typeof window === "undefined") return fallback;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch {
    return fallback;
  }
}

export function safeRemoveLocalStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

export function safeSetSessionStorage(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    try {
      sessionStorage.clear();
      sessionStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
}

export function safeGetSessionStorage(key: string, fallback: string | null = null): string | null {
  if (typeof window === "undefined") return fallback;
  try {
    const val = sessionStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch {
    return fallback;
  }
}
