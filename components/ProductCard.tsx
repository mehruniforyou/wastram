'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Heart, Plus, MessageCircle } from 'lucide-react';
import { NishoramaProduct } from '@/data/nishorama-data';
import { useCart } from '@/context/CartContext';

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
      {/* 1. 3:4 Portrait Image Container with Hover Zoom & Secondary Cross-fade */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#FFFEFE] border border-[#E7E5E4]/80 dark:border-white/10 shadow-xs">
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

        {/* Badges: Top Left in Brand Blue */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge ? (
            <span className="bg-[#0B2D7F] text-white text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
              {product.badge}
            </span>
          ) : (
            <span className="bg-[#0B2D7F] text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full shadow-xs">
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
              ? 'bg-[#0B2D7F] text-white'
              : 'bg-white/85 dark:bg-black/60 text-foreground/70 hover:text-[#0B2D7F] hover:scale-110'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart size={15} className={wishlisted ? 'fill-current' : ''} />
        </button>

        {/* Floating Quick Add Button: Bottom Right */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute bottom-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/95 dark:bg-[#12100E]/95 text-foreground hover:bg-[#0B2D7F] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-black shadow-md flex items-center justify-center transition-all duration-300 transform opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 cursor-pointer"
          aria-label={`Quick add ${product.title} to bag`}
          title="Quick add to bag"
        >
          <Plus size={18} strokeWidth={2} />
        </button>
      </div>

      {/* 2. Product Meta & Wholesale Sourcing Information (No Prices) */}
      <div className="pt-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.slug}`} className="block flex-1 group-hover:text-[#0B2D7F] dark:group-hover:text-[#D4AF37] transition-colors">
            <h3 className="font-serif text-[15px] md:text-[16px] font-medium text-foreground leading-snug line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#0B2D7F] dark:text-[#D4AF37] bg-[#0B2D7F]/10 dark:bg-white/10 px-2 py-0.5 rounded-full">
              Enquiry
            </span>
          </div>
        </div>

        {/* Subtitle & Size Availability */}
        <div className="mt-1 flex items-center justify-between text-xs text-foreground/60 font-sans">
          <span className="line-clamp-1">{product.fabric || product.category || 'Pure Cotton'}</span>
          <span className="text-[11px] text-[#0B2D7F] dark:text-[#D4AF37] font-medium">MOQ 20 Pcs</span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-1 text-[11px] text-foreground/50 font-sans">
          <span className="truncate">Sizes S–XXL</span>
          <span className="text-foreground/60 font-medium shrink-0">
            Export Grade
          </span>
        </div>

        {/* Direct WhatsApp Concierge Micro-CTA on Hover / Mobile */}
        <button
          type="button"
          onClick={handleWhatsAppEnquiry}
          className="mt-2.5 w-full py-1.5 px-3 rounded-full border border-[#0B2D7F]/40 hover:border-[#0B2D7F] bg-[#0B2D7F]/5 hover:bg-[#0B2D7F] hover:text-white text-[#0B2D7F] dark:text-[#D4AF37] text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer group/wa"
        >
          <MessageCircle size={12} className="text-[#0B2D7F] group-hover/wa:text-white" />
          <span>Enquire on WhatsApp</span>
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCardComponent);
