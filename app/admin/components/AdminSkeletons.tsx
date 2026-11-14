"use client";

import React from "react";

// ─── BASE PRIMITIVES ───────────────────────────────────────────────

export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse bg-muted rounded-md ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({
  lines = 1,
  className = "",
  lineClassName = ""
}: {
  lines?: number;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          className={`h-4 ${
            idx === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          } ${lineClassName}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  className = "",
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`bg-card border border-border text-card-foreground rounded-2xl p-5.5 shadow-xs ${className}`}
    >
      {children}
    </div>
  );
}

export function SkeletonBadge({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-5 w-20 rounded-full ${className}`} />;
}

export function SkeletonButton({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-8 w-28 rounded-full ${className}`} />;
}

// ─── 1. OVERVIEW DASHBOARD SKELETON (1:1 PIXEL-PERFECT CLONE) ──────

export function AdminOverviewSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Upper Section: Action Pills (Right aligned) */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap pt-1">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-36 rounded-full" />
      </div>

      {/* Lower Section: Sales Hero Amount (Left aligned) */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <Skeleton className="h-16 w-64 rounded-2xl" />
            <Skeleton className="h-8 w-16 rounded-xl" />
          </div>
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>

        {/* 3 Minimal Cards in 1 Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 pt-1">
          {/* Card 1: Live Storefront Activity */}
          <div className="bg-white border border-[#E5E7EB] p-5.5 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-100" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-40 rounded" />
              <div className="flex items-baseline gap-1.5">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-3 w-10 rounded" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </div>
          </div>

          {/* Card 2: Orders & Deliveries */}
          <div className="bg-white border border-[#E5E7EB] p-5.5 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-100" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-36 rounded" />
              <div className="flex items-baseline gap-1.5">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          </div>

          {/* Card 3: Wholesale RFQs */}
          <div className="bg-white border border-[#E5E7EB] p-5.5 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-100" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-44 rounded" />
              <div className="flex items-baseline gap-1.5">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Analytics & Operational Progress (2-Column Grid: 2 cols + 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 7-Day Chart Box (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-4">
          <div className="space-y-4 border-b border-[#E5E7EB] pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Skeleton className="h-4 w-44 rounded" />
              <div className="flex items-center gap-5 sm:gap-6">
                <div className="space-y-1 text-right">
                  <Skeleton className="h-3 w-20 ml-auto rounded" />
                  <Skeleton className="h-6 w-24 ml-auto rounded" />
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="space-y-1 text-right">
                  <Skeleton className="h-3 w-20 ml-auto rounded" />
                  <Skeleton className="h-6 w-24 ml-auto rounded" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-8 w-36 rounded-full" />
            </div>
          </div>
          {/* Chart Canvas Area */}
          <div className="h-[210px] w-full bg-slate-50/50 rounded-xl flex items-end justify-between p-4 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <Skeleton className="w-full rounded-t-md" style={{ height: `${30 + ((i * 17) % 65)}%` }} />
                <Skeleton className="h-2.5 w-8 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order & Gateway Health (1 col) */}
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <Skeleton className="h-4 w-44 rounded border-b border-[#E5E7EB] pb-3" />
            <div className="space-y-3">
              <div className="flex justify-between items-center"><Skeleton className="h-3.5 w-32 rounded" /><Skeleton className="h-4 w-8 rounded" /></div>
              <div className="flex justify-between items-center"><Skeleton className="h-3.5 w-40 rounded" /><Skeleton className="h-4 w-8 rounded" /></div>
              <div className="flex justify-between items-center"><Skeleton className="h-3.5 w-36 rounded" /><Skeleton className="h-4 w-8 rounded" /></div>
            </div>
            <div className="pt-3.5 border-t border-[#E5E7EB] space-y-2">
              <Skeleton className="h-3 w-36 rounded" />
              <Skeleton className="h-2.5 w-full rounded-full" />
              <div className="flex justify-between pt-1">
                <Skeleton className="h-3 w-14 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Live Storefront Visitor Intelligence Widget */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3.5">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg bg-slate-100" />
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-4 w-64 rounded" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-8 w-44 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-5.5 rounded-2xl border border-[#E5E7EB] space-y-4">
              <Skeleton className="h-3.5 w-40 rounded" />
              <Skeleton className="h-8 w-28 rounded-lg" />
              <div className="pt-2.5 border-t border-slate-100 flex justify-between">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Recent Operations Tables (Side-by-Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Table: Recent Orders */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-32 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-16 ml-auto rounded" />
                  <SkeletonBadge className="w-18" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Table: Recent Enquiries */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-3">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-36 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
                <SkeletonBadge className="w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 2. CATEGORIES SKELETON (1:1 MIRROR) ───────────────────────────

export function AdminCategoriesSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E5E7EB] pb-4">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>

        {/* List of Category Rows */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-[#E5E7EB] bg-white">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Skeleton className="w-4 h-4 rounded shrink-0 hidden sm:block" />
                <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-36 rounded" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 3. PRODUCTS CATALOG TABLE SKELETON (1:1 MIRROR) ─────────────────

export function AdminProductsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6">
        {/* Upper Action Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#E5E7EB] pb-4">
          <div>
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded mt-1" />
          </div>
          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            <Skeleton className="h-8 w-[220px] rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
        </div>

        {/* Quick Filter Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full shrink-0" />
          ))}
        </div>

        {/* Table View */}
        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F7F8] border-b border-[#EAEAEA]">
              <tr>
                <th className="px-4 py-3"><Skeleton className="h-3 w-16 rounded" /></th>
                <th className="px-4 py-3"><Skeleton className="h-3 w-16 rounded" /></th>
                <th className="px-4 py-3"><Skeleton className="h-3 w-14 rounded" /></th>
                <th className="px-4 py-3 text-right"><Skeleton className="h-3 w-14 ml-auto rounded" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded object-cover shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-44 rounded" />
                        <Skeleton className="h-3 w-28 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><Skeleton className="h-3.5 w-24 rounded" /></td>
                  <td className="px-4 py-3.5"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Skeleton className="w-7 h-7 rounded-lg" />
                      <Skeleton className="w-7 h-7 rounded-lg" />
                      <Skeleton className="w-7 h-7 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── 4. ORDERS & INQUIRIES SKELETON (1:1 MIRROR) ─────────────────────

export function AdminOrdersSkeleton() {
  return (
    <div className="space-y-8 font-sans text-foreground animate-fade-in">
      {/* Upper Section: Action & Sub-Tab Navigation Pills (Right Aligned) */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap pt-1">
        <Skeleton className="h-8 w-36 rounded-full" />
        <Skeleton className="h-8 w-36 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>

      {/* Hero Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <Skeleton className="h-16 w-48 rounded-2xl" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
          <Skeleton className="h-4 w-96 rounded" />
          <Skeleton className="h-8 w-44 rounded-full" />
        </div>

        {/* 3 Minimal Summary Cards in 1 Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 pt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] p-5.5 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="w-8 h-8 rounded-full bg-slate-100" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-36 rounded" />
                <Skeleton className="h-8 w-28 rounded-lg" />
                <div className="pt-2 border-t border-slate-100">
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Rows Table / List */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-[#E5E7EB] flex items-center justify-between">
          <Skeleton className="h-8 w-56 rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-36 rounded" />
                    <SkeletonBadge className="w-16 h-4" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-48 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right space-y-1">
                  <Skeleton className="h-5 w-24 ml-auto rounded" />
                  <Skeleton className="h-3 w-16 ml-auto rounded" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 5. INVOICE STUDIO SKELETON (1:1 MIRROR) ─────────────────────────

export function AdminInvoiceSkeleton() {
  return (
    <div className="space-y-6 font-sans text-foreground animate-fade-in">
      {/* Upper Action Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-4 w-36 rounded" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-4">
            <Skeleton className="h-4 w-44 rounded border-b border-[#E5E7EB] pb-3" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-36 rounded-full" />
              <Skeleton className="h-8 w-36 rounded-full" />
              <Skeleton className="h-8 w-36 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
              <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
              <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
              <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-4">
            <Skeleton className="h-4 w-40 rounded border-b border-[#E5E7EB] pb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5"><Skeleton className="h-3 w-28 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
              <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
              <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Document Preview Box (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-black rounded-3xl p-6 min-h-[520px] flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start pb-4 border-b border-black">
              <Skeleton className="h-8 w-32 rounded" />
              <Skeleton className="h-6 w-28 rounded" />
            </div>
            <div className="space-y-3 my-auto">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-4/6 rounded" />
            </div>
            <div className="pt-4 border-t border-black flex justify-between">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 6. PAYMENTS TAB SKELETON (1:1 MIRROR) ───────────────────────────

export function AdminPaymentsSkeleton() {
  return (
    <div className="space-y-8 font-sans text-foreground animate-fade-in">
      <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap pt-1">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {["PayPal", "Direct Wire", "Cards", "Other"].map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] p-5.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-100" />
              <SkeletonBadge className="w-16" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-7 w-28 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-[#E5E7EB] flex items-center justify-between">
          <Skeleton className="h-8 w-56 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-24 rounded" />
                <SkeletonBadge className="w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 7. NEWSLETTER TAB SKELETON (1:1 MIRROR) ─────────────────────────

export function AdminNewsletterSkeleton() {
  return (
    <div className="space-y-6 font-sans text-foreground animate-fade-in">
      <div className="flex justify-between items-center pb-2">
        <div>
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton className="h-3 w-32 rounded mt-1" />
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>

      <div className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-white">
        <table className="min-w-full divide-y divide-[#E5E7EB] text-xs text-left">
          <thead className="bg-[#F7F7F8] font-bold">
            <tr>
              <th className="px-6 py-3.5"><Skeleton className="h-3 w-24 rounded" /></th>
              <th className="px-6 py-3.5"><Skeleton className="h-3 w-28 rounded" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-3.5"><Skeleton className="h-4 w-48 rounded" /></td>
                <td className="px-6 py-3.5"><Skeleton className="h-3 w-32 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 8. PAYMENT GATEWAY SETTINGS SKELETON (1:1 MIRROR) ───────────────

export function AdminPaymentSettingsSkeleton() {
  return (
    <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-6 animate-fade-in font-sans">
      <Skeleton className="h-4 w-64 rounded border-b border-[#E5E7EB] pb-3" />
      <div className="max-w-xl space-y-4 border-b border-[#E5E7EB] pb-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-5 w-9 rounded-full" />
        </div>
        <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
        <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
      </div>
      <div className="max-w-xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
        <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
      </div>
    </div>
  );
}

// ─── 9. REVENUE & P&L SKELETON (1:1 MIRROR) ──────────────────────────

export function AdminPnLSkeleton() {
  return (
    <div className="space-y-8 font-sans text-foreground animate-fade-in pb-12">
      {/* Top Header Row with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["This Month", "Last Month", "Last 3 Months", "This Year", "All Time"].map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full shrink-0" />
          ))}
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] p-5.5 rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-100" />
              <SkeletonBadge className="w-16" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-8 w-36 rounded-lg" />
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Card */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E7EB]">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
        <div className="h-64 w-full bg-slate-50/50 rounded-xl" />
      </div>
    </div>
  );
}

// ─── 10. VISITOR TRAFFIC SKELETON (1:1 MIRROR) ───────────────────────

export function AdminTrafficSkeleton() {
  return (
    <div className="space-y-6 font-sans text-foreground animate-fade-in">
      {/* Live Active Visitors Toolbar Card */}
      <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Skeleton className="w-3.5 h-3.5 rounded-full" />
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-6 w-36 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] p-5.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-100" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
            <div className="pt-2 border-t border-slate-100">
              <Skeleton className="h-3 w-28 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Live Table / Session List */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-[#E5E7EB] flex justify-between">
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton className="h-8 w-48 rounded-full" />
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-7 h-7 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 11. PRICE UNLOCKS SKELETON (1:1 MIRROR) ─────────────────────────

export function AdminPriceUnlocksSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-6 font-sans text-foreground animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5E7EB] pb-5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-7 h-7 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-44 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Skeleton className="h-8 w-44 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] p-4.5 rounded-xl space-y-2">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-xl overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-44 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <SkeletonBadge className="w-24" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 12. CRM CLIENTS SKELETON (1:1 MIRROR) ───────────────────────────

export function AdminClientsCRMSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans animate-fade-in">
      <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-48 rounded" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] p-5.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-full bg-slate-100" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
            <div className="pt-2 border-t border-slate-100">
              <Skeleton className="h-3 w-28 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Sector Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["All Regions", "North America", "Western Europe", "APAC", "LatAm"].map((_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-full shrink-0" />
        ))}
      </div>

      {/* Table */}
      <div className="border border-[#E5E7EB] rounded-2xl bg-white overflow-hidden">
        <div className="divide-y divide-[#EAEAEA]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SkeletonBadge className="w-24" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 13. SHIPMENTS TRACKING SKELETON (1:1 MIRROR) ────────────────────

export function AdminShipmentsSkeleton() {
  return (
    <div className="space-y-8 font-sans text-foreground animate-fade-in">
      <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap pt-1">
        <Skeleton className="h-8 w-36 rounded-full" />
        <Skeleton className="h-8 w-36 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] p-5.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-100" />
              <SkeletonBadge className="w-16" />
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E7EB]">
              <div className="space-y-1">
                <Skeleton className="h-5 w-48 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
              <SkeletonBadge className="w-28" />
            </div>
            <div className="grid grid-cols-4 gap-2 py-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1.5 text-center">
                  <Skeleton className="h-2 w-full rounded-full" />
                  <Skeleton className="h-3 w-20 mx-auto rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 14. INVENTORY SKELETON (1:1 MIRROR) ─────────────────────────────

export function AdminInventorySkeleton() {
  return (
    <div className="space-y-8 font-sans text-foreground animate-fade-in">
      <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap pt-1">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] p-5.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-8 h-8 rounded-lg bg-slate-100" />
              <SkeletonBadge className="w-16" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-[#E5E7EB] flex justify-between">
          <Skeleton className="h-8 w-56 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-28 rounded" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-20 rounded" />
                <SkeletonBadge className="w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 15. EXPENSES & PURCHASE ORDERS SKELETON (1:1 MIRROR) ────────────

export function AdminExpensesSkeleton() {
  return (
    <div className="space-y-6 font-sans text-foreground animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <Skeleton className="h-5 w-44 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] p-5.5 rounded-2xl space-y-3">
            <Skeleton className="h-3.5 w-28 rounded" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-[#E5E7EB] flex justify-between">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-44 rounded" />
                <Skeleton className="h-3 w-28 rounded" />
              </div>
              <Skeleton className="h-5 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminPurchaseOrdersSkeleton() {
  return <AdminExpensesSkeleton />;
}

// ─── 16. SETTINGS SKELETON (1:1 MIRROR) ──────────────────────────────

export function AdminSettingsSkeleton() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 animate-fade-in font-sans max-w-4xl">
      <Skeleton className="h-4 w-48 rounded border-b border-[#E5E7EB] pb-3" />
      <div className="space-y-1.5 max-w-md">
        <Skeleton className="h-3 w-40 rounded" />
        <Skeleton className="h-8 w-full rounded-full" />
      </div>
      <Skeleton className="h-8 w-36 rounded-full mt-3" />
    </div>
  );
}

// ─── 17. TAG GENERATOR & SAMPLE GUIDE SKELETON (1:1 MIRROR) ──────────

export function AdminStudioSkeleton() {
  return (
    <div className="space-y-8 font-sans text-foreground animate-fade-in bg-background pb-16">
      {/* Upper Action Bar (Modern Outlined Pill Buttons) */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap pt-1">
        <Skeleton className="h-8 w-44 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-36 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Customer and Specs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-4">
            <Skeleton className="h-4 w-44 rounded border-b border-[#E5E7EB] pb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Skeleton className="h-3 w-28 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
              <div className="space-y-1.5"><Skeleton className="h-3 w-28 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
              <div className="col-span-2 space-y-1.5"><Skeleton className="h-3 w-32 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
              <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
              <div className="space-y-1.5"><Skeleton className="h-3 w-24 rounded" /><Skeleton className="h-8 w-full rounded-full" /></div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl space-y-4">
            <Skeleton className="h-4 w-40 rounded border-b border-[#E5E7EB] pb-3" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
        </div>

        {/* Right Canvas: Live A3 Simulation Container */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-50 border border-black rounded-3xl p-6 min-h-[500px] flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-black">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>
            <div className="space-y-3 my-auto">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-4/6 rounded" />
            </div>
            <div className="pt-4 border-t border-black flex justify-between">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-5 w-28 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
