'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';
import PromoPopupModal from '@/components/PromoPopupModal';
import HeroSection from '@/components/HeroSection';
import FeatureCategories from '@/components/FeatureCategories';
import EditorialBanners from '@/components/EditorialBanners';
import ProductFitsGrid from '@/components/ProductFitsGrid';
import Footer from '@/components/Footer';
import PopularSearches from '@/components/PopularSearches';

export default function HomePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Interactive Navigation Header */}
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Slide-out Mobile Menu Drawer */}
      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
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

      {/* Hero Section */}
      <HeroSection />

      {/* 4 Feature Columns Grid */}
      <FeatureCategories />

      {/* 5 Editorial Banners */}
      <EditorialBanners />

      {/* Filterable Tabbed Product Grid */}
      <ProductFitsGrid />

      {/* Custom Artisan Footer */}
      <Footer />

      {/* SEO Category Directory Tag Cloud */}
      <PopularSearches />
    </main>
  );
}
