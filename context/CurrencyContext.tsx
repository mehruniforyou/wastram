"use client";

import React, { createContext, useContext, useState } from "react";

export interface ExchangeRates {
  [key: string]: number;
}

export const CURRENCY_DETAILS = {
  INR: { symbol: "₹", label: "Indian Rupee", flag: "🇮🇳", locale: "en-IN" },
  USD: { symbol: "$", label: "US Dollar", flag: "🇺🇸", locale: "en-US" },
  EUR: { symbol: "€", label: "Euro", flag: "🇪🇺", locale: "en-DE" },
  GBP: { symbol: "£", label: "British Pound", flag: "🇬🇧", locale: "en-GB" },
  AUD: { symbol: "A$", label: "Australian Dollar", flag: "🇦🇺", locale: "en-AU" },
  CAD: { symbol: "C$", label: "Canadian Dollar", flag: "🇨🇦", locale: "en-CA" },
  JPY: { symbol: "¥", label: "Japanese Yen", flag: "🇯🇵", locale: "ja-JP" },
  CNY: { symbol: "¥", label: "Chinese Yuan", flag: "🇨🇳", locale: "zh-CN" },
  PLN: { symbol: "zł", label: "Polish Złoty", flag: "🇵🇱", locale: "pl-PL" }
};

export type CurrencyCode = keyof typeof CURRENCY_DETAILS;

export const DEFAULT_RATES: ExchangeRates = {
  INR: 1.0,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  CNY: 0.086,
  JPY: 1.85,
  AUD: 0.018,
  CAD: 0.016,
  PLN: 0.048
};

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  convertPrice: (priceStr: string) => string;
  convertAmount: (amount: number, fromCurrency?: string, toCurrency?: string) => number;
  formatAmount: (amount: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number; fromCurrency?: string }) => string;
  rates: ExchangeRates;
  symbol: string;
  currencyDetails: typeof CURRENCY_DETAILS;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default currency is INR across Wastram Atelier
  const [currency, setCurrencyState] = useState<string>("INR");
  const currentSymbol = "₹";

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
  };

  const convertAmount = (amount: number, _fromCurr: string = "INR", _toCurr: string = "INR"): number => {
    if (isNaN(amount) || amount === null || amount === undefined) return 0;
    return amount;
  };

  const formatAmount = (
    amount: number,
    options?: { minimumFractionDigits?: number; maximumFractionDigits?: number; fromCurrency?: string }
  ): string => {
    if (isNaN(amount) || amount === null || amount === undefined) return `₹0`;
    
    let minDec = options?.minimumFractionDigits !== undefined ? options.minimumFractionDigits : 0;
    let maxDec = options?.maximumFractionDigits !== undefined ? options.maximumFractionDigits : 0;

    try {
      const formatted = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: minDec,
        maximumFractionDigits: maxDec
      }).format(amount);

      return `₹${formatted}`;
    } catch {
      return `₹${amount.toFixed(maxDec)}`;
    }
  };

  const convertPrice = (priceStr: string): string => {
    if (!priceStr) return "₹0";
    const numMatch = priceStr.match(/[\d.]+/);
    if (!numMatch) return priceStr;
    const num = parseFloat(numMatch[0]);
    if (isNaN(num)) return priceStr;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertPrice,
        convertAmount,
        formatAmount,
        rates: DEFAULT_RATES,
        symbol: currentSymbol,
        currencyDetails: CURRENCY_DETAILS
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    return {
      currency: "INR",
      setCurrency: () => {},
      convertPrice: (p: string) => p ? `₹${p}` : "₹0",
      convertAmount: (a: number) => a,
      formatAmount: (a: number) => `₹${Math.round(a).toLocaleString("en-IN")}`,
      rates: DEFAULT_RATES,
      symbol: "₹",
      currencyDetails: CURRENCY_DETAILS
    };
  }
  return context;
};
