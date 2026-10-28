'use client';

import React from 'react';
import Link from 'next/link';

export default function FeatureCategories() {
  const categories = [
    {
      title: 'MOST WANTED',
      image: '/nishorama-images/cat-most-wanted.png',
      href: '/collections/most-wanted'
    },
    {
      title: 'SETS UP TO 50% off',
      image: '/nishorama-images/cat-sets-50.png',
      href: '/collections/sets'
    },
    {
      title: 'UNDER ₹999',
      image: '/nishorama-images/cat-under-999.png',
      href: '/collections/under-999'
    },
    {
      title: 'KURTIS UP TO 50% off',
      image: '/nishorama-images/cat-kurtis-50.png',
      href: '/collections/kurtis'
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
