'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopularSearches from '@/components/PopularSearches';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';

export default function ContactPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <StoryViewerModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 flex-1 font-archivo text-[#482922]">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-[#FF2F00] font-bold">
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-1">
            Contact Us
          </h1>
          <p className="text-xs text-black/60 mt-2">
            Have questions about orders, sizing, exchanges, or styling? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/5 space-y-5 text-xs">
            <h3 className="text-base font-bold uppercase tracking-wide text-[#482922]">
              Nishorama Pvt Ltd
            </h3>
            <div className="space-y-3 text-black/80">
              <p>
                <strong>Address: </strong>
                1143, Lower Ground Floor, Rustomjee Ease Zone Mall, Sunder Nagar, Malad West, Mumbai-400064, Maharashtra, India
              </p>
              <p>
                <strong>Email: </strong>
                <a href="mailto:support@nishorama.com" className="text-[#FF2F00] underline font-medium">support@nishorama.com</a>
              </p>
              <p>
                <strong>Customer Helpline: </strong>
                <a href="tel:+919511948736" className="text-[#482922] font-semibold underline">+91 9511948736</a>
              </p>
              <p>
                <strong>WhatsApp Concierge: </strong>
                <a href="https://wa.me/918549000338" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold underline">+91 8549000338</a>
              </p>
              <p>
                <strong>Working Hours: </strong>
                Monday to Saturday: 10:30 AM &ndash; 6:30 PM IST
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-black/5">
            {submitted ? (
              <div className="py-12 text-center text-emerald-800 space-y-2">
                <span className="text-3xl">✓</span>
                <h4 className="font-bold text-sm">Thank you for reaching out!</h4>
                <p className="text-xs text-black/60">Our customer team will respond to your enquiry within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 text-xs font-archivo">
                <div>
                  <label className="block font-semibold text-[#482922] mb-1">Your Name</label>
                  <input required type="text" placeholder="Enter your full name" className="w-full px-3 py-2 rounded-lg border border-black/15 bg-[#FAF8F5] focus:outline-none focus:border-[#482922]" />
                </div>
                <div>
                  <label className="block font-semibold text-[#482922] mb-1">Email Address</label>
                  <input required type="email" placeholder="name@example.com" className="w-full px-3 py-2 rounded-lg border border-black/15 bg-[#FAF8F5] focus:outline-none focus:border-[#482922]" />
                </div>
                <div>
                  <label className="block font-semibold text-[#482922] mb-1">Phone / WhatsApp</label>
                  <input type="tel" placeholder="+91 98765 43210" className="w-full px-3 py-2 rounded-lg border border-black/15 bg-[#FAF8F5] focus:outline-none focus:border-[#482922]" />
                </div>
                <div>
                  <label className="block font-semibold text-[#482922] mb-1">Message</label>
                  <textarea required rows={4} placeholder="How can we help you?" className="w-full px-3 py-2 rounded-lg border border-black/15 bg-[#FAF8F5] focus:outline-none focus:border-[#482922]" />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#482922] hover:bg-[#38201a] text-[#F6C582] font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <PopularSearches />
    </div>
  );
}
