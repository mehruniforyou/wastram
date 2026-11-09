'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import WastramLogo from './WastramLogo';
import SocialIcons from './SocialIcons';

export default function CartDrawer() {
  const {
    isB2BQuoteOpen,
    closeB2BQuote,
    isCartOpen,
    closeCart,
    wishlist,
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: 'United Kingdom',
    volume: '20-50 pcs',
    category: 'Western Dresses & Co-ords',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = isB2BQuoteOpen || isCartOpen;
  const handleClose = () => {
    if (closeB2BQuote) closeB2BQuote();
    if (closeCart) closeCart();
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Wastram Atelier Concierge,\n\nI would like to inquire regarding boutique collections and line sheets.\nBoutique / Brand: ${formData.company || 'Private Client'}\nCountry: ${formData.country}\nExpected Quantity: ${formData.volume}\nCategory: ${formData.category}\nSelected Styles: ${wishlist.length} designs\n\nPlease share the lookbook and trade pricing.`
  );

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-[#FAF9F6] shadow-2xl z-10 flex flex-col font-sans animate-slide-left overflow-y-auto no-scrollbar">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#0B2D7F]/10 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <WastramLogo className="h-6 w-auto" />
            <div className="h-4 w-[1px] bg-[#0B2D7F]/20" />
            <span className="text-xs font-serif uppercase tracking-[0.15em] text-[#0B2D7F] font-semibold">
              Atelier &amp; Trade Concierge
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#0B2D7F] cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Highlight Banner */}
        <div className="px-4 py-3 bg-[#0B2D7F] text-white flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold block text-[13px] tracking-wide">Jaipur Haute Textiles &amp; Bespoke Production</span>
            <span className="text-[11px] text-white/80">Batch MOQ 20 pcs &bull; Worldwide Doorstep Delivery</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#F58220] text-white text-[10px] font-bold uppercase">
            Couture Standard
          </span>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Quick WhatsApp Concierge Button */}
          <div className="p-3.5 rounded-2xl bg-white shadow-soft flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B2D7F]">
              Direct Atelier Concierge
            </span>
            <p className="text-xs text-[#0B2D7F]/75 leading-relaxed">
              Connect directly with our Jaipur atelier concierge for line sheets, custom craft specifications, and private label curation.
            </p>
            <a
              href={`https://wa.me/918003088838?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 w-full py-2.5 rounded-full bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-soft transition-all"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp Concierge (+91 80030 88838)</span>
            </a>
          </div>

          {/* Saved Bookmarks Notice */}
          {wishlist.length > 0 && (
            <div className="p-3 rounded-xl bg-white shadow-soft flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#0B2D7F]">
                <span className="w-2 h-2 rounded-full bg-[#F58220]" />
                <span className="font-semibold">{wishlist.length} Saved Boutique Styles</span>
              </div>
              <Link
                href="/pages/swym-wishlist"
                onClick={handleClose}
                className="text-[#0B2D7F] font-semibold underline hover:text-[#4A7BC6]"
              >
                View Saved &rarr;
              </Link>
            </div>
          )}

          {/* Wholesale Enquiry Form */}
          <div className="p-4 rounded-2xl bg-white shadow-soft flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#0B2D7F]/10 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B2D7F]">
                Request Atelier Lookbook &amp; Line Sheet
              </span>
            </div>

            {submitted ? (
              <div className="py-6 text-center flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg font-bold">
                  ✓
                </div>
                <h4 className="font-serif text-base font-semibold text-[#0B2D7F]">
                  Inquiry Transmitted
                </h4>
                <p className="text-xs text-[#0B2D7F]/70">
                  Our atelier concierge will transmit lookbooks and trade pricing sheets to your contact within 2-4 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-[#0B2D7F] underline"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2D7F]/70 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B2D7F]/15 focus:outline-none focus:border-[#0B2D7F] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2D7F]/70 mb-1">
                    Boutique / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Silk &amp; Stone Boutique"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B2D7F]/15 focus:outline-none focus:border-[#0B2D7F] text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2D7F]/70 mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="buyer@domain.com"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B2D7F]/15 focus:outline-none focus:border-[#0B2D7F] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2D7F]/70 mb-1">
                      WhatsApp / Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+44 7123 456789"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B2D7F]/15 focus:outline-none focus:border-[#0B2D7F] text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2D7F]/70 mb-1">
                      Destination Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={e => setFormData({ ...formData, country: e.target.value })}
                      placeholder="United Kingdom, USA, etc."
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B2D7F]/15 focus:outline-none focus:border-[#0B2D7F] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2D7F]/70 mb-1">
                      Target Quantity
                    </label>
                    <select
                      value={formData.volume}
                      onChange={e => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B2D7F]/15 focus:outline-none focus:border-[#0B2D7F] text-xs"
                    >
                      <option value="20-50 pcs">20 - 50 pcs (Sample Curation)</option>
                      <option value="50-200 pcs">50 - 200 pcs (Boutique Order)</option>
                      <option value="200-500 pcs">200 - 500 pcs (Retail Collection)</option>
                      <option value="500+ pcs">500+ pcs (Bespoke Production)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2D7F]/70 mb-1">
                    Requirements / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specific styles, custom labels, barcode tags, or delivery deadlines..."
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF9F6] border border-[#0B2D7F]/15 focus:outline-none focus:border-[#0B2D7F] text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-1 py-3 rounded-full bg-[#0B2D7F] text-white font-medium text-xs uppercase tracking-[0.12em] shadow-soft hover:bg-[#071F59] transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Transmitting Request...' : 'Submit Boutique Inquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Social Channels in Drawer */}
          <div className="p-3.5 rounded-2xl bg-white shadow-soft flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B2D7F] block">
                Official Channels
              </span>
              <span className="text-[10px] text-[#0B2D7F]/60">Follow collections &amp; runway previews</span>
            </div>
            <SocialIcons iconSize={14} itemClassName="w-7 h-7 rounded-full bg-[#FAF9F6] shadow-soft flex items-center justify-center text-[#0B2D7F] hover:shadow-card transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
