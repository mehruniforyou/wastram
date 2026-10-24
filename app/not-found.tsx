import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';
import { buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export default function NotFound() {
  const whatsappUrl = buildWhatsAppLink(whatsappMessages.general());

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-ivory/50">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush-50 border border-blush-200 text-navy text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Page Not Found</span>
        </div>

        <h1 className="text-6xl font-serif font-bold text-navy">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-navy">
            Design or Page Unavailable
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            The page you requested may have moved or is temporarily unavailable in our current production catalogue.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/collections"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-navy-700 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Browse Catalogue</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-600 text-navy-900 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4 text-navy-900 fill-navy-900/20" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
