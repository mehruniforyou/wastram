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
  Shield,
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
      className="relative mt-24 md:mt-32 border-t border-black/10 dark:border-white/10 overflow-hidden text-foreground bg-[#FAF9F5] dark:bg-[#12100E]"
      data-testid="site-footer"
    >
      {/* Background Royal Heritage Illustration (User Provided Fresco) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 dark:opacity-15 pointer-events-none"
        style={{
          backgroundImage: "url('/images/footer-heritage-bg.jpg')",
        }}
      />

      {/* Gentle Gradient Wash for Ultimate Readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/90 via-background/80 to-background/95 pointer-events-none" />

      {/* Main Footer Container */}
      <div className="relative z-10 container-x py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
        {/* Column 1: Brand Atelier Manifesto & Coordinates (md:col-span-4) */}
        <div className="md:col-span-4">
          <Link
            href="/"
            className="font-display text-3xl md:text-4xl tracking-tight inline-block text-foreground"
          >
            Wastram<span className="gold">.</span>
          </Link>

          <p className="mt-4 text-sm text-foreground/75 max-w-sm font-body leading-relaxed">
            Direct Jaipur handloom atelier specializing in Pure Mulmul, Modal Silk,
            Gota Patti needlework, and Sanganer block prints for high-fashion boutiques worldwide.
          </p>

          <div className="mt-6 space-y-2 text-xs md:text-sm text-foreground/70 font-body">
            <p className="flex items-start gap-2">
              <MapPin size={15} className="text-foreground shrink-0 mt-0.5" />
              <span>Sanganer Textile Industrial Area, Jaipur, Rajasthan 302029</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={15} className="text-foreground shrink-0" />
              <span>+91 80030 88838 / +91 70584 00490</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={15} className="text-foreground shrink-0" />
              <span>hello@wastram.in · exports@wastram.in</span>
            </p>
          </div>
        </div>

        {/* Column 2: Shop & Collections (md:col-span-2) */}
        <div className="md:col-span-2">
          <div className="eyebrow mb-4 text-foreground/90 font-semibold">
            Collection
          </div>
          <ul className="space-y-2.5 text-xs md:text-sm font-body">
            <li>
              <Link href="/products" className="link-underline text-foreground/80 hover:text-foreground">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/categories" className="link-underline text-foreground/80 hover:text-foreground">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/brands" className="link-underline text-foreground/80 hover:text-foreground">
                Edits &amp; Fabrics
              </Link>
            </li>
            <li>
              <Link href="/offers" className="link-underline text-foreground/80 hover:text-foreground">
                Wholesale Offers
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="link-underline text-[#0B2D7F] dark:text-gold font-medium flex items-center gap-1 mt-3"
              >
                <Shield size={13} />
                <span>Admin Console</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Boutique & Atelier (md:col-span-2) */}
        <div className="md:col-span-2">
          <div className="eyebrow mb-4 text-foreground/90 font-semibold">
            Boutique
          </div>
          <ul className="space-y-2.5 text-xs md:text-sm font-body">
            <li>
              <Link href="/about" className="link-underline text-foreground/80 hover:text-foreground">
                The Atelier
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="link-underline text-foreground/80 hover:text-foreground">
                Visual Gallery
              </Link>
            </li>
            <li>
              <Link href="/contact" className="link-underline text-foreground/80 hover:text-foreground">
                Visit &amp; Contact
              </Link>
            </li>
            <li>
              <Link href="/wholesale-exports" className="link-underline text-foreground/80 hover:text-foreground">
                Global Air Freight
              </Link>
            </li>
            <li>
              <Link href="/pages/privacy-policy" className="link-underline text-foreground/60 hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/pages/terms-and-conditions" className="link-underline text-foreground/60 hover:text-foreground">
                Terms of Supply
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter & Socials (md:col-span-4) */}
        <div className="md:col-span-4">
          <div className="eyebrow mb-4 text-foreground/90 font-semibold">
            Boutique Newsletter
          </div>
          <p className="text-xs md:text-sm text-foreground/75 font-body leading-relaxed">
            Private previews, seasonal handblock drops, and quiet wholesale releases — delivered once a month.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="mt-4 flex border border-foreground/30 bg-background/70 backdrop-blur-sm focus-within:border-foreground transition-colors"
            data-testid="newsletter-form"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="buyer@boutique.com"
              className="flex-1 bg-transparent px-3.5 py-2.5 text-xs md:text-sm outline-none text-foreground placeholder:text-foreground/40 font-body"
              data-testid="newsletter-email"
            />
            <button
              type="submit"
              className="bg-foreground text-background px-5 text-[11px] uppercase tracking-widerest font-medium hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0"
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
          <div className="mt-6 flex items-center gap-5 text-foreground/70">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-foreground transition-colors"
            >
              <Instagram size={18} strokeWidth={1.4} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-foreground transition-colors"
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

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-black/10 dark:border-white/10 py-6">
        <div className="container-x flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-foreground/60 font-body">
          <div>
            &copy; {new Date().getFullYear()} Wastram Jaipur. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Direct Atelier Handlooms</span>
            <span>·</span>
            <span>Est. 2011</span>
            <span>·</span>
            <span>Worldwide Air Freight</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
