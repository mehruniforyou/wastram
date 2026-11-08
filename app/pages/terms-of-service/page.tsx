'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopularSearches from '@/components/PopularSearches';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';

export default function TermsOfServicePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
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

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 flex-1 font-archivo text-[#0B2D7F]">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#F58220] font-bold">
            Legal &amp; Compliance
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1">
            Terms of Service
          </h1>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-black/5 space-y-5 text-xs md:text-sm text-black/80 leading-relaxed">
          <h3 className="text-base font-bold text-[#0B2D7F]">1. Introduction</h3>
          <p>
            This website is operated by <strong>Wastram Pvt Ltd</strong> (Malad West, Mumbai). Throughout the site, the terms &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to Wastram. By visiting our site and/or purchasing from us, you engage in our &ldquo;Service&rdquo; and agree to be bound by these terms.
          </p>
          <h3 className="text-base font-bold text-[#0B2D7F]">2. Handcrafted Variations</h3>
          <p>
            Because our apparel features authentic Indian block printing and natural dyeing processes, subtle variations in print, hue, and motif placement are intrinsic hallmarks of artisanal craftsmanship and are not considered manufacturing defects.
          </p>
          <h3 className="text-base font-bold text-[#0B2D7F]">3. Pricing &amp; Modifications</h3>
          <p>
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue any product or service without prior liability.
          </p>
          <h3 className="text-base font-bold text-[#0B2D7F]">4. Governing Law</h3>
          <p>
            These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of India, under the jurisdiction of the courts of Mumbai, Maharashtra.
          </p>
        </div>
      </main>

      <Footer />
      <PopularSearches />
    </div>
  );
}
