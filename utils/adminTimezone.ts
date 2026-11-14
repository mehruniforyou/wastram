/**
 * Central Timezone & Date Formatting Utilities for IXOS Admin Panel
 * 
 * Automatically detects and formats dates, times, graphs, and order placement times
 * based on the country and timezone where the administrator is currently logged in.
 * Operates entirely in the background with zero manual UI configuration required.
 */

export function getAdminTimeZone(): string {
  if (typeof window === "undefined") return "Europe/Berlin";
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Berlin";
  } catch {
    return "Europe/Berlin";
  }
}

export function getTimeZoneAbbreviation(date = new Date(), timeZone?: string): string {
  const tz = timeZone || getAdminTimeZone();
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(date);
    const abbr = parts.find((p) => p.type === "timeZoneName")?.value;
    if (abbr) return abbr;
  } catch {}
  return tz;
}

/**
 * Robustly parses any order or payment date/timestamp representation:
 * - Firestore Timestamp (.toDate(), .seconds, ._seconds)
 * - ISO date-time string ("2026-10-11T17:15:12.028Z")
 * - Plain calendar date ("2026-10-11")
 * - Unix timestamp in ms
 */
export function parseOrderTimestamp(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;

  // Firestore Timestamp object
  if (typeof val === "object") {
    if (typeof val.toDate === "function") {
      try {
        const d = val.toDate();
        if (!isNaN(d.getTime())) return d;
      } catch {}
    }
    if (typeof val._seconds === "number") {
      const d = new Date(val._seconds * 1000);
      if (!isNaN(d.getTime())) return d;
    }
    if (typeof val.seconds === "number") {
      const d = new Date(val.seconds * 1000);
      if (!isNaN(d.getTime())) return d;
    }
  }

  // String handling
  if (typeof val === "string") {
    const clean = val.trim();
    if (!clean) return null;
    // YYYY-MM-DD plain date without time: anchor at local noon to prevent day-slip in any timezone
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      return new Date(clean + "T12:00:00");
    }
    const d = new Date(clean);
    if (!isNaN(d.getTime())) return d;
  }

  // Numeric timestamp in milliseconds
  if (typeof val === "number") {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
}

/**
 * Returns YYYY-MM-DD date string in the administrator's local timezone.
 */
export function getAdminLocalDateString(val: any, timeZone?: string): string {
  const d = parseOrderTimestamp(val);
  if (!d) return "";
  const tz = timeZone || getAdminTimeZone();
  try {
    return d.toLocaleDateString("en-CA", { timeZone: tz });
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

/**
 * Returns today's YYYY-MM-DD string in the administrator's local timezone.
 */
export function getAdminTodayDateString(timeZone?: string): string {
  const tz = timeZone || getAdminTimeZone();
  try {
    return new Date().toLocaleDateString("en-CA", { timeZone: tz });
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Returns the hour (0-23) of the timestamp in the administrator's local timezone.
 * Used for accurate time-slot bucketing in trend graphs.
 */
export function getAdminLocalHour(val: any, timeZone?: string): number {
  const d = parseOrderTimestamp(val);
  if (!d) return 12;
  const tz = timeZone || getAdminTimeZone();
  try {
    const hourStr = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      hour12: false,
    }).format(d);
    return parseInt(hourStr, 10) || 0;
  } catch {
    return d.getHours();
  }
}

/**
 * Comprehensive date and time formatter for orders and transactions.
 * Returns date, time, and combined string formatted in the admin's local timezone.
 */
export function formatAdminOrderDateTime(
  val: any,
  timeZone?: string,
  locale: string = "de-DE"
): { date: string; time: string; full: string; tzAbbr: string } {
  const d = parseOrderTimestamp(val);
  const tz = timeZone || getAdminTimeZone();
  const tzAbbr = getTimeZoneAbbreviation(d || new Date(), tz);

  if (!d) {
    return { date: "—", time: "", full: "—", tzAbbr };
  }

  const hasExplicitTime =
    typeof val === "string" ? val.includes("T") || val.includes(":") : true;

  try {
    const date = d.toLocaleDateString(locale, {
      timeZone: tz,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (!hasExplicitTime) {
      return { date, time: "", full: date, tzAbbr };
    }

    const time = d.toLocaleTimeString(locale, {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const full = `${date}, ${time} Uhr`;
    return { date, time: `${time} Uhr`, full, tzAbbr };
  } catch {
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return { date, time, full: `${date}, ${time}`, tzAbbr };
  }
}

/**
 * Returns human-friendly relative time (e.g. "Gerade eben", "vor 15 Min.", "vor 2 Std.")
 */
export function formatAdminRelativeTime(dateInput: any, locale: string = "de-DE"): string {
  const d = parseOrderTimestamp(dateInput);
  if (!d) return "—";
  const now = Date.now();
  const diffMs = Math.max(0, now - d.getTime());
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 2) return "Gerade eben";
  if (diffMins < 60) return `vor ${diffMins} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays === 1) return "Gestern";
  if (diffDays < 7) return `vor ${diffDays} Tagen`;

  const tz = getAdminTimeZone();
  return d.toLocaleDateString(locale, { timeZone: tz, month: "short", day: "numeric" });
}
