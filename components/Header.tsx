'use client';

import React from 'react';
import Link from 'next/link';
import WastramLogo from './WastramLogo';
import StoryRing from './StoryRing';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenDrawer?: () => void;
  onOpenStory?: () => void;
  onOpenSearch?: () => void;
}

export default function Header({ onOpenDrawer, onOpenStory, onOpenSearch }: HeaderProps) {
  const { wishlist, openCart, openDrawer, openStory, openSearch, openB2BQuote } = useCart();
  const wishlistCount = wishlist.length;

  const handleOpenDrawer = onOpenDrawer || openDrawer;
  const handleOpenStory = onOpenStory || openStory;
  const handleOpenSearch = onOpenSearch || openSearch;
  const handleOpenQuote = openB2BQuote || openCart;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(11,45,127,0.03)] transition-all">
      {/* ============================================================== */}
      {/* DESKTOP HEADER (Screens >= 1024px)                             */}
      {/* ============================================================== */}
      <div className="hidden lg:flex items-center justify-between px-6 xl:px-10 py-2 max-w-7xl mx-auto gap-4 w-full">
        {/* Left: Artisan Stories Ring & Wastram Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center" title="Artisan Stories">
            <StoryRing onClick={handleOpenStory} size="w-12 h-12 xl:w-13 xl:h-13" />
          </div>

          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity pl-0.5" aria-label="Wastram Home">
            <WastramLogo className="h-9 xl:h-10 w-auto" priority />
          </Link>
        </div>

        {/* Center: Minimalist, elegant high-fashion typography navigation */}
        <nav className="flex items-center gap-5 xl:gap-7 justify-center flex-1 min-w-0 px-2 overflow-hidden">
          <Link
            href="/collections/western-dresses"
            className="text-[12px] xl:text-[13px] tracking-[0.12em] uppercase font-medium text-[#0B2D7F]/85 hover:text-[#0B2D7F] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
          >
            Western Dresses
          </Link>

          <Link
            href="/collections/denim-collection"
            className="text-[12px] xl:text-[13px] tracking-[0.12em] uppercase font-medium text-[#0B2D7F]/85 hover:text-[#0B2D7F] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
          >
            Denim
          </Link>

          <Link
            href="/collections/ethnic-wear-sets"
            className="text-[12px] xl:text-[13px] tracking-[0.12em] uppercase font-medium text-[#0B2D7F]/85 hover:text-[#0B2D7F] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
          >
            Ethnic Wear
          </Link>

          <Link
            href="/collections/umbrella-dresses"
            className="text-[12px] xl:text-[13px] tracking-[0.12em] uppercase font-medium text-[#0B2D7F]/85 hover:text-[#0B2D7F] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
          >
            Umbrella Dresses
          </Link>

          <Link
            href="/collections/cord-sets"
            className="hidden xl:inline-block text-[12px] xl:text-[13px] tracking-[0.12em] uppercase font-medium text-[#0B2D7F]/85 hover:text-[#0B2D7F] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
          >
            Co-ords
          </Link>

          <Link
            href="/collections/shop-all"
            className="text-[11px] xl:text-[12px] tracking-[0.15em] uppercase font-semibold px-3 py-1 rounded-full bg-[#0B2D7F]/5 hover:bg-[#0B2D7F]/10 text-[#0B2D7F] transition-colors whitespace-nowrap shrink-0"
          >
            Shop All
          </Link>
        </nav>

        {/* Right: Search, Saved Items, Boutique Inquiry Capsule */}
        <div className="flex items-center gap-2 xl:gap-3 shrink-0 ml-auto">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={handleOpenSearch}
            className="p-2 text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors rounded-full hover:bg-black/[0.03] cursor-pointer"
            aria-label="Search Catalog"
            title="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Official Wastram Bookmark Wishlist */}
          <Link
            href="/pages/swym-wishlist"
            className="relative p-2 text-[#0B2D7F] hover:text-[#F58220] transition-colors rounded-full hover:bg-black/[0.03] flex items-center justify-center cursor-pointer"
            aria-label={`Saved Styles (${wishlistCount})`}
            title="Saved Styles"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="18"
              viewBox="0 0 12.39 18.53"
              className="fill-none stroke-current"
            >
              <path
                id="savewishlist"
                strokeWidth="1.4"
                d="M0,2.28A2.28,2.28,0,0,1,2.28,0h7.829a2.28,2.28,0,0,1,2.28,2.28V17.716a.76.76,0,0,1-1.258.574L7.805 13.911a2.28 2.28 0 0 0 -2.438 0L1.258 18.29A.76.76 0 0 1 0 17.716Z"
              />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#F58220] text-white text-[9px] font-bold flex items-center justify-center animate-heart-bounce shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Boutique Inquiries Concierge Action */}
          <button
            type="button"
            onClick={handleOpenQuote}
            className="flex items-center gap-1.5 xl:gap-2 h-9 px-4 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-[11px] xl:text-[12px] font-medium uppercase tracking-[0.12em] shadow-soft hover:shadow-card shrink-0 cursor-pointer group"
            aria-label="Inquire for Boutiques"
            title="Boutique & Trade Inquiries"
          >
            <span>Inquire</span>
            <span className="text-[#F58220] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HEADER (Screens < 1024px)                               */}
      {/* ============================================================== */}
      <div className="flex lg:hidden items-center justify-between px-3 sm:px-4 py-2 w-full max-w-7xl mx-auto">
        {/* Left: Mobile Navigation Menu (Hamburger) & Search */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleOpenDrawer}
            className="p-1.5 text-[#0B2D7F] focus:outline-none rounded-full hover:bg-black/[0.03] transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
            title="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleOpenSearch}
            className="p-1.5 text-[#0B2D7F] focus:outline-none rounded-full hover:bg-black/[0.03] transition-colors cursor-pointer"
            aria-label="Search Catalog"
            title="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Center: Wastram Official Logomark & Gold Thread Calligraphy Logo */}
        <div className="flex-1 flex items-center justify-center px-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2">
            <StoryRing onClick={handleOpenStory} size="w-9 h-9 sm:w-10 sm:h-10" />
            <Link href="/" className="flex items-center py-0.5 hover:opacity-90 transition-opacity" aria-label="Wastram Home">
              <WastramLogo className="h-7 sm:h-8 w-auto" priority />
            </Link>
          </div>
        </div>

        {/* Right: Saved Styles & Inquire Capsule */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/pages/swym-wishlist"
            className="relative p-1.5 text-[#0B2D7F] hover:text-[#F58220] transition-colors cursor-pointer"
            aria-label={`Saved Styles (${wishlistCount})`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="18"
              viewBox="0 0 12.39 18.53"
              className="fill-none stroke-current"
            >
              <path
                id="savewishlist"
                strokeWidth="1.3"
                d="M0,2.28A2.28,2.28,0,0,1,2.28,0h7.829a2.28,2.28,0,0,1,2.28,2.28V17.716a.76.76,0,0,1-1.258.574L7.805 13.911a2.28 2.28 0 0 0 -2.438 0L1.258 18.29A.76.76 0 0 1 0 17.716Z"
              />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#F58220] text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Inquire Action on Mobile */}
          <button
            type="button"
            onClick={handleOpenQuote}
            className="flex items-center gap-1 h-8 px-2.5 sm:px-3 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all cursor-pointer shadow-soft text-[11px] font-medium uppercase tracking-wider active:scale-95"
            aria-label="Inquire for Boutiques"
            title="Boutique Inquiries"
          >
            <span>Inquire</span>
          </button>
        </div>
      </div>
    </header>
  );
}
