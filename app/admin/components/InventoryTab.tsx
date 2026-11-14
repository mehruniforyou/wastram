"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Boxes,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  Check,
  AlertTriangle,
  XCircle,
  Plus,
  Minus,
  Edit2,
  Box,
  Layers,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { notifyAdmin } from "./AdminToast";
import AdminDrawer from "./AdminDrawer";
import { CATEGORIES } from "@/data/categories";

export interface InventoryVariant {
  id: string;
  name: string;
  specs: Record<string, string>;
  stock: number | null;
  price: number | null;
  is_active: boolean;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

export interface InventoryItem {
  id: string;
  partNumber: string;
  name: string;
  slug: string;
  category: string;
  category_id: string;
  featured_image: string;
  stock: number;
  low_stock_threshold: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  inStock: boolean;
  price: number;
  updated_at?: string;
  variants: InventoryVariant[];
}

type SortField = "name" | "stock" | "category" | "status" | "none";
type SortDirection = "asc" | "desc";

function computeStockStatus(stock: number, threshold: number): "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" {
  if (stock <= 0) return "OUT_OF_STOCK";
  if (stock <= threshold) return "LOW_STOCK";
  return "IN_STOCK";
}

interface InventoryTabProps {
  onSelectTab?: (tabId: string) => void;
}

export default function InventoryTab({ onSelectTab }: InventoryTabProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK">("ALL");
  const [sortField, setSortField] = useState<SortField>("none");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedProductIds, setExpandedProductIds] = useState<Set<string>>(new Set());

  // Editing Modal / Drawer State
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);
  const [editThresholdValue, setEditThresholdValue] = useState<number>(5);
  const [isSaving, setIsSaving] = useState(false);

  // Quick Inline Editing
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineStockValue, setInlineStockValue] = useState<string>("");

  // Staged / Pending Unsaved Stock Changes (Zero-latency offline editing before batch save)
  const [pendingChanges, setPendingChanges] = useState<
    Record<
      string,
      {
        productId: string;
        variantId?: string;
        originalStock: number;
        newStock: number;
        low_stock_threshold: number;
        name: string;
      }
    >
  >({});
  const [isSavingPending, setIsSavingPending] = useState(false);

  const pendingCount = Object.keys(pendingChanges).length;

  // Protect against accidental loss of unsaved changes
  useEffect(() => {
    if (pendingCount === 0) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pendingCount]);

  const getStockKey = useCallback((productId: string, variantId?: string) => {
    return variantId ? `${productId}::${variantId}` : productId;
  }, []);

  const getEffectiveStock = useCallback(
    (item: InventoryItem, variantId?: string): number => {
      const key = getStockKey(item.id, variantId);
      if (pendingChanges[key] !== undefined) {
        return pendingChanges[key].newStock;
      }
      if (variantId) {
        const v = item.variants?.find((v) => v.id === variantId);
        return v?.stock !== null && v?.stock !== undefined ? v.stock : item.stock;
      }
      return item.stock;
    },
    [pendingChanges, getStockKey]
  );

  const getEffectiveStatus = useCallback(
    (item: InventoryItem, variantId?: string): "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" => {
      const stock = getEffectiveStock(item, variantId);
      return computeStockStatus(stock, item.low_stock_threshold);
    },
    [getEffectiveStock]
  );

  const fetchInventory = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await fetch("/api/inventory?t=" + Date.now() + "&admin=1");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
          // Only clear pending if manual refresh was explicitly requested
          if (isManualRefresh) {
            setPendingChanges({});
          }
        }
      } else {
        notifyAdmin("error", "Ladefehler", "Inventardaten konnten nicht geladen werden.");
      }
    } catch (err: any) {
      console.error("[InventoryTab] Fetch error:", err);
      notifyAdmin("error", "Verbindungsfehler", err.message || "Netzwerkfehler beim Laden.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Summary Metrics (optimistically reflects pending changes)
  const metrics = useMemo(() => {
    const totalCount = items.length;
    let inStockCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalUnits = 0;

    for (const it of items) {
      const effStock = getEffectiveStock(it);
      const effStatus = computeStockStatus(effStock, it.low_stock_threshold);
      totalUnits += effStock;
      if (effStatus === "IN_STOCK") inStockCount++;
      else if (effStatus === "LOW_STOCK") lowStockCount++;
      else if (effStatus === "OUT_OF_STOCK") outOfStockCount++;
    }

    return {
      totalCount,
      inStockCount,
      lowStockCount,
      outOfStockCount,
      totalUnits,
    };
  }, [items, getEffectiveStock]);

  // Categories list for filter dropdown
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (it.category && it.category.trim()) set.add(it.category.trim());
    });
    return Array.from(set).sort();
  }, [items]);

  // Filtered and Sorted Items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (it) =>
          (it.name || "").toLowerCase().includes(q) ||
          (it.partNumber || "").toLowerCase().includes(q) ||
          (it.id || "").toLowerCase().includes(q) ||
          (it.category || "").toLowerCase().includes(q) ||
          (it.variants || []).some((v) => (v.name || "").toLowerCase().includes(q))
      );
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      result = result.filter((it) => it.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((it) => getEffectiveStatus(it) === statusFilter);
    }

    // Sorting
    if (sortField !== "none") {
      result.sort((a, b) => {
        let comparison = 0;
        if (sortField === "stock") {
          comparison = getEffectiveStock(a) - getEffectiveStock(b);
        } else if (sortField === "name") {
          comparison = a.name.localeCompare(b.name, "de");
        } else if (sortField === "category") {
          comparison = a.category.localeCompare(b.category, "de");
        } else if (sortField === "status") {
          const order = { OUT_OF_STOCK: 0, LOW_STOCK: 1, IN_STOCK: 2 };
          comparison = order[getEffectiveStatus(a)] - order[getEffectiveStatus(b)];
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [items, searchQuery, categoryFilter, statusFilter, sortField, sortDirection, getEffectiveStock, getEffectiveStatus]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "desc") {
        setSortDirection("asc");
      } else {
        setSortField("none");
      }
    } else {
      setSortField(field);
      setSortDirection(field === "stock" ? "desc" : "asc");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Instant Quick +/- Stock adjustment (No blocking network request! Stages change locally)
  const handleQuickAdjust = (item: InventoryItem, delta: number, variantId?: string) => {
    const key = getStockKey(item.id, variantId);
    const baseStock = variantId
      ? item.variants?.find((v) => v.id === variantId)?.stock ?? item.stock
      : item.stock;

    const currentStock = pendingChanges[key] !== undefined ? pendingChanges[key].newStock : baseStock;
    const newStock = Math.max(0, currentStock + delta);

    setPendingChanges((prev) => {
      const next = { ...prev };
      if (newStock === baseStock) {
        delete next[key];
      } else {
        next[key] = {
          productId: item.id,
          variantId,
          originalStock: baseStock,
          newStock,
          low_stock_threshold: item.low_stock_threshold,
          name: item.name,
        };
      }
      return next;
    });
  };

  // Inline Stock manual entry submission
  const handleInlineStockSubmit = (item: InventoryItem, variantId?: string) => {
    const num = parseInt(inlineStockValue, 10);
    if (!isNaN(num) && num >= 0) {
      const key = getStockKey(item.id, variantId);
      const baseStock = variantId
        ? item.variants?.find((v) => v.id === variantId)?.stock ?? item.stock
        : item.stock;

      setPendingChanges((prev) => {
        const next = { ...prev };
        if (num === baseStock) {
          delete next[key];
        } else {
          next[key] = {
            productId: item.id,
            variantId,
            originalStock: baseStock,
            newStock: num,
            low_stock_threshold: item.low_stock_threshold,
            name: item.name,
          };
        }
        return next;
      });
    }
    setInlineEditingId(null);
  };

  // Discard all pending unsaved adjustments
  const handleDiscardAllPending = () => {
    setPendingChanges({});
    notifyAdmin("info", "Änderungen verworfen", "Alle ungespeicherten Bestandsänderungen wurden zurückgesetzt.");
  };

  // Batch Save all pending changes to the server in a single request
  const handleSaveAllPending = async () => {
    const pendingList = Object.values(pendingChanges);
    if (pendingList.length === 0) return;

    setIsSavingPending(true);
    try {
      const payload = pendingList.map((p) => ({
        productId: p.productId,
        variantId: p.variantId,
        stock: p.newStock,
        low_stock_threshold: p.low_stock_threshold,
      }));

      const res = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          // Optimistic local update fallback
          setItems((prev) =>
            prev.map((it) => {
              let updatedItem = { ...it };
              const prodKey = getStockKey(it.id);
              if (pendingChanges[prodKey]) {
                const newS = pendingChanges[prodKey].newStock;
                updatedItem.stock = newS;
                updatedItem.inStock = newS > 0;
                updatedItem.status = computeStockStatus(newS, updatedItem.low_stock_threshold);
              }
              if (updatedItem.variants && updatedItem.variants.length > 0) {
                updatedItem.variants = updatedItem.variants.map((v) => {
                  const varKey = getStockKey(it.id, v.id);
                  if (pendingChanges[varKey]) {
                    const newVS = pendingChanges[varKey].newStock;
                    return {
                      ...v,
                      stock: newVS,
                      status: computeStockStatus(newVS, updatedItem.low_stock_threshold),
                    };
                  }
                  return v;
                });
              }
              return updatedItem;
            })
          );
        }

        const count = pendingList.length;
        setPendingChanges({});
        notifyAdmin(
          "success",
          "Bestand erfolgreich gespeichert",
          `${count} ${count === 1 ? "Bestandsänderung wurde" : "Bestandsänderungen wurden"} erfolgreich im System aktualisiert.`
        );
      } else {
        let errorMsg = "Bestand konnte nicht gespeichert werden.";
        try {
          const errData = await res.json();
          if (errData?.error) errorMsg = errData.error;
        } catch {}
        notifyAdmin("error", "Speicherfehler", errorMsg);
      }
    } catch (err: any) {
      notifyAdmin("error", "Verbindungsfehler", err?.message || "Netzwerkfehler beim Speichern.");
    } finally {
      setIsSavingPending(false);
    }
  };

  // Save Modal Edit
  const handleSaveModal = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: editingItem.id,
          stock: editStockValue,
          low_stock_threshold: editThresholdValue,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.item) {
          setItems((prev) => prev.map((it) => (it.id === editingItem.id ? data.item : it)));
          setPendingChanges((prev) => {
            const next = { ...prev };
            delete next[editingItem.id];
            Object.keys(next).forEach((k) => {
              if (k.startsWith(`${editingItem.id}::`)) delete next[k];
            });
            return next;
          });
          notifyAdmin(
            "success",
            "Lagerbestand gespeichert",
            `Artikel "${editingItem.name}" erfolgreich auf ${editStockValue} units updated.`
          );
          setEditingItem(null);
        }
      } else {
        notifyAdmin("error", "Fehler beim Speichern", "Lagerbestand konnte nicht gespeichert werden.");
      }
    } catch (err: any) {
      notifyAdmin("error", "Verbindungsfehler", err.message || "Netzwerkfehler.");
    } finally {
      setIsSaving(false);
    }
  };

  // Format Status Badge
  const renderStatusBadge = (status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK") => {
    switch (status) {
      case "IN_STOCK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Auf Lager
          </span>
        );
      case "LOW_STOCK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            Geringer Bestand
          </span>
        );
      case "OUT_OF_STOCK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />Sold Out</span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans text-foreground animate-fade-in">
      {/* ── TOP SECTION: Header & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-black">
              Inventory &amp; Stock Levels
            </h1>
            <Badge variant="outline" className="border-neutral-300 text-neutral-600 font-mono text-xs">
              {metrics.totalCount} Artikel
            </Badge>
          </div>
          <p className="text-xs text-neutral-500 font-semibold mt-1">
            Manage inventory quantities, reorder thresholds, and low-stock alerts in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fetchInventory(true)}
            disabled={refreshing || loading}
            className="border-neutral-300 text-black hover:bg-neutral-100 rounded-xl text-xs font-heading font-bold cursor-pointer h-9 px-3.5 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          {onSelectTab && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSelectTab("products")}
              className="border-neutral-300 text-black hover:bg-neutral-100 rounded-xl text-xs font-heading font-bold cursor-pointer h-9 px-3.5 gap-1.5"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Product Catalog</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-heading">
              Total Units
            </span>
            <Boxes className="w-4 h-4 text-neutral-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-black mt-2 tabular-nums">
            {metrics.totalUnits.toLocaleString("de-DE")}
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            across {metrics.totalCount} catalog styles
          </p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === "IN_STOCK" ? "ALL" : "IN_STOCK")}
          className={`border-2 rounded-2xl p-4 transition-all cursor-pointer shadow-2xs ${
            statusFilter === "IN_STOCK"
              ? "border-emerald-600 bg-emerald-50/40"
              : "bg-white border-neutral-200 hover:border-emerald-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-heading">
              Auf Lager
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-700 mt-2 tabular-nums">
            {metrics.inStockCount}
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">
            Bestand über Schwellenwert
          </p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === "LOW_STOCK" ? "ALL" : "LOW_STOCK")}
          className={`border-2 rounded-2xl p-4 transition-all cursor-pointer shadow-2xs ${
            statusFilter === "LOW_STOCK"
              ? "border-amber-600 bg-amber-50/50"
              : "bg-white border-neutral-200 hover:border-amber-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 font-heading">
              Geringer Bestand
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-amber-800 mt-2 tabular-nums">
            {metrics.lowStockCount}
          </div>
          <p className="text-[11px] text-amber-700/80 mt-0.5">
            Bestand &le; Schwellenwert
          </p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === "OUT_OF_STOCK" ? "ALL" : "OUT_OF_STOCK")}
          className={`border-2 rounded-2xl p-4 transition-all cursor-pointer shadow-2xs ${
            statusFilter === "OUT_OF_STOCK"
              ? "border-rose-600 bg-rose-50/40"
              : "bg-white border-neutral-200 hover:border-rose-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 font-heading">Sold Out</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-rose-700 mt-2 tabular-nums">
            {metrics.outOfStockCount}
          </div>
          <p className="text-[11px] text-rose-600/80 mt-0.5">
            0 units available
          </p>
        </div>
      </div>

      {/* ── FILTER & SEARCH TOOLBAR ── */}
      <div className="bg-white p-3.5 rounded-2xl border-2 border-neutral-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by style name, SKU, or product code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 focus:border-black focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-black placeholder:text-neutral-400 outline-none font-medium transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filters & Category Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter Buttons */}
          <div className="inline-flex items-center p-1 bg-neutral-100 rounded-xl border border-neutral-200 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-black text-white shadow-2xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Alle ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("IN_STOCK")}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                statusFilter === "IN_STOCK"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Vorrätig ({metrics.inStockCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("LOW_STOCK")}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                statusFilter === "LOW_STOCK"
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Gering ({metrics.lowStockCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("OUT_OF_STOCK")}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                statusFilter === "OUT_OF_STOCK"
                  ? "bg-rose-600 text-white shadow-2xs"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Sold Out ({metrics.outOfStockCount})
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-3 py-1.5 text-xs text-black font-semibold outline-none cursor-pointer h-9"
          >
            <option value="ALL">Alle Kategorien ({categoriesList.length})</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── INVENTORY TABLE ── */}
      {loading ? (
        <div className="bg-white rounded-2xl border-2 border-neutral-200 p-12 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-black animate-spin mx-auto" />
          <p className="text-xs font-semibold text-neutral-600">Lade Inventar und Lagerbestände...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-neutral-200 p-12 text-center space-y-4">
          <Boxes className="w-10 h-10 text-neutral-400 mx-auto stroke-[1.5]" />
          <div>
            <h3 className="font-heading font-black text-base text-black">
              Keine passenden Produkte gefunden
            </h3>
            <p className="text-xs text-neutral-500 font-semibold mt-1">
              Passen Sie Ihre Such- oder Filterkriterien an, um Artikel anzuzeigen.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("ALL");
              setStatusFilter("ALL");
            }}
            className="rounded-xl text-xs font-bold uppercase border-neutral-300"
          >
            Filter zurücksetzen
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-neutral-200 overflow-hidden shadow-2xs">
          {/* ── UNSAVED CHANGES BANNER BAR ── */}
          {pendingCount > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-b-2 border-emerald-200 px-4 py-2.5 flex items-center justify-between text-xs transition-all">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <span className="font-semibold text-emerald-950">
                  <strong className="font-bold">{pendingCount}</strong> {pendingCount === 1 ? "Bestandsänderung" : "Bestandsänderungen"} noch nicht gespeichert.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDiscardAllPending}
                  disabled={isSavingPending}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-black font-semibold rounded-xl hover:bg-neutral-200/60 transition-colors cursor-pointer"
                >
                  Verwerfen
                </button>
                <button
                  type="button"
                  onClick={handleSaveAllPending}
                  disabled={isSavingPending}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading font-bold text-xs shadow-sm hover:shadow flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  {isSavingPending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Wird gespeichert...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Speichern ({pendingCount})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b-2 border-neutral-200 text-neutral-600 select-none">
                  <th className="py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-[11px] w-12 text-center">
                    #
                  </th>
                  <th
                    onClick={() => handleSort("name")}
                    className="py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-[11px] cursor-pointer hover:text-black transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Produkt &amp; SKU</span>
                      {sortField === "name" && (
                        sortDirection === "asc" ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("category")}
                    className="py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-[11px] cursor-pointer hover:text-black transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Kategorie</span>
                      {sortField === "category" && (
                        sortDirection === "asc" ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("stock")}
                    className="py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-[11px] text-center cursor-pointer hover:text-black transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Lagerbestand</span>
                      {sortField === "stock" && (
                        sortDirection === "asc" ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-[11px] text-center">
                    Low Stock Threshold
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="py-3.5 px-4 font-heading font-bold uppercase tracking-wider text-[11px] text-center cursor-pointer hover:text-black transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>Status</span>
                      {sortField === "status" && (
                        sortDirection === "asc" ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                  <th className="py-2.5 px-4 font-heading font-bold uppercase tracking-wider text-[11px] text-right">
                    {pendingCount > 0 ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleDiscardAllPending}
                          disabled={isSavingPending}
                          className="px-2 py-1 text-[11px] text-neutral-500 hover:text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                          title="Alle ungespeicherten Änderungen verwerfen"
                        >
                          Verwerfen
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveAllPending}
                          disabled={isSavingPending}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 animate-pulse hover:animate-none"
                          title="Änderungen jetzt speichern"
                        >
                          {isSavingPending ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Speichern...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Speichern ({pendingCount})</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <span>Aktionen</span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredItems.map((item, idx) => {
                  const isExpanded = expandedProductIds.has(item.id);
                  const hasVariants = item.variants && item.variants.length > 0;
                  const isInlineEditing = inlineEditingId === item.id;
                  const effectiveStock = getEffectiveStock(item);
                  const effectiveStatus = getEffectiveStatus(item);
                  const isPending = Boolean(pendingChanges[getStockKey(item.id)]);

                  return (
                    <React.Fragment key={item.id}>
                      <tr className={`hover:bg-neutral-50/70 transition-colors group ${isPending ? "bg-emerald-50/25" : ""}`}>
                        {/* Index / Expand toggle */}
                        <td className="py-3 px-4 text-center text-neutral-400 font-mono text-[11px]">
                          {hasVariants ? (
                            <button
                              type="button"
                              onClick={() => toggleExpand(item.id)}
                              className="p-1 rounded hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
                              title="Varianten anzeigen / ausblenden"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            idx + 1
                          )}
                        </td>

                        {/* Product Image & Details */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3 min-w-[240px] max-w-[340px]">
                            <div className="w-12 h-12 rounded-xl border border-neutral-200 bg-white p-1 shrink-0 overflow-hidden flex items-center justify-center">
                              {item.featured_image ? (
                                <img
                                  src={item.featured_image}
                                  alt={item.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Box className="w-5 h-5 text-neutral-400" />
                              )}
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <h4 className="font-heading font-black text-xs sm:text-sm text-black leading-snug truncate group-hover:text-neutral-700">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                                <span>SKU: {item.partNumber}</span>
                                {hasVariants && (
                                  <span className="text-neutral-400">
                                    • {item.variants.length} Varianten
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                            {item.category}
                          </span>
                        </td>

                        {/* Stock Quantity Controls */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 justify-center">
                            {/* Minus Button */}
                            <button
                              type="button"
                              onClick={() => handleQuickAdjust(item, -1)}
                              disabled={effectiveStock <= 0}
                              className="w-6 h-6 rounded-lg border border-neutral-300 hover:border-black flex items-center justify-center text-neutral-700 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors active:scale-90"
                              title="Bestand um 1 verringern"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            {/* Stock Display / Inline Input */}
                            {isInlineEditing ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0"
                                  autoFocus
                                  value={inlineStockValue}
                                  onChange={(e) => setInlineStockValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleInlineStockSubmit(item);
                                    } else if (e.key === "Escape") {
                                      setInlineEditingId(null);
                                    }
                                  }}
                                  className="w-14 h-7 text-center font-heading font-black text-sm border-2 border-black rounded-lg outline-none bg-white tabular-nums"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleInlineStockSubmit(item)}
                                  className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center cursor-pointer active:scale-90"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setInlineEditingId(item.id);
                                  setInlineStockValue(String(effectiveStock));
                                }}
                                className={`min-w-10 px-2 py-0.5 rounded-lg font-heading font-black text-sm sm:text-base tabular-nums cursor-pointer transition-all ${
                                  isPending
                                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300 ring-1 ring-emerald-400 font-extrabold"
                                    : "hover:bg-neutral-100 text-black"
                                }`}
                                title={
                                  isPending
                                    ? `Geändert (vorher: ${item.stock}) - Klicken zum direkten Eingeben`
                                    : "Klicken, um Menge direkt einzugeben"
                                }
                              >
                                <div className="flex items-center gap-1 justify-center">
                                  <span>{effectiveStock}</span>
                                  {isPending && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                  )}
                                </div>
                              </button>
                            )}

                            {/* Plus Button */}
                            <button
                              type="button"
                              onClick={() => handleQuickAdjust(item, 1)}
                              className="w-6 h-6 rounded-lg border border-neutral-300 hover:border-black flex items-center justify-center text-neutral-700 hover:text-black cursor-pointer transition-colors active:scale-90"
                              title="Bestand um 1 erhöhen"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>

                        {/* Low-Stock Threshold */}
                        <td className="py-3 px-4 text-center font-mono font-semibold text-neutral-700 tabular-nums">
                          {item.low_stock_threshold}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {renderStatusBadge(effectiveStatus)}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingItem(item);
                                setEditStockValue(effectiveStock);
                                setEditThresholdValue(item.low_stock_threshold);
                              }}
                              className="h-8 px-2.5 rounded-xl border-neutral-300 hover:border-black text-xs font-heading font-bold cursor-pointer gap-1"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Verwalten</span>
                            </Button>

                            <a
                              href={`/${item.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-xl border border-neutral-300 hover:border-black text-neutral-600 hover:text-black transition-colors"
                              title="Produkt live im Shop öffnen"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Variants Sub-rows */}
                      {hasVariants && isExpanded && (
                        item.variants.map((variant) => {
                          const vEffectiveStock = getEffectiveStock(item, variant.id);
                          const vEffectiveStatus = getEffectiveStatus(item, variant.id);
                          const vIsPending = Boolean(pendingChanges[getStockKey(item.id, variant.id)]);

                          return (
                            <tr
                              key={variant.id}
                              className={`bg-neutral-50/50 border-b border-neutral-200/60 text-xs ${vIsPending ? "bg-emerald-50/30" : ""}`}
                            >
                              <td className="py-2.5 px-4 text-center">
                                <span className="inline-block w-2 h-2 rounded-full bg-neutral-300" />
                              </td>
                              <td className="py-2.5 px-4 pl-12">
                                <div className="space-y-0.5">
                                  <span className="font-semibold text-neutral-800">
                                    ↳ {variant.name}
                                  </span>
                                  {variant.specs && Object.keys(variant.specs).length > 0 && (
                                    <span className="text-[10px] text-neutral-500 font-mono block">
                                      {Object.entries(variant.specs)
                                        .map(([k, v]) => `${k}: ${v}`)
                                        .join(" • ")}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-2.5 px-4 text-neutral-400 font-mono text-[11px]">
                                Variante
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <div className="inline-flex items-center gap-1.5 justify-center">
                                  <button
                                    type="button"
                                    onClick={() => handleQuickAdjust(item, -1, variant.id)}
                                    disabled={vEffectiveStock <= 0}
                                    className="w-5 h-5 rounded border border-neutral-300 hover:border-black flex items-center justify-center text-neutral-700 hover:text-black disabled:opacity-30 cursor-pointer active:scale-90"
                                    title="Variantenbestand um 1 verringern"
                                  >
                                    <Minus className="w-2.5 h-2.5" />
                                  </button>
                                  <span
                                    className={`min-w-8 font-mono font-bold text-xs tabular-nums px-1.5 py-0.5 rounded ${
                                      vIsPending
                                        ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-400"
                                        : "text-black"
                                    }`}
                                    title={vIsPending ? "Ungespeichert geändert" : undefined}
                                  >
                                    {vEffectiveStock}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleQuickAdjust(item, 1, variant.id)}
                                    className="w-5 h-5 rounded border border-neutral-300 hover:border-black flex items-center justify-center text-neutral-700 hover:text-black cursor-pointer active:scale-90"
                                    title="Variantenbestand um 1 erhöhen"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              </td>
                              <td className="py-2.5 px-4 text-center font-mono text-neutral-400 text-[11px]">
                                {item.low_stock_threshold}
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                {renderStatusBadge(vEffectiveStatus)}
                              </td>
                              <td className="py-2.5 px-4 text-right text-neutral-400 text-[11px]">
                                {variant.price !== null && `₹${variant.price.toFixed(2)}`}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── EDIT STOCK DRAWER / MODAL ── */}
      {editingItem && (
        <AdminDrawer
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title={`Lagerbestand verwalten: ${editingItem.name}`}
        >
          <div className="space-y-6 p-4 sm:p-6 font-sans">
            {/* Product summary card */}
            <div className="flex items-center gap-3.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="w-14 h-14 rounded-lg bg-white border border-neutral-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                {editingItem.featured_image ? (
                  <img
                    src={editingItem.featured_image}
                    alt={editingItem.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Box className="w-6 h-6 text-neutral-400" />
                )}
              </div>
              <div className="min-w-0 space-y-0.5">
                <h4 className="font-heading font-black text-sm text-black truncate">
                  {editingItem.name}
                </h4>
                <p className="text-xs text-neutral-500 font-mono">
                  SKU: {editingItem.partNumber} • {editingItem.category}
                </p>
                <div className="pt-0.5">
                  {renderStatusBadge(computeStockStatus(editStockValue, editThresholdValue))}
                </div>
              </div>
            </div>

            {/* Current Stock Input */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold uppercase tracking-wider text-neutral-700">
                Current Physical Inventory (Units)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditStockValue((v) => Math.max(0, v - 5))}
                  className="px-3 py-2 border-2 border-neutral-200 hover:border-black rounded-xl font-bold text-xs"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => setEditStockValue((v) => Math.max(0, v - 1))}
                  className="px-3 py-2 border-2 border-neutral-200 hover:border-black rounded-xl font-bold text-xs"
                >
                  -1
                </button>
                <input
                  type="number"
                  min="0"
                  value={editStockValue}
                  onChange={(e) => setEditStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-3 py-2 text-center text-lg font-heading font-black text-black outline-none tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => setEditStockValue((v) => v + 1)}
                  className="px-3 py-2 border-2 border-neutral-200 hover:border-black rounded-xl font-bold text-xs"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => setEditStockValue((v) => v + 5)}
                  className="px-3 py-2 border-2 border-neutral-200 hover:border-black rounded-xl font-bold text-xs"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Low-stock Threshold Input */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold uppercase tracking-wider text-neutral-700">
                Low Stock Threshold-Schwellenwert (Warnsignal)
              </label>
              <input
                type="number"
                min="0"
                value={editThresholdValue}
                onChange={(e) => setEditThresholdValue(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-white border-2 border-neutral-200 focus:border-black rounded-xl px-3 py-2 text-sm font-semibold text-black outline-none tabular-nums"
              />
              <p className="text-[11px] text-neutral-500">
                Fällt der Lagerbestand auf oder unter diesen Wert, wird eine Warnung in der Benachrichtigungszentrale ausgelöst.
              </p>
            </div>

            {/* Quick preset replenishment buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Schnellauswahl:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {[0, 5, 10, 15, 20, 25, 50, 100].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setEditStockValue(preset)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                      editStockValue === preset
                        ? "bg-black text-white border-black"
                        : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingItem(null)}
                className="rounded-xl text-xs font-bold uppercase border-neutral-300"
              >
                Abbrechen
              </Button>
              <Button
                type="button"
                onClick={handleSaveModal}
                disabled={isSaving}
                className="rounded-xl text-xs font-bold uppercase bg-black hover:bg-neutral-800 text-white gap-1.5 px-4"
              >
                {isSaving ? (
                  <span>Speichert...</span>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Lagerbestand sichern</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </AdminDrawer>
      )}
    </div>
  );
}
