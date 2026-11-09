'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';
import PromoPopupModal from '@/components/PromoPopupModal';
import HeroSection from '@/components/HeroSection';
import FeatureCategories from '@/components/FeatureCategories';
import ProductFitsGrid from '@/components/ProductFitsGrid';
import EditorialBanners from '@/components/EditorialBanners';
import DenimAtelierShowcase from '@/components/DenimAtelierShowcase';
import HeritageGalleryShowcase from '@/components/HeritageGalleryShowcase';
import ResortFilmstripShowcase from '@/components/ResortFilmstripShowcase';
import BestsellersShowcase from '@/components/BestsellersShowcase';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF9F6] w-full max-w-full overflow-x-hidden">
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

      {/* 1. Hero Section: Cinematic Grand Portrait & Brand Statement */}
      <HeroSection />

      {/* 2. Arched Architectural Silhouette Portals */}
      <FeatureCategories />

      {/* 3. Interactive Filtered Runway Grid */}
      <ProductFitsGrid />

      {/* 4. Asymmetrical High-Fashion Magazine Spread */}
      <EditorialBanners />

      {/* 5. Split-Screen Studio Atelier Spotlight (Denim) */}
      <DenimAtelierShowcase />

      {/* 6. Champagne-Tinted Royal Gallery (Heritage Needlework) */}
      <HeritageGalleryShowcase />

      {/* 7. Horizontal Lookbook Filmstrip (Resort & Co-ords) */}
      <ResortFilmstripShowcase />

      {/* 8. Signature Atelier Creations */}
      <BestsellersShowcase />

      {/* 9. Minimal Luxury Footer */}
      <Footer />
    </main>
  );
}
