'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';
import HeroSection from '@/components/HeroSection';
import TrustBadges from '@/components/TrustBadges';
import FeatureCategories from '@/components/FeatureCategories';
import ProductFitsGrid from '@/components/ProductFitsGrid';
import EditorialBanners from '@/components/EditorialBanners';
import ShoppableReelsShowcase from '@/components/ShoppableReelsShowcase';
import ParallaxAtelierBanner from '@/components/ParallaxAtelierBanner';
import TestimonialsShowcase from '@/components/TestimonialsShowcase';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF9F6] w-full max-w-full overflow-x-clip font-jost">
      {/* 1. Interactive Navigation Header (Gulmohar Cloned Jost Navigation + WhatsApp B2B Concierge) */}
      <Header
        onOpenStory={() => setIsStoryOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Story Viewer Modal */}
      <StoryViewerModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* 2. Hero Section: Auto-rotating High-Fashion Slideshow Carousel with WhatsApp Enquire CTA */}
      <HeroSection />

      {/* 3. 5 Mughal Arch Trust & Value Proposition Badges */}
      <TrustBadges />

      {/* 4. Architectural Jharokha Category Portals (3x2 Grid) */}
      <FeatureCategories />

      {/* 5. New Arrivals & Festive Drops Tabbed Runway Grid (3:4 Cards, In-Card Carousel, S-XXL Sizes) */}
      <ProductFitsGrid />

      {/* 6. Asymmetrical Editorial Banners (Shaadi Edit & Ritual Ready) */}
      <EditorialBanners />

      {/* 7. Shoppable 9:16 Video Reels Atelier */}
      <ShoppableReelsShowcase />

      {/* 8. Parallax Sanganer Workshop Media Spotlight */}
      <ParallaxAtelierBanner />

      {/* 9. Verified Boutique Buyer Testimonials & 4.9/5 Rating Showcase */}
      <TestimonialsShowcase />

      {/* 10. Rajasthani Palace Panorama Fresco Heritage Footer (Desktop & Mobile) */}
      <Footer />
    </main>
  );
}
