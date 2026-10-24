import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import CollectionsCatalogue from '@/components/CollectionsCatalogue';
import { siteConfig } from '@/data/site-config';

export const metadata: Metadata = {
  title: "Complete Wholesale Collections Catalogue | Indian Women's Wear",
  description:
    "Browse the full wholesale export catalogue of Wastram. Over 130 designs across royal 3-piece suit sets, designer ethnic co-ords, tiered chiffon dresses, artisanal kurtas, festive lehengas, and luxe satin shirts.",
  alternates: {
    canonical: `${siteConfig.productionDomain}/collections`,
  },
};

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center text-navy font-serif">
        <div className="w-10 h-10 border-4 border-navy border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p>Loading Wastram Wholesale Catalogue...</p>
      </div>
    }>
      <CollectionsCatalogue />
    </Suspense>
  );
}
