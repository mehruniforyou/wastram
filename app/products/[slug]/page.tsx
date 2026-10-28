'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopularSearches from '@/components/PopularSearches';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import StoryViewerModal from '@/components/StoryViewerModal';
import SearchModal from '@/components/SearchModal';
import { useCart } from '@/context/CartContext';

interface Props {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = NISHORAMA_PRODUCTS.find(p => p.slug === params.slug) || NISHORAMA_PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<'desc' | 'fabric' | 'shipping'>('desc');

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const wishlisted = isWishlisted(product.slug);

  const relatedProducts = NISHORAMA_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <StoryViewerModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-3 text-xs font-archivo text-black/50 flex items-center gap-2">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link href="/collections/shop-all" className="hover:text-black">Shop All</Link>
        <span>/</span>
        <span className="text-[#482922] font-semibold line-clamp-1">{product.title}</span>
      </div>

      {/* Main Product Container */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-4 md:py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================== */}
          {/* LEFT: GALLERY                                              */}
          {/* ========================================================== */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-[#F5F5F5] ${
                    activeImageIndex === idx
                      ? 'border-[#482922] shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5F5F5] border border-black/5 shadow-sm">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {/* Discount Badge */}
              <span className="absolute top-4 left-4 bg-white/95 text-[#FF2F00] font-archivo font-black text-xs px-2.5 py-1 rounded shadow-sm border border-[#FF2F00]/20">
                {product.badge}
              </span>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.slug)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-[#482922] shadow transition-transform active:scale-90"
                aria-label="Toggle wishlist"
              >
                <svg
                  className="w-5 h-5"
                  fill={wishlisted ? '#FF2F00' : 'none'}
                  stroke={wishlisted ? '#FF2F00' : 'currentColor'}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>

          {/* ========================================================== */}
          {/* RIGHT: PRODUCT INFO & ORDER ACTIONS                        */}
          {/* ========================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-5 font-archivo">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#FF2F00] font-bold">
                DIWALI SPECIAL OFFER
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-[#482922] uppercase tracking-tight mt-1">
                {product.title}
              </h1>

              {/* Price Row */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-sm line-through text-black/40 font-medium">
                  ₹ {product.regularPrice.toLocaleString()}
                </span>
                <span className="text-2xl font-black text-[#FF2F00]">
                  ₹ {product.salePrice.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Save ₹ {(product.regularPrice - product.salePrice).toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-black/50 mt-1">Inclusive of all taxes. Free shipping on orders &gt; ₹2999.</p>
            </div>

            {/* Offer Banner */}
            <div className="p-3 bg-[#FFF3E8] border border-[#FF5400]/30 rounded-xl text-xs text-[#482922] flex items-center gap-2">
              <span className="text-base">🎁</span>
              <span><strong>Buy 2 items:</strong> Get Free Pants worth ₹1399 automatically applied!</span>
            </div>

            {/* Size Selector */}
            <div className="flex flex-col gap-2 pt-2 border-t border-black/5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#482922] uppercase tracking-wide">Select Size: {selectedSize}</span>
                <button
                  type="button"
                  onClick={() => alert('Standard Size Guide:\nXS: Bust 32" | Waist 26"\nS: Bust 34" | Waist 28"\nM: Bust 36" | Waist 30"\nL: Bust 38" | Waist 32"\nXL: Bust 40" | Waist 34"\nXXL: Bust 42" | Waist 36"')}
                  className="text-black/60 hover:text-black underline text-[11px]"
                >
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      selectedSize === size
                        ? 'border-[#482922] bg-[#482922] text-white shadow-sm'
                        : 'border-black/15 bg-white text-[#482922] hover:border-black/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-semibold text-[#482922] uppercase tracking-wide">Quantity:</span>
              <div className="flex items-center border border-black/20 rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-xs text-black/70 hover:bg-black/5"
                >
                  −
                </button>
                <span className="px-3 text-xs font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-1.5 text-xs text-black/70 hover:bg-black/5"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 rounded-full bg-[#482922] hover:bg-[#38201a] text-white font-archivo font-bold text-xs uppercase tracking-widest shadow-md transition-colors"
              >
                ADD TO BAG
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 rounded-full bg-[#FF2F00] hover:bg-[#e02900] text-white font-archivo font-black text-xs uppercase tracking-widest shadow-lg transition-colors"
              >
                BUY NOW &bull; ₹ {(product.salePrice * quantity).toLocaleString()}
              </button>
            </div>

            {/* Accordions */}
            <div className="flex flex-col divide-y divide-black/10 border-t border-black/10 pt-4 text-xs">
              {/* Description */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'desc' ? 'fabric' : 'desc')}
                  className="w-full flex items-center justify-between font-bold text-[#482922] uppercase tracking-wide"
                >
                  <span>Description &amp; Fit</span>
                  <span className="text-base">{openSection === 'desc' ? '−' : '+'}</span>
                </button>
                {openSection === 'desc' && (
                  <div className="mt-2 text-black/70 leading-relaxed space-y-2">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Fabric & Care */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'fabric' ? 'desc' : 'fabric')}
                  className="w-full flex items-center justify-between font-bold text-[#482922] uppercase tracking-wide"
                >
                  <span>Fabric &amp; Care</span>
                  <span className="text-base">{openSection === 'fabric' ? '−' : '+'}</span>
                </button>
                {openSection === 'fabric' && (
                  <div className="mt-2 text-black/70 leading-relaxed">
                    <p><strong>Fabric: </strong>{product.fabric}</p>
                    <p className="mt-1">Handcrafted with natural colorfast dyes. Gentle machine wash in cold water with similar colors. Do not bleach. Warm iron on reverse.</p>
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'shipping' ? 'desc' : 'shipping')}
                  className="w-full flex items-center justify-between font-bold text-[#482922] uppercase tracking-wide"
                >
                  <span>Shipping &amp; 7-Day Returns</span>
                  <span className="text-base">{openSection === 'shipping' ? '−' : '+'}</span>
                </button>
                {openSection === 'shipping' && (
                  <div className="mt-2 text-black/70 leading-relaxed space-y-1">
                    <p>• Fast dispatch within 24-48 business hours.</p>
                    <p>• Delivery across India in 3 to 5 working days.</p>
                    <p>• 7-day hassle-free exchange &amp; return policy.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-12 border-t border-black/10">
          <h3 className="text-xl md:text-2xl font-black text-[#482922] uppercase font-archivo mb-6">
            You May Also Like
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map(rel => (
              <Link
                key={rel.id}
                href={`/products/${rel.slug}`}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-black/5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-[3/4] bg-[#F5F5F5] overflow-hidden">
                  <img
                    src={rel.images[0]}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-white/95 text-[#FF2F00] font-archivo font-black text-[10px] px-2 py-0.5 rounded shadow-sm">
                    {rel.badge}
                  </span>
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <h4 className="text-xs font-semibold text-[#482922] line-clamp-1">{rel.title}</h4>
                  <div className="flex items-center gap-2 text-xs font-archivo">
                    <span className="line-through text-black/40 text-[11px]">₹ {rel.regularPrice.toLocaleString()}</span>
                    <span className="font-bold text-[#FF2F00]">₹ {rel.salePrice.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <PopularSearches />
    </div>
  );
}
