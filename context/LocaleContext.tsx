"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Country, COUNTRIES, DEFAULT_COUNTRY } from "@/data/countries";
import { TRANSLATIONS, SupportedLanguage } from "@/data/translations";
import {
  getLocalizedProductName,
  getLocalizedProductDescription,
  getLocalizedCategoryName,
  getLocalizedCategoryDescription,
} from "@/utils/productLocalization";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  countryCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", countryCode: "DE" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", countryCode: "GB" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷", countryCode: "GR" },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = "de";

interface LocaleContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  supportedLanguages: LanguageOption[];
  country: Country;
  setCountry: (countryCode: string) => void;
  currency: string;
  currencySymbol: string;
  exchangeRate: number;
  freeShippingThreshold: number;
  formatPrice: (eurAmount: number) => string;
  formatPriceCompact: (eurAmount: number) => string;
  convertPrice: (eurAmount: number) => number;
  t: (key: string, replacements?: Record<string, string | number>, defaultText?: string) => string;
  getProductName: (product: any) => string;
  getProductDescription: (product: any, type?: "short" | "long") => string;
  getCategoryName: (category: any) => string;
  getCategoryDescription: (category: any) => string;
  availableCountries: Country[];
}

const LANGUAGE_SESSION_KEY = "ixos_session_language";
const LEGACY_STORAGE_KEY = "ixos_selected_language";
const LEGACY_COUNTRY_KEY = "ixos_selected_country_code";

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== "undefined") {
      try {
        // Clean up legacy permanent storage so previous visits don't lock the user
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        localStorage.removeItem(LEGACY_COUNTRY_KEY);

        // If user lands directly on homepage / from outside, always reset to German
        const isExternalOrDirect =
          !document.referrer || !document.referrer.includes(window.location.host);
        if (isExternalOrDirect && window.location.pathname === "/") {
          sessionStorage.removeItem(LANGUAGE_SESSION_KEY);
          return DEFAULT_LANGUAGE; // "de"
        }

        const sessionLang = sessionStorage.getItem(LANGUAGE_SESSION_KEY);
        if (sessionLang === "de" || sessionLang === "en" || sessionLang === "el") {
          return sessionLang as SupportedLanguage;
        }
      } catch (_) {}
    }
    return DEFAULT_LANGUAGE; // "de"
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize language on client mount: wipe legacy localStorage and verify session
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem(LEGACY_COUNTRY_KEY);

      const isExternalOrDirect =
        !document.referrer || !document.referrer.includes(window.location.host);
      if (isExternalOrDirect && window.location.pathname === "/") {
        sessionStorage.removeItem(LANGUAGE_SESSION_KEY);
        setLanguageState(DEFAULT_LANGUAGE);
      } else {
        const sessionLang = sessionStorage.getItem(LANGUAGE_SESSION_KEY);
        if (sessionLang === "de" || sessionLang === "en" || sessionLang === "el") {
          setLanguageState(sessionLang as SupportedLanguage);
        } else {
          setLanguageState(DEFAULT_LANGUAGE);
        }
      }
    } catch (e) {
      console.error("Failed to read session language", e);
    }
    setIsHydrated(true);
  }, []);

  // Update document html lang attribute
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      // Store only in sessionStorage for the active visit
      sessionStorage.setItem(LANGUAGE_SESSION_KEY, lang);
      // Ensure no permanent localStorage override exists
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem(LEGACY_COUNTRY_KEY);
    } catch (e) {
      console.error("Failed to persist session language", e);
    }
  }, []);

  // Backward compatibility adapter for setCountry
  const setCountry = useCallback((countryCode: string) => {
    const code = countryCode.toUpperCase();
    if (code === "GR") {
      setLanguage("el");
    } else if (code === "GB" || code === "US" || code === "CA" || code === "AU") {
      setLanguage("en");
    } else {
      setLanguage("de");
    }
  }, [setLanguage]);

  // Country representation corresponding to current language
  const country: Country =
    language === "el"
      ? COUNTRIES.find((c) => c.code === "GR") || DEFAULT_COUNTRY
      : language === "en"
      ? COUNTRIES.find((c) => c.code === "GB") || DEFAULT_COUNTRY
      : DEFAULT_COUNTRY;

  // Currency is permanently and unconditionally EUR
  const currency = "EUR";
  const currencySymbol = "€";
  const exchangeRate = 1.0;
  const freeShippingThreshold = 75;

  const convertPrice = useCallback((eurAmount: number): number => {
    return eurAmount;
  }, []);

  const formatPrice = useCallback((eurAmount: number): string => {
    return `€${(eurAmount || 0).toFixed(2)}`;
  }, []);

  const formatPriceCompact = useCallback((eurAmount: number): string => {
    return `€${Math.round(eurAmount || 0)}`;
  }, []);

  const getProductName = useCallback(
    (product: any): string => {
      return getLocalizedProductName(product, language);
    },
    [language]
  );

  const getProductDescription = useCallback(
    (product: any, type: "short" | "long" = "long"): string => {
      return getLocalizedProductDescription(product, language, type);
    },
    [language]
  );

  const getCategoryName = useCallback(
    (category: any): string => {
      return getLocalizedCategoryName(category, language);
    },
    [language]
  );

  const getCategoryDescription = useCallback(
    (category: any): string => {
      return getLocalizedCategoryDescription(category, language);
    },
    [language]
  );

  // Translation helper with primary active dictionary, German/English fallbacks & variable replacement
  const t = useCallback(
    (key: string, replacements?: Record<string, string | number>, defaultText?: string): string => {
      const activeDict = TRANSLATIONS[language] || TRANSLATIONS.de;
      const keyUnderscore = key.replace(/-/g, "_");
      const keyHyphen = key.replace(/_/g, "-");

      // Check active dictionary
      let text =
        activeDict[key] ||
        activeDict[keyUnderscore] ||
        activeDict[keyHyphen];

      if (!text) {
        if (language === "de") {
          text =
            TRANSLATIONS.de[key] ||
            TRANSLATIONS.de[keyUnderscore] ||
            TRANSLATIONS.de[keyHyphen] ||
            defaultText ||
            TRANSLATIONS.en[key] ||
            TRANSLATIONS.en[keyUnderscore] ||
            TRANSLATIONS.en[keyHyphen] ||
            key;
        } else if (language === "el") {
          text =
            (TRANSLATIONS.el && (TRANSLATIONS.el[key] || TRANSLATIONS.el[keyUnderscore] || TRANSLATIONS.el[keyHyphen])) ||
            TRANSLATIONS.en[key] ||
            TRANSLATIONS.en[keyUnderscore] ||
            TRANSLATIONS.en[keyHyphen] ||
            TRANSLATIONS.de[key] ||
            TRANSLATIONS.de[keyUnderscore] ||
            TRANSLATIONS.de[keyHyphen] ||
            defaultText ||
            key;
        } else {
          // English
          text =
            TRANSLATIONS.en[key] ||
            TRANSLATIONS.en[keyUnderscore] ||
            TRANSLATIONS.en[keyHyphen] ||
            defaultText ||
            TRANSLATIONS.de[key] ||
            TRANSLATIONS.de[keyUnderscore] ||
            TRANSLATIONS.de[keyHyphen] ||
            key;
        }
      }

      if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        });
      }
      return text;
    },
    [language]
  );

  return (
    <LocaleContext.Provider
      value={{
        language,
        setLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        country,
        setCountry,
        currency,
        currencySymbol,
        exchangeRate,
        freeShippingThreshold,
        formatPrice,
        formatPriceCompact,
        convertPrice,
        t,
        getProductName,
        getProductDescription,
        getCategoryName,
        getCategoryDescription,
        availableCountries: COUNTRIES,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
