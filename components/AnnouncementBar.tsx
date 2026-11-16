'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function AnnouncementBar() {
  const pathname = usePathname();

  // Suppress AnnouncementBar on Admin Portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const tickerItems = [
    { text: '✨ DIRECT ATELIER SOURCING FOR BOUTIQUES & RESELLERS', highlight: 'DIRECT ATELIER' },
    { text: '👑 WASTRAM JAIPUR | ARTISANAL HANDLOOM & HAUTE TEXTILES', highlight: 'WASTRAM JAIPUR' },
    { text: '💬 INSTANT B2B WHOLESALE ENQUIRY ON WHATSAPP: +91 80030 88838', highlight: '+91 80030 88838' },
    { text: '★ COMPLIMENTARY ALL-INDIA SAMPLING FOR BOUTIQUES & RESELLERS', highlight: 'COMPLIMENTARY' },
    { text: '✈️ WORLDWIDE EXPRESS EXPORT DISPATCH TO 40+ COUNTRIES', highlight: 'WORLDWIDE EXPRESS' },
    { text: '🪡 HANDCRAFTED ETHNIC SUITS, CO-ORDS & KAFTANS', highlight: 'HANDCRAFTED' },
    { text: '📦 FLEXIBLE ATELIER BATCH MOQS STARTING AT 20 PCS / STYLE', highlight: 'MOQ 20 PCS' },
  ];

  const handleWhatsAppClick = () => {
    window.open(
      'https://wa.me/918003088838?text=Hello%20Wastram%20Jaipur,%20I%20am%20interested%20in%20boutique%20wholesale%20sourcing%20and%20your%20latest%20lookbooks.',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div
      onClick={handleWhatsAppClick}
      className="relative w-full overflow-hidden bg-[#071F59] text-white border-b border-[#D4AF37]/20 select-none cursor-pointer group py-2"
      title="Chat with Wastram Jaipur Wholesale Concierge on WhatsApp"
    >
      {/* Decorative Gold accent line at very top */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 pointer-events-none" />

      {/* Infinite Horizontal Running Marquee */}
      <div className="flex w-max animate-marquee-smooth items-center">
        {/* Loop duplicated twice for seamless infinite scrolling */}
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-6 px-6 text-[11px] sm:text-[12px] font-jost uppercase tracking-[0.14em] text-white/90 whitespace-nowrap transition-colors duration-200 group-hover:text-white"
          >
            <span>{item.text}</span>
            <span className="text-[#D4AF37] text-xs font-serif font-light opacity-80">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
