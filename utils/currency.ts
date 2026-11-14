/**
 * Currency Formatting Utility for IXOS Webshop
 * Default currency: Euros (€)
 */

export const CURRENCY_SYMBOL = "€";

export function formatPrice(
  amount: number,
  symbol = "€",
  rate = 1.0,
  currencyCode = "EUR"
): string {
  const converted = amount * rate;
  if (currencyCode === "JPY") {
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }
  if (currencyCode === "CHF") {
    return `${symbol} ${converted.toFixed(2)}`;
  }
  return `${symbol}${converted.toFixed(2)}`;
}

export function formatPriceCompact(
  amount: number,
  symbol = "€",
  rate = 1.0,
  currencyCode = "EUR"
): string {
  const converted = amount * rate;
  if (currencyCode === "CHF") {
    return `${symbol} ${Math.round(converted)}`;
  }
  return `${symbol}${Math.round(converted)}`;
}
