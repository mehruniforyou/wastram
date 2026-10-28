'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopularSearches from '@/components/PopularSearches';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';

export default function FaqsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How long does shipping take?',
      a: 'Orders are processed and dispatched within 24 to 48 business hours. Delivery typically takes 3 to 5 business days for major Indian metros, and 4 to 7 days for regional locations. International express delivery takes 5 to 9 business days.'
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer a 7-day hassle-free return and exchange window from the date of delivery. Items must be unworn, unwashed, and in original packaging with tags intact. You can initiate a return or exchange online through our quick return portal.'
    },
    {
      q: 'How do I choose the right size?',
      a: 'Our garments follow standard Indian sizing (XS to XXL). If you are between sizes, we recommend sizing up for regular comfortable straight-fit kurtis, or choosing your true size for corset boned styles with adjustable back tie-ups.'
    },
    {
      q: 'Are the fabrics 100% natural and handcrafted?',
      a: 'Yes! We pride ourselves on authentic Indian hand-block printing, vegetable dyes, pure cotton mulmul, cambric, and chanderi silks. Each piece is crafted by experienced artisans, making each garment uniquely special.'
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across serviceable pin codes in India. Prepaid orders also qualify for automated instant discounts and express priority dispatch.'
    }
  ];

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

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20 flex-1 font-archivo text-[#482922]">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#FF2F00] font-bold">
            Customer Support
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-black/60 mt-2">
            Everything you need to know about ordering, sizing, shipping, and care.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/5 divide-y divide-black/10">
          {faqs.map((faq, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between text-left font-bold text-sm text-[#482922]"
              >
                <span>{faq.q}</span>
                <span className="text-base text-[#482922]/70 font-mono">
                  {openIdx === i ? '−' : '+'}
                </span>
              </button>
              {openIdx === i && (
                <p className="mt-2 text-xs text-black/70 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <PopularSearches />
    </div>
  );
}
