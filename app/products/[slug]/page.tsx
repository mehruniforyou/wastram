'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Heart,
  MessageCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Scissors,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
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
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    fabric: true,
    fit: false,
    care: false,
    wholesale: false,
  });

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

  // Normalize gallery images into clean string URLs to prevent vanishing or [object Object] errors
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

  const price = product.price || 1499;
  const regularPrice = product.regularPrice || Math.round(price * 1.33);
  const discountPercent = Math.round(((regularPrice - price) / regularPrice) * 100);

  const availableSizes =
    product.sizes && product.sizes.length > 0 ? product.sizes : ALL_SIZES;

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length >= 4) {
      setPincodeStatus('Verified destination! Insured air cargo dispatch in 2–3 business days with door-to-door tracking.');
    } else {
      setPincodeStatus('Please enter a valid PIN code or Postal Code.');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, 1);
    openCart();
  };

  const whatsappInquiryUrl = `https://wa.me/918003088838?text=${encodeURIComponent(
    `Hello Wastram Jaipur Atelier, I would like to submit a wholesale boutique enquiry for ${product.title} (SKU: ${
      product.sku || product.id
    }, Preferred Size: ${selectedSize}, MOQ: 20+ pcs). Please share export tier pricing and delivery lead time.`
  )}`;

  const sampleOrderUrl = `https://wa.me/918003088838?text=${encodeURIComponent(
    `Hello Wastram Atelier, I would like to order a sample piece of ${product.title} (SKU: ${
      product.sku || product.id
    }, Size: ${selectedSize}) to inspect fabric and tailoring quality before our boutique bulk order.`
  )}`;

  const relatedProducts = NISHORAMA_PRODUCTS.filter(
    (p) => !p.deleted && !p.is_hidden && p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFE] dark:bg-[#0E0C0A] text-foreground pt-24 md:pt-28 font-sans selection:bg-[#0B2D7F] selection:text-white">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />

      <main className="flex-1 container-x py-4 md:py-6">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-ink-500 dark:text-neutral-400 mb-4">
          <Link href="/" className="hover:text-[#0B2D7F] dark:hover:text-amber-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/collections/${product.category || 'cord-sets'}`}
            className="hover:text-[#0B2D7F] dark:hover:text-amber-400 transition-colors capitalize"
          >
            {product.category?.replace(/-/g, ' ') || 'Collection'}
          </Link>
          <span>/</span>
          <span className="text-[#0B2D7F] dark:text-amber-400 font-medium truncate max-w-[200px] sm:max-w-xs">
            {product.title}
          </span>
        </div>

        {/* 2-Column Desktop Grid / 1-Column Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ======================================================== */}
          {/* LEFT: GALLERY WITH THUMBNAIL STRIP & HERO IMAGE          */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 items-start">
            {/* Vertical Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-20 shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-22 md:w-20 md:h-28 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-neutral-900 dark:border-white shadow-sm'
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

            {/* Main Image in Tall Vertical Frame (No image cutting, full natural height) */}
            <div className="flex-1 relative w-full overflow-hidden rounded-2xl bg-[#FFFEFE] dark:bg-neutral-900 border border-ink-100 dark:border-white/5 shadow-md">
              <img
                src={currentHeroImg}
                alt={product.title}
                className="w-full h-auto object-contain block transition-all duration-500"
              />

              {/* Floating Image Counter */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-black/80 backdrop-blur-xs text-neutral-900 dark:text-white shadow-2xs">
                {activeImageIndex + 1} / {images.length}
              </div>

              {/* Category Provenance Tag */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-neutral-900/90 text-white dark:bg-white/90 dark:text-neutral-950 backdrop-blur-xs shadow-2xs">
                  Sanganer Handblock
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: BUY & CONCIERGE BLOCK (STICKY PINNED)            */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div>
              <div className="section-pill mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
                <span>{product.fabric || 'Pure Handloom Cotton'}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-serif text-2xl sm:text-3xl text-[#0B2D7F] dark:text-white font-normal leading-tight">
                  {product.title}
                </h1>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.slug)}
                  className="w-10 h-10 rounded-full border border-neutral-200 dark:border-white/10 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
                  aria-label="Save to wishlist"
                >
                  <Heart
                    size={18}
                    className={
                      wishlisted
                        ? 'fill-neutral-900 text-neutral-900 dark:fill-white dark:text-white'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }
                  />
                </button>
              </div>

              {/* Wholesale Specifications Banner (Zero Consumer Pricing) */}
              <div className="mt-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-white">
                  <span className="uppercase tracking-wider">Atelier Wholesale Sourcing</span>
                  <span className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-2.5 py-0.5 rounded-full text-[10px]">
                    B2B Direct
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-foreground/80 pt-1">
                  <div>
                    <span className="text-foreground/50 block text-[11px]">Wholesale MOQ</span>
                    <span className="font-semibold text-foreground">20 Pcs / Flexible Ratio</span>
                  </div>
                  <div>
                    <span className="text-foreground/50 block text-[11px]">Trade Pricing</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">Available Upon Enquiry</span>
                  </div>
                  <div>
                    <span className="text-foreground/50 block text-[11px]">Sizes Available</span>
                    <span className="font-semibold text-foreground">S, M, L, XL, XXL</span>
                  </div>
                  <div>
                    <span className="text-foreground/50 block text-[11px]">Atelier SKU</span>
                    <span className="font-semibold text-foreground font-mono">{product.sku || product.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sanganer Factory Note */}
            <div className="p-3.5 rounded-2xl bg-[#FFFEFE] dark:bg-neutral-900 border border-ink-100 dark:border-white/5 flex items-center gap-3 text-xs text-ink-700 dark:text-neutral-300 shadow-2xs">
              <Sparkles size={16} className="text-[#C5A059] shrink-0" />
              <span>
                Export-grade tailoring directly from our own workshop in Sanganer, Jaipur. Dispatched in 2–3 working days with worldwide air cargo.
              </span>
            </div>

            {/* Size Selector with Size Guide Trigger */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Available Sizing Pre-Packs
                </span>
                <button
                  type="button"
                  onClick={openSizeGuide}
                  className="text-xs font-medium text-neutral-600 dark:text-neutral-400 underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white"
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
                    className={`min-w-[44px] h-11 px-3 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900/20 dark:bg-white dark:text-neutral-950'
                        : 'bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 text-neutral-800 dark:text-neutral-200 hover:border-neutral-900 dark:hover:border-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons Stack (Clean B2B Wholesale Enquiry & Quote) */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 sm:py-4 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4 fill-current shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                  />
                </svg>
                <span>Submit Wholesale Enquiry · Size {selectedSize}</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={sampleOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 rounded-full border border-neutral-300 dark:border-white/20 text-neutral-800 dark:text-neutral-200 font-semibold text-xs sm:text-sm hover:border-neutral-900 dark:hover:border-white transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <span>Request Sample</span>
                </a>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 rounded-full border border-neutral-300 dark:border-white/20 text-neutral-800 dark:text-neutral-200 font-semibold text-xs sm:text-sm hover:border-neutral-900 dark:hover:border-white transition-colors text-center"
                >
                  <span>Add to Quote Bag</span>
                </button>
              </div>
            </div>

            {/* Delivery Pincode Checker */}
            <form onSubmit={handlePincodeCheck} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 space-y-2 shadow-2xs">
              <span className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <Truck size={14} className="text-neutral-700 dark:text-neutral-300" />
                <span>Estimate Freight &amp; Dispatch to Destination</span>
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-full border border-neutral-200 dark:border-white/10 bg-[#FFFEFE] dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Check
                </button>
              </div>
              {pincodeStatus && (
                <p className="text-[11px] text-neutral-800 dark:text-neutral-200 pt-1">
                  {pincodeStatus}
                </p>
              )}
            </form>

            {/* Accordions */}
            <div className="border-t border-ink-100 dark:border-white/10 divide-y divide-ink-100 dark:divide-white/5 text-xs font-sans">
              {/* Accordion 1 */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('fabric')}
                  className="w-full py-4 flex items-center justify-between text-left font-serif text-sm font-medium text-ink-950 dark:text-white"
                >
                  <span>Fabric & Craftsmanship</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openAccordions.fabric ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.fabric && (
                  <div className="pb-4 text-ink-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                    <p>
                      Crafted from 100% fine cotton (60-60 cambric count) hand-block printed using wooden blocks in Sanganer, Jaipur.
                    </p>
                    <p>
                      Lightweight, highly breathable, and skin-friendly for all Indian seasons. Natural vegetable dyes with colorfast lock.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2 */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('fit')}
                  className="w-full py-4 flex items-center justify-between text-left font-serif text-sm font-medium text-ink-950 dark:text-white"
                >
                  <span>Fit & Sizing</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openAccordions.fit ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.fit && (
                  <div className="pb-4 text-ink-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                    <p>
                      Cut true to Indian standard sizing with 2.5 inches of comfort ease. Graded individually from S to XXL for proportional bust, armhole, and waist fit.
                    </p>
                    <p>Model is 5'7" wearing size S.</p>
                  </div>
                )}
              </div>

              {/* Accordion 3 */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-4 flex items-center justify-between text-left font-serif text-sm font-medium text-ink-950 dark:text-white"
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
                  <div className="pb-4 text-ink-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                    <p>
                      First wash dry-clean recommended. Subsequent washes: Gentle cold hand wash separately with mild liquid detergent.
                    </p>
                    <p>Dry in shade inside out. Warm iron on reverse side.</p>
                  </div>
                )}
              </div>

              {/* Accordion 4 */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('wholesale')}
                  className="w-full py-4 flex items-center justify-between text-left font-serif text-sm font-medium text-ink-950 dark:text-white"
                >
                  <span>Wholesale & Boutique Supply</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openAccordions.wholesale ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordions.wholesale && (
                  <div className="pb-4 text-ink-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                    <p>
                      We supply retail boutiques and overseas labels. MOQ is 20 pieces across mixed sizes and styles. Custom labels and worldwide air freight available.
                    </p>
                    <Link
                      href="/wholesale"
                      className="text-[#0B2D7F] dark:text-amber-400 font-semibold underline underline-offset-4"
                    >
                      View wholesale catalog & terms →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* WEAR IT THREE WAYS STYLING ADVICE SECTION               */}
        {/* ======================================================== */}
        <div className="mt-20 pt-8">
          <div className="max-w-xl mb-8">
            <div className="section-pill mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
              <span>Versatile Styling</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal">
              Wear It Three Ways &amp; <span className="text-[#D4AF37] italic font-normal">Styling Edit.</span>
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl">
              Versatile styling notes for daywear, occasion layering, and travel ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-700 dark:text-neutral-300">
            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
              <span className="font-serif text-xl text-neutral-400 dark:text-neutral-500 font-light block mb-2">01</span>
              <h4 className="font-serif text-base font-medium text-neutral-900 dark:text-white mb-1.5">
                Minimalist Everyday
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                Style as a single piece with flat leather juttis and bare ears for summer workdays, casual café catchups, and studio hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
              <span className="font-serif text-xl text-neutral-400 dark:text-neutral-500 font-light block mb-2">02</span>
              <h4 className="font-serif text-base font-medium text-neutral-900 dark:text-white mb-1.5">
                Festive Occasion
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                Add an organza zari dupatta, oxidised silver jhumkas, and a potli bag for temple visits, family sangeets, and festival dinners.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 hover:border-neutral-900 dark:hover:border-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default">
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

        {/* ======================================================== */}
        {/* CROSS-SELLS: "MORE TO DISCOVER"                          */}
        {/* ======================================================== */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 gap-4">
              <div>
                <div className="section-pill mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B2D7F]" />
                  <span>Curated Pairings</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-[#0B2D7F] dark:text-white font-normal">
                  More to Discover &amp; <span className="text-[#D4AF37] italic font-normal">Related Silhouettes.</span>
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans max-w-xl">
                  Complementary silhouettes from our Jaipur handloom workshops.
                </p>
              </div>
              <Link
                href={`/collections/${product.category || 'shop-all'}`}
                className="text-xs font-semibold text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                View collection →
              </Link>
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
