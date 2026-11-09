'use client';

import React from 'react';
import Link from 'next/link';
import WastramLogo from './WastramLogo';
import StoryRing from './StoryRing';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenStory?: () => void;
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenStory,
}: MobileNavDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-[85%] max-w-[360px] h-full bg-[#FAF9F6] shadow-2xl z-10 flex flex-col overflow-y-auto no-scrollbar">
        {/* Header with logo & close */}
        <div className="flex items-center justify-between p-4 bg-white">
          <Link href="/" onClick={onClose} className="flex items-center" aria-label="Wastram Home">
            <WastramLogo className="h-7 w-auto" priority />
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#0B2D7F]"
            aria-label="Close Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Artisan Craft Stories Card */}
        {onOpenStory && (
          <div
            onClick={() => {
              onClose();
              onOpenStory();
            }}
            className="mx-3.5 mt-3 p-2.5 rounded-xl bg-gradient-to-r from-white to-[#F4A7B7]/15 border border-[#D4AF37]/35 flex items-center gap-3 cursor-pointer hover:shadow-xs transition-shadow"
          >
            <StoryRing size="w-9 h-9" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0B2D7F]">Artisan Craft Stories</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#F58220]/15 text-[#F58220] font-bold">WATCH</span>
              </div>
              <p className="text-[10px] text-[#0B2D7F]/70 truncate">Handcrafted Jaipur heritage &amp; stitching</p>
            </div>
            <span className="text-[#D4AF37] text-xs font-bold">&rarr;</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="px-3.5 py-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-full bg-white border border-[#0B2D7F]/15 text-xs font-archivo text-[#0B2D7F]/80 shadow-2xs hover:border-[#D4AF37] transition-colors"
          >
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-[#0B2D7F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search 1,400+ styles...</span>
            </span>
            <span className="text-[10px] text-[#D4AF37] font-bold uppercase">Search</span>
          </button>
        </div>

        {/* Category Navigation Links */}
        <div className="flex-1 px-4 py-2 flex flex-col font-archivo">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#0B2D7F]/60 mb-2 px-1">
            Collections &amp; Categories
          </p>

          <nav className="flex flex-col space-y-1">
            <Link
              href="/collections/shop-all"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-bold text-[#0B2D7F] bg-[#0B2D7F]/5 hover:bg-[#0B2D7F]/10 transition-colors"
            >
              <span>All 1,400+ Styles</span>
              <span className="text-[10px] text-[#D4AF37] font-bold">Explore &rarr;</span>
            </Link>

            <Link
              href="/collections/western-dresses"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-[#0B2D7F] hover:bg-[#0B2D7F]/5 transition-colors"
            >
              <span>Western Dresses</span>
              <span className="text-[10px] text-[#0B2D7F]/50">300+</span>
            </Link>

            <Link
              href="/collections/denim-collection"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-bold text-[#0B2D7F] bg-[#FAF9F6] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all"
            >
              <span className="flex items-center gap-1.5">
                <span>Denim Collection</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#F58220]/15 text-[#F58220] font-bold">NEW</span>
              </span>
              <span className="text-[10px] text-[#0B2D7F]/70 font-semibold">140+ Styles</span>
            </Link>

            <Link
              href="/collections/ethnic-wear-sets"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-[#0B2D7F] hover:bg-[#0B2D7F]/5 transition-colors"
            >
              <span>Ethnic Wear Sets</span>
              <span className="text-[10px] text-[#0B2D7F]/50">250+</span>
            </Link>

            <Link
              href="/collections/umbrella-dresses"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-[#0B2D7F] hover:bg-[#0B2D7F]/5 transition-colors"
            >
              <span>Umbrella Dresses</span>
              <span className="text-[10px] text-[#0B2D7F]/50">270+</span>
            </Link>

            <Link
              href="/collections/short-long-kaftan"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-[#0B2D7F] hover:bg-[#0B2D7F]/5 transition-colors"
            >
              <span>Short &amp; Long Kaftans</span>
              <span className="text-[10px] text-[#0B2D7F]/50">180+</span>
            </Link>

            <Link
              href="/collections/cord-sets"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-[#0B2D7F] hover:bg-[#0B2D7F]/5 transition-colors"
            >
              <span>Co-ord Sets</span>
              <span className="text-[10px] text-[#0B2D7F]/50">120+</span>
            </Link>

            <Link
              href="/collections/traditional-gowns"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-[#0B2D7F] hover:bg-[#0B2D7F]/5 transition-colors"
            >
              <span>Traditional Gowns</span>
              <span className="text-[10px] text-[#0B2D7F]/50">100+</span>
            </Link>

            <Link
              href="/collections/tops-shirts"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-[#0B2D7F] hover:bg-[#0B2D7F]/5 transition-colors"
            >
              <span>Tops &amp; Shirts</span>
              <span className="text-[10px] text-[#0B2D7F]/50">90+</span>
            </Link>

            <Link
              href="/collections/hoodies-sweatshirts"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-[#0B2D7F] hover:bg-[#0B2D7F]/5 transition-colors"
            >
              <span>Hoodies &amp; Sweatshirts</span>
              <span className="text-[10px] text-[#0B2D7F]/50">40+</span>
            </Link>

            <Link
              href="/collections/t-shirts"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-semibold text-[#0B2D7F] hover:bg-[#0B2D7F]/5 transition-colors"
            >
              <span>T-Shirts</span>
              <span className="text-[10px] text-[#0B2D7F]/50">60+</span>
            </Link>
          </nav>

          {/* B2B Wholesale Banner */}
          <div className="mt-4 p-3 rounded-xl bg-white border border-[#D4AF37]/35 shadow-2xs">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] animate-pulse" />
              <span className="text-[11px] font-bold text-[#0B2D7F] uppercase tracking-wider">
                Direct B2B Export Quotes
              </span>
            </div>
            <p className="text-[10px] text-[#0B2D7F]/75 mb-2">
              Competitive FOB &amp; CIF wholesale rates for worldwide boutique buyers.
            </p>
            <Link
              href="/pages/contact"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B2D7F] hover:text-[#4A7BC6] underline decoration-[#D4AF37]"
            >
              <span>Request Wholesale Quotation</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Footer Support Desk */}
        <div className="p-4 bg-white font-archivo text-xs flex flex-col gap-2">
          <div className="flex items-center justify-between text-[#0B2D7F]/80">
            <span>Customer Care:</span>
            <a href="tel:+918003088838" className="font-semibold text-[#0B2D7F]">+91 80030 88838</a>
          </div>
          <div className="flex items-center justify-between text-[#0B2D7F]/80">
            <span>WhatsApp Support:</span>
            <a href="https://wa.me/918003088838" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-700">Chat Now</a>
          </div>
          <div className="flex items-center justify-between text-[#0B2D7F]/70 pt-2 text-[11px]">
            <Link href="/pages/faqs" onClick={onClose} className="hover:text-[#0B2D7F]">FAQs</Link>
            <Link href="/pages/about-us" onClick={onClose} className="hover:text-[#0B2D7F]">Our Story</Link>
            <Link href="/pages/contact" onClick={onClose} className="hover:text-[#0B2D7F]">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
