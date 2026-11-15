'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';

export default function StyleHubVisit() {
  const handleBookVisit = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = `Hello Wastram Jaipur Atelier, I would like to schedule an in-person workshop visit / video appointment to inspect your handloom collections.`;
    window.open(
      `https://wa.me/918003088838?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <section className="container-x mt-24 md:mt-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-t border-foreground/10 pt-16 md:pt-20">
        {/* Left Column: Heading & Atelier Identity */}
        <div className="md:col-span-5">
          <div className="eyebrow mb-3">Visit &amp; Consult</div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[0.95] text-foreground tracking-tight">
            The Jaipur Atelier
          </h2>
          <p className="mt-4 text-foreground/70 max-w-md text-sm md:text-base font-body leading-relaxed">
            Experience our artisanal handloom looms, vegetable dye vats, and
            curated wholesale showroom in person, or connect with our lead buyer
            via direct video walkthrough.
          </p>

          <div className="mt-8">
            <button
              onClick={handleBookVisit}
              className="btn-primary"
            >
              <MessageSquare size={14} className="shrink-0" />
              <span>Schedule Atelier Appointment</span>
            </button>
          </div>
        </div>

        {/* Right Column: Workshop Details & Contact Hours */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 md:pl-8">
          <div>
            <div className="flex items-center gap-2 text-foreground font-display text-lg mb-2">
              <MapPin size={16} strokeWidth={1.5} className="shrink-0 text-foreground" />
              <span>Location</span>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed font-body">
              Wastram Handloom Atelier &amp; Showroom
              <br />
              Sanganer Industrial Textile Zone
              <br />
              Jaipur, Rajasthan 302029, India
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-foreground font-display text-lg mb-2">
              <Clock size={16} strokeWidth={1.5} className="shrink-0 text-foreground" />
              <span>Atelier Hours</span>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed font-body">
              Monday — Saturday: 10:00 AM – 8:00 PM IST
              <br />
              Sunday: By advance appointment only
              <br />
              <span className="text-xs text-foreground/50">
                Timezone: Indian Standard Time (UTC+05:30)
              </span>
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-foreground font-display text-lg mb-2">
              <Phone size={16} strokeWidth={1.5} className="shrink-0 text-foreground" />
              <span>Direct Concierge</span>
            </div>
            <p className="text-sm text-foreground/70 font-body">
              WhatsApp &amp; Voice: +91 80030 88838
              <br />
              Atelier Desk: +91 70584 00490
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-foreground font-display text-lg mb-2">
              <Mail size={16} strokeWidth={1.5} className="shrink-0 text-foreground" />
              <span>Boutique Relations</span>
            </div>
            <p className="text-sm text-foreground/70 font-body">
              General: hello@wastram.in
              <br />
              Wholesale: exports@wastram.in
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
