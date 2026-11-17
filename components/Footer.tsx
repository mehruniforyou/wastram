'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Check,
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer
      className="relative mt-16 md:mt-24 overflow-hidden text-foreground bg-[#FFFEFE] dark:bg-[#12100E]"
      data-testid="site-footer"
    >
      {/* Rajasthani Heritage Fort Rampart Section Dividing Border (High Quality - Both Mobile & Desktop) */}
      <div className="w-full relative z-10 overflow-hidden select-none pointer-events-none">
        <div
          className="w-full h-8 sm:h-11 md:h-14 lg:h-16 bg-repeat-x bg-bottom"
          style={{
            backgroundImage: "url('/images/rajasthan-border-divider-hd.png')",
            backgroundSize: 'auto 100%',
          }}
          aria-hidden="true"
        />
      </div>
      {/* Mobile Layout Heritage Illustration (Portrait: 1024x1536 Optimized WebP, 120KB) */}
      <div
        className="block md:hidden absolute inset-0 z-0 bg-cover bg-bottom bg-no-repeat opacity-100 dark:opacity-30 pointer-events-none"
        style={{
          backgroundImage: "url('/images/footer-heritage-bg-mobile.webp')",
        }}
      />

      {/* Desktop Layout Heritage Illustration (Panoramic Landscape: 2172x724 Optimized WebP, 205KB) */}
      <div
        className="hidden md:block absolute inset-0 z-0 bg-cover bg-bottom bg-no-repeat opacity-100 dark:opacity-30 pointer-events-none"
        style={{
          backgroundImage: "url('/images/footer-heritage-bg-desktop.webp')",
        }}
      />

      {/* Dark mode ambient overlay only */}
      <div className="hidden dark:block absolute inset-0 z-0 bg-black/60 pointer-events-none" />

      {/* Upper Content Section (Shifted Upwards into the Clear Ivory Sky on Mobile so Artwork Stays Visible) */}
      <div className="relative z-10 container-x pt-6 sm:pt-10 md:pt-16 pb-2 sm:pb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-12">
          {/* Column 1: Brand Atelier Manifesto & Coordinates (md:col-span-4) */}
          <div className="md:col-span-4">
            {/* Official Wastram Artisan Hallmark & Script Emblem Logo */}
            <Link
              href="/"
              className="inline-block group mb-2 sm:mb-3"
              aria-label="Wastram Home"
            >
              <img
                src="/images/brand/wastram-footer-artisan-logo.png"
                alt="Wastram Jaipur Atelier"
                className="h-[120px] sm:h-[144px] md:h-[168px] w-auto object-contain transition-transform duration-300 group-hover:scale-103"
              />
            </Link>

            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-foreground/75 max-w-sm font-body leading-relaxed">
              Direct Jaipur handloom atelier specializing in Pure Mulmul, Modal Silk,
              Gota Patti needlework, and Sanganer block prints for high-fashion boutiques worldwide.
            </p>
          </div>

          {/* Group Column 2 & Column 3 side-by-side on mobile */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:contents">
            {/* Column 2: Shop & Collections (md:col-span-2) */}
            <div className="md:col-span-2">
              <div className="eyebrow mb-2 sm:mb-3 text-[#0B2D7F] dark:text-[#D4AF37] font-semibold text-xs sm:text-sm">
                Collection
              </div>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm font-body">
                <li>
                  <Link href="/products" className="link-underline text-foreground/80 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="link-underline text-foreground/80 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="link-underline text-foreground/80 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors">
                    Edits &amp; Fabrics
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="link-underline text-foreground/80 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors">
                    Wholesale Offers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Boutique & Atelier (md:col-span-2) */}
            <div className="md:col-span-2">
              <div className="eyebrow mb-2 sm:mb-3 text-[#0B2D7F] dark:text-[#D4AF37] font-semibold text-xs sm:text-sm">
                Boutique
              </div>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm font-body">
                <li>
                  <Link href="/about" className="link-underline text-foreground/80 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors">
                    The Atelier
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="link-underline text-foreground/80 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors">
                    Visual Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="link-underline text-foreground/80 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors">
                    Visit &amp; Contact
                  </Link>
                </li>
                <li>
                  <Link href="/wholesale-exports" className="link-underline text-foreground/80 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors">
                    Global Air Freight
                  </Link>
                </li>
                <li>
                  <Link href="/pages/privacy-policy" className="link-underline text-foreground/60 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/pages/terms-and-conditions" className="link-underline text-foreground/60 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors">
                    Terms of Supply
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        {/* Column 4: Newsletter & Socials (md:col-span-4) */}
        <div className="md:col-span-4">
          <div className="eyebrow mb-2 sm:mb-4 text-[#0B2D7F] dark:text-[#D4AF37] font-semibold">
            Boutique Newsletter
          </div>
          <p className="text-xs md:text-sm text-foreground/75 font-body leading-relaxed">
            Private previews, seasonal handblock drops, and quiet wholesale releases — delivered once a month.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="mt-3 sm:mt-4 flex rounded-full border border-neutral-300 dark:border-white/15 bg-white/90 dark:bg-black/40 backdrop-blur-sm focus-within:border-[#0B2D7F] dark:focus-within:border-[#D4AF37] transition-all overflow-hidden p-1 shadow-sm"
            data-testid="newsletter-form"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="buyer@boutique.com"
              className="flex-1 bg-transparent px-4 py-2 text-xs md:text-sm outline-none text-[#171717] dark:text-foreground placeholder:text-foreground/40 font-body"
              data-testid="newsletter-email"
            />
            <button
              type="submit"
              className="bg-[#0B2D7F] hover:bg-[#071F59] text-white dark:bg-[#D4AF37] dark:text-neutral-950 dark:hover:bg-[#C5A059] rounded-full px-5 py-2 text-[11px] uppercase tracking-widerest font-semibold transition-all flex items-center gap-1 shrink-0 shadow-md shadow-[#0B2D7F]/20 cursor-pointer"
              data-testid="newsletter-submit"
            >
              {isSubscribed ? (
                <>
                  <Check size={13} />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <span>Join</span>
                  <ArrowRight size={12} />
                </>
              )}
            </button>
          </form>

          {/* Social Links & WhatsApp Direct */}
          <div className="mt-4 sm:mt-6 flex items-center gap-5 text-foreground/70">
            <a
              href="https://www.instagram.com/wastram.inn?utm_source=qr&cplk=ZnJ2NWd2M3F0OXRt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @wastram.inn"
              className="hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors"
            >
              <Instagram size={18} strokeWidth={1.4} />
            </a>
            <a
              href="https://www.facebook.com/share/1ZxpZnEMfJ/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook @wastram"
              className="hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors"
            >
              <Facebook size={18} strokeWidth={1.4} />
            </a>
            <a
              href="https://wa.me/918003088838"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp Concierge"
              className="hover:text-[#25D366] transition-colors"
            >
              <MessageCircle size={18} strokeWidth={1.4} />
            </a>
          </div>
        </div>
      </div>

      {/* Dedicated Coordinates & Copyright Strip (Shifted out of Column 1 for Desktop Elegance) */}
      <div className="mt-8 md:mt-12 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-foreground/75 font-body">
        {/* Coordinates: Address, Single Phone, Updated Email */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#0B2D7F] dark:text-[#D4AF37] shrink-0" />
            <span>Sanganer Textile Industrial Area, Jaipur, Rajasthan 302029</span>
          </div>

          <span className="hidden sm:inline text-foreground/30">·</span>

          <a
            href="tel:+918003088838"
            className="flex items-center gap-2 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors"
          >
            <Phone size={14} className="text-[#0B2D7F] dark:text-[#D4AF37] shrink-0" />
            <span>+91 80030 88838</span>
          </a>

          <span className="hidden sm:inline text-foreground/30">·</span>

          <a
            href="mailto:marutitex@gmail.com"
            className="flex items-center gap-2 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors"
          >
            <Mail size={14} className="text-[#0B2D7F] dark:text-[#D4AF37] shrink-0" />
            <span>marutitex@gmail.com</span>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-foreground/50 shrink-0">
          &copy; {new Date().getFullYear()} Wastram Jaipur. All rights reserved.
        </p>
      </div>
    </div>

      {/* Dedicated Heritage Illustration Showcase Zone - ONLY the Jaipur palaces, arches, peacocks & gold border appear here */}
      <div
        className="relative z-0 h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[420px] w-full pointer-events-none"
        aria-hidden="true"
      />
    </footer>
  );
}
