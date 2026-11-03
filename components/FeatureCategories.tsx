'use client';

import React from 'react';
import Link from 'next/link';

export default function FeatureCategories() {
  const categories = [
    {
      title: 'WESTERN DRESSES',
      image: '/western-dresses/1668.jpg.jpeg',
      href: '/collections/western-dresses'
    },
    {
      title: 'TIERED MAXI',
      image: '/western-dresses/5494.jpg.jpeg',
      href: '/collections/maxi-dresses'
    },
    {
      title: 'CHIC SLIP & MIDI',
      image: '/western-dresses/10096.jpg.jpeg',
      href: '/collections/midi-dress'
    },
    {
      title: 'EXPORT BESTSELLERS',
      image: '/western-dresses/10426.jpg.jpeg',
      href: '/collections/most-wanted'
    }
  ];

  return (
    <section className="w-full p-2 md:p-4 bg-[#F5F5F5]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className="group relative diwali-capsule-border bg-white shadow-sm hover:shadow-md transition-all block"
          >
            <div className="relative aspect-[3/5] w-full overflow-hidden">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
