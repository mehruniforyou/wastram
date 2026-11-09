'use client';

import React, { useState } from 'react';
import { NishoramaProduct } from '@/data/nishorama-data';

interface B2BEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: NishoramaProduct;
  selectedSize?: string;
}

export default function B2BEnquiryModal({
  isOpen,
  onClose,
  product,
  selectedSize = 'All Sizes / Assorted'
}: B2BEnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: 'United Kingdom',
    quantity: '20-50 pcs',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate instantaneous enquiry save / transmission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Wastram Atelier,\n\nI am interested in boutique pricing for:\nProduct: ${product.title}\nSKU: ${product.sku || product.id}\nCategory: ${product.category}\nSelected Size/Pack: ${selectedSize}\n\nPlease share the lookbook and line sheets.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#FAF9F6] rounded-3xl shadow-2xl border border-black/10 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0B2D7F] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
              Artisan Atelier &amp; Haute Textiles
            </span>
            <h2 className="text-lg font-serif font-normal tracking-wide">Boutique Sourcing Inquiry</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 font-sans">
          {submitted ? (
            <div className="text-center py-8 px-4 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#0B2D7F] text-[#D4AF37] flex items-center justify-center text-3xl shadow-md">
                ✓
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#0B2D7F]">Inquiry Transmitted</h3>
              <p className="text-xs text-black/70 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{formData.name || 'Valued Partner'}</strong>. Our atelier concierge has received your inquiry for <strong>{product.title}</strong>. We will contact you via email and WhatsApp within 2–4 hours with line sheets and specifications.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={`https://wa.me/918003088838?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <span>Chat on WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-full border border-black/20 text-[#0B2D7F] text-xs font-bold uppercase tracking-wider hover:bg-white"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Product Capsule Preview */}
              <div className="flex items-center gap-3.5 bg-white p-3 rounded-2xl border border-black/5">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-14 h-18 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] text-[#0B2D7F]/70 uppercase font-medium">
                    {product.sku || 'WST-EXP'} • {product.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#0B2D7F] truncate">{product.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-[#FAF9F6] text-[#0B2D7F] px-2 py-0.5 rounded border border-black/10 font-semibold">
                      Pack: {selectedSize}
                    </span>
                    <span className="text-[10px] bg-[#FAF9F6] text-[#0B2D7F] px-2 py-0.5 rounded border border-black/10 font-semibold">
                      {product.moq || 'MOQ: 20 pcs'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0B2D7F] mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/15 bg-white focus:outline-none focus:border-[#0B2D7F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#0B2D7F] mb-1">
                      Company / Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. London Boutique Ltd"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/15 bg-white focus:outline-none focus:border-[#0B2D7F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0B2D7F] mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="buyer@brand.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/15 bg-white focus:outline-none focus:border-[#0B2D7F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#0B2D7F] mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+44 7911 123456"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/15 bg-white focus:outline-none focus:border-[#0B2D7F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#0B2D7F] mb-1">
                      Destination Country *
                    </label>
                    <select
                      value={formData.country}
                      onChange={e => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/15 bg-white focus:outline-none focus:border-[#0B2D7F]"
                    >
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Australia">Australia</option>
                      <option value="Canada">Canada</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="India">India (Domestic Wholesale)</option>
                      <option value="Other">Other Global Region</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#0B2D7F] mb-1">
                      Target Quantity *
                    </label>
                    <select
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-black/15 bg-white focus:outline-none focus:border-[#0B2D7F]"
                    >
                      <option value="20-50 pcs">Sample Batch (20–50 pcs)</option>
                      <option value="50-100 pcs">Boutique Pack (50–100 pcs)</option>
                      <option value="100-300 pcs">Retail Bulk (100–300 pcs)</option>
                      <option value="500+ pcs">Large Commercial Order (500+ pcs)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#0B2D7F] mb-1">
                    Customization / Specific Requirements
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Requesting custom woven labels, specific colorways, or CIF London shipping quote."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/15 bg-white focus:outline-none focus:border-[#0B2D7F]"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-full bg-[#0B2D7F] text-white hover:bg-[#38201a] font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? 'Transmitting Inquiry...' : 'Submit Boutique Inquiry'}
                  </button>
                  <a
                    href={`https://wa.me/918003088838?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-full bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-90 transition-all"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
