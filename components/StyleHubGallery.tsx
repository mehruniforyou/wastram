'use client';

import React from 'react';
import StyleHubSectionHeader from './StyleHubSectionHeader';

const GALLERY_ITEMS = [
  {
    id: 'blockprint',
    title: 'Sanganer Teak Wood Block Carving',
    image: '/images/about/craft-blockprint.jpg',
    category: 'Master Craft',
  },
  {
    id: 'dyeing',
    title: 'Organic Vegetable Vat Dyeing',
    image: '/images/about/craft-dyeing.jpg',
    category: 'Atelier Process',
  },
  {
    id: 'weaving',
    title: 'Pure Mulmul Handloom Drape',
    image: '/images/hero/hero-dress.jpg',
    category: 'Material Study',
  },
  {
    id: 'embroidery',
    title: 'Royal Zari & Gota Patti Needlework',
    image: '/images/hero/hero-coords.jpg',
    category: 'Artisanal Finish',
  },
];

export default function StyleHubGallery() {
  return (
    <section className="container-x mt-24 md:mt-32">
      <StyleHubSectionHeader
        eyebrow="Gallery"
        title="Inside the atelier"
        cta="Full photo gallery"
        to="/gallery"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GALLERY_ITEMS.map((item) => (
          <div
            key={item.id}
            className="group image-zoom-wrap aspect-square bg-secondary border border-foreground/10 overflow-hidden relative"
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="text-white">
                <span className="text-[10px] uppercase tracking-widerest text-white/70 block">
                  {item.category}
                </span>
                <p className="font-display text-sm leading-snug drop-shadow-sm mt-0.5">
                  {item.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
