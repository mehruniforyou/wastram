'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenDrawer?: () => void;
  onOpenStory?: () => void;
  onOpenSearch?: () => void;
}

export default function Header({ onOpenDrawer, onOpenStory, onOpenSearch }: HeaderProps) {
  const { wishlist, openCart, openDrawer, openStory, openSearch, openB2BQuote } = useCart();
  const wishlistCount = wishlist.length;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenDrawer = onOpenDrawer || openDrawer;
  const handleOpenStory = onOpenStory || openStory;
  const handleOpenSearch = onOpenSearch || openSearch;
  const handleOpenQuote = openB2BQuote || openCart;

  return (
    <header
      id="SiteHeader"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF9F6]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(11,45,127,0.06)] border-b border-[#0B2D7F]/10 py-1.5'
          : 'bg-[#FAF9F6] border-b border-[#0B2D7F]/5 py-2.5'
      }`}
    >
      {/* ============================================================== */}
      {/* DESKTOP HEADER (Screens >= 1024px)                             */}
      {/* ============================================================== */}
      <div className="hidden lg:flex items-center justify-between px-4 sm:px-6 xl:px-8 max-w-[1540px] mx-auto gap-2 xl:gap-4 w-full">
        {/* Left: Unified Brand Lockup (Logomark and Wordmark on Shared Horizontal Median) */}
        <div className="flex items-center gap-2 xl:gap-3 shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 xl:gap-3 group select-none py-1 transition-opacity hover:opacity-90 shrink-0"
            aria-label="Wastram Atelier Home"
          >
            {/* Logomark (Emblem) */}
            <div className="w-10 h-10 xl:w-11.5 xl:h-11.5 shrink-0 flex items-center justify-center">
              <picture className="w-full h-full flex items-center justify-center">
                <source srcSet="/images/brand/wastram-craft-emblem-hd.webp" type="image/webp" />
                <img
                  src="/images/brand/wastram-craft-emblem-hd.png"
                  alt="Wastram Logomark"
                  className="w-full h-full object-contain filter drop-shadow-[0_1px_3px_rgba(11,45,127,0.08)] group-hover:scale-104 transition-transform duration-300 block"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>

            {/* Wordmark (Calligraphy "Wastram" with golden needle) */}
            <div className="flex items-center justify-center shrink-0">
              <img
                src="/images/brand/wastram-header-logo-trimmed.png"
                alt="Wastram"
                className="h-7.5 md:h-8.5 xl:h-9 w-auto object-contain block group-hover:opacity-95 transition-opacity"
                loading="eager"
                decoding="async"
              />
            </div>
          </Link>

          {/* Technical Artisan Stories Quick Trigger (Visible on extra-wide screens) */}
          <button
            type="button"
            onClick={handleOpenStory}
            className="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 hover:bg-white border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#0B2D7F] hover:text-[#4A7BC6] transition-all shadow-2xs hover:shadow-soft cursor-pointer group shrink-0"
            title="Watch Jaipur Artisan Stories"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>Stories</span>
          </button>
        </div>

        {/* Center: Minimalist, Technical Caps-Letter-Spacing Navigation (NO overflow cutting) */}
        <nav className="flex items-center gap-2 sm:gap-3 xl:gap-5 2xl:gap-6 justify-center flex-1 px-1">
          <Link
            href="/collections/western-dresses"
            className="text-[11px] xl:text-[12px] 2xl:text-[12.5px] tracking-[0.08em] xl:tracking-[0.12em] uppercase font-medium text-[#0B2D7F]/85 hover:text-[#0B2D7F] transition-colors relative py-1 px-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
          >
            Western Dresses
          </Link>

          <Link
            href="/collections/denim-collection"
            className="text-[11px] xl:text-[12px] 2xl:text-[12.5px] tracking-[0.08em] xl:tracking-[0.12em] uppercase font-medium text-[#0B2D7F]/85 hover:text-[#0B2D7F] transition-colors relative py-1 px-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
          >
            Denim
          </Link>

          <Link
            href="/collections/ethnic-wear-sets"
            className="text-[11px] xl:text-[12px] 2xl:text-[12.5px] tracking-[0.08em] xl:tracking-[0.12em] uppercase font-medium text-[#0B2D7F]/85 hover:text-[#0B2D7F] transition-colors relative py-1 px-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
          >
            Ethnic Wear
          </Link>

          <Link
            href="/collections/umbrella-dresses"
            className="text-[11px] xl:text-[12px] 2xl:text-[12.5px] tracking-[0.08em] xl:tracking-[0.12em] uppercase font-medium text-[#0B2D7F]/85 hover:text-[#0B2D7F] transition-colors relative py-1 px-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
          >
            Umbrella Dresses
          </Link>

          <Link
            href="/collections/cord-sets"
            className="hidden xl:inline-block text-[11px] xl:text-[12px] 2xl:text-[12.5px] tracking-[0.08em] xl:tracking-[0.12em] uppercase font-medium text-[#0B2D7F]/85 hover:text-[#0B2D7F] transition-colors relative py-1 px-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap shrink-0"
          >
            Co-ords
          </Link>

          <Link
            href="/collections/shop-all"
            className="text-[10.5px] xl:text-[11.5px] tracking-[0.12em] uppercase font-semibold px-2.5 xl:px-3 py-1 rounded-full bg-[#0B2D7F]/5 hover:bg-[#0B2D7F]/10 text-[#0B2D7F] transition-colors whitespace-nowrap shrink-0 ml-0.5"
          >
            Shop All
          </Link>
        </nav>

        {/* Right: Technical Minimalist Search, Saved Items, Boutique Inquiry Capsule */}
        <div className="flex items-center gap-1.5 xl:gap-2.5 shrink-0">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={handleOpenSearch}
            className="p-1.5 xl:p-2 text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors rounded-full hover:bg-black/[0.03] cursor-pointer"
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
            className="relative p-1.5 xl:p-2 text-[#0B2D7F] hover:text-[#F58220] transition-colors rounded-full hover:bg-black/[0.03] flex items-center justify-center cursor-pointer"
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
            className="flex items-center gap-1.5 h-8.5 xl:h-9 px-3 xl:px-4 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-[10.5px] xl:text-[11.5px] font-medium uppercase tracking-[0.12em] shadow-soft hover:shadow-card shrink-0 cursor-pointer group"
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
      <div className="flex lg:hidden items-center justify-between px-3 sm:px-4 w-full max-w-7xl mx-auto">
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

        {/* Center: Wastram Official Logomark & Wordmark on Shared Horizontal Median */}
        <div className="flex-1 flex items-center justify-center px-1 min-w-0 overflow-hidden">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity py-0.5" aria-label="Wastram Home">
            <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 shrink-0 flex items-center justify-center">
              <picture className="w-full h-full flex items-center justify-center">
                <source srcSet="/images/brand/wastram-craft-emblem-hd.webp" type="image/webp" />
                <img
                  src="/images/brand/wastram-craft-emblem-hd.png"
                  alt="Wastram Logomark"
                  className="w-full h-full object-contain block"
                  loading="eager"
                />
              </picture>
            </div>
            <div className="flex items-center justify-center shrink-0">
              <img
                src="/images/brand/wastram-header-logo-trimmed.png"
                alt="Wastram"
                className="h-6.5 sm:h-7.5 w-auto object-contain block"
                loading="eager"
              />
            </div>
          </Link>
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
