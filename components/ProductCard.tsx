'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { NishoramaProduct } from '@/data/nishorama-data';

interface ProductCardProps {
  product: NishoramaProduct;
  priority?: boolean;
}

function ProductCardComponent({ product, priority = false }: ProductCardProps) {
  const displayImage =
    (product.images && product.images.length > 0 && product.images[0]) ||
    product.image ||
    '/placeholder.jpg';

  const skuCode = product.sku || `WD-${String(product.id).slice(-3).padStart(3, '0')}`;
  const categoryName = product.category || 'Atelier Collection';
  const fabricName = product.fabric || 'Pure Handloom Fabric';

  // Direct WhatsApp Enquiry Link
  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const text = `Hello Wastram Jaipur Atelier, I am interested in wholesale boutique sourcing:

• Product: ${product.title}
• SKU / Code: ${skuCode}
• Category: ${categoryName}
• Fabric: ${fabricName}

Please share your wholesale catalog, MOQ slabs, and bulk pricing.`;

    const url = `https://wa.me/918003088838?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="group block relative bg-card border border-foreground/10 hover:border-[#0B2D7F]/40 dark:hover:border-[#D4AF37]/50 hover:shadow-cardHover transition-all duration-300"
      data-testid={`product-card-${product.slug || product.id}`}
    >
      {/* 1. Image with StyleHub Zoom Wrap (Aspect 4/5) */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative image-zoom-wrap bg-secondary aspect-[4/5] overflow-hidden"
      >
        <img
          src={displayImage}
          alt={product.title}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
        />

        {/* Minimal Royal Badges */}
        {(product.badge || product.new_arrival) && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span className="bg-[#0B2D7F] text-white text-[10px] uppercase tracking-widerest font-medium px-2 py-0.5 border border-[#D4AF37]/30 shadow-sm">
              {product.badge || 'New'}
            </span>
          </div>
        )}
      </Link>

      {/* 2. Product Meta & Strictly ONLY Enquire Now Button */}
      <div className="p-4 flex flex-col">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-display text-base md:text-lg leading-tight line-clamp-1 group-hover:text-[#0B2D7F] dark:group-hover:text-[#D4AF37] transition-colors">
            {product.title}
          </h3>
          <p className="mt-1 text-xs text-foreground/60 uppercase tracking-wider line-clamp-1">
            {product.fabric || product.category || 'Jaipur Handloom'}
          </p>
        </Link>

        {/* Single High-Contrast Enquire Now Button with WhatsApp Icon */}
        <button
          type="button"
          onClick={handleWhatsAppEnquiry}
          className="mt-3.5 w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-semibold uppercase tracking-widerest transition-colors duration-200 cursor-pointer shadow-sm active:scale-98"
          aria-label={`Enquire about ${product.title} on WhatsApp`}
        >
          <svg
            className="w-4 h-4 fill-current shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span>Enquire Now</span>
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCardComponent);
