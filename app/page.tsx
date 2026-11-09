'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';
import PromoPopupModal from '@/components/PromoPopupModal';
import HeroSection from '@/components/HeroSection';
import FeatureCategories from '@/components/FeatureCategories';
import EditorialBanners from '@/components/EditorialBanners';
import ProductFitsGrid from '@/components/ProductFitsGrid';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

      {/* Hero Section */}
      <HeroSection />

      {/* Curated Silhouettes */}
      <FeatureCategories />

      {/* Editorial Banners */}
      <EditorialBanners />

      {/* Filterable Tabbed Product Grid */}
      <ProductFitsGrid />

      {/* Minimal Luxury Footer */}
      <Footer />
    </main>
  );
}
