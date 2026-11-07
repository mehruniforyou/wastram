'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export default function MobileNavDrawer({ isOpen, onClose, onOpenSearch }: MobileNavDrawerProps) {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const toggleAccordion = (name: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-[85%] max-w-[380px] h-full bg-[#FAF8F5] shadow-2xl z-10 flex flex-col overflow-y-auto no-scrollbar">
        {/* Header with close */}
        <div className="flex items-center justify-between p-4 border-b border-black/10">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="flex items-center gap-2 text-xs font-archivo text-[#482922]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search styles...</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#482922]"
            aria-label="Close Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick Promo Links */}
        <div className="p-4 border-b border-black/10 bg-white">
          <ul className="flex flex-col gap-2.5 font-archivo text-sm font-semibold tracking-wide">
            <li>
              <Link href="/collections/shop-all" onClick={onClose} className="hover:text-[#FF2F00] block">
                Shop All
              </Link>
            </li>
            <li>
              <Link href="/collections/western-dresses" onClick={onClose} className="hover:text-[#FF2F00] text-[#FF2F00] font-bold block">
                Western Dresses ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/denim-collection" onClick={onClose} className="hover:text-[#FF2F00] text-[#FF2F00] font-bold flex items-center justify-between">
                <span>Denim Collection ✦</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF2F00]/10 text-[#FF2F00] font-bold uppercase tracking-wider">140+ Styles</span>
              </Link>
            </li>
            <li>
              <Link href="/collections/hoodies-sweatshirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Hoodies &amp; Sweatshirts ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/t-shirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                T-Shirts ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/umbrella-dresses" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Umbrella Dresses ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/short-long-kaftan" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Short &amp; Long Kaftan ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/ethnic-wear-sets" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Ethnic Wear Sets ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/tops-shirts" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Tops & Shirts ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/cord-sets" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Co-ord Sets ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/traditional-gowns" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Traditional Gowns ✦
              </Link>
            </li>
            <li>
              <Link href="/collections/new-in" onClick={onClose} className="hover:text-[#FF2F00] block">
                New In
              </Link>
            </li>
            <li>
              <Link href="/collections/most-wanted" onClick={onClose} className="hover:text-[#FF2F00] block">
                MOST WANTED
              </Link>
            </li>
            <li>
              <Link href="/collections/most-wanted" onClick={onClose} className="text-[#FF2F00] font-bold block">
                EXPORT BESTSELLERS
              </Link>
            </li>
            <li>
              <Link href="/collections/shop-all" onClick={onClose} className="text-[#FF2F00] font-bold block">
                ALL 1,200+ STYLES
              </Link>
            </li>
            <li>
              <Link href="/collections/maxi-dresses" onClick={onClose} className="text-[#FF2F00] font-bold block">
                MAXI DRESSES
              </Link>
            </li>
            <li>
              <Link href="/collections/midi-dress" onClick={onClose} className="text-[#FF2F00] font-bold block">
                MIDI DRESSES
              </Link>
            </li>
          </ul>
        </div>

        {/* Category Accordions */}
        <div className="p-4 flex-1 font-archivo text-sm">
          {/* Kurtis */}
          <div className="border-b border-black/10 py-3">
            <button
              onClick={() => toggleAccordion('kurtis')}
              className="w-full flex items-center justify-between text-left font-medium text-[#482922]"
            >
              <span>Kurtis</span>
              <span className="text-base font-bold text-[#482922]/70">
                {openAccordions['kurtis'] ? '−' : '+'}
              </span>
            </button>
            {openAccordions['kurtis'] && (
              <div className="mt-2 pl-3 flex flex-col gap-2 text-xs text-black/70 font-normal">
                <Link href="/collections/short-kurti" onClick={onClose} className="hover:text-black">Short Kurtis</Link>
                <Link href="/collections/long-kurti" onClick={onClose} className="hover:text-black">Long Kurtis</Link>
                <Link href="/collections/sleeveless-kurtis" onClick={onClose} className="hover:text-black">Sleeveless Kurtis</Link>
                <Link href="/collections/full-sleeve-kurti" onClick={onClose} className="hover:text-black">Sleeved Kurtis</Link>
                <Link href="/collections/corset-kurti" onClick={onClose} className="hover:text-black">Corset Kurtis</Link>
                <Link href="/collections/deep-back-kurti" onClick={onClose} className="hover:text-black">Deep Back Kurtis</Link>
                <Link href="/collections/halter-neck-kurti" onClick={onClose} className="hover:text-black">Halter Kurtis</Link>
                <Link href="/collections/kurtis" onClick={onClose} className="font-semibold text-[#482922] pt-1">All Kurtis →</Link>
              </div>
            )}
          </div>

          {/* Dresses */}
          <div className="border-b border-black/10 py-3">
            <button
              onClick={() => toggleAccordion('dresses')}
              className="w-full flex items-center justify-between text-left font-medium text-[#482922]"
            >
              <span>Dresses</span>
              <span className="text-base font-bold text-[#482922]/70">
                {openAccordions['dresses'] ? '−' : '+'}
              </span>
            </button>
            {openAccordions['dresses'] && (
              <div className="mt-2 pl-3 flex flex-col gap-2 text-xs text-black/70 font-normal">
                <Link href="/collections/maxi-dresses" onClick={onClose} className="hover:text-black">Maxi Dresses</Link>
                <Link href="/collections/mini-dress" onClick={onClose} className="hover:text-black">Mini Dresses</Link>
                <Link href="/collections/dresses" onClick={onClose} className="font-semibold text-[#482922] pt-1">Shop All Dresses →</Link>
              </div>
            )}
          </div>

          {/* Sets */}
          <div className="border-b border-black/10 py-3">
            <button
              onClick={() => toggleAccordion('sets')}
              className="w-full flex items-center justify-between text-left font-medium text-[#482922]"
            >
              <span>Sets</span>
              <span className="text-base font-bold text-[#482922]/70">
                {openAccordions['sets'] ? '−' : '+'}
              </span>
            </button>
            {openAccordions['sets'] && (
              <div className="mt-2 pl-3 flex flex-col gap-2 text-xs text-black/70 font-normal">
                <Link href="/collections/skirt-set" onClick={onClose} className="hover:text-black">Skirt Set</Link>
                <Link href="/collections/3-piece" onClick={onClose} className="hover:text-black">3 Piece Sets</Link>
                <Link href="/collections/2-piece" onClick={onClose} className="hover:text-black">2 Piece Sets</Link>
                <Link href="/collections/sets" onClick={onClose} className="font-semibold text-[#482922] pt-1">Shop All Sets →</Link>
              </div>
            )}
          </div>

          {/* Tops */}
          <div className="border-b border-black/10 py-3">
            <button
              onClick={() => toggleAccordion('tops')}
              className="w-full flex items-center justify-between text-left font-medium text-[#482922]"
            >
              <span>Tops</span>
              <span className="text-base font-bold text-[#482922]/70">
                {openAccordions['tops'] ? '−' : '+'}
              </span>
            </button>
            {openAccordions['tops'] && (
              <div className="mt-2 pl-3 flex flex-col gap-2 text-xs text-black/70 font-normal">
                <Link href="/collections/cover-ups" onClick={onClose} className="hover:text-black">Cover Ups</Link>
                <Link href="/collections/corset-tops" onClick={onClose} className="hover:text-black">Corset Tops</Link>
                <Link href="/collections/halter-neck-kurti" onClick={onClose} className="hover:text-black">Halter Tops</Link>
                <Link href="/collections/fitted-tops" onClick={onClose} className="hover:text-black">Fitted Tops</Link>
                <Link href="/collections/loose-fitted-tops" onClick={onClose} className="hover:text-black">Loose Fitted Tops</Link>
                <Link href="/collections/tops" onClick={onClose} className="font-semibold text-[#482922] pt-1">All Tops →</Link>
              </div>
            )}
          </div>

          {/* Denim Collection */}
          <div className="border-b border-black/10 py-3">
            <button
              onClick={() => toggleAccordion('denim')}
              className="w-full flex items-center justify-between text-left font-medium text-[#482922]"
            >
              <span className="font-semibold text-[#FF2F00]">Denim Collection (140+ Styles)</span>
              <span className="text-base font-bold text-[#FF2F00]">
                {openAccordions['denim'] ? '−' : '+'}
              </span>
            </button>
            {openAccordions['denim'] && (
              <div className="mt-2 pl-3 flex flex-col gap-2 text-xs text-black/70 font-normal">
                <Link href="/collections/denim-collection" onClick={onClose} className="hover:text-black">High-Rise Flared Denim Jeans</Link>
                <Link href="/collections/denim-collection" onClick={onClose} className="hover:text-black">Wide-Leg Rigid Denim</Link>
                <Link href="/collections/denim-collection" onClick={onClose} className="hover:text-black">Acid-Washed Barrel Denim</Link>
                <Link href="/collections/denim-collection" onClick={onClose} className="hover:text-black">Raw Selvedge Denim Trousers</Link>
                <Link href="/collections/denim-collection" onClick={onClose} className="hover:text-black">Comfort-Stretch Indigo Jeans</Link>
                <Link href="/collections/denim-collection" onClick={onClose} className="font-semibold text-[#FF2F00] pt-1">All Denim Collection (140+ Styles) →</Link>
              </div>
            )}
          </div>

          {/* Bottoms */}
          <div className="border-b border-black/10 py-3">
            <button
              onClick={() => toggleAccordion('bottoms')}
              className="w-full flex items-center justify-between text-left font-medium text-[#482922]"
            >
              <span>Bottoms</span>
              <span className="text-base font-bold text-[#482922]/70">
                {openAccordions['bottoms'] ? '−' : '+'}
              </span>
            </button>
            {openAccordions['bottoms'] && (
              <div className="mt-2 pl-3 flex flex-col gap-2 text-xs text-black/70 font-normal">
                <Link href="/collections/denim-collection" onClick={onClose} className="hover:text-[#FF2F00] font-semibold text-[#FF2F00]">Denim Jeans &amp; Trousers (140+ Styles) ✦</Link>
                <Link href="/collections/bottoms" onClick={onClose} className="hover:text-black">Pants</Link>
                <Link href="/collections/skirts" onClick={onClose} className="hover:text-black">Skirts</Link>
                <Link href="/collections/bottoms" onClick={onClose} className="font-semibold text-[#482922] pt-1">All Bottoms →</Link>
              </div>
            )}
          </div>

          {/* Collections */}
          <div className="border-b border-black/10 py-3">
            <button
              onClick={() => toggleAccordion('collections')}
              className="w-full flex items-center justify-between text-left font-medium text-[#482922]"
            >
              <span>Collections</span>
              <span className="text-base font-bold text-[#482922]/70">
                {openAccordions['collections'] ? '−' : '+'}
              </span>
            </button>
            {openAccordions['collections'] && (
              <div className="mt-2 pl-3 flex flex-col gap-2 text-xs text-black/70 font-normal">
                <Link href="/collections/nishooffice-ss2" onClick={onClose} className="hover:text-black">NishoOffice SS2</Link>
                <Link href="/collections/nishooffice-ss1" onClick={onClose} className="hover:text-black">NishoOffice SS1</Link>
                <Link href="/collections/nishohaveli-ss2" onClick={onClose} className="hover:text-black">NishoHaveli SS2</Link>
                <Link href="/collections/nishohaveli-ss1" onClick={onClose} className="hover:text-black">NishoHaveli SS1</Link>
                <Link href="/collections/desi-romance" onClick={onClose} className="hover:text-black">Desi Romance</Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer Support Desk */}
        <div className="p-4 border-t border-black/10 bg-white font-archivo text-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-black/70">
            <span>Customer Care:</span>
            <a href="tel:+919511948736" className="font-semibold text-[#482922]">+91 9511948736</a>
          </div>
          <div className="flex items-center justify-between text-black/70">
            <span>WhatsApp Order:</span>
            <a href="https://wa.me/918549000338" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-700">Chat Now</a>
          </div>
          <div className="flex items-center justify-between text-black/70 pt-2 border-t border-black/5">
            <Link href="/pages/faqs" onClick={onClose} className="hover:text-black">FAQs</Link>
            <Link href="/pages/about-us" onClick={onClose} className="hover:text-black">Our Story</Link>
            <Link href="/pages/contact" onClick={onClose} className="hover:text-black">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
