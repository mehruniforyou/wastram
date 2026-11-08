'use client';

import React from 'react';
import Link from 'next/link';
import WastramLogo from './WastramLogo';
import StoryRing from './StoryRing';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenDrawer?: () => void;
  onOpenStory: () => void;
  onOpenSearch: () => void;
}

export default function Header({ onOpenStory, onOpenSearch }: HeaderProps) {
  const { cartCount, wishlist, openCart } = useCart();
  const wishlistCount = wishlist.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#0B2D7F]/10 transition-all shadow-2xs">
      {/* ============================================================== */}
      {/* DESKTOP HEADER (Screens >= 1024px)                             */}
      {/* ============================================================== */}
      <div className="hidden lg:flex items-center justify-between px-4 sm:px-6 xl:px-8 py-3 lg:py-3.5 relative max-w-[1540px] mx-auto gap-3 xl:gap-5 w-full">
        {/* Left: Artisan Stories Ring (replaces menu icon) & Wastram Official Logo */}
        <div className="flex items-center gap-3 lg:gap-3.5 shrink-0">
          <div className="flex items-center">
            <StoryRing onClick={onOpenStory} size="w-9 h-9" />
          </div>

          {/* Wastram Official Gold Thread Calligraphy Logo (Bigger & Balanced) */}
          <Link href="/" className="flex items-center hover:opacity-95 transition-opacity pl-1" aria-label="Wastram Home">
            <WastramLogo className="h-10 lg:h-11 w-auto" priority />
          </Link>
        </div>

        {/* Center: Curated, balanced primary navigation links with responsive spacing */}
        <nav className="flex items-center gap-3 lg:gap-4 xl:gap-6 justify-center flex-1 min-w-0 px-2">
          <Link
            href="/collections/western-dresses"
            className="text-[12px] xl:text-[13px] font-semibold text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap"
          >
            Western Dresses
          </Link>
          <Link
            href="/collections/denim-collection"
            className="text-[12px] xl:text-[13px] font-semibold text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors relative py-1 flex items-center gap-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap"
          >
            <span>Denim Collection</span>
            <span className="text-[8px] xl:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#F58220]/15 text-[#F58220]">New</span>
          </Link>
          <Link
            href="/collections/ethnic-wear-sets"
            className="text-[12px] xl:text-[13px] font-semibold text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap"
          >
            Ethnic Wear
          </Link>
          <Link
            href="/collections/umbrella-dresses"
            className="text-[12px] xl:text-[13px] font-semibold text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap"
          >
            Umbrella Dresses
          </Link>
          <Link
            href="/collections/cord-sets"
            className="hidden xl:inline-block text-[12px] xl:text-[13px] font-semibold text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap"
          >
            Co-ord Sets
          </Link>
          <Link
            href="/collections/short-long-kaftan"
            className="hidden 2xl:inline-block text-[12px] xl:text-[13px] font-semibold text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap"
          >
            Kaftans
          </Link>
          <Link
            href="/collections/shop-all"
            className="text-[11px] xl:text-[12px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-[#0B2D7F]/5 hover:bg-[#0B2D7F]/10 text-[#0B2D7F] border border-[#0B2D7F]/15 transition-all whitespace-nowrap"
          >
            All Styles
          </Link>
        </nav>

        {/* Right: Search, Wishlist, Cart (Guaranteed 100% visible, shrink-0) */}
        <div className="flex items-center gap-2.5 xl:gap-3.5 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 xl:p-2 text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors rounded-full hover:bg-[#0B2D7F]/5 cursor-pointer"
            aria-label="Search Catalog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Official Wastram Bookmark Wishlist */}
          <Link
            href="/pages/swym-wishlist"
            className="relative p-1.5 xl:p-2 text-[#0B2D7F] hover:text-[#F58220] transition-colors rounded-full hover:bg-[#0B2D7F]/5 flex items-center justify-center cursor-pointer"
            aria-label={`Wishlist (${wishlistCount})`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="20"
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
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#F58220] text-white text-[9px] font-bold flex items-center justify-center animate-heart-bounce shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Bag Capsule - Guaranteed visible with shrink-0 */}
          <button
            onClick={openCart}
            className="flex items-center gap-1.5 xl:gap-2 h-9 px-3.5 xl:px-4 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] border border-[#D4AF37]/35 transition-all font-archivo text-[11px] xl:text-[12px] font-medium shadow-xs shrink-0 cursor-pointer"
            aria-label="Shopping Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="font-bold">{cartCount}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HEADER (Screens < 1024px)                               */}
      {/* ============================================================== */}
      <div className="flex lg:hidden items-center justify-between px-3.5 sm:px-5 py-2.5 sm:py-3 w-full">
        {/* Left: Artisan Stories Ring (replaces menu icon) & Search */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="flex items-center">
            <StoryRing onClick={onOpenStory} size="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <button
            onClick={onOpenSearch}
            className="p-1.5 text-[#0B2D7F] focus:outline-none rounded-full hover:bg-[#0B2D7F]/5 transition-colors cursor-pointer"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Center: Wastram Official Gold Thread Calligraphy Logo */}
        <div className="flex-1 flex items-center justify-center px-1 min-w-0 overflow-hidden">
          <Link href="/" className="flex items-center py-0.5" aria-label="Wastram Home">
            <WastramLogo className="h-8 sm:h-9 w-auto" priority />
          </Link>
        </div>

        {/* Right: Wishlist & Cart (Guaranteed 100% visible, shrink-0) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            href="/pages/swym-wishlist"
            className="relative p-1.5 text-[#0B2D7F] hover:text-[#F58220] transition-colors cursor-pointer"
            aria-label={`Wishlist (${wishlistCount})`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="19"
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

          <button
            onClick={openCart}
            className="relative p-1.5 text-[#0B2D7F] cursor-pointer"
            aria-label="Shopping Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0B2D7F] text-white text-[8px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
