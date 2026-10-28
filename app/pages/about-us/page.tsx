'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopularSearches from '@/components/PopularSearches';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';

export default function AboutUsPage() {
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
            We Are Nishorama
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1">
            Our Story
          </h1>
          <p className="text-sm font-serif italic text-black/60 mt-2">
            &ldquo; YOU know where to GET IT &rdquo;
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-black/5 space-y-6 text-sm leading-relaxed text-black/80">
          <p>
            Welcome to <strong>Nishorama</strong> — an Indian fashion and apparel label born from a passion for handcrafted textile traditions reimagined with sleek modern tailoring.
          </p>
          <p>
            From our artisan clusters in Rajasthan and Mumbai, we celebrate age-old Indian crafts such as authentic Dabu mud-resist printing, Bagru botanical dyeing, delicate Chikankari embroidery, and fine cotton mulmul weaves. Our collections seamlessly bridge everyday versatility with head-turning festive silhouettes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/5 text-center">
              <span className="text-2xl font-black text-[#FF2F00]">100%</span>
              <p className="text-xs font-semibold mt-1">Artisanal Cotton &amp; Silk</p>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/5 text-center">
              <span className="text-2xl font-black text-[#FF2F00]">Handcrafted</span>
              <p className="text-xs font-semibold mt-1">Made by Master Artisans</p>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/5 text-center">
              <span className="text-2xl font-black text-[#FF2F00]">Worldwide</span>
              <p className="text-xs font-semibold mt-1">Pan-India &amp; Global Shipping</p>
            </div>
          </div>
          <p>
            Whether you are looking for our signature halterneck corset kurtis, flared skirt sets, or comfortable wide-leg linen pants, Nishorama delivers uncompromised comfort, flattering fits, and unmatched elegance.
          </p>
        </div>
      </main>

      <Footer />
      <PopularSearches />
    </div>
  );
}
