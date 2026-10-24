import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MessageCircle, ShieldCheck, Globe, CheckCircle2, ArrowRight, Sparkles, Package, HelpCircle } from 'lucide-react';
import { products, getProductBySlug, getRelatedProducts } from '@/data/products';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';
import MobileStickyCta from '@/components/MobileStickyCta';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: {
      canonical: `${siteConfig.productionDomain}/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);
  const whatsappUrl = buildWhatsAppLink(
    whatsappMessages.product(product.name, product.sku, product.categoryName)
  );

  // Structured Data (JSON-LD Product & BreadcrumbList)
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: `${siteConfig.productionDomain}${product.image}`,
    description: product.description,
    sku: product.sku,
    category: product.categoryName,
    material: product.fabric,
    brand: {
      '@type': 'Brand',
      name: siteConfig.brandName,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      price: 'Contact for Wholesale Price',
      availability: 'https://schema.org/InStock',
      url: `${siteConfig.productionDomain}/products/${product.slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.productionDomain,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Collections',
        item: `${siteConfig.productionDomain}/collections`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.categoryName,
        item: `${siteConfig.productionDomain}/collections/${product.categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${siteConfig.productionDomain}/products/${product.slug}`,
      },
    ],
  };

  return (
    <div className="py-10 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-charcoal-muted overflow-x-auto whitespace-nowrap scrollbar-none py-1" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy transition-colors flex-shrink-0">Home</Link>
          <span className="flex-shrink-0">/</span>
          <Link href="/collections" className="hover:text-navy transition-colors flex-shrink-0">Collections</Link>
          <span className="flex-shrink-0">/</span>
          <Link href={`/collections/${product.categorySlug}`} className="hover:text-navy transition-colors flex-shrink-0">
            {product.categoryName}
          </Link>
          <span className="flex-shrink-0">/</span>
          <span className="text-navy font-semibold flex-shrink-0">{product.name}</span>
        </nav>

        {/* Product Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left: Large High-Resolution Image & Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-ivory border border-gray-100 shadow-lg">
              <Image
                src={product.image}
                alt={`${product.name} - Wholesale Indian Women's Wear`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-top"
              />
              
              {/* Reference Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-navy border border-gray-200 shadow-xs">
                Ref: {product.sku}
              </div>

              {/* Verified Material Badge */}
              <div className="absolute top-4 right-4 bg-navy/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-gold uppercase tracking-wider shadow-xs">
                {product.fabric}
              </div>
            </div>

            {/* Quality Note */}
            <p className="text-xs text-center text-charcoal-muted">
              Authentic catalogue photograph from our Jaipur manufacturing facility.
            </p>
          </div>

          {/* Right: Product Specifications & Wholesale Conversion Box */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush-50 border border-blush-200 text-navy text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>{product.categoryName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy tracking-tight leading-snug">
                {product.name}
              </h1>
              <p className="text-xs font-mono text-gray-500">
                Style Code / SKU:{' '}
                <span className="font-semibold text-navy">{product.sku}</span>
              </p>
            </div>

            {/* Description */}
            <div className="prose prose-sm text-charcoal-muted">
              <p className="leading-relaxed">{product.description}</p>
            </div>

            {/* Verified Specifications Grid */}
            <div className="bg-ivory/60 p-5 rounded-2xl border border-gray-200/80 space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                <span className="text-charcoal-muted font-medium">Fabric & Material:</span>
                <span className="font-semibold text-navy">{product.fabric}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                <span className="text-charcoal-muted font-medium">Size Range:</span>
                <span className="font-semibold text-navy">{product.sizes.join(', ')}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                <span className="text-charcoal-muted font-medium">Production Origin:</span>
                <span className="font-semibold text-navy">Jaipur, Rajasthan, India</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200/60">
                <span className="text-charcoal-muted font-medium">Wholesale Pricing:</span>
                <span className="font-semibold text-gold">Quoted on WhatsApp by Order Volume</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-charcoal-muted font-medium">Minimum Order (MOQ):</span>
                <span className="font-semibold text-navy">Flexible for Boutique Trial Runs</span>
              </div>
            </div>

            {/* PRIMARY CONVERSION BOX (WhatsApp) */}
            <div className="bg-gradient-to-br from-navy to-navy-800 text-white p-6 rounded-2xl space-y-4 shadow-xl border border-gold/30">
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-gold" />
                  <span>Enquire for Wholesale & Export</span>
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Click below to open WhatsApp with this design reference ({product.sku}) prefilled. Our export team will assist with unit pricing, fabric swatches, minimums, and shipping estimates.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-600 text-navy-900 py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-md group"
              >
                <MessageCircle className="w-4 h-4 text-navy-900 fill-navy-900/20 group-hover:scale-110 transition-transform" />
                <span>Enquire About This Design</span>
              </a>

              <p className="text-[11px] text-gray-400 text-center">
                Direct WhatsApp Hotline:{' '}
                <span className="text-gold font-mono">{siteConfig.whatsappDisplay}</span>
              </p>
            </div>

            {/* Buyer Assurance Points */}
            <div className="space-y-2 text-xs text-charcoal">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Direct Manufacturer: No wholesale brokers or retail markups</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold flex-shrink-0" />
                <span>International Delivery: Air courier & sea cargo documentation</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Sample Batches: Available for commercial verification</span>
              </div>
            </div>

          </div>

        </div>

        {/* Related Designs */}
        {relatedProducts.length > 0 && (
          <div className="pt-14 border-t border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-widest">
                  More From This Collection
                </span>
                <h3 className="text-2xl font-serif font-bold text-navy">
                  Related {product.categoryName}
                </h3>
              </div>
              <Link
                href={`/collections/${product.categorySlug}`}
                className="text-xs font-semibold text-navy hover:text-gold uppercase tracking-wider transition-colors flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => {
                const relWhatsAppUrl = buildWhatsAppLink(
                  whatsappMessages.product(rel.name, rel.sku, rel.categoryName)
                );

                return (
                  <div
                    key={rel.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-subtle hover:shadow-card transition-all"
                  >
                    <Link href={`/products/${rel.slug}`} className="relative aspect-[3/4] block overflow-hidden bg-ivory">
                      <Image
                        src={rel.image}
                        alt={rel.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-white/90 text-navy text-[10px] font-mono px-2 py-0.5 rounded-md">
                        {rel.sku}
                      </div>
                    </Link>
                    <div className="p-4 space-y-2">
                      <Link
                        href={`/products/${rel.slug}`}
                        className="block text-sm font-serif font-semibold text-navy hover:text-gold line-clamp-1 transition-colors"
                      >
                        {rel.name}
                      </Link>
                      <p className="text-xs text-charcoal-muted">{rel.fabric}</p>
                      <a
                        href={relWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 bg-navy text-white py-2 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-navy-700 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-gold" />
                        <span>Enquire</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Sticky Enquiry Bar */}
        <MobileStickyCta
          productName={product.name}
          sku={product.sku}
          category={product.categoryName}
        />
      </div>
    </div>
  );
}
