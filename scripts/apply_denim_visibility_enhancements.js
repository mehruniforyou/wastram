const fs = require('fs');
const path = require('path');

function replaceExact(filePath, searchStr, replaceStr, label) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[${path.basename(filePath)}] Applied exact: ${label}`);
  } else {
    const normContent = content.replace(/\r\n/g, '\n');
    const normSearch = searchStr.replace(/\r\n/g, '\n');
    if (normContent.includes(normSearch)) {
      content = normContent.replace(normSearch, replaceStr.replace(/\r\n/g, '\n'));
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[${path.basename(filePath)}] Applied normalized: ${label}`);
    } else {
      console.warn(`[${path.basename(filePath)}] NOT matched: ${label}`);
    }
  }
}

// 1. Header.tsx: highlight Denim Collection ✦ in bold accent color
const headerPath = path.join(__dirname, '..', 'components', 'Header.tsx');
const oldHeaderDenim = `            <Link
              href="/collections/denim-collection"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-black/5 hover:border-black/15 text-[11px] font-semibold text-[#482922] whitespace-nowrap shrink-0"
            >
              Denim Collection ✦
            </Link>`;

const newHeaderDenim = `            <Link
              href="/collections/denim-collection"
              className="h-7 px-3 rounded-full bg-white hover:bg-white/90 transition-all flex items-center shadow-2xs border border-[#FF2F00]/25 hover:border-[#FF2F00]/50 text-[11px] font-bold text-[#FF2F00] whitespace-nowrap shrink-0"
            >
              Denim Collection ✦
            </Link>`;

replaceExact(headerPath, oldHeaderDenim, newHeaderDenim, 'Header Denim pill highlight');

// 2. MobileNavDrawer.tsx: highlight Denim Collection link and add Denim Collection accordion
const drawerPath = path.join(__dirname, '..', 'components', 'MobileNavDrawer.tsx');
const oldDrawerDenim = `            <li>
              <Link href="/collections/denim-collection" onClick={onClose} className="hover:text-[#482922] text-[#482922] font-bold block">
                Denim Collection ✦
              </Link>
            </li>`;

const newDrawerDenim = `            <li>
              <Link href="/collections/denim-collection" onClick={onClose} className="hover:text-[#FF2F00] text-[#FF2F00] font-bold flex items-center justify-between">
                <span>Denim Collection ✦</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF2F00]/10 text-[#FF2F00] font-bold uppercase tracking-wider">140+ Styles</span>
              </Link>
            </li>`;

replaceExact(drawerPath, oldDrawerDenim, newDrawerDenim, 'MobileNavDrawer Denim highlight');

// Add Denim Collection accordion right before Bottoms accordion
const oldAccordionSpot = `          {/* Bottoms */}
          <div className="border-b border-black/10 py-3">`;

const newAccordionSpot = `          {/* Denim Collection */}
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
          <div className="border-b border-black/10 py-3">`;

replaceExact(drawerPath, oldAccordionSpot, newAccordionSpot, 'MobileNavDrawer Denim Accordion');

// Add Denim link under Bottoms
const oldBottomsLink = `                <Link href="/collections/bottoms" onClick={onClose} className="hover:text-black">Pants</Link>`;
const newBottomsLink = `                <Link href="/collections/denim-collection" onClick={onClose} className="hover:text-[#FF2F00] font-semibold text-[#FF2F00]">Denim Jeans &amp; Trousers (140+ Styles) ✦</Link>
                <Link href="/collections/bottoms" onClick={onClose} className="hover:text-black">Pants</Link>`;
replaceExact(drawerPath, oldBottomsLink, newBottomsLink, 'MobileNavDrawer Denim in Bottoms');

// 3. FeatureCategories.tsx: Add DENIM COLLECTION and titles
const featPath = path.join(__dirname, '..', 'components', 'FeatureCategories.tsx');
let featCode = fs.readFileSync(featPath, 'utf8');

const newFeatComponent = `'use client';

import React from 'react';
import Link from 'next/link';

export default function FeatureCategories() {
  const categories = [
    {
      title: 'DENIM COLLECTION',
      count: '140+ Export Styles',
      image: '/denim-collection/IMG-20261102-WA0252.jpg.jpeg',
      href: '/collections/denim-collection',
      highlight: true
    },
    {
      title: 'WESTERN DRESSES',
      count: '170+ Export Designs',
      image: '/western-dresses/1668.jpg.jpeg',
      href: '/collections/western-dresses'
    },
    {
      title: 'HOODIES & SWEATSHIRTS',
      count: '40+ Streetwear Styles',
      image: '/hoodies-sweatshirts/16885.jpg.jpeg',
      href: '/collections/hoodies-sweatshirts'
    },
    {
      title: 'T-SHIRTS',
      count: '50+ Streetwear Tees',
      image: '/t-shirts/13665.jpg.jpeg',
      href: '/collections/t-shirts'
    },
    {
      title: 'CO-ORD SETS',
      count: '95+ Designer Sets',
      image: '/cord-sets/_MG_7607.JPG.jpeg',
      href: '/collections/cord-sets'
    },
    {
      title: 'EXPORT BESTSELLERS',
      count: 'Top Wholesale Picks',
      image: '/western-dresses/10426.jpg.jpeg',
      href: '/collections/most-wanted'
    }
  ];

  return (
    <section className="w-full p-2 md:p-4 bg-[#F5F5F5]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className="group relative diwali-capsule-border bg-white shadow-sm hover:shadow-md transition-all block overflow-hidden rounded-lg"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE8E1]">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {cat.highlight && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 rounded-full bg-[#FF2F00] text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                    NEW DROP
                  </span>
                </div>
              )}
            </div>
            <div className="p-2 md:p-2.5 bg-white text-center border-t border-black/5 flex flex-col gap-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#482922] group-hover:text-[#FF2F00] transition-colors line-clamp-1">
                {cat.title}
              </span>
              <span className="text-[10px] text-black/50 font-medium">
                {cat.count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
`;

fs.writeFileSync(featPath, newFeatComponent, 'utf8');
console.log('[FeatureCategories.tsx] Updated with 6 featured categories including Denim Collection');

// 4. EditorialBanners.tsx: Add dedicated WHOLESALE & EXPORT DENIM banner
const editBannerPath = path.join(__dirname, '..', 'components', 'EditorialBanners.tsx');
const oldDressesBanner = `    {
      subtitle: 'WHOLESALE',
      heading: 'DRESSES',
      description: 'Your most-loved styles, now even more irresistible. Curated high-turnover silhouettes engineered for international boutiques.',
      image: '/nishorama-images/banner-dresses.png',
      href: '/collections/dresses',
      aspect: 'aspect-[2/1] lg:aspect-[3/1] lg:col-span-2'
    }`;

const newDenimAndDressesBanners = `    {
      subtitle: 'WHOLESALE & EXPORT',
      heading: 'DENIM',
      description: '140+ premium rigid 100% cotton, selvedge denim, and comfort-stretch flared & wide-leg jeans engineered for international retailers.',
      image: '/denim-collection/IMG-20261102-WA0488.jpg.jpeg',
      href: '/collections/denim-collection',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    },
    {
      subtitle: 'WHOLESALE',
      heading: 'DRESSES',
      description: 'Your most-loved styles, now even more irresistible. Curated high-turnover silhouettes engineered for international boutiques.',
      image: '/nishorama-images/banner-dresses.png',
      href: '/collections/dresses',
      aspect: 'aspect-[2/1] lg:aspect-[2/1]'
    }`;

replaceExact(editBannerPath, oldDressesBanner, newDenimAndDressesBanners, 'EditorialBanners Denim Collection banner');
