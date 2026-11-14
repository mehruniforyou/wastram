"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  ShieldCheck,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { notifyAdmin } from "./AdminToast";
import { formatAdminOrderDateTime, parseOrderTimestamp } from "@/utils/adminTimezone";

interface ReviewItem {
  id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string;
  comment: string;
  product_name: string;
  product_sku: string;
  verified_purchase: boolean;
  status: "Approved" | "Pending" | "Rejected";
  created_at: string;
  date?: string;
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews?t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "Approved" | "Pending" | "Rejected") => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        notifyAdmin("success", "Bewertungsstatus aktualisiert", `Bewertung wurde auf "${newStatus}" gesetzt.`);
      } else {
        const data = await res.json().catch(() => ({}));
        notifyAdmin("error", "Fehler beim Aktualisieren", data.error || "Status konnte nicht geändert werden", data);
      }
    } catch (err: any) {
      console.error("Error updating review status:", err);
      notifyAdmin("error", "Fehler beim Aktualisieren", err.message || String(err), err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Möchten Sie diese Kundenbewertung wirklich dauerhaft löschen?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}&admin=true`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        notifyAdmin("success", "Bewertung gelöscht", "Kundenbewertung wurde dauerhaft gelöscht.");
      } else {
        const data = await res.json().catch(() => ({}));
        notifyAdmin("error", "Fehler beim Löschen", data.error || "Bewertung konnte nicht gelöscht werden", data);
      }
    } catch (err: any) {
      console.error("Error deleting review:", err);
      notifyAdmin("error", "Fehler beim Löschen", err.message || String(err), err);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.customer_name.toLowerCase().includes(q) ||
        r.product_name.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const approvedCount = reviews.filter((r) => r.status === "Approved").length;
  const pendingCount = reviews.filter((r) => r.status === "Pending").length;
  const rejectedCount = reviews.filter((r) => r.status === "Rejected").length;

  return (
    <div className="space-y-4 font-sans text-foreground animate-fade-in">
      {/* ── TOP SECTION: shadcn-admin standard header & toolbar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Produktbewertungen
          </h1>
        </div>

        {/* Right: Search & Refresh */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Bewertungen durchsuchen..."
              className="bg-background border border-input rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring focus:border-ring w-36 sm:w-48 transition-all font-medium placeholder:text-muted-foreground"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={fetchReviews}
            className="h-8 w-8 cursor-pointer"
            title="Kundenbewertungen aktualisieren"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: "ALL", label: "Alle", count: reviews.length },
          { id: "Approved", label: "Freigegeben", count: approvedCount },
          { id: "Pending", label: "Ausstehend", count: pendingCount },
          { id: "Rejected", label: "Abgelehnt", count: rejectedCount },
        ].map((tab) => {
          const isSelected = statusFilter === tab.id;

          return (
            <Button
              key={tab.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(tab.id)}
              className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* ─── Reviews List ──────────────── */}
      <Card className="rounded-xl border border-border shadow-xs bg-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">
            Lade Bewertungen...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            Keine Bewertungen für den aktuellen Filter gefunden.
          </div>
        ) : (
          filteredReviews.map((r) => {
            const isProcessing = processingId === r.id;

            return (
              <div
                key={r.id}
                className="p-4 sm:p-5 hover:bg-muted/40 transition-colors flex flex-col md:flex-row items-start justify-between gap-4 border-b border-border last:border-b-0"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Stars */}
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? "fill-amber-500" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>

                    <h4 className="font-bold text-sm text-foreground">{r.title}</h4>

                    {r.verified_purchase && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        Verifizierter Kauf
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : r.status === "Pending"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : "bg-red-500/10 text-red-600 border border-red-500/20"
                      }`}
                    >
                      {r.status === "Approved" ? "Freigegeben" : r.status === "Pending" ? "Ausstehend" : "Abgelehnt"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    &quot;{r.comment}&quot;
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1 flex-wrap">
                    <span className="font-semibold text-foreground">{r.customer_name}</span>
                    {r.customer_email && <span>• {r.customer_email}</span>}
                    <span>• Produkt: <strong className="text-foreground">{r.product_name}</strong></span>
                    <span>
                      • {(() => {
                        const parsed = parseOrderTimestamp(r.created_at || r.date);
                        return parsed ? formatAdminOrderDateTime(parsed).date : (r.date || "Verifiziert");
                      })()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {r.status !== "Approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(r.id, "Approved")}
                      disabled={isProcessing}
                      className="h-8 gap-1 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Freigeben</span>
                    </Button>
                  )}

                  {r.status !== "Rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(r.id, "Rejected")}
                      disabled={isProcessing}
                      className="h-8 gap-1 text-xs text-muted-foreground hover:text-destructive border-border hover:bg-destructive/10 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Ablehnen</span>
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    title="Bewertung löschen"
                    className="p-1.5 rounded-full text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}
