import React from 'react';
import BrandedLoader from '@/components/BrandedLoader';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 bg-[#FFFEFE] dark:bg-[#0E0C0A]">
      <BrandedLoader
        label="Wastram Jaipur Atelier"
        sublabel="Handcrafted Textiles & Wholesale Direct Sourcing"
      />
    </div>
  );
}
