import productTranslations from "@/data/product_translations.json";
import { SupportedLanguage } from "@/data/translations";

const translationsMap = productTranslations as Record<
  string,
  { de: string; en: string; el: string }
>;

const CATEGORY_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  "recone kits": {
    de: "Recone-Kits",
    en: "Recone Kits",
    el: "Κιτ Recone",
  },
  "rubber surrounds": {
    de: "Original Gummi-Sicken",
    en: "Precision Rubber Surrounds",
    el: "Γνήσιες Αναρτήσεις Καουτσούκ",
  },
  "replacement diaphragms": {
    de: "Ersatz-Diaphragmen",
    en: "Replacement Diaphragms",
    el: "Ανταλλακτικά Διαφράγματα",
  },
  "foam edge kits": {
    de: "Schaumstoff-Sicken",
    en: "Foam Edge Kits",
    el: "Κιτ Αναρτήσεων Αφρού",
  },
  "microphone accessories": {
    de: "Mikrofon-Zubehör & Koffer",
    en: "Microphone Accessories & Cases",
    el: "Αξεσουάρ Μικροφώνων & Βαλίτσες",
  },
  "repair adhesives & glues": {
    de: "Spezialkleber & Akustikdichtstoffe",
    en: "Repair Adhesives & Sealants",
    el: "Ειδικές Κόλλες & Στεγανοποιητικά",
  },
  "speaker parts & accessories": {
    de: "Lautsprecherteile & Zubehör",
    en: "Speaker Parts & Accessories",
    el: "Ανταλλακτικά Ηχείων & Αξεσουάρ",
  },
  "used parts": {
    de: "Gebrauchtteile (Used Parts)",
    en: "Used Parts",
    el: "Μεταχειρισμένα Ανταλλακτικά (Used Parts)",
  },
  "used-parts": {
    de: "Gebrauchtteile (Used Parts)",
    en: "Used Parts",
    el: "Μεταχειρισμένα Ανταλλακτικά (Used Parts)",
  },
  "dust caps": {
    de: "Staubschutzkappen",
    en: "Dust Caps",
    el: "Καλύμματα Σκόνης (Dust Caps)",
  },
  "dust-caps": {
    de: "Staubschutzkappen",
    en: "Dust Caps",
    el: "Καλύμματα Σκόνης (Dust Caps)",
  },
  "surround repair": {
    de: "Sickenreparatur",
    en: "Surround Repair",
    el: "Επισκευή Αναρτήσεων",
  },
  "surround-repair": {
    de: "Sickenreparatur",
    en: "Surround Repair",
    el: "Επισκευή Αναρτήσεων",
  },
  "sickenreparatur": {
    de: "Sickenreparatur",
    en: "Surround Repair",
    el: "Επισκευή Αναρτήσεων",
  },
};

export function translateDynamicProductName(rawName: string, lang: SupportedLanguage): string {
  if (lang === "de" || !rawName) return rawName;

  let s = rawName.replace(/\s+/g, " ").trim();

  if (lang === "en") {
    s = s.replace(/Kleber\s*\((\d+)\s*ML\)\s*für Schaumstoff\s*sicken & Staubschutzkappen/gi, "Speaker Adhesive Glue ($1ml) for Foam Surrounds & Dust Caps");
    s = s.replace(/Kleber\s*\((\d+)\s*ML\)/gi, "Speaker Adhesive Glue ($1ml)");
    s = s.replace(/Staubkappen\s*\(Dustcap\)\s*Lautsprecher\s*Reperatur/gi, "Speaker Repair Dust Caps");
    s = s.replace(/Staubkappen\s*\(Dustcap\)\s*Lautsprecher\s*Reparatur/gi, "Speaker Repair Dust Caps");
    s = s.replace(/Staubschutzkappen/gi, "Dust Caps");
    s = s.replace(/Staubkappen/gi, "Dust Caps");
    s = s.replace(/Original Gummisicken/gi, "Original Rubber Surrounds");
    s = s.replace(/original Dynaudio Gummisicken/gi, "Original Dynaudio Rubber Surrounds");
    s = s.replace(/original Seas Gummisicken/gi, "Original Seas Rubber Surrounds");
    s = s.replace(/Original Schaumstoffsicken/gi, "Original Foam Surrounds");
    s = s.replace(/Original Schaumstoffsicke/gi, "Original Foam Surround");
    s = s.replace(/Gummisicken/gi, "Rubber Surrounds");
    s = s.replace(/Gummi Sicken/gi, "Rubber Surrounds");
    s = s.replace(/Gummi-Sicken/gi, "Rubber Surrounds");
    s = s.replace(/Gummi Lautsprecher\s*sicken/gi, "Rubber Speaker Surrounds");
    s = s.replace(/Schaumstoff\s*Sicken/gi, "Foam Surrounds");
    s = s.replace(/Schaumstoffsicken/gi, "Foam Surrounds");
    s = s.replace(/Schaumstoff-Sicken/gi, "Foam Surrounds");
    s = s.replace(/Schaumstoff Lautsprecher\s*sicken/gi, "Foam Speaker Surrounds");
    s = s.replace(/Textil\s*sicken/gi, "Textile Surrounds");
    s = s.replace(/Lautsprecher\s*sicken/gi, "Speaker Surrounds");
    s = s.replace(/Sickenreparatur/gi, "Surround Repair Kit");
    s = s.replace(/\bSicken\b/g, "Surrounds");
    s = s.replace(/Aftermarket Recone Kit/gi, "Aftermarket Recone Kit");
    s = s.replace(/Aftermarket Diaphragm/gi, "Aftermarket Replacement Diaphragm");
    s = s.replace(/Titan Diaphragma/gi, "Titanium Diaphragm");
    s = s.replace(/Titan Diaphragm/gi, "Titanium Diaphragm");
    s = s.replace(/Diaphragmen/gi, "Diaphragms");
    s = s.replace(/Diaphragma/gi, "Diaphragm");
    s = s.replace(/2HE Schaumstoffinlay/gi, "2U Custom Foam Inlay");
    s = s.replace(/Schaumstoffinlay/gi, "Custom Foam Inlay");
    s = s.replace(/Schaumstoff Inlay/gi, "Custom Foam Inlay");
    s = s.replace(/Schaum Ersatz-Kit/gi, "Foam Replacement Kit");
    s = s.replace(/Schaumstoff Ersatz Kit/gi, "Foam Replacement Kit");
    s = s.replace(/Rahmen für das\s+/gi, "Mounting Frame for ");
    s = s.replace(/\(Case\)/gi, "Flight Case");
    s = s.replace(/Case Für/gi, "Flight Case for");
    s = s.replace(/Tasche \(Bag\)/gi, "Protective Bag");
    s = s.replace(/Passend Für/gi, "Compatible with");
    s = s.replace(/passen Für/gi, "Compatible with");
    s = s.replace(/passend für/gi, "Compatible with");
    s = s.replace(/Passen Für/gi, "Compatible with");
    s = s.replace(/Für das/gi, "for");
    s = s.replace(/Für den/gi, "for");
    s = s.replace(/Für/gi, "for");
    s = s.replace(/für/gi, "for");
    s = s.replace(/\+\s*(\d+)\s*ml\s*kleber/gi, "+ $1ml Glue");
    s = s.replace(/Inkl\s*(\d+)\s*ml\s*Kleber/gi, "Incl. $1ml Glue");
    s = s.replace(/inkl\s*(\d+)\s*ml\s*kleber/gi, "Incl. $1ml Glue");
    s = s.replace(/Inkl\s*Kleber/gi, "Incl. Professional Glue");
    s = s.replace(/inkl\s*kleber/gi, "Incl. Professional Glue");
    s = s.replace(/(\d+)\s*ml\s*Kleber/gi, "Incl. $1ml Glue");
    s = s.replace(/(\d+)\s*ml\s*kleber/gi, "Incl. $1ml Glue");
    s = s.replace(/ohne Kleber/gi, "without Glue");
    s = s.replace(/\bNeu\b/gi, "Brand New");
    s = s.replace(/\bVormontiert\b/gi, "Pre-assembled");
    s = s.replace(/\bVormontier\b/gi, "Pre-assembled");
    s = s.replace(/Taschensende\b/gi, "Transmitter");
    s = s.replace(/Taschensender\b/gi, "Transmitter");
    s = s.replace(/Empfänger\b/gi, "Receiver");
    s = s.replace(/Mikrofonsystem\b/gi, "Microphone System");
    s = s.replace(/Mikrofon\b/gi, "Microphone");
    s = s.replace(/Tieftöner\b/gi, "Woofer");
    s = s.replace(/Mitteltöner\b/gi, "Midrange");
    s = s.replace(/Hochtöner\b/gi, "Tweeter");
    s = s.replace(/4er Einheit\b/gi, "Set of 4");
    s = s.replace(/Lautsprecher\b/gi, "Speaker");
    return s.replace(/\s+/g, " ").trim();
  }

  if (lang === "el") {
    s = s.replace(/Kleber\s*\((\d+)\s*ML\)\s*für Schaumstoff\s*sicken & Staubschutzkappen/gi, "Ειδική Κόλλα Μεγαφώνων ($1ml) για Αναρτήσεις Αφρού & Θόλους Σκόνης");
    s = s.replace(/Kleber\s*\((\d+)\s*ML\)/gi, "Ειδική Κόλλα Μεγαφώνων ($1ml)");
    s = s.replace(/Staubkappen\s*\(Dustcap\)\s*Lautsprecher\s*Reperatur/gi, "Θόλοι Σκόνης (Dust Caps) Μεγαφώνων");
    s = s.replace(/Staubkappen\s*\(Dustcap\)\s*Lautsprecher\s*Reparatur/gi, "Θόλοι Σκόνης (Dust Caps) Μεγαφώνων");
    s = s.replace(/Staubschutzkappen/gi, "Θόλοι Σκόνης");
    s = s.replace(/Staubkappen/gi, "Θόλοι Σκόνης");
    s = s.replace(/Original Gummisicken/gi, "Γνήσιες Αναρτήσεις Καουτσούκ");
    s = s.replace(/original Dynaudio Gummisicken/gi, "Γνήσιες Αναρτήσεις Καουτσούκ Dynaudio");
    s = s.replace(/original Seas Gummisicken/gi, "Γνήσιες Αναρτήσεις Καουτσούκ Seas");
    s = s.replace(/Original Schaumstoffsicken/gi, "Γνήσιες Αναρτήσεις Αφρού");
    s = s.replace(/Original Schaumstoffsicke/gi, "Γνήσια Ανάρτηση Αφρού");
    s = s.replace(/Gummisicken/gi, "Αναρτήσεις Καουτσούκ");
    s = s.replace(/Gummi Sicken/gi, "Αναρτήσεις Καουτσούκ");
    s = s.replace(/Gummi-Sicken/gi, "Αναρτήσεις Καουτσούκ");
    s = s.replace(/Gummi Lautsprecher\s*sicken/gi, "Αναρτήσεις Καουτσούκ Μεγαφώνων");
    s = s.replace(/Schaumstoff\s*Sicken/gi, "Αναρτήσεις Αφρού");
    s = s.replace(/Schaumstoffsicken/gi, "Αναρτήσεις Αφρού");
    s = s.replace(/Schaumstoff-Sicken/gi, "Αναρτήσεις Αφρού");
    s = s.replace(/Schaumstoff Lautsprecher\s*sicken/gi, "Αναρτήσεις Αφρού Μεγαφώνων");
    s = s.replace(/Textil\s*sicken/gi, "Υφασμάτινες Αναρτήσεις");
    s = s.replace(/Lautsprecher\s*sicken/gi, "Αναρτήσεις Μεγαφώνων");
    s = s.replace(/Sickenreparatur/gi, "Σετ Επισκευής Αναρτήσεων");
    s = s.replace(/\bSicken\b/g, "Αναρτήσεις");
    s = s.replace(/Aftermarket Recone Kit/gi, "Κιτ Recone Aftermarket");
    s = s.replace(/Aftermarket Diaphragm/gi, "Ανταλλακτικό Διάφραγμα Aftermarket");
    s = s.replace(/Titan Diaphragma/gi, "Διάφραγμα Τιτανίου");
    s = s.replace(/Titan Diaphragm/gi, "Διάφραγμα Τιτανίου");
    s = s.replace(/Diaphragmen/gi, "Διαφράγματα");
    s = s.replace(/Diaphragma/gi, "Διάφραγμα");
    s = s.replace(/2HE Schaumstoffinlay/gi, "Ένθετο Αφρού 2U Laser-Cut");
    s = s.replace(/Schaumstoffinlay/gi, "Ένθετο Αφρού Laser-Cut");
    s = s.replace(/Schaumstoff Inlay/gi, "Ένθετο Αφρού Laser-Cut");
    s = s.replace(/Schaum Ersatz-Kit/gi, "Κιτ Αφρού Αντικατάστασης");
    s = s.replace(/Schaumstoff Ersatz Kit/gi, "Κιτ Αφρού Αντικατάστασης");
    s = s.replace(/Rahmen für das\s+/gi, "Πλαίσιο Στήριξης για ");
    s = s.replace(/\(Case\)/gi, "Βαλίτσα Flight Case");
    s = s.replace(/Case Für/gi, "Βαλίτσα Flight Case για");
    s = s.replace(/Tasche \(Bag\)/gi, "Προστατευτική Θήκη");
    s = s.replace(/Passend Für/gi, "Συμβατό με");
    s = s.replace(/passen Für/gi, "Συμβατό με");
    s = s.replace(/passend für/gi, "Συμβατό με");
    s = s.replace(/Passen Für/gi, "Συμβατό με");
    s = s.replace(/Für das/gi, "για");
    s = s.replace(/Für den/gi, "για");
    s = s.replace(/Für/gi, "για");
    s = s.replace(/für/gi, "για");
    s = s.replace(/\+\s*(\d+)\s*ml\s*kleber/gi, "+ $1ml Κόλλα");
    s = s.replace(/Inkl\s*(\d+)\s*ml\s*Kleber/gi, "με $1ml Κόλλα");
    s = s.replace(/inkl\s*(\d+)\s*ml\s*kleber/gi, "με $1ml Κόλλα");
    s = s.replace(/Inkl\s*Kleber/gi, "με Επαγγελματική Κόλλα");
    s = s.replace(/inkl\s*kleber/gi, "με Επαγγελματική Κόλλα");
    s = s.replace(/(\d+)\s*ml\s*Kleber/gi, "με $1ml Κόλλα");
    s = s.replace(/(\d+)\s*ml\s*kleber/gi, "με $1ml Κόλλα");
    s = s.replace(/ohne Kleber/gi, "χωρίς Κόλλα");
    s = s.replace(/\bNeu\b/gi, "Καινούργιο");
    s = s.replace(/\bVormontiert\b/gi, "Προσυναρμολογημένο");
    s = s.replace(/\bVormontier\b/gi, "Προσυναρμολογημένο");
    s = s.replace(/Taschensende\b/gi, "Πομπός");
    s = s.replace(/Taschensender\b/gi, "Πομπός");
    s = s.replace(/Empfänger\b/gi, "Δέκτης");
    s = s.replace(/Mikrofonsystem\b/gi, "Σύστημα Μικροφώνου");
    s = s.replace(/Mikrofon\b/gi, "Μικρόφωνο");
    s = s.replace(/Tieftöner\b/gi, "Woofer");
    s = s.replace(/Mitteltöner\b/gi, "Midrange");
    s = s.replace(/Hochtöner\b/gi, "Tweeter");
    s = s.replace(/4er Einheit\b/gi, "Σετ 4 τεμαχίων");
    s = s.replace(/Lautsprecher\b/gi, "Μεγάφωνο");
    return s.replace(/\s+/g, " ").trim();
  }

  return rawName;
}

export function getLocalizedProductName(
  product: { id?: string; name: string; translations?: Record<string, any> } | any,
  lang: SupportedLanguage = "de"
): string {
  if (!product) return "";
  if (lang === "de") {
    return product.translations?.de?.name || product.name || "";
  }

  // 1. Check direct attached translations (from API / Firestore / Admin)
  if (product.translations?.[lang]?.name) {
    return product.translations[lang].name;
  }

  // 2. Client-side localStorage override check (for instant preview in admin browser)
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("ixos_products_overrides");
      if (stored) {
        const overrides = JSON.parse(stored);
        const key = product.id || product.slug;
        const ov = key ? overrides[key] : null;
        if (ov?.translations?.[lang]?.name) {
          return ov.translations[lang].name;
        }
      }
    } catch (_) {}
  }

  // 3. Static product translation dictionary lookup
  if (product.id && translationsMap[product.id]) {
    const entry = translationsMap[product.id];
    if (entry[lang]) return entry[lang];
  }

  // 4. Fallback to algorithmic rule-based translater
  return translateDynamicProductName(product.name, lang);
}

export function cleanProductDescriptionHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<li[^>]*>\s*<strong>\s*(?:Compatible Manufacturer \/ Brand|Compatible Manufacturer|Manufacturer \/ Brand|Hersteller \/ Marke|Hersteller|Marke|Brand)\s*:?\s*<\/strong>[^<]*<\/li>/gi, "")
    .replace(/<li[^>]*>\s*<strong>\s*(?:Target Fitment|Fitment|Passend für|Passend fuer|Suitable for|Suitable for Brand|Kompatibel mit)\s*:?\s*<\/strong>[^<]*<\/li>/gi, "")
    .replace(/<li[^>]*>\s*(?:Compatible Manufacturer \/ Brand|Compatible Manufacturer|Manufacturer \/ Brand|Hersteller \/ Marke|Target Fitment|Passend für)\s*:[^<]*<\/li>/gi, "");
}

export function getLocalizedProductDescription(
  product: any,
  lang: SupportedLanguage = "de",
  type: "short" | "long" = "long"
): string {
  if (!product) return "";

  let raw = "";
  if (lang === "de") {
    if (type === "short") {
      raw = product.translations?.de?.short_desc || product.short_desc || product.shortDescription || "";
    } else {
      raw = product.translations?.de?.long_desc || product.long_desc || product.descriptionHtml || "";
    }
  } else if (product.translations?.[lang]) {
    const t = product.translations[lang];
    if (type === "short" && (t.short_desc || t.shortDescription)) {
      raw = t.short_desc || t.shortDescription;
    } else if (type === "long" && (t.long_desc || t.descriptionHtml)) {
      raw = t.long_desc || t.descriptionHtml;
    }
  }

  // 2. Client-side localStorage override check
  if (!raw && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("ixos_products_overrides");
      if (stored) {
        const overrides = JSON.parse(stored);
        const key = product.id || product.slug;
        const ov = key ? overrides[key] : null;
        if (ov?.translations?.[lang]) {
          const t = ov.translations[lang];
          if (type === "short" && (t.short_desc || t.shortDescription)) {
            raw = t.short_desc || t.shortDescription;
          } else if (type === "long" && (t.long_desc || t.descriptionHtml)) {
            raw = t.long_desc || t.descriptionHtml;
          }
        }
      }
    } catch (_) {}
  }

  if (!raw) {
    raw = type === "short"
      ? product.short_desc || product.shortDescription || ""
      : product.long_desc || product.descriptionHtml || "";
    if (type === "short" && lang !== "de" && raw) {
      raw = translateDynamicProductName(raw, lang);
    }
  }

  return type === "long" ? cleanProductDescriptionHtml(raw) : raw;
}

export function getLocalizedCategoryName(
  category: any,
  lang: SupportedLanguage = "de"
): string {
  if (!category) return "";

  // If passed an object with translations
  if (typeof category === "object") {
    if (category.translations?.[lang]?.name) {
      return category.translations[lang].name;
    }
    const catName = category.name || category.id || "";
    const key = catName.toLowerCase().trim();
    if (CATEGORY_TRANSLATIONS[key] && CATEGORY_TRANSLATIONS[key][lang]) {
      return CATEGORY_TRANSLATIONS[key][lang];
    }
    const idKey = String(category.id || "").toLowerCase().trim();
    if (CATEGORY_TRANSLATIONS[idKey] && CATEGORY_TRANSLATIONS[idKey][lang]) {
      return CATEGORY_TRANSLATIONS[idKey][lang];
    }
    if (lang === "de" && category.name) {
      return category.name;
    }
    return catName;
  }

  const str = String(category);
  const key = str.toLowerCase().trim();
  if (CATEGORY_TRANSLATIONS[key] && CATEGORY_TRANSLATIONS[key][lang]) {
    return CATEGORY_TRANSLATIONS[key][lang];
  }
  if (lang === "de") return str;
  return str;
}

export function getLocalizedCategoryDescription(
  category: any,
  lang: SupportedLanguage = "de"
): string {
  if (!category) return "";

  if (typeof category === "object") {
    if (category.translations?.[lang]?.description) {
      return category.translations[lang].description;
    }
    return category.description || "";
  }

  return "";
}

// ─────────────────────────────────────────────────────────────────────────────
// TECHNICAL SPECIFICATIONS LOCALIZATION
// ─────────────────────────────────────────────────────────────────────────────

export const SPEC_KEY_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  // Condition
  "zustand": { de: "Zustand", en: "Condition", el: "Κατάσταση" },
  "condition": { de: "Zustand", en: "Condition", el: "Κατάσταση" },
  "κατάσταση": { de: "Zustand", en: "Condition", el: "Κατάσταση" },

  // Warranty
  "garantie": { de: "Garantie", en: "Warranty", el: "Εγγύηση" },
  "warranty": { de: "Garantie", en: "Warranty", el: "Εγγύηση" },
  "εγγύηση": { de: "Garantie", en: "Warranty", el: "Εγγύηση" },

  // Voice Coil
  "spule durchmesser": { de: "Spule Durchmesser", en: "Voice Coil Diameter", el: "Διάμετρος Πηνίου" },
  "spulendurchmesser": { de: "Spule Durchmesser", en: "Voice Coil Diameter", el: "Διάμετρος Πηνίου" },
  "voice coil": { de: "Spule Durchmesser", en: "Voice Coil Diameter", el: "Διάμετρος Πηνίου" },
  "voice coil diameter": { de: "Spule Durchmesser", en: "Voice Coil Diameter", el: "Διάμετρος Πηνίου" },
  "schwingspule": { de: "Spule Durchmesser", en: "Voice Coil Diameter", el: "Διάμετρος Πηνίου" },
  "διάμετρος πηνίου": { de: "Spule Durchmesser", en: "Voice Coil Diameter", el: "Διάμετρος Πηνίου" },

  // Impedance / Ohm
  "ohm": { de: "Ohm", en: "Ohm", el: "Ohm" },
  "impedanz": { de: "Impedanz", en: "Impedance", el: "Σύνθετη Αντίσταση" },
  "impedance": { de: "Impedanz", en: "Impedance", el: "Σύνθετη Αντίσταση" },
  "σύνθετη αντίσταση": { de: "Impedanz", en: "Impedance", el: "Σύνθετη Αντίσταση" },

  // Power
  "belastbarkeit": { de: "Belastbarkeit", en: "Power Handling", el: "Ισχύς" },
  "power handling": { de: "Belastbarkeit", en: "Power Handling", el: "Ισχύς" },
  "leistung": { de: "Belastbarkeit", en: "Power Handling", el: "Ισχύς" },
  "power": { de: "Belastbarkeit", en: "Power Handling", el: "Ισχύς" },
  "ισχύς": { de: "Belastbarkeit", en: "Power Handling", el: "Ισχύς" },

  // Frequency
  "frequenzbereich": { de: "Frequenzbereich", en: "Frequency Range", el: "Εύρος Συχνοτήτων" },
  "frequenzgang": { de: "Frequenzbereich", en: "Frequency Range", el: "Εύρος Συχνοτήτων" },
  "frequency range": { de: "Frequenzbereich", en: "Frequency Range", el: "Εύρος Συχνοτήτων" },
  "frequency response": { de: "Frequenzbereich", en: "Frequency Range", el: "Εύρος Συχνοτήτων" },
  "εύρος συχνοτήτων": { de: "Frequenzbereich", en: "Frequency Range", el: "Εύρος Συχνοτήτων" },

  // Material
  "material": { de: "Material", en: "Material", el: "Υλικό" },
  "werkstoff": { de: "Material", en: "Material", el: "Υλικό" },
  "υλικό": { de: "Material", en: "Material", el: "Υλικό" },

  // Color
  "farbe": { de: "Farbe", en: "Color", el: "Χρώμα" },
  "color": { de: "Farbe", en: "Color", el: "Χρώμα" },
  "colour": { de: "Farbe", en: "Color", el: "Χρώμα" },
  "χρώμα": { de: "Farbe", en: "Color", el: "Χρώμα" },

  // Diaphragm Material
  "membranmaterial": { de: "Membranmaterial", en: "Diaphragm Material", el: "Υλικό Διαφράγματος" },
  "diaphragm material": { de: "Membranmaterial", en: "Diaphragm Material", el: "Υλικό Διαφράγματος" },
  "cone material": { de: "Membranmaterial", en: "Diaphragm Material", el: "Υλικό Διαφράγματος" },
  "υλικό διαφράγματος": { de: "Membranmaterial", en: "Diaphragm Material", el: "Υλικό Διαφράγματος" },

  // Surround Material
  "sickenmaterial": { de: "Sickenmaterial", en: "Surround Material", el: "Υλικό Ανάρτησης" },
  "surround material": { de: "Sickenmaterial", en: "Surround Material", el: "Υλικό Ανάρτησης" },
  "υλικό ανάρτησης": { de: "Sickenmaterial", en: "Surround Material", el: "Υλικό Ανάρτησης" },

  // Diameters / Dimensions
  "außendurchmesser": { de: "Außendurchmesser", en: "Outer Diameter", el: "Εξωτερική Διάμετρος" },
  "outer diameter": { de: "Außendurchmesser", en: "Outer Diameter", el: "Εξωτερική Διάμετρος" },
  "εξωτερική διάμετρος": { de: "Außendurchmesser", en: "Outer Diameter", el: "Εξωτερική Διάμετρος" },

  "innendurchmesser": { de: "Innendurchmesser", en: "Inner Diameter", el: "Εσωτερική Διάμετρος" },
  "inner diameter": { de: "Innendurchmesser", en: "Inner Diameter", el: "Εσωτερική Διάμετρος" },
  "εσωτερική διάμετρος": { de: "Innendurchmesser", en: "Inner Diameter", el: "Εσωτερική Διάμετρος" },

  "konusdurchmesser": { de: "Konusdurchmesser", en: "Cone Diameter", el: "Διάμετρος Κώνου" },
  "cone diameter": { de: "Konusdurchmesser", en: "Cone Diameter", el: "Διάμετρος Κώνου" },
  "διάμετρος κώνου": { de: "Konusdurchmesser", en: "Cone Diameter", el: "Διάμετρος Κώνου" },

  "wulstdurchmesser": { de: "Wulstdurchmesser", en: "Roll Diameter", el: "Διάμετρος Κύματος" },
  "roll diameter": { de: "Wulstdurchmesser", en: "Roll Diameter", el: "Διάμετρος Κύματος" },
  "διάμετρος κύματος": { de: "Wulstdurchmesser", en: "Roll Diameter", el: "Διάμετρος Κύματος" },

  "wulstbreite": { de: "Wulstbreite", en: "Roll Width", el: "Πλάτος Κύματος" },
  "roll width": { de: "Wulstbreite", en: "Roll Width", el: "Πλάτος Κύματος" },
  "πλάτος κύματος": { de: "Wulstbreite", en: "Roll Width", el: "Πλάτος Κύματος" },

  "abmessungen": { de: "Maße", en: "Dimensions", el: "Διαστάσεις" },
  "maße": { de: "Maße", en: "Dimensions", el: "Διαστάσεις" },
  "masse": { de: "Maße", en: "Dimensions", el: "Διαστάσεις" },
  "dimensions": { de: "Maße", en: "Dimensions", el: "Διαστάσεις" },
  "διαστάσεις": { de: "Maße", en: "Dimensions", el: "Διαστάσεις" },

  "gewicht": { de: "Gewicht", en: "Weight", el: "Βάρος" },
  "weight": { de: "Gewicht", en: "Weight", el: "Βάρος" },
  "βάρος": { de: "Gewicht", en: "Weight", el: "Βάρος" },

  // Package / Origin
  "lieferumfang": { de: "Lieferumfang", en: "Package Includes", el: "Περιεχόμενα Συσκευασίας" },
  "package includes": { de: "Lieferumfang", en: "Package Includes", el: "Περιεχόμενα Συσκευασίας" },
  "scope of delivery": { de: "Lieferumfang", en: "Package Includes", el: "Περιεχόμενα Συσκευασίας" },
  "περιεχόμενα συσκευασίας": { de: "Lieferumfang", en: "Package Includes", el: "Περιεχόμενα Συσκευασίας" },

  "herstellungsland": { de: "Herstellungsland", en: "Country of Manufacture", el: "Χώρα Κατασκευής" },
  "country of manufacture": { de: "Herstellungsland", en: "Country of Manufacture", el: "Χώρα Κατασκευής" },
  "χώρα κατασκευής": { de: "Herstellungsland", en: "Country of Manufacture", el: "Χώρα Κατασκευής" },

  // Part Number / SKU
  "part number": { de: "Artikelnummer", en: "Part Number", el: "Κωδικός Προϊόντος" },
  "artikelnummer": { de: "Artikelnummer", en: "Part Number", el: "Κωδικός Προϊόντος" },
  "teilenummer": { de: "Artikelnummer", en: "Part Number", el: "Κωδικός Προϊόντος" },
  "sku": { de: "SKU", en: "SKU", el: "SKU" },

  // Acoustic parameters
  "dc resistance": { de: "Gleichstromwiderstand (Re)", en: "DC Resistance (Re)", el: "Αντίσταση DC (Re)" },
  "widerstand": { de: "Gleichstromwiderstand (Re)", en: "DC Resistance (Re)", el: "Αντίσταση DC (Re)" },
  "resonant frequency": { de: "Resonanzfrequenz (Fs)", en: "Resonant Frequency (Fs)", el: "Συχνότητα Συντονισμού (Fs)" },
  "resonanzfrequenz": { de: "Resonanzfrequenz (Fs)", en: "Resonant Frequency (Fs)", el: "Συχνότητα Συντονισμού (Fs)" },
  "sensitivity": { de: "Wirkungsgrad", en: "Sensitivity", el: "Ευαισθησία" },
  "wirkungsgrad": { de: "Wirkungsgrad", en: "Sensitivity", el: "Ευαισθησία" },
  "magnet type": { de: "Magnet-Typ", en: "Magnet Type", el: "Τύπος Μαγνήτη" },
  "magnet-typ": { de: "Magnet-Typ", en: "Magnet Type", el: "Τύπος Μαγνήτη" },
  "magnettyp": { de: "Magnet-Typ", en: "Magnet Type", el: "Τύπος Μαγνήτη" },
  "voice coil former": { de: "Schwingspulenträger", en: "Voice Coil Former", el: "Φορέας Πηνίου" },
  "schwingspulenträger": { de: "Schwingspulenträger", en: "Voice Coil Former", el: "Φορέας Πηνίου" },
  "thickness": { de: "Materialstärke", en: "Thickness", el: "Πάχος" },
  "stärke": { de: "Materialstärke", en: "Thickness", el: "Πάχος" },
  "dicke": { de: "Materialstärke", en: "Thickness", el: "Πάχος" },
  "materialstärke": { de: "Materialstärke", en: "Thickness", el: "Πάχος" },
  "mounting depth": { de: "Einbautiefe", en: "Mounting Depth", el: "Βάθος Τοποθέτησης" },
  "einbautiefe": { de: "Einbautiefe", en: "Mounting Depth", el: "Βάθος Τοποθέτησης" },
  "hole spacing": { de: "Lochabstand", en: "Hole Spacing", el: "Απόσταση Οπών" },
  "lochabstand": { de: "Lochabstand", en: "Hole Spacing", el: "Απόσταση Οπών" }
};

export const SPEC_VALUE_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  // Condition
  "neuware": { de: "Neuware", en: "Brand New", el: "Καινούργιο" },
  "neu": { de: "Neuware", en: "Brand New", el: "Καινούργιο" },
  "brand new": { de: "Neuware", en: "Brand New", el: "Καινούργιο" },
  "new": { de: "Neuware", en: "Brand New", el: "Καινούργιο" },
  "καινούργιο": { de: "Neuware", en: "Brand New", el: "Καινούργιο" },
  "gebraucht": { de: "Gebraucht (Geprüft & Funktional)", en: "Used (Tested & Functional)", el: "Μεταχειρισμένο (Ελεγμένο & Λειτουργικό)" },
  "used": { de: "Gebraucht (Geprüft & Funktional)", en: "Used (Tested & Functional)", el: "Μεταχειρισμένο (Ελεγμένο & Λειτουργικό)" },
  "used / gebraucht (tested & functional)": { de: "Gebraucht (Geprüft & Funktional)", en: "Used (Tested & Functional)", el: "Μεταχειρισμένο (Ελεγμένο & Λειτουργικό)" },
  "used (tested & functional)": { de: "Gebraucht (Geprüft & Funktional)", en: "Used (Tested & Functional)", el: "Μεταχειρισμένο (Ελεγμένο & Λειτουργικό)" },
  "μεταχειρισμένο": { de: "Gebraucht (Geprüft & Funktional)", en: "Used (Tested & Functional)", el: "Μεταχειρισμένο (Ελεγμένο & Λειτουργικό)" },

  // Warranties
  "1 jahr werk": { de: "1 Jahr Herstellergarantie", en: "1 Year Factory Warranty", el: "1 Έτος Εργοστασιακή Εγγύηση" },
  "1 year factory": { de: "1 Jahr Herstellergarantie", en: "1 Year Factory Warranty", el: "1 Έτος Εργοστασιακή Εγγύηση" },
  "1 years factory": { de: "1 Jahr Herstellergarantie", en: "1 Year Factory Warranty", el: "1 Έτος Εργοστασιακή Εγγύηση" },
  "1 jahr herstellergarantie": { de: "1 Jahr Herstellergarantie", en: "1 Year Factory Warranty", el: "1 Έτος Εργοστασιακή Εγγύηση" },
  "1 year warranty": { de: "1 Jahr Herstellergarantie", en: "1 Year Factory Warranty", el: "1 Έτος Εργοστασιακή Εγγύηση" },
  "1 jahr garantie": { de: "1 Jahr Herstellergarantie", en: "1 Year Factory Warranty", el: "1 Έτος Εργοστασιακή Εγγύηση" },
  "2 jahre werk": { de: "2 Jahre Herstellergarantie", en: "2 Years Factory Warranty", el: "2 Έτη Εργοστασιακή Εγγύηση" },
  "2 years factory": { de: "2 Jahre Herstellergarantie", en: "2 Years Factory Warranty", el: "2 Έτη Εργοστασιακή Εγγύηση" },
  "2 jahre herstellergarantie": { de: "2 Jahre Herstellergarantie", en: "2 Years Factory Warranty", el: "2 Έτη Εργοστασιακή Εγγύηση" },
  "2 years warranty": { de: "2 Jahre Herstellergarantie", en: "2 Years Factory Warranty", el: "2 Έτη Εργοστασιακή Εγγύηση" },
  "2 jahre garantie": { de: "2 Jahre Herstellergarantie", en: "2 Years Factory Warranty", el: "2 Έτη Εργοστασιακή Εγγύηση" },
  "3 jahre werk": { de: "3 Jahre Herstellergarantie", en: "3 Years Factory Warranty", el: "3 Έτη Εργοστασιακή Εγγύηση" },
  "3 years factory": { de: "3 Jahre Herstellergarantie", en: "3 Years Factory Warranty", el: "3 Έτη Εργοστασιακή Εγγύηση" },
  "5 jahre werk": { de: "5 Jahre Herstellergarantie", en: "5 Years Factory Warranty", el: "5 Έτη Εργοστασιακή Εγγύηση" },
  "5 years factory": { de: "5 Jahre Herstellergarantie", en: "5 Years Factory Warranty", el: "5 Έτη Εργοστασιακή Εγγύηση" },

  // Materials
  "titan": { de: "Titan", en: "Titanium", el: "Τιτάνιο" },
  "titanium": { de: "Titan", en: "Titanium", el: "Τιτάνιο" },
  "τιτάνιο": { de: "Titan", en: "Titanium", el: "Τιτάνιο" },
  "aluminium": { de: "Aluminium", en: "Aluminum", el: "Αλουμίνιο" },
  "aluminum": { de: "Aluminium", en: "Aluminum", el: "Αλουμίνιο" },
  "αλουμίνιο": { de: "Aluminium", en: "Aluminum", el: "Αλουμίνιο" },
  "kupfer": { de: "Kupfer", en: "Copper", el: "Χαλκός" },
  "copper": { de: "Kupfer", en: "Copper", el: "Χαλκός" },
  "χαλκός": { de: "Kupfer", en: "Copper", el: "Χαλκός" },
  "kapton": { de: "Kapton", en: "Kapton", el: "Kapton" },
  "schaumstoff": { de: "Schaumstoff", en: "Foam", el: "Αφρός" },
  "foam": { de: "Schaumstoff", en: "Foam", el: "Αφρός" },
  "αφρός": { de: "Schaumstoff", en: "Foam", el: "Αφρός" },
  "gummi": { de: "Gummi", en: "Rubber", el: "Καουτσούκ" },
  "rubber": { de: "Gummi", en: "Rubber", el: "Καουτσούκ" },
  "καουτσούκ": { de: "Gummi", en: "Rubber", el: "Καουτσούκ" },
  "textil": { de: "Textil", en: "Fabric", el: "Ύφασμα" },
  "gewebe": { de: "Textil", en: "Fabric", el: "Ύφασμα" },
  "fabric": { de: "Textil", en: "Fabric", el: "Ύφασμα" },
  "cloth": { de: "Textil", en: "Fabric", el: "Ύφασμα" },
  "ύφασμα": { de: "Textil", en: "Fabric", el: "Ύφασμα" },
  "papier": { de: "Papier", en: "Paper", el: "Χαρτί" },
  "paper": { de: "Papier", en: "Paper", el: "Χαρτί" },
  "χαρτί": { de: "Papier", en: "Paper", el: "Χαρτί" },

  // Colors
  "schwarz": { de: "Schwarz", en: "Black", el: "Μαύρο" },
  "black": { de: "Schwarz", en: "Black", el: "Μαύρο" },
  "μαύρο": { de: "Schwarz", en: "Black", el: "Μαύρο" },
  "silber": { de: "Silber", en: "Silver", el: "Ασημί" },
  "silver": { de: "Silber", en: "Silver", el: "Ασημί" },
  "ασημί": { de: "Silber", en: "Silver", el: "Ασημί" },
  "grau": { de: "Grau", en: "Grey", el: "Γκρι" },
  "grey": { de: "Grau", en: "Grey", el: "Γκρι" },
  "gray": { de: "Grau", en: "Grey", el: "Γκρι" },
  "γκρι": { de: "Grau", en: "Grey", el: "Γκρι" },

  // Fit & Packaging
  "originalgetreu": { de: "Originalgetreu (OEM)", en: "Exact Fit (OEM)", el: "Ακριβής Εφαρμογή (OEM)" },
  "exact fit": { de: "Originalgetreu (OEM)", en: "Exact Fit (OEM)", el: "Ακριβής Εφαρμογή (OEM)" },
  "oem match": { de: "Originalgetreu (OEM)", en: "Exact Fit (OEM)", el: "Ακριβής Εφαρμογή (OEM)" },
  "universal": { de: "Universal", en: "Universal", el: "Γενικής Χρήσης" },
  "1 stück": { de: "1 Stück", en: "1 Piece", el: "1 Τεμάχιο" },
  "1 pc": { de: "1 Stück", en: "1 Piece", el: "1 Τεμάχιο" },
  "1 piece": { de: "1 Stück", en: "1 Piece", el: "1 Τεμάχιο" },
  "2 stück": { de: "2 Stück (Paar)", en: "2 Pcs (Pair)", el: "2 Τεμάχια (Ζεύγος)" },
  "2 stück (paar)": { de: "2 Stück (Paar)", en: "2 Pcs (Pair)", el: "2 Τεμάχια (Ζεύγος)" },
  "2 pcs": { de: "2 Stück (Paar)", en: "2 Pcs (Pair)", el: "2 Τεμάχια (Ζεύγος)" },
  "2 pcs (pair)": { de: "2 Stück (Paar)", en: "2 Pcs (Pair)", el: "2 Τεμάχια (Ζεύγος)" },
  "pair": { de: "1 Paar (2 Stück)", en: "1 Pair (2 Pieces)", el: "1 Ζεύγος (2 Τεμάχια)" },
  "paar": { de: "1 Paar (2 Stück)", en: "1 Pair (2 Pieces)", el: "1 Ζεύγος (2 Τεμάχια)" },
  "inkl. spezialkleber": { de: "Inkl. Spezialkleber", en: "Incl. Adhesive Glue", el: "Περιλαμβάνει Ειδική Κόλλα" },
  "inkl. kleber": { de: "Inkl. Spezialkleber", en: "Incl. Adhesive Glue", el: "Περιλαμβάνει Ειδική Κόλλα" },
  "incl. adhesive glue": { de: "Inkl. Spezialkleber", en: "Incl. Adhesive Glue", el: "Περιλαμβάνει Ειδική Κόλλα" },
  "includes adhesive": { de: "Inkl. Spezialkleber", en: "Incl. Adhesive Glue", el: "Περιλαμβάνει Ειδική Κόλλα" },
  "ohne kleber": { de: "Ohne Kleber", en: "Without Glue", el: "Χωρίς Κόλλα" },
  "without glue": { de: "Ohne Kleber", en: "Without Glue", el: "Χωρίς Κόλλα" },
  "deutschland": { de: "Deutschland", en: "Germany", el: "Γερμανία" },
  "germany": { de: "Deutschland", en: "Germany", el: "Γερμανία" },
  "made in germany": { de: "Deutschland", en: "Made in Germany", el: "Κατασκευάζεται στη Γερμανία" },
};

const BANNED_SPEC_KEYS_LOCAL = new Set([
  "brand", "marke", "hersteller", "manufacturer",
  "fitment", "passend für", "passend fuer", "passend", "suitable for", "kompatibel mit", "kompatibel",
  "moq",
  "warranty", "garantie", "warranty / garantie", "εγγύηση"
]);

export function formatSpecValueByLang(
  val: string,
  lang: SupportedLanguage = "de"
): string {
  if (!val || typeof val !== "string") return "";
  const s = val.trim();

  // 1. Exact match in dictionary
  const lower = s.toLowerCase();
  if (SPEC_VALUE_TRANSLATIONS[lower]) {
    return SPEC_VALUE_TRANSLATIONS[lower][lang];
  }

  // 2. Factory warranty pattern: e.g. "1 Years Factory", "2 Years Factory Warranty", "1 Jahr Werk"
  const warrantyMatch = s.match(/^(\d+)\s*(?:years?|jahre?|jahr|έτη|έτος)?\s*(?:factory|werk|εργοστασιακή)?(?:\s*warranty|\s*garantie|\s*εγγύηση)?$/i);
  if (warrantyMatch && /factory|werk|warranty|garantie|εγγύηση/i.test(s)) {
    const num = warrantyMatch[1];
    if (lang === "de") {
      return num === "1" ? "1 Jahr Herstellergarantie" : `${num} Jahre Herstellergarantie`;
    } else if (lang === "el") {
      return num === "1" ? "1 Έτος Εργοστασιακή Εγγύηση" : `${num} Έτη Εργοστασιακή Εγγύηση`;
    } else {
      return num === "1" ? "1 Year Factory Warranty" : `${num} Years Factory Warranty`;
    }
  }

  // 3. Ohm pattern: "8 Ohm", "8 Ω", "8.2 Ohm", "8,2 Ohm"
  const ohmMatch = s.match(/^(\d+(?:[.,]\d+)?)\s*(?:ohm|Ω)$/i);
  if (ohmMatch) {
    let numStr = ohmMatch[1];
    if (lang === "en") {
      numStr = numStr.replace(",", ".");
      return `${numStr} Ohm`;
    } else if (lang === "el") {
      numStr = numStr.replace(".", ",");
      return `${numStr} Ω`;
    } else {
      numStr = numStr.replace(".", ",");
      return `${numStr} Ohm`;
    }
  }

  // 4. Decimal dimension with unit: e.g. "44.4 mm", "44,4 mm", "100 W", "20 Hz"
  const unitMatch = s.match(/^(\d+)[.,](\d+)\s*(mm|cm|m|kg|g|w|watt|hz|khz)$/i);
  if (unitMatch) {
    const intPart = unitMatch[1];
    const decPart = unitMatch[2];
    const unit = unitMatch[3];
    if (lang === "en") {
      return `${intPart}.${decPart} ${unit}`;
    } else {
      return `${intPart},${decPart} ${unit}`;
    }
  }

  return s;
}

export function getLocalizedSpecKey(
  rawKey: string,
  lang: SupportedLanguage = "de"
): string {
  if (!rawKey || typeof rawKey !== "string") return "";
  const trimmed = rawKey.trim();
  const lower = trimmed.toLowerCase();
  if (BANNED_SPEC_KEYS_LOCAL.has(lower)) return "";
  if (SPEC_KEY_TRANSLATIONS[lower]) {
    return SPEC_KEY_TRANSLATIONS[lower][lang];
  }
  return trimmed;
}

export function getLocalizedSpecValue(
  rawKey: string,
  rawValue: string,
  lang: SupportedLanguage = "de"
): string {
  if (rawValue === undefined || rawValue === null) return "";
  return formatSpecValueByLang(String(rawValue), lang);
}

/**
 * Detects whether a product belongs to the Surrounds category/subcategories
 */
export function isSurroundProduct(product: any): boolean {
  if (!product) return false;

  const catId = String(
    product.category_id ||
    product.category?.id ||
    product.category?.slug ||
    product.category_slug ||
    ""
  ).toLowerCase().trim();

  const catName = String(
    product.category_name ||
    (typeof product.category === "string" ? product.category : product.category?.name) ||
    ""
  ).toLowerCase().trim();

  const subCat = String(product.subcategory || "").toLowerCase().trim();
  const name = String(product.name || "").toLowerCase().trim();
  const slug = String(product.slug || "").toLowerCase().trim();

  // Known surround category identifiers
  if (
    catId === "sicken" ||
    catId === "surround-repair" ||
    catId === "surrounds" ||
    catId === "rubber-surrounds" ||
    catId === "foam-edge-kits"
  ) {
    return true;
  }

  // Known surround category names
  if (
    catName === "sicken" ||
    catName === "surround repair" ||
    catName === "rubber surrounds" ||
    catName === "foam edge kits" ||
    catName.includes("sicken") ||
    catName.includes("sicke") ||
    catName.includes("surround")
  ) {
    return true;
  }

  // Known subcategory
  if (
    subCat.includes("sicke") ||
    subCat.includes("sicken") ||
    subCat.includes("surround")
  ) {
    return true;
  }

  // Title / slug matching for surround products
  if (
    name.includes("sicke") ||
    name.includes("sicken") ||
    name.includes("surround") ||
    slug.includes("sicke") ||
    slug.includes("sicken") ||
    slug.includes("surround")
  ) {
    return true;
  }

  return false;
}

/**
 * Detects whether a product belongs to the Cases & Inlays categories/subcategories
 */
export function isCaseOrInlayProduct(product: any): boolean {
  if (!product) return false;

  const catId = String(
    product.category_id ||
    product.category?.id ||
    product.category?.slug ||
    product.category_slug ||
    ""
  ).toLowerCase().trim();

  const catName = String(
    product.category_name ||
    (typeof product.category === "string" ? product.category : product.category?.name) ||
    ""
  ).toLowerCase().trim();

  const subCat = String(product.subcategory || "").toLowerCase().trim();
  const name = String(product.name || "").toLowerCase().trim();
  const slug = String(product.slug || "").toLowerCase().trim();

  // Known category identifiers for cases & inlays
  if (
    catId === "koffer" ||
    catId === "inlays" ||
    catId === "cases" ||
    catId === "microphone-accessories-cases" ||
    catId === "mikrofon-zubehoer-cases" ||
    catId === "case" ||
    catId === "inlay"
  ) {
    return true;
  }

  // Known category names
  if (
    catName === "koffer" ||
    catName === "inlays" ||
    catName === "cases" ||
    catName.includes("koffer") ||
    catName.includes("case") ||
    catName.includes("inlay") ||
    catName.includes("tasche") ||
    catName.includes("flightcase")
  ) {
    return true;
  }

  // Known subcategory
  if (
    subCat.includes("koffer") ||
    subCat.includes("inlay") ||
    subCat.includes("case") ||
    subCat.includes("tasche") ||
    subCat === "transportkoffer" ||
    subCat === "senderkoffer" ||
    subCat === "schutztaschen" ||
    subCat === "mikrofon-inlays" ||
    subCat === "sender-inlays" ||
    subCat === "koffer-schaumstoff"
  ) {
    return true;
  }

  // Title / slug matching for cases & inlays
  if (
    name.includes("inlay") ||
    name.includes("koffer") ||
    name.includes("case") ||
    name.includes("schaumstoffinlay") ||
    name.includes("schaumstoffeinlage") ||
    name.includes("etui") ||
    name.includes("tasche") ||
    slug.includes("inlay") ||
    slug.includes("koffer") ||
    slug.includes("case") ||
    slug.includes("schaumstoffinlay") ||
    slug.includes("schaumstoffeinlage") ||
    slug.includes("etui") ||
    slug.includes("tasche")
  ) {
    return true;
  }

  return false;
}

/**
 * Returns localized technical specs for a given product and language.
 * Checks:
 * 1. Pre-generated translations (product.translations[lang].technical_specs)
 * 2. Client-side localStorage overrides
 * 3. On-the-fly dictionary translation for existing and current products
 */
export function getLocalizedTechnicalSpecs(
  product: any,
  lang: SupportedLanguage = "de"
): Record<string, string> {
  if (!product) return {};

  const isSurround = isSurroundProduct(product);
  const isCaseOrInlay = isCaseOrInlayProduct(product);
  const requiresMasseAndMaterial = isSurround || isCaseOrInlay;
  const dimKey = lang === "el" ? "Διαστάσεις" : lang === "en" ? "Dimensions" : "Maße";
  const matKey = lang === "el" ? "Υλικό" : "Material";

  // 1. Direct product translation from backend / Firestore
  if (product.translations?.[lang]?.technical_specs) {
    const specs = product.translations[lang].technical_specs;
    if (specs && typeof specs === "object" && Object.keys(specs).length > 0) {
      const cleaned: Record<string, string> = {};
      for (const [k, v] of Object.entries(specs)) {
        const isBlankAllowed = k.toLowerCase().trim() === "maße" || k.toLowerCase().trim() === "dimensions" || k.toLowerCase().trim() === "διαστάσεις" || k.toLowerCase().trim() === "material" || k.toLowerCase().trim() === "υλικό";
        if (!BANNED_SPEC_KEYS_LOCAL.has(k.toLowerCase().trim()) && v !== undefined && v !== null && (String(v).trim() !== "" || isBlankAllowed)) {
          cleaned[k] = formatSpecValueByLang(String(v), lang);
        }
      }
      if (requiresMasseAndMaterial) {
        if (cleaned[dimKey] === undefined) cleaned[dimKey] = "";
        if (cleaned[matKey] === undefined) cleaned[matKey] = "";
      }
      if (Object.keys(cleaned).length > 0) return cleaned;
    }
  }

  // 2. Client-side localStorage override check
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("ixos_products_overrides");
      if (stored) {
        const overrides = JSON.parse(stored);
        const key = product.id || product.slug;
        const ov = key ? overrides[key] : null;
        if (ov?.translations?.[lang]?.technical_specs) {
          const specs = ov.translations[lang].technical_specs;
          if (specs && typeof specs === "object" && Object.keys(specs).length > 0) {
            const cleaned: Record<string, string> = {};
            for (const [k, v] of Object.entries(specs)) {
              const isBlankAllowed = k.toLowerCase().trim() === "maße" || k.toLowerCase().trim() === "dimensions" || k.toLowerCase().trim() === "διαστάσεις" || k.toLowerCase().trim() === "material" || k.toLowerCase().trim() === "υλικό";
              if (!BANNED_SPEC_KEYS_LOCAL.has(k.toLowerCase().trim()) && v !== undefined && v !== null && (String(v).trim() !== "" || isBlankAllowed)) {
                cleaned[k] = formatSpecValueByLang(String(v), lang);
              }
            }
            if (requiresMasseAndMaterial) {
              if (cleaned[dimKey] === undefined) cleaned[dimKey] = "";
              if (cleaned[matKey] === undefined) cleaned[matKey] = "";
            }
            if (Object.keys(cleaned).length > 0) return cleaned;
          }
        }
      }
    } catch (_) {}
  }

  // 3. Fallback on-the-fly translation of raw technical_specs
  const rawSpecs: Record<string, any> =
    product.technical_specs ||
    (product as any)?.variants?.[0]?.specs ||
    {};

  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawSpecs)) {
    const kTrim = k.trim();
    if (!kTrim || BANNED_SPEC_KEYS_LOCAL.has(kTrim.toLowerCase())) continue;
    const isBlankAllowed = kTrim.toLowerCase() === "maße" || kTrim.toLowerCase() === "masse" || kTrim.toLowerCase() === "dimensions" || kTrim.toLowerCase() === "material";
    if (v === undefined || v === null || (String(v).trim() === "" && !isBlankAllowed)) continue;

    const locKey = getLocalizedSpecKey(kTrim, lang);
    if (!locKey) continue;
    const locVal = getLocalizedSpecValue(kTrim, String(v), lang);
    result[locKey] = locVal;
  }

  // For all surround and case/inlay products, guarantee Maße and Material exist in technical specifications
  if (requiresMasseAndMaterial) {
    if (result[dimKey] === undefined) {
      result[dimKey] = "";
    }
    if (result[matKey] === undefined) {
      result[matKey] = "";
    }
  }

  return result;
}


