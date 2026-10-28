'use client';

import React from 'react';
import Link from 'next/link';
import NishoramaLogo from './NishoramaLogo';
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
    <header className="sticky top-0 z-40 w-full bg-[#F5F5F5]/90 backdrop-blur-md border-b border-black/5 transition-all">
      {/* ============================================================== */}
      {/* DESKTOP HEADER (Screens >= 1024px)                             */}
      {/* ============================================================== */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2.5 relative max-w-[1500px] mx-auto">
        {/* Left: Menu trigger & Logo */}
        <div className="flex items-center gap-4">
          {/* Authentic Menu capsule button */}
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-2 h-7 px-3 rounded-full bg-[#482922] text-white hover:bg-[#38201a] transition-all font-archivo text-[11px] font-medium shadow-xs"
            aria-label="Open Navigation Menu"
          >
            <div className="flex flex-col gap-0.5 w-3.5">
              <span className="w-full h-[1.5px] bg-white rounded-full" />
              <span className="w-full h-[1.5px] bg-white rounded-full" />
            </div>
            <span className="uppercase tracking-wider">Menu</span>
          </button>

          {/* Nishorama Wordmark */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity pl-2">
            <NishoramaLogo className="h-6 w-auto" color="#482922" />
          </Link>
        </div>

        {/* Center: Navigation Pill Links & Tagline */}
        <div className="flex flex-col items-center">
          <nav className="flex items-center gap-1.5 font-archivo text-xs font-medium text-[#482922]">
            <Link
              href="/collections/new-in"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              New in
            </Link>
            <Link
              href="/collections/shop-all"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              Shop All
            </Link>
            <Link
              href="/collections/kurtis"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              Kurtis
            </Link>
            <Link
              href="/collections/trending"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              <span>Trending</span>
              <span className="cust-red-dot" />
            </Link>
            <Link
              href="/collections/tops"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              Tops
            </Link>
            <Link
              href="/collections/bottoms"
              className="h-7 px-3.5 rounded-full bg-white hover:bg-white/80 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px]"
            >
              Bottom
            </Link>
          </nav>

          <span className="text-[10px] tracking-widest text-[#482922]/70 font-editorial italic mt-0.5">
            &ldquo; YOU know where to GET IT &rdquo;
          </span>
        </div>

        {/* Right: Leaving Soon pill, Story ring, Wishlist, Search, Account, Cart */}
        <div className="flex items-center gap-3">
          {/* Leaving Soon offer pill */}
          <Link
            href="/collections/goodbyedeals"
            className="flex items-center gap-1.5 h-7 px-3 rounded-full bg-white/80 border border-[#482922]/20 hover:border-[#482922] transition-colors font-archivo shadow-2xs"
          >
            <span className="text-[10px] text-[#482922]/70 uppercase font-medium">Leaving soon</span>
            <span className="text-[10px] font-bold text-[#FF2F00]">30% OFF</span>
          </Link>

          {/* Instagram-style Story Ring */}
          <button
            onClick={onOpenStory}
            className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
            aria-label="View Stories"
          >
            <StoryRing size="w-8 h-8" />
          </button>

          {/* Official Nishorama Bookmark Wishlist */}
          <Link
            href="/pages/swym-wishlist"
            className="relative p-1.5 text-[#482922] hover:text-[#FF2F00] transition-colors flex items-center justify-center"
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
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF2F00] text-white text-[9px] font-bold flex items-center justify-center animate-heart-bounce">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 text-[#482922] hover:text-[#FF2F00] transition-colors"
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
            className="p-1.5 text-[#482922] hover:text-[#FF2F00] transition-colors"
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
            className="flex items-center gap-1.5 h-7 px-3 rounded-full bg-[#482922] text-white hover:bg-[#38201a] transition-all font-archivo text-[11px] font-medium shadow-xs"
            aria-label="Shopping Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>{cartCount}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HEADER (Screens < 1024px)                              */}
      {/* ============================================================== */}
      <div className="flex lg:hidden items-center justify-between px-3.5 py-2.5">
        {/* Left: Hamburger & Search */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenDrawer}
            className="p-1 text-[#482922] focus:outline-none"
            aria-label="Open Mobile Menu"
          >
            <div className="flex flex-col gap-1 w-5">
              <span className="w-full h-0.5 bg-[#482922] rounded-full" />
              <span className="w-full h-0.5 bg-[#482922] rounded-full" />
            </div>
          </button>

          <button
            onClick={onOpenSearch}
            className="p-1 text-[#482922] focus:outline-none"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Center: Brand Wordmark with Italic Subtitle */}
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center">
            <NishoramaLogo className="h-5 w-auto" color="#482922" />
          </Link>
          <span className="text-[9px] tracking-wider text-[#482922]/70 font-editorial italic -mt-0.5">
            * YOU know where to GET IT *
          </span>
        </div>

        {/* Right: Story ring, Wishlist bookmark, Cart bag */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenStory}
            className="focus:outline-none"
            aria-label="View Stories"
          >
            <StoryRing size="w-7 h-7" />
          </button>

          <Link
            href="/pages/swym-wishlist"
            className="relative p-1 text-[#482922]"
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
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF2F00] text-white text-[8px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={openCart}
            className="relative p-1 text-[#482922]"
            aria-label="Shopping Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#482922] text-white text-[8px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
