import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { categories } from '@/data/categories';

export default function CategoryGrid() {
  return (
    <section id="collections" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush-50 border border-blush-200 text-navy text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy tracking-tight">
            Explore Wholesale Collections
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed">
            Browse our manufacturer catalogues organized by silhouette and fabric. Every collection is developed with export-grade stitching and authentic Indian textile craftsmanship.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/collections/${category.slug}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-subtle hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Category Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory">
                <Image
                  src={category.heroImage}
                  alt={`Wastram ${category.name} Wholesale Collection`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Silhouette Pill */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-navy text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/50">
                  {category.itemCount}+ Designs
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[11px] font-semibold text-blush-200 uppercase tracking-widest">
                    {category.fabrics[0]}
                  </p>
                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-gold transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>

              {/* Card Footer Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                  {category.tagline}
                </p>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-navy group-hover:text-gold transition-colors">
                  <span className="uppercase tracking-wider">Explore Collection</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Complete Catalogue Callout */}
        <div className="mt-12 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-ivory hover:bg-blush-50 text-navy font-semibold px-6 py-3.5 rounded-full text-xs sm:text-sm tracking-wider uppercase border border-gray-200 hover:border-blush-300 transition-all shadow-xs"
          >
            <span>View All 130+ Available Designs</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>

      </div>
    </section>
  );
}
