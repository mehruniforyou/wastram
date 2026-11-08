'use client';

import React from 'react';
import Link from 'next/link';
import WastramLogo from './WastramLogo';
import StoryRing from './StoryRing';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenDrawer: () => void;
  onOpenStory: () => void;
  onOpenSearch: () => void;
}

export default function Header({ onOpenDrawer, onOpenStory, onOpenSearch }: HeaderProps) {
  const { cartCount, wishlist, openCart } = useCart();
  const wishlistCount = wishlist.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#0B2D7F]/10 transition-all">
      {/* ============================================================== */}
      {/* DESKTOP HEADER (Screens >= 1024px)                             */}
      {/* ============================================================== */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 relative max-w-[1540px] mx-auto">
        {/* Left: Menu trigger & Wastram Official Gold Thread Logo */}
        <div className="flex items-center gap-4">
          {/* Authentic Menu capsule button */}
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-2 h-8 px-3.5 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] border border-[#D4AF37]/35 transition-all font-archivo text-[11px] font-medium shadow-xs"
            aria-label="Open Navigation Menu"
          >
            <div className="flex flex-col gap-0.5 w-3.5">
              <span className="w-full h-[1.5px] bg-white rounded-full" />
              <span className="w-full h-[1.5px] bg-white rounded-full" />
            </div>
            <span className="uppercase tracking-wider">Menu</span>
          </button>

          {/* Wastram Official Gold Thread Calligraphy Logo with Needle */}
          <Link href="/" className="flex items-center hover:opacity-95 transition-opacity pl-1" aria-label="Wastram Home">
            <WastramLogo className="h-9 w-auto" priority />
          </Link>
        </div>

        {/* Center: Minimalist Navigation Pills */}
        <div className="flex-1 flex justify-center px-4 overflow-hidden">
          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <Link
              href="/collections/western-dresses"
              className="h-7 px-3 rounded-full bg-white hover:bg-[#FAF9F6] transition-all flex items-center shadow-2xs border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[11px] font-semibold text-[#0B2D7F] whitespace-nowrap shrink-0"
            >
              Western Dresses <span className="ml-1 text-[#F58220]">✦</span>
            </Link>
            <Link
              href="/collections/denim-collection"
              className="h-7 px-3 rounded-full bg-white hover:bg-[#FAF9F6] transition-all flex items-center shadow-2xs border border-[#0B2D7F]/20 hover:border-[#D4AF37] text-[11px] font-bold text-[#0B2D7F] whitespace-nowrap shrink-0"
            >
              Denim Collection <span className="ml-1 text-[#D4AF37]">✦</span>
            </Link>
            <Link
              href="/collections/ethnic-wear-sets"
              className="h-7 px-3 rounded-full bg-white hover:bg-[#FAF9F6] transition-all flex items-center shadow-2xs border border-[#0B2D7F]/15 hover:border-[#D4AF37] text-[11px] font-semibold text-[#0B2D7F] whitespace-nowrap shrink-0"
            >
              Ethnic Wear Sets <span className="ml-1 text-[#D4AF37]">✦</span>
            </Link>
            <Link
              href="/collections/umbrella-dresses"
              className="h-7 px-3 rounded-full bg-white hover:bg-[#FAF9F6] transition-all flex items-center shadow-2xs border border-[#0B2D7F]/15 hover:border-[#D4AF37] text-[11px] font-semibold text-[#0B2D7F] whitespace-nowrap shrink-0"
            >
              Umbrella Dresses <span className="ml-1 text-[#D4AF37]">✦</span>
            </Link>
            <Link
              href="/collections/short-long-kaftan"
              className="h-7 px-3 rounded-full bg-white hover:bg-[#FAF9F6] transition-all flex items-center shadow-2xs border border-[#0B2D7F]/15 hover:border-[#D4AF37] text-[11px] font-semibold text-[#0B2D7F] whitespace-nowrap shrink-0"
            >
              Kaftans <span className="ml-1 text-[#D4AF37]">✦</span>
            </Link>
            <Link
              href="/collections/cord-sets"
              className="h-7 px-3 rounded-full bg-white hover:bg-[#FAF9F6] transition-all flex items-center shadow-2xs border border-[#0B2D7F]/15 hover:border-[#D4AF37] text-[11px] font-semibold text-[#0B2D7F] whitespace-nowrap shrink-0"
            >
              Co-ord Sets <span className="ml-1 text-[#D4AF37]">✦</span>
            </Link>
            <Link
              href="/collections/traditional-gowns"
              className="h-7 px-3 rounded-full bg-white hover:bg-[#FAF9F6] transition-all flex items-center shadow-2xs border border-[#0B2D7F]/15 hover:border-[#D4AF37] text-[11px] font-semibold text-[#0B2D7F] whitespace-nowrap shrink-0"
            >
              Traditional Gowns <span className="ml-1 text-[#D4AF37]">✦</span>
            </Link>
            <Link
              href="/collections/tops-shirts"
              className="h-7 px-3 rounded-full bg-white hover:bg-[#FAF9F6] transition-all flex items-center shadow-2xs border border-[#0B2D7F]/15 hover:border-[#D4AF37] text-[11px] font-semibold text-[#0B2D7F] whitespace-nowrap shrink-0"
            >
              Tops &amp; Shirts <span className="ml-1 text-[#D4AF37]">✦</span>
            </Link>
            <Link
              href="/collections/hoodies-sweatshirts"
              className="h-7 px-3 rounded-full bg-white hover:bg-[#FAF9F6] transition-all flex items-center shadow-2xs border border-[#0B2D7F]/15 hover:border-[#D4AF37] text-[11px] font-semibold text-[#0B2D7F] whitespace-nowrap shrink-0"
            >
              Hoodies &amp; Sweatshirts
            </Link>
            <Link
              href="/collections/t-shirts"
              className="h-7 px-3 rounded-full bg-white hover:bg-[#FAF9F6] transition-all flex items-center shadow-2xs border border-[#0B2D7F]/15 hover:border-[#D4AF37] text-[11px] font-semibold text-[#0B2D7F] whitespace-nowrap shrink-0"
            >
              T-Shirts
            </Link>
            <Link
              href="/collections/shop-all"
              className="h-7 px-3.5 rounded-full bg-[#0B2D7F]/5 hover:bg-[#0B2D7F]/10 transition-all flex items-center shadow-2xs border border-[#0B2D7F]/20 text-[11px] font-bold text-[#0B2D7F] whitespace-nowrap shrink-0"
            >
              All 1,400+ Styles
            </Link>
          </nav>
        </div>

        {/* Right: Story ring, Wishlist, Search, Account, Cart */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Instagram-style Story Ring with Wastram Craft Emblem */}
          <button
            onClick={onOpenStory}
            className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
            aria-label="View Stories"
          >
            <StoryRing size="w-8 h-8" />
          </button>

          {/* Official Wastram Bookmark Wishlist */}
          <Link
            href="/pages/swym-wishlist"
            className="relative p-1.5 text-[#0B2D7F] hover:text-[#F58220] transition-colors flex items-center justify-center"
            aria-label={`Wishlist (${wishlistCount})`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
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
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F58220] text-white text-[9px] font-bold flex items-center justify-center animate-heart-bounce shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors"
            aria-label="Search Catalog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* User Account */}
          <Link
            href="/pages/about-us"
            className="p-1.5 text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors"
            aria-label="Account Details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Cart Bag Pill */}
          <button
            onClick={openCart}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] border border-[#D4AF37]/35 transition-all font-archivo text-[11px] font-medium shadow-xs"
            aria-label="Shopping Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="font-bold">{cartCount}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HEADER (Screens < 1024px)                              */}
      {/* ============================================================== */}
      <div className="flex lg:hidden items-center justify-between px-3.5 py-2">
        {/* Left: Hamburger & Search */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDrawer}
            className="p-1.5 text-[#0B2D7F] focus:outline-none rounded-md hover:bg-[#0B2D7F]/5"
            aria-label="Open Mobile Menu"
          >
            <div className="flex flex-col gap-1 w-5">
              <span className="w-full h-0.5 bg-[#0B2D7F] rounded-full" />
              <span className="w-full h-0.5 bg-[#0B2D7F] rounded-full" />
            </div>
          </button>

          <button
            onClick={onOpenSearch}
            className="p-1.5 text-[#0B2D7F] focus:outline-none rounded-md hover:bg-[#0B2D7F]/5"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Center: Wastram Official Gold Thread Calligraphy Logo */}
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center py-0.5" aria-label="Wastram Home">
            <WastramLogo className="h-7 w-auto" priority />
          </Link>
        </div>

        {/* Right: Story ring, Wishlist bookmark, Cart bag */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStory}
            className="focus:outline-none"
            aria-label="View Stories"
          >
            <StoryRing size="w-7 h-7" />
          </button>

          <Link
            href="/pages/swym-wishlist"
            className="relative p-1 text-[#0B2D7F] hover:text-[#F58220]"
            aria-label={`Wishlist (${wishlistCount})`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
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
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#F58220] text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={openCart}
            className="relative p-1 text-[#0B2D7F]"
            aria-label="Shopping Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#0B2D7F] text-white text-[8px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
