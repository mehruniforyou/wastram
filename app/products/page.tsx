import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import CollectionsCatalogue from '@/components/CollectionsCatalogue';
import { siteConfig } from '@/data/site-config';
import { CollectionGridSkeleton } from '@/components/BrandedSkeleton';

export const metadata: Metadata = {
  title: "All Products & Collections | Wastram Jaipur",
  description:
    "Direct Jaipur handloom atelier specializing in Pure Mulmul, Modal Silk, and Sanganer block prints for high-fashion boutiques worldwide.",
  alternates: {
    canonical: `${siteConfig.productionDomain}/products`,
  },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<CollectionGridSkeleton count={12} />}>
      <CollectionsCatalogue />
    </Suspense>
  );
}
