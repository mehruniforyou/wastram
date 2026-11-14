/**
 * Utility for generating SEO-friendly, clean URL slugs automatically from product names.
 *
 * Example:
 * " Test Product IX-0007 Part 23 " -> "Test-Product-IX-0007-Part-23"
 */

export function generateProductSlug(name: string): string {
  if (!name || typeof name !== "string") return "";

  const umlautMap: Record<string, string> = {
    ä: "ae",
    ö: "oe",
    ü: "ue",
    Ä: "Ae",
    Ö: "Oe",
    Ü: "Ue",
    ß: "ss",
  };

  const withUmlauts = name.replace(/[äöüÄÖÜß]/g, (match) => umlautMap[match] || match);

  return withUmlauts
    .trim()
    // Convert slashes, backslashes, underscores, and consecutive spaces to single hyphens
    .replace(/[\s/\\_]+/g, "-")
    // Keep letters, digits, and hyphens (stripping unsafe URL symbols like punctuation, quotes, etc.)
    .replace(/[^a-zA-Z0-9-]/g, "")
    // Collapse any repeated hyphens into a single hyphen
    .replace(/-+/g, "-")
    // Strip leading or trailing hyphens
    .replace(/^-|-$/g, "");
}
