'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const generalUrl = buildWhatsAppLink(whatsappMessages.general());
  const internationalUrl = buildWhatsAppLink(whatsappMessages.international());

  return (
    <div className="hidden lg:flex fixed bottom-6 right-6 z-50 flex-col items-end">
      {/* Quick Chat Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-navy p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40">
                <MessageCircle className="w-5 h-5 text-gold fill-gold/20" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide">Wastram Exports</h4>
                <p className="text-xs text-blush-200">Wholesale & Export Desk</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close WhatsApp chat popup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-ivory/50 text-xs text-charcoal">
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
              <p className="font-medium text-navy mb-1">Namaste & Welcome!</p>
              <p className="text-charcoal-muted leading-relaxed">
                Connect directly with our Jaipur manufacturing and export team to discuss:
              </p>
              <ul className="mt-2 space-y-1 text-charcoal-muted list-disc list-inside">
                <li>Wholesale catalogues & current pricing</li>
                <li>Flexible order quantities (MOQ)</li>
                <li>International shipping & sample orders</li>
              </ul>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={generalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-4 rounded-xl font-medium tracking-wide shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>General Wholesale Enquiry</span>
              </a>

              <a
                href={internationalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-700 text-white py-2.5 px-4 rounded-xl font-medium tracking-wide shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4 text-gold fill-gold/20" />
                <span>International Buyer Enquiry</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-navy hover:bg-navy-700 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gold/60 focus:outline-hidden focus:ring-4 focus:ring-gold/30"
        aria-label="Open WhatsApp Wholesale Enquiry"
      >
        <span className="relative flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gold"></span>
        </span>
        <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-xs">
          <MessageCircle className="w-4 h-4 text-white fill-white" />
        </div>
        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-white group-hover:text-gold transition-colors">
          Wholesale WhatsApp
        </span>
      </button>
    </div>
  );
}
