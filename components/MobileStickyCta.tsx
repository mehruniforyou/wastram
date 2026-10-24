'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

interface Props {
  productName: string;
  sku: string;
  category: string;
}

export default function MobileStickyCta({ productName, sku, category }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past the first 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const whatsappUrl = buildWhatsAppLink(
    whatsappMessages.product(productName, sku, category)
  );

  return (
    <div className="lg:hidden fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 p-3 shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase font-mono font-semibold text-gold truncate">
            {sku} &bull; {category}
          </p>
          <p className="text-xs font-serif font-bold text-navy truncate">
            {productName}
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex-shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Enquire</span>
        </a>
      </div>
    </div>
  );
}
