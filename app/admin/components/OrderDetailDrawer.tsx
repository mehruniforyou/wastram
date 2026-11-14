"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Trash2,
  Package,
  Truck,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatOrderSerialNumber } from "@/utils/orderNumber";
import { getAdminTimeZone, formatAdminOrderDateTime } from "@/utils/adminTimezone";

interface OrderDetailDrawerProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (order: any) => void;
  onPrintInvoice?: (order: any) => void;
  onDelete: (orderId: string) => void;
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>;
  onSaveOrder: (order: any) => void;
}

export function OrderDetailDrawer({
  order,
  isOpen,
  onClose,
  onEdit,
  onPrintInvoice,
  onDelete,
  onStatusChange,
  onSaveOrder,
}: OrderDetailDrawerProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [carrierInput, setCarrierInput] = useState("");
  const [trackingInput, setTrackingInput] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Sync inputs when order changes
  useEffect(() => {
    if (order) {
      setCarrierInput(order.shipping?.courier || order.carrierName || order.courier || "");
      setTrackingInput(order.shipping?.trackingNumber || order.trackingAwbNumber || order.tracking_number || order.trackingNumber || "");
      setIsConfirmingDelete(false);
    }
  }, [order]);

  // Handle ESC key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const orderId = formatOrderSerialNumber(order);
  const customerName = order.customer?.name || order.customer_name || (order.customer?.company || "Boutique Customer");
  const customerEmail = order.customer?.email || order.customer_email || "";
  const customerPhone = order.customer?.phone || order.customer_phone || "";
  const customerCompany = order.customer?.company || order.company || "";
  const taxId = order.customer?.taxId || order.tax_id || "";

  const shippingAddress = order.shipping?.address || order.shipping_street || "";
  const shippingCity = order.shipping?.city || order.shipping_city || "";
  const shippingState = order.shipping?.state || order.shipping_state || "";
  const shippingZip = order.shipping?.zip || order.shipping_zip || "";
  const shippingCountry = order.shipping?.country || order.shipping_country || "Deutschland";

  const fullShippingAddress = [
    shippingAddress,
    [shippingZip, shippingCity].filter(Boolean).join(" "),
    shippingState,
    shippingCountry,
  ]
    .filter(Boolean)
    .join("\n");

  const dateVal = order.createdAt || order.created_at || order.date;
  const adminTz = getAdminTimeZone();
  const orderDateTime = formatAdminOrderDateTime(dateVal, adminTz);
  const formattedDate = orderDateTime.full || "Kürzlich aufgegeben";

  const itemsList = Array.isArray(order.items) && order.items.length > 0
    ? order.items
    : [
        {
          productName: order.productName || order.product_name || "IXOS Audio Lautsprecherteil",
          variantName: order.variantName || "Standard-Spezifikation",
          quantity: order.quantity || 1,
          unitPrice: order.unitPrice || (order.total ? order.total / (order.quantity || 1) : 0),
          image: order.productImage || order.image || order.featured_image || null,
        },
      ];

  const totalAmount = Number(order.total || 0);
  const currencySymbol = order.currency === "USD" ? "$" : order.currency === "GBP" ? "£" : "₹";

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const currentStatus = (() => {
    const s = (order.status || "").toLowerCase().trim();
    if (s.includes("courier")) return "Courier Assigned";
    if (s.includes("transit")) return "In Transit";
    if (s.includes("delivered") || s.includes("completed")) return "Delivered";
    if (s.includes("shipped") || s.includes("dispatched")) return "Shipped";
    if (s.includes("cancel") || s.includes("refund")) return "Cancelled";
    return "New Orders";
  })();

  const statusDisplayMap: Record<string, string> = {
    "New Orders": "New Order",
    "Courier Assigned": "Kurier zugewiesen",
    "In Transit": "In Transit",
    "Shipped": "Versendet",
    "Delivered": "Delivered",
    "Cancelled": "Cancelled",
  };

  const getNextStage = (status: string) => {
    switch (status) {
      case "New Orders":
      case "Payment Confirmed":
        return { label: "Zu 'Kurier zugewiesen' wechseln", next: "Courier Assigned" };
      case "Courier Assigned":
        return { label: "Mark as 'In Transit'", next: "In Transit" };
      case "In Transit":
      case "Shipped":
        return { label: "Als 'Zugestellt' markieren", next: "Delivered" };
      default:
        return null;
    }
  };

  const nextStage = getNextStage(currentStatus);

  const handleStatusChangeInternal = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      await onStatusChange(order.orderId || order.id, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveLogistics = () => {
    const updated = {
      ...order,
      carrierName: carrierInput,
      courier: carrierInput,
      shipping: {
        ...(order.shipping || {}),
        courier: carrierInput,
        trackingNumber: trackingInput,
      },
      trackingAwbNumber: trackingInput,
      tracking_number: trackingInput,
    };
    onSaveOrder(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* ── 40% Opacity Backdrop Overlay (No Blur, 40% Downed Brightness, Smooth Fade) ── */}
      <div
        className="fixed inset-0 bg-black/40 animate-order-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Slide-Over Modal from Right Edge (40% Screen Width, Rounded Left Corners, Hardware-Accelerated Smooth Slide) ── */}
      <div
        className="fixed inset-y-0 right-0 z-50 flex flex-col w-full sm:w-[480px] md:w-[45vw] lg:w-[40vw] max-w-full bg-card text-card-foreground border-l border-border rounded-l-2xl sm:rounded-l-3xl shadow-2xl overflow-hidden animate-order-modal-slide"
        role="dialog"
        aria-modal="true"
        aria-label={`Bestelldetails für ${orderId}`}
      >
        {/* ── Top Header with Rounded Top-Left Corner & Visible Close Button ── */}
        <header className="px-5 py-4 bg-card/95 backdrop-blur-md border-b border-border flex items-center justify-between gap-3 shrink-0 rounded-tl-2xl sm:rounded-tl-3xl">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-base text-foreground tracking-tight">
                {orderId}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(orderId, "orderId")}
                className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors cursor-pointer"
                title="Copy Order ID"
              >
                {copiedField === "orderId" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <Badge
                variant={
                  currentStatus === "Delivered"
                    ? "default"
                    : currentStatus === "Cancelled"
                    ? "destructive"
                    : "secondary"
                }
                className="text-[11px] font-semibold tracking-wide"
              >
                {statusDisplayMap[currentStatus] || currentStatus}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{formattedDate}</span>
              {orderDateTime.tzAbbr && (
                <span className="text-[10px] font-mono bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground font-semibold">
                  {orderDateTime.tzAbbr}
                </span>
              )}
            </p>
          </div>

          {/* Prominent High-Contrast Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 px-2.5 sm:px-3 rounded-full border border-border bg-background hover:bg-muted text-foreground flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              aria-label="Modal schließen"
              title="Schließen (Esc)"
            >
              <X className="w-4 h-4" />
              <span>Schließen</span>
            </Button>
          </div>
        </header>

        {/* ── Quick Pipeline Advance Bar ── */}
        {nextStage && (
          <div className="px-5 py-2.5 bg-primary/10 border-b border-primary/20 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-xs font-medium text-foreground truncate">
                Bereit für den nächsten Schritt?
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => handleStatusChangeInternal(nextStage.next)}
              disabled={isUpdatingStatus}
              className="h-7 text-xs font-semibold cursor-pointer shrink-0 gap-1.5"
            >
              <span>{nextStage.label}</span>
            </Button>
          </div>
        )}

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {/* Status Selector Card */}
          <div className="rounded-xl border border-border p-4 bg-muted/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                Fulfillment &amp; Shipping Status
              </span>
              <span className="text-[10px] text-muted-foreground">Klicken zum Ändern</span>
            </div>
            <div className="relative">
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChangeInternal(e.target.value)}
                disabled={isUpdatingStatus}
                className="w-full appearance-none bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs font-semibold text-foreground cursor-pointer outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-all pr-8"
              >
                <option value="New Orders">New Order</option>
                <option value="Courier Assigned">Kurier zugewiesen</option>
                <option value="In Transit">In Transit</option>
                <option value="Shipped">Versendet</option>
                <option value="Delivered">Zugestellt</option>
                <option value="Cancelled">Storniert</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Ordered Items Card */}
          <div className="rounded-xl border border-border p-4 bg-card space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Ordered Products ({itemsList.length})
              </span>
              <span className="text-muted-foreground text-[11px] font-medium">
                {itemsList.reduce((acc: number, it: any) => acc + (Number(it.quantity) || 1), 0)} Stk. gesamt
              </span>
            </div>

            <div className="divide-y divide-border">
              {itemsList.map((item: any, idx: number) => {
                const pName = item.productName || item.name || item.title || "Produkt";
                const vName = item.variantName || item.variant || "Standard-Spezifikation";
                const qty = Number(item.quantity) || 1;
                const unitPrice = Number(item.unitPrice || item.price || 0);
                const lineTotal = unitPrice * qty;
                const itemImg = item.image || item.imageUrl || item.featured_image || item.thumbnail || order.productImage || order.image || order.featured_image || null;

                return (
                  <div key={idx} className="py-3.5 first:pt-1 last:pb-1 flex items-start gap-3.5">
                    {/* Large Crisp Product Image Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-muted/40 border border-border overflow-hidden shrink-0 flex items-center justify-center p-1.5 shadow-2xs group">
                      {itemImg ? (
                        <img
                          src={itemImg}
                          alt={pName}
                          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <Package className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-xs sm:text-sm leading-snug line-clamp-2">
                        {pName}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                        {vName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="bg-muted px-2 py-0.5 rounded text-[10px] sm:text-xs font-mono font-bold text-foreground">
                          Menge: {qty}
                        </span>
                        <span className="text-[11px] sm:text-xs text-muted-foreground">
                          je {currencySymbol}{unitPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-foreground text-xs sm:text-sm block">
                        {currencySymbol}{lineTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="rounded-xl border border-border p-4 bg-card space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground block pb-1 border-b border-border">
              Rechnungsübersicht
            </span>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Zwischensumme (netto):</span>
                <span className="font-mono text-foreground">
                  {currencySymbol}{(totalAmount * 0.81).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>MwSt. (19 % DE):</span>
                <span className="font-mono text-foreground">
                  {currencySymbol}{(totalAmount * 0.19).toFixed(2)}
                </span>
              </div>
              {Number(order.shippingFee || 0) > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping:</span>
                  <span className="font-mono text-foreground">
                    {currencySymbol}{Number(order.shippingFee).toFixed(2)}
                  </span>
                </div>
              )}
              {Number(order.discount || 0) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span className="font-mono">
                    -{currencySymbol}{Number(order.discount).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-foreground font-bold text-sm pt-2 border-t border-border">
                <span>Gesamtbetrag:</span>
                <span className="font-mono text-base text-primary">
                  {currencySymbol}{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Details Card */}
          <div className="rounded-xl border border-border p-4 bg-card space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground block pb-1 border-b border-border">
              Customer Information
            </span>

            <div className="space-y-2 pt-1">
              <div>
                <div className="font-bold text-foreground text-sm">{customerName}</div>
                {customerCompany && (
                  <div className="text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3 h-3 text-muted-foreground shrink-0" />
                    <span>{customerCompany}</span>
                  </div>
                )}
                {taxId && (
                  <div className="text-muted-foreground text-[11px] mt-0.5">
                    USt-IdNr.: <span className="font-mono text-foreground">{taxId}</span>
                  </div>
                )}
              </div>

              {customerEmail && (
                <div className="flex items-center justify-between gap-2 pt-1">
                  <a
                    href={`mailto:${customerEmail}`}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 truncate hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{customerEmail}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(customerEmail, "email")}
                    className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted shrink-0 cursor-pointer"
                    title="E-Mail kopieren"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              )}

              {customerPhone && (
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={`tel:${customerPhone}`}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{customerPhone}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(customerPhone, "phone")}
                    className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted shrink-0 cursor-pointer"
                    title="Telefonnummer kopieren"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="rounded-xl border border-border p-4 bg-card space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Lieferadresse
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(fullShippingAddress, "shipping")}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                title="Lieferadresse kopieren"
              >
                {copiedField === "shipping" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 font-semibold text-[11px]">Kopiert</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Kopieren</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="font-mono text-muted-foreground leading-relaxed text-xs flex-1">
                <p>{shippingAddress || "Direct Atelier Dispatch (Jaipur)"}</p>
                <p>
                  {shippingZip} {shippingCity}
                </p>
                {shippingState && <p>{shippingState}</p>}
                <p className="font-bold text-foreground mt-0.5">{shippingCountry}</p>
              </div>
            </div>
          </div>

          {/* Logistics & Tracking Card */}
          <div className="rounded-xl border border-border p-4 bg-card space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Logistik &amp; Sendungsverfolgung
              </span>
              <Truck className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-foreground uppercase tracking-wider block mb-1">
                  Shipping Carrier &amp; Logistics
                </label>
                <input
                  type="text"
                  value={carrierInput}
                  onChange={(e) => setCarrierInput(e.target.value)}
                  onBlur={handleSaveLogistics}
                  placeholder="z. B. DHL Paket, UPS, Deutsche Post"
                  className="w-full bg-background border border-input focus:ring-1 focus:ring-ring focus:border-ring rounded-xl px-3 py-2 text-xs font-medium text-foreground outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-foreground uppercase tracking-wider block mb-1">
                  Sendungsnummer / Tracking-ID
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    onBlur={handleSaveLogistics}
                    placeholder="Sendungsnummer eingeben..."
                    className="flex-1 bg-background border border-input focus:ring-1 focus:ring-ring focus:border-ring rounded-xl px-3 py-2 text-xs font-mono font-medium text-foreground outline-none transition-colors"
                  />
                  {trackingInput && (
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        (carrierInput || "DHL") + " tracking " + trackingInput
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
                      title="Sendung extern verfolgen"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Settlement Card */}
          <div className="rounded-xl border border-border p-4 bg-card space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-border">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                Payment &amp; Billing
              </span>
              <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-bold text-foreground">
                  {order.payment?.gateway || order.payment_gateway || "PayPal"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Status:</span>
                <Badge
                  variant={
                    order.payment_status === "paid" || order.payment?.status === "Paid"
                      ? "default"
                      : "secondary"
                  }
                  className="text-[10px] font-semibold"
                >
                  {order.payment_status === "paid" || order.payment?.status === "Paid"
                    ? "Bezahlt"
                    : "Ausstehend"}
                </Badge>
              </div>
              {(order.payment?.transactionId ||
                order.payment_id ||
                order.paypal_order_id) && (
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider mb-0.5">
                    Transaktionsnummer:
                  </span>
                  <div className="flex items-center justify-between bg-muted/50 p-2 rounded-lg border border-border">
                    <span className="font-mono text-[11px] text-foreground truncate select-all">
                      {order.payment?.transactionId ||
                        order.payment_id ||
                        order.paypal_order_id}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          order.payment?.transactionId ||
                            order.payment_id ||
                            order.paypal_order_id,
                          "txn"
                        )
                      }
                      className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted shrink-0 cursor-pointer"
                      title="Transaktions-ID kopieren"
                    >
                      {copiedField === "txn" ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Sticky Bottom Proper CTAs with Rounded Bottom-Left Corner ── */}
        <footer className="p-4 sm:p-5 bg-card/95 backdrop-blur-md border-t border-border flex flex-col gap-2.5 shrink-0 rounded-bl-2xl sm:rounded-bl-3xl">
          <Button
            type="button"
            onClick={() => onEdit(order)}
            className="w-full gap-2 text-xs sm:text-sm font-semibold cursor-pointer h-10 rounded-xl shadow-2xs"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Order</span>
          </Button>

          {isConfirmingDelete ? (
            <div className="flex items-center gap-2 pt-0.5">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onDelete(order.orderId || order.id)}
                className="flex-1 text-xs font-semibold h-8.5 rounded-lg cursor-pointer"
              >
                Permanently Delete Order
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmingDelete(false)}
                className="flex-1 text-xs font-semibold h-8.5 rounded-lg cursor-pointer"
              >
                Abbrechen
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-start pt-0.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-destructive hover:bg-destructive/10 text-xs gap-1.5 h-8 px-2.5 rounded-lg cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Order</span>
              </Button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
