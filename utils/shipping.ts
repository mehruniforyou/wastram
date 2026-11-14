import { findStateOrProvince, COUNTRY_DICTIONARY, SHIPPING_COUNTRIES } from "@/data/regionsData";

export interface CategoryShippingRate {
  categoryId: string;
  categoryName?: string;
  deFee?: number;
  euFee?: number;
  gbFee?: number;
  usFee?: number;
  caFee?: number;
  intlFee?: number;
  deliveryTime?: string;
  countryRates?: Record<string, number>;
  countryDeliveryTimes?: Record<string, string>;
  countryActive?: Record<string, boolean>;

  // Additional Item Surcharges for multi-item orders (e.g. +2-4€ for each additional item)
  additionalItemFee?: number;
  deAdditionalFee?: number;
  euAdditionalFee?: number;
  gbAdditionalFee?: number;
  usAdditionalFee?: number;
  caAdditionalFee?: number;
  intlAdditionalFee?: number;
  countryAdditionalFees?: Record<string, number>;

  // State / Province level overrides for USA and Canada
  stateRates?: Record<string, number>;
  stateDeliveryTimes?: Record<string, string>;
  stateActive?: Record<string, boolean>;
  stateAdditionalFees?: Record<string, number>;
}

export interface CityShippingRate {
  id: string;
  countryCode: string; // e.g. "DE", "GB", "US", "CA", "FR", "IT", etc.
  cityName: string; // e.g. "London", "New York", "Berlin", "Paris"
  postalCode?: string; // e.g. "EC1", "10001", "80331", etc.
  fee: number;
  deliveryTime?: string;
  courier?: string;
}

export interface ProductShippingRates {
  de?: number;
  eu?: number;
  gb?: number;
  us?: number;
  ca?: number;
  intl?: number;
  additionalItemFee?: number;
  [countryCode: string]: number | undefined;
}

export interface ShippingSettings {
  // Germany (Domestic)
  germanyFreeShipping: boolean;
  germanyShippingFee: number;
  germanyDeliveryTime: string;
  germanyCourier: string;
  germanyAdditionalFee?: number;

  // European Union (EU)
  euShippingFee: number;
  euDeliveryTime: string;
  euCourier: string;
  euAdditionalFee?: number;

  // Rest of World / International
  internationalShippingFee: number;
  internationalDeliveryTime: string;
  internationalCourier: string;
  internationalAdditionalFee?: number;

  // Country-specific rate overrides configured by admin (countryCode -> number)
  countryRates: Record<string, number>;

  // Country-specific additional item fee overrides (countryCode -> number)
  countryAdditionalFees?: Record<string, number>;

  // Category-specific shipping rates configured by admin (categoryId -> CategoryShippingRate)
  categoryRates?: Record<string, CategoryShippingRate>;

  // City or Postal Code specific overrides configured by admin
  cityRates?: CityShippingRate[];

  // Public banner or announcement
  bannerText: string;

  updated_at?: string;
}

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  germanyFreeShipping: true,
  germanyShippingFee: 0.0,
  germanyDeliveryTime: "Within 1 week",
  germanyCourier: "DHL Paket / Deutsche Post",
  germanyAdditionalFee: 0.0,

  euShippingFee: 9.95,
  euDeliveryTime: "1-2 weeks",
  euCourier: "DHL Paket Europe",
  euAdditionalFee: 2.00,

  internationalShippingFee: 14.95,
  internationalDeliveryTime: "2-3 weeks",
  internationalCourier: "DHL Paket Worldwide",
  internationalAdditionalFee: 3.00,

  countryRates: {
    GB: 11.95,
    US: 14.95,
    CA: 14.95,
    CH: 11.95,
    NO: 12.95,
  },
  countryAdditionalFees: {
    GB: 2.00,
    US: 3.00,
    CA: 3.00,
    CH: 2.50,
    NO: 2.50,
  },

  categoryRates: {
    sicken: {
      categoryId: "sicken",
      categoryName: "Sicken",
      deFee: 0.0,
      euFee: 9.95,
      gbFee: 11.95,
      usFee: 14.95,
      caFee: 14.95,
      intlFee: 16.95,
      deAdditionalFee: 0.0,
      euAdditionalFee: 2.00,
      gbAdditionalFee: 2.00,
      usAdditionalFee: 3.00,
      caAdditionalFee: 3.00,
      intlAdditionalFee: 3.00,
      additionalItemFee: 2.00,
    },
    diaphragmen: {
      categoryId: "diaphragmen",
      categoryName: "Diaphragmen",
      deFee: 0.0,
      euFee: 9.95,
      gbFee: 11.95,
      usFee: 14.95,
      caFee: 14.95,
      intlFee: 16.95,
      deAdditionalFee: 0.0,
      euAdditionalFee: 2.00,
      gbAdditionalFee: 2.00,
      usAdditionalFee: 3.00,
      caAdditionalFee: 3.00,
      intlAdditionalFee: 3.00,
      additionalItemFee: 2.00,
    },
    inlays: {
      categoryId: "inlays",
      categoryName: "Inlays",
      deFee: 14.00,
      euFee: 9.95,
      gbFee: 11.95,
      usFee: 14.95,
      caFee: 14.95,
      intlFee: 16.95,
      deAdditionalFee: 2.00,
      euAdditionalFee: 2.00,
      gbAdditionalFee: 2.00,
      usAdditionalFee: 3.00,
      caAdditionalFee: 3.00,
      intlAdditionalFee: 3.00,
      additionalItemFee: 2.00,
      deliveryTime: "1-2 Werktage",
      countryDeliveryTimes: {
        DE: "1-2 Werktage",
      },
      countryRates: {
        DE: 14.00,
      },
      countryAdditionalFees: {
        DE: 2.00,
      },
    },
    koffer: {
      categoryId: "koffer",
      categoryName: "Koffer",
      deFee: 11.00,
      euFee: 12.95,
      gbFee: 14.95,
      usFee: 19.95,
      caFee: 19.95,
      intlFee: 24.95,
      deAdditionalFee: 2.00,
      euAdditionalFee: 3.00,
      gbAdditionalFee: 3.00,
      usAdditionalFee: 4.00,
      caAdditionalFee: 4.00,
      intlAdditionalFee: 5.00,
      additionalItemFee: 2.00,
      deliveryTime: "1-2 Werktage",
      countryDeliveryTimes: {
        DE: "1-2 Werktage",
      },
      countryRates: {
        DE: 11.00,
      },
      countryAdditionalFees: {
        DE: 2.00,
      },
    },
    "klein-koffer-bag": {
      categoryId: "klein-koffer-bag",
      categoryName: "Kleine Koffer - Bag",
      deFee: 11.00,
      euFee: 12.95,
      gbFee: 14.95,
      usFee: 19.95,
      caFee: 19.95,
      intlFee: 24.95,
      deAdditionalFee: 2.00,
      euAdditionalFee: 3.00,
      gbAdditionalFee: 3.00,
      usAdditionalFee: 4.00,
      caAdditionalFee: 4.00,
      intlAdditionalFee: 5.00,
      additionalItemFee: 2.00,
      deliveryTime: "1-2 Werktage",
      countryDeliveryTimes: {
        DE: "1-2 Werktage",
      },
      countryRates: {
        DE: 11.00,
      },
      countryAdditionalFees: {
        DE: 2.00,
      },
    },
    "mikrofon-teile": {
      categoryId: "mikrofon-teile",
      categoryName: "Mikrofon Teile",
      deFee: 0.0,
      euFee: 9.95,
      gbFee: 11.95,
      usFee: 14.95,
      caFee: 14.95,
      intlFee: 16.95,
      deAdditionalFee: 0.0,
      euAdditionalFee: 2.00,
      gbAdditionalFee: 2.00,
      usAdditionalFee: 3.00,
      caAdditionalFee: 3.00,
      intlAdditionalFee: 3.00,
      additionalItemFee: 2.00,
    },
    "recone-kits": {
      categoryId: "recone-kits",
      categoryName: "Recone Kits",
      deFee: 8.00,
      euFee: 9.95,
      gbFee: 11.95,
      usFee: 14.95,
      caFee: 14.95,
      intlFee: 16.95,
      deAdditionalFee: 2.00,
      euAdditionalFee: 2.00,
      gbAdditionalFee: 2.00,
      usAdditionalFee: 3.00,
      caAdditionalFee: 3.00,
      intlAdditionalFee: 3.00,
      additionalItemFee: 2.00,
      deliveryTime: "1-2 Werktage",
      countryDeliveryTimes: {
        DE: "1-2 Werktage",
      },
      countryRates: {
        DE: 8.00,
      },
      countryAdditionalFees: {
        DE: 2.00,
      },
    },
    "used-parts": {
      categoryId: "used-parts",
      categoryName: "Used Parts",
      deFee: 0.0,
      euFee: 9.95,
      gbFee: 11.95,
      usFee: 14.95,
      caFee: 14.95,
      intlFee: 16.95,
      deAdditionalFee: 0.0,
      euAdditionalFee: 2.00,
      gbAdditionalFee: 2.00,
      usAdditionalFee: 3.00,
      caAdditionalFee: 3.00,
      intlAdditionalFee: 3.00,
      additionalItemFee: 2.00,
    },
    "dust-caps": {
      categoryId: "dust-caps",
      categoryName: "Dust Caps",
      deFee: 0.0,
      euFee: 9.95,
      gbFee: 11.95,
      usFee: 14.95,
      caFee: 14.95,
      intlFee: 16.95,
      deAdditionalFee: 0.0,
      euAdditionalFee: 2.00,
      gbAdditionalFee: 2.00,
      usAdditionalFee: 3.00,
      caAdditionalFee: 3.00,
      intlAdditionalFee: 3.00,
      additionalItemFee: 2.00,
    },
    "surround-repair": {
      categoryId: "surround-repair",
      categoryName: "Surround Repair",
      deFee: 0.0,
      euFee: 9.95,
      gbFee: 11.95,
      usFee: 14.95,
      caFee: 14.95,
      intlFee: 16.95,
      deAdditionalFee: 0.0,
      euAdditionalFee: 2.00,
      gbAdditionalFee: 2.00,
      usAdditionalFee: 3.00,
      caAdditionalFee: 3.00,
      intlAdditionalFee: 3.00,
      additionalItemFee: 2.00,
    },
    "etui-inlays": {
      categoryId: "etui-inlays",
      categoryName: "Etui Inlays",
      deFee: 0.0,
      euFee: 9.95,
      gbFee: 11.95,
      usFee: 14.95,
      caFee: 14.95,
      intlFee: 16.95,
      deAdditionalFee: 0.0,
      euAdditionalFee: 2.00,
      gbAdditionalFee: 2.00,
      usAdditionalFee: 3.00,
      caAdditionalFee: 3.00,
      intlAdditionalFee: 3.00,
      additionalItemFee: 2.00,
    },
  },

  cityRates: [
    {
      id: "de-berlin",
      countryCode: "DE",
      cityName: "Berlin",
      postalCode: "10115",
      fee: 0.0,
      deliveryTime: "1-2 Werktage",
      courier: "DHL Paket / Deutsche Post",
    },
    {
      id: "de-muenchen",
      countryCode: "DE",
      cityName: "München",
      postalCode: "80331",
      fee: 0.0,
      deliveryTime: "1-2 Werktage",
      courier: "DHL Paket / Deutsche Post",
    },
    {
      id: "gb-london",
      countryCode: "GB",
      cityName: "London",
      postalCode: "EC1A",
      fee: 11.95,
      deliveryTime: "3-5 Werktage",
      courier: "DHL Packet UK",
    },
    {
      id: "us-nyc",
      countryCode: "US",
      cityName: "New York",
      postalCode: "10001",
      fee: 14.95,
      deliveryTime: "4-7 Werktage",
      courier: "DHL Paket Worldwide",
    },
    {
      id: "ca-toronto",
      countryCode: "CA",
      cityName: "Toronto",
      postalCode: "M5H",
      fee: 14.95,
      deliveryTime: "4-8 Werktage",
      courier: "DHL Paket Worldwide",
    },
    {
      id: "fr-paris",
      countryCode: "FR",
      cityName: "Paris",
      postalCode: "75001",
      fee: 9.95,
      deliveryTime: "2-3 Werktage",
      courier: "DHL Paket Europe",
    },
    {
      id: "at-wien",
      countryCode: "AT",
      cityName: "Wien",
      postalCode: "1010",
      fee: 8.95,
      deliveryTime: "2-3 Werktage",
      courier: "DHL Paket Europe",
    },
    {
      id: "gr-athens",
      countryCode: "GR",
      cityName: "Athen",
      postalCode: "10431",
      fee: 9.95,
      deliveryTime: "3-5 Werktage",
      courier: "DHL Paket Europe",
    },
  ],

  bannerText: "Kostenloser Versand innerhalb Deutschlands • Weltweiter Expressversand verfügbar",
};

/**
 * Sanitizes and compacts ShippingSettings to prevent web storage quota overflow
 * and minimize network/Firestore payloads by pruning redundant defaults (e.g. active=true).
 */
export function compactShippingSettings(settings: ShippingSettings): ShippingSettings {
  if (!settings || typeof settings !== "object") return settings;

  const cleanCategoryRates: Record<string, CategoryShippingRate> = {};
  if (settings.categoryRates && typeof settings.categoryRates === "object") {
    for (const [catId, catRate] of Object.entries(settings.categoryRates)) {
      if (!catRate || typeof catRate !== "object") continue;

      const cleanCountryRates: Record<string, number> = {};
      if (catRate.countryRates && typeof catRate.countryRates === "object") {
        for (const [cCode, val] of Object.entries(catRate.countryRates)) {
          const num = Number(val);
          if (!isNaN(num) && num >= 0) {
            cleanCountryRates[cCode] = num;
          }
        }
      }

      const cleanCountryAddFees: Record<string, number> = {};
      if (catRate.countryAdditionalFees && typeof catRate.countryAdditionalFees === "object") {
        for (const [cCode, val] of Object.entries(catRate.countryAdditionalFees)) {
          const num = Number(val);
          if (!isNaN(num) && num >= 0) {
            cleanCountryAddFees[cCode] = num;
          }
        }
      }

      const cleanCountryDeliveryTimes: Record<string, string> = {};
      if (catRate.countryDeliveryTimes && typeof catRate.countryDeliveryTimes === "object") {
        for (const [cCode, val] of Object.entries(catRate.countryDeliveryTimes)) {
          if (typeof val === "string" && val.trim() !== "") {
            cleanCountryDeliveryTimes[cCode] = val.trim();
          }
        }
      }

      // ONLY keep false flags. true is default everywhere, so omitting true saves huge space
      const cleanCountryActive: Record<string, boolean> = {};
      if (catRate.countryActive && typeof catRate.countryActive === "object") {
        for (const [cCode, val] of Object.entries(catRate.countryActive)) {
          if (val === false) {
            cleanCountryActive[cCode] = false;
          }
        }
      }

      const cleanStateRates: Record<string, number> = {};
      if (catRate.stateRates && typeof catRate.stateRates === "object") {
        for (const [sCode, val] of Object.entries(catRate.stateRates)) {
          const num = Number(val);
          if (!isNaN(num) && num >= 0) {
            cleanStateRates[sCode] = num;
          }
        }
      }

      const cleanStateActive: Record<string, boolean> = {};
      if (catRate.stateActive && typeof catRate.stateActive === "object") {
        for (const [sCode, val] of Object.entries(catRate.stateActive)) {
          if (val === false) {
            cleanStateActive[sCode] = false;
          }
        }
      }

      cleanCategoryRates[catId] = {
        ...catRate,
        countryRates: cleanCountryRates,
        countryAdditionalFees: cleanCountryAddFees,
        countryDeliveryTimes: cleanCountryDeliveryTimes,
        countryActive: cleanCountryActive,
        stateRates: cleanStateRates,
        stateActive: cleanStateActive,
      };
    }
  }

  const cleanGlobalCountryRates: Record<string, number> = {};
  if (settings.countryRates && typeof settings.countryRates === "object") {
    for (const [cCode, val] of Object.entries(settings.countryRates)) {
      const num = Number(val);
      if (!isNaN(num) && num >= 0) {
        cleanGlobalCountryRates[cCode] = num;
      }
    }
  }

  const cleanGlobalCountryAddFees: Record<string, number> = {};
  if (settings.countryAdditionalFees && typeof settings.countryAdditionalFees === "object") {
    for (const [cCode, val] of Object.entries(settings.countryAdditionalFees)) {
      const num = Number(val);
      if (!isNaN(num) && num >= 0) {
        cleanGlobalCountryAddFees[cCode] = num;
      }
    }
  }

  return {
    ...settings,
    countryRates: cleanGlobalCountryRates,
    countryAdditionalFees: cleanGlobalCountryAddFees,
    categoryRates: cleanCategoryRates,
  };
}

export const EUROPEAN_COUNTRY_CODES = new Set([
  "AT", "BE", "BG", "CY", "CZ", "DK", "EE", "ES", "FI", "FR", "GR", "HR",
  "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK",
  "CH", "NO", "IS", "LI", "MC", "AD", "SM", "VA", "AL", "BA", "ME", "MK", "RS", "TR", "UA", "MD", "XK"
]);

export const EU_COUNTRY_CODES = EUROPEAN_COUNTRY_CODES;

/**
 * Checks if a given country string or code represents a German address
 */
export function isGermanAddress(countryNameOrCode?: string): boolean {
  if (!countryNameOrCode) return false;
  const c = countryNameOrCode.toLowerCase().trim();
  return (
    c === "de" ||
    c === "deu" ||
    c === "germany" ||
    c === "deutschland" ||
    c.includes("deutschland") ||
    c.includes("germany")
  );
}

/**
 * Extracts a normalized 2-letter ISO country code from names, codes or compound descriptions
 */
export function extractCountryCode(countryNameOrCode?: string): string {
  if (!countryNameOrCode) return "DE";
  const str = countryNameOrCode.trim();
  const upper = str.toUpperCase();

  if (upper === "DE" || upper === "DEU" || upper === "GERMANY" || upper === "DEUTSCHLAND") return "DE";
  if (upper === "GB" || upper === "UK" || upper === "UNITED KINGDOM" || upper === "GROSSBRITANNIEN" || upper === "GROßBRITANNIEN") return "GB";
  if (upper === "US" || upper === "USA" || upper === "UNITED STATES") return "US";
  if (upper === "CA" || upper === "CAN" || upper === "CANADA" || upper === "KANADA") return "CA";

  if (str.length === 2) {
    return upper === "UK" ? "GB" : upper;
  }

  // 1. Exact match against SHIPPING_COUNTRIES
  const lower = str.toLowerCase();
  for (const sc of SHIPPING_COUNTRIES) {
    if (
      sc.code.toLowerCase() === lower ||
      sc.name.toLowerCase() === lower ||
      sc.germanName.toLowerCase() === lower ||
      (sc.localName && sc.localName.toLowerCase() === lower) ||
      `${sc.germanName.toLowerCase()} (${sc.name.toLowerCase()})` === lower ||
      `${sc.name.toLowerCase()} (${sc.code.toLowerCase()})` === lower
    ) {
      return sc.code === "UK" ? "GB" : sc.code;
    }
  }

  // 2. Exact match against COUNTRY_DICTIONARY
  for (const c of COUNTRY_DICTIONARY) {
    if (
      c.code.toLowerCase() === lower ||
      c.name.toLowerCase() === lower ||
      c.germanName.toLowerCase() === lower
    ) {
      return c.code === "UK" ? "GB" : c.code;
    }
  }

  // 3. Parentheses code match e.g. "Österreich (AT)" or "Großbritannien (UK)"
  const codeMatch = str.match(/\(([A-Z]{2})\)/i);
  if (codeMatch) {
    const matchedCode = codeMatch[1].toUpperCase();
    if (matchedCode === "UK") return "GB";
    if (SHIPPING_COUNTRIES.some(c => c.code === matchedCode) || COUNTRY_DICTIONARY.some(c => c.code === matchedCode)) {
      return matchedCode;
    }
  }

  // 4. Word boundary / inclusion match for main country names
  if (/\b(deutschland|germany)\b/i.test(str)) return "DE";
  if (/\b(united kingdom|großbritannien|grossbritannien|england|scotland|wales)\b/i.test(str)) return "GB";
  if (/\b(united states|usa)\b/i.test(str)) return "US";
  if (/\b(canada|kanada)\b/i.test(str)) return "CA";

  for (const sc of SHIPPING_COUNTRIES) {
    if (sc.code === "WORLD") continue;
    const sName = sc.name.toLowerCase();
    const sGer = sc.germanName.toLowerCase().replace(/\s*\([^)]*\)/, ""); // strip (UK), (USA)
    if (
      (sName.length >= 4 && lower.includes(sName)) ||
      (sGer.length >= 4 && lower.includes(sGer))
    ) {
      return sc.code === "UK" ? "GB" : sc.code;
    }
  }

  if (lower.includes("weltweit") || lower.includes("worldwide")) return "WORLD";

  return "WORLD";
}

export interface ShippingCartItem {
  id?: string;
  name?: string;
  categoryId?: string;
  category_id?: string;
  category?: string;
  quantity?: number;
  price?: number;
  shipping_rates?: Record<string, number>;
  productShippingRates?: Record<string, number>;
  product?: {
    id?: string;
    name?: string;
    category?: string;
    category_id?: string;
    shipping_rates?: Record<string, number>;
  };
}

export interface ShippingCalculationDetails {
  fee: number;
  baseFee: number;
  additionalItemFee: number;
  additionalItemsCount: number;
  isFree: boolean;
  zone: "germany" | "eu" | "international";
  courier: string;
  deliveryTime: string;
  appliedRule?: "product" | "city" | "category" | "country" | "zone";
  ruleDescription?: string;
  breakdown?: Array<{
    categoryName: string;
    categoryId: string;
    count: number;
    baseFee: number;
    additionalFee: number;
    total: number;
  }>;
}

/**
 * Normalizes category IDs and aliases across English, German and common variations
 */
export function normalizeShippingCategoryId(raw?: string): string {
  if (!raw) return "";
  const s = raw.toLowerCase().trim();
  if (
    s === "sicken" ||
    s === "surrounds" ||
    s === "surround" ||
    s === "schaumstoff-sicken" ||
    s === "gummi-sicken" ||
    s.includes("sicke") ||
    s.includes("surround")
  ) {
    return "sicken";
  }
  if (
    s === "diaphragmen" ||
    s === "diaphragms" ||
    s === "diaphragm" ||
    s === "titan-diaphragmen" ||
    s.includes("diaphragm")
  ) {
    return "diaphragmen";
  }
  if (
    s === "inlays" ||
    s === "inlay" ||
    s === "mikrofon-inlays" ||
    s === "sender-inlays" ||
    s === "koffer-inlays" ||
    s === "mikrofon inlays" ||
    s === "sender inlays" ||
    s === "koffer inlays" ||
    s === "foam inlays" ||
    s === "foam-inlays" ||
    s === "schaumstoffeinlagen" ||
    s === "schaumstoffeinlage"
  ) {
    return "inlays";
  }
  if (
    s === "klein-koffer-bag" ||
    s === "kleine-koffer-bag" ||
    s === "kleine koffer - bag" ||
    s === "kleine-koffer" ||
    s === "klein-koffer" ||
    s === "small-suitcase-bag" ||
    s === "small-suitcase" ||
    s === "small suitcase" ||
    s === "small suitcase - bag" ||
    s.includes("klein-koffer") ||
    s.includes("kleine koffer")
  ) {
    return "klein-koffer-bag";
  }
  if (
    s === "koffer" ||
    s === "cases" ||
    s === "case" ||
    s === "cases & inlays" ||
    s === "cases and inlays" ||
    s === "transportkoffer" ||
    s === "schutztaschen" ||
    s === "senderkoffer" ||
    s.includes("koffer") ||
    s.includes("case")
  ) {
    return "koffer";
  }
  if (
    s === "dust-caps" ||
    s === "dust caps" ||
    s === "dustcaps" ||
    s === "dustcap" ||
    s.includes("dust")
  ) {
    return "dust-caps";
  }
  if (
    s === "mikrofon-teile" ||
    s === "microphone parts" ||
    s === "microphone-parts" ||
    s.includes("mikrofon") ||
    s.includes("microphone")
  ) {
    return "mikrofon-teile";
  }
  if (
    s === "recone-kits" ||
    s === "recone kits" ||
    s === "recone-kit" ||
    s === "recone kit" ||
    s === "reconing" ||
    s.includes("recone")
  ) {
    return "recone-kits";
  }
  if (s === "used-parts" || s === "used parts") {
    return "used-parts";
  }
  if (s === "surround-repair" || s === "surround repair") {
    return "surround-repair";
  }
  return s;
}

interface ResolvedItemShipping {
  baseFee: number;
  additionalFee: number;
  courier: string;
  deliveryTime: string;
  appliedRule: "product" | "city" | "category" | "country" | "zone";
  ruleDescription: string;
  categoryId: string;
  categoryName: string;
  isFree: boolean;
}

function resolveSingleItemShipping(
  item: ShippingCartItem,
  code: string,
  isGerman: boolean,
  isEu: boolean,
  cityOrPostcode: string | undefined,
  settings: ShippingSettings,
  defaultZoneAdditionalFee: number,
  fallbackCourier: string,
  fallbackDeliveryTime: string,
  stateOrProvince?: string
): ResolvedItemShipping {
  // ── PRIORITY 1: Product-Specific Shipping Rates ──
  const pr = item.productShippingRates || item.shipping_rates || item.product?.shipping_rates;
  if (pr && typeof pr === "object") {
    let productRate: number | undefined = undefined;

    if (isGerman && (pr.de !== undefined || pr["DE"] !== undefined)) {
      productRate = pr.de !== undefined ? Number(pr.de) : Number(pr["DE"]);
    } else if (code === "GB" && (pr.gb !== undefined || pr["GB"] !== undefined)) {
      productRate = pr.gb !== undefined ? Number(pr.gb) : Number(pr["GB"]);
    } else if (code === "US" && (pr.us !== undefined || pr["US"] !== undefined)) {
      productRate = pr.us !== undefined ? Number(pr.us) : Number(pr["US"]);
    } else if (code === "CA" && (pr.ca !== undefined || pr["CA"] !== undefined)) {
      productRate = pr.ca !== undefined ? Number(pr.ca) : Number(pr["CA"]);
    } else if (isEu && (pr.eu !== undefined || pr["EU"] !== undefined)) {
      productRate = pr.eu !== undefined ? Number(pr.eu) : Number(pr["EU"]);
    } else if (pr[code] !== undefined) {
      productRate = Number(pr[code]);
    } else if (pr.intl !== undefined || pr.world !== undefined) {
      productRate = pr.intl !== undefined ? Number(pr.intl) : Number(pr.world);
    }

    if (productRate !== undefined && !isNaN(productRate)) {
      const addFee = pr.additionalItemFee !== undefined ? Number(pr.additionalItemFee) : defaultZoneAdditionalFee;
      const baseFee = Math.max(0, productRate);
      return {
        baseFee,
        additionalFee: Math.max(0, addFee),
        courier: fallbackCourier,
        deliveryTime: fallbackDeliveryTime,
        appliedRule: "product",
        ruleDescription: "Produktspezifischer Tarif",
        categoryId: "product",
        categoryName: item.name || "Produkt",
        isFree: baseFee === 0,
      };
    }
  }

  // ── PRIORITY 2: City or Postal Code Override ──
  if (cityOrPostcode && settings.cityRates && settings.cityRates.length > 0) {
    const query = cityOrPostcode.trim().toLowerCase();
    if (query.length > 0) {
      const matchedCity = settings.cityRates.find((cr) => {
        if (cr.countryCode && cr.countryCode.toUpperCase() !== code) return false;

        const cityName = (cr.cityName || "").trim().toLowerCase();
        const postCode = (cr.postalCode || "").trim().toLowerCase();

        const nameMatch =
          cityName &&
          (query === cityName ||
            (cityName.length >= 3 && new RegExp(`\\b${cityName}\\b`, "i").test(query)));
        const postMatch = postCode && (query === postCode || query.startsWith(postCode));

        return Boolean(nameMatch || postMatch);
      });

      if (matchedCity && !isNaN(Number(matchedCity.fee))) {
        const baseFee = Math.max(0, Number(matchedCity.fee));
        const addFee = defaultZoneAdditionalFee;
        return {
          baseFee,
          additionalFee: addFee,
          courier: matchedCity.courier || fallbackCourier,
          deliveryTime: matchedCity.deliveryTime || fallbackDeliveryTime,
          appliedRule: "city",
          ruleDescription: `Sondertarif für ${matchedCity.cityName || matchedCity.postalCode}`,
          categoryId: "city",
          categoryName: matchedCity.cityName || "City",
          isFree: baseFee === 0,
        };
      }
    }
  }

  // ── PRIORITY 3: Category-Specific Rate ──
  let rawCat = (
    item.categoryId ||
    item.category_id ||
    item.category ||
    item.product?.category_id ||
    item.product?.category ||
    ""
  ).trim();

  // If item or cart line has no category field, infer from product title
  if (!rawCat && (item.name || item.product?.name)) {
    const itemName = (item.name || item.product?.name || "").toLowerCase();
    if (itemName.includes("inlay") || itemName.includes("einlage") || itemName.includes("einlagen")) {
      rawCat = "inlays";
    } else if (
      itemName.includes("klein-koffer") ||
      itemName.includes("kleine koffer") ||
      itemName.includes("small suitcase")
    ) {
      rawCat = "klein-koffer-bag";
    } else if (
      itemName.includes("koffer") ||
      itemName.includes("case") ||
      itemName.includes("tasche")
    ) {
      rawCat = "koffer";
    } else if (itemName.includes("recone")) {
      rawCat = "recone-kits";
    }
  }

  const normalizedCatId = normalizeShippingCategoryId(rawCat);
  const rawCatLower = rawCat.toLowerCase();
  const rawCatSlug = rawCatLower.replace(/\s+/g, "-");
  const rawCatSanitized = rawCatLower.replace(/[^a-z0-9]/g, "");

  if (settings.categoryRates && (normalizedCatId || rawCatLower)) {
    const catRateEntry =
      settings.categoryRates[rawCatSlug] ||
      settings.categoryRates[rawCatLower] ||
      (normalizedCatId ? settings.categoryRates[normalizedCatId] : undefined) ||
      (normalizedCatId === "klein-koffer-bag" ? settings.categoryRates["koffer"] : undefined) ||
      Object.values(settings.categoryRates).find((c) => {
        const cId = c.categoryId?.toLowerCase() || "";
        const cName = c.categoryName?.toLowerCase() || "";
        const cIdSanitized = cId.replace(/[^a-z0-9]/g, "");
        const cNameSanitized = cName.replace(/[^a-z0-9]/g, "");
        return (
          cId === rawCatSlug ||
          cName.replace(/\s+/g, "-") === rawCatSlug ||
          cId === rawCatLower ||
          cName === rawCatLower ||
          (normalizedCatId && (cId === normalizedCatId || cName === normalizedCatId)) ||
          (rawCatSanitized && (cIdSanitized === rawCatSanitized || cNameSanitized === rawCatSanitized))
        );
      });

    if (catRateEntry) {
      let fee: number | undefined = undefined;
      let additionalItemFee: number | undefined = undefined;
      let matchedStateName: string | undefined = undefined;
      let stateDeliveryTime: string | undefined = undefined;

      // 1. Check State / Province override for US or CA
      if ((code === "US" || code === "CA") && catRateEntry.stateRates) {
        let stateItem = stateOrProvince ? findStateOrProvince(stateOrProvince, code) : null;
        if (!stateItem && cityOrPostcode) {
          stateItem = findStateOrProvince(cityOrPostcode, code);
        }
        if (stateItem) {
          const sRate =
            catRateEntry.stateRates[stateItem.id] ??
            catRateEntry.stateRates[stateItem.code];
          if (sRate !== undefined && !isNaN(Number(sRate))) {
            fee = Number(sRate);
            matchedStateName = stateItem.name;
            stateDeliveryTime =
              catRateEntry.stateDeliveryTimes?.[stateItem.id] ??
              catRateEntry.stateDeliveryTimes?.[stateItem.code];
          }
          const sAddRate =
            catRateEntry.stateAdditionalFees?.[stateItem.id] ??
            catRateEntry.stateAdditionalFees?.[stateItem.code];
          if (sAddRate !== undefined && !isNaN(Number(sAddRate))) {
            additionalItemFee = Number(sAddRate);
          }
        }
      }

      // 2. Direct country rate override for this category
      if (fee === undefined) {
        if (isGerman) {
          if (catRateEntry.countryRates && catRateEntry.countryRates["DE"] !== undefined) {
            fee = Number(catRateEntry.countryRates["DE"]);
          } else if (catRateEntry.deFee !== undefined) {
            fee = Number(catRateEntry.deFee);
          }
        } else if (code === "GB") {
          if (catRateEntry.countryRates && catRateEntry.countryRates["GB"] !== undefined) {
            fee = Number(catRateEntry.countryRates["GB"]);
          } else if (catRateEntry.gbFee !== undefined) {
            fee = Number(catRateEntry.gbFee);
          }
        } else if (code === "US") {
          if (catRateEntry.countryRates && catRateEntry.countryRates["US"] !== undefined) {
            fee = Number(catRateEntry.countryRates["US"]);
          } else if (catRateEntry.usFee !== undefined) {
            fee = Number(catRateEntry.usFee);
          }
        } else if (code === "CA") {
          if (catRateEntry.countryRates && catRateEntry.countryRates["CA"] !== undefined) {
            fee = Number(catRateEntry.countryRates["CA"]);
          } else if (catRateEntry.caFee !== undefined) {
            fee = Number(catRateEntry.caFee);
          }
        } else if (catRateEntry.countryRates && catRateEntry.countryRates[code] !== undefined) {
          fee = Number(catRateEntry.countryRates[code]);
        } else if (isEu && catRateEntry.euFee !== undefined) {
          fee = Number(catRateEntry.euFee);
        } else if (catRateEntry.intlFee !== undefined) {
          fee = Number(catRateEntry.intlFee);
        }
      }

      // 3. Resolve additional item fee if not yet set by state
      if (additionalItemFee === undefined) {
        if (isGerman) {
          if (catRateEntry.countryAdditionalFees && catRateEntry.countryAdditionalFees["DE"] !== undefined) {
            additionalItemFee = Number(catRateEntry.countryAdditionalFees["DE"]);
          } else if (catRateEntry.deAdditionalFee !== undefined) {
            additionalItemFee = Number(catRateEntry.deAdditionalFee);
          }
        } else if (code === "GB") {
          if (catRateEntry.countryAdditionalFees && catRateEntry.countryAdditionalFees["GB"] !== undefined) {
            additionalItemFee = Number(catRateEntry.countryAdditionalFees["GB"]);
          } else if (catRateEntry.gbAdditionalFee !== undefined) {
            additionalItemFee = Number(catRateEntry.gbAdditionalFee);
          }
        } else if (code === "US") {
          if (catRateEntry.countryAdditionalFees && catRateEntry.countryAdditionalFees["US"] !== undefined) {
            additionalItemFee = Number(catRateEntry.countryAdditionalFees["US"]);
          } else if (catRateEntry.usAdditionalFee !== undefined) {
            additionalItemFee = Number(catRateEntry.usAdditionalFee);
          }
        } else if (code === "CA") {
          if (catRateEntry.countryAdditionalFees && catRateEntry.countryAdditionalFees["CA"] !== undefined) {
            additionalItemFee = Number(catRateEntry.countryAdditionalFees["CA"]);
          } else if (catRateEntry.caAdditionalFee !== undefined) {
            additionalItemFee = Number(catRateEntry.caAdditionalFee);
          }
        } else if (catRateEntry.countryAdditionalFees && catRateEntry.countryAdditionalFees[code] !== undefined) {
          additionalItemFee = Number(catRateEntry.countryAdditionalFees[code]);
        } else if (isEu && catRateEntry.euAdditionalFee !== undefined) {
          additionalItemFee = Number(catRateEntry.euAdditionalFee);
        } else if (catRateEntry.intlAdditionalFee !== undefined) {
          additionalItemFee = Number(catRateEntry.intlAdditionalFee);
        } else if (catRateEntry.additionalItemFee !== undefined) {
          additionalItemFee = Number(catRateEntry.additionalItemFee);
        }
      }

      const deliveryTime =
        stateDeliveryTime ||
        (isGerman ? catRateEntry.countryDeliveryTimes?.["DE"] : undefined) ||
        (catRateEntry.countryDeliveryTimes && catRateEntry.countryDeliveryTimes[code]) ||
        catRateEntry.deliveryTime ||
        fallbackDeliveryTime;

      if (fee !== undefined && !isNaN(fee)) {
        const resolvedAddFee = Math.max(0, additionalItemFee ?? defaultZoneAdditionalFee);
        const baseFee = Math.max(0, fee);
        return {
          baseFee,
          additionalFee: resolvedAddFee,
          courier: fallbackCourier,
          deliveryTime,
          appliedRule: "category",
          ruleDescription: matchedStateName
            ? `Kategorie-Tarif (${matchedStateName})`
            : `Kategorie-Tarif (${catRateEntry.categoryName || normalizedCatId})`,
          categoryId: catRateEntry.categoryId || normalizedCatId,
          categoryName: catRateEntry.categoryName || normalizedCatId,
          isFree: baseFee === 0,
        };
      }
    }
  }

  // ── PRIORITY 4: Germany Domestic Rule ──
  if (isGerman) {
    if (settings.germanyFreeShipping) {
      return {
        baseFee: 0,
        additionalFee: 0,
        courier: fallbackCourier,
        deliveryTime: fallbackDeliveryTime,
        appliedRule: "zone",
        ruleDescription: "Kostenlose Inlandslieferung (DE)",
        categoryId: "domestic",
        categoryName: "Deutschland",
        isFree: true,
      };
    }
    const baseFee = Number(settings.germanyShippingFee) || 0;
    const addFee = settings.germanyAdditionalFee ?? 0;
    return {
      baseFee,
      additionalFee: addFee,
      courier: fallbackCourier,
      deliveryTime: fallbackDeliveryTime,
      appliedRule: "zone",
      ruleDescription: "Standardtarif Deutschland",
      categoryId: "domestic",
      categoryName: "Deutschland",
      isFree: baseFee === 0,
    };
  }

  // ── PRIORITY 5: Country-Specific Override in Settings ──
  if (
    settings.countryRates &&
    settings.countryRates[code] !== undefined &&
    settings.countryRates[code] !== null &&
    !isNaN(Number(settings.countryRates[code]))
  ) {
    const baseFee = Math.max(0, Number(settings.countryRates[code]));
    const addFee = settings.countryAdditionalFees?.[code] ?? defaultZoneAdditionalFee;
    return {
      baseFee,
      additionalFee: addFee,
      courier: fallbackCourier,
      deliveryTime: fallbackDeliveryTime,
      appliedRule: "country",
      ruleDescription: `Ländertarif für ${code}`,
      categoryId: code,
      categoryName: code,
      isFree: baseFee === 0,
    };
  }

  // ── PRIORITY 6: European Union Default ──
  if (isEu) {
    const baseFee = Number(settings.euShippingFee) || 9.95;
    const addFee = settings.euAdditionalFee ?? 2.00;
    return {
      baseFee,
      additionalFee: addFee,
      courier: settings.euCourier || "DHL Paket Europe",
      deliveryTime: settings.euDeliveryTime || "1-2 weeks",
      appliedRule: "zone",
      ruleDescription: "EU-Standardtarif",
      categoryId: "eu",
      categoryName: "Europa",
      isFree: baseFee === 0,
    };
  }

  // ── PRIORITY 7: Rest of World Default ──
  const baseFee = Number(settings.internationalShippingFee) || 14.95;
  const addFee = settings.internationalAdditionalFee ?? 3.00;
  return {
    baseFee,
    additionalFee: addFee,
    courier: settings.internationalCourier || "DHL Paket Worldwide",
    deliveryTime: fallbackDeliveryTime,
    appliedRule: "zone",
    ruleDescription: "Internationaler Standardtarif",
    categoryId: "international",
    categoryName: "International",
    isFree: baseFee === 0,
  };
}

/**
 * Calculates shipping fee for a customer address using admin-configured rates
 * Supports product overrides, city/postcode overrides, category overrides, country overrides, and zone defaults.
 * Accurately implements dynamic multi-item and multi-category shipping charges:
 * - Case 1: Multiple products from the same category increase by configured Other Items rate
 * - Case 2: Products from different categories account for the category with higher applicable default shipping rate
 *           and apply configured higher additional-item shipping rates without double-charging
 * - Case 3: Seamlessly extends to 3, 4, 5+ products across any number of categories
 */
export function calculateShippingFee(
  countryNameOrCode: string | undefined,
  settings: ShippingSettings = DEFAULT_SHIPPING_SETTINGS,
  options?: {
    cityOrPostcode?: string;
    stateOrProvince?: string;
    categoryId?: string;
    productShippingRates?: Record<string, number>;
    quantity?: number;
    items?: ShippingCartItem[];
  }
): ShippingCalculationDetails {
  const code = extractCountryCode(countryNameOrCode);
  const isGerman = code === "DE" || isGermanAddress(countryNameOrCode);
  const isEu = EU_COUNTRY_CODES.has(code);

  const fallbackCourier = isGerman
    ? (settings.germanyCourier || "DHL Paket / Deutsche Post")
    : isEu
    ? (settings.euCourier || "DHL Paket Europe")
    : (settings.internationalCourier || "DHL Paket Worldwide");

  const fallbackDeliveryTime = isGerman
    ? (settings.germanyDeliveryTime || "Within 1 week")
    : isEu
    ? (settings.euDeliveryTime || "1-2 weeks")
    : code === "GB"
    ? "1-2 weeks"
    : code === "US"
    ? "2-3 weeks"
    : code === "CA"
    ? "2-3 weeks"
    : (settings.internationalDeliveryTime || "2-4 weeks");

  const defaultZoneAdditionalFee = isGerman
    ? (settings.germanyAdditionalFee ?? 0)
    : isEu
    ? (settings.euAdditionalFee ?? 2.00)
    : code === "GB"
    ? (settings.countryAdditionalFees?.["GB"] ?? 2.00)
    : code === "US" || code === "CA"
    ? (settings.countryAdditionalFees?.[code] ?? 3.00)
    : (settings.internationalAdditionalFee ?? 3.00);

  // Normalize items input
  const rawItems = (options?.items !== undefined && Array.isArray(options.items))
    ? options.items
    : (options?.categoryId || options?.productShippingRates || options?.quantity !== undefined)
    ? [
        {
          categoryId: options?.categoryId,
          productShippingRates: options?.productShippingRates,
          quantity: Math.max(1, Number(options?.quantity) || 1),
        },
      ]
    : [];

  // Resolve each item and expand by quantity into individual units
  const units: ResolvedItemShipping[] = [];
  for (const item of rawItems) {
    const resolved = resolveSingleItemShipping(
      item,
      code,
      isGerman,
      isEu,
      options?.cityOrPostcode,
      settings,
      defaultZoneAdditionalFee,
      fallbackCourier,
      fallbackDeliveryTime,
      options?.stateOrProvince
    );
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    for (let q = 0; q < qty; q++) {
      units.push(resolved);
    }
  }

  const totalQuantity = units.length;
  if (totalQuantity === 0) {
    return {
      fee: 0,
      baseFee: 0,
      additionalItemFee: 0,
      additionalItemsCount: 0,
      isFree: true,
      zone: isGerman ? "germany" : isEu ? "eu" : "international",
      courier: fallbackCourier,
      deliveryTime: fallbackDeliveryTime,
    };
  }

  // ── Step 1: Identify dominant primary unit with HIGHEST applicable base shipping rate ──
  let primaryIndex = 0;
  let maxBaseFee = -1;
  let maxAddFeeForTie = -1;

  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    if (u.baseFee > maxBaseFee) {
      maxBaseFee = u.baseFee;
      maxAddFeeForTie = u.additionalFee;
      primaryIndex = i;
    } else if (u.baseFee === maxBaseFee && u.additionalFee > maxAddFeeForTie) {
      maxAddFeeForTie = u.additionalFee;
      primaryIndex = i;
    }
  }

  const primaryUnit = units[primaryIndex];
  const baseFee = Math.max(0, primaryUnit.baseFee);
  const additionalUnits = units.filter((_, idx) => idx !== primaryIndex);
  const extraItemsCount = additionalUnits.length;

  if (extraItemsCount === 0) {
    return {
      fee: baseFee,
      baseFee,
      additionalItemFee: primaryUnit.additionalFee,
      additionalItemsCount: 0,
      isFree: baseFee === 0,
      zone: isGerman ? "germany" : isEu ? "eu" : "international",
      courier: primaryUnit.courier,
      deliveryTime: primaryUnit.deliveryTime,
      appliedRule: primaryUnit.appliedRule,
      ruleDescription: primaryUnit.ruleDescription,
    };
  }

  // ── Step 2: Calculate additional items across same and different categories ──
  // For each additional unit:
  // - If same category as dominant unit: apply category's configured additional-item fee
  // - If different category: apply the greater applicable additional-item fee Math.max(unit.additionalFee, primaryUnit.additionalFee)
  //   ensuring higher rates take effect rather than simply adding the cheapest rate or ignoring the new category.
  let totalAdditionalFee = 0;
  for (const u of additionalUnits) {
    const isSameCategory = Boolean(
      u.categoryId && primaryUnit.categoryId && u.categoryId === primaryUnit.categoryId
    );
    const unitRate = isSameCategory
      ? u.additionalFee
      : Math.max(u.additionalFee, primaryUnit.additionalFee);
    totalAdditionalFee += Math.max(0, unitRate);
  }

  const totalFee = Math.max(0, Number((baseFee + totalAdditionalFee).toFixed(2)));
  const effectiveAdditionalFee = extraItemsCount > 0
    ? Number((totalAdditionalFee / extraItemsCount).toFixed(2))
    : primaryUnit.additionalFee;

  // Build descriptive rule summary
  const distinctCategories = Array.from(new Set(units.map((u) => u.categoryName).filter(Boolean)));
  const ruleDesc =
    distinctCategories.length > 1
      ? `Kombinierter Kategorie-Tarif (${distinctCategories.join(" & ")})`
      : primaryUnit.ruleDescription;

  return {
    fee: totalFee,
    baseFee,
    additionalItemFee: effectiveAdditionalFee,
    additionalItemsCount: extraItemsCount,
    isFree: totalFee === 0,
    zone: isGerman ? "germany" : isEu ? "eu" : "international",
    courier: primaryUnit.courier,
    deliveryTime: primaryUnit.deliveryTime,
    appliedRule: primaryUnit.appliedRule,
    ruleDescription: ruleDesc,
  };
}

/**
 * Translates delivery time string into the user's selected language
 */
export function formatDeliveryTime(deliveryTime?: string, language: string = "de"): string {
  if (!deliveryTime) return "";
  const lang = (language || "de").toLowerCase();
  if (lang === "en") {
    return deliveryTime
      .replace(/Werktage/gi, "business days")
      .replace(/Werktag/gi, "business day")
      .replace(/Deutschland/gi, "Germany")
      .replace(/Europäische Union/gi, "European Union")
      .replace(/Innerhalb (von )?1 Woche/gi, "Within 1 week")
      .replace(/Wochen/gi, "weeks")
      .replace(/Woche/gi, "week");
  }
  if (lang === "el") {
    return deliveryTime
      .replace(/Werktage/gi, "εργάσιμες ημέρες")
      .replace(/Werktag/gi, "εργάσιμη ημέρα")
      .replace(/Deutschland/gi, "Γερμανία")
      .replace(/Europäische Union/gi, "Ευρωπαϊκή Ένωση")
      .replace(/Within 1 week/gi, "Εντός 1 εβδομάδας")
      .replace(/Innerhalb (von )?1 Woche/gi, "Εντός 1 εβδομάδας")
      .replace(/weeks/gi, "εβδομάδες")
      .replace(/week/gi, "εβδομάδα")
      .replace(/Wochen/gi, "εβδομάδες")
      .replace(/Woche/gi, "εβδομάδα");
  }
  if (lang === "de") {
    return deliveryTime
      .replace(/Within 1 week/gi, "Innerhalb 1 Woche")
      .replace(/weeks/gi, "Wochen")
      .replace(/week/gi, "Woche");
  }
  return deliveryTime;
}

