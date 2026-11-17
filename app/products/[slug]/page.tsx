'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Heart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { NISHORAMA_PRODUCTS, NishoramaProduct } from '@/data/nishorama-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

// Authentic Official WhatsApp Logo SVG Icon
function WhatsAppIcon({ className = 'w-4 h-4 fill-current shrink-0' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}

interface Props {
  params: {
    slug: string;
  };
}

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetailPage({ params }: Props) {
  // Read initial product and check if archived or deleted
  const initialItem = React.useMemo(() => {
    const rawSlug = decodeURIComponent(params.slug || '').toLowerCase().trim();
    if (typeof window !== 'undefined') {
      try {
        const local =
          localStorage.getItem('wastram_products_overrides') ||
          localStorage.getItem('ixos_products_overrides');
        if (local) {
          const parsed = JSON.parse(local);
          const ovr =
            parsed[rawSlug] ||
            Object.values(parsed).find(
              (o: any) => o?.slug?.toLowerCase() === rawSlug || o?.id?.toLowerCase() === rawSlug
            );
          if (ovr?.deleted || ovr?.purged || ovr?.is_hidden) return null;
        }
      } catch (_) {}
    }
    const found = NISHORAMA_PRODUCTS.find(
      (p) =>
        p.slug?.toLowerCase() === rawSlug ||
        p.id?.toLowerCase() === rawSlug ||
        p.partNumber?.toLowerCase() === rawSlug ||
        (p as any).aliasSlugs?.some((a: string) => a.toLowerCase() === rawSlug)
    );
    if (!found || (found as any).deleted || (found as any).purged || (found as any).is_hidden) return null;
    return found;
  }, [params.slug]);

  const [product, setProduct] = useState<NishoramaProduct | null>(initialItem);
  const [isArchived, setIsArchived] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(!initialItem);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    fabric: true,
    fit: false,
    care: false,
    wholesale: false,
  });

  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const { addToCart, openCart, toggleWishlist, isWishlisted, openSizeGuide } = useCart();
  const wishlisted = product ? isWishlisted(product.slug) : false;

  // Sync with live product updates from admin console & API
  useEffect(() => {
    let isMounted = true;

    try {
      if (typeof window !== 'undefined') {
        const local =
          localStorage.getItem('wastram_products_overrides') ||
          localStorage.getItem('ixos_products_overrides');
        if (local) {
          const parsed = JSON.parse(local);
          const slugKey = params.slug?.toLowerCase();
          const idKey = initialItem?.id?.toLowerCase();
          const ovr = (slugKey && parsed[slugKey]) || (idKey && parsed[idKey]);
          if (ovr?.deleted || ovr?.is_hidden) {
            setIsArchived(true);
            setProduct(null);
          }
        }
      }
    } catch (_) {}

    const loadLive = async () => {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(params.slug)}?t=${Date.now()}`);
        if (!isMounted) return;

        if (res.status === 404) {
          setIsArchived(true);
          setProduct(null);
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        if (!isMounted) return;

        if (data.error || data.deleted === true || data.purged === true || data.is_hidden === true) {
          setIsArchived(true);
          setProduct(null);
          setIsLoading(false);
        } else if (data && data.id) {
          setProduct(data);
          setIsArchived(false);
          setIsLoading(false);
        }
      } catch (err) {
        if (!isMounted) return;
        try {
          const listRes = await fetch(`/api/products?t=${Date.now()}`);
          const listData = await listRes.json();
          const list = Array.isArray(listData) ? listData : listData?.products || [];
          const cleanParam = decodeURIComponent(params.slug || '').toLowerCase().trim();
          const found = list.find(
            (p: any) =>
              p.slug?.toLowerCase() === cleanParam ||
              p.id?.toLowerCase() === cleanParam ||
              (p.partNumber || p.sku || '').toLowerCase() === cleanParam
          );
          if (!isMounted) return;

          if (!found || found.deleted || found.purged || found.is_hidden) {
            setIsArchived(true);
            setProduct(null);
          } else {
            setProduct(found);
            setIsArchived(false);
          }
        } catch (_) {
          if (!initialItem) setIsArchived(true);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      }
    };

    loadLive();

    try {
      const ch1 = new BroadcastChannel('wastram_products_sync');
      const ch2 = new BroadcastChannel('ixos_products_sync');
      const onMsg = () => loadLive();
      ch1.onmessage = onMsg;
      ch2.onmessage = onMsg;
      return () => {
        isMounted = false;
        ch1.close();
        ch2.close();
      };
    } catch (_) {
      return () => {
        isMounted = false;
      };
    }
  }, [params.slug, initialItem]);

  if (isArchived) {
    notFound();
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFEFE] dark:bg-[#0E0C0A]">
        <div className="w-10 h-10 border-4 border-neutral-300 border-t-[#0B2D7F] rounded-full animate-spin" />
      </div>
    );
  }

  // Normalize gallery images
  const rawImages: any[] =
    (Array.isArray(product.images) && product.images.length > 0 && product.images) ||
    (Array.isArray((product as any).gallery) && (product as any).gallery.length > 0 && (product as any).gallery) ||
    (Array.isArray((product as any).galleryImages) && (product as any).galleryImages.length > 0 && (product as any).galleryImages) ||
    [product.image || (product as any).featured_image || (product as any).mainImage || '/placeholder.jpg'];

  const images: string[] = rawImages
    .map((item: any) => {
      if (!item) return '';
      if (typeof item === 'string') return item;
      return item.url || item.src || item.image || '';
    })
    .filter((url: string) => typeof url === 'string' && url.trim().length > 0 && !url.includes('[object'));

  if (images.length === 0) {
    const fallback = product.image || (product as any).featured_image || (product as any).mainImage || '/placeholder.jpg';
    images.push(typeof fallback === 'string' ? fallback : fallback?.url || '/placeholder.jpg');
  }

  const currentHeroImg = images[activeImageIndex] || images[0];

  const availableSizes =
    product.sizes && product.sizes.length > 0 ? product.sizes : ALL_SIZES;

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, 1);
    openCart();
  };

  // WhatsApp Enquiry Link
  const whatsappInquiryUrl = `https://wa.me/918003088838?text=${encodeURIComponent(
    `Hello Wastram Jaipur Atelier, I would like to enquire about:
• Silhouette: ${product.title}
• SKU / Code: ${product.sku || product.id}
• Sourcing MOQ: 20 Pcs / Style
• Selected Size: ${selectedSize}

Please share the wholesale lookbook and trade quotation.`
  )}`;

  const relatedProducts = NISHORAMA_PRODUCTS.filter(
    (p) => !p.deleted && !p.is_hidden && p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  // Mobile scroll tracking
  const handleMobileScroll = () => {
    if (!mobileCarouselRef.current) return;
    const scrollLeft = mobileCarouselRef.current.scrollLeft;
    const width = mobileCarouselRef.current.offsetWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex >= 0 && newIndex < images.length && newIndex !== activeImageIndex) {
        setActiveImageIndex(newIndex);
      }
    }
  };

  const scrollToMobileImage = (idx: number) => {
    if (!mobileCarouselRef.current) return;
    const width = mobileCarouselRef.current.offsetWidth;
    mobileCarouselRef.current.scrollTo({
      left: idx * width,
      behavior: 'smooth',
    });
    setActiveImageIndex(idx);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#0E0C0A] text-foreground pt-24 md:pt-28 font-sans selection:bg-[#0B2D7F] selection:text-white pb-24 lg:pb-12">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 container-x py-4 md:py-6">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-5">
          <Link href="/" className="hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${product.category || 'cord-sets'}`}
            className="hover:text-[#0B2D7F] dark:hover:text-[#D4AF37] transition-colors capitalize"
          >
            {product.category?.replace(/-/g, ' ') || 'Collection'}
          </Link>
          <span>/</span>
          <span className="text-[#0B2D7F] dark:text-[#D4AF37] font-medium truncate max-w-[200px] sm:max-w-xs">
            {product.title}
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 1. DESKTOP LAYOUT (>= 1024px): 12-Column Asymmetric Sticky Layout         */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left Column (7 Cols): Multi-image Gallery Frame */}
          <div className="lg:col-span-7 flex gap-4 items-start">
            {/* Vertical Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex flex-col gap-3 overflow-y-auto no-scrollbar w-20 shrink-0 max-h-[680px]">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-28 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#0B2D7F] dark:border-[#D4AF37] shadow-md scale-102'
                        : 'border-transparent hover:border-neutral-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image in Full Natural Frame */}
            <div className="flex-1 relative w-full overflow-hidden rounded-[32px] bg-[#FFFEFE] dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 shadow-lg group">
              <img
                src={currentHeroImg}
                alt={product.title}
                className="w-full h-auto object-contain block transition-transform duration-700 ease-out group-hover:scale-102"
              />

              {/* Top Floating Provenance Tag */}
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-serif font-medium bg-[#0B2D7F] text-white shadow-sm">
                  Sanganer Atelier
                </span>
              </div>

              {/* Top Floating Photo Counter */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-sans font-medium bg-white/90 dark:bg-black/80 backdrop-blur-md text-neutral-800 dark:text-neutral-200 shadow-xs border border-white/40">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): Sticky Editorial Sourcing Card */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            {/* Title Block */}
            <div>
              <div className="section-pill mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
                <span>{product.fabric || 'Pure Handloom Fabric'}</span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="font-serif text-3xl xl:text-4xl text-[#0B2D7F] dark:text-white font-normal leading-tight">
                  {product.title}
                </h1>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.slug)}
                  className={`w-11 h-11 rounded-full border border-neutral-200 dark:border-white/10 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    wishlisted
                      ? 'bg-[#0B2D7F] text-white border-[#0B2D7F] shadow-sm'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                  aria-label="Save to wishlist"
                >
                  <Heart size={18} className={wishlisted ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            {/* Minimal Specifications Strip (Zero Redundancy - No duplicate size text) */}
            <div className="p-4 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[10.5px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block font-sans">
                  Batch MOQ
                </span>
                <span className="font-serif text-xs sm:text-sm font-medium text-neutral-900 dark:text-white mt-0.5 block">
                  20 Pcs / Style
                </span>
              </div>
              <div className="border-x border-neutral-200 dark:border-white/10 px-2">
                <span className="text-[10.5px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block font-sans">
                  Trade Pricing
                </span>
                <span className="font-serif text-xs sm:text-sm font-medium text-[#0B2D7F] dark:text-[#D4AF37] mt-0.5 block">
                  Direct Quote
                </span>
              </div>
              <div>
                <span className="text-[10.5px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block font-sans">
                  Atelier SKU
                </span>
                <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white mt-0.5 block truncate">
                  {product.sku || product.id}
                </span>
              </div>
            </div>

            {/* Interactive Size Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Select Size
                </span>
                <button
                  type="button"
                  onClick={openSizeGuide}
                  className="font-medium text-[#0B2D7F] dark:text-[#D4AF37] hover:underline cursor-pointer"
                >
                  Size guide &amp; measurements
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[48px] h-11 px-4 rounded-full text-xs font-medium font-sans transition-all duration-200 cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#0B2D7F] text-white shadow-md shadow-[#0B2D7F]/25 dark:bg-[#D4AF37] dark:text-neutral-950'
                        : 'bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 text-neutral-800 dark:text-neutral-200 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Exactly Two Symmetric CTAs (WhatsApp Trade Desk & Add to Quote Bag) */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              {/* CTA 1: WhatsApp Trade Desk (Primary #0B2D7F) */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-md shadow-[#0B2D7F]/20 transition-all active:scale-98 cursor-pointer truncate"
              >
                <WhatsAppIcon className="w-4 h-4 fill-[#25D366] shrink-0" />
                <span className="truncate">WhatsApp Trade Desk</span>
              </a>

              {/* CTA 2: Add to Quote Bag (Symmetric Outline) */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3.5 px-4 rounded-full border border-[#0B2D7F] text-[#0B2D7F] dark:border-[#D4AF37] dark:text-[#D4AF37] hover:bg-[#0B2D7F] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-neutral-950 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer truncate"
              >
                <ShoppingBag size={15} className="shrink-0" />
                <span className="truncate">Add to Quote Bag</span>
              </button>
            </div>

            {/* Minimal Accordions */}
            <div className="border-t border-neutral-200/80 dark:border-white/10 divide-y divide-neutral-200/80 dark:divide-white/10 text-xs font-sans pt-2">
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('fabric')}
                  className="w-full py-3.5 flex items-center justify-between text-left font-serif text-sm font-medium text-neutral-900 dark:text-white cursor-pointer"
                >
                  <span>Fabric &amp; Atelier Craft</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openAccordions.fabric ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.fabric && (
                  <div className="pb-4 text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed font-sans">
                    <p>
                      Authentic Jaipur handblock printing using master-carved teakwood blocks. Dyed in colorfast natural formulations on breathable premium fabric.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('fit')}
                  className="w-full py-3.5 flex items-center justify-between text-left font-serif text-sm font-medium text-neutral-900 dark:text-white cursor-pointer"
                >
                  <span>Fit &amp; Sizing Ease</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openAccordions.fit ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.fit && (
                  <div className="pb-4 text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed font-sans">
                    <p>
                      Tailored with generous ease for fluid drape and comfort. Proportioned individually from S to XXL for boutique retail.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-3.5 flex items-center justify-between text-left font-serif text-sm font-medium text-neutral-900 dark:text-white cursor-pointer"
                >
                  <span>Care Instructions</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openAccordions.care ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.care && (
                  <div className="pb-4 text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed font-sans">
                    <p>
                      Dry clean recommended for first wash. Subsequent gentle cold hand wash separately. Dry in shade inside out.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('wholesale')}
                  className="w-full py-3.5 flex items-center justify-between text-left font-serif text-sm font-medium text-neutral-900 dark:text-white cursor-pointer"
                >
                  <span>Wholesale Terms</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openAccordions.wholesale ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.wholesale && (
                  <div className="pb-4 text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed font-sans">
                    <p>
                      Low-batch atelier supply for domestic and diaspora boutiques. Flexible ratio packs, custom branding tags, and door-to-door global air freight.
                    </p>
                    <Link
                      href="/wholesale"
                      className="text-[#0B2D7F] dark:text-[#D4AF37] font-semibold underline underline-offset-4 inline-block mt-1"
                    >
                      Explore Wholesale Terms →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MOBILE LAYOUT (< 1024px): Tactile Swipeable Native Feel                */}
        {/* ========================================================================= */}
        <div className="lg:hidden space-y-5">
          {/* Mobile Image Carousel */}
          <div className="relative">
            <div
              ref={mobileCarouselRef}
              onScroll={handleMobileScroll}
              className="w-full aspect-[3/4] sm:aspect-[4/5] rounded-[28px] overflow-x-auto flex snap-x snap-mandatory no-scrollbar bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 shadow-md"
            >
              {images.map((img, idx) => (
                <div key={idx} className="min-w-full h-full snap-center relative">
                  <img
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ))}
            </div>

            {/* Top Floating Category Tag */}
            <div className="absolute top-3.5 left-3.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-serif font-medium bg-[#0B2D7F] text-white shadow-xs">
                Sanganer Atelier
              </span>
            </div>

            {/* Top Floating Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center transition-all cursor-pointer ${
                wishlisted
                  ? 'bg-[#0B2D7F] text-white'
                  : 'bg-white/85 dark:bg-black/70 text-neutral-700 dark:text-neutral-200'
              }`}
              aria-label="Save to wishlist"
            >
              <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
            </button>

            {/* Bottom Floating Counter */}
            <div className="absolute bottom-3.5 right-3.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-sans font-medium bg-black/60 backdrop-blur-md text-white shadow-xs">
              {activeImageIndex + 1} / {images.length}
            </div>

            {/* Dot Indicators */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-3">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToMobileImage(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeImageIndex === idx
                        ? 'w-6 bg-[#0B2D7F] dark:bg-[#D4AF37]'
                        : 'w-1.5 bg-neutral-300 dark:bg-neutral-700'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Header & Minimal Info */}
          <div className="space-y-3 pt-1">
            <div className="section-pill">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
              <span>{product.fabric || 'Pure Handloom Fabric'}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-[#0B2D7F] dark:text-white font-normal leading-snug">
              {product.title}
            </h1>

            {/* Minimal Mobile Specs Row (No redundancy) */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-sans pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span className="font-medium text-neutral-800 dark:text-neutral-200">MOQ 20 Pcs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span className="font-mono text-[11px] font-medium">{product.sku || product.id}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F] dark:bg-[#D4AF37]" />
                <span>Trade Quote</span>
              </div>
            </div>
          </div>

          {/* Sizing Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Select Size
              </span>
              <button
                type="button"
                onClick={openSizeGuide}
                className="font-medium text-[#0B2D7F] dark:text-[#D4AF37] hover:underline cursor-pointer"
              >
                Size guide &amp; measurements
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`min-w-[44px] h-10 px-3.5 rounded-full text-xs font-medium font-sans transition-all duration-200 cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-[#0B2D7F] text-white shadow-md shadow-[#0B2D7F]/25 dark:bg-[#D4AF37] dark:text-neutral-950'
                      : 'bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Inline Dual CTAs (50/50 Symmetric) */}
          <div className="grid grid-cols-2 gap-2.5 pt-3">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-md shadow-[#0B2D7F]/20 active:scale-98 cursor-pointer truncate"
            >
              <WhatsAppIcon className="w-4 h-4 fill-[#25D366] shrink-0" />
              <span className="truncate">WhatsApp Trade</span>
            </a>

            <button
              type="button"
              onClick={handleAddToCart}
              className="py-3 px-3 rounded-full border border-[#0B2D7F] text-[#0B2D7F] dark:border-[#D4AF37] dark:text-[#D4AF37] hover:bg-[#0B2D7F] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-neutral-950 text-xs font-medium flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer truncate"
            >
              <ShoppingBag size={14} className="shrink-0" />
              <span className="truncate">Add to Quote Bag</span>
            </button>
          </div>

          {/* Minimal Mobile Accordions */}
          <div className="border-t border-neutral-200/80 dark:border-white/10 divide-y divide-neutral-200/80 dark:divide-white/10 text-xs font-sans pt-2">
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('fabric')}
                className="w-full py-3.5 flex items-center justify-between text-left font-serif text-sm font-medium text-neutral-900 dark:text-white cursor-pointer"
              >
                <span>Fabric &amp; Atelier Craft</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    openAccordions.fabric ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions.fabric && (
                <div className="pb-3 text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed font-sans">
                  <p>
                    Authentic Jaipur handblock printing using master-carved teakwood blocks. Dyed in colorfast natural formulations on breathable premium fabric.
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('fit')}
                className="w-full py-3.5 flex items-center justify-between text-left font-serif text-sm font-medium text-neutral-900 dark:text-white cursor-pointer"
              >
                <span>Fit &amp; Sizing Ease</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    openAccordions.fit ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions.fit && (
                <div className="pb-3 text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed font-sans">
                  <p>
                    Tailored with generous ease for fluid drape and comfort. Proportioned individually from S to XXL for boutique retail.
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('care')}
                className="w-full py-3.5 flex items-center justify-between text-left font-serif text-sm font-medium text-neutral-900 dark:text-white cursor-pointer"
              >
                <span>Care Instructions</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    openAccordions.care ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions.care && (
                <div className="pb-3 text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed font-sans">
                  <p>
                    Dry clean recommended for first wash. Subsequent gentle cold hand wash separately. Dry in shade inside out.
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('wholesale')}
                className="w-full py-3.5 flex items-center justify-between text-left font-serif text-sm font-medium text-neutral-900 dark:text-white cursor-pointer"
              >
                <span>Wholesale Terms</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    openAccordions.wholesale ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordions.wholesale && (
                <div className="pb-3 text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed font-sans">
                  <p>
                    Low-batch atelier supply for domestic and diaspora boutiques. Flexible ratio packs, custom branding tags, and door-to-door global air freight.
                  </p>
                  <Link
                    href="/wholesale"
                    className="text-[#0B2D7F] dark:text-[#D4AF37] font-semibold underline underline-offset-4 inline-block mt-1"
                  >
                    Explore Wholesale Terms →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Sticky Bottom Mobile Bar with Exactly Two Symmetric CTAs */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#12100E]/95 backdrop-blur-md border-t border-neutral-200/80 dark:border-white/10 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl flex items-center gap-3">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-3 rounded-full bg-[#0B2D7F] hover:bg-[#071F59] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-[#0B2D7F]/20 active:scale-98 cursor-pointer truncate"
            >
              <WhatsAppIcon className="w-4 h-4 fill-[#25D366] shrink-0" />
              <span className="truncate">WhatsApp Trade</span>
            </a>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3 px-3 rounded-full border border-[#0B2D7F] text-[#0B2D7F] dark:border-[#D4AF37] dark:text-[#D4AF37] hover:bg-[#0B2D7F] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-neutral-950 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer truncate"
            >
              <ShoppingBag size={14} className="shrink-0" />
              <span className="truncate">Quote Bag</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. WEAR IT THREE WAYS SECTION (Standardized Centered Heading Layout)      */}
        {/* ========================================================================= */}
        <div className="mt-20 pt-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <div className="section-pill mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
              <span>Versatile Styling</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B2D7F] dark:text-white font-normal">
              Wear It Three Ways &amp; <span className="text-[#D4AF37] italic font-normal">Styling Edit.</span>
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl mx-auto">
              Versatile styling notes for daywear, occasion layering, and travel ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-700 dark:text-neutral-300">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] shadow-sm hover:shadow-xl hover:shadow-[#0B2D7F]/10 hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
              <span className="font-serif text-xl text-neutral-400 dark:text-neutral-500 font-light block mb-2">01</span>
              <h4 className="font-serif text-base font-medium text-neutral-900 dark:text-white mb-1.5">
                Minimalist Everyday
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                Style as a single piece with flat leather juttis and bare ears for summer workdays, casual café catchups, and studio hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] shadow-sm hover:shadow-xl hover:shadow-[#0B2D7F]/10 hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
              <span className="font-serif text-xl text-neutral-400 dark:text-neutral-500 font-light block mb-2">02</span>
              <h4 className="font-serif text-base font-medium text-neutral-900 dark:text-white mb-1.5">
                Festive Occasion
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                Add an organza zari dupatta, oxidised silver jhumkas, and a potli bag for temple visits, family sangeets, and festival dinners.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-[#0B2D7F] dark:hover:border-[#D4AF37] shadow-sm hover:shadow-xl hover:shadow-[#0B2D7F]/10 hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
              <span className="font-serif text-xl text-neutral-400 dark:text-neutral-500 font-light block mb-2">03</span>
              <h4 className="font-serif text-base font-medium text-neutral-900 dark:text-white mb-1.5">
                Contemporary Fusion
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                Pair the tunic with straight-leg denim or linen trousers, rolling up the sleeves for modern fusion airport travel.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. CROSS-SELLS: MORE TO DISCOVER (Standardized Centered Heading Layout)    */}
        {/* ========================================================================= */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <div className="section-pill mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
                <span>Curated Pairings</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#0B2D7F] dark:text-white font-normal">
                More to Discover &amp; <span className="text-[#D4AF37] italic font-normal">Related Silhouettes.</span>
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl mx-auto">
                Complementary silhouettes from our Jaipur handloom workshops.
              </p>
              <div className="mt-4">
                <Link
                  href={`/collections/${product.category || 'shop-all'}`}
                  className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0B2D7F] hover:text-[#071F59] dark:text-[#D4AF37] transition-colors"
                >
                  <span>View collection</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
      <SizeGuideModal />
      <FloatingWhatsApp />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
