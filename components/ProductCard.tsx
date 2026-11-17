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
  const [imageLoaded, setImageLoaded] = useState(false);

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
      className="group relative flex flex-col bg-white dark:bg-[#161412] rounded-2xl p-2 sm:p-2.5 border border-neutral-200/80 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] shadow-2xs hover:shadow-xl hover:shadow-[#0B2D7F]/10 hover:-translate-y-1 transition-all duration-300"
      data-testid={`product-card-${product.slug || product.id}`}
    >
      {/* 1. 3:4 Portrait Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
        {/* Shimmer Skeleton Placeholder while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 shimmer-skeleton z-0" aria-hidden="true" />
        )}

        {/* Floating Atelier Badge on top-left of image */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-white/95 dark:bg-black/85 backdrop-blur-xs text-[#0B2D7F] dark:text-[#D4AF37] border border-neutral-200/60 dark:border-white/10 shadow-2xs uppercase tracking-wider">
            Atelier
          </span>
        </div>

        {/* Floating Heart / Wishlist Button: Top Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.slug);
          }}
          className={`absolute top-2 right-2 z-10 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xs ${
            wishlisted
              ? 'bg-[#0B2D7F] text-white shadow-md'
              : 'bg-white/90 dark:bg-black/75 text-neutral-700 hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] hover:scale-110'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart size={14} className={wishlisted ? 'fill-current' : ''} />
        </button>

        {/* Floating Quick Add Button: Bottom Right (Desktop) */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="hidden md:flex absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full bg-white/95 dark:bg-[#12100E]/95 text-foreground hover:bg-[#0B2D7F] hover:text-white dark:hover:bg-[#0B2D7F] dark:hover:text-white shadow-md items-center justify-center transition-all duration-300 transform opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 cursor-pointer"
          aria-label={`Quick add ${product.title} to bag`}
          title="Quick add to bag"
        >
          <Plus size={16} strokeWidth={2} />
        </button>

        <Link href={`/products/${product.slug}`} className="block w-full h-full relative z-[1]">
          {/* Primary Main Image */}
          <img
            src={displayImage}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-out will-change-transform group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${hoverImage !== displayImage ? 'group-hover:opacity-0' : ''}`}
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
      </div>

      {/* 2. Product Meta & Wholesale Sourcing Information */}
      <div className="pt-2 sm:pt-2.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Fabric Tag */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-wider text-[#0B2D7F] dark:text-[#D4AF37]">
            <span className="truncate">{product.fabric || product.category || 'Pure Handloom'}</span>
            <span className="text-neutral-500 dark:text-neutral-400 font-normal normal-case shrink-0">Export</span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#0B2D7F] dark:group-hover:text-[#D4AF37] transition-colors mt-0.5">
            <h3 className="font-serif text-[13px] sm:text-[15px] font-medium text-neutral-900 dark:text-white leading-snug line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Sizing & MOQ */}
          <div className="mt-1 flex items-center justify-between text-[10px] sm:text-[11.5px] text-neutral-600 dark:text-neutral-400 font-sans">
            <span className="truncate">Sizes S to XXL</span>
            <span className="font-semibold text-neutral-900 dark:text-white shrink-0">MOQ 20 Pcs</span>
          </div>
        </div>

        {/* Dual CTAs: Symmetric 2-Pill Grid for Flawless Mobile & Desktop Fit */}
        <div className="mt-2.5 grid grid-cols-2 gap-1.5 w-full">
          {/* Enquire Pill */}
          <button
            type="button"
            onClick={handleOpenEnquiry}
            className="py-1.5 px-1 rounded-full border border-[#0B2D7F] text-[#0B2D7F] dark:border-white/30 dark:text-white hover:bg-[#0B2D7F] hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 text-[10px] sm:text-[11px] font-medium text-center flex items-center justify-center transition-all truncate active:scale-98"
            aria-label={`Enquire about ${product.title}`}
          >
            Enquire
          </button>

          {/* WhatsApp Pill */}
          <button
            type="button"
            onClick={handleWhatsAppEnquiry}
            className="py-1.5 px-1 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 transition-all truncate active:scale-98 shadow-2xs"
            aria-label="Enquire on WhatsApp"
          >
            <WhatsAppIcon className="w-3 h-3 fill-current shrink-0" />
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
