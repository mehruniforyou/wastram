"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Percent,
  Plus,
  Trash2,
  Copy,
  Calendar,
  Truck,
  RefreshCw,
  Pencil,
  Tag,
  Search,
  Check,
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import AdminDrawer from "./AdminDrawer";
import { Button } from "@/components/ui/button";
import { notifyAdmin } from "./AdminToast";

interface DiscountItem {
  id: string;
  code: string;
  type: "percentage" | "fixed_amount" | "free_shipping";
  value: number;
  min_order_value: number;
  description: string;
  usage_count: number;
  usage_limit: number;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  applies_to?: "all" | "categories" | "products";
  applicable_category_ids?: string[];
  applicable_product_ids?: string[];
}

export default function DiscountsTab() {
  const { formatAmount } = useCurrency();
  const [discounts, setDiscounts] = useState<DiscountItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState<"percentage" | "fixed_amount" | "free_shipping">("percentage");
  const [formValue, setFormValue] = useState<number | string>(10);
  const [formMinOrder, setFormMinOrder] = useState<number | string>(0);
  const [formDesc, setFormDesc] = useState("");
  const [formUsageLimit, setFormUsageLimit] = useState<number | string>(250);
  const [formExpiresAt, setFormExpiresAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().split("T")[0];
  });
  const [formAppliesTo, setFormAppliesTo] = useState<"all" | "categories" | "products">("all");
  const [formSelectedCategories, setFormSelectedCategories] = useState<string[]>([]);
  const [formSelectedProducts, setFormSelectedProducts] = useState<string[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [availableProducts, setAvailableProducts] = useState<any[]>(PRODUCTS);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Toggle & Delete states
  const [discountToDelete, setDiscountToDelete] = useState<DiscountItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const availableCategories = useMemo(() => {
    return CATEGORIES.filter((c) => !c.isVirtual);
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/discounts?t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setDiscounts(data);
        }
      }
    } catch (err) {
      console.error("Error loading discounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAvailableProducts(data);
        }
      })
      .catch(() => {});
  }, []);

  const notifyDiscountsUpdated = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("ixos_discounts_updated"));
      try {
        localStorage.setItem("ixos_discounts_updated", Date.now().toString());
      } catch {}
    }
  };

  const handleToggleActive = async (item: DiscountItem) => {
    const nextState = !item.is_active;
    // Optimistic UI update for snappy feedback
    setDiscounts((prev) =>
      prev.map((d) => (d.id === item.id ? { ...d, is_active: nextState } : d))
    );
    setTogglingId(item.id);

    try {
      const res = await fetch("/api/discounts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          is_active: nextState,
        }),
      });

      if (res.ok) {
        notifyDiscountsUpdated();
        notifyAdmin("success", "Rabattstatus aktualisiert", `Gutschein "${item.code}" ist jetzt ${nextState ? "aktiv" : "inaktiv"}.`);
      } else {
        // Rollback on error
        setDiscounts((prev) =>
          prev.map((d) => (d.id === item.id ? { ...d, is_active: item.is_active } : d))
        );
        notifyAdmin("error", "Fehler beim Aktualisieren", "Der Status konnte nicht geändert werden.");
      }
    } catch (err: any) {
      console.error("Error toggling discount active status:", err);
      setDiscounts((prev) =>
        prev.map((d) => (d.id === item.id ? { ...d, is_active: item.is_active } : d))
      );
      notifyAdmin("error", "Fehler beim Aktualisieren", err.message || String(err), err);
    } finally {
      setTogglingId(null);
    }
  };

  const openCreateModal = () => {
    setEditingDiscount(null);
    setFormCode("");
    setFormType("percentage");
    setFormValue(10);
    setFormMinOrder(0);
    setFormDesc("");
    setFormUsageLimit(250);
    setFormAppliesTo("all");
    setFormSelectedCategories([]);
    setFormSelectedProducts([]);
    setProductSearchQuery("");
    const d = new Date();
    d.setDate(d.getDate() + 90);
    setFormExpiresAt(d.toISOString().split("T")[0]);
    setFormError(null);
    setShowAddModal(true);
  };

  const openEditModal = (item: DiscountItem) => {
    setEditingDiscount(item);
    setFormCode(item.code || "");
    setFormType(item.type || "percentage");
    setFormValue(item.value ?? 10);
    setFormMinOrder(item.min_order_value ?? 0);
    setFormDesc(item.description || "");
    setFormUsageLimit(item.usage_limit ?? 250);
    setFormAppliesTo(item.applies_to || "all");
    setFormSelectedCategories(item.applicable_category_ids || []);
    setFormSelectedProducts(item.applicable_product_ids || []);
    setProductSearchQuery("");
    if (item.expires_at) {
      try {
        setFormExpiresAt(new Date(item.expires_at).toISOString().split("T")[0]);
      } catch {
        setFormExpiresAt("");
      }
    } else {
      setFormExpiresAt("");
    }
    setFormError(null);
    setShowAddModal(true);
  };

  const handleSaveDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const code = formCode.toUpperCase().trim();
    if (!code) {
      setFormError("Bitte geben Sie einen gültigen Gutscheincode ein.");
      return;
    }

    if (formAppliesTo === "categories" && formSelectedCategories.length === 0) {
      setFormError("Bitte wählen Sie mindestens eine Kategorie für diesen Gutschein aus.");
      return;
    }

    if (formAppliesTo === "products" && formSelectedProducts.length === 0) {
      setFormError("Bitte wählen Sie mindestens ein Produkt für diesen Gutschein aus.");
      return;
    }

    setFormSubmitting(true);
    try {
      const payload: any = {
        code,
        type: formType,
        value: formType === "free_shipping" ? 0 : Number(formValue) || 0,
        min_order_value: Number(formMinOrder) || 0,
        description: formDesc.trim(),
        usage_limit: Number(formUsageLimit) || 100,
        expires_at: formExpiresAt
          ? new Date(formExpiresAt).toISOString()
          : new Date(Date.now() + 86400000 * 90).toISOString(),
        applies_to: formAppliesTo,
        applicable_category_ids: formAppliesTo === "categories" ? formSelectedCategories : [],
        applicable_product_ids: formAppliesTo === "products" ? formSelectedProducts : [],
      };

      let res: Response;
      if (editingDiscount) {
        payload.id = editingDiscount.id;
        res = await fetch("/api/discounts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        payload.is_active = true;
        res = await fetch("/api/discounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        await fetchDiscounts();
        notifyDiscountsUpdated();
        setShowAddModal(false);
        setEditingDiscount(null);
        setFormCode("");
        setFormDesc("");
        setFormValue(10);
        setFormMinOrder(0);
        setFormUsageLimit(250);
        setFormError(null);
        notifyAdmin(
          "success",
          editingDiscount ? "Rabattcode aktualisiert" : "Neuer Rabattcode angelegt",
          `Gutscheincode "${code}" wurde erfolgreich gespeichert.`
        );
      } else {
        const errorMsg = data.error || "Gutscheincode konnte nicht gespeichert werden. Bitte Eingaben überprüfen.";
        setFormError(errorMsg);
        notifyAdmin("error", "Fehler beim Speichern des Rabattcodes", errorMsg, data);
      }
    } catch (err: any) {
      console.error("Error saving discount:", err);
      const errorMsg = err.message || "Gutscheincode konnte nicht gespeichert werden. Bitte Verbindung prüfen.";
      setFormError(errorMsg);
      notifyAdmin("error", "Fehler beim Speichern des Rabattcodes", errorMsg, err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!discountToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/discounts?id=${discountToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setDiscounts((prev) => prev.filter((d) => d.id !== discountToDelete.id));
        notifyDiscountsUpdated();
        notifyAdmin("success", "Rabattcode gelöscht", `Gutscheincode "${discountToDelete.code}" wurde gelöscht.`);
        setDiscountToDelete(null);
      } else {
        const data = await res.json().catch(() => ({}));
        notifyAdmin("error", "Fehler beim Löschen des Rabattcodes", data.error || "Gutscheincode konnte nicht gelöscht werden", data);
      }
    } catch (err: any) {
      console.error("Error deleting discount:", err);
      notifyAdmin("error", "Fehler beim Löschen des Rabattcodes", err.message || "Verbindungsfehler beim Löschen", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredSearchProducts = useMemo(() => {
    if (!productSearchQuery.trim()) return availableProducts.slice(0, 50);
    const q = productSearchQuery.toLowerCase();
    return availableProducts.filter(
      (p) => {
        const catStr = (typeof p.category === "string" ? p.category : (p.category as any)?.name || (p as any)?.category_id || "").toLowerCase();
        return (
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.partNumber && p.partNumber.toLowerCase().includes(q)) ||
          catStr.includes(q)
        );
      }
    ).slice(0, 50);
  }, [availableProducts, productSearchQuery]);

  const activeCount = discounts.filter((d) => d.is_active).length;
  const totalRedemptions = discounts.reduce((acc, d) => acc + (d.usage_count || 0), 0);

  const cardClass = "bg-white border-2 border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs";
  const labelTextClass = "block text-xs font-heading font-black text-black uppercase tracking-wider mb-1.5";
  const textInputClass =
    "w-full bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-4 py-2.5 text-xs text-black placeholder:text-neutral-400 font-medium outline-none transition-colors";
  const selectInputClass =
    "w-full bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-4 py-2.5 text-xs text-black font-semibold outline-none transition-colors cursor-pointer";

  return (
    <div className="space-y-5 font-sans text-foreground animate-fade-in">
      {/* ── TOP SECTION: Minimal Header & Toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            Discounts &amp; Promo Codes
          </h1>
          <p className="text-xs font-light text-neutral-600 mt-1">
            Aktive Aktionen werden automatisch im Deals-Reiter auf Desktop- und Mobilgeräten angezeigt.
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl border-2 border-neutral-200 bg-white text-black">
              {activeCount} Aktiv
            </span>
            <span className="text-xs font-light px-3 py-1.5 rounded-xl border-2 border-neutral-200 bg-white text-neutral-600">
              {totalRedemptions} Eingelöst
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={fetchDiscounts}
            className="h-9 w-9 rounded-xl border-2 border-neutral-200 hover:border-black text-black cursor-pointer"
            title="Gutscheine aktualisieren"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 h-9 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Gutschein erstellen</span>
          </button>
        </div>
      </div>

      {/* ─── Discounts Table ──────────────────────────────────────────────── */}
      <div className="bg-white border-2 border-neutral-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b-2 border-neutral-200 text-black font-black uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Gutscheincode</th>
                <th className="py-3.5 px-4">Vorteil</th>
                <th className="py-3.5 px-4">Gültig für</th>
                <th className="py-3.5 px-4">Beschreibung</th>
                <th className="py-3.5 px-4 text-center">Mindestbestellwert</th>
                <th className="py-3.5 px-4 text-center">Nutzung</th>
                <th className="py-3.5 px-4">Gültig bis</th>
                <th className="py-3.5 px-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500 font-light">
                    Lade Gutscheincodes...
                  </td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500 font-light">
                    Noch keine Gutscheincodes erstellt. Klicken Sie auf „Gutschein erstellen“, um einen hinzuzufügen.
                  </td>
                </tr>
              ) : (
                discounts.map((d) => {
                  const isExpired = new Date(d.expires_at) < new Date();

                  return (
                    <tr key={d.id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* ── COL 1: Realistic Swipe Switch Button + Status Badge ── */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={d.is_active}
                            disabled={togglingId === d.id}
                            onClick={() => handleToggleActive(d)}
                            title={d.is_active ? "Ausschalten" : "Einschalten"}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 select-none ${
                              d.is_active
                                ? "bg-emerald-500 hover:bg-emerald-600 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)]"
                                : "bg-neutral-300 hover:bg-neutral-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]"
                            } ${togglingId === d.id ? "opacity-75 cursor-wait" : ""}`}
                          >
                            <span className="sr-only">Rabattstatus umschalten</span>
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.22)] ring-0 transform transition-transform duration-200 ease-in-out ${
                                d.is_active ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>

                          {isExpired ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-500 border border-neutral-200">
                              Abgelaufen
                            </span>
                          ) : d.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Aktiv
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-normal bg-neutral-100 text-neutral-500 border border-neutral-200">
                              Inaktiv
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ── COL 2: Coupon Code (Thicker, Bold Black Font) ── */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-neutral-100 text-black border border-neutral-200 tracking-tight">
                            {d.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(d.code)}
                            title="Code kopieren"
                            className="text-neutral-400 hover:text-black transition-colors cursor-pointer p-1 rounded hover:bg-neutral-100"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedCode === d.code && (
                            <span className="text-[10px] text-emerald-600 font-bold">Kopiert!</span>
                          )}
                        </div>
                      </td>

                      {/* ── COL 3: Benefit (Bold Text) ── */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs font-bold text-black">
                        {d.type === "percentage" ? (
                          <span>{d.value}% Rabatt</span>
                        ) : d.type === "fixed_amount" ? (
                          <span>₹{Number(d.value || 0).toFixed(2)} Rabatt</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-black" />
                            <span>KOSTENLOSER VERSAND</span>
                          </span>
                        )}
                      </td>

                      {/* ── COL 4: Applies To (Scope) ── */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                        {!d.applies_to || d.applies_to === "all" ? (
                          <span className="font-light text-neutral-500">Gesamter Shop (Alle)</span>
                        ) : d.applies_to === "categories" ? (
                          <span className="font-bold text-black bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                            {d.applicable_category_ids?.length || 0} Kategorien
                          </span>
                        ) : (
                          <span className="font-bold text-black bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                            {d.applicable_product_ids?.length || 0} Produkte
                          </span>
                        )}
                      </td>

                      {/* ── COL 5: Description (Thinner, Light Font) ── */}
                      <td className="py-3.5 px-4 max-w-xs text-xs font-light text-neutral-600 truncate">
                        {d.description || "—"}
                      </td>

                      {/* ── COL 6: Min. Order (Light/Medium contrast) ── */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap text-xs">
                        {d.min_order_value > 0 ? (
                          <span className="font-medium text-black">₹{Number(d.min_order_value).toFixed(2)}</span>
                        ) : (
                          <span className="font-light text-neutral-400">Keiner</span>
                        )}
                      </td>

                      {/* ── COL 7: Usage (Thick count with Thin limit) ── */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap text-xs">
                        <span className="font-bold text-black">{d.usage_count || 0}</span>
                        <span className="font-light text-neutral-400 text-[11px]"> / {d.usage_limit || "∞"}</span>
                      </td>

                      {/* ── COL 8: Expires (Thinner, Light Font) ── */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs font-light text-neutral-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          <span>
                            {new Date(d.expires_at).toLocaleDateString("de-DE", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* ── COL 9: Actions (Edit Button + Delete Button) ── */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Coupon Button */}
                          <button
                            type="button"
                            onClick={() => openEditModal(d)}
                            title="Gutschein bearbeiten"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors p-1 cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5 stroke-[2]" />
                          </button>

                          {/* Delete Coupon Button */}
                          <button
                            type="button"
                            onClick={() => setDiscountToDelete(d)}
                            title="Gutschein löschen"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Add / Edit Discount Drawer ────────────────────────────────────────────── */}
      <AdminDrawer
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingDiscount(null);
          setFormError(null);
        }}
        title={editingDiscount ? `Gutschein bearbeiten: ${editingDiscount.code}` : "Neuen Gutscheincode erstellen"}
        subtitle={
          editingDiscount
            ? "Gutschein-Parameter, berechtigte Kategorien/Produkte und Gültigkeit bearbeiten."
            : "Rabatthöhe, berechtigte Kategorien oder Produkte und Ablaufdatum festlegen."
        }
        maxWidthClass="max-w-3xl"
        backLabel="Zurück zu Rabatten"
      >
        <form onSubmit={handleSaveDiscount} className="space-y-5 text-xs font-sans">
          {/* Error Banner */}
          {formError && (
            <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
              <span>{formError}</span>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-red-500 hover:text-red-700 font-bold ml-2 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Card 1: Code & Basic Details */}
          <div className={cardClass}>
            <div>
              <label className={labelTextClass}>Gutscheincode *</label>
              <input
                type="text"
                required
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                placeholder="z. B. SOMMER20, IXOSAUDIO10, WILLKOMMEN"
                className={`${textInputClass} font-mono font-black uppercase text-sm`}
              />
            </div>

            <div>
              <label className={labelTextClass}>Interne Beschreibung / Aktionsnotiz</label>
              <input
                type="text"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="z. B. 10% Rabattaktion für Privatkunden"
                className={textInputClass}
              />
            </div>
          </div>

          {/* Card 2: Discount Value & Configuration */}
          <div className={cardClass}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelTextClass}>Rabattart</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className={selectInputClass}
                >
                  <option value="percentage">Prozentual (%)</option>
                  <option value="fixed_amount">Fester Betrag (₹)</option>
                  <option value="free_shipping">Kostenloser Versand</option>
                </select>
              </div>

              <div>
                <label className={labelTextClass}>
                  Wert {formType === "percentage" ? "(%)" : formType === "fixed_amount" ? "(₹)" : ""}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  disabled={formType === "free_shipping"}
                  value={formType === "free_shipping" ? "0" : formValue !== undefined && formValue !== null ? formValue : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                    setFormValue(val);
                  }}
                  placeholder="0.00"
                  className={`${textInputClass} disabled:bg-neutral-100 disabled:text-neutral-400 font-black`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelTextClass}>Minimum Order Value (₹)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formMinOrder !== undefined && formMinOrder !== null ? formMinOrder : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
                    setFormMinOrder(val);
                  }}
                  placeholder="0 für keinen"
                  className={textInputClass}
                />
              </div>

              <div>
                <label className={labelTextClass}>Nutzungslimit</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formUsageLimit !== undefined && formUsageLimit !== null ? formUsageLimit : ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setFormUsageLimit(val);
                  }}
                  placeholder="250"
                  className={textInputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelTextClass}>Ablaufdatum</label>
              <input
                type="date"
                value={formExpiresAt}
                onChange={(e) => setFormExpiresAt(e.target.value)}
                className={textInputClass}
              />
            </div>
          </div>

          {/* Card 3: Eligible Categories & Products Selection */}
          <div className={cardClass}>
            <div>
              <label className={labelTextClass}>Gültigkeitsbereich</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                {[
                  { id: "all", label: "Alle Produkte", desc: "Gilt shopweit für das gesamte Sortiment" },
                  { id: "categories", label: "Bestimmte Kategorien", desc: "Gilt für ausgewählte Kategorien" },
                  { id: "products", label: "Bestimmte Produkte", desc: "Gilt für ausgewählte Einzelprodukte" },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setFormAppliesTo(opt.id as any)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      formAppliesTo === opt.id
                        ? "border-black bg-neutral-50 shadow-2xs"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <div className="font-heading font-black text-xs text-black">{opt.label}</div>
                    <div className="text-[11px] font-light text-neutral-500 mt-0.5 leading-tight">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            {formAppliesTo === "categories" && (
              <div className="pt-3 border-t border-neutral-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black uppercase tracking-wider">
                    Kategorien auswählen ({formSelectedCategories.length} ausgewählt)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormSelectedCategories(availableCategories.map((c) => c.id))}
                      className="text-[11px] font-bold text-black hover:underline cursor-pointer"
                    >
                      Alle auswählen
                    </button>
                    <span className="text-neutral-300">|</span>
                    <button
                      type="button"
                      onClick={() => setFormSelectedCategories([])}
                      className="text-[11px] font-medium text-neutral-500 hover:text-black cursor-pointer"
                    >
                      Auswahl aufheben
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
                  {availableCategories.map((cat) => {
                    const isChecked = formSelectedCategories.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition-all cursor-pointer select-none ${
                          isChecked
                            ? "border-black bg-neutral-50 font-bold text-black"
                            : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormSelectedCategories([...formSelectedCategories, cat.id]);
                            } else {
                              setFormSelectedCategories(formSelectedCategories.filter((id) => id !== cat.id));
                            }
                          }}
                          className="rounded border-neutral-300 text-black focus:ring-black h-4 w-4"
                        />
                        <span className="text-xs truncate">{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product selection */}
            {formAppliesTo === "products" && (
              <div className="pt-3 border-t border-neutral-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black uppercase tracking-wider">
                    Produkte auswählen ({formSelectedProducts.length} ausgewählt)
                  </span>
                  {formSelectedProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormSelectedProducts([])}
                      className="text-[11px] font-medium text-neutral-500 hover:text-black cursor-pointer"
                    >
                      Auswahl aufheben ({formSelectedProducts.length})
                    </button>
                  )}
                </div>

                {/* Product search box */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="Katalog nach Name oder Artikelnummer durchsuchen..."
                    className={`${textInputClass} pl-9`}
                  />
                </div>

                {/* Product list */}
                <div className="max-h-60 overflow-y-auto space-y-1 border border-neutral-200 rounded-xl p-2 bg-neutral-50/50">
                  {filteredSearchProducts.map((p) => {
                    const isChecked = formSelectedProducts.includes(p.id) || formSelectedProducts.includes(p.slug);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? "border-black bg-white shadow-2xs font-bold"
                            : "border-transparent hover:bg-white text-neutral-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormSelectedProducts([...formSelectedProducts, p.id]);
                            } else {
                              setFormSelectedProducts(
                                formSelectedProducts.filter((id) => id !== p.id && id !== p.slug)
                              );
                            }
                          }}
                          className="rounded border-neutral-300 text-black focus:ring-black h-4 w-4"
                        />
                        {(p.featured_image || p.mainImage) && (
                          <img
                            src={p.featured_image || p.mainImage}
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-contain bg-neutral-100 p-0.5 border border-neutral-200 shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-black truncate">{p.name}</div>
                          <div className="text-[10px] font-light text-neutral-500">
                            {p.partNumber ? `#${p.partNumber} · ` : ""}₹{Number(p.price || 0).toFixed(2)}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setEditingDiscount(null);
                setFormError(null);
              }}
              className="px-5 py-2.5 rounded-xl border-2 border-neutral-300 hover:border-black text-black text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={formSubmitting || !formCode.trim()}
              className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              {formSubmitting
                ? editingDiscount
                  ? "Wird aktualisiert..."
                  : "Wird erstellt..."
                : editingDiscount
                ? "Gutschein aktualisieren"
                : "Gutschein speichern"}
            </button>
          </div>
        </form>
      </AdminDrawer>

      {/* ─── Delete Confirmation Popup Modal ─────────────────────────────────── */}
      {discountToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-2 border-neutral-200 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-1.5 min-w-0 flex-1">
                <h3 className="font-heading font-black text-lg text-black">Gutschein löschen</h3>
                <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                  Sind Sie sicher, dass Sie den Gutschein{" "}
                  <strong className="text-black font-black">&quot;{discountToDelete.code}&quot;</strong> löschen möchten?
                </p>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  Dadurch wird dieser Rabattcode dauerhaft entfernt. Kunden können ihn an der Kasse nicht mehr einlösen.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDiscountToDelete(null)}
                className="px-5 py-2.5 rounded-xl border-2 border-neutral-300 hover:border-black text-black text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                Abbrechen
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? "Wird gelöscht..." : "Dauerhaft löschen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
