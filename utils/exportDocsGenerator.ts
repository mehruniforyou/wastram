import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DocCurrency, DocLanguage, formatDocCurrency, formatDocCurrencyShort, formatPdfCurrency, formatPdfTableNumber, t } from "./exportDocsTranslations";

export interface ExportOrderItem {
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  cartonNo?: string;
  netWeightKg?: number;
  grossWeightKg?: number;
  dimensionsCm?: string;
}

export interface ExportDocData {
  docType: "PI" | "CI" | "PL" | "QUOTATION" | "COO" | "COA" | "SWIFT" | "SHIPPING_ADVICE" | "SAMPLE_NOTE" | "CONTRACT";
  docNumber: string;
  docDate: string;
  validUntil?: string;
  subtotal?: number;
  shippingFee?: number;
  taxRate?: number;
  taxAmount?: number;
  discount?: number;
  total: number;
  advancePaidAmount?: number;
  advancePaidPct?: number;
  balanceDueAmount?: number;
  docCurrency?: DocCurrency;
  docLanguage?: DocLanguage;
  customer?: {
    company?: string;
    name?: string;
    email?: string;
    phone?: string;
    taxId?: string;
  };
  shipping?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  payment?: {
    gateway?: string;
    status?: string;
    transactionId?: string;
  };
  incoterms?: string;
  hsCode?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  carrierName?: string;
  trackingAwbNumber?: string;
  dispatchDate?: string;
  estimatedDeliveryDate?: string;
  notes?: string;
  items?: ExportOrderItem[];
  productName?: string;
  variantName?: string;
  quantity?: number;
  unitPrice?: number;
  // Specifics
  totalCartons?: number;
  totalNetWeightKg?: number;
  totalGrossWeightKg?: number;
  totalCbm?: number;
  bankDetails?: {
    beneficiaryName?: string;
    bankName?: string;
    accountNumber?: string;
    swiftBic?: string;
    ifscCode?: string;
    branchAddress?: string;
    intermediaryBank?: string;
  };
  qaMetrics?: {
    testedParameters?: string[];
    klippelComplianceResult?: string;
    dcrResistanceTolerance?: string;
    qcInspectorName?: string;
  };
}

// Helper: Fetch image as Base64 data URI
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
    console.warn("Failed to fetch image base64:", error);
    return null;
  }
}

// Common Header Builder for all Export Docs (Single Page Optimized)
async function renderDocHeader(
  doc: jsPDF, 
  titleBadge: string, 
  docNumber: string, 
  docDate: string, 
  extraRightMeta: string[] = []
): Promise<number> {
  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const margin = 10;
  const contentWidth = pageWidth - margin * 2; // 190
  const rightX = pageWidth - margin;
  let currentY = margin;

  // Top Solid Black Line with Rounded Corners
  doc.setFillColor(0, 0, 0);
  doc.roundedRect(margin, currentY, contentWidth, 1.2, 0.6, 0.6, "F");
  currentY += 3.5;

  // Logo (The ONLY colored asset)
  let brandLogoBase64: string | null = null;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    brandLogoBase64 = await fetchImageAsBase64(`${origin}/logo-header.png`);
  } catch {}

  if (brandLogoBase64) {
    try {
      doc.addImage(brandLogoBase64, "PNG", margin, currentY, 46, 10.5);
      currentY += 11.5;
    } catch {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text("IXOS SOUND & AUDIO", margin, currentY + 3.5);
      currentY += 6.5;
    }
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("IXOS SOUND & AUDIO", margin, currentY + 3.5);
    currentY += 6.5;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text("IXOS (Trade Name: IXOS Audio) • VAT ID: DE-IXOS-2008", margin, currentY);
  currentY += 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.0);
  doc.setTextColor(0, 0, 0);
  doc.text("Saerbeck, Germany • support@ixosweb.com", margin, currentY);
  currentY += 2.8;
  doc.text("ixosweb.vercel.app • Direct Store Fulfillment & Dispatch", margin, currentY);

  // Right Badge & Document Meta
  const topMetaY = margin + 3.5;
  const badgeWidth = Math.max(46, doc.getTextWidth(titleBadge) + 8);

  doc.setFillColor(0, 0, 0);
  doc.roundedRect(rightX - badgeWidth, topMetaY, badgeWidth, 5.5, 1.2, 1.2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(255, 255, 255);
  doc.text(titleBadge, rightX - badgeWidth / 2, topMetaY + 3.8, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(0, 0, 0);
  doc.text(docNumber, rightX, topMetaY + 10.5, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`Date: ${docDate}`, rightX, topMetaY + 14, { align: "right" });

  let offset = 17.5;
  for (const meta of extraRightMeta) {
    const splitMeta = doc.splitTextToSize(meta, 65);
    doc.text(splitMeta, rightX, topMetaY + offset, { align: "right" });
    offset += splitMeta.length * 3.2;
  }

  currentY = Math.max(currentY + 3.5, topMetaY + offset + 2);

  // Divider Line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, rightX, currentY);
  currentY += 3;

  return currentY;
}

// ═════════════════════════════════════════════════════════════════════════
// 1. PROFORMA INVOICE (PI) GENERATOR
// ═════════════════════════════════════════════════════════════════════════
export async function generateProformaInvoicePDF(data: ExportDocData): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const lang = data.docLanguage || "de";
  const currency = data.docCurrency || "EUR";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const rightX = pageWidth - margin;

  // Proforma Invoice payment status handling
  let piPaymentStatus = data.payment?.status;
  if (data.advancePaidAmount && data.advancePaidAmount > 0 && data.balanceDueAmount && data.balanceDueAmount > 0) {
    piPaymentStatus = `${t("STATUS_PARTIAL", lang)} (${formatPdfCurrency(data.advancePaidAmount, currency)} Paid • ${formatPdfCurrency(data.balanceDueAmount, currency)} Due)`;
  } else if (piPaymentStatus) {
    // Respect user selected status (e.g. Paid in Full, 100% Paid, Paid via PayPal, etc.)
    piPaymentStatus = piPaymentStatus;
  } else {
    piPaymentStatus = t("STATUS_UNPAID", lang);
  }

  let currentY = await renderDocHeader(
    doc,
    t("PI_TITLE", lang),
    data.docNumber || `IXOS-PI-${Math.floor(100000 + Math.random() * 900000)}`,
    data.docDate || new Date().toISOString().split("T")[0],
    [
      `${t("VALID_UNTIL", lang)}: ${data.validUntil || "30 Days from issue"}`,
      `${t("PAYMENT_STATUS", lang)}: ${piPaymentStatus}`
    ]
  );

  const cardGap = 3.5;
  const cardWidth = (contentWidth - cardGap) / 2;
  const innerPad = 3;
  const maxTextWidth = cardWidth - innerPad * 2;

  const customerCompany = data.customer?.company || data.customer?.name || "Client";
  const splitCompany = doc.splitTextToSize(customerCompany, maxTextWidth);
  const contactText = `${data.customer?.name || ""} ${data.customer?.email ? "• " + data.customer.email : ""} ${data.customer?.phone ? "• " + data.customer.phone : ""}`.trim();
  const splitContact = doc.splitTextToSize(contactText || "-", maxTextWidth);

  const addressText = data.shipping?.address || "Workshop Delivery Hub";
  const cityStateZip = [data.shipping?.city, data.shipping?.country].filter(Boolean).join(", ");
  const splitShipping = doc.splitTextToSize(`${addressText}, ${cityStateZip}`, maxTextWidth);
  const specsText = `${t("INCOTERMS", lang)}: ${data.incoterms || "CPT"} • Origin: India • Currency: ${currency}`;
  const splitSpecs = doc.splitTextToSize(specsText, maxTextWidth);

  const cardHeight = Math.max(22, Math.max(
    3.5 + 3.2 + splitCompany.length * 3.2 + splitContact.length * 2.8 + 2.5,
    3.5 + 3.2 + splitShipping.length * 3.0 + splitSpecs.length * 2.8 + 2.5
  ));

  // Left Card with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c1Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(t("CONSIGNEE_HEADER", lang), margin + innerPad, c1Y);
  c1Y += 3.4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(splitCompany, margin + innerPad, c1Y);
  c1Y += splitCompany.length * 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text(splitContact, margin + innerPad, c1Y);

  // Right Card with Rounded Corners
  const card2X = margin + cardWidth + cardGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c2Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(t("DELIVERY_HEADER", lang), card2X + innerPad, c2Y);
  c2Y += 3.4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text(splitShipping, card2X + innerPad, c2Y);
  c2Y += splitShipping.length * 3.0;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(splitSpecs, card2X + innerPad, c2Y);

  currentY += cardHeight + 3.5;

  const items = data.items && data.items.length > 0 ? data.items : [{
    productName: data.productName || "Precision Speaker Components",
    variantName: data.variantName || "Standard",
    quantity: data.quantity || 1,
    unitPrice: data.unitPrice || data.total
  }];

  const tableBody = items.map((item, index) => [
    index + 1,
    item.productName,
    item.variantName || "Standard",
    item.quantity.toLocaleString(),
    formatPdfTableNumber(Number(item.unitPrice || 0)),
    formatPdfTableNumber(Number(item.quantity || 1) * Number(item.unitPrice || 0))
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin, bottom: 8 },
    head: [[
      "#", 
      t("TH_ITEM", lang).toUpperCase(), 
      t("TH_VARIANT", lang).toUpperCase(), 
      t("TH_QTY", lang).toUpperCase(), 
      t("TH_PRICE", lang).toUpperCase(), 
      `${t("TH_TOTAL", lang).toUpperCase()} (${currency})`
    ]],
    body: tableBody,
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5, cellPadding: 1.8, lineWidth: 0.2, lineColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center", fontStyle: "bold" },
      1: { cellWidth: "auto", fontStyle: "bold" },
      2: { cellWidth: 44, textColor: [0, 0, 0] },
      3: { cellWidth: 18, halign: "center", fontStyle: "bold" },
      4: { cellWidth: 22, halign: "right" },
      5: { cellWidth: 26, halign: "right", fontStyle: "bold" }
    },
    bodyStyles: { fillColor: [255, 255, 255], fontSize: 7.5, textColor: [0, 0, 0], cellPadding: 1.6, lineWidth: 0.2, lineColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  // Financial Totals Block
  const totalsWidth = 78;
  const totalsX = rightX - totalsWidth;
  let totY = currentY;

  const subtotal = Number(data.subtotal) || Number(data.total) || 0;
  const shipping = Number(data.shippingFee) || 0;
  const tax = Number(data.taxAmount) || 0;
  const discount = Number(data.discount) || 0;
  const grandTotal = Number(data.total) || (subtotal + shipping + tax - discount);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`${t("SUBTOTAL", lang)}:`, totalsX, totY);
  doc.setFont("helvetica", "bold");
  doc.text(formatPdfCurrency(subtotal, currency), rightX, totY, { align: "right" });
  totY += 3.2;

  if (shipping > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(`${t("SHIPPING_FEE", lang)}:`, totalsX, totY);
    doc.setFont("helvetica", "bold");
    doc.text(formatPdfCurrency(shipping, currency), rightX, totY, { align: "right" });
    totY += 3.2;
  }
  if (tax > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(`${t("TAX_VAT", lang)} (${data.taxRate || 0}%):`, totalsX, totY);
    doc.setFont("helvetica", "bold");
    doc.text(formatPdfCurrency(tax, currency), rightX, totY, { align: "right" });
    totY += 3.2;
  }
  if (discount > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(`${t("DISCOUNT", lang)}:`, totalsX, totY);
    doc.setFont("helvetica", "bold");
    doc.text(`-${formatPdfCurrency(discount, currency)}`, rightX, totY, { align: "right" });
    totY += 3.2;
  }

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(totalsX, totY, rightX, totY);
  totY += 3.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(`${t("GRAND_TOTAL", lang)}:`, totalsX, totY);
  doc.setFontSize(9.5);
  doc.text(formatPdfCurrency(grandTotal, currency), rightX, totY, { align: "right" });
  totY += 3.8;

  // Advance / Partial Payment Breakdown for PI
  const advancePaid = Number(data.advancePaidAmount) || 0;
  const balanceDue = Number(data.balanceDueAmount) !== undefined && Number(data.balanceDueAmount) !== null
    ? Number(data.balanceDueAmount)
    : Math.max(0, grandTotal - advancePaid);

  if (advancePaid > 0 || (data.advancePaidPct && data.advancePaidPct > 0)) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(totalsX, totY, rightX, totY);
    totY += 3.2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    const pctLabel = data.advancePaidPct ? ` (${data.advancePaidPct}%)` : "";
    doc.text(`${t("AMOUNT_PAID", lang)}${pctLabel}:`, totalsX, totY);
    doc.setFont("helvetica", "bold");
    doc.text(formatPdfCurrency(advancePaid, currency), rightX, totY, { align: "right" });
    totY += 3.2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`${t("BALANCE_DUE", lang)}:`, totalsX, totY);
    doc.setFontSize(9);
    doc.text(formatPdfCurrency(balanceDue, currency), rightX, totY, { align: "right" });
    totY += 3.5;
  }

  currentY = Math.max(totY + 3.5, currentY + 16);

  // Bank Wire Box with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 17, 2, 2, "DF");

  let bY = currentY + 2.8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("OFFICIAL SWIFT / WIRE SETTLEMENT INSTRUCTIONS", margin + 2.5, bY);
  bY += 3.0;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.3);
  doc.setTextColor(0, 0, 0);
  doc.text(`Beneficiary: IXOS (Trade Name: IXOS Audio) • VAT ID: DE-IXOS-2008 • Bank: Deutsche Bank AG`, margin + 2.5, bY);
  bY += 2.6;
  doc.text(`IBAN: DE89370400440532013000 • BIC/SWIFT: DEUTDEDDFXX • Deutsche Bank AG, Frankfurt, Germany • Currency: ${currency}`, margin + 2.5, bY);

  currentY += 20;

  // Proforma Terms & Signatory
  let decY = currentY + 1;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text("PROFORMA TERMS & ORDER CONFIRMATION:", margin, decY);
  decY += 2.6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`1. Payment Terms: ${piPaymentStatus}. Production initiates upon receipt of wire remittance.`, margin, decY);
  decY += 2.5;
  doc.text(`2. Price quote is firm for ${data.validUntil || "30 Days"} in ${currency}.`, margin, decY);

  const sigX = rightX - 52;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text("For IXOS SOUND & AUDIO", rightX, decY - 4.5, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(0, 0, 0);
  doc.text("(Trade Name: IXOS Audio)", rightX, decY - 1.8, { align: "right" });
  doc.text("VAT ID: DE-IXOS-2008 • Saerbeck, Germany", rightX, decY + 0.8, { align: "right" });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(sigX, decY + 5.5, rightX, decY + 5.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("Authorized Signatory", rightX - 26, decY + 8.5, { align: "center" });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${totalPages} • IXOS Audio`, pageWidth / 2, pageHeight - 4.5, { align: "center" });
  }

  doc.save(`Proforma-Invoice-${data.docNumber || "Draft"}.pdf`);
}

// ═════════════════════════════════════════════════════════════════════════
// 2. EXPORT PACKING LIST (PL) GENERATOR
// ═════════════════════════════════════════════════════════════════════════
export async function generatePackingListPDF(data: ExportDocData): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const lang = data.docLanguage || "de";
  const currency = data.docCurrency || "EUR";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const rightX = pageWidth - margin;

  let currentY = await renderDocHeader(
    doc,
    t("PL_TITLE", lang),
    data.docNumber || `IXOS-PL-${Math.floor(100000 + Math.random() * 900000)}`,
    data.docDate || new Date().toISOString().split("T")[0],
    [`${t("CARRIER", lang)}: ${data.carrierName || "DHL Parcel Air"}`]
  );

  const cardGap = 3.5;
  const cardWidth = (contentWidth - cardGap) / 2;
  const innerPad = 3;
  const maxTextWidth = cardWidth - innerPad * 2;

  const customerCompany = data.customer?.company || data.customer?.name || "Client";
  const splitCompany = doc.splitTextToSize(customerCompany, maxTextWidth);
  const addressText = data.shipping?.address || "Workshop Direct Delivery";
  const cityStateZip = [data.shipping?.city, data.shipping?.country].filter(Boolean).join(", ");
  const splitAddress = doc.splitTextToSize(`${addressText}, ${cityStateZip}`, maxTextWidth);
  const specsText = `AWB: ${data.trackingAwbNumber || "PENDING"} • Loading: ${data.portOfLoading || "Saerbeck / FRA"} • Terms: ${data.incoterms || "CPT"}`;
  const splitSpecs = doc.splitTextToSize(specsText, maxTextWidth);

  const cardHeight = Math.max(22, Math.max(
    3.5 + 3.2 + splitCompany.length * 3.2 + splitAddress.length * 2.8 + 2.5,
    3.5 + 3.2 + splitSpecs.length * 3.0 + 2.5
  ));

  // Left Card with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c1Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(t("CONSIGNEE_HEADER", lang), margin + innerPad, c1Y);
  c1Y += 3.4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(splitCompany, margin + innerPad, c1Y);
  c1Y += splitCompany.length * 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text(splitAddress, margin + innerPad, c1Y);

  // Right Card with Rounded Corners
  const card2X = margin + cardWidth + cardGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c2Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(t("DELIVERY_HEADER", lang), card2X + innerPad, c2Y);
  c2Y += 3.4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text(splitSpecs, card2X + innerPad, c2Y);

  currentY += cardHeight + 3.5;

  const items = data.items && data.items.length > 0 ? data.items : [{
    productName: data.productName || "Precision Speaker Components",
    variantName: data.variantName || "Standard",
    quantity: data.quantity || 1000,
    unitPrice: data.unitPrice || 1.18,
    cartonNo: "CTN 01-02",
    netWeightKg: 18.5,
    grossWeightKg: 21.0,
    dimensionsCm: "55 x 42 x 38"
  }];

  const tableBody = items.map((item, index) => {
    const netKg = item.netWeightKg || Number((item.quantity * 0.018).toFixed(1));
    const grossKg = item.grossWeightKg || Number((netKg * 1.12).toFixed(1));
    const ctn = item.cartonNo || `CTN ${String(index + 1).padStart(2, "0")}`;
    const dims = item.dimensionsCm || "50x40x35";
    return [
      ctn,
      item.productName,
      item.variantName || "Standard",
      item.quantity.toLocaleString(),
      `${netKg} kg`,
      `${grossKg} kg`,
      dims
    ];
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin, bottom: 8 },
    head: [["CTN #", t("TH_ITEM", lang).toUpperCase(), t("TH_VARIANT", lang).toUpperCase(), t("TH_QTY", lang).toUpperCase(), "NET WT", "GROSS WT", "DIMS (CM)"]],
    body: tableBody,
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5, cellPadding: 1.8, lineWidth: 0.2, lineColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 16, halign: "center", fontStyle: "bold" },
      1: { cellWidth: "auto", fontStyle: "bold" },
      2: { cellWidth: 32, textColor: [0, 0, 0] },
      3: { cellWidth: 16, halign: "center", fontStyle: "bold" },
      4: { cellWidth: 16, halign: "right" },
      5: { cellWidth: 18, halign: "right", fontStyle: "bold" },
      6: { cellWidth: 20, halign: "center" }
    },
    bodyStyles: { fillColor: [255, 255, 255], fontSize: 7.5, textColor: [0, 0, 0], cellPadding: 1.6, lineWidth: 0.2, lineColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  const totalQty = items.reduce((acc, it) => acc + (it.quantity || 0), 0);
  const totalNet = items.reduce((acc, it) => acc + (it.netWeightKg || Number((it.quantity * 0.018).toFixed(1))), 0);
  const totalGross = items.reduce((acc, it) => acc + (it.grossWeightKg || Number((it.quantity * 0.018 * 1.12).toFixed(1))), 0);

  // Weight & Volume Summary Card with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, "DF");

  let sY = currentY + 3.0;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text("TOTAL PACKAGING & CONSIGNMENT METRICS:", margin + 2.5, sY);
  sY += 3.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(`${t("TOTAL_CARTONS", lang)}: ${items.length} Box(es) • Total Units: ${totalQty.toLocaleString()} Pcs • ${t("NET_WEIGHT", lang)}: ${totalNet.toFixed(1)} KG • ${t("GROSS_WEIGHT", lang)}: ${totalGross.toFixed(1)} KG`, margin + 2.5, sY);

  currentY += 19;

  // Signatory
  const sigX = rightX - 48;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text("For IXOS SOUND & AUDIO (IXOS Audio)", rightX, currentY + 2, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Warehouse & QA Dispatch, Saerbeck, Germany", rightX, currentY + 5, { align: "right" });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(sigX, currentY + 10, rightX, currentY + 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("Authorized QA Inspector", rightX - 24, currentY + 13, { align: "center" });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${totalPages} • IXOS Audio`, pageWidth / 2, pageHeight - 4.5, { align: "center" });
  }

  doc.save(`Packing-List-${data.docNumber || "Draft"}.pdf`);
}

// ═════════════════════════════════════════════════════════════════════════
// 3. B2B PRICE QUOTATION (QUOTATION) GENERATOR
// ═════════════════════════════════════════════════════════════════════════
export async function generateQuotationPDF(data: ExportDocData): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const lang = data.docLanguage || "de";
  const currency = data.docCurrency || "EUR";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const rightX = pageWidth - margin;

  let currentY = await renderDocHeader(
    doc,
    t("QUOTATION_TITLE", lang),
    data.docNumber || `IXOS-QTN-${Math.floor(100000 + Math.random() * 900000)}`,
    data.docDate || new Date().toISOString().split("T")[0],
    [
      `${t("VALID_UNTIL", lang)}: ${data.validUntil || "30 Days from date"}`,
      `${t("PAYMENT_STATUS", lang)}: ${data.payment?.status || t("STATUS_UNPAID", lang)}`
    ]
  );

  const cardGap = 3.5;
  const cardWidth = (contentWidth - cardGap) / 2;
  const innerPad = 3;
  const maxTextWidth = cardWidth - innerPad * 2;

  const customerCompany = data.customer?.company || data.customer?.name || "Client";
  const splitCompany = doc.splitTextToSize(customerCompany, maxTextWidth);
  const contactText = `${data.customer?.name || ""} ${data.customer?.email ? "• " + data.customer.email : ""} ${data.customer?.phone ? "• " + data.customer.phone : ""}`.trim();
  const splitContact = doc.splitTextToSize(contactText || "-", maxTextWidth);
  const specsText = `Dispatch: ${data.portOfLoading || "Saerbeck, Germany"} • Currency: ${currency}`;
  const splitSpecs = doc.splitTextToSize(specsText, maxTextWidth);

  const cardHeight = Math.max(22, Math.max(
    3.5 + 3.2 + splitCompany.length * 3.2 + splitContact.length * 2.8 + 2.5,
    3.5 + 3.2 + splitSpecs.length * 3.0 + 2.5
  ));

  // Left Card with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c1Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(t("CONSIGNEE_HEADER", lang), margin + innerPad, c1Y);
  c1Y += 3.4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(splitCompany, margin + innerPad, c1Y);
  c1Y += splitCompany.length * 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text(splitContact, margin + innerPad, c1Y);

  // Right Card with Rounded Corners
  const card2X = margin + cardWidth + cardGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c2Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(t("SPECIFICATIONS_HEADER", lang), card2X + innerPad, c2Y);
  c2Y += 3.4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text(splitSpecs, card2X + innerPad, c2Y);

  currentY += cardHeight + 3.5;

  const items = data.items && data.items.length > 0 ? data.items : [{
    productName: data.productName || "Precision Speaker Parts",
    variantName: data.variantName || "Standard",
    quantity: data.quantity || 1000,
    unitPrice: data.unitPrice || 1.18
  }];

  const tableBody = items.map((item, index) => [
    index + 1,
    item.productName,
    item.variantName || "Standard",
    item.quantity.toLocaleString(),
    formatPdfTableNumber(Number(item.unitPrice || 0)),
    formatPdfTableNumber(Number(item.quantity || 1) * Number(item.unitPrice || 0))
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin, bottom: 8 },
    head: [[
      "#", 
      t("TH_ITEM", lang).toUpperCase(), 
      t("TH_VARIANT", lang).toUpperCase(), 
      t("TH_QTY", lang).toUpperCase(), 
      `${t("TH_PRICE", lang).toUpperCase()} (${currency})`, 
      `${t("TH_TOTAL", lang).toUpperCase()} (${currency})`
    ]],
    body: tableBody,
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5, cellPadding: 1.8, lineWidth: 0.2, lineColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center", fontStyle: "bold" },
      1: { cellWidth: "auto", fontStyle: "bold" },
      2: { cellWidth: 44, textColor: [0, 0, 0] },
      3: { cellWidth: 18, halign: "center", fontStyle: "bold" },
      4: { cellWidth: 26, halign: "right" },
      5: { cellWidth: 28, halign: "right", fontStyle: "bold" }
    },
    bodyStyles: { fillColor: [255, 255, 255], fontSize: 7.5, textColor: [0, 0, 0], cellPadding: 1.6, lineWidth: 0.2, lineColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  const totalsWidth = 82;
  const totalsX = rightX - totalsWidth;
  let totY = currentY;

  const subtotal = Number(data.subtotal) || Number(data.total) || 0;
  const shipping = Number(data.shippingFee) || 0;
  const grandTotal = Number(data.total) || (subtotal + shipping);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`${t("SUBTOTAL", lang)}:`, totalsX, totY);
  doc.setFont("helvetica", "bold");
  doc.text(formatPdfCurrency(subtotal, currency), rightX, totY, { align: "right" });
  totY += 3.2;

  if (shipping > 0) {
    doc.setFont("helvetica", "normal");
    doc.text(`${t("SHIPPING_FEE", lang)}:`, totalsX, totY);
    doc.setFont("helvetica", "bold");
    doc.text(formatPdfCurrency(shipping, currency), rightX, totY, { align: "right" });
    totY += 3.2;
  }

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(totalsX, totY, rightX, totY);
  totY += 3.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(`${t("GRAND_TOTAL", lang)}:`, totalsX, totY);
  doc.setFontSize(9.5);
  doc.text(formatPdfCurrency(grandTotal, currency), rightX, totY, { align: "right" });
  totY += 3.8;

  // Advance Breakdown
  const advancePaid = Number(data.advancePaidAmount) || 0;
  const balanceDue = Number(data.balanceDueAmount) !== undefined && Number(data.balanceDueAmount) !== null
    ? Number(data.balanceDueAmount)
    : Math.max(0, grandTotal - advancePaid);

  if (advancePaid > 0 || (data.advancePaidPct && data.advancePaidPct > 0)) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(totalsX, totY, rightX, totY);
    totY += 3.2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    const pctLabel = data.advancePaidPct ? ` (${data.advancePaidPct}%)` : "";
    doc.text(`${t("AMOUNT_PAID", lang)}${pctLabel}:`, totalsX, totY);
    doc.setFont("helvetica", "bold");
    doc.text(formatPdfCurrency(advancePaid, currency), rightX, totY, { align: "right" });
    totY += 3.2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`${t("BALANCE_DUE", lang)}:`, totalsX, totY);
    doc.setFontSize(9);
    doc.text(formatPdfCurrency(balanceDue, currency), rightX, totY, { align: "right" });
    totY += 3.5;
  }

  currentY = Math.max(totY + 3.5, currentY + 14);

  // Notes Box with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, "DF");

  let nY = currentY + 2.8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("QUOTATION TERMS & CONDITIONS", margin + 2.5, nY);
  nY += 3.0;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`1. All component dimensions and coil tolerances are verified against OEM technical drawings. Currency: ${currency}.`, margin + 2.5, nY);
  nY += 2.6;
  doc.text("2. Samples available upon request for qualification testing before high-volume batch runs.", margin + 2.5, nY);

  currentY += 19;

  // Signatory
  const sigX = rightX - 48;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text("For IXOS SOUND & AUDIO (IXOS Audio)", rightX, currentY + 2, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Saerbeck, Germany", rightX, currentY + 5, { align: "right" });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(sigX, currentY + 10, rightX, currentY + 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("Commercial Sales Director", rightX - 24, currentY + 13, { align: "center" });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${totalPages} • IXOS Audio`, pageWidth / 2, pageHeight - 4.5, { align: "center" });
  }

  doc.save(`Quotation-${data.docNumber || "Draft"}.pdf`);
}

// ═════════════════════════════════════════════════════════════════════════
// 4. CERTIFICATE OF ORIGIN (COO) GENERATOR
// ═════════════════════════════════════════════════════════════════════════
export async function generateCertificateOfOriginPDF(data: ExportDocData): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const lang = data.docLanguage || "de";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const rightX = pageWidth - margin;

  let currentY = await renderDocHeader(
    doc,
    t("COO_TITLE", lang),
    data.docNumber || `IXOS-COO-${Math.floor(100000 + Math.random() * 900000)}`,
    data.docDate || new Date().toISOString().split("T")[0],
    ["Country of Origin: INDIA"]
  );

  const cardGap = 3.5;
  const cardWidth = (contentWidth - cardGap) / 2;
  const innerPad = 3;
  const maxTextWidth = cardWidth - innerPad * 2;

  const customerCompany = data.customer?.company || data.customer?.name || "Client";
  const splitCompany = doc.splitTextToSize(customerCompany, maxTextWidth);
  const addressText = data.shipping?.address || "Direct Delivery Facility";
  const cityStateZip = [data.shipping?.city, data.shipping?.country].filter(Boolean).join(", ");
  const splitAddress = doc.splitTextToSize(`${addressText}, ${cityStateZip}`, maxTextWidth);

  const cardHeight = 22;

  // Left Card with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c1Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("PRODUCER / SUPPLIER", margin + innerPad, c1Y);
  c1Y += 3.4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("IXOS (IXOS Audio)", margin + innerPad, c1Y);
  c1Y += 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text("Saerbeck, Germany • VAT ID: DE-IXOS-2008", margin + innerPad, c1Y);

  // Right Card with Rounded Corners
  const card2X = margin + cardWidth + cardGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c2Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(t("CONSIGNEE_HEADER", lang), card2X + innerPad, c2Y);
  c2Y += 3.4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(splitCompany, card2X + innerPad, c2Y);
  c2Y += splitCompany.length * 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(splitAddress, card2X + innerPad, c2Y);

  currentY += cardHeight + 3.5;

  const items = data.items && data.items.length > 0 ? data.items : [{
    productName: data.productName || "Precision Speaker Components",
    variantName: data.variantName || "Standard",
    quantity: data.quantity || 1000,
    unitPrice: data.unitPrice || 1.18
  }];

  const tableBody = items.map((item, index) => [
    index + 1,
    item.productName,
    data.hsCode || "8518.90.00",
    item.quantity.toLocaleString(),
    "India (IN)",
    "Wholly Produced (WO)"
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin, bottom: 8 },
    head: [["#", "COMMODITY DESCRIPTION", "HS CODE", "QTY", "ORIGIN", "CRITERION"]],
    body: tableBody,
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5, cellPadding: 1.8, lineWidth: 0.2, lineColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center", fontStyle: "bold" },
      1: { cellWidth: "auto", fontStyle: "bold" },
      2: { cellWidth: 28, halign: "center", fontStyle: "bold" },
      3: { cellWidth: 16, halign: "center", fontStyle: "bold" },
      4: { cellWidth: 24, halign: "center" },
      5: { cellWidth: 36, halign: "center", fontStyle: "bold" }
    },
    bodyStyles: { fillColor: [255, 255, 255], fontSize: 7.5, textColor: [0, 0, 0], cellPadding: 1.6, lineWidth: 0.2, lineColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  // Legal Certification Box with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, "DF");

  let certY = currentY + 3.0;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text("ORIGIN ATTESTATION & SELLER DECLARATION:", margin + 2.5, certY);
  certY += 3.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text("The undersigned hereby declares that the above details are correct and that all goods were manufactured and assembled", margin + 2.5, certY);
  certY += 2.8;
  doc.text("in Germany and comply with the rules of origin requirement. Place & Date: Saerbeck, Germany • " + (data.docDate || new Date().toISOString().split("T")[0]), margin + 2.5, certY);

  currentY += 24;

  // Dual Stamps & Signatures
  const colSigWidth = (contentWidth - 10) / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text("For IXOS SOUND & AUDIO (IXOS Audio)", margin, currentY);
  doc.text("TRADE & QUALITY ENDORSEMENT", margin + colSigWidth + 10, currentY);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY + 8, margin + colSigWidth, currentY + 8);
  doc.line(margin + colSigWidth + 10, currentY + 8, rightX, currentY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text("Authorized Signatory & Seal", margin + colSigWidth / 2, currentY + 11, { align: "center" });
  doc.text("Official Certification & Stamp", margin + colSigWidth + 10 + colSigWidth / 2, currentY + 11, { align: "center" });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${totalPages} • IXOS Audio`, pageWidth / 2, pageHeight - 4.5, { align: "center" });
  }

  doc.save(`Certificate-Of-Origin-${data.docNumber || "Draft"}.pdf`);
}

// ═════════════════════════════════════════════════════════════════════════
// 5. QUALITY CERTIFICATE / INSPECTION REPORT (COA) GENERATOR
// ═════════════════════════════════════════════════════════════════════════
export async function generateQualityCertificatePDF(data: ExportDocData): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const lang = data.docLanguage || "de";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const rightX = pageWidth - margin;

  let currentY = await renderDocHeader(
    doc,
    t("COA_TITLE", lang),
    data.docNumber || `IXOS-QC-${Math.floor(100000 + Math.random() * 900000)}`,
    data.docDate || new Date().toISOString().split("T")[0],
    ["QA Standard: Klippel Verified"]
  );

  const cardGap = 3.5;
  const cardWidth = (contentWidth - cardGap) / 2;
  const innerPad = 3;
  const maxTextWidth = cardWidth - innerPad * 2;

  const customerCompany = data.customer?.company || data.customer?.name || "Client";
  const splitCompany = doc.splitTextToSize(customerCompany, maxTextWidth);

  const cardHeight = 22;

  // Left Card with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c1Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("CLIENT / CONSIGNMENT REF", margin + innerPad, c1Y);
  c1Y += 3.4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(splitCompany, margin + innerPad, c1Y);
  c1Y += splitCompany.length * 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(`Dest: ${data.shipping?.country || "International"} • ${data.docDate}`, margin + innerPad, c1Y);

  // Right Card with Rounded Corners
  const card2X = margin + cardWidth + cardGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c2Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("TESTING LAB & EQUIPMENT", card2X + innerPad, c2Y);
  c2Y += 3.4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("Test Bench: Klippel Distortion Analyzer & Laser", card2X + innerPad, c2Y);
  c2Y += 2.8;
  doc.text("Lab Standard: ISO 9001:2015 Acoustic Standards", card2X + innerPad, c2Y);

  currentY += cardHeight + 3.5;

  const testRows = [
    ["1", "Voice Coil DC Resistance (DCR)", "Agreed Nominal ± 5%", "PASS (±1.8% dev)", "Verified 100%"],
    ["2", "Mechanical Resonance Fs (Surround)", "Agreed Hz ± 8%", "PASS (±3.2% dev)", "Verified 100%"],
    ["3", "Bond Shear Strength & Adhesion", "Min 2.5 MPa failure", "PASS (> 3.8 MPa)", "Lot Sampled"],
    ["4", "High-Temperature Thermal Cycle", "-30°C to +110°C (24h)", "PASS (Zero creep)", "Lot Sampled"],
    ["5", "Visual & Dimension Inspection", "OD / ID / Roll Depth", "PASS (100% OEM fit)", "Verified 100%"]
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin, bottom: 8 },
    head: [["#", "QA PARAMETER TESTED", "SPECIFICATION / LIMIT", "TEST RESULT", "VERDICT"]],
    body: testRows,
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5, cellPadding: 1.8, lineWidth: 0.2, lineColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center", fontStyle: "bold" },
      1: { cellWidth: "auto", fontStyle: "bold" },
      2: { cellWidth: 44, textColor: [0, 0, 0] },
      3: { cellWidth: 36, halign: "center", fontStyle: "bold" },
      4: { cellWidth: 26, halign: "center", fontStyle: "bold", textColor: [0, 0, 0] }
    },
    bodyStyles: { fillColor: [255, 255, 255], fontSize: 7.5, textColor: [0, 0, 0], cellPadding: 1.6, lineWidth: 0.2, lineColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  // QA Decision Banner with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, "DF");

  let qY = currentY + 3.0;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text("FINAL QUALITY VERDICT: APPROVED FOR FINAL CUSTOMER DISPATCH", margin + 2.5, qY);
  qY += 3.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text("All manufactured speaker component lots referenced herein comply with OEM dimensional drawings,", margin + 2.5, qY);
  doc.text("acoustic vibration dampening specs, and thermal durability standards.", margin + 2.5, qY + 2.8);

  currentY += 19;

  // Signatory
  const sigX = rightX - 48;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text("For IXOS SOUND & AUDIO (IXOS Audio)", rightX, currentY + 2, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Acoustic Engineering & QA Lab, Saerbeck, Germany", rightX, currentY + 5, { align: "right" });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(sigX, currentY + 10, rightX, currentY + 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("Head of Quality Assurance", rightX - 24, currentY + 13, { align: "center" });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${totalPages} • IXOS Audio`, pageWidth / 2, pageHeight - 4.5, { align: "center" });
  }

  doc.save(`Quality-Certificate-${data.docNumber || "Draft"}.pdf`);
}

// ═════════════════════════════════════════════════════════════════════════
// 6. SWIFT WIRE INSTRUCTIONS (SWIFT) GENERATOR
// ═════════════════════════════════════════════════════════════════════════
export async function generateSwiftWireInstructionsPDF(data: ExportDocData): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const lang = data.docLanguage || "de";
  const currency = data.docCurrency || "EUR";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const rightX = pageWidth - margin;

  let currentY = await renderDocHeader(
    doc,
    t("SWIFT_TITLE", lang),
    data.docNumber || `IXOS-BANK-${Math.floor(100000 + Math.random() * 900000)}`,
    data.docDate || new Date().toISOString().split("T")[0],
    [`Settlement Currency: ${currency}`]
  );

  const bankRows = [
    ["1", "Beneficiary Account Name", "IXOS Sound & Audio"],
    ["2", "Beneficiary VAT ID", "DE-IXOS-2008"],
    ["3", "Beneficiary IBAN", "DE89 3704 0044 0532 0130 00"],
    ["4", "Beneficiary Bank Name", "Deutsche Bank AG"],
    ["5", "SWIFT / BIC Code", "DEUTDEDDFXX"],
    ["6", "Bank Branch & Address", "Deutsche Bank AG, Mainzer Landstraße 11-17, Frankfurt, Germany"],
    ["7", "BLZ (Bankleitzahl)", "370 400 44"],
    ["8", "Settlement Currencies Accepted", `${currency}, EUR (€), USD ($), GBP (£) SEPA / Direct Wire`],
    ["9", "Intermediary Correspondent Bank (USD)", "Deutsche Bank Trust Company Americas, New York (SWIFT: BKTRUS33)"]
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin, bottom: 8 },
    head: [["#", "BANKING & WIRE PARAMETER", "OFFICIAL SETTLEMENT DETAIL"]],
    body: bankRows,
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5, cellPadding: 1.8, lineWidth: 0.2, lineColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center", fontStyle: "bold" },
      1: { cellWidth: 62, fontStyle: "bold", textColor: [0, 0, 0] },
      2: { cellWidth: "auto", fontStyle: "bold", textColor: [0, 0, 0] }
    },
    bodyStyles: { fillColor: [255, 255, 255], fontSize: 7.5, cellPadding: 1.6, lineWidth: 0.2, lineColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  // Wire Reference Card with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, "DF");

  let wY = currentY + 3.0;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text("CRITICAL WIRE REMITTANCE ADVICE & REFERENCE:", margin + 2.5, wY);
  wY += 3.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text(`1. Please include invoice/PI reference "${data.docNumber || 'IXOS-PI-XXXXX'}" in field 70 (Payment Details) of MT103.`, margin + 2.5, wY);
  wY += 2.6;
  doc.text(`2. Wire remittance value: ${formatPdfCurrency(data.total, currency)}. All transmission fees to be settled by remitter.`, margin + 2.5, wY);
  wY += 2.6;
  doc.text("3. Email swift MT103 confirmation copy to support@ixosweb.com for immediate order release.", margin + 2.5, wY);

  currentY += 21;

  // Signatory
  const sigX = rightX - 48;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text("For IXOS SOUND & AUDIO (IXOS Audio)", rightX, currentY + 2, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Treasury & Global Finance, Saerbeck, Germany", rightX, currentY + 5, { align: "right" });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(sigX, currentY + 10, rightX, currentY + 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("Finance Officer", rightX - 24, currentY + 13, { align: "center" });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${totalPages} • IXOS Audio`, pageWidth / 2, pageHeight - 4.5, { align: "center" });
  }

  doc.save(`SWIFT-Instructions-${data.docNumber || "Draft"}.pdf`);
}

// ═════════════════════════════════════════════════════════════════════════
// 7. SHIPPING ADVICE NOTE (SHIPPING_ADVICE) GENERATOR
// ═════════════════════════════════════════════════════════════════════════
export async function generateShippingAdvicePDF(data: ExportDocData): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const lang = data.docLanguage || "de";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const rightX = pageWidth - margin;

  let currentY = await renderDocHeader(
    doc,
    t("SHIPPING_ADVICE_TITLE", lang),
    data.docNumber || `IXOS-SHP-${Math.floor(100000 + Math.random() * 900000)}`,
    data.docDate || new Date().toISOString().split("T")[0],
    [`${t("CARRIER", lang)}: ${data.carrierName || "DHL Parcel Air"}`]
  );

  const cardGap = 3.5;
  const cardWidth = (contentWidth - cardGap) / 2;
  const innerPad = 3;
  const maxTextWidth = cardWidth - innerPad * 2;

  const customerCompany = data.customer?.company || data.customer?.name || "Client";
  const splitCompany = doc.splitTextToSize(customerCompany, maxTextWidth);
  const addressText = data.shipping?.address || "Workshop Direct Delivery";
  const cityStateZip = [data.shipping?.city, data.shipping?.country].filter(Boolean).join(", ");
  const splitAddress = doc.splitTextToSize(`${addressText}, ${cityStateZip}`, maxTextWidth);
  const specsText = `AWB: ${data.trackingAwbNumber || "PENDING"} • Dispatch: ${data.dispatchDate || data.docDate} • Est: ${data.estimatedDeliveryDate || "3-5 Days"}`;
  const splitSpecs = doc.splitTextToSize(specsText, maxTextWidth);

  const cardHeight = 22;

  // Left Card with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c1Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(t("CONSIGNEE_HEADER", lang), margin + innerPad, c1Y);
  c1Y += 3.4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(splitCompany, margin + innerPad, c1Y);
  c1Y += splitCompany.length * 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(splitAddress, margin + innerPad, c1Y);

  // Right Card with Rounded Corners
  const card2X = margin + cardWidth + cardGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c2Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(t("DELIVERY_HEADER", lang), card2X + innerPad, c2Y);
  c2Y += 3.4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(splitSpecs, card2X + innerPad, c2Y);

  currentY += cardHeight + 3.5;

  const items = data.items && data.items.length > 0 ? data.items : [{
    productName: data.productName || "Precision Speaker Parts",
    variantName: data.variantName || "Standard",
    quantity: data.quantity || 1000,
    unitPrice: data.unitPrice || 1.18
  }];

  const tableBody = items.map((item, index) => [
    index + 1,
    item.productName,
    item.variantName || "Standard",
    item.quantity.toLocaleString(),
    data.carrierName || "DHL Parcel",
    "In Transit / Dispatched"
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin, bottom: 8 },
    head: [["#", "DISPATCHED ITEMS", "VARIANT / SPECS", "QTY", "CARRIER", "SHIPMENT STATUS"]],
    body: tableBody,
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5, cellPadding: 1.8, lineWidth: 0.2, lineColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center", fontStyle: "bold" },
      1: { cellWidth: "auto", fontStyle: "bold" },
      2: { cellWidth: 36, textColor: [0, 0, 0] },
      3: { cellWidth: 16, halign: "center", fontStyle: "bold" },
      4: { cellWidth: 30, halign: "center" },
      5: { cellWidth: 36, halign: "center", fontStyle: "bold", textColor: [0, 0, 0] }
    },
    bodyStyles: { fillColor: [255, 255, 255], fontSize: 7.5, textColor: [0, 0, 0], cellPadding: 1.6, lineWidth: 0.2, lineColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  // Delivery Notes with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, "DF");

  let dY = currentY + 3.0;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text("DELIVERY & RECEIPT INSTRUCTIONS", margin + 2.5, dY);
  dY += 3.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text("1. Consignment is tracked live. Please ensure designated receiving personnel are available at destination.", margin + 2.5, dY);
  dY += 2.6;
  doc.text("2. Inspect carton security tape integrity upon handover from courier.", margin + 2.5, dY);

  currentY += 19;

  // Signatory
  const sigX = rightX - 48;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text("For IXOS SOUND & AUDIO (IXOS Audio)", rightX, currentY + 2, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Logistics & Fulfillment Center, Saerbeck, Germany", rightX, currentY + 5, { align: "right" });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(sigX, currentY + 10, rightX, currentY + 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("Logistics Manager", rightX - 24, currentY + 13, { align: "center" });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${totalPages} • IXOS Audio`, pageWidth / 2, pageHeight - 4.5, { align: "center" });
  }

  doc.save(`Shipping-Advice-${data.docNumber || "Draft"}.pdf`);
}

// ═════════════════════════════════════════════════════════════════════════
// 8. SAMPLE AGREEMENT (SAMPLE_NOTE) GENERATOR
// ═════════════════════════════════════════════════════════════════════════
export async function generateSampleAgreementPDF(data: ExportDocData): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const lang = data.docLanguage || "de";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const rightX = pageWidth - margin;

  let currentY = await renderDocHeader(
    doc,
    t("SAMPLE_NOTE_TITLE", lang),
    data.docNumber || `IXOS-SMP-${Math.floor(100000 + Math.random() * 900000)}`,
    data.docDate || new Date().toISOString().split("T")[0],
    ["Evaluation: Engineering Bench Test"]
  );

  const cardGap = 3.5;
  const cardWidth = (contentWidth - cardGap) / 2;
  const innerPad = 3;
  const maxTextWidth = cardWidth - innerPad * 2;

  const customerCompany = data.customer?.company || data.customer?.name || "Client";
  const splitCompany = doc.splitTextToSize(customerCompany, maxTextWidth);
  const addressText = data.shipping?.address || "Acoustic R&D Lab";
  const cityStateZip = [data.shipping?.city, data.shipping?.country].filter(Boolean).join(", ");
  const splitAddress = doc.splitTextToSize(`${addressText}, ${cityStateZip}`, maxTextWidth);

  const cardHeight = 22;

  // Left Card with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c1Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("RECIPIENT / EVALUATING ENGINEER", margin + innerPad, c1Y);
  c1Y += 3.4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(splitCompany, margin + innerPad, c1Y);
  c1Y += splitCompany.length * 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(splitAddress, margin + innerPad, c1Y);

  // Right Card with Rounded Corners
  const card2X = margin + cardWidth + cardGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c2Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(t("SPECIFICATIONS_HEADER", lang), card2X + innerPad, c2Y);
  c2Y += 3.4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("Declared Purpose: R&D Bench Testing & Fitting", card2X + innerPad, c2Y);
  c2Y += 2.8;
  doc.text("Customs Value: Nominal Evaluation Value", card2X + innerPad, c2Y);

  currentY += cardHeight + 3.5;

  const items = data.items && data.items.length > 0 ? data.items : [{
    productName: data.productName || "Precision Speaker Sample Parts",
    variantName: data.variantName || "Sample Lot",
    quantity: data.quantity || 10,
    unitPrice: data.unitPrice || 0
  }];

  const tableBody = items.map((item, index) => [
    index + 1,
    item.productName,
    item.variantName || "Evaluation Sample",
    item.quantity.toLocaleString(),
    "Free of Charge / Nominal",
    "Sample Evaluation"
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin, bottom: 8 },
    head: [["#", "SAMPLE COMPONENT DESCRIPTION", "SPECIFICATIONS", "SAMPLE QTY", "VALUATION", "PURPOSE"]],
    body: tableBody,
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7.5, cellPadding: 1.8, lineWidth: 0.2, lineColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: 8, halign: "center", fontStyle: "bold" },
      1: { cellWidth: "auto", fontStyle: "bold" },
      2: { cellWidth: 38, textColor: [0, 0, 0] },
      3: { cellWidth: 16, halign: "center", fontStyle: "bold" },
      4: { cellWidth: 32, halign: "center" },
      5: { cellWidth: 34, halign: "center", fontStyle: "bold" }
    },
    bodyStyles: { fillColor: [255, 255, 255], fontSize: 7.5, textColor: [0, 0, 0], cellPadding: 1.6, lineWidth: 0.2, lineColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  // Terms Box with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, "DF");

  let tY = currentY + 3.0;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text("SAMPLE TERMS & QUALIFICATION CONDITIONS", margin + 2.5, tY);
  tY += 3.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text("1. Samples are supplied solely for fitment, impedance, and acoustic evaluation testing.", margin + 2.5, tY);
  tY += 2.6;
  doc.text("2. Full production tooling and wholesale production commences upon formal approval.", margin + 2.5, tY);

  currentY += 19;

  // Signatory
  const sigX = rightX - 48;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text("For IXOS SOUND & AUDIO (IXOS Audio)", rightX, currentY + 2, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  doc.text("Acoustic Lab & Workshop, Saerbeck, Germany", rightX, currentY + 5, { align: "right" });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(sigX, currentY + 10, rightX, currentY + 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("Sample Engineer", rightX - 24, currentY + 13, { align: "center" });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${totalPages} • IXOS Audio`, pageWidth / 2, pageHeight - 4.5, { align: "center" });
  }

  doc.save(`Sample-Agreement-${data.docNumber || "Draft"}.pdf`);
}

// ═════════════════════════════════════════════════════════════════════════
// 9. EXPORT SALES CONTRACT (CONTRACT)
// ═════════════════════════════════════════════════════════════════════════
export async function generateSalesContractPDF(data: ExportDocData): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const lang = data.docLanguage || "de";
  const currency = data.docCurrency || "EUR";

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const rightX = pageWidth - margin;

  let currentY = await renderDocHeader(
    doc,
    t("CONTRACT_TITLE", lang),
    data.docNumber || `IXOS-CTR-${Math.floor(100000 + Math.random() * 900000)}`,
    data.docDate || new Date().toISOString().split("T")[0],
    ["Governing Law: CISG / Steinfurt (Germany)"]
  );

  const cardGap = 3.5;
  const cardWidth = (contentWidth - cardGap) / 2;
  const innerPad = 3;
  const maxTextWidth = cardWidth - innerPad * 2;

  const customerCompany = data.customer?.company || data.customer?.name || "Client";
  const splitCompany = doc.splitTextToSize(customerCompany, maxTextWidth);
  const addressText = data.shipping?.address || "Workshop Direct Delivery";
  const cityStateZip = [data.shipping?.city, data.shipping?.country].filter(Boolean).join(", ");
  const splitAddress = doc.splitTextToSize(`${addressText}, ${cityStateZip}`, maxTextWidth);

  const cardHeight = 22;

  // Party A with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c1Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("PARTY A: SELLER / MANUFACTURER", margin + innerPad, c1Y);
  c1Y += 3.4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("IXOS (IXOS Audio)", margin + innerPad, c1Y);
  c1Y += 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text("Saerbeck, Germany • VAT ID: DE-IXOS-2008", margin + innerPad, c1Y);

  // Party B with Rounded Corners
  const card2X = margin + cardWidth + cardGap;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(card2X, currentY, cardWidth, cardHeight, 2, 2, "DF");

  let c2Y = currentY + 3.2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("PARTY B: BUYER / IMPORTER", card2X + innerPad, c2Y);
  c2Y += 3.4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(splitCompany, card2X + innerPad, c2Y);
  c2Y += splitCompany.length * 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(splitAddress, card2X + innerPad, c2Y);

  currentY += cardHeight + 3.5;

  const items = data.items && data.items.length > 0 ? data.items : [{
    productName: data.productName || "Precision Speaker Components Wholesale Lot",
    variantName: data.variantName || "Standard",
    quantity: data.quantity || 1000,
    unitPrice: data.unitPrice || 1.18
  }];

  const tableBody = items.map((item, index) => [
    index + 1,
    item.productName,
    item.variantName || "Standard",
    item.quantity.toLocaleString(),
    formatPdfTableNumber(Number(item.unitPrice || 0)),
    formatPdfTableNumber(Number(item.quantity || 1) * Number(item.unitPrice || 0))
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin, bottom: 8 },
    head: [[
      "#", 
      t("TH_ITEM", lang).toUpperCase(), 
      t("TH_VARIANT", lang).toUpperCase(), 
      t("TH_QTY", lang).toUpperCase(), 
      `${t("TH_PRICE", lang).toUpperCase()} (${currency})`, 
      `${t("TH_TOTAL", lang).toUpperCase()} (${currency})`
    ]],
    body: tableBody,
    theme: "grid",
    columnStyles: {
      0: { cellWidth: 8, halign: "center", fontStyle: "bold" },
      1: { cellWidth: "auto", fontStyle: "bold" },
      2: { cellWidth: 38, textColor: [0, 0, 0] },
      3: { cellWidth: 18, halign: "center", fontStyle: "bold" },
      4: { cellWidth: 26, halign: "right" },
      5: { cellWidth: 28, halign: "right", fontStyle: "bold" }
    },
    bodyStyles: { fillColor: [255, 255, 255], fontSize: 7.5, textColor: [0, 0, 0], cellPadding: 1.6, lineWidth: 0.2, lineColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [255, 255, 255] }
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  // Contract Clauses Card with Rounded Corners
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, "DF");

  let clY = currentY + 3.0;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(0, 0, 0);
  doc.text("CORE INTERNATIONAL SALE TERMS & LEGAL CLAUSES", margin + 2.5, clY);
  clY += 3.5;

  const clauses = [
    `1. Total Contract Value: ${formatPdfCurrency(data.total, currency)}. Delivery: ${data.incoterms || "CPT - Carriage Paid To"}. Port of Origin: Saerbeck / Frankfurt (FRA), Germany.`,
    "2. Quality Warranty: Seller warrants all goods meet agreed OEM mechanical and electrical specifications with Klippel sweeps.",
    "3. Inspection & Claims: Any defect claim must be lodged within 7 days of destination customs clearance with photo/video proof."
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  for (const cl of clauses) {
    doc.text(cl, margin + 2.5, clY);
    clY += 2.6;
  }

  currentY += 21;

  // Dual Signatures
  const colSigWidth = (contentWidth - 10) / 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text("For SELLER: IXOS SOUND & AUDIO", margin, currentY);
  doc.text("For BUYER: " + (data.customer?.company || data.customer?.name || "Client"), margin + colSigWidth + 10, currentY);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY + 8, margin + colSigWidth, currentY + 8);
  doc.line(margin + colSigWidth + 10, currentY + 8, rightX, currentY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text("Authorized Signature & Seal", margin + colSigWidth / 2, currentY + 11, { align: "center" });
  doc.text("Authorized Signature & Seal", margin + colSigWidth + 10 + colSigWidth / 2, currentY + 11, { align: "center" });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${totalPages} • IXOS Audio`, pageWidth / 2, pageHeight - 4.5, { align: "center" });
  }

  doc.save(`Sales-Contract-${data.docNumber || "Draft"}.pdf`);
}

// ═════════════════════════════════════════════════════════════════════════
// 10. STANDARD TERMS & CONDITIONS OF SUPPLY & EXPORT SALE
// Comprehensive B2B Commercial & Export Supply Protocol (Editorial Typeset)
// ═════════════════════════════════════════════════════════════════════════
export async function generateTermsAndConditionsPDF(options?: {
  docNumber?: string;
  docDate?: string;
  docLanguage?: DocLanguage;
}): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const docNumber = options?.docNumber || `IXOS-TC-2026`;
  
  // Issue Date: 02 September 2026 (or custom if provided)
  let formattedDate = options?.docDate || "02 September 2026";
  if (options?.docDate && options.docDate !== "02 September 2026") {
    try {
      const d = new Date(options.docDate);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        });
      }
    } catch {}
  }

  // Page Geometry (A4: 210mm x 297mm)
  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 20; // 20mm symmetrical margins left & right
  const contentWidth = pageWidth - marginX * 2; // 170mm
  const rightX = pageWidth - marginX; // 190mm
  const topMargin = 20;
  const bottomMargin = 20;
  const maxY = pageHeight - bottomMargin; // 277mm

  // Brand Palette
  const bgIvory = { r: 255, g: 252, b: 239 }; // #FFFCEF Warm stationery
  const brandMaroon = { r: 28, g: 2, b: 8 };   // #1C0208 Primary dark maroon
  const textDark = { r: 31, g: 31, b: 31 };     // #1F1F1F Crisp dark neutral
  const textMuted = { r: 90, g: 90, b: 90 };    // #5A5A5A Secondary metadata
  const ruleSubtle = { r: 218, g: 208, b: 188 };// Warm parchment divider line

  // Background applicator helper
  const applyPageBackground = () => {
    doc.setFillColor(bgIvory.r, bgIvory.g, bgIvory.b);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  };

  // Helper to start a new continuation page
  const addNewPage = () => {
    doc.addPage();
    applyPageBackground();
    currentY = topMargin;

    // Running Minimal Top Header on Continuation Pages
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
    doc.text("IXOS SOUND & AUDIO", marginX, currentY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(textMuted.r, textMuted.g, textMuted.b);
    doc.text(`Terms & Conditions of Supply • Ref: ${docNumber}`, rightX, currentY, { align: "right" });
    currentY += 3;

    doc.setDrawColor(ruleSubtle.r, ruleSubtle.g, ruleSubtle.b);
    doc.setLineWidth(0.25);
    doc.line(marginX, currentY, rightX, currentY);
    currentY += 7;
  };

  // ─── PAGE 1 INITIALIZATION ──────────────────────────────────────────
  applyPageBackground();
  let currentY = topMargin;

  // 1. Corporate Letterhead Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.text("IXOS SOUND & AUDIO", marginX, currentY);
  currentY += 5.8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.text("IXOS", marginX, currentY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(textMuted.r, textMuted.g, textMuted.b);
  doc.text(" • VAT ID: DE-IXOS-2008 • Precision Speaker Parts & Acoustic Components", marginX + doc.getTextWidth("IXOS"), currentY);
  currentY += 4.8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.8);
  doc.setTextColor(textMuted.r, textMuted.g, textMuted.b);
  doc.text("Saerbeck, Germany • support@ixosweb.com • ixosweb.vercel.app", marginX, currentY);
  currentY += 4.5;

  // Header Maroon Rule
  doc.setDrawColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.setLineWidth(0.35);
  doc.line(marginX, currentY, rightX, currentY);
  currentY += 8.5;

  // 2. Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.text("TERMS & CONDITIONS OF SUPPLY", marginX, currentY);
  currentY += 5.8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(textMuted.r, textMuted.g, textMuted.b);
  doc.text("Standard Commercial Store & Supply Agreement • Master Trade Protocol", marginX, currentY);
  currentY += 6.5;

  // 3. Document Information / Metadata Table (Symmetrical aligned 2-column layout)
  doc.setDrawColor(ruleSubtle.r, ruleSubtle.g, ruleSubtle.b);
  doc.setLineWidth(0.25);
  doc.line(marginX, currentY, rightX, currentY);
  currentY += 5.0;

  const colWidth = contentWidth / 2;
  
  // Row 1 Meta
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.text("Document Reference:", marginX, currentY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  doc.text(docNumber, marginX + 38, currentY);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.text("Addressee / Issued To:", marginX + colWidth, currentY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  doc.text("Sicken 4 You", marginX + colWidth + 40, currentY);
  currentY += 5.0;

  // Row 2 Meta
  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.text("Issue Date:", marginX, currentY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  doc.text(formattedDate, marginX + 38, currentY);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.text("Governing Law:", marginX + colWidth, currentY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  doc.text("Laws of India", marginX + colWidth + 40, currentY);
  currentY += 5.0;

  // Row 3 Meta
  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.text("Trade Name / Brand:", marginX, currentY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  doc.text("IXOS", marginX + 38, currentY);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.text("Jurisdiction:", marginX + colWidth, currentY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  doc.text("Courts of Steinfurt / Münster, Germany", marginX + colWidth + 40, currentY);
  currentY += 5.0;

  doc.setDrawColor(ruleSubtle.r, ruleSubtle.g, ruleSubtle.b);
  doc.setLineWidth(0.25);
  doc.line(marginX, currentY, rightX, currentY);
  currentY += 7.5;

  // 4. Formal Opening Framework Letter
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.6);
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  const introText =
    "This document establishes the General Terms and Conditions of Supply governing commercial quotation acceptances, sample evaluations, proforma invoice confirmations, custom manufacturing runs, and store consignments executed by IXOS Audio (IXOS Sound & Audio, Saerbeck, Germany) to commercial trade partners, original equipment manufacturers (OEMs), wholesale distributors, and loudspeaker service facilities.";
  const splitIntro = doc.splitTextToSize(introText, contentWidth);
  doc.text(splitIntro, marginX, currentY, { lineHeightFactor: 1.45 });
  currentY += splitIntro.length * 4.3 + 8.0;

  // 5. Detailed Clauses Structure
  interface SubClause {
    subNum: string;
    subTitle: string;
    text: string;
  }

  interface ClauseSection {
    num: string;
    title: string;
    subClauses: SubClause[];
  }

  const clauses: ClauseSection[] = [
    {
      num: "01",
      title: "Scope of Supply, Technical Specifications & Custom Tooling",
      subClauses: [
        {
          subNum: "1.1",
          subTitle: "Precision Transducer Component Spectrum",
          text: "The Seller supplies and delivers acoustic transducer components, including precision flat-wire and round-wire voice coils (wound on Kapton, TIL, Aluminum, and Glass-Fiber formers), foam, NBR rubber, and treated cloth surrounds, non-pressed and ribbed paper cones, Nomex and cotton progressive spiders, titanium, polyimide, and aluminum compression driver diaphragms, dust caps, and custom recone kits."
        },
        {
          subNum: "1.2",
          subTitle: "Engineering Tolerance Thresholds",
          text: "Manufacturing batches strictly adhere to agreed technical datasheets and standard electro-acoustic engineering tolerances: DC electrical resistance (DCR) tolerance within ±5%, voice coil former inner diameter tolerance within ±0.03 mm, winding height tolerance within ±0.2 mm, and progressive spider mechanical compliance curves."
        },
        {
          subNum: "1.3",
          subTitle: "Custom OEM Tooling & Prototype Verification",
          text: "For customized OEM component development, dedicated tooling parameters and prototype samples are verified for technical fidelity prior to scheduling mass fabrication."
        }
      ]
    },
    {
      num: "02",
      title: "Quotations, Proforma Invoices & Order Acceptance Protocol",
      subClauses: [
        {
          subNum: "2.1",
          subTitle: "Quotation Validity Period",
          text: "Price quotations, technical estimates, and delivery schedules issued by the Seller remain valid for thirty (30) calendar days from the date of issuance, unless expressly extended or agreed otherwise in writing."
        },
        {
          subNum: "2.2",
          subTitle: "Proforma Invoice Endorsement & Order Binding",
          text: "Commercial orders become binding and scheduled for factory production upon the issuance and mutual endorsement of an official Proforma Invoice (PI) detailing product part numbers, technical specifications, agreed unit pricing, Incoterms, and payment terms."
        }
      ]
    },
    {
      num: "03",
      title: "Commercial Payment Milestones, Advance Structure & Settlement Channels",
      subClauses: [
        {
          subNum: "3.1",
          subTitle: "30% Order Placement Advance Deposit",
          text: "An initial advance payment of thirty percent (30%) of the total Proforma Invoice value is required upon order confirmation. This deposit secures raw material allocation, factory line scheduling, and custom coil winding or cone molding setups."
        },
        {
          subNum: "3.2",
          subTitle: "70% Balance Payment Milestone",
          text: "The remaining balance of seventy percent (70%) is payable upon completion of factory production, following the transmission of pre-dispatch photo/video proofs and the creation of the official shipment tracking consignment."
        },
        {
          subNum: "3.3",
          subTitle: "Accepted Billing Currencies",
          text: "Invoices are settled in EUR (Euros), USD (US Dollars), GBP (British Pounds), or local currencies as indicated on the official Proforma Invoice."
        },
        {
          subNum: "3.4",
          subTitle: "Approved Settlement Channels",
          text: "Payments may be remitted via International SWIFT / TT Wire Transfer or PayPal Express."
        }
      ]
    },
    {
      num: "04",
      title: "Production Lead Times, Order Proofs, Tracking Generation & Courier Handover",
      subClauses: [
        {
          subNum: "4.1",
          subTitle: "Production Lead Time (2–4 Business Days)",
          text: "Standard batch manufacturing and component assembly are executed within two to four (2–4) business days following receipt of the 30% order advance deposit."
        },
        {
          subNum: "4.2",
          subTitle: "Pre-Dispatch Photo & Video Order Proofs",
          text: "Upon production completion and QA clearance, high-resolution photographs and videos of finished products, batch counts, and packaging are shared with the Buyer for verification prior to dispatch."
        },
        {
          subNum: "4.3",
          subTitle: "Shipment Booking & AWB / Tracking Number",
          text: "The customer consignment may be pre-booked and an official AWB/tracking number generated for shipment preparation. Physical handover of the sealed consignment to the designated courier will take place only after receipt and verification of the remaining balance payment."
        },
        {
          subNum: "4.4",
          subTitle: "Courier Handover",
          text: "Upon receipt and verification of the remaining 70% balance payment, the sealed consignment will normally be handed over to the designated courier on the same or next business day, subject to courier collection schedules, weekends/public holidays, and courier handling requirements."
        },
        {
          subNum: "4.5",
          subTitle: "Courier & Freight Options",
          text: "Air parcels are dispatched via international express couriers (DHL Parcel, FedEx, UPS) with door-to-door tracking, or ocean freight for container volume orders."
        }
      ]
    },
    {
      num: "05",
      title: "Protective Packaging Standards, Moisture Protection & Marking",
      subClauses: [
        {
          subNum: "5.1",
          subTitle: "Heavy-Duty Multi-Wall Master Cartons",
          text: "Goods are packed in heavy-duty 5-ply and 7-ply multi-wall corrugated master cartons engineered for safe parcel and cargo transit."
        },
        {
          subNum: "5.2",
          subTitle: "Environmental & Shock Protection",
          text: "Delicate components (cones, voice coils, diaphragms) are protected with moisture-barrier poly-liners, customized internal tray dividers, and shock-absorbent cushioning to resist humidity and transit vibration."
        },
        {
          subNum: "5.3",
          subTitle: "Master Shipping Marks & Labeling",
          text: "Every master carton is legibly marked with consignee destination details, carton numbering (e.g., Box 1 of 5), net weight, gross weight, and product batch codes matching the official Packing List."
        }
      ]
    },
    {
      num: "06",
      title: "Multi-Point Quality Assurance & Factory Testing Protocols",
      subClauses: [
        {
          subNum: "6.1",
          subTitle: "Multi-Stage Acoustic & Mechanical Inspection",
          text: "100% of finished lots undergo rigorous multi-point verification prior to packaging, including DC resistance meter sweeps, voice coil concentricity checks, thermal endurance testing within applicable product-rated limits, surround elasticity retention, and spider compliance calibration."
        },
        {
          subNum: "6.2",
          subTitle: "Pre-Shipment Sample Retention",
          text: "Reference batch samples and QC measurement logs are archived for manufacturing traceability."
        }
      ]
    },
    {
      num: "07",
      title: "Delivery Receipt, Verification Period & Discrepancy Claims",
      subClauses: [
        {
          subNum: "7.1",
          subTitle: "Fourteen (14) Calendar Days Verification Window",
          text: "The Buyer shall examine all delivered packages upon arrival at the destination facility."
        },
        {
          subNum: "7.2",
          subTitle: "Claim Notification Protocol",
          text: "In the event of transit damage, packaging compromise, quantity discrepancy, or technical variance, the Buyer must notify the Seller in writing within fourteen (14) calendar days of delivery, supported by unboxing videos, high-resolution photographs, and carton batch labels."
        },
        {
          subNum: "7.3",
          subTitle: "Remediation",
          text: "Verified manufacturing defects or transit damages are resolved through replacement parts, credit notes, or expedited re-dispatch."
        }
      ]
    },
    {
      num: "08",
      title: "Order Documentation, Billing Specifications & Compliance",
      subClauses: [
        {
          subNum: "8.1",
          subTitle: "Order & Shipping Documentation",
          text: "The Seller furnishes commercial documentation, including Commercial Invoices, Packing Lists, Certificates of Origin, and Air Waybills."
        },
        {
          subNum: "8.2",
          subTitle: "Product Classification & Specifications",
          text: "Products are documented based on technical specification, component description, and product part numbers (loudspeaker and transducer components, diaphragms, voice coils, recone parts)."
        },
        {
          subNum: "8.3",
          subTitle: "Buyer Import Responsibility",
          text: "The Buyer is responsible for destination customs clearance, import documentation, and any applicable destination customs tariffs, VAT, or import taxes."
        }
      ]
    },
    {
      num: "09",
      title: "Force Majeure & Unforeseen Logistics Disruptions",
      subClauses: [
        {
          subNum: "9.1",
          subTitle: "Exempted Events",
          text: "Neither party shall be held liable for delivery delays or failure to perform resulting from events beyond reasonable commercial control, including natural disasters, severe weather disruptions, international port congestion, customs embargoes, carrier strikes, trade restrictions, or major logistics disruptions."
        },
        {
          subNum: "9.2",
          subTitle: "Mutual Mitigation",
          text: "Both parties agree to communicate transparently and take reasonable steps to minimize delivery disruptions."
        }
      ]
    },
    {
      num: "10",
      title: "Confidentiality, Intellectual Property & Governing Jurisdiction",
      subClauses: [
        {
          subNum: "10.1",
          subTitle: "Commercial & Technical Confidentiality",
          text: "Proprietary component drawings, OEM engineering data, and commercial pricing structures are held under commercial confidentiality."
        },
        {
          subNum: "10.2",
          subTitle: "Governing Law & Competent Jurisdiction",
          text: "These Terms & Conditions are governed by and construed in accordance with the applicable laws of Germany, with exclusive jurisdiction vested in the competent courts of Steinfurt / Münster, Germany."
        }
      ]
    }
  ];

  // Render detailed clauses with prominent auto-wrapping headings, medium subheads, and smaller body text
  for (let cIdx = 0; cIdx < clauses.length; cIdx++) {
    const clause = clauses[cIdx];

    // Measure Heading Height
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const headingLines = doc.splitTextToSize(`${clause.num} — ${clause.title}`, contentWidth);
    const headingHeight = headingLines.length * 5.2 + 2.5;

    // Measure First Sub-Clause Height to avoid orphan headings
    const firstSub = clause.subClauses[0];
    const subIndent = 2.5; // Clean 2.5mm left indentation
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    const firstSubHeadLines = doc.splitTextToSize(`${firstSub.subNum}  ${firstSub.subTitle}:`, contentWidth - subIndent);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.4);
    const firstBodyLines = doc.splitTextToSize(firstSub.text, contentWidth - subIndent);
    const firstSubHeight = (firstSubHeadLines.length * 4.4 + 1.2) + (firstBodyLines.length * 4.2 + 5.0);

    // Check if section heading + first sub-clause fit on current page
    if (currentY + headingHeight + firstSubHeight > maxY) {
      addNewPage();
    } else if (cIdx > 0 && currentY > topMargin + 15) {
      // Subtle hairline divider between major clauses when on same page
      doc.setDrawColor(ruleSubtle.r, ruleSubtle.g, ruleSubtle.b);
      doc.setLineWidth(0.2);
      doc.line(marginX, currentY - 1.5, rightX, currentY - 1.5);
      currentY += 6.0;
    }

    // ─── MAIN CLAUSE HEADING (13 pt, Auto-Wrapped within contentWidth) ─────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
    doc.text(headingLines, marginX, currentY, { lineHeightFactor: 1.35 });
    currentY += headingLines.length * 5.2 + 2.5;

    // ─── SUB-CLAUSES LOOP ───────────────────────────────────────────────
    for (let sIdx = 0; sIdx < clause.subClauses.length; sIdx++) {
      const sub = clause.subClauses[sIdx];
      
      // Calculate Sub-Heading lines
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      const subHeadLines = doc.splitTextToSize(`${sub.subNum}  ${sub.subTitle}:`, contentWidth - subIndent);
      const subHeadHeight = subHeadLines.length * 4.4 + 1.2;

      // Calculate Body lines
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.4);
      const bodyLines = doc.splitTextToSize(sub.text, contentWidth - subIndent);
      const bodyHeight = bodyLines.length * 4.2 + 5.0;

      const subTotalHeight = subHeadHeight + bodyHeight;

      if (currentY + subTotalHeight > maxY) {
        addNewPage();
      }

      // ─── MEDIUM SUB-HEADING (10.5 pt, Auto-Wrapped) ───────────────────
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
      doc.text(subHeadLines, marginX + subIndent, currentY, { lineHeightFactor: 1.35 });
      currentY += subHeadLines.length * 4.4 + 1.2;

      // ─── SMALLER, CRISP BODY PARAGRAPH (9.4 pt, Auto-Wrapped) ─────────
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.4);
      doc.setTextColor(textDark.r, textDark.g, textDark.b);
      doc.text(bodyLines, marginX + subIndent, currentY, { lineHeightFactor: 1.45 });
      currentY += bodyLines.length * 4.2 + 5.0;
    }

    currentY += 3.5; // Breathing space after clause
  }

  // 6. Corporate Sign-off & Commercial Endorsement Section
  const signatureSectionHeight = 44;
  if (currentY + signatureSectionHeight > maxY) {
    addNewPage();
  }

  currentY += 2;
  doc.setDrawColor(ruleSubtle.r, ruleSubtle.g, ruleSubtle.b);
  doc.setLineWidth(0.3);
  doc.line(marginX, currentY, rightX, currentY);
  currentY += 7;

  const sigColWidth = (contentWidth - 14) / 2;

  // Seller Signature Column (Left)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.8);
  doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.text("ISSUED & ENDORSED BY (SELLER):", marginX, currentY);
  currentY += 4.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  doc.text("IXOS SOUND & AUDIO", marginX, currentY);
  currentY += 4.0;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textMuted.r, textMuted.g, textMuted.b);
  doc.text("Saerbeck, Germany • VAT ID: DE-IXOS-2008", marginX, currentY);
  currentY += 6.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  doc.text("Authorized Signatory: _______________________________", marginX, currentY);
  currentY += 5.5;
  doc.text("Corporate Stamp: ____________________________________", marginX, currentY);

  // Buyer Signature Column (Right)
  const buyerColX = marginX + sigColWidth + 14;
  const buyerTopY = currentY - 20.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.8);
  doc.setTextColor(brandMaroon.r, brandMaroon.g, brandMaroon.b);
  doc.text("TRADE PARTNER / BUYER:", buyerColX, buyerTopY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  doc.text("Sicken 4 You", buyerColX, buyerTopY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(textDark.r, textDark.g, textDark.b);
  doc.text("Authorized Representative: __________________________", buyerColX, buyerTopY + 10.0);
  doc.text("Signature: _________________________________________", buyerColX, buyerTopY + 15.5);
  doc.text("Date: ______________________________________________", buyerColX, buyerTopY + 21.0);
  doc.text("Company Stamp: _____________________________________", buyerColX, buyerTopY + 26.5);

  // ─── FOOTERS ON ALL PAGES ─────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer Divider Line
    doc.setDrawColor(ruleSubtle.r, ruleSubtle.g, ruleSubtle.b);
    doc.setLineWidth(0.25);
    doc.line(marginX, pageHeight - 13, rightX, pageHeight - 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(textMuted.r, textMuted.g, textMuted.b);
    doc.text("IXOS Audio • Saerbeck, Germany • support@ixosweb.com", marginX, pageHeight - 8.5);
    doc.text(`${docNumber} • Page ${i} of ${totalPages}`, rightX, pageHeight - 8.5, { align: "right" });
  }

  doc.save(`Terms-and-Conditions-IXOS-Audio.pdf`);
}

