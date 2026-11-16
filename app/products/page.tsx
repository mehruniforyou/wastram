import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import CollectionsCatalogue from '@/components/CollectionsCatalogue';
import { siteConfig } from '@/data/site-config';

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
    <Suspense
      fallback={
        <div className="py-24 text-center text-[#0B2D7F] font-serif">
          <div className="w-10 h-10 border-4 border-[#0B2D7F] border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
          <p>Loading Wastram Products...</p>
        </div>
      }
    >
      <CollectionsCatalogue />
    </Suspense>
  );
}
