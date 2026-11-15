'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SearchModal from '@/components/SearchModal';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    boutiqueName: '',
    email: '',
    phone: '',
    categoryInterest: 'Western Dresses',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Wastram Jaipur Atelier, wholesale enquiry from contact page:

• Name: ${formData.name}
• Boutique: ${formData.boutiqueName}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Category Interest: ${formData.categoryInterest}
• Message: ${formData.message}`;

    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 pt-24 md:pt-28 pb-24">
        <div className="container-x">
          {/* Header */}
          <div className="pt-8 md:pt-12 pb-10 border-b border-foreground/10">
            <div className="eyebrow mb-3">Visit &amp; Direct Sourcing</div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl tracking-tight leading-[0.95] text-foreground">
              The Jaipur Atelier
            </h1>
            <p className="mt-4 text-sm md:text-base text-foreground/70 max-w-xl font-body leading-relaxed">
              Connect with our production managers for physical showroom appointments,
              virtual live walkthroughs, and custom boutique manufacturing consultations.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Contact Coordinates & Details */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="flex items-center gap-2 font-display text-xl text-foreground mb-2">
                  <MapPin size={18} strokeWidth={1.5} className="text-foreground shrink-0" />
                  <span>Workshop &amp; Showroom</span>
                </div>
                <p className="text-sm text-foreground/70 font-body leading-relaxed pl-6">
                  Wastram Handloom Manufacturing Atelier
                  <br />
                  Plot 14-18, Sanganer Industrial Textile Zone
                  <br />
                  Jaipur, Rajasthan 302029, India
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 font-display text-xl text-foreground mb-2">
                  <Clock size={18} strokeWidth={1.5} className="text-foreground shrink-0" />
                  <span>Hours of Operation</span>
                </div>
                <p className="text-sm text-foreground/70 font-body leading-relaxed pl-6">
                  Monday — Saturday: 10:00 AM – 8:00 PM IST
                  <br />
                  Sunday: By prior appointment only
                  <br />
                  <span className="text-xs text-foreground/50">
                    Indian Standard Time (GMT +5:30)
                  </span>
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 font-display text-xl text-foreground mb-2">
                  <Phone size={18} strokeWidth={1.5} className="text-foreground shrink-0" />
                  <span>Phone &amp; Direct Concierge</span>
                </div>
                <p className="text-sm text-foreground/70 font-body leading-relaxed pl-6">
                  WhatsApp Concierge: +91 80030 88838
                  <br />
                  Production Desk: +91 70584 00490
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 font-display text-xl text-foreground mb-2">
                  <Mail size={18} strokeWidth={1.5} className="text-foreground shrink-0" />
                  <span>Electronic Inquiries</span>
                </div>
                <p className="text-sm text-foreground/70 font-body leading-relaxed pl-6">
                  Boutique Relations: hello@wastram.in
                  <br />
                  Export Documentation: exports@wastram.in
                </p>
              </div>

              <div className="p-6 bg-secondary/50 border border-foreground/10">
                <div className="font-display text-lg text-foreground mb-1">
                  Visiting Jaipur?
                </div>
                <p className="text-xs text-foreground/70 font-body leading-relaxed">
                  We welcome visiting boutique owners, apparel designers, and textile
                  curators for hands-on block printing workshops and archive inspections.
                  Please notify us 48 hours prior.
                </p>
              </div>
            </div>

            {/* Right: Clean Wholesale Sourcing Form */}
            <div className="lg:col-span-7 border border-foreground/10 p-8 md:p-12 bg-card">
              <div className="eyebrow mb-2">Direct Appointment &amp; Line Sheets</div>
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
                Connect with our Lead Buyer
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5 font-body">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-foreground/70 mb-2">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-background border border-foreground/15 px-4 py-3 text-sm text-foreground outline-none focus:border-foreground transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-foreground/70 mb-2">
                      Boutique / Label Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.boutiqueName}
                      onChange={(e) => setFormData({ ...formData, boutiqueName: e.target.value })}
                      placeholder="e.g. Maison Atelier Paris"
                      className="w-full bg-background border border-foreground/15 px-4 py-3 text-sm text-foreground outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-foreground/70 mb-2">
                      Boutique Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="buyer@domain.com"
                      className="w-full bg-background border border-foreground/15 px-4 py-3 text-sm text-foreground outline-none focus:border-foreground transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-foreground/70 mb-2">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-background border border-foreground/15 px-4 py-3 text-sm text-foreground outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-foreground/70 mb-2">
                    Primary Sourcing Category
                  </label>
                  <select
                    value={formData.categoryInterest}
                    onChange={(e) => setFormData({ ...formData, categoryInterest: e.target.value })}
                    className="w-full bg-background border border-foreground/15 px-4 py-3 text-sm text-foreground outline-none focus:border-foreground transition-colors cursor-pointer"
                  >
                    <option value="Western Dresses">Western Dresses (Maxi, Midi &amp; Tiered)</option>
                    <option value="Traditional Gowns">Traditional Gowns &amp; Anarkalis</option>
                    <option value="Co-ord Sets">Co-ord Sets (2-Piece &amp; 3-Piece)</option>
                    <option value="Tops & Shirts">Tops, Blouses &amp; Shirts</option>
                    <option value="Ethnic Wear Sets">Ethnic Wear &amp; Kurta Sets</option>
                    <option value="Kaftans">Short &amp; Long Kaftans</option>
                    <option value="Umbrella Dresses">Umbrella Full-Flare Dresses</option>
                    <option value="Denim Collection">Artisan Washed Denim Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-foreground/70 mb-2">
                    Inquiry Notes &amp; Estimated Volume
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details regarding your planned order sizes, target dates, or custom labeling requirements..."
                    className="w-full bg-background border border-foreground/15 px-4 py-3 text-sm text-foreground outline-none focus:border-foreground transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Send Sourcing Inquiry to WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
