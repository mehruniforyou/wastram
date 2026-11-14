import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Variant {
  id: string;
  name: string;
  specs: Record<string, string>;
  price: number | null;
  stock: number | null;
}

interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_desc: string | null;
  featured_image: string | null;
  is_hidden: boolean;
  price?: number | null;
  seo_meta?: Record<string, any> | null;
  variants?: Variant[];
}

export type CurrencyCode = "USD" | "EUR" | "AUD" | "CAD" | "GBP" | "INR" | "BRL" | "RUB" | "AED" | "PLN";

const DEFAULT_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  AUD: 1.50,
  CAD: 1.37,
  GBP: 0.78,
  INR: 83.50,
  BRL: 5.45,
  RUB: 89.50,
  AED: 3.67,
  PLN: 3.95
};

export const SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "EUR ",
  AUD: "A$",
  CAD: "CA$",
  GBP: "£",
  INR: "INR ",
  BRL: "R$",
  RUB: "RUB ",
  AED: "AED ",
  PLN: "PLN "
};

// Helper: Convert USD price and format cleanly
function getFormattedPrice(priceUSD: number, currency: CurrencyCode, rates: Record<string, number>): string {
  const rate = rates[currency] || DEFAULT_RATES[currency] || 1.0;
  const converted = priceUSD * rate;
  return `${SYMBOLS[currency]}${converted.toFixed(2)}`;
}

// Helper: Load image and convert to base64 via proxy (resolving relative & absolute URLs)
async function fetchImageAsBase64(url: string): Promise<string | null> {
  if (!url) return null;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    let fullUrl = url;
    if (url.startsWith("/")) {
      fullUrl = `${origin}${url}`;
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = `${origin}/${url}`;
    }

    const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(fullUrl)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.dataUri || null;
  } catch (error) {
    console.error("Failed to fetch image base64:", error);
    return null;
  }
}

// Helper: Get best available image URL for a product
function getProductImageUrl(product: Product): string {
  if (product.featured_image && product.featured_image.trim() !== "") {
    return product.featured_image.trim();
  }
  const pAny = product as any;
  if (pAny.product_images && Array.isArray(pAny.product_images) && pAny.product_images.length > 0) {
    const first = pAny.product_images[0];
    if (typeof first === "string") return first;
    if (first && first.url) return first.url;
    if (first && first.image_url) return first.image_url;
  }
  if (pAny.image_url && typeof pAny.image_url === "string") {
    return pAny.image_url;
  }
  // Default category thumbnail fallback
  return "/speaker-surround.jpg";
}

// Helper: Extract Surround Specifications into 5 explicit columns with regex fallbacks
interface SurroundSpecs {
  material: string;
  rollDia: string;
  pistonDia: string;
  innerDia: string;
  outerDia: string;
}

function extractSurroundSpecs(specs: Record<string, string> | undefined, shortDesc: string | null, productName: string): SurroundSpecs {
  const findVal = (keywords: string[]): string => {
    if (!specs || typeof specs !== "object") return "-";
    for (const kw of keywords) {
      for (const [sk, sv] of Object.entries(specs)) {
        if (sk.toLowerCase().includes(kw.toLowerCase()) && sv && String(sv).trim() !== "") {
          return String(sv).trim();
        }
      }
    }
    return "-";
  };

  let material = findVal(["material", "type", "foam", "rubber"]);
  let rollDia = findVal(["roll diameter", "roll outer", "outer roll", "(c)", "roll edge"]);
  let pistonDia = findVal(["piston diameter", "piston inner", "roll inner", "(b)", "piston edge"]);
  let innerDia = findVal(["inner diameter", "inner dia", "(d)", "id"]);
  let outerDia = findVal(["outer diameter", "outer dia", "(a)", "total outer", "od"]);

  const textToParse = `${productName} ${shortDesc || ""}`;

  if (innerDia === "-") {
    const idMatch = textToParse.match(/ID[:\s-]*([\d.]+\s*mm)/i);
    if (idMatch) innerDia = idMatch[1];
  }
  if (outerDia === "-") {
    const odMatch = textToParse.match(/OD[:\s-]*([\d.]+\s*mm)/i);
    if (odMatch) outerDia = odMatch[1];
  }
  if (material === "-" && shortDesc) {
    material = shortDesc;
  }

  return {
    material: material !== "-" ? material : "Standard High-Density Foam",
    rollDia,
    pistonDia,
    innerDia,
    outerDia
  };
}

// Helper: Format Speaker Model Compatibility into clean multiline text
function formatSpeakerCompatibility(product: Product): string {
  const pAny = product as any;
  const raw = pAny?.seo_meta?.speaker_compatibility;
  if (!raw || !Array.isArray(raw) || raw.length === 0) {
    return "Universal / Custom OEM Fit";
  }

  const lines: string[] = [];
  for (const item of raw) {
    const brand = (item.brand || "").trim();
    let models = "";
    if (Array.isArray(item.models)) {
      models = item.models.join(", ");
    } else if (typeof item.models === "string") {
      models = item.models;
    }

    if (brand && models) {
      lines.push(`${brand}: ${models}`);
    } else if (brand) {
      lines.push(brand);
    }
  }

  return lines.length > 0 ? lines.join("\n") : "Universal / Custom OEM Fit";
}

// Helper: Format general technical specs dictionary into a structured multiline key-value string
function formatTechnicalSpecs(shortDesc: string | null, specs: Record<string, string> | undefined, product?: Product): string {
  const lines: string[] = [];

  if (specs && typeof specs === "object" && Object.keys(specs).length > 0) {
    Object.entries(specs).forEach(([key, val]) => {
      if (val && String(val).trim() !== "") {
        const formattedKey = key.toUpperCase().trim();
        lines.push(`${formattedKey}: ${val}`);
      }
    });
  }

  if (lines.length === 0 && shortDesc) {
    lines.push(`SPECIFICATION: ${shortDesc}`);
  }

  if (product) {
    const compat = formatSpeakerCompatibility(product);
    if (compat !== "Universal / Custom OEM Fit") {
      lines.push(`COMPATIBLE MODELS:\n${compat}`);
    }
  }

  return lines.length > 0 ? lines.join("\n") : "STANDARD OEM SPECIFICATIONS";
}

export async function generatePriceListPDF(
  selectedCategories: Category[],
  allProducts: Product[],
  onProgress?: (progress: string) => void,
  selectedCurrencies: CurrencyCode[] = ["USD"],
  selectedProductIds?: string[],
  customPriceOverrides?: Record<string, number>
) {
  // Ensure selectedCurrencies has at least USD and at most 3 items
  let activeCurrencies = selectedCurrencies && selectedCurrencies.length > 0 ? selectedCurrencies.slice(0, 3) : ["USD" as CurrencyCode];
  if (!activeCurrencies.includes("USD")) {
    activeCurrencies = ["USD", ...activeCurrencies.slice(0, 2)];
  }

  // Use A4 Landscape Orientation for spacious B2B price lists!
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  // 1. Fetch live exchange rates
  if (onProgress) onProgress("Fetching exchange rates...");
  let liveRates: Record<string, number> = { ...DEFAULT_RATES };
  try {
    const ratesRes = await fetch("https://open.er-api.com/v6/latest/USD");
    if (ratesRes.ok) {
      const data = await ratesRes.json();
      if (data && data.rates) {
        liveRates = {
          USD: 1.0,
          EUR: data.rates.EUR || DEFAULT_RATES.EUR,
          AUD: data.rates.AUD || DEFAULT_RATES.AUD,
          CAD: data.rates.CAD || DEFAULT_RATES.CAD,
          GBP: data.rates.GBP || DEFAULT_RATES.GBP,
          INR: data.rates.INR || DEFAULT_RATES.INR,
          BRL: data.rates.BRL || DEFAULT_RATES.BRL,
          RUB: data.rates.RUB || DEFAULT_RATES.RUB,
          AED: data.rates.AED || DEFAULT_RATES.AED,
          PLN: data.rates.PLN || DEFAULT_RATES.PLN,
        };
      }
    }
  } catch (err) {
    console.warn("Could not load live rates, using fallback rates.", err);
  }

  // 2. Filter products and Fetch/Cache base64 images
  let activeProducts = allProducts.filter(p => !p.is_hidden);
  if (selectedProductIds && selectedProductIds.length > 0) {
    activeProducts = activeProducts.filter(p => selectedProductIds.includes(p.id));
  }
  
  if (onProgress) onProgress("Loading product images...");
  const imageUrlsToFetch = Array.from(
    new Set(
      activeProducts
        .map(p => getProductImageUrl(p))
        .filter((url): url is string => !!url)
    )
  );

  const base64Cache: Record<string, string> = {};
  const chunkSize = 5;
  for (let i = 0; i < imageUrlsToFetch.length; i += chunkSize) {
    const chunk = imageUrlsToFetch.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async url => {
        const base64 = await fetchImageAsBase64(url);
        if (base64) {
          base64Cache[url] = base64;
        }
      })
    );
  }

  // Load official brand logo for PDF header
  let brandLogoBase64: string | null = null;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    brandLogoBase64 = await fetchImageAsBase64(`${origin}/logo-header.png`);
  } catch (err) {
    console.warn("Could not load brand logo for PDF header:", err);
  }

  // 3. Filter categories to only those containing matching active products
  const categoriesToRender = selectedCategories.filter(cat =>
    activeProducts.some(p => p.category_id === cat.id)
  );

  let isFirstCategory = true;
  let categoryIndex = 1;
  const totalCategoriesCount = categoriesToRender.length;

  for (const category of categoriesToRender) {
    const categoryProducts = activeProducts.filter(p => p.category_id === category.id);
    if (categoryProducts.length === 0) continue;

    if (!isFirstCategory) {
      doc.addPage();
    }
    isFirstCategory = false;

    if (onProgress) onProgress(`Generating list for ${category.name}...`);

    const pageWidth = doc.internal.pageSize.width; // 297mm in landscape
    
    // --- TOP HEADER BANNER ---
    if (brandLogoBase64) {
      try {
        doc.addImage(brandLogoBase64, "PNG", 14, 10, 62, 15);
      } catch (e) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(17, 17, 17);
        doc.text("IXOS SOUND & AUDIO", 14, 20);
      }
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(17, 17, 17);
      doc.text("IXOS SOUND & AUDIO", 14, 20);
    }

    // Right-Aligned Company & Contact Meta
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);

    const tagline = "IXOS AUDIO • Precision Loudspeaker Parts & Acoustic Hardware";
    const contactLoc = "Saerbeck, Germany • Express Worldwide Dispatch";
    const webEmail = "support@ixosweb.com  •  ixosweb.vercel.app";

    doc.text(tagline, pageWidth - 14 - doc.getTextWidth(tagline), 13);
    doc.text(contactLoc, pageWidth - 14 - doc.getTextWidth(contactLoc), 17.5);
    doc.text(webEmail, pageWidth - 14 - doc.getTextWidth(webEmail), 22);

    // Red Divider Line under header logo
    doc.setDrawColor(225, 6, 0); // #E10600
    doc.setLineWidth(0.8);
    doc.line(14, 27, pageWidth - 14, 27);

    // Category Title Banner Card (Charcoal Bar)
    doc.setFillColor(24, 24, 27); // #18181B Dark Charcoal
    doc.roundedRect(14, 31, pageWidth - 28, 10, 1.5, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    
    // Explicit differentiation with Heading X (Category Name) if multiple categories are present
    const titleText = totalCategoriesCount > 1
      ? `HEADING ${categoryIndex} (${category.name.toUpperCase()}) — B2B WHOLESALE PRICE LIST`
      : `${category.name.toUpperCase()} — B2B WHOLESALE PRICE LIST`;
    
    doc.text(titleText, 18, 37.5);

    const dateStr = `ISSUED: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase()}`;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(225, 6, 0); // Red date highlight
    doc.text(dateStr, pageWidth - 18 - doc.getTextWidth(dateStr), 37.5);

    categoryIndex++;

    // Determine if this category is Speaker Surrounds safely
    const catSlug = (category.slug || "").toLowerCase();
    const catName = (category.name || "").toLowerCase();
    const isSurroundCat = catSlug.includes("surround") || catName.includes("surround");

    // 4. Build Table Rows & Headers
    const tableRows: any[] = [];
    const rowImages: string[] = [];

    for (const product of categoryProducts) {
      const imgUrl = getProductImageUrl(product);
      const productImgBase64 = imgUrl ? (base64Cache[imgUrl] || "") : "";

      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((v, index) => {
          const name = index === 0 ? product.name : `${product.name} (${v.name})`;
          // Check for price overrides in custom negotiation map
          const priceUSD = (customPriceOverrides && customPriceOverrides[v.id] !== undefined)
            ? customPriceOverrides[v.id]
            : ((customPriceOverrides && customPriceOverrides[product.id] !== undefined)
                ? customPriceOverrides[product.id]
                : (v.price || product.price || 0.0));

          const currencyPrices = activeCurrencies.map(curr => getFormattedPrice(priceUSD, curr, liveRates));

          if (isSurroundCat) {
            const surSpecs = extractSurroundSpecs(v.specs, product.short_desc, product.name);
            const compat = formatSpeakerCompatibility(product);
            tableRows.push([
              "", // Image
              name,
              compat,
              surSpecs.rollDia,
              surSpecs.pistonDia,
              surSpecs.innerDia,
              surSpecs.outerDia,
              ...currencyPrices
            ]);
          } else {
            const formattedSpecs = formatTechnicalSpecs(product.short_desc, v.specs, product);
            tableRows.push([
              "",
              name,
              formattedSpecs,
              ...currencyPrices
            ]);
          }
          rowImages.push(productImgBase64);
        });
      } else {
        const priceUSD = (customPriceOverrides && customPriceOverrides[product.id] !== undefined)
          ? customPriceOverrides[product.id]
          : (product.price || 0.0);

        const currencyPrices = activeCurrencies.map(curr => getFormattedPrice(priceUSD, curr, liveRates));

        if (isSurroundCat) {
          const surSpecs = extractSurroundSpecs(undefined, product.short_desc, product.name);
          const compat = formatSpeakerCompatibility(product);
          tableRows.push([
            "",
            product.name,
            compat,
            surSpecs.rollDia,
            surSpecs.pistonDia,
            surSpecs.innerDia,
            surSpecs.outerDia,
            ...currencyPrices
          ]);
        } else {
          const formattedSpecs = formatTechnicalSpecs(product.short_desc, undefined, product);
          tableRows.push([
            "",
            product.name,
            formattedSpecs,
            ...currencyPrices
          ]);
        }
        rowImages.push(productImgBase64);
      }
    }

    // 5. Setup Column Headers & Dynamic Column Styles
    // Format currency header titles cleanly without redundant parentheses
    const currencyHeaderTitles = activeCurrencies.map(curr => {
      const sym = SYMBOLS[curr].trim();
      if (sym === curr || sym === "PLN" || sym === "INR" || sym === "RUB" || sym === "AED") {
        return `${curr} / PCS.`;
      }
      return `${curr} (${sym}) / PCS.`;
    });
    
    // Dynamic Column Width Allocation for Currency Columns (Max 3)
    let currColWidth = 28;
    if (activeCurrencies.length === 1) currColWidth = 40;
    if (activeCurrencies.length === 2) currColWidth = 34;

    let tableHeaders: string[][];
    let colStyles: Record<number, any> = {};

    if (isSurroundCat) {
      tableHeaders = [["IMAGE", "PRODUCT / MODEL", "SPEAKER COMPATIBILITY", "ROLL DIA (C)", "PISTON DIA (B)", "INNER DIA (D)", "OUTER DIA (A)", ...currencyHeaderTitles]];
      
      const imgWidth = 12;
      const rollWidth = 17;
      const pistonWidth = 17;
      const innerWidth = 17;
      const outerWidth = 17;

      colStyles = {
        0: { cellWidth: imgWidth, halign: "center" }, // Image
        1: { cellWidth: 44, fontStyle: "bold", fontSize: 7.2 }, // Product Title
        2: { cellWidth: "auto", fontSize: 6.8, textColor: [50, 50, 50] }, // Speaker Compatibility
        3: { cellWidth: rollWidth, halign: "center", fontSize: 7.2 }, // Roll Dia (C)
        4: { cellWidth: pistonWidth, halign: "center", fontSize: 7.2 }, // Piston Dia (B)
        5: { cellWidth: innerWidth, halign: "center", fontSize: 7.2 }, // Inner Dia (D)
        6: { cellWidth: outerWidth, halign: "center", fontSize: 7.2 }, // Outer Dia (A)
      };

      activeCurrencies.forEach((curr, idx) => {
        colStyles[7 + idx] = {
          cellWidth: currColWidth,
          halign: "right",
          fontStyle: "bold",
          fontSize: 8,
          textColor: curr === "USD" ? [225, 6, 0] : [20, 20, 20]
        };
      });
    } else {
      tableHeaders = [["IMAGE", "PRODUCT / MODEL", "TECHNICAL SPECIFICATIONS", ...currencyHeaderTitles]];
      
      const fixedWidth = 18 + 55;
      const totalCurrWidth = currColWidth * activeCurrencies.length;
      const specWidth = 269 - fixedWidth - totalCurrWidth;

      colStyles = {
        0: { cellWidth: 18, halign: "center" },
        1: { cellWidth: 55, fontStyle: "bold" },
        2: { cellWidth: Math.max(specWidth, 80), fontStyle: "normal", fontSize: 7.5 }
      };

      activeCurrencies.forEach((curr, idx) => {
        colStyles[3 + idx] = {
          cellWidth: currColWidth,
          halign: "right",
          fontStyle: "bold",
          fontSize: 8,
          textColor: curr === "USD" ? [225, 6, 0] : [20, 20, 20]
        };
      });
    }

    // Draw Table
    autoTable(doc, {
      startY: 45,
      head: tableHeaders,
      body: tableRows,
      theme: "grid",
      styles: {
        fontSize: 8,
        valign: "middle",
        minCellHeight: 18,
        cellPadding: 2.5,
        fillColor: [255, 255, 255], // Plain white background
        textColor: [20, 20, 20],     // Dark charcoal text
        lineColor: [210, 210, 215], // Crisp grid borders
        lineWidth: 0.2
      },
      headStyles: {
        fillColor: [24, 24, 27],    // Charcoal header background
        textColor: [255, 255, 255], // Bold white header text
        fontStyle: "bold",
        fontSize: 6.8,              // Reduced font size to force headers onto a single straight line
        halign: "left",
        cellPadding: 1.5,           // Compact cell padding to prevent line wrapping
        lineColor: [24, 24, 27],
        lineWidth: 0.3
      },
      columnStyles: colStyles,
      didDrawCell: (data) => {
        if (data.column.index === 0 && data.cell.section === "body") {
          const rowIndex = data.row.index;
          const imgBase64 = rowImages[rowIndex];
          const cellX = data.cell.x;
          const cellY = data.cell.y;
          const cellW = data.cell.width;
          const cellH = data.cell.height;

          const imgSize = 14;
          const imgX = cellX + (cellW - imgSize) / 2;
          const imgY = cellY + (cellH - imgSize) / 2;

          // Draw thumbnail container border box
          doc.setDrawColor(220, 220, 225);
          doc.setFillColor(248, 248, 250);
          doc.roundedRect(imgX - 0.5, imgY - 0.5, imgSize + 1, imgSize + 1, 1, 1, "FD");

          if (imgBase64) {
            try {
              const formatMatch = imgBase64.match(/^data:image\/([a-zA-Z]+);base64,/);
              const format = formatMatch ? formatMatch[1].toUpperCase() : "JPEG";
              doc.addImage(imgBase64, format, imgX, imgY, imgSize, imgSize);
            } catch (err) {
              console.error("Error embedding product image in cell:", err);
            }
          }
        }
      },
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.height; // 210mm in landscape
        const pageW = doc.internal.pageSize.width;       // 297mm in landscape
        
        // Footer Divider Line
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.4);
        doc.line(14, pageHeight - 12, pageW - 14, pageHeight - 12);

        // Footer Details & Page Counter
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(0, 0, 0);
        doc.text(
          "IXOS AUDIO • Precision Loudspeaker Parts • support@ixosweb.com • ixosweb.vercel.app",
          14,
          pageHeight - 7
        );

        const pageStr = `Page ${data.pageNumber}`;
        doc.text(pageStr, pageW - 14 - doc.getTextWidth(pageStr), pageHeight - 7);
      }
    });
  }

  // 6. Save PDF
  if (onProgress) onProgress("Saving PDF...");
  let filename = "ixos_audio_products_price_list.pdf";
  if (selectedProductIds && selectedProductIds.length > 0) {
    if (categoriesToRender.length === 1) {
      filename = `${categoriesToRender[0].name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_selected_price_list.pdf`;
    } else {
      filename = "custom_selected_products_price_list.pdf";
    }
  } else if (categoriesToRender.length === 1) {
    filename = `${categoriesToRender[0].name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_price_list.pdf`;
  }
  
  doc.save(filename);
}
