export type DocLanguage = "de" | "en" | "es" | "fr" | "pt" | "ar";

export type DocCurrency = "EUR" | "USD" | "GBP" | "INR" | "AUD" | "CAD" | "AED" | "SAR" | "JPY" | "CHF";

export interface CurrencyConfig {
  code: DocCurrency;
  symbol: string;
  name: string;
  rateToUsd: number; // For reference or 1:1 if custom
}

export const SUPPORTED_CURRENCIES: Record<DocCurrency, { symbol: string; pdfSymbol: string; name: string; position: "before" | "after" }> = {
  EUR: { symbol: "€", pdfSymbol: "EUR ", name: "Euro (EUR)", position: "before" },
  USD: { symbol: "$", pdfSymbol: "$", name: "US Dollar (USD)", position: "before" },
  GBP: { symbol: "£", pdfSymbol: "£", name: "British Pound (GBP)", position: "before" },
  INR: { symbol: "₹", pdfSymbol: "INR ", name: "Indian Rupee (INR)", position: "before" },
  AUD: { symbol: "A$", pdfSymbol: "A$", name: "Australian Dollar (AUD)", position: "before" },
  CAD: { symbol: "C$", pdfSymbol: "C$", name: "Canadian Dollar (CAD)", position: "before" },
  AED: { symbol: "AED ", pdfSymbol: "AED ", name: "UAE Dirham (AED)", position: "before" },
  SAR: { symbol: "SAR ", pdfSymbol: "SAR ", name: "Saudi Riyal (SAR)", position: "before" },
  JPY: { symbol: "¥", pdfSymbol: "¥", name: "Japanese Yen (JPY)", position: "before" },
  CHF: { symbol: "CHF ", pdfSymbol: "CHF ", name: "Swiss Franc (CHF)", position: "before" },
};

export const SUPPORTED_LANGUAGES: Record<DocLanguage, { label: string; flag: string }> = {
  de: { label: "Deutsch (DE)", flag: "🇩🇪" },
  en: { label: "English (EN)", flag: "🌐" },
  es: { label: "Español (ES)", flag: "🇪🇸" },
  fr: { label: "Français (FR)", flag: "🇫🇷" },
  pt: { label: "Português (PT)", flag: "🇵🇹" },
  ar: { label: "العربية (AR)", flag: "🇦🇪" },
};

export function formatDocCurrency(amount: number, currency: DocCurrency = "INR"): string {
  const curr = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.EUR;
  const numStr = (amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (curr.symbol.trim() === currency) {
    return `${curr.symbol}${numStr}`;
  }
  return `${curr.symbol}${numStr} ${currency}`;
}

export function formatDocCurrencyShort(amount: number, currency: DocCurrency = "INR"): string {
  const curr = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.EUR;
  const numStr = (amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${curr.symbol}${numStr}`;
}

/** Formats an amount using 100% PDF-safe ASCII symbols that never corrupt in jsPDF standard fonts */
export function formatPdfCurrency(amount: number, currency: DocCurrency = "INR"): string {
  const curr = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.EUR;
  const numStr = (amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${curr.pdfSymbol}${numStr}`;
}

/** Formats an amount for table cells where column header already states currency */
export function formatPdfTableNumber(amount: number): string {
  return (amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const TRANSLATIONS: Record<DocLanguage, Record<string, string>> = {
  en: {
    CI_TITLE: "COMMERCIAL INVOICE",
    PI_TITLE: "PROFORMA INVOICE (PI)",
    PL_TITLE: "PACKING LIST (PL)",
    QUOTATION_TITLE: "B2B PRICE QUOTATION",
    COO_TITLE: "CERTIFICATE OF ORIGIN (COO)",
    COA_TITLE: "CERTIFICATE OF ANALYSIS (COA)",
    SWIFT_TITLE: "BANK WIRE INSTRUCTIONS (SWIFT)",
    SHIPPING_ADVICE_TITLE: "SHIPPING ADVICE NOTE",
    SAMPLE_NOTE_TITLE: "SAMPLE TESTING AGREEMENT",
    CONTRACT_TITLE: "INTERNATIONAL SALES CONTRACT",

    CONSIGNEE_HEADER: "CONSIGNEE / BUYER",
    DELIVERY_HEADER: "DELIVERY & LOGISTICS",
    SPECIFICATIONS_HEADER: "DOCUMENT SPECIFICATIONS",

    TH_ITEM: "Item / Description",
    TH_VARIANT: "Specification / Size",
    TH_QTY: "Qty (Pcs)",
    TH_PRICE: "Unit Price",
    TH_TOTAL: "Total",

    SUBTOTAL: "Items Subtotal",
    SHIPPING_FEE: "Express Shipping & Freight",
    TAX_VAT: "Tax / VAT",
    DISCOUNT: "Discount Applied",
    GRAND_TOTAL: "Document Grand Total",
    AMOUNT_PAID: "Advance Paid / Received",
    BALANCE_DUE: "Balance Due / Unpaid",
    PAYMENT_STATUS: "Payment Status",
    PAYMENT_METHOD: "Payment Method",
    INCOTERMS: "Incoterms",
    HS_CODE: "HS Code",
    PORT_LOADING: "Port of Origin / Loading",
    CARRIER: "Carrier / AWB",
    VALID_UNTIL: "Validity",
    DATE: "Date",
    DOC_NO: "Document No.",
    NOTES: "Terms & Notes",
    TOTAL_CARTONS: "Total Cartons",
    GROSS_WEIGHT: "Gross Weight",
    NET_WEIGHT: "Net Weight",

    STATUS_PAID: "Paid in Full",
    STATUS_UNPAID: "Unpaid / Advance Required",
    STATUS_PARTIAL: "Partially Paid",
    STATUS_CONFIRMED: "Payment Confirmed"
  },
  es: {
    CI_TITLE: "FACTURA COMERCIAL",
    PI_TITLE: "FACTURA PROFORMA (PI)",
    PL_TITLE: "LISTA DE EMPAQUE DE EXPORTACIÓN (PL)",
    QUOTATION_TITLE: "COTIZACIÓN DE PRECIOS B2B",
    COO_TITLE: "CERTIFICADO DE ORIGEN (COO)",
    COA_TITLE: "CERTIFICADO DE ANÁLISIS Y CALIDAD (COA)",
    SWIFT_TITLE: "INSTRUCCIONES DE TRANSFERENCIA BANCARIA (SWIFT)",
    SHIPPING_ADVICE_TITLE: "AVISO DE ENVÍO Y DESPACHO",
    SAMPLE_NOTE_TITLE: "ACUERDO DE EVALUACIÓN DE MUESTRAS",
    CONTRACT_TITLE: "CONTRATO DE VENTA INTERNACIONAL",

    CONSIGNEE_HEADER: "CONSIGNATARIO / COMPRADOR",
    DELIVERY_HEADER: "ENTREGA Y LOGÍSTICA DE DESTINO",
    SPECIFICATIONS_HEADER: "ESPECIFICACIONES DEL DOCUMENTO",

    TH_ITEM: "Artículo / Descripción",
    TH_VARIANT: "Especificación / Medida",
    TH_QTY: "Cant. (Pzas)",
    TH_PRICE: "Precio Unitario",
    TH_TOTAL: "Total",

    SUBTOTAL: "Subtotal de Artículos",
    SHIPPING_FEE: "Flete y Envío Exprés",
    TAX_VAT: "Impuestos / IVA",
    DISCOUNT: "Descuento Aplicado",
    GRAND_TOTAL: "Total General del Documento",
    AMOUNT_PAID: "Anticipo Pagado / Recibido",
    BALANCE_DUE: "Saldo Pendiente / Por Pagar",
    PAYMENT_STATUS: "Estado de Pago",
    PAYMENT_METHOD: "Método de Pago",
    INCOTERMS: "Incoterms",
    HS_CODE: "Código Arancelario (HS)",
    PORT_LOADING: "Puerto de Origen / Carga",
    CARRIER: "Transportista / AWB",
    VALID_UNTIL: "Validez",
    DATE: "Fecha",
    DOC_NO: "Nº de Documento",
    NOTES: "Términos y Notas Comerciales",
    TOTAL_CARTONS: "Total de Bultos / Cajas",
    GROSS_WEIGHT: "Peso Bruto",
    NET_WEIGHT: "Peso Neto",

    STATUS_PAID: "Pagado en su Totalidad",
    STATUS_UNPAID: "No Pagado / Anticipo Requerido",
    STATUS_PARTIAL: "Pago Parcial Realizado",
    STATUS_CONFIRMED: "Pago Confirmado"
  },
  fr: {
    CI_TITLE: "FACTURE COMMERCIALE",
    PI_TITLE: "FACTURE PROFORMA (PI)",
    PL_TITLE: "LISTE DE COLISAGE D'EXPORTATION (PL)",
    QUOTATION_TITLE: "DEVIS COMMERCIAL B2B",
    COO_TITLE: "CERTIFICAT D'ORIGINE (COO)",
    COA_TITLE: "CERTIFICAT D'ANALYSE ET CONFORMITÉ (COA)",
    SWIFT_TITLE: "INSTRUCTIONS DE VIREMENT BANCAIRE (SWIFT)",
    SHIPPING_ADVICE_TITLE: "AVIS D'EXPÉDITION ET D'ENLÈVEMENT",
    SAMPLE_NOTE_TITLE: "ACCORD D'ÉCHANTILLONNAGE TECHNIQUE",
    CONTRACT_TITLE: "CONTRAT DE VENTE INTERNATIONAL",

    CONSIGNEE_HEADER: "DESTINATAIRE / ACHETEUR",
    DELIVERY_HEADER: "LIVRAISON & LOGISTIQUE",
    SPECIFICATIONS_HEADER: "SPÉCIFICATIONS DU DOCUMENT",

    TH_ITEM: "Article / Description",
    TH_VARIANT: "Spécification / Dimension",
    TH_QTY: "Qté (Pcs)",
    TH_PRICE: "Prix Unitaire",
    TH_TOTAL: "Total",

    SUBTOTAL: "Sous-total Articles",
    SHIPPING_FEE: "Frais de Port & Fret",
    TAX_VAT: "TVA / Taxes",
    DISCOUNT: "Remise Accordée",
    GRAND_TOTAL: "Total Général du Document",
    AMOUNT_PAID: "Acompte Payé / Reçu",
    BALANCE_DUE: "Solde Dû / Impayé",
    PAYMENT_STATUS: "Statut du Paiement",
    PAYMENT_METHOD: "Mode de Paiement",
    INCOTERMS: "Incoterms",
    HS_CODE: "Code Douanier (SH)",
    PORT_LOADING: "Port d'Origine / Chargement",
    CARRIER: "Transporteur / LTA",
    VALID_UNTIL: "Validité",
    DATE: "Date",
    DOC_NO: "Nº de Document",
    NOTES: "Conditions & Notes",
    TOTAL_CARTONS: "Total Cartons",
    GROSS_WEIGHT: "Poids Brut",
    NET_WEIGHT: "Poids Net",

    STATUS_PAID: "Payé en Totalité",
    STATUS_UNPAID: "Non Payé / Acompte Requis",
    STATUS_PARTIAL: "Partiellement Payé",
    STATUS_CONFIRMED: "Paiement Confirmé"
  },
  de: {
    CI_TITLE: "HANDELSRECHNUNG",
    PI_TITLE: "PROFORMA-RECHNUNG (PI)",
    PL_TITLE: "PACKLISTE (PL)",
    QUOTATION_TITLE: "B2B PREISANGEBOT",
    COO_TITLE: "URSPRUNGSZEUGNIS (COO)",
    COA_TITLE: "QUALITÄTS- & ANALYSENZERTIFIKAT (COA)",
    SWIFT_TITLE: "BANKÜBERWEISUNGSDATEN (SWIFT)",
    SHIPPING_ADVICE_TITLE: "VERSANDANZEIGE & AWB-AVIS",
    SAMPLE_NOTE_TITLE: "MUSTERPRÜFUNGSVEREINBARUNG",
    CONTRACT_TITLE: "INTERNATIONALER KAUFVERTRAG",

    CONSIGNEE_HEADER: "EMPFÄNGER / KÄUFER",
    DELIVERY_HEADER: "LIEFERUNG & LOGISTIK",
    SPECIFICATIONS_HEADER: "DOKUMENTSPEZIFIKATIONEN",

    TH_ITEM: "Artikel / Beschreibung",
    TH_VARIANT: "Spezifikation / Größe",
    TH_QTY: "Menge (Stk)",
    TH_PRICE: "Einzelpreis",
    TH_TOTAL: "Gesamt",

    SUBTOTAL: "Zwischensumme",
    SHIPPING_FEE: "Expressversand & Fracht",
    TAX_VAT: "MwSt. / Steuer",
    DISCOUNT: "Rabatt",
    GRAND_TOTAL: "Gesamtbetrag",
    AMOUNT_PAID: "Geleistete Anzahlung",
    BALANCE_DUE: "Restbetrag fällig",
    PAYMENT_STATUS: "Zahlungsstatus",
    PAYMENT_METHOD: "Zahlungsmethode",
    INCOTERMS: "Incoterms",
    HS_CODE: "Zolltarifnummer (HS)",
    PORT_LOADING: "Ladehafen / Herkunft",
    CARRIER: "Spedition / AWB",
    VALID_UNTIL: "Gültigkeit",
    DATE: "Datum",
    DOC_NO: "Dokument-Nr.",
    NOTES: "Bedingungen & Vermerke",
    TOTAL_CARTONS: "Packstücke gesamt",
    GROSS_WEIGHT: "Bruttogewicht",
    NET_WEIGHT: "Nettogewicht",

    STATUS_PAID: "Vollständig bezahlt",
    STATUS_UNPAID: "Unbezahlt / Anzahlung erforderlich",
    STATUS_PARTIAL: "Teilweise bezahlt",
    STATUS_CONFIRMED: "Zahlung bestätigt"
  },
  pt: {
    CI_TITLE: "FATURA COMERCIAL",
    PI_TITLE: "FATURA PROFORMA (PI)",
    PL_TITLE: "ROMANEIO DE CARGA / PACKING LIST (PL)",
    QUOTATION_TITLE: "COTAÇÃO DE PREÇOS B2B",
    COO_TITLE: "CERTIFICADO DE ORIGEM (COO)",
    COA_TITLE: "CERTIFICADO DE ANÁLISE E QUALIDADE (COA)",
    SWIFT_TITLE: "INSTRUÇÕES DE TRANSFERÊNCIA BANCÁRIA (SWIFT)",
    SHIPPING_ADVICE_TITLE: "AVISO DE EMBARQUE E EXPEDIÇÃO",
    SAMPLE_NOTE_TITLE: "ACORDO DE AVALIAÇÃO DE AMOSTRAS",
    CONTRACT_TITLE: "CONTRATO INTERNACIONAL DE COMPRA E VENDA",

    CONSIGNEE_HEADER: "CONSIGNATÁRIO / COMPRADOR",
    DELIVERY_HEADER: "ENTREGA E DESTINO",
    SPECIFICATIONS_HEADER: "ESPECIFICAÇÕES DO DOCUMENTO",

    TH_ITEM: "Item / Descrição",
    TH_VARIANT: "Especificação / Medida",
    TH_QTY: "Qtd. (Pçs)",
    TH_PRICE: "Preço Unitário",
    TH_TOTAL: "Total",

    SUBTOTAL: "Subtotal dos Itens",
    SHIPPING_FEE: "Frete e Envio Expresso",
    TAX_VAT: "Impostos / IVA",
    DISCOUNT: "Desconto Concedido",
    GRAND_TOTAL: "Total Geral do Documento",
    AMOUNT_PAID: "Adiantamento Pago / Recebido",
    BALANCE_DUE: "Saldo Devedor / A Pagar",
    PAYMENT_STATUS: "Status do Pagamento",
    PAYMENT_METHOD: "Método de Pagamento",
    INCOTERMS: "Incoterms",
    HS_CODE: "Código NCM / HS",
    PORT_LOADING: "Porto de Origem / Embarque",
    CARRIER: "Transportadora / AWB",
    VALID_UNTIL: "Validade",
    DATE: "Data",
    DOC_NO: "Nº do Documento",
    NOTES: "Termos e Notas Comerciais",
    TOTAL_CARTONS: "Total de Volumes",
    GROSS_WEIGHT: "Peso Bruto",
    NET_WEIGHT: "Peso Líquido",

    STATUS_PAID: "Pago Integralmente",
    STATUS_UNPAID: "Não Pago / Sinal Exigido",
    STATUS_PARTIAL: "Pago Parcialmente",
    STATUS_CONFIRMED: "Pagamento Confirmado"
  },
  ar: {
    CI_TITLE: "فاتورة تجارية",
    PI_TITLE: "فاتورة أولية (PROFORMA)",
    PL_TITLE: "قائمة التعبئة والتغليف (PL)",
    QUOTATION_TITLE: "عرض أسعار تجاري B2B",
    COO_TITLE: "شهادة المنشأ (COO)",
    COA_TITLE: "شهادة فحص الجودة والمطابقة (COA)",
    SWIFT_TITLE: "تعليمات التحويل المصرفي (SWIFT)",
    SHIPPING_ADVICE_TITLE: "إشعار الشحن والتسليم",
    SAMPLE_NOTE_TITLE: "اتفاقية فحص العينات",
    CONTRACT_TITLE: "عقد بيع وتصدير دولي",

    CONSIGNEE_HEADER: "المرسل إليه / المشتري",
    DELIVERY_HEADER: "الشحن والوجهة",
    SPECIFICATIONS_HEADER: "مواصفات المستند",

    TH_ITEM: "الصنف / الوصف",
    TH_VARIANT: "المواصفات / المقاس",
    TH_QTY: "الكمية (قطعة)",
    TH_PRICE: "سعر الوحدة",
    TH_TOTAL: "الإجمالي",

    SUBTOTAL: "إجمالي المنتجات",
    SHIPPING_FEE: "أجور الشحن السريع",
    TAX_VAT: "الضريبة / القيمة المضافة",
    DISCOUNT: "الخصم المطبق",
    GRAND_TOTAL: "المبلغ الإجمالي الكلي",
    AMOUNT_PAID: "الدفعة المقدمة المدفوعة",
    BALANCE_DUE: "المبلغ المتبقي غير المسدد",
    PAYMENT_STATUS: "حالة الدفع",
    PAYMENT_METHOD: "طريقة الدفع",
    INCOTERMS: "شروط التجارة الدولية (Incoterms)",
    HS_CODE: "الرمز الجمركي (HS)",
    PORT_LOADING: "ميناء الشحن / المنشأ",
    CARRIER: "شركة الشحن / رقم البوليصة",
    VALID_UNTIL: "فترة الصلاحية",
    DATE: "التاريخ",
    DOC_NO: "رقم المستند",
    NOTES: "الشروط والملاحظات",
    TOTAL_CARTONS: "إجمالي الصناديق",
    GROSS_WEIGHT: "الوزن الإجمالي",
    NET_WEIGHT: "الوزن الصافي",

    STATUS_PAID: "مدفوع بالكامل",
    STATUS_UNPAID: "غير مدفوع / يلزم دفعة مقدمة",
    STATUS_PARTIAL: "مدفوع جزئياً",
    STATUS_CONFIRMED: "تم تأكيد الدفع"
  }
};

export function t(key: string, lang: DocLanguage = "de"): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.de || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.de[key] || TRANSLATIONS.en[key] || key;
}
