'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageCircle, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';
import { categories } from '@/data/categories';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCollectionsDropdownOpen(false);
  }, [pathname]);

  const whatsappGeneralUrl = buildWhatsAppLink(whatsappMessages.general());

  return (
    <header className="sticky top-0 z-50 w-full bg-white transition-all duration-300">
      {/* 1. Announcement Strip */}
      <div className="bg-navy text-white text-xs sm:text-sm font-medium py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-gold flex-shrink-0" />
        <span>{siteConfig.announcementText}</span>
        <span className="hidden md:inline text-gold">|</span>
        <span className="hidden md:inline text-blush-200">Jaipur Textile Heritage & Global Export Sourcing</span>
      </div>

      {/* 2. Main Navigation Bar */}
      <div
        className={`border-b border-gray-100 bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-md py-2.5' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="Wastram Home">
            <div className="relative h-10 w-36 sm:h-14 sm:w-52">
              <Image
                src="/images/brand/wastram-logo-horizontal.png"
                alt="Wastram - Indian Women's Wear"
                fill
                priority
                sizes="(max-width: 640px) 176px, 208px"
                className="object-contain object-left group-hover:opacity-90 transition-opacity"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            <Link
              href="/"
              className={`text-sm font-medium tracking-wide transition-colors ${
                pathname === '/' ? 'text-navy font-semibold' : 'text-charcoal hover:text-navy'
              }`}
            >
              Home
            </Link>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionsDropdownOpen(true)}
              onMouseLeave={() => setCollectionsDropdownOpen(false)}
            >
              <Link
                href="/collections"
                className={`text-sm font-medium tracking-wide flex items-center gap-1 transition-colors ${
                  pathname.startsWith('/collections') ? 'text-navy font-semibold' : 'text-charcoal hover:text-navy'
                }`}
              >
                <span>Collections</span>
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" />
              </Link>

              {collectionsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-3 z-50">
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Browse by Category
                  </div>
                  <div className="divide-y divide-gray-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/collections/${cat.slug}`}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-charcoal hover:bg-blush-50 hover:text-navy transition-colors"
                      >
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-xs text-gray-400 font-mono">{cat.itemCount}+</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 px-4">
                    <Link
                      href="/collections"
                      className="text-xs font-semibold text-gold hover:text-navy transition-colors flex items-center justify-between"
                    >
                      <span>View All Categories & Catalogue</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`text-sm font-medium tracking-wide transition-colors ${
                pathname === '/about' ? 'text-navy font-semibold' : 'text-charcoal hover:text-navy'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/wholesale-exports"
              className={`text-sm font-medium tracking-wide transition-colors ${
                pathname === '/wholesale-exports' ? 'text-navy font-semibold' : 'text-charcoal hover:text-navy'
              }`}
            >
              Wholesale & Exports
            </Link>

            <Link
              href="/faq"
              className={`text-sm font-medium tracking-wide transition-colors ${
                pathname === '/faq' ? 'text-navy font-semibold' : 'text-charcoal hover:text-navy'
              }`}
            >
              FAQ
            </Link>

            <Link
              href="/contact"
              className={`text-sm font-medium tracking-wide transition-colors ${
                pathname === '/contact' ? 'text-navy font-semibold' : 'text-charcoal hover:text-navy'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Primary CTA (WhatsApp) & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {/* Desktop & Mobile Header WhatsApp Button */}
            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-navy hover:bg-navy-700 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase shadow-subtle hover:shadow-card transition-all duration-200 border border-navy"
              aria-label="Contact us on WhatsApp for wholesale enquiries"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold flex-shrink-0 fill-gold/20" />
              <span>Contact Us</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-charcoal hover:text-navy hover:bg-gray-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[100px] bottom-0 bg-white/95 backdrop-blur-md z-40 overflow-y-auto border-t border-gray-100 p-6 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <Link
              href="/"
              className={`block text-lg font-serif tracking-wide py-2 ${
                pathname === '/' ? 'text-navy font-bold' : 'text-charcoal'
              }`}
            >
              Home
            </Link>

            <div className="py-2 border-y border-gray-100">
              <div className="text-xs uppercase font-semibold text-gray-400 tracking-wider mb-2">
                Collections & Categories
              </div>
              <div className="grid grid-cols-1 gap-2 pl-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/collections/${cat.slug}`}
                    className="text-sm font-medium text-charcoal hover:text-navy py-1.5 flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-gray-400">{cat.itemCount} designs</span>
                  </Link>
                ))}
                <Link
                  href="/collections"
                  className="text-xs font-semibold text-gold hover:text-navy pt-2 block"
                >
                  View All Collections &rarr;
                </Link>
              </div>
            </div>

            <Link
              href="/about"
              className={`block text-lg font-serif tracking-wide py-2 ${
                pathname === '/about' ? 'text-navy font-bold' : 'text-charcoal'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/wholesale-exports"
              className={`block text-lg font-serif tracking-wide py-2 ${
                pathname === '/wholesale-exports' ? 'text-navy font-bold' : 'text-charcoal'
              }`}
            >
              Wholesale & Exports
            </Link>

            <Link
              href="/faq"
              className={`block text-lg font-serif tracking-wide py-2 ${
                pathname === '/faq' ? 'text-navy font-bold' : 'text-charcoal'
              }`}
            >
              FAQ
            </Link>

            <Link
              href="/contact"
              className={`block text-lg font-serif tracking-wide py-2 ${
                pathname === '/contact' ? 'text-navy font-bold' : 'text-charcoal'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Bottom Contact Card */}
          <div className="mt-8 pt-6 border-t border-gray-100 bg-ivory p-4 rounded-xl">
            <p className="text-xs text-charcoal-muted mb-3">
              Direct Wholesale Inquiries for Boutique Owners, Wholesalers & Importers:
            </p>
            <a
              href={whatsappGeneralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-navy text-white py-3 rounded-full text-sm font-medium uppercase tracking-wider shadow-md"
            >
              <MessageCircle className="w-4 h-4 text-gold fill-gold/20" />
              <span>WhatsApp: {siteConfig.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
