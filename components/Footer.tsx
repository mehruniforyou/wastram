'use client';

import React from 'react';
import Link from 'next/link';
import WastramLogo from './WastramLogo';

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAF9F6] text-[#0B2D7F] pt-16 pb-12 px-6 font-serif">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Wastram Official Gold Thread Calligraphy Logo */}
        <Link href="/" className="inline-block hover:opacity-95 transition-opacity mb-3" aria-label="Wastram Home">
          <WastramLogo className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Minimal Subtitle in Italic Serif */}
        <p className="font-serif italic text-base md:text-lg text-[#0B2D7F]/80 tracking-wide mb-6">
          Authentic Indian Textiles &amp; Contemporary Luxury
        </p>

        {/* Curated Luxury Navigation Headings */}
        <nav className="flex flex-wrap justify-center items-center gap-5 md:gap-8 font-serif tracking-widest uppercase text-xs text-[#0B2D7F] mb-8 font-medium">
          <Link href="/collections/western-dresses" className="hover:text-[#4A7BC6] transition-colors">
            Western
          </Link>
          <Link href="/collections/denim-collection" className="hover:text-[#4A7BC6] transition-colors">
            Denim
          </Link>
          <Link href="/collections/ethnic-wear-sets" className="hover:text-[#4A7BC6] transition-colors">
            Ethnic
          </Link>
          <Link href="/collections/umbrella-dresses" className="hover:text-[#4A7BC6] transition-colors">
            Umbrella
          </Link>
          <Link href="/collections/cord-sets" className="hover:text-[#4A7BC6] transition-colors">
            Co-ord Sets
          </Link>
          <Link href="/collections/shop-all" className="hover:text-[#4A7BC6] transition-colors">
            Collections
          </Link>
          <Link href="/pages/contact" className="hover:text-[#4A7BC6] transition-colors">
            Wholesale Quote
          </Link>
        </nav>

        {/* Minimal Copyright */}
        <span className="font-serif text-[11px] md:text-xs text-[#0B2D7F]/60 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} WASTRAM. ALL RIGHTS RESERVED.
        </span>
      </div>
    </footer>
  );
}
