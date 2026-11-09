'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';
import PromoPopupModal from '@/components/PromoPopupModal';
import HeroSection from '@/components/HeroSection';
import FeatureCategories from '@/components/FeatureCategories';
import EditorialBanners from '@/components/EditorialBanners';
import ProductFitsGrid from '@/components/ProductFitsGrid';
import ProductShowcaseSection from '@/components/ProductShowcaseSection';
import Footer from '@/components/Footer';

import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';
import { DENIM_COLLECTION } from '@/data/denim-collection';
import { ETHNIC_WEAR_SETS } from '@/data/ethnic-wear-sets';
import { SHORT_LONG_KAFTANS } from '@/data/short-long-kaftan';
import { CORD_SETS } from '@/data/cord-sets';

export default function HomePage() {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Curated showcase subsets
  const bestsellers = useMemo(() => {
    return NISHORAMA_PRODUCTS.filter(p => p.badge?.includes('Bestseller') || p.badge?.includes('Export')).slice(0, 8);
  }, []);

  const denimStyles = useMemo(() => {
    return DENIM_COLLECTION.slice(0, 8);
  }, []);

  const heritageSets = useMemo(() => {
    return ETHNIC_WEAR_SETS.slice(0, 8);
  }, []);

  const resortSilhouettes = useMemo(() => {
    return [...SHORT_LONG_KAFTANS.slice(0, 4), ...CORD_SETS.slice(0, 4)];
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF9F6]">
      {/* Interactive Navigation Header */}
      <Header
        onOpenStory={() => setIsStoryOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Story Viewer Modal (Opens on Story Ring click) */}
      <StoryViewerModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />

      {/* Search Modal (Opens on Search icon click) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Promotional Popup Modal */}
      <PromoPopupModal />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Curated Silhouettes (Category Cards) */}
      <FeatureCategories />

      {/* 3. Filterable Tabbed Product Grid */}
      <ProductFitsGrid />

      {/* 4. Editorial Lookbook Banners */}
      <EditorialBanners />

      {/* 5. Product Showcase: Global Export Bestsellers */}
      <ProductShowcaseSection
        kicker="High-Turnover Boutique Favorites"
        heading="Global Export Bestsellers"
        products={bestsellers}
        viewAllHref="/collections/shop-all"
        viewAllLabel="Explore All Bestsellers"
        limit={8}
      />

      {/* 6. Product Showcase: The Denim Export Edit */}
      <ProductShowcaseSection
        kicker="100% Rigid & Selvedge Denim"
        heading="The Denim Export Edit"
        products={denimStyles}
        viewAllHref="/collections/denim-collection"
        viewAllLabel="Explore 140+ Denim Styles"
        limit={8}
      />

      {/* 7. Product Showcase: Handcrafted Heritage */}
      <ProductShowcaseSection
        kicker="Royal Jaipuri Needlework"
        heading="Handcrafted Heritage"
        products={heritageSets}
        viewAllHref="/collections/ethnic-wear-sets"
        viewAllLabel="Explore 100+ Regal Sets"
        limit={8}
      />

      {/* 8. Product Showcase: Resort & Co-ord Silhouettes */}
      <ProductShowcaseSection
        kicker="Breezy Holiday Couture"
        heading="Resort & Co-ord Silhouettes"
        products={resortSilhouettes}
        viewAllHref="/collections/short-long-kaftan"
        viewAllLabel="Explore Resort Styles"
        limit={8}
      />

      {/* 9. Minimal Luxury Footer */}
      <Footer />
    </main>
  );
}
