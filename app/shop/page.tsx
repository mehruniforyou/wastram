import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import CollectionsCatalogue from '@/components/CollectionsCatalogue';
import { siteConfig } from '@/data/site-config';

export const metadata: Metadata = {
  title: "Shop Handcrafted Women's Ethnic Wear from Jaipur | Wastram",
  description:
    "Explore hand-block printed co-ords, kurta sets, western dresses, and occasion gowns crafted in our Sanganer workshop in Jaipur. Sizes XS to 8XL.",
  alternates: {
    canonical: `${siteConfig.productionDomain}/shop`,
  },
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-[#0B2D7F] font-serif">
          <div className="w-10 h-10 border-4 border-[#0B2D7F] border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
          <p>Loading Wastram Jaipur Collection...</p>
        </div>
      }
    >
      <CollectionsCatalogue />
    </Suspense>
  );
}
