"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  Globe,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Layers,
  MapPin,
  Truck,
  Building2,
  Box,
  Sliders,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Zap,
  RotateCcw,
} from "lucide-react";
import {
  DEFAULT_SHIPPING_SETTINGS,
  ShippingSettings,
  EU_COUNTRY_CODES,
  CategoryShippingRate,
  CityShippingRate,
  compactShippingSettings,
} from "@/utils/shipping";
import { COUNTRIES, Country } from "@/data/countries";
import { CATEGORIES, Category } from "@/data/categories";
import {
  US_STATES,
  CA_PROVINCES,
  SHIPPING_COUNTRIES,
  ShippingCountryItem,
} from "@/data/regionsData";
export { SHIPPING_COUNTRIES };
export type { ShippingCountryItem };
import { notifyAdmin } from "./AdminToast";
import { invalidateShippingCache } from "@/lib/clientShippingCache";
import { safeSetLocalStorage, safeSetSessionStorage } from "@/lib/safeStorage";

export const DELIVERY_TIME_OPTIONS = [
  { value: "Within 1 week", label: "Innerhalb 1 Woche (Within 1 week)" },
  { value: "1-2 weeks", label: "1-2 Wochen (1-2 weeks)" },
  { value: "2-3 weeks", label: "2-3 Wochen (2-3 weeks)" },
  { value: "3-4 weeks", label: "3-4 Wochen (3-4 weeks)" },
  { value: "4-5 weeks", label: "4-5 Wochen (4-5 weeks)" },
  { value: "5-6 weeks", label: "5-6 Wochen (5-6 weeks)" },
  { value: "6-8 weeks", label: "6-8 Wochen (6-8 weeks)" },
  { value: "1-2 Werktage", label: "1-2 Werktage (1-2 days)" },
  { value: "2-4 Werktage", label: "2-4 Werktage (2-4 days)" },
  { value: "3-5 Werktage", label: "3-5 Werktage (3-5 days)" },
  { value: "4-7 Werktage", label: "4-7 Werktage (4-7 days)" },
  { value: "4-8 Werktage", label: "4-8 Werktage (4-8 days)" },
];

export function normalizeDeliveryTimeOption(val?: string): string {
  if (!val) return "1-2 weeks";
  const trimmed = val.trim();
  if (/^within 1 week$/i.test(trimmed) || /^innerhalb (von )?1 woche$/i.test(trimmed)) {
    return "Within 1 week";
  }
  const weekMatch = trimmed.match(/^(\d+)[-–](\d+)\s*(wochen|weeks)$/i);
  if (weekMatch) {
    return `${weekMatch[1]}-${weekMatch[2]} weeks`;
  }
  return trimmed;
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE RATE INPUT FIELD
// - Auto-selects on click / focus so data is instantly ready to edit
// - Can be completely deleted / blanked while typing without resetting prematurely
// - Shows clear visual indicator when blank (≥ 0 required)
// - Hover effect indicates ready-to-edit state
// ─────────────────────────────────────────────────────────────────────────────
interface ShippingRateInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  unit?: string;
  min?: number;
}

export function ShippingRateInput({
  value,
  onChange,
  placeholder = "0.00",
  className = "w-24",
  inputClassName = "",
  disabled = false,
  unit = "€",
  min = 0,
}: ShippingRateInputProps) {
  const isBlank = typeof value === "string" ? value.trim() === "" : value === undefined || value === null;
  const num = Number(value);
  const isInvalid = isBlank || isNaN(num) || num < min;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    if (parts.length > 2) {
      clean = parts[0] + "." + parts.slice(1).join("");
    }
    onChange(clean);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).select();
  };

  return (
    <div
      className={`group/rate-input relative flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-all cursor-text border ${
        isBlank
          ? "bg-amber-50/70 border-amber-400 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-400/20"
          : isInvalid
          ? "bg-red-50/70 border-red-400 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-400/20"
          : "bg-white hover:bg-neutral-50/80 border-neutral-300 hover:border-black focus-within:border-black focus-within:ring-1 focus-within:ring-black/10"
      } ${className}`}
      title={
        isBlank
          ? "Feld ist leer — Wert ≥ 0 erforderlich"
          : isInvalid
          ? "Ungültiger Wert (muss ≥ 0 sein)"
          : "Klicken zum Bearbeiten (Wert ≥ 0)"
      }
      onClick={(e) => {
        const input = e.currentTarget.querySelector("input");
        if (input && document.activeElement !== input) {
          input.focus();
          input.select();
        }
      }}
    >
      <input
        type="text"
        inputMode="decimal"
        value={value ?? ""}
        onChange={handleChange}
        onFocus={handleFocus}
        onClick={handleClick}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full text-xs font-heading font-black text-right outline-none bg-transparent transition-colors ${
          isBlank
            ? "placeholder:text-amber-400 text-amber-900"
            : isInvalid
            ? "text-red-700"
            : "text-black placeholder:text-neutral-400"
        } ${inputClassName}`}
      />
      {unit && (
        <span
          className={`text-xs font-bold select-none transition-colors ${
            isBlank
              ? "text-amber-600"
              : isInvalid
              ? "text-red-500"
              : "text-neutral-500 group-hover/rate-input:text-neutral-900"
          }`}
        >
          {unit}
        </span>
      )}
      {isBlank && (
        <span className="absolute -top-2 right-1 text-[8px] font-mono font-bold px-1 rounded bg-amber-500 text-white shadow-2xs select-none">
          ≥ 0
        </span>
      )}
    </div>
  );
}

export default function ShippingTab({ categories: propCategories }: { categories?: any[] } = {}) {
  const [settings, setSettings] = useState<ShippingSettings>(DEFAULT_SHIPPING_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active top-level subtab: "categories" | "cities" | "general"
  const [activeMainView, setActiveMainView] = useState<"categories" | "cities" | "general">("categories");

  // Selected category for the Category Shipping Rates Fixer View
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Category search filter in main view
  const [categorySearchQuery, setCategorySearchQuery] = useState("");

  // Main Region Group in Category Rates Fixer View:
  // EU (all 42 countries), US (all 50 states), CA (all 13 provinces), DE (Inland), GB (UK)
  const [activeRegionGroup, setActiveRegionGroup] = useState<"EU" | "US" | "CA" | "DE" | "GB">("EU");
  const [regionSearchQuery, setRegionSearchQuery] = useState("");

  // Bulk rate apply form for Europe in Category Fixer View
  const [bulkEuFee, setBulkEuFee] = useState("9.95");
  const [bulkEuAdditionalFee, setBulkEuAdditionalFee] = useState("2.00");
  const [bulkEuDeliveryTime, setBulkEuDeliveryTime] = useState("1-2 weeks");

  // Bulk rate apply form for USA in Category Fixer View
  const [bulkUsFee, setBulkUsFee] = useState("18.00");
  const [bulkUsAdditionalFee, setBulkUsAdditionalFee] = useState("3.00");
  const [bulkUsDeliveryTime, setBulkUsDeliveryTime] = useState("2-3 weeks");

  // Bulk rate apply form for Canada in Category Fixer View
  const [bulkCaFee, setBulkCaFee] = useState("19.95");
  const [bulkCaAdditionalFee, setBulkCaAdditionalFee] = useState("3.00");
  const [bulkCaDeliveryTime, setBulkCaDeliveryTime] = useState("2-3 weeks");

  // City rates state
  const [newCityCountry, setNewCityCountry] = useState("DE");
  const [newCityName, setNewCityName] = useState("");
  const [newCityPostcode, setNewCityPostcode] = useState("");
  const [newCityFee, setNewCityFee] = useState("0.00");
  const [newCityDeliveryTime, setNewCityDeliveryTime] = useState("Within 1 week");
  const [newCityCourier, setNewCityCourier] = useState("DHL Paket / Deutsche Post");

  // Dynamic categories list
  const [categoryList, setCategoryList] = useState<Category[]>(() => {
    if (propCategories && propCategories.length > 0) {
      return propCategories.filter((c: any) => !c.deleted && !c.is_hidden && c.id !== "all-parts" && c.id !== "specials" && !c.isVirtual);
    }
    return [...CATEGORIES].filter((c: any) => !c.deleted && !c.is_hidden && c.id !== "all-parts" && c.id !== "specials" && !c.isVirtual);
  });

  // Sync propCategories changes into categoryList
  useEffect(() => {
    if (propCategories && Array.isArray(propCategories)) {
      setCategoryList(
        propCategories.filter(
          (c: any) => !c.deleted && !c.is_hidden && c.id !== "all-parts" && c.id !== "specials" && !c.isVirtual
        )
      );
    }
  }, [propCategories]);

  // Draft inputs map: preserves user typing, allows backspacing to blank, blocks save if empty
  const [rateDrafts, setRateDrafts] = useState<Record<string, string>>({});

  const getDraftRate = (key: string, fallback: number | string): string => {
    if (rateDrafts[key] !== undefined) {
      return rateDrafts[key];
    }
    return fallback !== undefined && fallback !== null ? String(fallback) : "0.00";
  };

  const setDraftRate = (key: string, val: string) => {
    setRateDrafts((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const hasInvalidDrafts = useMemo(() => {
    return Object.values(rateDrafts).some((v) => typeof v === "string" && (v.trim() === "" || isNaN(Number(v)) || Number(v) < 0));
  }, [rateDrafts]);

  // Load fresh settings from API
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/shipping-settings?t=" + Date.now());
        const data = await res.json();
        if (isMounted && data) {
          setSettings({
            ...DEFAULT_SHIPPING_SETTINGS,
            ...data,
            countryRates: data.countryRates !== undefined && data.countryRates !== null ? data.countryRates : {},
            categoryRates:
              data.categoryRates !== undefined && data.categoryRates !== null
                ? data.categoryRates
                : DEFAULT_SHIPPING_SETTINGS.categoryRates,
            cityRates: Array.isArray(data.cityRates) ? data.cityRates : DEFAULT_SHIPPING_SETTINGS.cityRates || [],
          });
        }
      } catch (err) {
        console.error("Failed to load shipping settings:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSettings();

    // Fetch dynamic categories
    const refreshCategories = () => {
      fetch("/api/categories?t=" + Date.now())
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setCategoryList((prev) => {
              const merged = [...prev];
              data.forEach((cat: any) => {
                const idx = merged.findIndex((c) => c.id === cat.id || c.slug === cat.slug);
                if (idx !== -1) {
                  merged[idx] = { ...merged[idx], ...cat };
                } else {
                  merged.push(cat);
                }
              });
              return merged;
            });
          }
        })
        .catch(() => {});
    };

    refreshCategories();

    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("ixos_categories_sync");
        bc.onmessage = () => refreshCategories();
      }
    } catch {}

    const handleCatUpdate = () => refreshCategories();
    window.addEventListener("ixos_categories_updated", handleCatUpdate);

    return () => {
      isMounted = false;
      try { bc?.close(); } catch {}
      window.removeEventListener("ixos_categories_updated", handleCatUpdate);
    };
  }, []);

  // Save changes to API
  const handleSave = async (updatedSettings?: ShippingSettings) => {
    // 1. Strict validation: no rate field can be blank or negative
    for (const [key, rawVal] of Object.entries(rateDrafts)) {
      if (typeof rawVal === "string" && rawVal.trim() === "") {
        notifyAdmin(
          "error",
          "Versandtarif darf nicht leer sein",
          "Ein oder mehrere Versandtarife sind leer. Bitte geben Sie einen Wert von 0 oder höher ein (z. B. 0.00 für kostenlosen Versand)."
        );
        return;
      }
      const num = Number(rawVal);
      if (isNaN(num) || num < 0) {
        notifyAdmin(
          "error",
          "Ungültiger Versandtarif",
          "Versandtarife müssen 0 oder höher sein (z. B. 0.00)."
        );
        return;
      }
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      // 2. Merge all active draft rates into the working copy
      const workingBase: ShippingSettings = JSON.parse(JSON.stringify(updatedSettings || settings));

      for (const [key, val] of Object.entries(rateDrafts)) {
        const num = Math.max(0, parseFloat(val) || 0);

        if (key.startsWith("cat:")) {
          const parts = key.split(":");
          const catId = parts[1];
          const type = parts[2];

          if (!workingBase.categoryRates) workingBase.categoryRates = {};
          if (!workingBase.categoryRates[catId]) {
            workingBase.categoryRates[catId] = getCategoryRate(catId);
          }
          const cr = workingBase.categoryRates[catId];

          if (type === "country") {
            const cCode = parts[3];
            const field = parts[4];
            if (field === "fee") {
              if (!cr.countryRates) cr.countryRates = {};
              cr.countryRates[cCode] = num;
              if (cCode === "DE") cr.deFee = num;
              if (cCode === "GB") cr.gbFee = num;
              if (cCode === "US") cr.usFee = num;
              if (cCode === "CA") cr.caFee = num;
            } else if (field === "addFee") {
              if (!cr.countryAdditionalFees) cr.countryAdditionalFees = {};
              cr.countryAdditionalFees[cCode] = num;
              if (cCode === "DE") cr.deAdditionalFee = num;
              if (cCode === "GB") cr.gbAdditionalFee = num;
              if (cCode === "US") cr.usAdditionalFee = num;
              if (cCode === "CA") cr.caAdditionalFee = num;
            }
          } else if (type === "state" || type === "prov") {
            const sId = parts[3];
            const field = parts[4];
            if (field === "fee") {
              if (!cr.stateRates) cr.stateRates = {};
              cr.stateRates[sId] = num;
            } else if (field === "addFee") {
              if (!cr.stateAdditionalFees) cr.stateAdditionalFees = {};
              cr.stateAdditionalFees[sId] = num;
            }
          } else if (type === "DE") {
            const field = parts[3];
            if (field === "fee") {
              cr.deFee = num;
              if (!cr.countryRates) cr.countryRates = {};
              cr.countryRates["DE"] = num;
            } else if (field === "addFee") {
              cr.deAdditionalFee = num;
              if (!cr.countryAdditionalFees) cr.countryAdditionalFees = {};
              cr.countryAdditionalFees["DE"] = num;
            }
          } else if (type === "GB") {
            const field = parts[3];
            if (field === "fee") {
              cr.gbFee = num;
              if (!cr.countryRates) cr.countryRates = {};
              cr.countryRates["GB"] = num;
            } else if (field === "addFee") {
              cr.gbAdditionalFee = num;
              if (!cr.countryAdditionalFees) cr.countryAdditionalFees = {};
              cr.countryAdditionalFees["GB"] = num;
            }
          }
        } else if (key.startsWith("general:")) {
          const field = key.replace("general:", "") as keyof ShippingSettings;
          (workingBase as any)[field] = num;
        }
      }

      const rawPayload: ShippingSettings = {
        ...workingBase,
        germanyShippingFee: Number(workingBase.germanyShippingFee) || 0,
        germanyAdditionalFee: Number(workingBase.germanyAdditionalFee) || 0,
        euShippingFee: parseFloat(String(workingBase.euShippingFee)) || 9.95,
        euAdditionalFee: parseFloat(String(workingBase.euAdditionalFee)) || 2.00,
        internationalShippingFee: parseFloat(String(workingBase.internationalShippingFee)) || 14.95,
        internationalAdditionalFee: parseFloat(String(workingBase.internationalAdditionalFee)) || 3.00,
        countryRates: workingBase.countryRates || {},
        countryAdditionalFees: workingBase.countryAdditionalFees || {},
        categoryRates: workingBase.categoryRates || DEFAULT_SHIPPING_SETTINGS.categoryRates,
        cityRates: workingBase.cityRates || DEFAULT_SHIPPING_SETTINGS.cityRates,
      };

      // 1. Sanitize and compact payload to prune bloat (e.g. redundant active=true) and prevent storage quota overflow
      const payloadToSave = compactShippingSettings(rawPayload);

      // 2. Save to server API
      const res = await fetch("/api/shipping-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSave),
      });

      if (!res.ok) {
        let errorMsg = "Fehler beim Speichern der Versandeinstellungen";
        try {
          const errorData = await res.json();
          if (errorData?.error) errorMsg = errorData.error;
        } catch {}
        throw new Error(errorMsg);
      }

      // 3. Update local caches safely (NEVER let local storage quota crash the admin save!)
      if (typeof window !== "undefined") {
        safeSetLocalStorage("ixos_shipping_settings", JSON.stringify(payloadToSave));
        safeSetLocalStorage("ixos_shipping_updated_at", String(Date.now()));
        safeSetSessionStorage("ixos_shipping_settings_cache", JSON.stringify(payloadToSave));
        safeSetSessionStorage("ixos_shipping_settings_time", String(Date.now()));

        window.dispatchEvent(new CustomEvent("ixos_shipping_updated", { detail: payloadToSave }));
        try {
          const channel = new BroadcastChannel("ixos_shipping_sync");
          channel.postMessage({ type: "SHIPPING_UPDATED", settings: payloadToSave });
          channel.close();
        } catch {}
      }

      invalidateShippingCache();

      setSettings(payloadToSave);
      setRateDrafts({});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);

      const catName = selectedCategory ? ` für „${selectedCategory.name}“` : "";
      notifyAdmin(
        "success",
        "Versandeinstellungen gespeichert",
        `Die Versandtarife und Länderkonditionen${catName} wurden erfolgreich aktualisiert.`
      );
    } catch (err: any) {
      console.error("Error saving shipping settings:", err);
      notifyAdmin("error", "Fehler beim Speichern", err.message || "Versandeinstellungen konnten nicht gespeichert werden", err);
    } finally {
      setSaving(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY-LEVEL COUNTRY RATE HANDLERS
  // ═══════════════════════════════════════════════════════════════════

  // Get or initialize category shipping rate object
  const getCategoryRate = (categoryId: string): CategoryShippingRate => {
    const norm = categoryId.toLowerCase().trim();
    const existing = settings.categoryRates?.[categoryId] || settings.categoryRates?.[norm];
    if (existing) return existing;

    if (settings.categoryRates) {
      for (const [k, v] of Object.entries(settings.categoryRates)) {
        if (k.toLowerCase().trim() === norm || v.categoryId?.toLowerCase().trim() === norm) return v;
      }
    }

    return {
      categoryId,
      categoryName: categoryList.find((c) => c.id === categoryId || c.slug === categoryId || c.id.toLowerCase().trim() === norm || (c.slug && c.slug.toLowerCase().trim() === norm))?.name || categoryId,
      deFee: 0.0,
      euFee: Number(settings.euShippingFee) || 9.95,
      gbFee: 11.95,
      usFee: 14.95,
      caFee: 14.95,
      intlFee: Number(settings.internationalShippingFee) || 16.95,
      deliveryTime: "Within 1 week",
      countryRates: {
        DE: 0.0,
        GB: 11.95,
        US: 14.95,
        CA: 14.95,
      },
      countryDeliveryTimes: {},
      countryActive: {},
      stateRates: {},
      stateDeliveryTimes: {},
      stateActive: {},
    };
  };

  // Update a single country's fee in a specific category
  const handleCategoryCountryFeeChange = (categoryId: string, countryCode: string, value: string) => {
    let clean = value.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    if (parts.length > 2) clean = parts[0] + "." + parts.slice(1).join("");

    const currentCatRate = getCategoryRate(categoryId);
    const updatedCountryRates = { ...(currentCatRate.countryRates || {}) };

    if (clean === "") {
      delete updatedCountryRates[countryCode];
    } else {
      updatedCountryRates[countryCode] = parseFloat(clean) || 0;
    }

    // Sync zone fallback shortcuts if key country is edited
    let syncDe = currentCatRate.deFee;
    let syncGb = currentCatRate.gbFee;
    let syncUs = currentCatRate.usFee;
    let syncCa = currentCatRate.caFee;
    if (countryCode === "DE" && clean !== "") syncDe = parseFloat(clean) || 0;
    if (countryCode === "GB" && clean !== "") syncGb = parseFloat(clean) || 0;
    if (countryCode === "US" && clean !== "") syncUs = parseFloat(clean) || 0;
    if (countryCode === "CA" && clean !== "") syncCa = parseFloat(clean) || 0;

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      countryRates: updatedCountryRates,
      deFee: syncDe,
      gbFee: syncGb,
      usFee: syncUs,
      caFee: syncCa,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));
  };

  // Update a single country's additional item fee in a specific category
  const handleCategoryCountryAdditionalFeeChange = (categoryId: string, countryCode: string, value: string) => {
    let clean = value.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    if (parts.length > 2) clean = parts[0] + "." + parts.slice(1).join("");

    const currentCatRate = getCategoryRate(categoryId);
    const updatedAdditionalFees = { ...(currentCatRate.countryAdditionalFees || {}) };

    if (clean === "") {
      delete updatedAdditionalFees[countryCode];
    } else {
      updatedAdditionalFees[countryCode] = parseFloat(clean) || 0;
    }

    let syncDe = currentCatRate.deAdditionalFee;
    let syncGb = currentCatRate.gbAdditionalFee;
    let syncUs = currentCatRate.usAdditionalFee;
    let syncCa = currentCatRate.caAdditionalFee;
    if (countryCode === "DE" && clean !== "") syncDe = parseFloat(clean) || 0;
    if (countryCode === "GB" && clean !== "") syncGb = parseFloat(clean) || 0;
    if (countryCode === "US" && clean !== "") syncUs = parseFloat(clean) || 0;
    if (countryCode === "CA" && clean !== "") syncCa = parseFloat(clean) || 0;

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      countryAdditionalFees: updatedAdditionalFees,
      deAdditionalFee: syncDe,
      gbAdditionalFee: syncGb,
      usAdditionalFee: syncUs,
      caAdditionalFee: syncCa,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));
  };

  // Update a single country's delivery time in a specific category
  const handleCategoryCountryDeliveryTimeChange = (categoryId: string, countryCode: string, value: string) => {
    const currentCatRate = getCategoryRate(categoryId);
    const updatedDeliveryTimes = { ...(currentCatRate.countryDeliveryTimes || {}) };

    if (!value.trim()) {
      delete updatedDeliveryTimes[countryCode];
    } else {
      updatedDeliveryTimes[countryCode] = value.trim();
    }

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      countryDeliveryTimes: updatedDeliveryTimes,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));
  };

  // Toggle country active status for a specific category
  const handleCategoryCountryToggleActive = (categoryId: string, countryCode: string) => {
    const currentCatRate = getCategoryRate(categoryId);
    const updatedActive = { ...(currentCatRate.countryActive || {}) };
    const currentStatus = updatedActive[countryCode] !== false; // default true
    updatedActive[countryCode] = !currentStatus;

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      countryActive: updatedActive,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));
  };

  // Quick set rate to Free (€0.00)
  const handleCategoryCountrySetFree = (categoryId: string, countryCode: string) => {
    handleCategoryCountryFeeChange(categoryId, countryCode, "0.00");
  };

  // Apply bulk rate to all European countries for the selected category
  const handleApplyBulkEuRate = (categoryId: string) => {
    if (!bulkEuFee.trim() || isNaN(Number(bulkEuFee)) || Number(bulkEuFee) < 0) {
      notifyAdmin("warning", "Tarif erforderlich", "Bitte geben Sie einen Basispreis von 0 oder höher ein.");
      return;
    }
    if (!bulkEuAdditionalFee.trim() || isNaN(Number(bulkEuAdditionalFee)) || Number(bulkEuAdditionalFee) < 0) {
      notifyAdmin("warning", "Tarif erforderlich", "Bitte geben Sie einen Zusatzartikel-Preis von 0 oder höher ein.");
      return;
    }

    const feeNum = parseFloat(bulkEuFee);
    const fee = isNaN(feeNum) ? 9.95 : Math.max(0, feeNum);
    const addFeeNum = parseFloat(bulkEuAdditionalFee);
    const addFee = isNaN(addFeeNum) ? 2.00 : Math.max(0, addFeeNum);
    const time = bulkEuDeliveryTime.trim() || "2-4 Werktage";

    const currentCatRate = getCategoryRate(categoryId);
    const updatedCountryRates = { ...(currentCatRate.countryRates || {}) };
    const updatedDeliveryTimes = { ...(currentCatRate.countryDeliveryTimes || {}) };
    const updatedAdditionalFees = { ...(currentCatRate.countryAdditionalFees || {}) };

    SHIPPING_COUNTRIES.filter((c) => c.region === "EU" || c.region === "OTHER_EUROPE").forEach((c) => {
      updatedCountryRates[c.code] = fee;
      updatedDeliveryTimes[c.code] = time;
      updatedAdditionalFees[c.code] = addFee;
    });

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      euFee: fee,
      euAdditionalFee: addFee,
      countryRates: updatedCountryRates,
      countryDeliveryTimes: updatedDeliveryTimes,
      countryAdditionalFees: updatedAdditionalFees,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));

    setRateDrafts((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`cat:${categoryId}:country:`)) {
          delete next[k];
        }
      });
      return next;
    });

    notifyAdmin(
      "info",
      "Europa-Tarife übertragen",
      `Alle europäischen Länder für „${currentCatRate.categoryName || categoryId}“ auf €${fee.toFixed(2)} (+€${addFee.toFixed(2)}) und ${time} gesetzt.`
    );
  };

  // Reset a country rate back to general default
  const handleResetCategoryCountryRate = (categoryId: string, countryCode: string) => {
    const currentCatRate = getCategoryRate(categoryId);
    const updatedCountryRates = { ...(currentCatRate.countryRates || {}) };
    const updatedAdditionalFees = { ...(currentCatRate.countryAdditionalFees || {}) };
    const updatedDeliveryTimes = { ...(currentCatRate.countryDeliveryTimes || {}) };
    const updatedActive = { ...(currentCatRate.countryActive || {}) };

    delete updatedCountryRates[countryCode];
    delete updatedAdditionalFees[countryCode];
    delete updatedDeliveryTimes[countryCode];
    delete updatedActive[countryCode];

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      countryRates: updatedCountryRates,
      countryAdditionalFees: updatedAdditionalFees,
      countryDeliveryTimes: updatedDeliveryTimes,
      countryActive: updatedActive,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));

    setRateDrafts((prev) => {
      const next = { ...prev };
      delete next[`cat:${categoryId}:country:${countryCode}:fee`];
      delete next[`cat:${categoryId}:country:${countryCode}:addFee`];
      return next;
    });
  };

  // ── STATE / PROVINCE HANDLERS (USA 50 STATES & CANADA 13 PROVINCES) ──
  const handleCategoryStateFeeChange = (categoryId: string, stateId: string, value: string) => {
    let clean = value.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    if (parts.length > 2) clean = parts[0] + "." + parts.slice(1).join("");

    const currentCatRate = getCategoryRate(categoryId);
    const updatedStateRates = { ...(currentCatRate.stateRates || {}) };

    if (clean === "") {
      delete updatedStateRates[stateId];
    } else {
      updatedStateRates[stateId] = parseFloat(clean) || 0;
    }

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      stateRates: updatedStateRates,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));
  };

  const handleCategoryStateAdditionalFeeChange = (categoryId: string, stateId: string, value: string) => {
    let clean = value.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    if (parts.length > 2) clean = parts[0] + "." + parts.slice(1).join("");

    const currentCatRate = getCategoryRate(categoryId);
    const updatedStateAdditionalFees = { ...(currentCatRate.stateAdditionalFees || {}) };

    if (clean === "") {
      delete updatedStateAdditionalFees[stateId];
    } else {
      updatedStateAdditionalFees[stateId] = parseFloat(clean) || 0;
    }

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      stateAdditionalFees: updatedStateAdditionalFees,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));
  };

  const handleCategoryStateDeliveryTimeChange = (categoryId: string, stateId: string, value: string) => {
    const currentCatRate = getCategoryRate(categoryId);
    const updatedStateDeliveryTimes = { ...(currentCatRate.stateDeliveryTimes || {}) };

    if (!value.trim()) {
      delete updatedStateDeliveryTimes[stateId];
    } else {
      updatedStateDeliveryTimes[stateId] = value.trim();
    }

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      stateDeliveryTimes: updatedStateDeliveryTimes,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));
  };

  const handleCategoryStateToggleActive = (categoryId: string, stateId: string) => {
    const currentCatRate = getCategoryRate(categoryId);
    const updatedStateActive = { ...(currentCatRate.stateActive || {}) };
    const currentStatus = updatedStateActive[stateId] !== false;
    updatedStateActive[stateId] = !currentStatus;

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      stateActive: updatedStateActive,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));
  };

  const handleResetCategoryStateRate = (categoryId: string, stateId: string) => {
    const currentCatRate = getCategoryRate(categoryId);
    const updatedStateRates = { ...(currentCatRate.stateRates || {}) };
    const updatedStateAdditionalFees = { ...(currentCatRate.stateAdditionalFees || {}) };
    const updatedStateDeliveryTimes = { ...(currentCatRate.stateDeliveryTimes || {}) };
    const updatedStateActive = { ...(currentCatRate.stateActive || {}) };

    delete updatedStateRates[stateId];
    delete updatedStateAdditionalFees[stateId];
    delete updatedStateDeliveryTimes[stateId];
    delete updatedStateActive[stateId];

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      stateRates: updatedStateRates,
      stateAdditionalFees: updatedStateAdditionalFees,
      stateDeliveryTimes: updatedStateDeliveryTimes,
      stateActive: updatedStateActive,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));

    setRateDrafts((prev) => {
      const next = { ...prev };
      delete next[`cat:${categoryId}:state:${stateId}:fee`];
      delete next[`cat:${categoryId}:state:${stateId}:addFee`];
      delete next[`cat:${categoryId}:prov:${stateId}:fee`];
      delete next[`cat:${categoryId}:prov:${stateId}:addFee`];
      return next;
    });
  };

  // Apply bulk rate to all 50 US States
  const handleApplyBulkUsRate = (categoryId: string) => {
    if (!bulkUsFee.trim() || isNaN(Number(bulkUsFee)) || Number(bulkUsFee) < 0) {
      notifyAdmin("warning", "Tarif erforderlich", "Bitte geben Sie einen Basispreis von 0 oder höher ein.");
      return;
    }
    if (!bulkUsAdditionalFee.trim() || isNaN(Number(bulkUsAdditionalFee)) || Number(bulkUsAdditionalFee) < 0) {
      notifyAdmin("warning", "Tarif erforderlich", "Bitte geben Sie einen Zusatzartikel-Preis von 0 oder höher ein.");
      return;
    }

    const feeNum = parseFloat(bulkUsFee);
    const fee = isNaN(feeNum) ? 18.00 : Math.max(0, feeNum);
    const addFeeNum = parseFloat(bulkUsAdditionalFee);
    const addFee = isNaN(addFeeNum) ? 3.00 : Math.max(0, addFeeNum);
    const time = bulkUsDeliveryTime.trim() || "2-3 weeks";

    const currentCatRate = getCategoryRate(categoryId);
    const updatedStateRates = { ...(currentCatRate.stateRates || {}) };
    const updatedStateDeliveryTimes = { ...(currentCatRate.stateDeliveryTimes || {}) };
    const updatedStateAdditionalFees = { ...(currentCatRate.stateAdditionalFees || {}) };
    const updatedCountryRates = { ...(currentCatRate.countryRates || {}) };
    const updatedCountryAdditionalFees = { ...(currentCatRate.countryAdditionalFees || {}) };

    updatedCountryRates["US"] = fee;
    updatedCountryAdditionalFees["US"] = addFee;
    US_STATES.forEach((s) => {
      updatedStateRates[s.id] = fee;
      updatedStateDeliveryTimes[s.id] = time;
      updatedStateAdditionalFees[s.id] = addFee;
    });

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      usFee: fee,
      usAdditionalFee: addFee,
      countryRates: updatedCountryRates,
      countryAdditionalFees: updatedCountryAdditionalFees,
      stateRates: updatedStateRates,
      stateDeliveryTimes: updatedStateDeliveryTimes,
      stateAdditionalFees: updatedStateAdditionalFees,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));

    setRateDrafts((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`cat:${categoryId}:state:`)) {
          delete next[k];
        }
      });
      return next;
    });

    notifyAdmin(
      "info",
      "USA-Tarife übertragen",
      `Alle 50 US-Staaten für „${currentCatRate.categoryName || categoryId}“ auf €${fee.toFixed(2)} (+€${addFee.toFixed(2)}) und ${time} gesetzt.`
    );
  };

  // Apply bulk rate to all 13 Canadian provinces and territories
  const handleApplyBulkCaRate = (categoryId: string) => {
    if (!bulkCaFee.trim() || isNaN(Number(bulkCaFee)) || Number(bulkCaFee) < 0) {
      notifyAdmin("warning", "Tarif erforderlich", "Bitte geben Sie einen Basispreis von 0 oder höher ein.");
      return;
    }
    if (!bulkCaAdditionalFee.trim() || isNaN(Number(bulkCaAdditionalFee)) || Number(bulkCaAdditionalFee) < 0) {
      notifyAdmin("warning", "Tarif erforderlich", "Bitte geben Sie einen Zusatzartikel-Preis von 0 oder höher ein.");
      return;
    }

    const feeNum = parseFloat(bulkCaFee);
    const fee = isNaN(feeNum) ? 19.95 : Math.max(0, feeNum);
    const addFeeNum = parseFloat(bulkCaAdditionalFee);
    const addFee = isNaN(addFeeNum) ? 3.00 : Math.max(0, addFeeNum);
    const time = bulkCaDeliveryTime.trim() || "2-3 weeks";

    const currentCatRate = getCategoryRate(categoryId);
    const updatedStateRates = { ...(currentCatRate.stateRates || {}) };
    const updatedStateDeliveryTimes = { ...(currentCatRate.stateDeliveryTimes || {}) };
    const updatedStateAdditionalFees = { ...(currentCatRate.stateAdditionalFees || {}) };
    const updatedCountryRates = { ...(currentCatRate.countryRates || {}) };
    const updatedCountryAdditionalFees = { ...(currentCatRate.countryAdditionalFees || {}) };

    updatedCountryRates["CA"] = fee;
    updatedCountryAdditionalFees["CA"] = addFee;
    CA_PROVINCES.forEach((p) => {
      updatedStateRates[p.id] = fee;
      updatedStateDeliveryTimes[p.id] = time;
      updatedStateAdditionalFees[p.id] = addFee;
    });

    const updatedCategoryRate: CategoryShippingRate = {
      ...currentCatRate,
      caFee: fee,
      caAdditionalFee: addFee,
      countryRates: updatedCountryRates,
      countryAdditionalFees: updatedCountryAdditionalFees,
      stateRates: updatedStateRates,
      stateDeliveryTimes: updatedStateDeliveryTimes,
      stateAdditionalFees: updatedStateAdditionalFees,
    };

    setSettings((prev) => ({
      ...prev,
      categoryRates: {
        ...(prev.categoryRates || {}),
        [categoryId]: updatedCategoryRate,
      },
    }));

    setRateDrafts((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`cat:${categoryId}:prov:`) || k.startsWith(`cat:${categoryId}:state:`)) {
          delete next[k];
        }
      });
      return next;
    });

    notifyAdmin(
      "info",
      "Kanada-Tarife übertragen",
      `Alle 13 Provinzen für „${currentCatRate.categoryName || categoryId}“ auf €${fee.toFixed(2)} (+€${addFee.toFixed(2)}) und ${time} gesetzt.`
    );
  };

  // ═══════════════════════════════════════════════════════════════════
  // CITY-LEVEL OVERRIDES HANDLERS
  // ═══════════════════════════════════════════════════════════════════
  const handleAddCityRate = () => {
    if (!newCityName.trim() && !newCityPostcode.trim()) {
      notifyAdmin("warning", "Eingabe unvollständig", "Bitte geben Sie einen Stadtnamen oder eine Postleitzahl ein.");
      return;
    }

    if (!newCityFee.trim() || isNaN(Number(newCityFee)) || Number(newCityFee) < 0) {
      notifyAdmin("warning", "Tarif erforderlich", "Bitte geben Sie einen Tarif von 0 oder höher ein (z. B. 0.00).");
      return;
    }

    const feeNum = parseFloat(newCityFee);
    const newEntry: CityShippingRate = {
      id: `city-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      countryCode: newCityCountry,
      cityName: newCityName.trim(),
      postalCode: newCityPostcode.trim(),
      fee: isNaN(feeNum) ? 0 : Math.max(0, feeNum),
      deliveryTime: newCityDeliveryTime.trim() || "1-2 Werktage",
      courier: newCityCourier.trim() || "DHL Paket / Deutsche Post",
    };

    setSettings((prev) => ({
      ...prev,
      cityRates: [...(prev.cityRates || []), newEntry],
    }));

    setNewCityName("");
    setNewCityPostcode("");
    setNewCityFee("0.00");
    notifyAdmin("success", "Stadt-Tarif hinzugefügt", `${newEntry.cityName || newEntry.postalCode} (${newEntry.countryCode}) gespeichert.`);
  };

  const handleDeleteCityRate = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      cityRates: (prev.cityRates || []).filter((c) => c.id !== id),
    }));
    notifyAdmin("info", "Stadt-Tarif entfernt", "Der Sondertarif wurde gelöscht.");
  };

  // ═══════════════════════════════════════════════════════════════════
  // FILTERED LISTS
  // ═══════════════════════════════════════════════════════════════════
  const displayCategories = useMemo(() => {
    const q = categorySearchQuery.trim().toLowerCase();
    return categoryList.filter((cat) => {
      if (cat.id === "all-parts" || cat.id === "specials" || cat.isVirtual) return false;
      if (!q) return true;
      return cat.name.toLowerCase().includes(q) || cat.id.toLowerCase().includes(q) || (cat.slug && cat.slug.toLowerCase().includes(q));
    });
  }, [categoryList, categorySearchQuery]);

  // Filtered European Countries (42 countries: EU + OTHER_EUROPE)
  const filteredEuropeCountries = useMemo(() => {
    const q = regionSearchQuery.trim().toLowerCase();
    return SHIPPING_COUNTRIES.filter((country) => {
      if (country.region !== "EU" && country.region !== "OTHER_EUROPE") return false;
      if (!q) return true;
      return (
        country.code.toLowerCase().includes(q) ||
        country.germanName.toLowerCase().includes(q) ||
        country.name.toLowerCase().includes(q) ||
        country.localName.toLowerCase().includes(q)
      );
    });
  }, [regionSearchQuery]);

  // Filtered US States (50 states)
  const filteredUsStates = useMemo(() => {
    const q = regionSearchQuery.trim().toLowerCase();
    return US_STATES.filter((state) => {
      if (!q) return true;
      return (
        state.code.toLowerCase().includes(q) ||
        state.name.toLowerCase().includes(q) ||
        state.id.toLowerCase().includes(q) ||
        (state.majorCities && state.majorCities.some((c) => c.toLowerCase().includes(q)))
      );
    });
  }, [regionSearchQuery]);

  // Filtered Canadian Provinces & Territories (13 provinces & territories)
  const filteredCaProvinces = useMemo(() => {
    const q = regionSearchQuery.trim().toLowerCase();
    return CA_PROVINCES.filter((prov) => {
      if (!q) return true;
      return (
        prov.code.toLowerCase().includes(q) ||
        prov.name.toLowerCase().includes(q) ||
        prov.id.toLowerCase().includes(q) ||
        (prov.majorCities && prov.majorCities.some((c) => c.toLowerCase().includes(q)))
      );
    });
  }, [regionSearchQuery]);

  if (loading) {
    return (
      <div className="p-8 text-center space-y-3 font-sans">
        <RefreshCw className="w-6 h-6 animate-spin text-black mx-auto" />
        <p className="text-xs text-neutral-500 font-bold tracking-wider uppercase">
          Versandeinstellungen werden geladen...
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // VIEW 2: CATEGORY REGIONAL SHIPPING RATES FIXER PAGE
  // ═══════════════════════════════════════════════════════════════════
  if (selectedCategory) {
    const catRate = getCategoryRate(selectedCategory.id);
    const catImg = selectedCategory.image || (selectedCategory as any).image_url;

    return (
      <div className="space-y-4 font-sans text-foreground animate-fade-in pb-12">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setRegionSearchQuery("");
              }}
              className="text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer shrink-0"
            >
              ← Zurück
            </button>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-2 min-w-0">
              {catImg && (
                <div className="w-8 h-8 rounded-lg border border-neutral-200 p-1 bg-white shrink-0">
                  <img src={catImg} alt={selectedCategory.name} className="w-full h-full object-contain" />
                </div>
              )}
              <h1 className="text-lg sm:text-xl font-heading font-black tracking-tight text-black truncate">
                {selectedCategory.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hasInvalidDrafts && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-1 rounded-md">
                Wert ≥ 0 erforderlich
              </span>
            )}
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                saveSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-black hover:bg-neutral-800 disabled:opacity-50 text-white"
              }`}
            >
              {saving ? "Speichert..." : saveSuccess ? "Gespeichert!" : "Speichern"}
            </button>
          </div>
        </div>

        {/* 5 Main Regional Groups Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none pb-1">
          {[
            { id: "EU" as const, label: "Europa", count: 42, flag: "🇪🇺" },
            { id: "US" as const, label: "USA", count: 50, flag: "🇺🇸" },
            { id: "CA" as const, label: "Kanada", count: 13, flag: "🇨🇦" },
            { id: "DE" as const, label: "Deutschland", count: undefined, flag: "🇩🇪" },
            { id: "GB" as const, label: "UK", count: undefined, flag: "🇬🇧" },
          ].map((tab) => {
            const isActive = activeRegionGroup === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveRegionGroup(tab.id);
                  setRegionSearchQuery("");
                }}
                className={`px-3.5 py-2 rounded-lg font-heading font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "bg-black text-white shadow-xs"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                }`}
              >
                <span className="text-sm select-none">{tab.flag}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: EUROPE (42 COUNTRIES) ── */}
        {activeRegionGroup === "EU" && (
          <div className="space-y-3 animate-fade-in">
            {/* Bulk Apply Bar + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-neutral-700">Europa Basis:</span>
                <ShippingRateInput
                  value={bulkEuFee}
                  onChange={setBulkEuFee}
                  placeholder="9.95"
                  className="w-20"
                />
                <span className="font-bold text-neutral-700 ml-1">+ weiterer Artikel:</span>
                <ShippingRateInput
                  value={bulkEuAdditionalFee}
                  onChange={setBulkEuAdditionalFee}
                  placeholder="2.00"
                  className="w-20"
                />
                <select
                  value={normalizeDeliveryTimeOption(bulkEuDeliveryTime)}
                  onChange={(e) => setBulkEuDeliveryTime(e.target.value)}
                  className="bg-white border border-neutral-300 focus:border-black rounded-lg px-2 py-1 font-medium outline-none cursor-pointer"
                >
                  <option value="Within 1 week">Within 1 week</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-3 weeks">2-3 weeks</option>
                  <option value="3-4 weeks">3-4 weeks</option>
                  <option value="4-5 weeks">4-5 weeks</option>
                  <option value="5-6 weeks">5-6 weeks</option>
                  <option value="6-8 weeks">6-8 weeks</option>
                  <option value="1-2 Werktage">1-2 Werktage</option>
                  <option value="2-4 Werktage">2-4 Werktage</option>
                  <option value="3-5 Werktage">3-5 Werktage</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleApplyBulkEuRate(selectedCategory.id)}
                  className="px-3 py-1 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors"
                >
                  Auf alle 42 anwenden
                </button>
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Land suchen..."
                  value={regionSearchQuery}
                  onChange={(e) => setRegionSearchQuery(e.target.value)}
                  className="w-full bg-white border border-neutral-200 focus:border-black rounded-lg pl-8 pr-3 py-1.5 text-xs text-black outline-none font-medium"
                />
              </div>
            </div>

            {/* Europe 42 Countries Table */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
              <div className="bg-neutral-50 px-4 py-2.5 grid grid-cols-12 gap-3 text-xs font-bold text-neutral-500 border-b border-neutral-200">
                <div className="col-span-12 sm:col-span-4 md:col-span-3">Land (42)</div>
                <div className="col-span-6 sm:col-span-2 md:col-span-2 text-right">Preis (€)</div>
                <div className="col-span-6 sm:col-span-2 md:col-span-2 text-right">Weitere Artikel (€)</div>
                <div className="col-span-6 sm:col-span-4 md:col-span-3">Lieferzeit</div>
                <div className="hidden md:block md:col-span-2 text-right">Status</div>
              </div>

              {filteredEuropeCountries.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">Keine Länder gefunden</div>
              ) : (
                filteredEuropeCountries.map((country) => {
                  const customFee = catRate.countryRates?.[country.code];
                  const isDraftOverridden = rateDrafts[`cat:${selectedCategory.id}:country:${country.code}:fee`] !== undefined;
                  const isOverridden = isDraftOverridden || customFee !== undefined;

                  const customDeliveryTime = catRate.countryDeliveryTimes?.[country.code];
                  const deliveryTimeVal =
                    customDeliveryTime ||
                    country.defaultDeliveryTime ||
                    catRate.deliveryTime ||
                    "1-2 weeks";

                  const isShippable = catRate.countryActive?.[country.code] !== false;

                  return (
                    <div
                      key={country.code}
                      className={`px-4 py-3 grid grid-cols-12 gap-3 items-center hover:bg-neutral-50/80 transition-colors ${
                        !isShippable ? "opacity-40 bg-neutral-50/30" : ""
                      }`}
                    >
                      {/* Country Info */}
                      <div className="col-span-12 sm:col-span-4 md:col-span-3 flex items-center gap-2.5">
                        <span className="text-xl select-none" role="img" aria-label={country.germanName}>
                          {country.flag}
                        </span>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-heading font-bold text-xs sm:text-sm text-black truncate">
                            {country.germanName}
                          </span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                            {country.code}
                          </span>
                          {isOverridden && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                              Individuell
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Fee Input */}
                      <div className="col-span-6 sm:col-span-2 md:col-span-2 flex items-center justify-end">
                        <ShippingRateInput
                          value={getDraftRate(
                            `cat:${selectedCategory.id}:country:${country.code}:fee`,
                            customFee !== undefined ? customFee : (catRate.euFee ?? 9.95)
                          )}
                          onChange={(val) =>
                            setDraftRate(`cat:${selectedCategory.id}:country:${country.code}:fee`, val)
                          }
                          placeholder="0.00"
                          className="w-24"
                        />
                      </div>

                      {/* Additional Item Fee Input */}
                      <div className="col-span-6 sm:col-span-2 md:col-span-2 flex items-center justify-end">
                        <ShippingRateInput
                          value={getDraftRate(
                            `cat:${selectedCategory.id}:country:${country.code}:addFee`,
                            catRate.countryAdditionalFees?.[country.code] !== undefined
                              ? catRate.countryAdditionalFees[country.code]
                              : (catRate.euAdditionalFee ?? 2.00)
                          )}
                          onChange={(val) =>
                            setDraftRate(`cat:${selectedCategory.id}:country:${country.code}:addFee`, val)
                          }
                          placeholder="2.00"
                          className="w-24"
                        />
                      </div>

                      {/* Estimated Delivery Time Dropdown */}
                      <div className="col-span-6 sm:col-span-4 md:col-span-3 flex items-center">
                        <select
                          value={normalizeDeliveryTimeOption(deliveryTimeVal)}
                          onChange={(e) =>
                            handleCategoryCountryDeliveryTimeChange(selectedCategory.id, country.code, e.target.value)
                          }
                          className="w-full bg-white border border-neutral-300 hover:border-black focus:border-black rounded-lg px-2.5 py-1.5 text-xs font-medium text-black outline-none cursor-pointer transition-colors"
                        >
                          <option value="Within 1 week">Within 1 week</option>
                          <option value="1-2 weeks">1-2 weeks</option>
                          <option value="2-3 weeks">2-3 weeks</option>
                          <option value="3-4 weeks">3-4 weeks</option>
                          <option value="4-5 weeks">4-5 weeks</option>
                          <option value="5-6 weeks">5-6 weeks</option>
                          <option value="6-8 weeks">6-8 weeks</option>
                          <option value="1-2 Werktage">1-2 Werktage</option>
                          <option value="2-4 Werktage">2-4 Werktage</option>
                          <option value="3-5 Werktage">3-5 Werktage</option>
                        </select>
                      </div>

                      {/* Status & Reset Action */}
                      <div className="hidden md:flex md:col-span-2 items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCategoryCountryToggleActive(selectedCategory.id, country.code)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            isShippable
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-neutral-100 text-neutral-400 border-neutral-200"
                          }`}
                        >
                          {isShippable ? "Aktiv" : "Aus"}
                        </button>

                        {isOverridden && (
                          <button
                            type="button"
                            onClick={() => handleResetCategoryCountryRate(selectedCategory.id, country.code)}
                            className="p-1 text-neutral-400 hover:text-black rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="Zurücksetzen"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: USA (50 STATES) ── */}
        {activeRegionGroup === "US" && (
          <div className="space-y-3 animate-fade-in">
            {/* Bulk Apply Bar + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-neutral-700">USA Basis:</span>
                <ShippingRateInput
                  value={bulkUsFee}
                  onChange={setBulkUsFee}
                  placeholder="18.00"
                  className="w-20"
                />
                <span className="font-bold text-neutral-700 ml-1">+ weiterer Artikel:</span>
                <ShippingRateInput
                  value={bulkUsAdditionalFee}
                  onChange={setBulkUsAdditionalFee}
                  placeholder="3.00"
                  className="w-20"
                />
                <select
                  value={normalizeDeliveryTimeOption(bulkUsDeliveryTime)}
                  onChange={(e) => setBulkUsDeliveryTime(e.target.value)}
                  className="bg-white border border-neutral-300 focus:border-black rounded-lg px-2 py-1 font-medium outline-none cursor-pointer"
                >
                  <option value="Within 1 week">Within 1 week</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-3 weeks">2-3 weeks</option>
                  <option value="3-4 weeks">3-4 weeks</option>
                  <option value="4-5 weeks">4-5 weeks</option>
                  <option value="5-6 weeks">5-6 weeks</option>
                  <option value="6-8 weeks">6-8 weeks</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleApplyBulkUsRate(selectedCategory.id)}
                  className="px-3 py-1 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors"
                >
                  Auf alle 50 Staaten anwenden
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Staat oder Stadt suchen (z. B. Texas)..."
                  value={regionSearchQuery}
                  onChange={(e) => setRegionSearchQuery(e.target.value)}
                  className="w-full bg-white border border-neutral-200 focus:border-black rounded-lg pl-8 pr-3 py-1.5 text-xs text-black outline-none font-medium"
                />
              </div>
            </div>

            {/* USA 50 States Table */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
              <div className="bg-neutral-50 px-4 py-2.5 grid grid-cols-12 gap-3 text-xs font-bold text-neutral-500 border-b border-neutral-200">
                <div className="col-span-12 sm:col-span-4 md:col-span-3">Bundesstaat (50)</div>
                <div className="col-span-6 sm:col-span-2 md:col-span-2 text-right">Preis (€)</div>
                <div className="col-span-6 sm:col-span-2 md:col-span-2 text-right">Weitere Artikel (€)</div>
                <div className="col-span-6 sm:col-span-4 md:col-span-3">Lieferzeit</div>
                <div className="hidden md:block md:col-span-2 text-right">Status</div>
              </div>

              {filteredUsStates.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">Keine Bundesstaaten gefunden</div>
              ) : (
                filteredUsStates.map((state) => {
                  const customFee = catRate.stateRates?.[state.id];
                  const isDraftOverridden = rateDrafts[`cat:${selectedCategory.id}:state:${state.id}:fee`] !== undefined;
                  const isOverridden = isDraftOverridden || customFee !== undefined;

                  const customDeliveryTime = catRate.stateDeliveryTimes?.[state.id];
                  const deliveryTimeVal =
                    customDeliveryTime ||
                    catRate.countryDeliveryTimes?.["US"] ||
                    "2-3 weeks";

                  const isShippable = catRate.stateActive?.[state.id] !== false;

                  return (
                    <div
                      key={state.id}
                      className={`px-4 py-3 grid grid-cols-12 gap-3 items-center hover:bg-neutral-50/80 transition-colors ${
                        !isShippable ? "opacity-40 bg-neutral-50/30" : ""
                      }`}
                    >
                      {/* State Info */}
                      <div className="col-span-12 sm:col-span-4 md:col-span-3 flex items-center gap-2.5">
                        <span className="text-xl select-none" role="img" aria-label="USA">
                          🇺🇸
                        </span>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-xs sm:text-sm text-black truncate">
                              {state.name}
                            </span>
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                              {state.code}
                            </span>
                            {isOverridden && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                                Individuell
                              </span>
                            )}
                          </div>
                          {state.majorCities && state.majorCities.length > 0 && (
                            <span className="text-[10px] text-neutral-400 truncate">
                              {state.majorCities.slice(0, 4).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Fee Input */}
                      <div className="col-span-6 sm:col-span-2 md:col-span-2 flex items-center justify-end">
                        <ShippingRateInput
                          value={getDraftRate(
                            `cat:${selectedCategory.id}:state:${state.id}:fee`,
                            customFee !== undefined
                              ? customFee
                              : (catRate.countryRates?.["US"] ?? catRate.usFee ?? 18.00)
                          )}
                          onChange={(val) =>
                            setDraftRate(`cat:${selectedCategory.id}:state:${state.id}:fee`, val)
                          }
                          placeholder="0.00"
                          className="w-24"
                        />
                      </div>

                      {/* Additional Item Fee Input */}
                      <div className="col-span-6 sm:col-span-2 md:col-span-2 flex items-center justify-end">
                        <ShippingRateInput
                          value={getDraftRate(
                            `cat:${selectedCategory.id}:state:${state.id}:addFee`,
                            catRate.stateAdditionalFees?.[state.id] !== undefined
                              ? catRate.stateAdditionalFees[state.id]
                              : (catRate.countryAdditionalFees?.["US"] ?? catRate.usAdditionalFee ?? 3.00)
                          )}
                          onChange={(val) =>
                            setDraftRate(`cat:${selectedCategory.id}:state:${state.id}:addFee`, val)
                          }
                          placeholder="3.00"
                          className="w-24"
                        />
                      </div>

                      {/* Estimated Delivery Time Dropdown */}
                      <div className="col-span-6 sm:col-span-4 md:col-span-3 flex items-center">
                        <select
                          value={normalizeDeliveryTimeOption(deliveryTimeVal)}
                          onChange={(e) =>
                            handleCategoryStateDeliveryTimeChange(selectedCategory.id, state.id, e.target.value)
                          }
                          className="w-full bg-white border border-neutral-300 hover:border-black focus:border-black rounded-lg px-2.5 py-1.5 text-xs font-medium text-black outline-none cursor-pointer transition-colors"
                        >
                          <option value="Within 1 week">Within 1 week</option>
                          <option value="1-2 weeks">1-2 weeks</option>
                          <option value="2-3 weeks">2-3 weeks</option>
                          <option value="3-4 weeks">3-4 weeks</option>
                          <option value="4-5 weeks">4-5 weeks</option>
                          <option value="5-6 weeks">5-6 weeks</option>
                          <option value="6-8 weeks">6-8 weeks</option>
                        </select>
                      </div>

                      {/* Status & Reset Action */}
                      <div className="hidden md:flex md:col-span-2 items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCategoryStateToggleActive(selectedCategory.id, state.id)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            isShippable
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-neutral-100 text-neutral-400 border-neutral-200"
                          }`}
                        >
                          {isShippable ? "Aktiv" : "Aus"}
                        </button>

                        {isOverridden && (
                          <button
                            type="button"
                            onClick={() => handleResetCategoryStateRate(selectedCategory.id, state.id)}
                            className="p-1 text-neutral-400 hover:text-black rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="Zurücksetzen"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: CANADA (13 PROVINCES & TERRITORIES) ── */}
        {activeRegionGroup === "CA" && (
          <div className="space-y-3 animate-fade-in">
            {/* Bulk Apply Bar + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-neutral-700">Kanada Basis:</span>
                <ShippingRateInput
                  value={bulkCaFee}
                  onChange={setBulkCaFee}
                  placeholder="19.95"
                  className="w-20"
                />
                <span className="font-bold text-neutral-700 ml-1">+ weiterer Artikel:</span>
                <ShippingRateInput
                  value={bulkCaAdditionalFee}
                  onChange={setBulkCaAdditionalFee}
                  placeholder="3.00"
                  className="w-20"
                />
                <select
                  value={normalizeDeliveryTimeOption(bulkCaDeliveryTime)}
                  onChange={(e) => setBulkCaDeliveryTime(e.target.value)}
                  className="bg-white border border-neutral-300 focus:border-black rounded-lg px-2 py-1 font-medium outline-none cursor-pointer"
                >
                  <option value="Within 1 week">Within 1 week</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-3 weeks">2-3 weeks</option>
                  <option value="3-4 weeks">3-4 weeks</option>
                  <option value="4-5 weeks">4-5 weeks</option>
                  <option value="5-6 weeks">5-6 weeks</option>
                  <option value="6-8 weeks">6-8 weeks</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleApplyBulkCaRate(selectedCategory.id)}
                  className="px-3 py-1 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors"
                >
                  Auf alle 13 Provinzen anwenden
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Provinz oder Stadt suchen (z. B. Ontario)..."
                  value={regionSearchQuery}
                  onChange={(e) => setRegionSearchQuery(e.target.value)}
                  className="w-full bg-white border border-neutral-200 focus:border-black rounded-lg pl-8 pr-3 py-1.5 text-xs text-black outline-none font-medium"
                />
              </div>
            </div>

            {/* Canada 13 Provinces Table */}
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100">
              <div className="bg-neutral-50 px-4 py-2.5 grid grid-cols-12 gap-3 text-xs font-bold text-neutral-500 border-b border-neutral-200">
                <div className="col-span-12 sm:col-span-4 md:col-span-3">Provinz / Territorium (13)</div>
                <div className="col-span-6 sm:col-span-2 md:col-span-2 text-right">Preis (€)</div>
                <div className="col-span-6 sm:col-span-2 md:col-span-2 text-right">Weitere Artikel (€)</div>
                <div className="col-span-6 sm:col-span-4 md:col-span-3">Lieferzeit</div>
                <div className="hidden md:block md:col-span-2 text-right">Status</div>
              </div>

              {filteredCaProvinces.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">Keine Provinzen gefunden</div>
              ) : (
                filteredCaProvinces.map((prov) => {
                  const customFee = catRate.stateRates?.[prov.id];
                  const isDraftOverridden =
                    rateDrafts[`cat:${selectedCategory.id}:prov:${prov.id}:fee`] !== undefined ||
                    rateDrafts[`cat:${selectedCategory.id}:prov:${prov.id}:addFee`] !== undefined;
                  const isOverridden =
                    isDraftOverridden ||
                    customFee !== undefined ||
                    catRate.stateAdditionalFees?.[prov.id] !== undefined;

                  const customDeliveryTime = catRate.stateDeliveryTimes?.[prov.id];
                  const deliveryTimeVal =
                    customDeliveryTime ||
                    catRate.countryDeliveryTimes?.["CA"] ||
                    "2-3 weeks";

                  const isShippable = catRate.stateActive?.[prov.id] !== false;

                  return (
                    <div
                      key={prov.id}
                      className={`px-4 py-3 grid grid-cols-12 gap-3 items-center hover:bg-neutral-50/80 transition-colors ${
                        !isShippable ? "opacity-40 bg-neutral-50/30" : ""
                      }`}
                    >
                      {/* Province Info */}
                      <div className="col-span-12 sm:col-span-4 md:col-span-3 flex items-center gap-2.5">
                        <span className="text-xl select-none" role="img" aria-label="Kanada">
                          🇨🇦
                        </span>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-xs sm:text-sm text-black truncate">
                              {prov.name}
                            </span>
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                              {prov.code}
                            </span>
                            {isOverridden && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                                Individuell
                              </span>
                            )}
                          </div>
                          {prov.majorCities && prov.majorCities.length > 0 && (
                            <span className="text-[10px] text-neutral-400 truncate">
                              {prov.majorCities.slice(0, 4).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Fee Input */}
                      <div className="col-span-6 sm:col-span-2 md:col-span-2 flex items-center justify-end">
                        <ShippingRateInput
                          value={getDraftRate(
                            `cat:${selectedCategory.id}:prov:${prov.id}:fee`,
                            customFee !== undefined
                              ? customFee
                              : (catRate.countryRates?.["CA"] ?? catRate.caFee ?? 19.95)
                          )}
                          onChange={(val) =>
                            setDraftRate(`cat:${selectedCategory.id}:prov:${prov.id}:fee`, val)
                          }
                          placeholder="0.00"
                          className="w-24"
                        />
                      </div>

                      {/* Additional Item Fee Input */}
                      <div className="col-span-6 sm:col-span-2 md:col-span-2 flex items-center justify-end">
                        <ShippingRateInput
                          value={getDraftRate(
                            `cat:${selectedCategory.id}:prov:${prov.id}:addFee`,
                            catRate.stateAdditionalFees?.[prov.id] !== undefined
                              ? catRate.stateAdditionalFees[prov.id]
                              : (catRate.countryAdditionalFees?.["CA"] ?? catRate.caAdditionalFee ?? 3.00)
                          )}
                          onChange={(val) =>
                            setDraftRate(`cat:${selectedCategory.id}:prov:${prov.id}:addFee`, val)
                          }
                          placeholder="3.00"
                          className="w-24"
                        />
                      </div>

                      {/* Estimated Delivery Time Dropdown */}
                      <div className="col-span-6 sm:col-span-4 md:col-span-3 flex items-center">
                        <select
                          value={normalizeDeliveryTimeOption(deliveryTimeVal)}
                          onChange={(e) =>
                            handleCategoryStateDeliveryTimeChange(selectedCategory.id, prov.id, e.target.value)
                          }
                          className="w-full bg-white border border-neutral-300 hover:border-black focus:border-black rounded-lg px-2.5 py-1.5 text-xs font-medium text-black outline-none cursor-pointer transition-colors"
                        >
                          <option value="Within 1 week">Within 1 week</option>
                          <option value="1-2 weeks">1-2 weeks</option>
                          <option value="2-3 weeks">2-3 weeks</option>
                          <option value="3-4 weeks">3-4 weeks</option>
                          <option value="4-5 weeks">4-5 weeks</option>
                          <option value="5-6 weeks">5-6 weeks</option>
                          <option value="6-8 weeks">6-8 weeks</option>
                        </select>
                      </div>

                      {/* Status & Reset Action */}
                      <div className="hidden md:flex md:col-span-2 items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCategoryStateToggleActive(selectedCategory.id, prov.id)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                            isShippable
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-neutral-100 text-neutral-400 border-neutral-200"
                          }`}
                        >
                          {isShippable ? "Aktiv" : "Aus"}
                        </button>

                        {isOverridden && (
                          <button
                            type="button"
                            onClick={() => handleResetCategoryStateRate(selectedCategory.id, prov.id)}
                            className="p-1 text-neutral-400 hover:text-black rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                            title="Zurücksetzen"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── TAB 4: DEUTSCHLAND (INLAND) ── */}
        {activeRegionGroup === "DE" && (
          <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl select-none">🇩🇪</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-black">Deutschland (Inland)</h3>
                  <span className="text-[11px] text-neutral-400">Standardversand innerhalb Deutschlands</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                DE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Versandkosten (€)</label>
                <ShippingRateInput
                  value={getDraftRate(
                    `cat:${selectedCategory.id}:DE:fee`,
                    catRate.countryRates?.["DE"] !== undefined
                      ? catRate.countryRates["DE"]
                      : (catRate.deFee ?? 0.00)
                  )}
                  onChange={(val) =>
                    setDraftRate(`cat:${selectedCategory.id}:DE:fee`, val)
                  }
                  placeholder="0.00"
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Weitere Artikel (€)</label>
                <ShippingRateInput
                  value={getDraftRate(
                    `cat:${selectedCategory.id}:DE:addFee`,
                    catRate.countryAdditionalFees?.["DE"] !== undefined
                      ? catRate.countryAdditionalFees["DE"]
                      : (catRate.deAdditionalFee ?? 0.00)
                  )}
                  onChange={(val) =>
                    setDraftRate(`cat:${selectedCategory.id}:DE:addFee`, val)
                  }
                  placeholder="0.00"
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Lieferzeit</label>
                <select
                  value={normalizeDeliveryTimeOption(
                    catRate.countryDeliveryTimes?.["DE"] || catRate.deliveryTime || "Within 1 week"
                  )}
                  onChange={(e) =>
                    handleCategoryCountryDeliveryTimeChange(selectedCategory.id, "DE", e.target.value)
                  }
                  className="w-full bg-neutral-50 border border-neutral-300 hover:border-black focus:border-black rounded-lg px-3 py-2 text-xs font-medium text-black outline-none cursor-pointer"
                >
                  <option value="Within 1 week">Within 1 week</option>
                  <option value="1-2 Werktage">1-2 Werktage</option>
                  <option value="2-4 Werktage">2-4 Werktage</option>
                  <option value="3-5 Werktage">3-5 Werktage</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-3 weeks">2-3 weeks</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: UNITED KINGDOM ── */}
        {activeRegionGroup === "GB" && (
          <div className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl select-none">🇬🇧</span>
                <div>
                  <h3 className="font-heading font-black text-sm text-black">Großbritannien / UK</h3>
                  <span className="text-[11px] text-neutral-400">Versand nach England, Schottland, Wales & Nordirland</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                GB
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Versandkosten (€)</label>
                <ShippingRateInput
                  value={getDraftRate(
                    `cat:${selectedCategory.id}:GB:fee`,
                    catRate.countryRates?.["GB"] !== undefined
                      ? catRate.countryRates["GB"]
                      : (catRate.gbFee ?? 11.95)
                  )}
                  onChange={(val) =>
                    setDraftRate(`cat:${selectedCategory.id}:GB:fee`, val)
                  }
                  placeholder="11.95"
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Weitere Artikel (€)</label>
                <ShippingRateInput
                  value={getDraftRate(
                    `cat:${selectedCategory.id}:GB:addFee`,
                    catRate.countryAdditionalFees?.["GB"] !== undefined
                      ? catRate.countryAdditionalFees["GB"]
                      : (catRate.gbAdditionalFee ?? 2.00)
                  )}
                  onChange={(val) =>
                    setDraftRate(`cat:${selectedCategory.id}:GB:addFee`, val)
                  }
                  placeholder="2.00"
                  className="w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700">Lieferzeit</label>
                <select
                  value={normalizeDeliveryTimeOption(
                    catRate.countryDeliveryTimes?.["GB"] || "1-2 weeks"
                  )}
                  onChange={(e) =>
                    handleCategoryCountryDeliveryTimeChange(selectedCategory.id, "GB", e.target.value)
                  }
                  className="w-full bg-neutral-50 border border-neutral-300 hover:border-black focus:border-black rounded-lg px-3 py-2 text-xs font-medium text-black outline-none cursor-pointer"
                >
                  <option value="Within 1 week">Within 1 week</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-3 weeks">2-3 weeks</option>
                  <option value="3-4 weeks">3-4 weeks</option>
                  <option value="4-5 weeks">4-5 weeks</option>
                  <option value="5-6 weeks">5-6 weeks</option>
                  <option value="6-8 weeks">6-8 weeks</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              setRegionSearchQuery("");
            }}
            className="text-xs font-heading font-bold text-neutral-500 hover:text-black cursor-pointer"
          >
            ← Zurück zu Kategorien
          </button>
          <div className="flex items-center gap-2">
            {hasInvalidDrafts && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-1 rounded-md">
                Wert ≥ 0 erforderlich
              </span>
            )}
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className={`px-5 py-2 font-heading font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                saveSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-black hover:bg-neutral-800 disabled:opacity-50 text-white"
              }`}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Speichert...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Gespeichert!</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Speichern</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // VIEW 1: CATEGORY SELECTION & GENERAL OVERVIEW
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6 font-sans text-foreground animate-fade-in pb-12">
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-black">
            Versandtarife nach Kategorie
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {hasInvalidDrafts && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-1 rounded-md">
              Wert ≥ 0 erforderlich
            </span>
          )}
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className={`px-5 py-2 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
              saveSuccess
                ? "bg-emerald-600 text-white"
                : "bg-black hover:bg-neutral-800 disabled:opacity-50 text-white"
            }`}
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Speichert...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Gespeichert!</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Speichern</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── NAVIGATION TABS (CATEGORIES / CITIES / GENERAL) ── */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveMainView("categories")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeMainView === "categories"
              ? "bg-black text-white"
              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Kategorien</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainView("cities")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeMainView === "cities"
              ? "bg-black text-white"
              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Städte & PLZ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainView("general")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeMainView === "general"
              ? "bg-black text-white"
              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Standard-Zonen</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SUB-VIEW 1: CATEGORIES GRID (EXACT SAME AS PRODUCTS TAB)      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeMainView === "categories" && (
        <div className="space-y-5 animate-fade-in">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Kategorie suchen..."
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                className="w-full bg-white border border-neutral-300 focus:border-black rounded-xl pl-9 pr-3 py-2 text-xs text-black placeholder:text-neutral-400 outline-none font-medium transition-colors"
              />
            </div>
          </div>

          {/* Grid of Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {displayCategories.map((cat) => {
              const img = (cat as any).image_url || (cat as any).image;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className="bg-white border border-neutral-200 hover:border-black rounded-2xl p-3.5 sm:p-4 cursor-pointer transition-all hover:shadow-sm group flex flex-col justify-between"
                >
                  <div>
                    {/* Centered Thumbnail Box */}
                    <div className="w-20 h-20 mx-auto rounded-xl border border-neutral-200 p-2 overflow-hidden flex items-center justify-center bg-white group-hover:scale-105 transition-transform">
                      {img ? (
                        <img src={img} alt={cat.name} className="w-full h-full object-contain" />
                      ) : (
                        <Box className="w-8 h-8 text-neutral-400 stroke-[1.5]" />
                      )}
                    </div>

                    {/* Category Title */}
                    <div className="mt-3 text-center">
                      <h3 className="font-heading font-bold text-xs sm:text-sm text-black line-clamp-1">
                        {cat.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-center text-[11px] font-heading font-bold text-neutral-500 group-hover:text-black">
                    <span className="flex items-center gap-1">
                      <span>Tarife anpassen</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SUB-VIEW 2: CITY-LEVEL SONDERTARIFE                          */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeMainView === "cities" && (
        <div className="space-y-5 animate-fade-in">
          {/* Add City Rate Box */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs space-y-3">
            <h2 className="text-xs font-heading font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Stadt- oder PLZ-Tarif hinzufügen</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2.5 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Land</label>
                <select
                  value={newCityCountry}
                  onChange={(e) => setNewCityCountry(e.target.value)}
                  className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 focus:border-black rounded-lg px-2.5 py-1.5 text-xs font-bold text-black outline-none"
                >
                  {SHIPPING_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.germanName} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Stadt</label>
                <input
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  placeholder="z. B. Berlin"
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-black rounded-lg px-2.5 py-1.5 text-xs font-medium text-black outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">PLZ (optional)</label>
                <input
                  type="text"
                  value={newCityPostcode}
                  onChange={(e) => setNewCityPostcode(e.target.value)}
                  placeholder="z. B. 10115"
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-black rounded-lg px-2.5 py-1.5 text-xs font-medium text-black outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Preis (€)</label>
                <ShippingRateInput
                  value={newCityFee}
                  onChange={setNewCityFee}
                  placeholder="0.00"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Lieferzeit</label>
                <select
                  value={normalizeDeliveryTimeOption(newCityDeliveryTime)}
                  onChange={(e) => setNewCityDeliveryTime(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-black rounded-lg px-2.5 py-1.5 text-xs font-medium text-black outline-none cursor-pointer"
                >
                  <optgroup label="Wochen / Weeks">
                    <option value="Within 1 week">Within 1 week</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-3 weeks">2-3 weeks</option>
                    <option value="3-4 weeks">3-4 weeks</option>
                    <option value="4-5 weeks">4-5 weeks</option>
                    <option value="5-6 weeks">5-6 weeks</option>
                    <option value="6-8 weeks">6-8 weeks</option>
                  </optgroup>
                  <optgroup label="Werktage / Days">
                    <option value="1-2 Werktage">1-2 Werktage</option>
                    <option value="2-4 Werktage">2-4 Werktage</option>
                    <option value="3-5 Werktage">3-5 Werktage</option>
                  </optgroup>
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddCityRate}
                className="px-3.5 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 self-end h-[34px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Hinzufügen</span>
              </button>
            </div>
          </div>

          {/* Configured City Rates Table */}
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs divide-y divide-neutral-100">
            <div className="bg-neutral-50 px-4 py-2.5 grid grid-cols-12 gap-3 text-[11px] font-heading font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
              <div className="col-span-4">Stadt / PLZ</div>
              <div className="col-span-3">Land</div>
              <div className="col-span-2 text-right">Preis (€)</div>
              <div className="col-span-2">Lieferzeit</div>
              <div className="col-span-1 text-right">Aktion</div>
            </div>

            {(!settings.cityRates || settings.cityRates.length === 0) ? (
              <div className="p-6 text-center">
                <p className="text-xs font-semibold text-neutral-500">Keine Stadt-Tarife hinterlegt</p>
              </div>
            ) : (
              settings.cityRates.map((c) => {
                const country = SHIPPING_COUNTRIES.find((sc) => sc.code === c.countryCode);
                return (
                  <div key={c.id} className="px-4 py-3 grid grid-cols-12 gap-3 items-center hover:bg-neutral-50 transition-colors">
                    <div className="col-span-4 font-heading font-black text-sm text-black flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{c.cityName || "—"}</span>
                      {c.postalCode && (
                        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">
                          {c.postalCode}
                        </span>
                      )}
                    </div>

                    <div className="col-span-3 text-xs font-medium text-neutral-600 flex items-center gap-1.5">
                      <span>{country?.flag || "🏳️"}</span>
                      <span>{country?.germanName || c.countryCode}</span>
                    </div>

                    <div className="col-span-2 text-right font-heading font-black text-sm text-black">
                      {Number(c.fee) === 0 ? (
                        <span className="text-emerald-700 font-bold">Kostenlos (€0,00)</span>
                      ) : (
                        `€${Number(c.fee).toFixed(2)}`
                      )}
                    </div>

                    <div className="col-span-2 text-xs font-medium text-neutral-600">
                      {c.deliveryTime || "1-2 Werktage"}
                    </div>

                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteCityRate(c.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: GENERAL STANDARD ZONES */}
      {activeMainView === "general" && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-2xs space-y-3">
            <h2 className="text-xs font-heading font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>Standard-Zonen</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Germany Zone */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇩🇪</span>
                  <span className="font-heading font-bold text-xs text-black">Deutschland</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Preis (€)</label>
                  <ShippingRateInput
                    value={getDraftRate(
                      "general:germanyShippingFee",
                      settings.germanyShippingFee ?? 0
                    )}
                    onChange={(val) =>
                      setDraftRate("general:germanyShippingFee", val)
                    }
                    placeholder="0.00"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Weitere Artikel (€)</label>
                  <ShippingRateInput
                    value={getDraftRate(
                      "general:germanyAdditionalFee",
                      settings.germanyAdditionalFee !== undefined ? settings.germanyAdditionalFee : 0
                    )}
                    onChange={(val) =>
                      setDraftRate("general:germanyAdditionalFee", val)
                    }
                    placeholder="0.00"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Lieferzeit</label>
                  <input
                    type="text"
                    value={settings.germanyDeliveryTime}
                    onChange={(e) => setSettings({ ...settings, germanyDeliveryTime: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              {/* Europe Zone */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇪🇺</span>
                  <span className="font-heading font-bold text-xs text-black">Europa</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Preis (€)</label>
                  <ShippingRateInput
                    value={getDraftRate(
                      "general:euShippingFee",
                      settings.euShippingFee ?? 9.95
                    )}
                    onChange={(val) =>
                      setDraftRate("general:euShippingFee", val)
                    }
                    placeholder="9.95"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Weitere Artikel (€)</label>
                  <ShippingRateInput
                    value={getDraftRate(
                      "general:euAdditionalFee",
                      settings.euAdditionalFee !== undefined ? settings.euAdditionalFee : 2.0
                    )}
                    onChange={(val) =>
                      setDraftRate("general:euAdditionalFee", val)
                    }
                    placeholder="2.00"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Lieferzeit</label>
                  <input
                    type="text"
                    value={settings.euDeliveryTime}
                    onChange={(e) => setSettings({ ...settings, euDeliveryTime: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              {/* International Zone */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌐</span>
                  <span className="font-heading font-bold text-xs text-black">Weltweit</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Preis (€)</label>
                  <ShippingRateInput
                    value={getDraftRate(
                      "general:internationalShippingFee",
                      settings.internationalShippingFee ?? 14.95
                    )}
                    onChange={(val) =>
                      setDraftRate("general:internationalShippingFee", val)
                    }
                    placeholder="14.95"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Weitere Artikel (€)</label>
                  <ShippingRateInput
                    value={getDraftRate(
                      "general:internationalAdditionalFee",
                      settings.internationalAdditionalFee !== undefined ? settings.internationalAdditionalFee : 3.0
                    )}
                    onChange={(val) =>
                      setDraftRate("general:internationalAdditionalFee", val)
                    }
                    placeholder="3.00"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Lieferzeit</label>
                  <input
                    type="text"
                    value={settings.internationalDeliveryTime}
                    onChange={(e) => setSettings({ ...settings, internationalDeliveryTime: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
