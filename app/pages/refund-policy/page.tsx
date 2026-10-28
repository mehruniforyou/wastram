'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopularSearches from '@/components/PopularSearches';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';

export default function RefundPolicyPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <StoryViewerModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 flex-1 font-archivo text-[#482922]">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#FF2F00] font-bold">
            Customer Guarantee
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1">
            Shipping &amp; Return Policy
          </h1>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-black/5 space-y-6 text-xs md:text-sm text-black/80 leading-relaxed">
          <h3 className="text-base font-bold text-[#482922]">Shipping Information</h3>
          <p>
            At Nishorama, we strive to deliver your orders promptly and securely. All domestic orders within India are dispatched within 24–48 hours of order confirmation. We partner with leading courier providers including Bluedart, Delhivery, and DTDC.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Standard Domestic Delivery: 3 to 5 business days</li>
            <li>Free Shipping on all orders above ₹2,999</li>
            <li>Tracking link sent via SMS and Email upon dispatch</li>
          </ul>

          <h3 className="text-base font-bold text-[#482922] pt-4 border-t border-black/10">7-Day Easy Returns &amp; Exchanges</h3>
          <p>
            We want you to love your Nishorama pieces. If you are not completely satisfied with your purchase, you can request an exchange or return within <strong>7 days</strong> of product delivery.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Garments must be unused, unwashed, and with all original tags attached.</li>
            <li>Reverse pickup will be arranged from your doorstep.</li>
            <li>Refunds for approved returns are processed back to the original payment method within 5–7 banking days.</li>
          </ul>
        </div>
      </main>

      <Footer />
      <PopularSearches />
    </div>
  );
}
