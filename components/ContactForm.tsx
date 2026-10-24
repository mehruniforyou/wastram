'use client';

import React, { useState } from 'react';
import { MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { siteConfig, buildWhatsAppLink } from '@/data/site-config';
import { categories } from '@/data/categories';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    country: '',
    category: 'all',
    estimatedQuantity: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.country.trim() || !formData.email.trim()) {
      setError('Please provide your name, business email, and country.');
      return;
    }

    // Prepare WhatsApp prefilled text with the form data
    const message = `Hello Wastram Team,
I am submitting a wholesale sourcing enquiry:
- Name: ${formData.name}
- Business / Boutique: ${formData.businessName || 'Independent Fashion Retailer'}
- Email: ${formData.email}
- Country: ${formData.country}
- Category of Interest: ${formData.category}
- Estimated Order Quantity: ${formData.estimatedQuantity || 'To be discussed'}
- Message: ${formData.message || 'Looking forward to receiving your wholesale catalogue and export pricing.'}`;

    const whatsappLink = buildWhatsAppLink(message);

    // Open WhatsApp with all submitted details
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-serif font-bold text-navy">
          Wholesale & Export Enquiry Form
        </h3>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          Submit your requirements below. Submitting will also connect you directly to our WhatsApp export desk with your details prefilled for immediate assistance.
        </p>
      </div>

      {submitted ? (
        <div className="bg-blush-50 p-6 rounded-2xl border border-blush-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-navy text-gold flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-gold" />
          </div>
          <h4 className="text-lg font-serif font-bold text-navy">
            Thank you, {formData.name}!
          </h4>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
            Your enquiry was transferred to WhatsApp. If your browser blocked the window, click the button below to resume your direct conversation with Wastram:
          </p>
          <a
            href={buildWhatsAppLink(
              `Hello Wastram, this is ${formData.name} from ${formData.country}. I submitted an enquiry for ${formData.category}.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-navy-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-gold fill-gold/20" />
            <span>Open WhatsApp Chat</span>
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="name" className="font-semibold text-navy">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sarah Jenkins"
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-navy"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="businessName" className="font-semibold text-navy">
                Business / Boutique Name
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Silk & Stone Boutique"
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-navy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="email" className="font-semibold text-navy">
                Business Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="buyer@yourcompany.com"
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-navy"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="country" className="font-semibold text-navy">
                Country / Destination <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. United Kingdom, USA, UAE..."
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-navy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="category" className="font-semibold text-navy">
                Primary Category of Interest
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-navy bg-white"
              >
                <option value="all">All Collections & Mix</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="estimatedQuantity" className="font-semibold text-navy">
                Estimated Order Quantity (Optional)
              </label>
              <input
                type="text"
                id="estimatedQuantity"
                name="estimatedQuantity"
                value={formData.estimatedQuantity}
                onChange={handleChange}
                placeholder="e.g. 20-50 pcs (Sample trial)"
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-navy"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="message" className="font-semibold text-navy">
              Specific Requirements or Questions
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your boutique, preferred fabrics, target delivery dates, or specific style references..."
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-navy"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-700 text-white font-semibold py-4 px-6 rounded-full uppercase tracking-wider text-xs sm:text-sm shadow-md transition-all group"
            >
              <MessageCircle className="w-4 h-4 text-gold fill-gold/20 group-hover:scale-110 transition-transform" />
              <span>Submit Enquiry & Connect on WhatsApp</span>
            </button>
          </div>

          <p className="text-[11px] text-charcoal-muted text-center pt-2">
            We value your privacy. Your information is used strictly to communicate wholesale information with Wastram.
          </p>
        </form>
      )}
    </div>
  );
}
