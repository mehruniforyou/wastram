"use client";

import React, { useState, useEffect } from "react";
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
  AlertCircle,
  Globe,
  Save,
  Clock,
} from "lucide-react";
import AdminCustomSelect from "./AdminCustomSelect";
import AdminDrawer from "./AdminDrawer";
import { Button } from "@/components/ui/button";
import { formatOrderSerialNumber } from "@/utils/orderNumber";
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

export interface OrderItem {
  productId?: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  isCategoryBundle?: boolean;
}

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onOrderUpdated: (updatedOrder: any) => void;
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

export default function EditOrderModal({
  isOpen,
  onClose,
  order,
  onOrderUpdated,
  products = [],
  categories = [],
}: EditOrderModalProps) {
  const orderNumber = formatOrderSerialNumber(order?.orderId || order?.order_number || order?.id || "");

  // Order meta
  const [orderDate, setOrderDate] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("Payment Confirmed");
  const [currency, setCurrency] = useState<string>("EUR");

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

  // Items
  const [items, setItems] = useState<OrderItem[]>([]);

  // Financials & Payment
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<"Paid" | "Pending" | "Refunded" | "Complimentary">("Paid");
  const [paymentGateway, setPaymentGateway] = useState<string>("Direkte Banküberweisung (SEPA / Wire)");
  const [transactionId, setTransactionId] = useState<string>("");

  // Logistics & Customs
  const [carrierName, setCarrierName] = useState<string>("DHL Paket");
  const [trackingAwb, setTrackingAwb] = useState<string>("");
  const [dispatchDate, setDispatchDate] = useState<string>("");
  const [incoterms, setIncoterms] = useState<string>("CPT - Carriage Paid To");
  const [hsCode, setHsCode] = useState<string>("8518.90.00");
  const [portOfLoading, setPortOfLoading] = useState<string>("Saerbeck / Flughafen Frankfurt (FRA), Deutschland");
  const [notes, setNotes] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Initialize form when order prop changes
  useEffect(() => {
    if (!order) return;

    setOrderDate(order.date || order.created_at?.split("T")[0] || new Date().toISOString().split("T")[0]);
    setOrderStatus(order.status || "Payment Confirmed");
    const ordCurr = (order.currency || "EUR").toUpperCase();
    setCurrency(ordCurr === "INR" ? "INR" : ordCurr === "USD" ? "USD" : ordCurr === "GBP" ? "GBP" : "EUR");

    setCustomerName(order.customer?.name || order.customer_name || "");
    setCompanyName(order.customer?.company || "");
    setCustomerEmail(order.customer?.email || order.customer_email || "");
    setCustomerPhone(order.customer?.phone || order.customer_phone || "");
    setTaxId(order.customer?.taxId || "");

    setAddress(order.shipping?.address || order.shipping_address || "");
    setCity(order.shipping?.city || order.shipping_city || "");
    setStateName(order.shipping?.state || order.shipping_state || "");
    setZip(order.shipping?.zip || order.shipping_zip || "");
    setCountry(order.shipping?.country || order.shipping_country || "Deutschland");

    const rawItems: OrderItem[] = Array.isArray(order.items) && order.items.length > 0
      ? order.items.map((it: any) => ({
          productId: it.productId || "",
          productName: it.productName || it.name || "Lautsprecherkomponente",
          variantName: it.variantName || it.variant || "Standard-Einheit",
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice || it.price) || 0,
        }))
      : [{
          productId: order.productId || order.product_id || "",
          productName: order.productName || order.product_name || "Präzisions-Lautsprecherbauteile",
          variantName: order.variantName || order.variant_name || "Standard",
          quantity: Number(order.quantity) || 1,
          unitPrice: Number(order.unitPrice || order.unit_price) || Number(order.total || 0),
        }];
    setItems(rawItems);

    setShippingFee(Number(order.shippingFee || order.shipping_fee) || 0);
    setDiscount(Number(order.discount) || 0);
    setPaymentStatus(
      (order.payment?.status?.toLowerCase() === "paid" || order.status === "Payment Confirmed" || order.status === "Paid")
        ? "Paid"
        : order.payment?.status?.toLowerCase() === "refunded"
        ? "Refunded"
        : order.payment?.status?.toLowerCase() === "complimentary"
        ? "Complimentary"
        : "Pending"
    );
    setPaymentGateway(order.payment?.gateway || "Direkte Banküberweisung (SEPA / Wire)");
    setTransactionId(order.payment?.transactionId || "");

    setCarrierName(order.carrierName || order.carrier || "DHL Paket");
    setTrackingAwb(order.trackingAwbNumber || order.tracking_number || "");
    setDispatchDate(order.dispatchDate || "");
    setIncoterms(order.incoterms || "CPT - Carriage Paid To");
    setHsCode(order.hsCode || "8518.90.00");
    setPortOfLoading(order.portOfLoading || "Saerbeck / Flughafen Frankfurt (FRA), Deutschland");
    setNotes(order.notes || "");
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  // Calculation helpers
  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0),
    0
  );
  const total = Math.max(0, subtotal + Number(shippingFee || 0) - Number(discount || 0));
  const currencySymbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "INR" ? "₹" : "$";

  const handleAddItem = () => {
    const defaultProd = products[0];
    setItems((prev) => [
      ...prev,
      {
        productId: defaultProd?.id || "custom",
        productName: defaultProd?.name || "Lautsprecherkomponente",
        variantName: defaultProd?.variants?.[0]?.name || "Standard-Einheit",
        quantity: 1,
        unitPrice: defaultProd?.price || 15,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProductSelect = (index: number, prodId: string) => {
    if (prodId === "custom") {
      setItems((prev) => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          productId: "custom",
          productName: "Individuelles Spezial-Audioteil",
          variantName: "Individuelle Spezifikation",
        };
        return copy;
      });
      return;
    }

    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        productId: prod.id,
        productName: prod.name,
        variantName: prod.variants?.[0]?.name || "Standard",
        quantity: copy[index]?.quantity || 1,
        unitPrice: prod.price || prod.variants?.[0]?.price || 15,
      };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Kundenname ist erforderlich.");
      return;
    }
    if (!customerEmail.trim()) {
      setErrorMsg("E-Mail-Adresse des Kunden ist erforderlich.");
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Bitte geben Sie mindestens einen Bestellartikel an.");
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedItems = items.map((it) => ({
        productId: it.productId || "",
        productName: it.productName.trim(),
        variantName: it.variantName.trim(),
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
      }));

      const primaryItem = normalizedItems[0];
      const itemsTitle =
        normalizedItems.length > 1
          ? primaryItem.productName + " + " + (normalizedItems.length - 1) + " weitere Artikel"
          : primaryItem.productName;

      const updatedPayload = {
        orderId: orderNumber,
        order_number: orderNumber,
        id: order.id || orderNumber,
        date: orderDate,
        productId: primaryItem.productId || order.productId || "part-spec",
        productName: itemsTitle,
        variantName:
          normalizedItems.length > 1
            ? "Sortiert (" + normalizedItems.length + " Artikel)"
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
        dispatchDate: dispatchDate || (orderStatus === "Shipped" || orderStatus === "Delivered" ? orderDate : ""),
        incoterms: incoterms,
        hsCode: hsCode.trim() || "8518.90.00",
        portOfLoading: portOfLoading.trim() || "Saerbeck / Flughafen Frankfurt (FRA), Deutschland",
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
          address: address.trim() || "Direktlieferung",
          city: city.trim(),
          state: stateName.trim(),
          zip: zip.trim(),
          country: country.trim(),
        },
        payment: {
          gateway: paymentGateway,
          status: paymentStatus === "Complimentary" ? "Paid" : paymentStatus,
          transactionId: transactionId.trim() || order.payment?.transactionId || ("TXN-" + orderNumber),
        },
      };

      // 1. Send update via PUT /api/orders
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Bestellung konnte nicht aktualisiert werden.");
      }

      // 2. Synchronize payment record if matched
      try {
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderNumber,
            order_number: orderNumber,
            customer_name: customerName.trim() + (companyName ? " (" + companyName + ")" : ""),
            customer_email: customerEmail.trim(),
            customer_phone: customerPhone.trim(),
            amount: total,
            currency: currency,
            gateway: paymentGateway,
            payment_gateway: paymentGateway,
            payment_status: paymentStatus === "Complimentary" ? "Paid" : paymentStatus,
            transaction_id: transactionId.trim() || ("TXN-" + orderNumber),
            created_at: new Date(orderDate).toISOString(),
          }),
        });
      } catch (e) {}

      // 3. Notify parent & close
      onOrderUpdated(updatedPayload);
      setSuccessMsg("Bestellung erfolgreich aktualisiert!");
      notifyAdmin("success", "Bestellung aktualisiert", `Bestellung #${orderNumber} wurde erfolgreich gespeichert.`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error("Error editing order:", err);
      const msg = err?.message || "Beim Speichern der Änderungen ist ein Fehler aufgetreten.";
      setErrorMsg(msg);
      notifyAdmin("error", "Fehler beim Aktualisieren der Bestellung", msg, err);
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
      title="Bestelldetails bearbeiten"
      subtitle="Positionen, Mengen, Preise, Kundeninformationen und Logistik anpassen."
      badge={
        <span className="text-[10px] font-mono normal-case bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-bold">
          {orderNumber}
        </span>
      }
      maxWidthClass="max-w-5xl"
      backLabel="Zurück zu den Bestellungen"
    >
      {/* Error / Success Feedback */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* ── Section 1: Order Metadata & Status ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-foreground" />
            Bestellstatus &amp; Währung
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Bestelldatum</label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className={inputClass + " font-mono"}
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
              <label className={labelClass}>Versand- &amp; Abwicklungsstatus</label>
              <AdminCustomSelect
                value={orderStatus}
                onChange={(val) => setOrderStatus(val)}
                options={[
                  { value: "New", label: "Neue Bestellung" },
                  { value: "Payment Confirmed", label: "Zahlung bestätigt" },
                  { value: "Courier Assigned", label: "Kurier zugewiesen" },
                  { value: "In Transit", label: "Auf dem Versandweg" },
                  { value: "Shipped", label: "Versendet" },
                  { value: "Delivered", label: "Zugestellt" },
                  { value: "Cancelled", label: "Storniert" }
                ]}
                variant="form"
              />
            </div>
          </div>
        </div>

        {/* ── Section 2: Customer & Company Details ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-foreground" />
            Kunden- &amp; Unternehmensdaten
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Vollständiger Kundenname *</label>
              <input
                type="text"
                placeholder="z. B. Marco Rossi"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Firma / Marke / Werkstatt</label>
              <input
                type="text"
                placeholder="z. B. Sonus Pro Audio S.r.l."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>E-Mail-Adresse *</label>
              <input
                type="email"
                placeholder="z. B. marco@sonusaudio.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Telefon / WhatsApp</label>
              <input
                type="tel"
                placeholder="z. B. +39 02 8492019"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>USt-IdNr. / Steuernummer (optional)</label>
              <input
                type="text"
                placeholder="z. B. DE123456789 / IT12345678901"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className={inputClass + " font-mono"}
              />
            </div>
          </div>
        </div>

        {/* ── Section 3: Shipping & Destination Address ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-foreground" />
            Liefer- &amp; Versandadresse
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className={labelClass}>Straße &amp; Hausnummer / Gebäude</label>
              <input
                type="text"
                placeholder="z. B. Industriestraße 42, Gebäude B"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Stadt / Ort</label>
              <input
                type="text"
                placeholder="z. B. Berlin / München / Madrid"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Bundesland / Region</label>
              <input
                type="text"
                placeholder="z. B. Nordrhein-Westfalen / Bayern"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Postleitzahl</label>
              <input
                type="text"
                placeholder="z. B. 48369 / 60311"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className={inputClass + " font-mono"}
              />
            </div>

            <div>
              <label className={labelClass}>Zielland</label>
              <AdminCustomSelect
                value={country}
                onChange={(val) => setCountry(val)}
                options={[
                  ...POPULAR_COUNTRIES.map((c) => ({
                    value: c.name,
                    label: c.flag + " " + c.name
                  })),
                  ...(POPULAR_COUNTRIES.some(c => c.name === country) ? [] : [{ value: country, label: `${country} (Benutzerdefiniert)` }])
                ]}
                variant="form"
                searchable
              />
            </div>
          </div>
        </div>

        {/* ── Section 4: Line Items & Pricing ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
              <Package className="w-3.5 h-3.5 text-foreground" />
              Positionen &amp; Preise
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="gap-1 text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3 h-3" /> + Artikel hinzufügen
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const selectedProd = products.find((p) => p.id === item.productId);
              return (
                <div
                  key={idx}
                  className="p-3 bg-card border border-border rounded-xl space-y-2 relative group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                      {"Artikel #" + (idx + 1)}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors cursor-pointer"
                        title="Artikel entfernen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    {/* Product Selector */}
                    <div className="sm:col-span-5">
                      <label className={labelClass}>Produkt / Lautsprecherteil auswählen</label>
                      <AdminCustomSelect
                        value={item.productId || "custom"}
                        onChange={(val) => handleProductSelect(idx, val)}
                        options={[
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

                    {/* Variant / Name */}
                    <div className="sm:col-span-3">
                      <label className={labelClass}>Variante / Spezifikation</label>
                      {item.productId === "custom" || !selectedProd?.variants?.length ? (
                        <input
                          type="text"
                          placeholder="z. B. 15-Zoll gerippte Membran"
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
                      ) : (
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
                      )}
                    </div>

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
                            copy[idx].quantity = val as any;
                            return copy;
                          });
                        }}
                        placeholder="1"
                        className={inputClass + " font-mono font-bold"}
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2">
                      <label className={labelClass}>{`Einzelpreis (${currencySymbol})`}</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={item.unitPrice !== undefined && item.unitPrice !== null ? item.unitPrice : ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                          setItems((prev) => {
                            const copy = [...prev];
                            copy[idx].unitPrice = val as any;
                            return copy;
                          });
                        }}
                        placeholder="0.00"
                        className={inputClass + " font-mono font-bold"}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section 5: Financials & Totals ── */}
        <div className="space-y-3">
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
                  setPaymentStatus(val as "Paid" | "Pending" | "Refunded" | "Complimentary")
                }
                options={[
                  { value: "Paid", label: "Vollständig bezahlt", badge: "Bezahlt", badgeColor: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" },
                  { value: "Pending", label: "Zahlung ausstehend", badge: "Ausstehend", badgeColor: "bg-amber-500/10 text-amber-600 border border-amber-500/20" },
                  { value: "Refunded", label: "Erstattet", badge: "Erstattet", badgeColor: "bg-muted text-muted-foreground border border-border" },
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
                  { value: "Manual Invoice", label: "Manuelle Rechnung" }
                ]}
                variant="form"
              />
            </div>

            <div>
              <label className={labelClass}>Transaktions- / Referenznummer</label>
              <input
                type="text"
                placeholder="z. B. TXN-948201 oder SEPA-REF"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{`Versandkosten (${currencySymbol})`}</label>
              <input
                type="text"
                inputMode="decimal"
                value={shippingFee !== undefined && shippingFee !== null ? shippingFee : ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                  setShippingFee(val as any);
                }}
                placeholder="0.00"
                className={inputClass + " font-mono"}
              />
            </div>

            <div>
              <label className={labelClass}>{`Rabatt (${currencySymbol})`}</label>
              <input
                type="text"
                inputMode="decimal"
                value={discount !== undefined && discount !== null ? discount : ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                  setDiscount(val as any);
                }}
                placeholder="0.00"
                className={inputClass + " font-mono"}
              />
            </div>

            {/* Total Summary Badge */}
            <div className="flex flex-col justify-end">
              <div className="p-2.5 bg-card border border-border rounded-xl flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Gesamtbetrag:</span>
                <span className="text-sm font-bold text-primary font-mono">
                  {currencySymbol + total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 6: Logistics & Dispatch ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-foreground text-xs uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-foreground" />
            Logistik, Kurier &amp; Sendungsverfolgung
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                placeholder="z. B. 7482910482"
                value={trackingAwb}
                onChange={(e) => setTrackingAwb(e.target.value)}
                className={inputClass + " font-mono"}
              />
            </div>

            <div>
              <label className={labelClass}>Versanddatum</label>
              <input
                type="date"
                value={dispatchDate}
                onChange={(e) => setDispatchDate(e.target.value)}
                className={inputClass + " font-mono"}
              />
            </div>
          </div>
        </div>

        {/* ── Section 7: Shipping & Dispatch Specifications ── */}
        <div className="space-y-3">
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
              <label className={labelClass}>Logistik-Notizen</label>
              <input
                type="text"
                placeholder="z. B. Versicherter Expressversand erforderlich"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Interne Notizen / Technische Spezifikationen</label>
              <textarea
                rows={2}
                placeholder="z. B. Besondere Schwingspulentoleranzen oder Kundenverpackungshinweise."
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
            <Save className="w-4 h-4" />
            {isSubmitting ? "Änderungen werden gespeichert..." : "Änderungen speichern"}
          </Button>
        </div>
      </form>
    </AdminDrawer>
  );
}
