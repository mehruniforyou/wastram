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
  const { wishlist, cart, openCart, openDrawer, openSearch } = useCart();
  const wishlistCount = wishlist.length;
  const enquiryCount = cart.length;

  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenDrawer = onOpenDrawer || openDrawer;
  const handleOpenSearch = onOpenSearch || openSearch;

  const handleWhatsAppDirect = () => {
    window.open(
      'https://wa.me/918003088838?text=Hello%20Wastram%20Jaipur,%20I%20am%20interested%20in%20boutique%20wholesale%20sourcing%20and%20your%20latest%20lookbooks.',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <header
      id="SiteHeader"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_24px_rgba(11,45,127,0.08)] border-b border-[#0B2D7F]/10 py-2'
          : 'bg-[#FAF9F6] border-b border-[#0B2D7F]/5 py-3'
      }`}
    >
      {/* ============================================================== */}
      {/* DESKTOP HEADER (Screens >= 1024px)                             */}
      {/* ============================================================== */}
      <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center px-6 xl:px-12 max-w-[1600px] mx-auto w-full">
        {/* Left: Navigation Menu in Jost Uppercase */}
        <nav className="flex items-center gap-5 xl:gap-8 justify-start">
          <Link
            href="/collections/new-arrivals"
            className="text-[12px] xl:text-[13px] tracking-[0.1em] uppercase font-jost font-medium text-[#071F59] hover:text-[#D4AF37] transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap"
          >
            New Arrivals
          </Link>

          <Link
            href="/collections/festive-collection"
            className="text-[12px] xl:text-[13px] tracking-[0.1em] uppercase font-jost font-medium text-[#071F59] hover:text-[#D4AF37] transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform whitespace-nowrap flex items-center gap-1"
          >
            <span>Festive Edit</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] animate-pulse" />
          </Link>

          {/* Ethnic Wear Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('ethnic')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/collections/ethnic-wear-sets"
              className="text-[12px] xl:text-[13px] tracking-[0.1em] uppercase font-jost font-medium text-[#071F59] hover:text-[#D4AF37] transition-colors py-1.5 flex items-center gap-1 whitespace-nowrap"
            >
              <span>Ethnic Wear</span>
              <svg
                className={`w-3.5 h-3.5 text-[#071F59] transition-transform duration-200 ${
                  activeDropdown === 'ethnic' ? 'rotate-180 text-[#D4AF37]' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Dropdown Menu */}
            {activeDropdown === 'ethnic' && (
              <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-toast">
                <div className="bg-white rounded-lg shadow-elevated border border-[#0B2D7F]/10 p-3 flex flex-col gap-1">
                  <Link
                    href="/collections/ethnic-wear-sets"
                    className="px-3 py-2 text-[12px] tracking-[0.08em] uppercase font-jost text-[#071F59] hover:text-[#0B2D7F] hover:bg-[#FAF9F6] rounded transition-colors font-medium"
                  >
                    (3-Piece) Kurta Suit Sets
                  </Link>
                  <Link
                    href="/collections/umbrella-dresses"
                    className="px-3 py-2 text-[12px] tracking-[0.08em] uppercase font-jost text-[#071F59] hover:text-[#0B2D7F] hover:bg-[#FAF9F6] rounded transition-colors font-medium"
                  >
                    Anarkali & Kalidar Gowns
                  </Link>
                  <Link
                    href="/collections/shop-all"
                    className="px-3 py-2 text-[12px] tracking-[0.08em] uppercase font-jost text-[#071F59] hover:text-[#0B2D7F] hover:bg-[#FAF9F6] rounded transition-colors font-medium"
                  >
                    Handblock Print Kurtas
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Contemporary & Co-ords Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('contemporary')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/collections/cord-sets"
              className="text-[12px] xl:text-[13px] tracking-[0.1em] uppercase font-jost font-medium text-[#071F59] hover:text-[#D4AF37] transition-colors py-1.5 flex items-center gap-1 whitespace-nowrap"
            >
              <span>Co-ords & Dresses</span>
              <svg
                className={`w-3.5 h-3.5 text-[#071F59] transition-transform duration-200 ${
                  activeDropdown === 'contemporary' ? 'rotate-180 text-[#D4AF37]' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Dropdown Menu */}
            {activeDropdown === 'contemporary' && (
              <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-toast">
                <div className="bg-white rounded-lg shadow-elevated border border-[#0B2D7F]/10 p-3 flex flex-col gap-1">
                  <Link
                    href="/collections/cord-sets"
                    className="px-3 py-2 text-[12px] tracking-[0.08em] uppercase font-jost text-[#071F59] hover:text-[#0B2D7F] hover:bg-[#FAF9F6] rounded transition-colors font-medium"
                  >
                    Designer Co-ord Sets
                  </Link>
                  <Link
                    href="/collections/western-dresses"
                    className="px-3 py-2 text-[12px] tracking-[0.08em] uppercase font-jost text-[#071F59] hover:text-[#0B2D7F] hover:bg-[#FAF9F6] rounded transition-colors font-medium"
                  >
                    Artisanal Kaftans & Tunics
                  </Link>
                  <Link
                    href="/collections/denim-collection"
                    className="px-3 py-2 text-[12px] tracking-[0.08em] uppercase font-jost text-[#071F59] hover:text-[#0B2D7F] hover:bg-[#FAF9F6] rounded transition-colors font-medium"
                  >
                    Denim Atelier Collection
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/wholesale-exports"
            className="text-[12px] xl:text-[13px] tracking-[0.1em] uppercase font-jost font-semibold text-[#0B2D7F] hover:text-[#D4AF37] transition-colors whitespace-nowrap"
          >
            Wholesale & Exports
          </Link>
        </nav>

        {/* Center: Brand Logo Lockup */}
        <div className="flex items-center justify-center px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group select-none py-1 transition-opacity hover:opacity-90"
            aria-label="Wastram Jaipur Home"
          >
            <div className="w-10 h-10 xl:w-11 xl:h-11 shrink-0 flex items-center justify-center">
              <picture className="w-full h-full flex items-center justify-center">
                <source srcSet="/images/brand/wastram-craft-emblem-hd.webp" type="image/webp" />
                <img
                  src="/images/brand/wastram-craft-emblem-hd.png"
                  alt="Wastram Insignia"
                  className="w-full h-full object-contain filter drop-shadow-[0_1px_3px_rgba(11,45,127,0.1)] group-hover:scale-105 transition-transform duration-300 block"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>

            <div className="flex flex-col items-start justify-center">
              <img
                src="/images/brand/wastram-header-logo-trimmed.png"
                alt="Wastram"
                className="h-7 xl:h-8 w-auto object-contain block group-hover:opacity-95 transition-opacity"
                loading="eager"
                decoding="async"
              />
              <span className="text-[9px] uppercase tracking-[0.28em] font-jost text-[#D4AF37] font-medium -mt-0.5">
                JAIPUR ATELIER
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Search, Wishlist, WhatsApp Concierge, and Enquiry List */}
        <div className="flex items-center gap-3 xl:gap-4 justify-end">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={handleOpenSearch}
            className="p-2 text-[#071F59] hover:text-[#0B2D7F] transition-colors rounded-full hover:bg-black/[0.04] cursor-pointer"
            aria-label="Search Collection"
            title="Search Collection"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Wishlist Bookmark */}
          <Link
            href="/pages/swym-wishlist"
            className="relative p-2 text-[#071F59] hover:text-[#F58220] transition-colors rounded-full hover:bg-black/[0.04] flex items-center justify-center cursor-pointer"
            aria-label={`Saved Styles (${wishlistCount})`}
            title="Saved Styles"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="20"
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
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#F58220] text-white text-[9px] font-bold flex items-center justify-center animate-heart-bounce shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Instant WhatsApp Concierge Button */}
          <button
            type="button"
            onClick={handleWhatsAppDirect}
            className="hidden xl:inline-flex items-center gap-2 h-9 px-3.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#128C7E] transition-all text-[11.5px] font-jost font-semibold uppercase tracking-[0.08em] cursor-pointer group"
            title="Chat directly on WhatsApp with our Merchandiser"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.057-2.228-.588-1.782-.751-2.906-2.559-2.996-2.678-.088-.119-.716-.954-.716-1.821 0-.867.453-1.294.614-1.467.161-.173.351-.216.468-.216.117 0 .234.002.336.007.108.005.253-.041.395.3.144.347.491 1.196.533 1.282.042.086.07.187.014.3-.056.113-.085.183-.17.283-.085.1-.179.224-.256.3-.085.085-.174.178-.075.348.099.17.439.723.942 1.172.646.577 1.191.756 1.361.841.17.085.27.071.37-.044.1-.115.428-.499.542-.67.114-.171.228-.143.385-.085.157.057.994.469 1.165.555.171.085.285.128.328.2.043.072.043.418-.101.823z" />
            </svg>
            <span>WhatsApp Enquiry</span>
          </button>

          {/* Enquiry Shortlist / Cart Drawer Trigger */}
          <button
            type="button"
            onClick={openCart}
            className="flex items-center gap-2 h-9 px-4 rounded-full bg-[#0B2D7F] text-white hover:bg-[#071F59] transition-all text-[11px] xl:text-[12px] font-jost font-semibold uppercase tracking-[0.1em] shadow-soft hover:shadow-card cursor-pointer group active:scale-95"
            aria-label="View Enquiry Shortlist"
            title="B2B Wholesale Enquiry Shortlist"
          >
            <span>Enquiry Shortlist</span>
            {enquiryCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#071F59] text-[10px] font-bold flex items-center justify-center">
                {enquiryCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE HEADER (Screens < 1024px)                               */}
      {/* ============================================================== */}
      <div className="flex lg:hidden items-center justify-between px-3 sm:px-6 w-full max-w-7xl mx-auto">
        {/* Left: Hamburger & Search */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleOpenDrawer}
            className="p-2 text-[#071F59] focus:outline-none rounded-full hover:bg-black/[0.04] transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
            title="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleOpenSearch}
            className="p-2 text-[#071F59] focus:outline-none rounded-full hover:bg-black/[0.04] transition-colors cursor-pointer"
            aria-label="Search Catalog"
            title="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        {/* Center: Wastram Brand Lockup */}
        <div className="flex-1 flex items-center justify-center px-1 min-w-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity py-0.5"
            aria-label="Wastram Home"
          >
            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
              <picture className="w-full h-full flex items-center justify-center">
                <source srcSet="/images/brand/wastram-craft-emblem-hd.webp" type="image/webp" />
                <img
                  src="/images/brand/wastram-craft-emblem-hd.png"
                  alt="Wastram Insignia"
                  className="w-full h-full object-contain block"
                  loading="eager"
                />
              </picture>
            </div>
            <div className="flex flex-col items-start justify-center">
              <img
                src="/images/brand/wastram-header-logo-trimmed.png"
                alt="Wastram"
                className="h-6 sm:h-7 w-auto object-contain block"
                loading="eager"
              />
              <span className="text-[8px] uppercase tracking-[0.2em] font-jost text-[#D4AF37] font-medium -mt-0.5">
                JAIPUR
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Wishlist & WhatsApp Quick CTA */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/pages/swym-wishlist"
            className="relative p-2 text-[#071F59] hover:text-[#F58220] transition-colors cursor-pointer"
            aria-label={`Saved Styles (${wishlistCount})`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
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
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#F58220] text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Quick WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsAppDirect}
            className="flex items-center gap-1 h-8 px-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-all cursor-pointer shadow-soft text-[11px] font-jost font-semibold uppercase tracking-wider active:scale-95"
            aria-label="WhatsApp Enquiry"
            title="Chat on WhatsApp"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.057-2.228-.588-1.782-.751-2.906-2.559-2.996-2.678-.088-.119-.716-.954-.716-1.821 0-.867.453-1.294.614-1.467.161-.173.351-.216.468-.216.117 0 .234.002.336.007.108.005.253-.041.395.3.144.347.491 1.196.533 1.282.042.086.07.187.014.3-.056.113-.085.183-.17.283-.085.1-.179.224-.256.3-.085.085-.174.178-.075.348.099.17.439.723.942 1.172.646.577 1.191.756 1.361.841.17.085.27.071.37-.044.1-.115.428-.499.542-.67.114-.171.228-.143.385-.085.157.057.994.469 1.165.555.171.085.285.128.328.2.043.072.043.418-.101.823z" />
            </svg>
            <span>Enquire</span>
          </button>
        </div>
      </div>
    </header>
  );
}
