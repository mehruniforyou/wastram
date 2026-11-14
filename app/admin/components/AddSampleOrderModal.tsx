"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  DollarSign,
  FileText,
  AlertCircle,
  Layers,
  Globe,
} from "lucide-react";
import AdminCustomSelect from "./AdminCustomSelect";
import AdminDrawer from "./AdminDrawer";
import { Button } from "@/components/ui/button";
import { generateOrderSerialNumber, formatOrderSerialNumber, fetchNextOrderSerialNumber } from "@/utils/orderNumber";
import { notifyAdmin } from "./AdminToast";

export interface CategoryItem {
  id: string;
  name: string;
  slug?: string;
}

interface ProductVariant {
  id: string;
  name: string;
  price: number | null;
}

interface ProductItem {
  id: string;
  name: string;
  category_id?: string;
  price: number | null;
  variants?: ProductVariant[];
  category?: { id?: string; name: string; slug: string };
}

interface OrderItem {
  productId?: string;
  productName: string;
  variantName: string;
  quantity: number | string;
  unitPrice: number | string;
  isCategoryBundle?: boolean;
}

interface AddSampleOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: any) => void;
  products: ProductItem[];
  categories?: CategoryItem[];
}

const POPULAR_COUNTRIES = [
  { code: "DE", name: "Deutschland", flag: "🇩🇪" },
  { code: "AT", name: "Österreich", flag: "🇦🇹" },
  { code: "CH", name: "Schweiz", flag: "🇨🇭" },
  { code: "FR", name: "Frankreich", flag: "🇫🇷" },
  { code: "IT", name: "Italien", flag: "🇮🇹" },
  { code: "ES", name: "Spanien", flag: "🇪🇸" },
  { code: "NL", name: "Niederlande", flag: "🇳🇱" },
  { code: "BE", name: "Belgien", flag: "🇧🇪" },
  { code: "GB", name: "Großbritannien", flag: "🇬🇧" },
  { code: "CA", name: "Kanada", flag: "🇨🇦" },
  { code: "US", name: "Vereinigte Staaten", flag: "🇺🇸" },
  { code: "BR", name: "Brasilien", flag: "🇧🇷" },
  { code: "MX", name: "Mexiko", flag: "🇲🇽" },
  { code: "CO", name: "Kolumbien", flag: "🇨🇴" },
  { code: "DO", name: "Dominikanische Republik", flag: "🇩🇴" },
  { code: "PR", name: "Puerto Rico", flag: "🇵🇷" },
  { code: "ID", name: "Indonesien", flag: "🇮🇩" },
  { code: "PH", name: "Philippinen", flag: "🇵🇭" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "IN", name: "Indien", flag: "🇮🇳" },
  { code: "AE", name: "Vereinigte Arabische Emirate", flag: "🇦🇪" },
  { code: "AU", name: "Australien", flag: "🇦🇺" },
  { code: "ZA", name: "Südafrika", flag: "🇿🇦" },
];

export default function AddSampleOrderModal({
  isOpen,
  onClose,
  onOrderCreated,
  products,
  categories = [],
}: AddSampleOrderModalProps) {
  const [orderNumber, setOrderNumber] = useState<string>(() => {
    return generateOrderSerialNumber();
  });

  React.useEffect(() => {
    if (isOpen) {
      fetchNextOrderSerialNumber().then((num) => {
        if (num) setOrderNumber(num);
      });
    }
  }, [isOpen]);

  const [orderDate, setOrderDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [orderStatus, setOrderStatus] = useState<string>("Payment Confirmed");
  const [currency, setCurrency] = useState<string>("EUR");

  // Category batch adder state
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [catItemQty, setCatItemQty] = useState<number>(1);
  const [categoryNotice, setCategoryNotice] = useState<string>("");

  // Customer state
  const [customerName, setCustomerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [taxId, setTaxId] = useState("");

  // Shipping address state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("Deutschland");

  // Sample items
  const [items, setItems] = useState<OrderItem[]>([
    {
      productId: products[0]?.id || "",
      productName: products[0]?.name || "4.5\" Premium Schaumstoffsicke",
      variantName: products[0]?.variants?.[0]?.name || "Standard-Paar",
      quantity: 2,
      unitPrice: products[0]?.price || 15,
    },
  ]);

  // Financials & Payment
  const [shippingFee, setShippingFee] = useState<number | string>(25);
  const [discount, setDiscount] = useState<number | string>(0);
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Pending" | "Complimentary">("Paid");
  const [paymentGateway, setPaymentGateway] = useState<string>("Direkte Banküberweisung (SEPA / Wire)");
  const [transactionId, setTransactionId] = useState<string>("");

  // Logistics & Customs
  const [carrierName, setCarrierName] = useState<string>("DHL Paket");
  const [trackingAwb, setTrackingAwb] = useState<string>("");
  const [incoterms, setIncoterms] = useState<string>("CPT - Carriage Paid To");
  const [hsCode, setHsCode] = useState<string>("8518.90.00");
  const [portOfLoading, setPortOfLoading] = useState<string>("Saerbeck / Flughafen Frankfurt (FRA), Deutschland");
  const [notes, setNotes] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  // Calculation helpers
  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  );
  const total = Math.max(0, subtotal + Number(shippingFee || 0) - Number(discount || 0));
  const currencySymbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "INR" ? "₹" : "$";

  const getProductsForCategory = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return [];
    return products.filter((p) => {
      if (p.category_id && p.category_id === catId) return true;
      if (p.category?.id && p.category.id === catId) return true;
      if (p.category?.name && cat.name && p.category.name.toLowerCase() === cat.name.toLowerCase()) return true;
      if (p.category?.slug && cat.slug && p.category.slug.toLowerCase() === cat.slug.toLowerCase()) return true;
      return false;
    });
  };

  const handleAddAllProductsFromCategory = () => {
    if (!selectedCatId) return;
    const cat = categories.find((c) => c.id === selectedCatId);
    if (!cat) return;
    const catProducts = getProductsForCategory(selectedCatId);

    if (catProducts.length === 0) {
      setCategoryNotice(`Keine Produkte für "${cat.name}" gefunden.`);
      setTimeout(() => setCategoryNotice(""), 4000);
      return;
    }

    const newItems: OrderItem[] = catProducts.map((p) => ({
      productId: p.id,
      productName: p.name,
      variantName: p.variants?.[0]?.name || "Standard-Einheit",
      quantity: catItemQty,
      unitPrice: p.price || p.variants?.[0]?.price || 15,
    }));

    setItems((prev) => {
      // If the only item is an untouched placeholder, replace it
      if (
        prev.length === 1 &&
        (!prev[0].productName ||
          prev[0].productName === "4.5\" Premium Schaumstoffsicke" ||
          prev[0].productName === "4.5\" High Quality Foam Surround" ||
          prev[0].productName === "Sample Speaker Part" ||
          prev[0].productName === "Muster-Lautsprecherteil")
      ) {
        return newItems;
      }
      return [...prev, ...newItems];
    });

    setCategoryNotice(
      `Alle ${catProducts.length} Artikel aus "${cat.name}" hinzugefügt (${catItemQty} Stk. pro Artikel)!`
    );
    setTimeout(() => setCategoryNotice(""), 5000);
  };

  const handleAddCategoryAsMasterBundle = () => {
    if (!selectedCatId) return;
    const cat = categories.find((c) => c.id === selectedCatId);
    if (!cat) return;
    const catProducts = getProductsForCategory(selectedCatId);

    const calculatedBundlePrice = catProducts.reduce(
      (sum, p) => sum + (p.price || p.variants?.[0]?.price || 15),
      0
    );

    const bundleItem: OrderItem = {
      productId: `bundle_${cat.id}`,
      productName: `Komplettes ${cat.name} Musterset`,
      variantName: `Gesamtes Kategorie-Set (${catProducts.length || "Alle"} Modelle sortiert)`,
      quantity: catItemQty,
      unitPrice: calculatedBundlePrice > 0 ? calculatedBundlePrice : 45,
      isCategoryBundle: true,
    };

    setItems((prev) => {
      if (
        prev.length === 1 &&
        (!prev[0].productName ||
          prev[0].productName === "4.5\" Premium Schaumstoffsicke" ||
          prev[0].productName === "4.5\" High Quality Foam Surround" ||
          prev[0].productName === "Sample Speaker Part" ||
          prev[0].productName === "Muster-Lautsprecherteil")
      ) {
        return [bundleItem];
      }
      return [...prev, bundleItem];
    });

    setCategoryNotice(`"${bundleItem.productName}" als 1 Haupt-Musterpaket hinzugefügt!`);
    setTimeout(() => setCategoryNotice(""), 5000);
  };

  const handleProductSelect = (index: number, prodId: string) => {
    if (prodId.startsWith("bundle_")) {
      const catId = prodId.replace("bundle_", "");
      const cat = categories.find((c) => c.id === catId);
      if (cat) {
        const catProducts = getProductsForCategory(catId);
        const calculatedPrice = catProducts.reduce(
          (sum, p) => sum + (p.price || p.variants?.[0]?.price || 15),
          0
        );
        setItems((prev) => {
          const copy = [...prev];
          copy[index] = {
            productId: prodId,
            productName: `Komplettes ${cat.name} Musterset`,
            variantName: `Gesamtes Kategorie-Set (${catProducts.length || "Alle"} Modelle sortiert)`,
            quantity: 1,
            unitPrice: calculatedPrice > 0 ? calculatedPrice : 45,
            isCategoryBundle: true,
          };
          return copy;
        });
        return;
      }
    }

    const found = products.find((p) => p.id === prodId);
    setItems((prev) => {
      const copy = [...prev];
      if (found) {
        copy[index] = {
          ...copy[index],
          productId: found.id,
          productName: found.name,
          variantName: found.variants?.[0]?.name || "Standard-Einheit",
          unitPrice: found.price || found.variants?.[0]?.price || 10,
          isCategoryBundle: false,
        };
      }
      return copy;
    });
  };

  const handleAddItem = () => {
    const defaultProd = products[0];
    setItems((prev) => [
      ...prev,
      {
        productId: defaultProd?.id || "",
        productName: defaultProd?.name || "Muster-Lautsprecherteil",
        variantName: defaultProd?.variants?.[0]?.name || "Evaluierungseinheit",
        quantity: 2,
        unitPrice: defaultProd?.price || 15,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Kundenname ist erforderlich.");
      return;
    }
    if (!customerEmail.trim()) {
      setErrorMsg("E-Mail-Adresse des Kunden ist erforderlich.");
      return;
    }
    if (!city.trim() || !country.trim()) {
      setErrorMsg("Stadt und Land sind für den Versand erforderlich.");
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Bitte fügen Sie mindestens einen Musterartikel hinzu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedItems = items.map((it) => ({
        productName: it.productName.trim(),
        variantName: it.variantName.trim(),
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
      }));

      const primaryItem = normalizedItems[0];
      const itemsTitle =
        normalizedItems.length > 1
          ? `${primaryItem.productName} + ${normalizedItems.length - 1} weitere Artikel`
          : primaryItem.productName;

      const finalOrderNumber = formatOrderSerialNumber(orderNumber);

      const orderPayload = {
        orderId: finalOrderNumber,
        order_number: finalOrderNumber,
        date: orderDate,
        productId: items[0]?.productId || "sample-eval-part",
        productName: itemsTitle,
        variantName:
          normalizedItems.length > 1
            ? `Sortierte Muster (${normalizedItems.length} Artikel)`
            : primaryItem.variantName,
        quantity: normalizedItems.reduce((acc, it) => acc + it.quantity, 0),
        unitPrice: primaryItem.unitPrice,
        subtotal: subtotal,
        shippingFee: Number(shippingFee || 0),
        discount: Number(discount || 0),
        total: total,
        currency: currency,
        status: orderStatus,
        carrierName: carrierName,
        trackingAwbNumber: trackingAwb.trim(),
        incoterms: incoterms,
        hsCode: hsCode.trim() || "8518.90.00",
        portOfLoading: portOfLoading.trim() || "Saerbeck / Flughafen Frankfurt (FRA), Deutschland",
        dispatchDate: orderStatus === "Dispatched" || orderStatus === "Delivered" ? orderDate : "",
        notes: notes.trim(),
        items: normalizedItems,
        customer: {
          name: customerName.trim(),
          company: companyName.trim(),
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          taxId: taxId.trim(),
        },
        shipping: {
          address: address.trim() || "Direktversand ab Werk",
          city: city.trim(),
          state: stateName.trim(),
          zip: zip.trim(),
          country: country.trim(),
        },
        payment: {
          gateway: paymentGateway,
          status: paymentStatus === "Complimentary" ? "Paid" : paymentStatus,
          transactionId: transactionId.trim() || `TXN-${orderNumber.trim()}`,
        },
      };

      // 1. Save to /api/orders
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Bestellung konnte nicht angelegt werden.");
      }

      const created = await res.json();
      const savedOrder = created.order || created.data || orderPayload;
      const actualOrderNumber = savedOrder.order_number || created.orderNumber || finalOrderNumber;

      // 2. If payment is marked Paid, sync to /api/payments as well
      if (paymentStatus === "Paid" || paymentStatus === "Complimentary") {
        try {
          await fetch("/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: actualOrderNumber,
              order_number: actualOrderNumber,
              customer_name: customerName.trim() + (companyName ? ` (${companyName})` : ""),
              customer_email: customerEmail.trim(),
              customer_phone: customerPhone.trim(),
              amount: total,
              currency: currency,
              gateway: paymentGateway,
              payment_gateway: paymentGateway,
              payment_status: "Paid",
              transaction_id: transactionId.trim() || `TXN-${actualOrderNumber}`,
              created_at: new Date(orderDate).toISOString(),
            }),
          });
        } catch {
          // Ignore secondary payment sync errors
        }
      }

      // Notify parent & close modal
      onOrderCreated({ ...savedOrder, currency });
      notifyAdmin("success", "Bestellung erstellt", `Musterbestellung #${actualOrderNumber} wurde erfolgreich angelegt.`);
      onClose();
    } catch (err: any) {
      console.error("Error creating manual sample order:", err);
      const msg = err.message || "Beim Speichern der Bestellung ist ein Fehler aufgetreten.";
      setErrorMsg(msg);
      notifyAdmin("error", "Fehler beim Anlegen der Bestellung", msg, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-background border border-input focus:ring-1 focus:ring-ring focus:border-ring rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none font-medium transition-colors";
  const labelClass = "block text-[11px] font-bold text-foreground uppercase tracking-wider mb-1";

  return (
    <AdminDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Bestellung manuell anlegen"
      subtitle="Kundenbestellungen, Musterpakete und Evaluierungssendungen mit Sendungsverfolgung und Rechnungen erfassen."
      badge={
        <span className="text-[10px] normal-case bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
          Manuelle Bestellung
        </span>
      }
      maxWidthClass="max-w-5xl"
      backLabel="Zurück zu den Bestellungen"
    >
      {errorMsg && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* ── Section 1: Order Metadata ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-foreground" />
            Bestellidentifikation &amp; Metadaten
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className={labelClass}>Bestell-Nr. / Rechnungs-Nr.</label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className={`${inputClass} font-mono font-bold`}
                />
              </div>
              <div>
                <label className={labelClass}>Bestelldatum</label>
                <input
                  type="date"
                  required
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Währung</label>
                <AdminCustomSelect
                  value={currency}
                  onChange={(val) => setCurrency(val as string)}
                  options={[
                    { value: "EUR", label: "EUR (€) – Eurozone / Shop-Standard" },
                    { value: "USD", label: "USD ($) – US-Dollar" },
                    { value: "GBP", label: "GBP (£) – Großbritannien" },
                    { value: "INR", label: "INR (₹) – Indien" }
                  ]}
                  variant="form"
                />
              </div>
              <div>
                <label className={labelClass}>Bestellstatus</label>
                <AdminCustomSelect
                  value={orderStatus}
                  onChange={(val) => setOrderStatus(val)}
                  options={[
                    { value: "Payment Confirmed", label: "Neue Bestellung (Zahlung bestätigt)" },
                    { value: "Courier Assigned", label: "Kurier zugewiesen" },
                    { value: "Dispatched", label: "Auf dem Versandweg" },
                    { value: "Shipped", label: "Versendet" },
                    { value: "Delivered", label: "Zugestellt" },
                    { value: "Cancelled", label: "Storniert" }
                  ]}
                  variant="form"
                />
              </div>
            </div>
          </div>

          {/* ── Section 2: Customer & Company ── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-foreground" />
              Kunden- &amp; Unternehmensdaten
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Vollständiger Kundenname *</label>
                <input
                  type="text"
                  required
                  placeholder="z. B. Maximilian Bauer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Firma / Marke / Werkstatt</label>
                <input
                  type="text"
                  placeholder="z. B. Klangwerk Acoustics GmbH"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>E-Mail-Adresse *</label>
                <input
                  type="email"
                  required
                  placeholder="z. B. bauer@klangwerk.de"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Telefon / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+49 170 1234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ── Section 3: Shipping & Delivery Address ── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-foreground" />
              Liefer- &amp; Versandadresse
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <label className={labelClass}>Straße &amp; Hausnummer / Gebäude</label>
                <input
                  type="text"
                  placeholder="Industriestraße 12, Tor 4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Stadt *</label>
                <input
                  type="text"
                  required
                  placeholder="z. B. Frankfurt, Berlin"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Bundesland / Region</label>
                <input
                  type="text"
                  placeholder="z. B. Nordrhein-Westfalen, Bayern"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Postleitzahl</label>
                <input
                  type="text"
                  placeholder="z. B. 48369"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-3">
                <label className={labelClass}>Zielland *</label>
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <AdminCustomSelect
                      value={country}
                      onChange={(val) => setCountry(val)}
                      options={[
                        ...POPULAR_COUNTRIES.map((c) => ({
                          value: c.name,
                          label: `${c.flag} ${c.name}`
                        })),
                        { value: "Other Country", label: "🌐 Anderes internationales Zielland" }
                      ]}
                      variant="form"
                      searchable
                    />
                  </div>
                  {country === "Other Country" && (
                    <input
                      type="text"
                      placeholder="Ländernamen eingeben..."
                      onChange={(e) => setCountry(e.target.value)}
                      className={inputClass}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4: Sample Items ── */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
                <Package className="w-3.5 h-3.5 text-foreground" />
                Bestellartikel &amp; Katalogprodukte
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                + Weiteren Artikel hinzufügen
              </button>
            </div>

            {/* Quick Category Adder Toolbar */}
            {categories && categories.length > 0 && (
              <div className="p-3.5 bg-card border border-border rounded-xl space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                    <Layers className="w-4 h-4 text-foreground" />
                    <span>Gesamte Kategorie zur Bestellung hinzufügen</span>
                    <span className="text-[10px] font-normal text-muted-foreground hidden sm:inline">
                      (Alle Artikel einer Kategorie im Stapel hinzufügen)
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {categories.length} Kategorien
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <AdminCustomSelect
                    value={selectedCatId}
                    onChange={(val) => setSelectedCatId(val)}
                    options={[
                      { value: "", label: "Kategorie für Stapelhinzufügung auswählen..." },
                      ...categories.map((c) => {
                        const count = getProductsForCategory(c.id).length;
                        return {
                          value: c.id,
                          label: `${c.name} (${count} Produkt${count === 1 ? "" : "e"})`
                        };
                      })
                    ]}
                    variant="outline"
                    size="sm"
                    searchable
                    className="min-w-[210px]"
                  />

                  <div className="flex items-center gap-1.5 bg-background border border-input rounded-xl px-2 py-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Menge/Art.:</span>
                    <AdminCustomSelect
                      value={String(catItemQty)}
                      onChange={(val) => setCatItemQty(Number(val))}
                      options={[
                        { value: "1", label: "1 Einheit je Artikel" },
                        { value: "2", label: "2 Einheiten (Paar) je Artikel" },
                        { value: "4", label: "4 Einheiten je Artikel" },
                        { value: "5", label: "5 Einheiten je Artikel" },
                        { value: "10", label: "10 Einheiten je Artikel" }
                      ]}
                      variant="badge"
                      size="xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddAllProductsFromCategory}
                    disabled={!selectedCatId}
                    className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Alle Kategorie-Produkte hinzufügen
                  </button>

                  <button
                    type="button"
                    onClick={handleAddCategoryAsMasterBundle}
                    disabled={!selectedCatId}
                    className="px-3 py-1.5 bg-background text-foreground hover:bg-muted border border-border disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all"
                    title="Als 1 Paketposition hinzufügen"
                  >
                    <Package className="w-3.5 h-3.5 text-foreground" />
                    Als 1 Haupt-Paket hinzufügen
                  </button>
                </div>

                {categoryNotice && (
                  <div className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md flex items-center gap-1.5 animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {categoryNotice}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {items.map((item, idx) => {
                const selectedProd = products.find((p) => p.id === item.productId);
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-card border border-border rounded-xl space-y-2 relative"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                        Artikel #{idx + 1}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                      {/* Product Selector */}
                      <div className="sm:col-span-5">
                        <label className={labelClass}>Katalogprodukt</label>
                        <AdminCustomSelect
                          value={item.productId || ""}
                          onChange={(val) => handleProductSelect(idx, val)}
                          options={[
                            ...(categories && categories.length > 0
                              ? categories.map((c) => ({
                                  value: `bundle_${c.id}`,
                                  label: `📦 Vollständiges ${c.name}-Musterset (Alle Modelle)`,
                                  badge: "Paket",
                                  badgeColor: "bg-muted text-foreground border border-border"
                                }))
                              : []),
                            ...products.map((p) => ({
                              value: p.id,
                              label: p.name
                            })),
                            { value: "custom", label: "✏️ Individuelles / Prototypen-Teil" }
                          ]}
                          variant="form"
                          searchable
                        />
                      </div>

                      {/* Custom name if custom selected */}
                      {item.productId === "custom" ? (
                        <div className="sm:col-span-3">
                          <label className={labelClass}>Individuelle Bezeichnung</label>
                          <input
                            type="text"
                            placeholder="z. B. 15-Zoll PA-Papiermembran"
                            value={item.productName}
                            onChange={(e) =>
                              setItems((prev) => {
                                const copy = [...prev];
                                copy[idx].productName = e.target.value;
                                return copy;
                              })
                            }
                            className={inputClass}
                          />
                        </div>
                      ) : (
                        <div className="sm:col-span-3">
                          <label className={labelClass}>Variante / Spezifikation</label>
                          {selectedProd?.variants && selectedProd.variants.length > 0 ? (
                            <AdminCustomSelect
                              value={item.variantName}
                              onChange={(val) =>
                                setItems((prev) => {
                                  const copy = [...prev];
                                  const v = selectedProd.variants?.find(
                                    (varItem) => varItem.name === val
                                  );
                                  copy[idx].variantName = val;
                                  if (v?.price) copy[idx].unitPrice = v.price;
                                  return copy;
                                })
                              }
                              options={selectedProd.variants.map((v) => ({
                                value: v.name,
                                label: `${v.name} ${v.price ? `(${v.price} €)` : ""}`
                              }))}
                              variant="form"
                            />
                          ) : (
                            <input
                              type="text"
                              placeholder="z. B. Standard-Evaluierungseinheit"
                              value={item.variantName}
                              onChange={(e) =>
                                setItems((prev) => {
                                  const copy = [...prev];
                                  copy[idx].variantName = e.target.value;
                                  return copy;
                                })
                              }
                              className={inputClass}
                            />
                          )}
                        </div>
                      )}

                      {/* Quantity */}
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Menge</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={item.quantity !== undefined && item.quantity !== null ? item.quantity : ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setItems((prev) => {
                              const copy = [...prev];
                              copy[idx].quantity = val;
                              return copy;
                            });
                          }}
                          placeholder="1"
                          className={`${inputClass} font-mono font-bold`}
                        />
                      </div>

                      {/* Unit Price */}
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Einzelpreis ({currencySymbol})</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={item.unitPrice !== undefined && item.unitPrice !== null ? item.unitPrice : ""}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                            setItems((prev) => {
                              const copy = [...prev];
                              copy[idx].unitPrice = val;
                              return copy;
                            });
                          }}
                          placeholder="0.00"
                          className={`${inputClass} font-mono font-bold`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Section 5: Financials & Payment ── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5 text-foreground" />
              Zahlung, Versand &amp; Finanzen
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Zahlungsstatus</label>
                <AdminCustomSelect
                  value={paymentStatus}
                  onChange={(val) =>
                    setPaymentStatus(val as "Paid" | "Pending" | "Complimentary")
                  }
                  options={[
                    { value: "Paid", label: "Vollständig bezahlt", badge: "Bezahlt", badgeColor: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" },
                    { value: "Pending", label: "Zahlung ausstehend", badge: "Ausstehend", badgeColor: "bg-amber-500/10 text-amber-600 border border-amber-500/20" },
                    { value: "Complimentary", label: "Kostenloses Muster (0 €)", badge: "Kostenlos", badgeColor: "bg-blue-500/10 text-blue-600 border border-blue-500/20" }
                  ]}
                  variant="form"
                />
              </div>

              <div>
                <label className={labelClass}>Zahlungsmethode / Gateway</label>
                <AdminCustomSelect
                  value={paymentGateway}
                  onChange={(val) => setPaymentGateway(val)}
                  options={[
                    { value: "Direct Bank Transfer (Wire / SWIFT)", label: "Direkte Banküberweisung (SEPA / Wire)" },
                    { value: "PayPal", label: "PayPal" },
                    { value: "Credit / Debit Card", label: "Kredit- / Debitkarte" },
                    { value: "Cash on Delivery", label: "Nachnahme" },
                    { value: "Free Evaluation Sample", label: "Kostenloses Evaluierungsmuster" }
                  ]}
                  variant="form"
                />
              </div>

              <div>
                <label className={labelClass}>Transaktionsnummer / Referenz (optional)</label>
                <input
                  type="text"
                  placeholder="z. B. SEPA-8492048 oder PAYPAL-TXN-123"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Versand- &amp; Kuriergebühr ({currencySymbol})</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={shippingFee !== undefined && shippingFee !== null ? shippingFee : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                    setShippingFee(val);
                  }}
                  placeholder="0.00"
                  className={`${inputClass} font-mono`}
                />
              </div>

              <div>
                <label className={labelClass}>Rabatt ({currencySymbol})</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={discount !== undefined && discount !== null ? discount : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                    setDiscount(val);
                  }}
                  placeholder="0.00"
                  className={`${inputClass} font-mono`}
                />
              </div>

              {/* Total Summary Badge */}
              <div className="flex flex-col justify-end">
                <div className="p-3 bg-card border border-border rounded-xl flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">Gesamtbetrag:</span>
                  <span className="text-sm font-bold text-primary font-mono">
                    {currencySymbol}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 6: Logistics & Dispatch (Optional) ── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-foreground" />
              Logistik &amp; Sendungsverfolgung (optional)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Versanddienstleister / Kurier</label>
                <AdminCustomSelect
                  value={carrierName}
                  onChange={(val) => setCarrierName(val)}
                  options={[
                    { value: "DHL Paket", label: "DHL Paket (Weltweiter Versand)" },
                    { value: "FedEx Priority", label: "FedEx Priority International" },
                    { value: "Deutsche Post", label: "Deutsche Post / DHL Paket" },
                    { value: "UPS Express", label: "UPS Express" },
                    { value: "Selbstabholung / Werksübergabe", label: "Selbstabholung / Werksübergabe" }
                  ]}
                  variant="form"
                />
              </div>

              <div>
                <label className={labelClass}>Sendungsnummer / AWB</label>
                <input
                  type="text"
                  placeholder="z. B. 7482910482 (DHL 10-stellig)"
                  value={trackingAwb}
                  onChange={(e) => setTrackingAwb(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Interne Notizen / Technische Spezifikationen</label>
                <textarea
                  rows={2}
                  placeholder="z. B. Kunde hat 2-Ohm Schwingspulenmuster auf schwarzem Aluminiumträger angefordert."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ── Section 7: Shipping & Dispatch Specifications ── */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-foreground" />
              Versand- &amp; Lagerspezifikationen
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Lagerstandort / Versandzentrum</label>
                <input
                  type="text"
                  placeholder="Saerbeck / Deutschland"
                  value={portOfLoading}
                  onChange={(e) => setPortOfLoading(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Versandanweisungen</label>
                <input
                  type="text"
                  placeholder="z. B. Standardmäßig versicherter Expressversand"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex justify-end items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Bestellung wird gespeichert...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Bestellung verbindlich anlegen
                </>
              )}
            </Button>
          </div>
        </form>
    </AdminDrawer>
  );
}
