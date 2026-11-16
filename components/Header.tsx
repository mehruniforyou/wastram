'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onOpenDrawer?: () => void;
  onOpenSearch?: () => void;
  onOpenStory?: () => void;
}

export default function Header({ onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { wishlist, openDrawer, openSearch: globalOpenSearch } = useCart();
  const wishlistCount = wishlist.length;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle sticky border on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenSearch = onOpenSearch || globalOpenSearch;

  const navLinks = [
    { label: 'Products', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'Edits', href: '/brands' },
    { label: 'Offers', href: '/offers' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const handleWhatsAppConcierge = () => {
    const message = 'Hello Wastram Jaipur Atelier, I would like to enquire about your wholesale catalog and boutique sourcing.';
    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 glass-header border-b transition-colors duration-200 ${
          isScrolled ? 'border-black/10 dark:border-white/10' : 'border-transparent'
        }`}
        data-testid="site-navbar"
      >
        {/* 1. Top Announcement Bar in Wastram Deep Navy & Royal Gold */}
        <div className="border-b border-[#D4AF37]/25 bg-[#071F59] text-white shadow-sm">
          <div className="container-x py-2 text-[10px] md:text-[11px] uppercase tracking-widerest text-center font-medium font-body flex items-center justify-center gap-2">
            <span>👑 Artisanal Jaipur Handlooms</span>
            <span className="text-[#D4AF37]">✦</span>
            <span>Direct Atelier Wholesale Sourcing</span>
            <span className="text-[#D4AF37]">✦</span>
            <span>Worldwide Boutique Air Cargo</span>
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

          {/* Official Wastram Brand Logo with Artisan Crest */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 group py-1"
            data-testid="nav-logo"
            aria-label="Wastram Home"
          >
            <img
              src="/images/brand/wastram-artisan-crest.jpg"
              alt="Wastram Artisan Hallmark"
              className="h-7 sm:h-8 md:h-9 w-7 sm:w-8 md:w-9 rounded-full object-cover border border-[#D4AF37]/40 shadow-soft transition-transform duration-300 group-hover:scale-105 shrink-0"
            />
            <img
              src="/images/brand/wastram-header-logo-primary.png"
              alt="Wastram - Authentic Indian Textiles & Contemporary Fashion"
              className="h-7 sm:h-8 md:h-10 w-auto object-contain dark:brightness-125 transition-transform duration-300 group-hover:scale-102"
            />
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-widerest font-medium transition-colors link-underline ${
                    isActive
                      ? 'text-foreground font-semibold'
                      : 'text-foreground/75 hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Theme, Wishlist, Admin Portal, WhatsApp */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Live Search Trigger */}
            <button
              onClick={handleOpenSearch}
              className="p-2 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
              aria-label="Search Collection"
              data-testid="search-toggle"
            >
              <Search size={18} strokeWidth={1.4} />
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle Theme"
              data-testid="theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun size={18} strokeWidth={1.4} />
              ) : (
                <Moon size={18} strokeWidth={1.4} />
              )}
            </button>

            {/* Wishlist Drawer Trigger */}
            <button
              onClick={openDrawer}
              className="p-2 text-foreground/80 hover:text-foreground transition-colors relative cursor-pointer"
              aria-label="View Saved Items"
              data-testid="wishlist-toggle"
            >
              <Heart size={18} strokeWidth={1.4} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-foreground text-background text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* WhatsApp Concierge Button (Desktop) */}
            <button
              onClick={handleWhatsAppConcierge}
              className="hidden sm:inline-flex items-center gap-1.5 ml-2 px-3.5 py-1.5 rounded-full border border-foreground/20 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] text-foreground text-[11px] uppercase tracking-widerest transition-colors cursor-pointer font-medium"
            >
              <MessageCircle size={13} className="text-[#25D366] shrink-0" />
              <span>Concierge</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. Off-Canvas Luxury Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-background border-r border-foreground/10 h-full p-6 flex flex-col justify-between overflow-y-auto z-50">
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-6 border-b border-foreground/10">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-1"
                >
                  <img
                    src="/images/brand/wastram-artisan-crest.jpg"
                    alt="Wastram Artisan Hallmark"
                    className="h-8 w-8 rounded-full object-cover border border-[#D4AF37]/40 shadow-soft shrink-0"
                  />
                  <img
                    src="/images/brand/wastram-header-logo-primary.png"
                    alt="Wastram - Authentic Indian Textiles & Contemporary Fashion"
                    className="h-7 w-auto object-contain dark:brightness-125"
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

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col space-y-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-widerest text-foreground font-medium py-1"
                >
                  Home
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-widerest text-foreground/80 hover:text-foreground font-medium py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Drawer Bottom Info */}
            <div className="pt-6 border-t border-foreground/10 text-xs text-foreground/70 font-body space-y-3">
              <button
                onClick={handleWhatsAppConcierge}
                className="w-full btn-primary text-center flex items-center justify-center gap-2"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Atelier Concierge</span>
              </button>

              <div className="text-[11px] text-foreground/60 leading-relaxed pt-2">
                Jaipur Atelier, Rajasthan 302029
                <br />
                Mon - Sat: 10:00 AM – 8:00 PM IST
                <br />
                WhatsApp: +91 80030 88838
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
