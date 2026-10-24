'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const whatsappUrl = buildWhatsAppLink(whatsappMessages.general());

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-4 items-center gap-1">
        
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
            pathname === '/' ? 'text-navy font-bold' : 'text-charcoal-muted hover:text-navy'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* 2. Collections */}
        <Link
          href="/collections"
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
            pathname.startsWith('/collections') ? 'text-navy font-bold' : 'text-charcoal-muted hover:text-navy'
          }`}
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Catalogue</span>
        </Link>

        {/* 3. Exports */}
        <Link
          href="/wholesale-exports"
          className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
            pathname === '/wholesale-exports' ? 'text-navy font-bold' : 'text-charcoal-muted hover:text-navy'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Exports</span>
        </Link>

        {/* 4. WhatsApp Contact (Primary conversion highlight) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 rounded-lg text-[#25D366] hover:text-[#1EBE5D] transition-colors"
          aria-label="Contact on WhatsApp"
        >
          <div className="relative">
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold animate-ping" />
            <MessageCircle className="w-5 h-5 mb-0.5 fill-[#25D366]" />
          </div>
          <span className="text-[10px] font-bold text-navy tracking-tight">WhatsApp</span>
        </a>

      </div>
    </div>
  );
}
