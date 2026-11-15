'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import SearchModal from '@/components/SearchModal';
import StyleHubHero from '@/components/StyleHubHero';
import StyleHubCategories from '@/components/StyleHubCategories';
import StyleHubNewArrivals from '@/components/StyleHubNewArrivals';
import StyleHubTrending from '@/components/StyleHubTrending';
import StyleHubPromoBanner from '@/components/StyleHubPromoBanner';
import StyleHubBestSellers from '@/components/StyleHubBestSellers';
import StyleHubEditorsCut from '@/components/StyleHubEditorsCut';
import StyleHubMarquee from '@/components/StyleHubMarquee';
import StyleHubOffers from '@/components/StyleHubOffers';
import StyleHubGallery from '@/components/StyleHubGallery';
import StyleHubReviews from '@/components/StyleHubReviews';
import StyleHubVisit from '@/components/StyleHubVisit';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[#0B2D7F] selection:text-white">
      {/* 1. StyleHub Fixed Navbar with Top Bar, Wishlist, Theme Toggle & Admin Link */}
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      {/* 2. Main Content Container (pt-24 md:pt-28 to offset fixed header) */}
      <main className="flex-1 pt-24 md:pt-28" data-testid="public-main">
        {/* Section 1: Editorial Split Hero */}
        <StyleHubHero />

        {/* Section 2: Explore by Category (6-Column Grid) */}
        <StyleHubCategories />

        {/* Section 3: New Arrivals (Asymmetric Grid, Sole WhatsApp Enquire Action) */}
        <StyleHubNewArrivals />

        {/* Section 4: Trending Now (4-Column Grid, Sole WhatsApp Enquire Action) */}
        <StyleHubTrending />

        {/* Section 5 & 6: Featured Offer Editorial 21:9 Promo Banner */}
        <StyleHubPromoBanner />

        {/* Section 7: Best Sellers (Wardrobe Cornerstones Grid) */}
        <StyleHubBestSellers />

        {/* Section 8: Editor's Cut (Horizontal Snap Carousel) */}
        <StyleHubEditorsCut />

        {/* Section 9: Infinite Craft & Handloom Marquee Ticker */}
        <StyleHubMarquee />

        {/* Section 10: Boutique Offers & Wholesale Sourcing Terms */}
        <StyleHubOffers />

        {/* Section 11: Inside the Atelier Gallery */}
        <StyleHubGallery />

        {/* Section 12: Patron Testimonials & Reviews */}
        <StyleHubReviews />

        {/* Section 13: Visit The Jaipur Atelier & Appointment Booking */}
        <StyleHubVisit />
      </main>

      {/* 3. StyleHub Luxury Footer with Royal Fresco Heritage Background */}
      <Footer />

      {/* 4. Floating WhatsApp Atelier Concierge Button */}
      <FloatingWhatsApp />

      {/* 5. Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
