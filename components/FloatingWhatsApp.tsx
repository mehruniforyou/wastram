'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Phone, Mail } from 'lucide-react';

interface FloatingWhatsAppProps {
  className?: string;
}

function WhatsAppIcon({ className = 'w-5 h-5 fill-current shrink-0' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function FloatingWhatsApp({ className = '' }: FloatingWhatsAppProps) {
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const whatsappUrl = `https://wa.me/918003088838?text=${encodeURIComponent(
    'Hello Wastram Jaipur Atelier, I am interested in wholesale boutique sourcing and would like to review your catalog.'
  )}`;

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        setIsDesktopOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const mobileCtas = [
    {
      id: 'email',
      label: 'Email',
      href: 'mailto:marutitex@gmail.com?subject=Wastram%20Jaipur%20Wholesale%20%26%20Boutique%20Sourcing%20Inquiry',
      icon: <Mail className="w-5 h-5 text-neutral-950 stroke-[2.2]" />,
      bgClass: 'bg-[#D4AF37] hover:bg-[#c39e29] text-neutral-950 shadow-[#D4AF37]/35 border-[#D4AF37]',
      isExternal: false,
      delayClass: 'delay-150',
    },
    {
      id: 'phone',
      label: 'Call',
      href: 'tel:+918003088838',
      icon: <Phone className="w-5 h-5 text-white stroke-[2.2]" />,
      bgClass: 'bg-[#0B2D7F] hover:bg-[#071F59] text-white shadow-[#0B2D7F]/40 border-white/20',
      isExternal: false,
      delayClass: 'delay-75',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: whatsappUrl,
      icon: <WhatsAppIcon className="w-6 h-6 fill-white shrink-0" />,
      bgClass: 'bg-[#25D366] hover:bg-[#20ba59] text-white shadow-[#25D366]/40 border-white/20',
      isExternal: true,
      delayClass: 'delay-0',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay when Speed Dial is Open */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed z-50 ${
          className ? className : 'bottom-4 right-4 sm:bottom-5 sm:right-5'
        }`}
        data-testid="floating-whatsapp"
        aria-label="Concierge & Quick CTAs"
      >
        {/* ========================================================================= */}
        {/* DESKTOP EXPERIENCE (sm and up)                                            */}
        {/* ========================================================================= */}
        <div className="hidden sm:block">
          {/* Expanded Dialogue Card */}
          {isDesktopOpen && (
            <div
              className="mb-3 w-80 bg-background border border-[#DEE2E6] dark:border-white/15 rounded-2xl shadow-2xl p-5 backdrop-blur-md"
              data-testid="floating-whatsapp-panel"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-medium leading-tight text-foreground">
                    Talk to us on WhatsApp
                  </div>
                  <div className="text-xs text-foreground/70 mt-1 font-body">
                    Typical reply within an hour during atelier hours (10 AM – 8 PM IST).
                  </div>
                </div>
                <button
                  onClick={() => setIsDesktopOpen(false)}
                  aria-label="Close"
                  className="p-1 -mt-1 -mr-1 text-foreground/60 hover:text-foreground cursor-pointer"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 w-full text-center flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>
          )}

          {/* Desktop Trigger Pill */}
          <button
            onClick={() => setIsDesktopOpen(!isDesktopOpen)}
            className="px-5 py-3 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white shadow-2xl shadow-[#0B2D7F]/30 transition-all duration-300 cursor-pointer active:scale-95 border border-white/20 flex items-center justify-center gap-2.5"
            aria-label="Open WhatsApp Concierge"
          >
            <WhatsAppIcon className="w-5 h-5 fill-[#25D366] shrink-0" />
            <span className="text-xs uppercase tracking-wider font-semibold">
              WhatsApp
            </span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE EXPERIENCE (sm:hidden) — Speed Dial with 3 Upside CTA Buttons      */}
        {/* ========================================================================= */}
        <div className="sm:hidden flex flex-col items-end">
          {/* 3 Circular CTA Buttons Appearing Upside (Stacked Vertically) */}
          <div className="flex flex-col items-end gap-3 mb-3">
            {mobileCtas.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-2.5 transition-all duration-300 ease-out will-change-transform ${
                  isMobileOpen
                    ? `opacity-100 translate-y-0 scale-100 ${item.delayClass}`
                    : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
                }`}
              >
                {/* Floating Label Pill */}
                <a
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  onClick={() => setIsMobileOpen(false)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 dark:bg-neutral-900/95 text-neutral-900 dark:text-white shadow-xl border border-neutral-200/90 dark:border-white/15 whitespace-nowrap backdrop-blur-md active:scale-95 transition-transform flex items-center gap-1.5"
                >
                  <span>{item.label}</span>
                </a>

                {/* Circular Action Button (Same Circular Pill Format) */}
                <a
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  onClick={() => setIsMobileOpen(false)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-xl border-2 active:scale-90 transition-transform ${item.bgClass}`}
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              </div>
            ))}
          </div>

          {/* Main Mobile Trigger Circular Pill with White Plus Icon */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="w-14 h-14 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white shadow-2xl shadow-[#0B2D7F]/40 border-2 border-white/25 flex items-center justify-center cursor-pointer active:scale-95 transition-all duration-300 relative z-50"
            aria-label={isMobileOpen ? 'Close Concierge Menu' : 'Open Concierge Menu'}
            aria-expanded={isMobileOpen}
          >
            <Plus
              className={`w-7 h-7 text-white stroke-[2.5] transition-transform duration-300 ease-out will-change-transform ${
                isMobileOpen ? 'rotate-45' : 'rotate-0'
              }`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
