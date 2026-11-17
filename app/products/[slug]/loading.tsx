import React from 'react';
import { ProductDetailSkeleton } from '@/components/BrandedSkeleton';

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[#FFFEFE] dark:bg-[#0E0C0A] pt-24 md:pt-28">
      <ProductDetailSkeleton />
    </div>
  );
}
