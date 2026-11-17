'use client';

import React, { memo, useState } from 'react';
import Link from 'next/link';
import { Heart, Plus } from 'lucide-react';
import { NishoramaProduct } from '@/data/nishorama-data';
import { useCart } from '@/context/CartContext';
import B2BEnquiryModal from './B2BEnquiryModal';

// Authentic Official WhatsApp Logo SVG Icon
function WhatsAppIcon({ className = 'w-4 h-4 fill-current shrink-0' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}

interface ProductCardProps {
  product: NishoramaProduct;
  priority?: boolean;
}

function ProductCardComponent({ product, priority = false }: ProductCardProps) {
  const { toggleWishlist, isWishlisted, addToCart } = useCart();
  const wishlisted = isWishlisted(product.slug);

  const extractImageUrl = (item: any): string => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.url || item.src || item.image || '';
  };

  const displayImage =
    extractImageUrl(product.images && product.images[0]) ||
    extractImageUrl(product.image) ||
    extractImageUrl((product as any).featured_image) ||
    extractImageUrl((product as any).mainImage) ||
    '/placeholder.jpg';

  const hoverImage =
    extractImageUrl(product.images && product.images[1]) ||
    displayImage;

  const skuCode = product.sku || `WD-${String(product.id).slice(-3).padStart(3, '0')}`;
  const categoryName = product.category || 'Atelier Collection';
  const fabricName = product.fabric || 'Pure Handloom Cotton';

  // Format pricing with tabular numerals
  const price = product.price || 1499;
  const regularPrice = product.regularPrice || Math.round(price * 1.33);
  const discountPercent = Math.round(((regularPrice - price) / regularPrice) * 100);

  // Quick Add handler (adds default size M)
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = (product.sizes && product.sizes[0]) || 'M';
    addToCart(product, defaultSize, 1);
  };

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  // Enquiry modal handler
  const handleOpenEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEnquiryOpen(true);
  };

  // WhatsApp Enquiry Link
  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const text = `Hello Wastram Jaipur Atelier, I am interested in:
• Product: ${product.title}
• Code/SKU: ${skuCode}
• Category: ${categoryName}
• Sourcing: Wholesale & Boutique Enquiry (MOQ: 20 pcs)

Please share details regarding sizing, fabric drape, and wholesale ordering.`;

    const url = `https://wa.me/918003088838?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="group relative flex flex-col bg-transparent transition-all duration-300"
      data-testid={`product-card-${product.slug || product.id}`}
    >
      {/* 1. 3:4 Portrait Image Container with Pop-out, Shadow & Minimalist Border Hover */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#FFFEFE] border border-neutral-200/80 dark:border-white/10 group-hover:border-neutral-900 dark:group-hover:border-white shadow-sm group-hover:shadow-xl group-hover:-translate-y-1.5 transition-all duration-300 ease-out">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {/* Primary Main Image */}
          <img
            src={displayImage}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-out will-change-transform group-hover:scale-105 ${
              hoverImage !== displayImage ? 'group-hover:opacity-0' : ''
            }`}
          />

          {/* Secondary Alternate Image on Hover */}
          {hoverImage !== displayImage && (
            <img
              src={hoverImage}
              alt={`${product.title} Alternate View`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-all duration-700 ease-out will-change-transform group-hover:scale-105 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Badges: Top Left in Refined Editorial Black */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge ? (
            <span className="bg-neutral-900/90 text-white text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
              {product.badge}
            </span>
          ) : (
            <span className="bg-neutral-900/90 text-white text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full shadow-xs backdrop-blur-xs">
              Wholesale
            </span>
          )}
        </div>

        {/* Floating Heart / Wishlist Button: Top Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.slug);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xs ${
            wishlisted
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
              : 'bg-white/90 dark:bg-black/70 text-neutral-700 hover:text-neutral-950 hover:scale-110'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart size={15} className={wishlisted ? 'fill-current' : ''} />
        </button>

        {/* Floating Quick Add Button: Bottom Right */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute bottom-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/95 dark:bg-[#12100E]/95 text-foreground hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black shadow-md flex items-center justify-center transition-all duration-300 transform opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 cursor-pointer"
          aria-label={`Quick add ${product.title} to bag`}
          title="Quick add to bag"
        >
          <Plus size={18} strokeWidth={2} />
        </button>
      </div>

      {/* 2. Product Meta & Wholesale Sourcing Information (No Prices) */}
      <div className="pt-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.slug}`} className="block flex-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
            <h3 className="font-serif text-[15px] md:text-[16px] font-medium text-foreground leading-snug line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
              Enquiry
            </span>
          </div>
        </div>

        {/* Subtitle & Size Availability */}
        <div className="mt-1 flex items-center justify-between text-xs text-foreground/60 font-sans">
          <span className="line-clamp-1">{product.fabric || product.category || 'Pure Cotton'}</span>
          <span className="text-[11px] text-neutral-800 dark:text-neutral-200 font-medium">MOQ 20 Pcs</span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-1 text-[11px] text-foreground/50 font-sans">
          <span className="truncate">Sizes S–XXL</span>
          <span className="text-foreground/60 font-medium shrink-0">
            Export Grade
          </span>
        </div>

        {/* Dual CTAs: Exact Symmetric Side-by-Side Pills on Both Mobile & Desktop */}
        <div className="mt-2.5 flex items-center gap-1.5 sm:gap-2 w-full">
          {/* Enquire Pill (50% Symmetric) */}
          <button
            type="button"
            onClick={handleOpenEnquiry}
            className="flex-1 py-1.5 px-1.5 sm:px-2.5 rounded-full border border-[#0B2D7F] text-[#0B2D7F] dark:border-white/30 dark:text-white hover:bg-[#0B2D7F] hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 text-[10.5px] sm:text-[11px] font-medium text-center flex items-center justify-center transition-all cursor-pointer truncate shadow-2xs"
            aria-label={`Enquire about ${product.title}`}
          >
            Enquire
          </button>

          {/* WhatsApp Pill (50% Symmetric with Authentic WhatsApp Logo) */}
          <button
            type="button"
            onClick={handleWhatsAppEnquiry}
            className="flex-1 py-1.5 px-1.5 sm:px-2.5 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-[10.5px] sm:text-[11px] font-medium flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-2xs truncate"
            aria-label="Enquire on WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="truncate">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* B2B Enquiry Modal */}
      {isEnquiryOpen && (
        <B2BEnquiryModal
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          product={product}
        />
      )}
    </div>
  );
}

export default memo(ProductCardComponent);
