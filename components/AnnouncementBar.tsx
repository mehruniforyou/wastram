'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StoryRing from './StoryRing';
import { useCart } from '@/context/CartContext';

interface Announcement {
  id: number;
  prefix: string;
  text: string;
  shortText: string;
  badge?: string;
  action?: 'inquiry' | 'whatsapp' | 'shop';
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    prefix: 'WASTRAM ATELIER',
    text: 'Jaipur Haute Textiles & Bespoke Production',
    shortText: 'Jaipur Haute Textiles Atelier',
    badge: 'Signature',
    action: 'shop',
  },
  {
    id: 2,
    prefix: 'HERITAGE CRAFT',
    text: 'Handcrafted Pure Mulmul, Modal Silks & Artisanal Block Prints',
    shortText: 'Pure Mulmul, Silks & Block Prints',
    badge: 'Artisanal',
    action: 'shop',
  },
  {
    id: 3,
    prefix: 'GLOBAL DISPATCH',
    text: 'Worldwide Doorstep Air Freight in 4–7 Days (US, UK, EU, GCC)',
    shortText: 'Worldwide Air Freight in 4–7 Days',
    badge: 'Worldwide',
    action: 'inquiry',
  },
  {
    id: 4,
    prefix: 'BOUTIQUE SOURCING',
    text: 'Flexible Batch Production Starting at 20 Pcs per Style',
    shortText: 'Flexible MOQ: 20 Pcs / Style',
    badge: 'MOQ 20 Pcs',
    action: 'inquiry',
  },
  {
    id: 5,
    prefix: 'BESPOKE LABELLING',
    text: 'Custom Woven Monogram Tags, Barcoding & Packaging',
    shortText: 'Custom Tags & Private Labelling',
    badge: 'Private Label',
    action: 'inquiry',
  },
  {
    id: 6,
    prefix: 'CONSCIOUS ATELIER',
    text: 'GOTS-Certified Organic Cottons & Natural Vegetable Dyes',
    shortText: 'GOTS Organic & Natural Dyes',
    badge: 'Eco-Craft',
    action: 'shop',
  },
  {
    id: 7,
    prefix: 'DIRECT CONCIERGE',
    text: 'Instant Lookbooks & Line Sheets on WhatsApp (+91 80030 88838)',
    shortText: 'WhatsApp Concierge: +91 80030 88838',
    badge: 'Concierge',
    action: 'whatsapp',
  },
];

export default function AnnouncementBar() {
  const pathname = usePathname();
  const { openStory, openB2BQuote } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Suppress AnnouncementBar on Admin Portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Duplicate the first item at the end for an infinite upward loop
  const tickerItems = [...ANNOUNCEMENTS, ANNOUNCEMENTS[0]];
  const totalItems = tickerItems.length;

  // Periodically advance upward to the next announcement every 3.6s
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => prev + 1);
    }, 3600);

    return () => clearInterval(timer);
  }, [isPaused]);

  // When reaching the cloned item, reset index to 0 without transition after animation completes
  useEffect(() => {
    if (currentIndex === ANNOUNCEMENTS.length) {
      const resetTimeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
        // Re-enable smooth transition for subsequent slides
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsTransitioning(true);
          });
        });
      }, 500); // 500ms matches duration-500

      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex]);

  const handleAnnouncementClick = (action?: 'inquiry' | 'whatsapp' | 'shop') => {
    if (action === 'whatsapp') {
      window.open(
        'https://wa.me/918003088838?text=Hello%20Wastram%20Atelier,%20I%20would%20like%20to%20inquire%20about%20boutique%20sourcing%20and%20lookbooks.',
        '_blank',
        'noopener,noreferrer'
      );
    } else if (action === 'inquiry') {
      openB2BQuote();
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden bg-[#FAF9F6] text-[#0B2D7F] text-[11px] font-sans tracking-wide border-b border-[#0B2D7F]/5 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3">
        {/* Left: Mobile Story Ring Icon */}
        <div className="flex sm:hidden items-center gap-1.5 shrink-0">
          <StoryRing onClick={openStory} size="w-5 h-5" />
          <button
            type="button"
            onClick={openStory}
            className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#0B2D7F] hover:text-[#4A7BC6] transition-colors cursor-pointer"
            title="Watch Artisan Stories"
          >
            Stories
          </button>
        </div>

        {/* Center: Upward Animating Announcements Ticker (5-7 Announcements) */}
        <div
          className="flex-1 min-w-0 h-6 overflow-hidden relative cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex flex-col ${
              isTransitioning
                ? 'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'
                : 'transition-none'
            }`}
            style={{
              transform: `translateY(-${(currentIndex * 100) / totalItems}%)`,
            }}
          >
            {tickerItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => handleAnnouncementClick(item.action)}
                className="h-6 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#0B2D7F] group truncate"
                title={`${item.prefix} • ${item.text}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] shrink-0 animate-pulse" />

                {/* Announcement Prefix */}
                <span className="font-semibold uppercase tracking-wider text-[#0B2D7F] shrink-0">
                  {item.prefix}
                </span>

                <span className="text-[#D4AF37]/80 shrink-0">&bull;</span>

                {/* Announcement Body: Short on mobile, full on desktop */}
                <span className="text-[#0B2D7F]/80 group-hover:text-[#0B2D7F] transition-colors truncate">
                  <span className="sm:hidden">{item.shortText}</span>
                  <span className="hidden sm:inline">{item.text}</span>
                </span>

                {/* Highlight Badge (Desktop) */}
                {item.badge && (
                  <span className="hidden lg:inline-flex items-center text-[9.5px] font-semibold text-[#D4AF37] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#0B2D7F]/5 border border-[#D4AF37]/20 shrink-0 ml-1">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Atelier Delivery & Boutique Inquiry CTA */}
        <div className="flex items-center gap-2 text-[#0B2D7F]/80 text-[10px] sm:text-[11px] shrink-0">
          <span className="hidden md:inline text-[10.5px] text-[#0B2D7F]/65">
            Jaipur &bull; Mumbai &bull; Global
          </span>
          <span className="hidden md:inline text-[#D4AF37]/70">&bull;</span>
          <button
            type="button"
            onClick={openB2BQuote}
            className="text-[#0B2D7F] hover:text-[#4A7BC6] font-semibold transition-colors flex items-center gap-1 group whitespace-nowrap cursor-pointer"
          >
            <span className="underline decoration-[#D4AF37] decoration-1 underline-offset-2">
              <span className="sm:hidden">Inquire</span>
              <span className="hidden sm:inline">Boutique &amp; Trade Inquiries</span>
            </span>
            <span className="text-[#F58220] group-hover:translate-x-0.5 transition-transform">
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
