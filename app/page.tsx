'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import SearchModal from '@/components/SearchModal';
import BaisaHero from '@/components/BaisaHero';
import BaisaCategoryTiles from '@/components/BaisaCategoryTiles';
import BaisaBestsellers from '@/components/BaisaBestsellers';
import BaisaMarquee from '@/components/BaisaMarquee';
import BaisaChapters from '@/components/BaisaChapters';
import BaisaServicesGrid from '@/components/BaisaServicesGrid';
import BaisaUnder1000 from '@/components/BaisaUnder1000';
import BaisaReels from '@/components/BaisaReels';
import BaisaFactoryStats from '@/components/BaisaFactoryStats';
import BaisaWholesaleBanner from '@/components/BaisaWholesaleBanner';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FCFBF7] dark:bg-[#0E0C0A] text-foreground flex flex-col font-sans selection:bg-[#0B2D7F] selection:text-white">
      {/* 1. Header with Announcement Bar, Mega Menu, Concierge, Cart & Mobile Drawer */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* 2. Main Content Container (pt-24 to offset sticky header) */}
      <main className="flex-1 pt-24 md:pt-28" data-testid="public-main">
        {/* Section 1: Editorial Split Hero */}
        <BaisaHero />

        {/* Section 2: "Find your next outfit" 8-tile category grid */}
        <BaisaCategoryTiles />

        {/* Section 3: "Ordered most, month after month" Bestsellers Snap Carousel */}
        <BaisaBestsellers />

        {/* Section 4: "Wastram in Brief" Continuous Marquee Ribbon */}
        <BaisaMarquee />

        {/* Section 5: "The Chapters" with Authentic Rajasthani Arch Doorway Frames */}
        <BaisaChapters />

        {/* Section 6: "Your outfit, your way" 4-Service Cards */}
        <BaisaServicesGrid />

        {/* Section 7: "Under ₹1,000" Starter Edit */}
        <BaisaUnder1000 />

        {/* Section 8: "In Motion" Vertical 9:16 Reels & Fabric Movement */}
        <BaisaReels />

        {/* Section 9: "The Craft & Factory Direct" Stats Ribbon, Trust Badges & Ordering Timeline */}
        <BaisaFactoryStats />

        {/* Section 10: Worldwide Boutique Wholesale & Trade Authority Banner */}
        <BaisaWholesaleBanner />
      </main>

      {/* 3. Luxury Heritage Fresco Footer (Line-free, Unblurred, High-Res WebP) */}
      <Footer />

      {/* 4. Slide-out "Your Bag" Cart Drawer */}
      <CartDrawer />

      {/* 5. Interactive Size Guide Modal (XS–8XL) */}
      <SizeGuideModal />

      {/* 6. Floating WhatsApp Concierge Button */}
      <FloatingWhatsApp />

      {/* 7. Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
