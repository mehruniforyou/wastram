'use client';

import React, { memo, useState } from 'react';
import Link from 'next/link';
import { Heart, Plus, MessageCircle } from 'lucide-react';
import { NishoramaProduct } from '@/data/nishorama-data';
import { useCart } from '@/context/CartContext';
import B2BEnquiryModal from './B2BEnquiryModal';

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

        {/* Dual CTAs: Side-by-side on Desktop (50/50 symmetric pills) & Mobile (80% Enquire pill + 20% WhatsApp circular icon) */}
        <div className="mt-2.5 flex items-center gap-1.5 sm:gap-2 w-full">
          {/* Enquire Button: 80% on mobile, symmetric 50% (flex-1) on desktop */}
          <button
            type="button"
            onClick={handleOpenEnquiry}
            className="w-[78%] sm:w-[80%] md:w-auto md:flex-1 py-1.5 px-2.5 rounded-full border border-[#0B2D7F] text-[#0B2D7F] dark:border-white/30 dark:text-white hover:bg-[#0B2D7F] hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 text-[11px] font-medium text-center transition-all cursor-pointer truncate shadow-2xs"
            aria-label={`Enquire about ${product.title}`}
          >
            Enquire
          </button>

          {/* WhatsApp Button Desktop: Symmetric 50% flex-1 pill with icon and text */}
          <button
            type="button"
            onClick={handleWhatsAppEnquiry}
            className="hidden md:flex flex-1 py-1.5 px-2.5 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-[11px] font-medium items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
            aria-label="Enquire on WhatsApp"
          >
            <MessageCircle size={13} className="shrink-0" />
            <span>WhatsApp</span>
          </button>

          {/* WhatsApp Button Mobile: 20% width circular icon button */}
          <button
            type="button"
            onClick={handleWhatsAppEnquiry}
            className="flex md:hidden w-[22%] sm:w-[20%] aspect-square max-w-[34px] rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white items-center justify-center shrink-0 transition-all cursor-pointer shadow-2xs"
            aria-label="Enquire on WhatsApp"
          >
            <MessageCircle size={14} />
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
