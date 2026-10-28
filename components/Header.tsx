'use client';

import React, { useState } from 'react';
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

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-black/10 transition-all">
      {/* ============================================================== */}
      {/* DESKTOP HEADER (Screens >= 1024px)                             */}
      {/* ============================================================== */}
      <div className="hidden lg:flex items-center justify-between px-8 py-3.5 relative">
        {/* Left: Menu trigger & Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/15 hover:bg-black/5 transition-colors font-archivo text-xs text-[#482922]"
            aria-label="Open Navigation Menu"
          >
            <div className="flex flex-col gap-1 w-3.5">
              <span className="w-full h-0.5 bg-[#482922]" />
              <span className="w-full h-0.5 bg-[#482922]" />
            </div>
            <span className="font-semibold uppercase tracking-wider text-[11px]">Menu</span>
          </button>

          {/* Nishorama Wordmark */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <NishoramaLogo className="h-6 w-auto" color="#482922" />
          </Link>
        </div>

        {/* Center: Navigation Pill Links & Tagline */}
        <div className="flex flex-col items-center">
          <nav className="flex items-center gap-1.5 font-archivo text-xs font-medium text-[#482922]">
            <Link
              href="/collections/new-in"
              className="px-3 py-1 rounded-full hover:bg-black/5 transition-colors"
            >
              New in
            </Link>
            <Link
              href="/collections/shop-all"
              className="px-3 py-1 rounded-full hover:bg-black/5 transition-colors"
            >
              Shop All
            </Link>
            <Link
              href="/collections/kurtis"
              className="px-3 py-1 rounded-full hover:bg-black/5 transition-colors"
            >
              Kurtis
            </Link>
            <Link
              href="/collections/trending"
              className="px-3 py-1 rounded-full hover:bg-black/5 transition-colors flex items-center"
            >
              Trending
              <span className="cust-red-dot" />
            </Link>
            <Link
              href="/collections/tops"
              className="px-3 py-1 rounded-full hover:bg-black/5 transition-colors"
            >
              Tops
            </Link>
            <Link
              href="/collections/bottoms"
              className="px-3 py-1 rounded-full hover:bg-black/5 transition-colors"
            >
              Bottom
            </Link>
          </nav>

          <span className="text-[10px] tracking-widest text-[#482922]/60 font-serif italic mt-0.5">
            &ldquo; YOU know where to GET IT &rdquo;
          </span>
        </div>

        {/* Right: Leaving Soon pill, Story ring, Wishlist, Search, Account, Cart */}
        <div className="flex items-center gap-4">
          {/* Leaving Soon offer pill */}
          <Link
            href="/collections/goodbyedeals"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#482922]/20 hover:border-[#482922] transition-colors font-archivo"
          >
            <span className="text-[10px] text-[#482922]/70 uppercase">Leaving soon</span>
            <span className="text-[11px] font-bold text-[#FF2F00]">30% OFF</span>
          </Link>

          {/* Animated Story Ring */}
          <StoryRing onClick={onOpenStory} size="w-8 h-8" />

          {/* Wishlist Icon */}
          <Link
            href="/pages/swym-wishlist"
            className="relative p-1.5 text-[#482922] hover:opacity-80 transition-opacity"
            aria-label="Wishlist"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF2F00] text-white text-[9px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Search Icon */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 text-[#482922] hover:opacity-80 transition-opacity"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Account Icon */}
          <Link
            href="/account"
            className="p-1.5 text-[#482922] hover:opacity-80 transition-opacity"
            aria-label="Account"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>

          {/* Cart Pill */}
          <button
            onClick={openCart}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#482922]/30 hover:border-[#482922] bg-[#FAF8F5] transition-colors font-archivo text-xs font-semibold text-[#482922]"
            aria-label="Shopping Cart"
          >
            <span>Cart</span>
            <span className="text-black/40">|</span>
            <span>{cartCount}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HEADER (Screens < 1024px)                                */}
      {/* ============================================================== */}
      <div className="flex lg:hidden items-center justify-between px-4 py-2.5">
        {/* Left: Hamburger & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            className="p-1 text-[#482922] focus:outline-none"
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1 w-5">
              <span className="w-full h-0.5 bg-[#482922]" />
              <span className="w-full h-0.5 bg-[#482922]" />
            </div>
          </button>

          <button
            onClick={onOpenSearch}
            className="p-1 text-[#482922] focus:outline-none"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Center: Logo & Tagline */}
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center">
            <NishoramaLogo className="h-4 w-auto" color="#482922" />
          </Link>
          <span className="text-[8px] tracking-widest text-[#482922]/70 font-serif italic">
            &ldquo; YOU know where to GET IT &rdquo;
          </span>
        </div>

        {/* Right: Story Ring, Wishlist, Cart Bag */}
        <div className="flex items-center gap-2.5">
          <StoryRing onClick={onOpenStory} size="w-7 h-7" />

          <Link
            href="/pages/swym-wishlist"
            className="relative p-1 text-[#482922]"
            aria-label="Wishlist"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF2F00] text-white text-[8px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            onClick={openCart}
            className="relative p-1 text-[#482922] focus:outline-none"
            aria-label="Open Cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF2F00] text-white text-[8px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
