import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DocCurrency, DocLanguage, formatDocCurrency, formatDocCurrencyShort, formatPdfCurrency, formatPdfTableNumber, t } from "./exportDocsTranslations";

export interface OrderItem {
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderData {
  orderId: string;
  order_number?: string;
  date: string;
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
  carrierName?: string;
  trackingAwbNumber?: string;
  incoterms?: string;
  hsCode?: string;
  portOfLoading?: string;
  notes?: string;
  items?: OrderItem[];
  productName?: string;
  variantName?: string;
  quantity?: number;
  unitPrice?: number;
}

// Helper: Fetch logo as Base64 data URI
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

export async function generateInvoicePDF(order: OrderData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const lang = order.docLanguage || "de";
  const currency = order.docCurrency || "EUR";

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 10;
  const contentWidth = pageWidth - margin * 2; // 190mm
  const rightX = pageWidth - margin;
  let currentY = margin;

  // 1. Top Pure Black Line with Rounded Corners
  doc.setFillColor(0, 0, 0); // Pure Black
  doc.roundedRect(margin, currentY, contentWidth, 1.2, 0.6, 0.6, "F");
  currentY += 3.5;

  // 2. Embed Official Brand Logo (The ONLY colored asset in the document)
  let brandLogoBase64: string | null = null;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    brandLogoBase64 = await fetchImageAsBase64(`${origin}/logo-header.png`);
  } catch (e) {
    console.warn("Could not load brand logo:", e);
  }

  // Left: Brand Logo & Company Info
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
  doc.text("IXOS SOUND & AUDIO • Worldwide Acoustic Hardware", margin, currentY);
  currentY += 3.2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.0);
  doc.setTextColor(0, 0, 0);
  doc.text("Saerbeck, NRW, Germany • support@ixosweb.com", margin, currentY);
  currentY += 2.8;
  doc.text("ixosweb.vercel.app • Official Online Retail Store", margin, currentY);

  // Right: Document Badge & Meta Block
  const topMetaY = margin + 3.5;
  const badgeText = t("CI_TITLE", lang);
  const badgeWidth = Math.max(48, doc.getTextWidth(badgeText) + 8);

  doc.setFillColor(0, 0, 0);
  doc.roundedRect(rightX - badgeWidth, topMetaY, badgeWidth, 5.5, 1.2, 1.2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.8);
  doc.setTextColor(255, 255, 255);
  doc.text(badgeText, rightX - badgeWidth / 2, topMetaY + 3.8, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(0, 0, 0);
  doc.text(order.orderId || "IXOS-INV-000000", rightX, topMetaY + 10.5, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`${t("DATE", lang)}: ${order.date || new Date().toISOString().split("T")[0]}`, rightX, topMetaY + 14, { align: "right" });

  // Payment Status String
  let paymentStatusText = order.payment?.status || t("STATUS_CONFIRMED", lang);
  if (order.advancePaidAmount && order.advancePaidAmount > 0 && order.balanceDueAmount && order.balanceDueAmount > 0) {
    paymentStatusText = `${t("STATUS_PARTIAL", lang)} (${formatPdfCurrency(order.advancePaidAmount, currency)} Paid • ${formatPdfCurrency(order.balanceDueAmount, currency)} Due)`;
  }
  doc.text(`${t("PAYMENT_STATUS", lang)}: ${paymentStatusText}`, rightX, topMetaY + 17.5, { align: "right" });

  currentY = Math.max(currentY + 3.5, topMetaY + 22);

  // Divider Line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, rightX, currentY);
  currentY += 3;

  // 3. Buyer & Logistics Cards
  const cardGap = 3.5;
  const cardWidth = (contentWidth - cardGap) / 2;
  const innerPad = 3;
  const maxTextWidth = cardWidth - innerPad * 2;

  const customerCompany = order.customer?.company || order.customer?.name || "Client";
  const splitCompany = doc.splitTextToSize(customerCompany, maxTextWidth);
  const contactText = `${order.customer?.name || ""} ${order.customer?.email ? "• " + order.customer.email : ""} ${order.customer?.phone ? "• " + order.customer.phone : ""}`.trim();
  const splitContact = doc.splitTextToSize(contactText || "-", maxTextWidth);

  const addressText = order.shipping?.address || "Workshop Direct Delivery";
  const cityStateZip = [order.shipping?.city, order.shipping?.state, order.shipping?.zip, order.shipping?.country].filter(Boolean).join(", ");
  const splitShipping = doc.splitTextToSize(`${addressText}, ${cityStateZip || "International Hub"}`, maxTextWidth);

  const specsText = `Carrier: ${order.carrierName || "Standard Shipping"} • Dispatch: ${order.portOfLoading || "Saerbeck, Germany"}`;
  const splitSpecs = doc.splitTextToSize(specsText, maxTextWidth);

  const cardHeight = Math.max(22, Math.max(
    3.5 + 3.2 + splitCompany.length * 3.2 + splitContact.length * 2.8 + (order.customer?.taxId ? 3.0 : 0) + 2.5,
    3.5 + 3.2 + splitShipping.length * 3.0 + splitSpecs.length * 2.8 + 2.5
  ));

  // Left Card: Billed To
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
  c1Y += splitContact.length * 2.8;

  if (order.customer?.taxId) {
    doc.text(`Tax / VAT ID: ${order.customer.taxId}`, margin + innerPad, c1Y);
  }

  // Right Card: Ship To & Dispatch Specs
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

  // 4. Products Table
  const items = order.items && order.items.length > 0
    ? order.items
    : [{
        productName: order.productName || "Precision Speaker Parts",
        variantName: order.variantName || "Standard",
        quantity: order.quantity || 1,
        unitPrice: order.unitPrice || (order.total / (order.quantity || 1))
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
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
      halign: "left",
      cellPadding: 1.8,
      lineWidth: 0.2,
      lineColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center", fontStyle: "bold" },
      1: { cellWidth: "auto", fontStyle: "bold" },
      2: { cellWidth: 44, textColor: [0, 0, 0] },
      3: { cellWidth: 18, halign: "center", fontStyle: "bold" },
      4: { cellWidth: 26, halign: "right" },
      5: { cellWidth: 28, halign: "right", fontStyle: "bold" }
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      fontSize: 7.5,
      textColor: [0, 0, 0],
      cellPadding: 1.6,
      lineWidth: 0.2,
      lineColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 3;

  // 5. Financial Summary Block (Pure Black Text, Compact)
  const totalsWidth = 82;
  const totalsX = rightX - totalsWidth;
  let totY = currentY;

  const subtotal = Number(order.subtotal) || Number(order.total) || 0;
  const shipping = Number(order.shippingFee) || 0;
  const tax = Number(order.taxAmount) || 0;
  const discount = Number(order.discount) || 0;
  const grandTotal = Number(order.total) || (subtotal + shipping + tax - discount);

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
    doc.text(`${t("TAX_VAT", lang)} (${order.taxRate || 0}%):`, totalsX, totY);
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

  // Advance / Partial Payment Breakdown
  const advancePaid = Number(order.advancePaidAmount) || 0;
  const balanceDue = Number(order.balanceDueAmount) !== undefined && Number(order.balanceDueAmount) !== null
    ? Number(order.balanceDueAmount)
    : Math.max(0, grandTotal - advancePaid);

  if (advancePaid > 0 || (order.advancePaidPct && order.advancePaidPct > 0)) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(totalsX, totY, rightX, totY);
    totY += 3.2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    const pctLabel = order.advancePaidPct ? ` (${order.advancePaidPct}%)` : "";
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

  // 6. International Terms Card
  const termsCardHeight = 17;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, termsCardHeight, 2, 2, "DF");

  let termsY = currentY + 2.8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("STORE ORDER & DELIVERY TERMS & CONDITIONS", margin + 2.5, termsY);
  termsY += 3.0;

  const terms = [
    `1. Component Specifications: Precision speaker voice coils, diaphragms & repair parts. Origin: Germany. Currency: ${currency}.`,
    `2. Delivery & Transit: Dispatched via authorized courier with official consignment tracking provided upon dispatch.`,
    `3. Settlement: ${paymentStatusText}. Report transit claims within 7 days of package delivery with unboxing media.`,
    "4. Protective Packaging: Industrial shock-absorbing cushioning and secure moisture-barrier packaging."
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  for (const term of terms) {
    doc.text(term, margin + 2.5, termsY);
    termsY += 2.6;
  }

  currentY += termsCardHeight + 3;

  // 7. Authorized Store Declaration & Signatory Block
  let decY = currentY + 1;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(0, 0, 0);
  doc.text("AUTHORIZED STORE DECLARATION:", margin, decY);
  decY += 2.6;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  const declarationText = '"We hereby declare that this invoice shows the actual price of the goods described, and that all particulars are true and correct."';
  const splitDec = doc.splitTextToSize(declarationText, contentWidth * 0.6);
  doc.text(splitDec, margin, decY);

  const sigX = rightX - 52;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(0, 0, 0);
  doc.text("For IXOS SOUND & AUDIO", rightX, decY - 3, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(0, 0, 0);
  doc.text("IXOS Audio Webshop & Component Distribution", rightX, decY - 0.2, { align: "right" });
  doc.text("support@ixosweb.com • ixosweb.vercel.app", rightX, decY + 2.6, { align: "right" });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(sigX, decY + 6.5, rightX, decY + 6.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text("Authorized Signatory", rightX - 26, decY + 9.5, { align: "center" });

  // 8. Single Page Multi-Pass Cleanup
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    doc.text(`Page ${i} of ${totalPages} • IXOS Sound & Audio`, pageWidth / 2, pageHeight - 4.5, { align: "center" });
  }

  // Save the PDF
  const filename = `Invoice-${order.orderId || "Draft"}.pdf`;
  doc.save(filename);
}
