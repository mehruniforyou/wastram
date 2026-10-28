'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import NishoramaLogo from './NishoramaLogo';

export default function Footer() {
  const [mobileOpen, setMobileOpen] = useState<Record<string, boolean>>({});

  const toggleMobileAccordion = (name: string) => {
    setMobileOpen(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <footer className="w-full bg-[#EFEFEF] text-[#482922] font-archivo border-t border-black/10">
      {/* ============================================================== */}
      {/* DESKTOP FOOTER (Screens >= 1024px)                             */}
      {/* ============================================================== */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8 pt-16 pb-8">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Columns 1-3: Links */}
          <div className="col-span-8 grid grid-cols-4 gap-6">
            {/* 1: Connect with us */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#482922]">
                Connect with us
              </h3>
              <ul className="flex flex-col gap-2 text-xs text-[#482922]/80">
                <li><a href="tel:+919511948736" className="hover:text-black">Call</a></li>
                <li><a href="https://www.instagram.com/nishorama" target="_blank" rel="noopener noreferrer" className="hover:text-black">Instagram</a></li>
                <li><a href="https://www.youtube.com/channel/UCoxGe5RNOXVRUboMmW0DLHA" target="_blank" rel="noopener noreferrer" className="hover:text-black">YouTube</a></li>
              </ul>
            </div>

            {/* 2: Order Support */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#482922]">
                Order Support
              </h3>
              <ul className="flex flex-col gap-2 text-xs text-[#482922]/80">
                <li><Link href="/apps/quickreturns" className="hover:text-black">Make a return/Exchange</Link></li>
                <li><Link href="/pages/refund-policy" className="hover:text-black">Refund/Exchange policy</Link></li>
                <li><Link href="/pages/refund-policy" className="hover:text-black">Shipping policy</Link></li>
                <li><Link href="/pages/faqs" className="hover:text-black">FAQ's</Link></li>
                <li><Link href="/pages/terms-of-service" className="hover:text-black">Terms</Link></li>
              </ul>
            </div>

            {/* 3: We Are Nishorama */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#482922]">
                We Are Nishorama
              </h3>
              <ul className="flex flex-col gap-2 text-xs text-[#482922]/80">
                <li><Link href="/pages/about-us" className="hover:text-black">Our story</Link></li>
                <li><Link href="/pages/contact" className="hover:text-black">Contact us</Link></li>
                <li><Link href="/pages/reviews" className="hover:text-black">Customer Reviews</Link></li>
              </ul>
            </div>

            {/* 4: Nishorama Pvt Ltd Info */}
            <div className="flex flex-col gap-2 text-[11px] text-[#482922]/80 leading-relaxed">
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#482922] mb-1">
                Nishorama Pvt Ltd
              </h4>
              <p>
                <strong>Address: </strong>
                1143, Lower Ground Floor, Rustomjee Ease Zone Mall, Sunder Nagar, Malad West, Mumbai-400064
              </p>
              <p><strong>Email: </strong>support@nishorama.com</p>
              <p><strong>Mob: </strong>+91 9511948736</p>
              <p><strong>Opening Hours: </strong>Mon to Sat: 10:30AM - 6:30PM</p>
            </div>
          </div>

          {/* Column 4: Artisan Engraving Illustration */}
          <div className="col-span-4 flex justify-end">
            <div className="w-full max-w-[340px]">
              <img
                src="/nishorama-images/cust-footer-svg.svg"
                alt="Nishorama Textile Artisan"
                className="w-full h-auto opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-6 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#482922]/70">
          <div className="flex items-center gap-3">
            <span>We accept all major payment methods:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-white rounded border border-black/10 text-[10px] font-bold">UPI</span>
              <span className="px-2 py-0.5 bg-white rounded border border-black/10 text-[10px] font-bold">Cards</span>
              <span className="px-2 py-0.5 bg-white rounded border border-black/10 text-[10px] font-bold">NetBanking</span>
              <span className="px-2 py-0.5 bg-white rounded border border-black/10 text-[10px] font-bold text-blue-800">PayPal</span>
            </div>
          </div>

          <div>
            <span>Designed by Nishorama | &copy; Nishorama 2026</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE FOOTER (Screens < 1024px)                               */}
      {/* ============================================================== */}
      <div className="block lg:hidden px-4 pt-8 pb-10">
        {/* Mobile Accordions */}
        <div className="flex flex-col divide-y divide-black/10 border-y border-black/10">
          {/* 1. Connect with us */}
          <div className="py-3">
            <button
              onClick={() => toggleMobileAccordion('connect')}
              className="w-full flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-[#482922]"
            >
              <span>Connect with us</span>
              <span className="text-base">{mobileOpen['connect'] ? '−' : '+'}</span>
            </button>
            {mobileOpen['connect'] && (
              <ul className="mt-2 pl-2 flex flex-col gap-1.5 text-xs text-[#482922]/80">
                <li><Link href="/pages/about-us">About us</Link></li>
                <li><Link href="/pages/contact">Contact us</Link></li>
                <li><a href="tel:+919511948736">Call: +91 9511948736</a></li>
              </ul>
            )}
          </div>

          {/* 2. Order Support */}
          <div className="py-3">
            <button
              onClick={() => toggleMobileAccordion('support')}
              className="w-full flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-[#482922]"
            >
              <span>Order Support</span>
              <span className="text-base">{mobileOpen['support'] ? '−' : '+'}</span>
            </button>
            {mobileOpen['support'] && (
              <ul className="mt-2 pl-2 flex flex-col gap-1.5 text-xs text-[#482922]/80">
                <li><Link href="/apps/quickreturns">Make a return/Exchange</Link></li>
                <li><Link href="/pages/refund-policy">Shipping &amp; Return Policy</Link></li>
                <li><Link href="/pages/faqs">FAQ's</Link></li>
              </ul>
            )}
          </div>

          {/* 3. We Are Nishorama */}
          <div className="py-3">
            <button
              onClick={() => toggleMobileAccordion('story')}
              className="w-full flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-[#482922]"
            >
              <span>We Are Nishorama</span>
              <span className="text-base">{mobileOpen['story'] ? '−' : '+'}</span>
            </button>
            {mobileOpen['story'] && (
              <ul className="mt-2 pl-2 flex flex-col gap-1.5 text-xs text-[#482922]/80">
                <li><Link href="/pages/reviews">Customer Reviews</Link></li>
                <li><a href="https://www.instagram.com/nishorama">Instagram</a></li>
                <li><a href="https://www.youtube.com/channel/UCoxGe5RNOXVRUboMmW0DLHA">YouTube</a></li>
              </ul>
            )}
          </div>

          {/* 4. Policies */}
          <div className="py-3">
            <button
              onClick={() => toggleMobileAccordion('policies')}
              className="w-full flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-[#482922]"
            >
              <span>Policies</span>
              <span className="text-base">{mobileOpen['policies'] ? '−' : '+'}</span>
            </button>
            {mobileOpen['policies'] && (
              <ul className="mt-2 pl-2 flex flex-col gap-1.5 text-xs text-[#482922]/80">
                <li><Link href="/pages/terms-of-service">Terms</Link></li>
                <li><Link href="/pages/refund-policy">Shipping Policy</Link></li>
                <li><Link href="/pages/refund-policy">Refund/Exchange Policy</Link></li>
              </ul>
            )}
          </div>

          {/* 5. Nishorama Pvt Ltd */}
          <div className="py-3">
            <button
              onClick={() => toggleMobileAccordion('company')}
              className="w-full flex items-center justify-between text-left font-bold text-xs uppercase tracking-wider text-[#482922]"
            >
              <span>Nishorama Pvt Ltd</span>
              <span className="text-base">{mobileOpen['company'] ? '−' : '+'}</span>
            </button>
            {mobileOpen['company'] && (
              <div className="mt-2 pl-2 flex flex-col gap-1 text-[11px] text-[#482922]/80 leading-relaxed">
                <p><strong>Address: </strong>1143, Lower Ground Floor, Rustomjee Ease Zone Mall, Sunder Nagar, Malad West, Mumbai-400064</p>
                <p><strong>Email: </strong>support@nishorama.com</p>
                <p><strong>Mob: </strong>+91 9511948736</p>
                <p><strong>Hours: </strong>Mon to Sat: 10:30AM - 6:30PM</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment info */}
        <div className="mt-6 text-center text-xs text-[#482922]/70">
          <p className="mb-2">We accept all major payment methods.</p>
          <div className="flex justify-center gap-2">
            <span className="px-2.5 py-0.5 bg-white rounded border border-black/10 text-[10px] font-bold">UPI</span>
            <span className="px-2.5 py-0.5 bg-white rounded border border-black/10 text-[10px] font-bold">Cards</span>
            <span className="px-2.5 py-0.5 bg-white rounded border border-black/10 text-[10px] font-bold">NetBanking</span>
          </div>
        </div>

        {/* Mobile Artisan Illustration */}
        <div className="mt-8 flex justify-center">
          <div className="w-48">
            <img
              src="/nishorama-images/cust-footer-svg.svg"
              alt="Artisan sketch"
              className="w-full h-auto opacity-75"
            />
          </div>
        </div>

        {/* Mobile Brand Statement & Vector Logo */}
        <div className="mt-6 flex flex-col items-center text-center gap-2">
          <span className="text-[10px] tracking-widest text-[#482922]/70 font-serif italic">
            &ldquo; YOU know where to GET &nbsp;IT &rdquo;
          </span>
          <div className="w-56 mt-1">
            <NishoramaLogo className="w-full h-auto" color="#482922" />
          </div>
          <span className="text-[10px] text-[#482922]/60 mt-2">
            Copyright &amp; Designed by Nishorama 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
