import React from 'react';
import { CollectionGridSkeleton } from '@/components/BrandedSkeleton';

export default function CollectionLoading() {
  return (
    <div className="min-h-screen bg-[#FFFEFE] dark:bg-[#0E0C0A] pt-24 md:pt-28">
      <CollectionGridSkeleton count={8} />
    </div>
  );
}
