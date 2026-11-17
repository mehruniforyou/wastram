'use client';

import React from 'react';

/**
 * Basic Shimmer Line / Box
 */
export function ShimmerBox({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`shimmer-skeleton rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Editorial Product Card Skeleton (Matching Baisa / Wastram Cards)
 */
export function ProductCardSkeleton() {
  return (
    <div className="group rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#161412] p-2 sm:p-2.5 shadow-2xs">
      {/* 3:4 Portrait Image Skeleton */}
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shimmer-skeleton mb-2">
        {/* Floating Mock Badge */}
        <div className="absolute top-2 left-2 w-12 h-4 rounded-full bg-white/70 dark:bg-black/40" />
      </div>

      {/* Typography Placeholders */}
      <div className="space-y-1.5 px-0.5">
        <div className="w-20 h-2.5 rounded shimmer-skeleton" />
        <div className="w-4/5 h-3.5 rounded shimmer-skeleton" />
        <div className="flex items-center justify-between pt-0.5">
          <div className="w-14 h-3 rounded shimmer-skeleton" />
          <div className="w-12 h-3 rounded shimmer-skeleton" />
        </div>
        {/* 2-Pill Button Placeholders */}
        <div className="grid grid-cols-2 gap-1.5 pt-1.5">
          <div className="h-7 rounded-full shimmer-skeleton" />
          <div className="h-7 rounded-full shimmer-skeleton" />
        </div>
      </div>
    </div>
  );
}

/**
 * 8-Tile Category Grid Skeleton
 */
export function CategoryTileSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden shimmer-skeleton aspect-[3/4] relative p-3 flex flex-col justify-between">
      <div className="w-14 h-4 rounded-full bg-white/50 dark:bg-black/30 self-start" />
      <div className="space-y-1.5">
        <div className="w-3/4 h-4 rounded bg-white/70 dark:bg-black/50" />
        <div className="w-1/2 h-3 rounded bg-white/50 dark:bg-black/30" />
      </div>
    </div>
  );
}

/**
 * Rajasthani Chapter Arch Skeleton
 */
export function ChapterArchSkeleton() {
  return (
    <div className="rounded-[28px] overflow-hidden border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#161412] p-4 shadow-sm">
      <div className="aspect-[3/4] rounded-[24px] shimmer-skeleton mb-4" />
      <div className="space-y-2 px-1">
        <div className="w-20 h-3 rounded shimmer-skeleton" />
        <div className="w-3/4 h-5 rounded shimmer-skeleton" />
        <div className="w-full h-3 rounded shimmer-skeleton" />
      </div>
    </div>
  );
}

/**
 * Collection Grid Skeleton (Grid of 8 or 12 cards)
 */
export function CollectionGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="container-x py-10">
      {/* Page Header Skeleton */}
      <div className="max-w-xl mb-8 space-y-3">
        <div className="w-28 h-6 rounded-full shimmer-skeleton" />
        <div className="w-72 h-8 rounded-lg shimmer-skeleton" />
        <div className="w-96 h-4 rounded shimmer-skeleton" />
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-24 h-8 rounded-full shimmer-skeleton shrink-0" />
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(count)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/**
 * Product Detail Page Skeleton
 */
export function ProductDetailSkeleton() {
  return (
    <div className="container-x py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery Skeleton (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[3/4] w-full rounded-3xl shimmer-skeleton shadow-sm" />
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-xl shimmer-skeleton" />
            ))}
          </div>
        </div>

        {/* Right Column: Product Specs & Sourcing (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:pl-6">
          <div className="w-32 h-6 rounded-full shimmer-skeleton" />
          <div className="w-4/5 h-8 rounded-lg shimmer-skeleton" />
          <div className="w-full h-16 rounded-xl shimmer-skeleton" />
          <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-white/10">
            <div className="w-28 h-4 rounded shimmer-skeleton" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-12 h-10 rounded-xl shimmer-skeleton" />
              ))}
            </div>
          </div>
          <div className="pt-4 space-y-3">
            <div className="w-full h-12 rounded-full shimmer-skeleton" />
            <div className="w-full h-12 rounded-full shimmer-skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}
