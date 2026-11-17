'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  MessageCircle,
  Sun,
  Moon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  onOpenSearch?: () => void;
  onOpenDrawer?: () => void;
  onOpenStory?: () => void;
}

const ANNOUNCEMENTS = [
  {
    prefix: 'DIRECT ATELIER',
    text: 'Direct Jaipur Handloom Atelier · Made in our Jaipur factory',
    shortText: 'Direct Jaipur Handloom Atelier',
    badge: 'Artisanal',
  },
  {
    prefix: 'WORLDWIDE EXPORT',
    text: 'Worldwide Boutique Air Cargo · Dispatch in 2–3 Days to 40+ Countries',
    shortText: 'Worldwide Boutique Air Cargo',
    badge: 'Air Cargo',
  },
  {
    prefix: 'WHOLESALE B2B',
    text: 'Flexible Batch Production · Wholesale MOQ Starting at 20 Pcs / Style',
    shortText: 'Wholesale MOQ: 20 Pcs / Style',
    badge: 'MOQ 20 Pcs',
  },
  {
    prefix: 'WHATSAPP CONCIERGE',
    text: 'Instant Wholesale Enquiries & Line Sheets on WhatsApp: +91 80030 88838',
    shortText: 'WhatsApp B2B: +91 80030 88838',
    badge: 'Direct Chat',
  },
  {
    prefix: 'SIZING PRE-PACKS',
    text: 'Graded Tailoring from Sizes S to XXL Available Across All Silhouettes',
    shortText: 'Sizes S to XXL Available',
    badge: 'S to XXL',
  },
  {
    prefix: 'HERITAGE CRAFT',
    text: 'Pure 60-60 Cambric Cotton, Modal Silks & Authentic Sanganeri Block Prints',
    shortText: 'Pure Mulmul & Modal Silks',
    badge: 'Handblock',
  },
];

export default function Header({ onOpenSearch }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isAnnouncementPaused, setIsAnnouncementPaused] = useState(false);
  const pathname = usePathname();

  const { cartCount, openCart, wishlist } = useCart();
  const { theme, toggleTheme } = useTheme();

  // Announcement bar animation ticker (advances every 3.6s, pauses on hover)
  useEffect(() => {
    if (isAnnouncementPaused) return;
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 3600);
    return () => clearInterval(interval);
  }, [isAnnouncementPaused]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mega menu on page change
  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleOpenSearch = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      window.dispatchEvent(new CustomEvent('open-search-modal'));
    }
  };

  const handleWhatsAppConcierge = () => {
    const message =
      'Hello Wastram Jaipur Atelier, I would like to enquire about your handcrafted collections, custom sizing, and wholesale boutique orders.';
    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shopByFilters = [
    { label: 'All clothing collections', href: '/products' },
    { label: 'Co-ord Sets', href: '/collections/cord-sets' },
    { label: 'Ethnic Wear Sets', href: '/collections/ethnic-wear-sets' },
    { label: 'Traditional Gowns', href: '/collections/traditional-gowns' },
    { label: 'Western Dresses', href: '/collections/western-dresses' },
    { label: 'Kaftans (Short & Long)', href: '/collections/short-long-kaftan' },
    { label: 'Tops & Shirts', href: '/collections/tops-shirts' },
    { label: 'Umbrella Dresses', href: '/collections/umbrella-dresses' },
    { label: 'Denim Collection', href: '/collections/denim-collection' },
    { label: 'Atelier Edits', href: '/offers' },
    { label: 'Sizes S to XXL', href: '/products' },
    { label: 'Wholesale & Trade', href: '/wholesale' },
  ];

  const chapters = [
    {
      num: 'Chapter 01',
      title: 'The Co-ord Edit',
      desc: 'Matching sets in pure cotton & mulmul',
      href: '/collections/cord-sets',
      image: '/cord-sets/12550.jpg.jpeg',
    },
    {
      num: 'Chapter 02',
      title: 'Kurta Sets & Suits',
      desc: 'Sanganer prints with organza dupattas',
      href: '/collections/ethnic-wear-sets',
      image: '/ethnic-wear-sets/FB_IMG_1754660373365.jpg.jpeg',
    },
    {
      num: 'Chapter 03',
      title: 'Dresses & Gowns',
      desc: 'Tiered maxis & royal flared anarkalis',
      href: '/collections/western-dresses',
      image: '/western-dresses/10045.jpg.jpeg',
    },
    {
      num: 'Chapter 04',
      title: 'Kaftans & Tops',
      desc: 'Everyday breezy cotton & resort wear',
      href: '/collections/short-long-kaftan',
      image: '/short-long-kaftan/023fdea0b48306bda8bc878660bf429f.jpg.jpeg',
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFFEFE]/95 dark:bg-[#12100E]/95 backdrop-blur-md shadow-sm border-b border-[#E7E5E4] dark:border-white/10'
            : 'bg-[#FFFEFE] dark:bg-[#12100E] border-b border-[#E7E5E4]/60 dark:border-white/5'
        }`}
        data-testid="site-navbar"
      >
        {/* 1. Brand Blue Announcement Bar with Upward Animation & Scroll-Hide */}
        <div
          className={`bg-[#0B2D7F] text-white transition-all duration-300 ease-in-out overflow-hidden select-none ${
            isScrolled
              ? 'max-h-0 opacity-0 -translate-y-full py-0 pointer-events-none'
              : 'max-h-12 opacity-100 translate-y-0 py-1.5 sm:py-2'
          }`}
          onMouseEnter={() => setIsAnnouncementPaused(true)}
          onMouseLeave={() => setIsAnnouncementPaused(false)}
        >
          <div className="container-x flex items-center justify-between gap-2 sm:gap-4 text-[11px] sm:text-xs">
            {/* Left Decorative Tag */}
            <span className="hidden lg:flex items-center gap-1.5 text-white/75 text-[10.5px] uppercase tracking-wider font-medium shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>Jaipur Atelier</span>
            </span>

            {/* Center Animated Announcement Ticker */}
            <div className="flex-1 min-w-0 flex items-center justify-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentAnnouncementIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
                }}
                className="hidden sm:flex text-white/50 hover:text-[#D4AF37] transition-colors p-0.5 cursor-pointer shrink-0"
                aria-label="Previous announcement"
              >
                <ChevronLeft size={13} />
              </button>

              <div
                onClick={handleWhatsAppConcierge}
                className="min-w-0 max-w-2xl h-5 sm:h-6 overflow-hidden relative cursor-pointer flex items-center justify-center text-center px-1"
                title="Click to Chat with Wastram Jaipur Atelier Concierge"
              >
                <div
                  key={currentAnnouncementIndex}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap group text-white font-medium tracking-wide"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 sm:hidden animate-pulse" />
                  <span className="font-semibold uppercase tracking-wider text-[#D4AF37] shrink-0 text-[10px] sm:text-[11px]">
                    {ANNOUNCEMENTS[currentAnnouncementIndex].prefix}
                  </span>
                  <span className="text-[#D4AF37]/70 shrink-0">·</span>
                  <span className="truncate group-hover:underline decoration-[#D4AF37] decoration-1 underline-offset-2">
                    <span className="sm:hidden">
                      {ANNOUNCEMENTS[currentAnnouncementIndex].shortText}
                    </span>
                    <span className="hidden sm:inline">
                      {ANNOUNCEMENTS[currentAnnouncementIndex].text}
                    </span>
                  </span>
                  {ANNOUNCEMENTS[currentAnnouncementIndex].badge && (
                    <span className="hidden md:inline-flex items-center text-[9.5px] font-semibold text-[#0B2D7F] bg-[#D4AF37] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ml-1">
                      {ANNOUNCEMENTS[currentAnnouncementIndex].badge}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
                }}
                className="hidden sm:flex text-white/50 hover:text-[#D4AF37] transition-colors p-0.5 cursor-pointer shrink-0"
                aria-label="Next announcement"
              >
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Right: WhatsApp B2B Quick Link */}
            <a
              href="https://wa.me/918003088838?text=Hello%20Wastram%20Jaipur%20Atelier,%20I%20would%20like%20to%20enquire%20about%20boutique%20sourcing."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 text-[10.5px] text-white/80 hover:text-white uppercase tracking-wider font-semibold transition-colors shrink-0"
            >
              <span className="underline decoration-[#D4AF37] decoration-1 underline-offset-2">B2B Concierge</span>
              <ArrowRight size={11} className="text-[#D4AF37]" />
            </a>
          </div>
        </div>

        {/* 2. Main Navigation Bar */}
        <div className="container-x flex items-center justify-between h-16 md:h-20">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden -ml-2 p-2 text-foreground"
            aria-label="Toggle Navigation Menu"
            data-testid="nav-menu-toggle"
          >
            {isMobileMenuOpen ? (
              <X size={22} strokeWidth={1.5} />
            ) : (
              <Menu size={22} strokeWidth={1.5} />
            )}
          </button>

          {/* Official Wastram Wordmark Logo (Shifted to Leftmost with Safe Padding) */}
          <Link
            href="/"
            className="flex items-center group py-1 pl-1 sm:pl-2 shrink-0"
            data-testid="nav-logo"
            aria-label="Wastram Home"
          >
            <img
              src="/images/brand/wastram-header-logo-primary.png"
              alt="Wastram - Authentic Indian Textiles & Contemporary Fashion"
              className="h-8 sm:h-10 md:h-11 lg:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
            />
          </Link>

          {/* Desktop Center Navigation Links (Baisa IA) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans">
            {/* Shop Dropdown Trigger */}
            <div
              className="relative py-2"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                type="button"
                className={`text-[13px] uppercase tracking-wider font-medium flex items-center gap-1 transition-colors ${
                  isMegaMenuOpen || pathname.startsWith('/collections') || pathname === '/products'
                    ? 'text-[#0B2D7F] dark:text-[#D4AF37] font-semibold'
                    : 'text-foreground/80 hover:text-foreground'
                }`}
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                aria-expanded={isMegaMenuOpen}
              >
                <span>Shop</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    isMegaMenuOpen ? 'rotate-180 text-[#0B2D7F] dark:text-[#D4AF37]' : ''
                  }`}
                />
              </button>

              {/* Full-Bleed 2-Zone Mega Menu Panel */}
              {isMegaMenuOpen && (
                <div
                  className={`fixed left-0 ${
                    isScrolled ? 'top-16 md:top-20' : 'top-[100px] md:top-[112px]'
                  } w-screen bg-[#FFFEFE] dark:bg-[#161412] border-b border-t border-[#E7E5E4] dark:border-white/10 shadow-elevated transition-all duration-200 z-50 animate-in fade-in slide-in-from-top-1`}
                  onMouseEnter={() => setIsMegaMenuOpen(true)}
                  onMouseLeave={() => setIsMegaMenuOpen(false)}
                >
                  <div className="container-x py-8 grid grid-cols-12 gap-8 max-w-7xl mx-auto">
                    {/* Left Zone: Shop By Pills */}
                    <div className="col-span-4 border-r border-[#E7E5E4] dark:border-white/10 pr-6">
                      <div className="text-[11px] uppercase tracking-widest text-foreground/50 font-semibold mb-4">
                        Shop By Collection
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {shopByFilters.map((filter) => (
                          <Link
                            key={filter.label}
                            href={filter.href}
                            className="text-xs px-3.5 py-1.5 rounded-full border border-[#E7E5E4] dark:border-white/15 bg-white/70 dark:bg-black/30 hover:bg-[#0B2D7F] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-black transition-all font-medium"
                          >
                            {filter.label}
                          </Link>
                        ))}
                      </div>

                      <div className="mt-6 pt-5 border-t border-[#E7E5E4] dark:border-white/10 flex items-center justify-between text-xs">
                        <Link
                          href="/products"
                          className="font-semibold text-[#0B2D7F] dark:text-[#D4AF37] hover:underline flex items-center gap-1"
                        >
                          <span>Browse all 1,400+ styles</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>

                    {/* Right Zone: 4 Editorial Chapters */}
                    <div className="col-span-8 pl-2">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] uppercase tracking-widest text-foreground/50 font-semibold">
                          The Chapters
                        </span>
                        <Link
                          href="/categories"
                          className="text-xs text-[#0B2D7F] dark:text-[#D4AF37] font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>View All 8 Chapters</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        {chapters.map((chap) => (
                          <Link
                            key={chap.num}
                            href={chap.href}
                            className="group block"
                          >
                            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#E7E5E4] dark:border-white/10 group-hover:border-[#0B2D7F] dark:group-hover:border-amber-400 bg-[#FFFEFE] shadow-sm group-hover:shadow-xl group-hover:-translate-y-1.5 transition-all duration-300 ease-out">
                              <img
                                src={chap.image}
                                alt={chap.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider text-[#0B2D7F] dark:text-[#D4AF37]">
                                {chap.num}
                              </div>
                            </div>
                            <h4 className="mt-2 text-xs font-semibold text-foreground group-hover:text-[#0B2D7F] dark:group-hover:text-[#D4AF37] transition-colors line-clamp-1 font-serif">
                              {chap.title}
                            </h4>
                            <p className="text-[11px] text-foreground/60 line-clamp-1">
                              {chap.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/craft"
              className={`text-[13px] uppercase tracking-wider font-medium transition-colors ${
                pathname === '/craft'
                  ? 'text-[#0B2D7F] dark:text-[#D4AF37] font-semibold'
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Heritage Crafts
            </Link>

            <Link
              href="/custom-design"
              className={`text-[13px] uppercase tracking-wider font-medium transition-colors ${
                pathname === '/custom-design'
                  ? 'text-[#0B2D7F] dark:text-[#D4AF37] font-semibold'
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Custom design
            </Link>

            <Link
              href="/lookbook"
              className={`text-[13px] uppercase tracking-wider font-medium transition-colors ${
                pathname === '/lookbook'
                  ? 'text-[#0B2D7F] dark:text-[#D4AF37] font-semibold'
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Lookbook
            </Link>

            <Link
              href="/about"
              className={`text-[13px] uppercase tracking-wider font-medium transition-colors ${
                pathname === '/about'
                  ? 'text-[#0B2D7F] dark:text-[#D4AF37] font-semibold'
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Our Story
            </Link>

            <Link
              href="/wholesale"
              className={`text-[13px] uppercase tracking-wider font-medium transition-colors ${
                pathname === '/wholesale'
                  ? 'text-[#0B2D7F] dark:text-[#D4AF37] font-semibold'
                  : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Wholesale
            </Link>
          </nav>

          {/* Right Action Icons: Search, WhatsApp Pill, Cart/Bag */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Live Search Trigger */}
            <button
              onClick={handleOpenSearch}
              className="p-2 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
              aria-label="Search the shop"
              data-testid="search-toggle"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>

            {/* Official Wastram Artisan Logomark (Replaces Theme Selector) */}
            <Link
              href="/"
              className="p-1 flex items-center justify-center transition-transform hover:scale-105 shrink-0"
              aria-label="Wastram Artisan Hallmark"
              title="Wastram Atelier Hallmark"
            >
              <img
                src="/images/brand/wastram-artisan-crest.png"
                alt="Wastram Artisan Logomark"
                className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 object-contain"
              />
            </Link>

            {/* Wastram Brand Blue WhatsApp Pill CTA */}
            <button
              onClick={handleWhatsAppConcierge}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#0B2D7F] text-[#0B2D7F] bg-[#0B2D7F]/5 hover:bg-[#0B2D7F] hover:text-white transition-all cursor-pointer text-xs font-medium"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle size={14} className="text-[#0B2D7F]" />
              <span>WhatsApp</span>
            </button>

            {/* Cart / Bag Drawer Trigger (The Baisa Bag) */}
            <button
              onClick={openCart}
              className="p-2 text-foreground/85 hover:text-foreground transition-colors relative cursor-pointer"
              aria-label="Open Cart Bag"
              data-testid="cart-toggle"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0B2D7F] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Off-Canvas Luxury Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-5/6 max-w-sm bg-[#FFFEFE] dark:bg-[#161412] border-r border-[#E7E5E4] dark:border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto z-50 animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Top Header with Logo & Close */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4] dark:border-white/10">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <img
                    src="/images/brand/wastram-artisan-crest.png"
                    alt="Wastram"
                    className="h-9 w-9 object-contain"
                  />
                  <img
                    src="/images/brand/wastram-header-logo-primary.png"
                    alt="Wastram"
                    className="h-8 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-foreground/70 hover:text-foreground"
                  aria-label="Close Menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* In-Drawer Search Input */}
              <div className="mt-4">
                <div
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleOpenSearch();
                  }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[#E7E5E4] dark:border-white/15 bg-white/80 dark:bg-black/30 text-xs text-foreground/60 cursor-pointer shadow-xs"
                >
                  <Search size={15} />
                  <span>Search the shop...</span>
                </div>
              </div>

              {/* Navigation Links with Accordion for Shop */}
              <nav className="mt-5 flex flex-col divide-y divide-[#E7E5E4]/60 dark:divide-white/10 font-sans">
                {/* Shop Accordion */}
                <div>
                  <button
                    onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                    className="w-full flex items-center justify-between py-3 text-sm font-semibold text-foreground font-serif"
                  >
                    <span>Shop</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        mobileShopExpanded ? 'rotate-180 text-[#0B2D7F]' : ''
                      }`}
                    />
                  </button>

                  {mobileShopExpanded && (
                    <div className="pb-3 pl-3 space-y-2">
                      <Link
                        href="/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-xs font-semibold text-[#0B2D7F] dark:text-[#D4AF37] py-1"
                      >
                        All Clothing Collections →
                      </Link>
                      {shopByFilters.slice(1, 9).map((f) => (
                        <Link
                          key={f.label}
                          href={f.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs text-foreground/75 hover:text-foreground py-0.5"
                        >
                          {f.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/craft"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-sm font-semibold text-foreground font-serif"
                >
                  <span>Heritage Crafts</span>
                  <ArrowRight size={14} className="text-foreground/40" />
                </Link>

                <Link
                  href="/custom-design"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-sm font-semibold text-foreground font-serif"
                >
                  <span>Custom design</span>
                  <ArrowRight size={14} className="text-foreground/40" />
                </Link>

                <Link
                  href="/lookbook"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-sm font-semibold text-foreground font-serif"
                >
                  <span>Lookbook</span>
                  <ArrowRight size={14} className="text-foreground/40" />
                </Link>

                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-sm font-semibold text-foreground font-serif"
                >
                  <span>Our Story</span>
                  <ArrowRight size={14} className="text-foreground/40" />
                </Link>

                <Link
                  href="/wholesale"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-sm font-semibold text-foreground font-serif"
                >
                  <span>Wholesale &amp; Trade</span>
                  <ArrowRight size={14} className="text-foreground/40" />
                </Link>
              </nav>

              {/* Quick Category Chips */}
              <div className="mt-5">
                <div className="text-[11px] uppercase tracking-wider text-foreground/50 font-semibold mb-2">
                  Shop By
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Link
                    href="/collections/cord-sets"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[11px] px-3 py-1 rounded-full border border-[#E7E5E4] dark:border-white/10 bg-white/60 dark:bg-black/20"
                  >
                    Co-ords
                  </Link>
                  <Link
                    href="/collections/ethnic-wear-sets"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[11px] px-3 py-1 rounded-full border border-[#E7E5E4] dark:border-white/10 bg-white/60 dark:bg-black/20"
                  >
                    Kurta Sets
                  </Link>
                  <Link
                    href="/collections/western-dresses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[11px] px-3 py-1 rounded-full border border-[#E7E5E4] dark:border-white/10 bg-white/60 dark:bg-black/20"
                  >
                    Dresses
                  </Link>
                  <Link
                    href="/offers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[11px] px-3 py-1 rounded-full border border-[#E7E5E4] dark:border-white/10 bg-white/60 dark:bg-black/20 text-[#0B2D7F] dark:text-[#D4AF37] font-medium"
                  >
                    Atelier Edits
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Drawer Bottom WhatsApp CTA */}
            <div className="pt-5 border-t border-[#E7E5E4] dark:border-white/10 space-y-3">
              <button
                onClick={handleWhatsAppConcierge}
                className="w-full py-2.5 px-4 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle size={15} />
                <span>Chat on WhatsApp Concierge</span>
              </button>
              <p className="text-[11px] text-center text-foreground/50">
                Sanganer Factory Workshop, Jaipur · Mon-Sat 9am-8pm
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
