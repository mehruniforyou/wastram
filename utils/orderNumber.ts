/**
 * Standard IXOS Order Serial Number Formatter & Generator
 * Prefix: "IXOS-"
 * Defined serial format: IXOS-2026001, IXOS-2026002, IXOS-2026003, ...
 * Format: IXOS-<Year><3+ digits sequence> (e.g. IXOS-2026001)
 */

export const ORDER_PREFIX = "IXOS-";
export const DEFAULT_ORDER_YEAR = 2026;

/**
 * Generate sequential order number: IXOS-2026001, IXOS-2026002, etc.
 */
export function generateOrderSerialNumber(sequence: number = 1, year: number = DEFAULT_ORDER_YEAR): string {
  const safeSeq = Math.max(1, Math.floor(sequence));
  const seqStr = String(safeSeq).padStart(3, "0");
  return `IXOS-${year}${seqStr}`;
}

/**
 * Parse an order number to extract year and sequence number.
 * e.g. "IXOS-2026001" -> { year: 2026, sequence: 1 }
 */
export function parseOrderSerialNumber(rawId?: any): { year: number; sequence: number } | null {
  if (!rawId) return null;
  const str = String(
    typeof rawId === "object"
      ? rawId.order_number || rawId.orderId || rawId.orderNumber || rawId.id || ""
      : rawId
  ).trim();

  // Matches IXOS-2026001, IXOS-2026002, IXOS-2026045, etc.
  const match = str.match(/^IXOS[-_\s]?(20\d\d)(\d{3,})$/i);
  if (match) {
    return {
      year: parseInt(match[1], 10),
      sequence: parseInt(match[2], 10),
    };
  }

  // Matches pure numbers like 2026001
  const pureNumMatch = str.match(/^(20\d\d)(\d{3,})$/);
  if (pureNumMatch) {
    return {
      year: parseInt(pureNumMatch[1], 10),
      sequence: parseInt(pureNumMatch[2], 10),
    };
  }

  return null;
}

/**
 * Format any order identifier into the standard IXOS-2026XXX serial format.
 */
export function formatOrderSerialNumber(rawId?: any, indexFallback?: number): string {
  if (!rawId) {
    if (indexFallback !== undefined && indexFallback !== null) {
      return generateOrderSerialNumber(Number(indexFallback) + 1);
    }
    return generateOrderSerialNumber(1);
  }

  const str = String(
    typeof rawId === "object"
      ? rawId.order_number || rawId.orderId || rawId.orderNumber || rawId.id || ""
      : rawId
  ).trim();

  if (!str) {
    if (indexFallback !== undefined && indexFallback !== null) {
      return generateOrderSerialNumber(Number(indexFallback) + 1);
    }
    return generateOrderSerialNumber(1);
  }

  // Check if already in standard IXOS-2026001 format
  const parsed = parseOrderSerialNumber(str);
  if (parsed) {
    return generateOrderSerialNumber(parsed.sequence, parsed.year);
  }

  // If already prefixed: e.g. IXOS-2026001
  const cleanMatch = str.match(/^IXOS[-_\s]?([0-9A-Z]{4,8})$/i);
  if (cleanMatch) {
    return `IXOS-${cleanMatch[1].toUpperCase()}`;
  }

  // Variations like IXOS-SMP-123456 or IXOS-ORD-123456
  const prefixMatch = str.match(/^IXOS[-_](?:SMP|ORD|INV|DOC|TXN)[-_]?([0-9A-Z]+)$/i);
  if (prefixMatch) {
    return `IXOS-${prefixMatch[1].toUpperCase()}`;
  }

  // If contains digits
  const digits = str.replace(/\D/g, "");
  if (digits.startsWith("2026") && digits.length >= 7) {
    return `IXOS-${digits}`;
  }
  if (digits.length >= 7) {
    return `IXOS-${digits}`;
  }

  // If simple short sequence number like "1", "2"
  if (digits.length > 0 && digits.length <= 4) {
    return generateOrderSerialNumber(parseInt(digits, 10));
  }

  if (indexFallback !== undefined && indexFallback !== null) {
    return generateOrderSerialNumber(Number(indexFallback) + 1);
  }

  return `IXOS-${str.toUpperCase()}`;
}

/**
 * Asynchronously fetch the next sequential order number from the server API,
 * with fallback to local sequence counter.
 */
export async function fetchNextOrderSerialNumber(): Promise<string> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/orders/next-number");
      if (res.ok) {
        const data = await res.json();
        if (data && data.nextOrderNumber) {
          try {
            if (data.sequence) {
              localStorage.setItem("ixos_last_order_seq", String(data.sequence));
            }
          } catch (_) {}
          return data.nextOrderNumber;
        }
      }
    } catch (_) {}

    // Fallback to localStorage tracker if offline
    try {
      const last = localStorage.getItem("ixos_last_order_seq");
      const nextSeq = last ? parseInt(last, 10) + 1 : 2;
      localStorage.setItem("ixos_last_order_seq", String(nextSeq));
      return generateOrderSerialNumber(nextSeq);
    } catch (_) {}
  }

  return generateOrderSerialNumber(2);
}
