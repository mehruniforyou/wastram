import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MessageCircle, ArrowRight, Eye, Sparkles, CheckCircle2, Shield, Layers } from 'lucide-react';
import { categories } from '@/data/categories';
import { getProductsByCategory, Product } from '@/data/products';
import { siteConfig, buildWhatsAppLink, whatsappMessages } from '@/data/site-config';

interface Props {
  params: {
    category: string;
  };
}

export function generateStaticParams() {
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = categories.find((c) => c.slug === params.category || c.id === params.category);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} Wholesale Supplier | Indian Women's Wear`,
    description: `Browse Wastram's wholesale ${category.name.toLowerCase()} collection. ${category.description.slice(0, 150)}... Enquire directly via WhatsApp for volume export pricing.`,
    alternates: {
      canonical: `${siteConfig.productionDomain}/collections/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} Wholesale | ${siteConfig.brandName}`,
      description: category.description,
      images: [category.heroImage],
    },
  };
}

export default function CategoryDetailPage({ params }: Props) {
  const category = categories.find((c) => c.slug === params.category || c.id === params.category);

  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(category.id);
  const categoryWhatsAppUrl = buildWhatsAppLink(whatsappMessages.category(category.name));
  const otherCategories = categories.filter((c) => c.id !== category.id);

  // Structured Data (JSON-LD CollectionPage & BreadcrumbList)
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Wholesale Collection`,
    description: category.description,
    url: `${siteConfig.productionDomain}/collections/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categoryProducts.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${siteConfig.productionDomain}/products/${p.slug}`,
        name: p.name,
      })),
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
        name: category.name,
        item: `${siteConfig.productionDomain}/collections/${category.slug}`,
      },
    ],
  };

  return (
    <div className="py-10 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-charcoal-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-navy transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-navy font-semibold">{category.name}</span>
        </nav>

        {/* Category Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-navy-900 via-navy to-navy-800 text-white p-8 sm:p-12 lg:p-16 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wholesale Category</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              {category.name}
            </h1>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
              {category.description}
            </p>

            {/* Specifications row */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-gray-300">
              <div>
                <span className="text-gold font-semibold uppercase">Fabrics:</span>{' '}
                {category.fabrics.join(', ')}
              </div>
              <div>
                <span className="text-gold font-semibold uppercase">Silhouettes:</span>{' '}
                {category.silhouette}
              </div>
            </div>

            {/* Category WhatsApp CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <a
                href={categoryWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-600 text-navy-900 font-semibold px-6 py-3.5 rounded-full text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all group"
              >
                <MessageCircle className="w-4 h-4 text-navy-900 fill-navy-900/20 group-hover:scale-110 transition-transform" />
                <span>Enquire About {category.name}</span>
              </a>

              <span className="text-xs text-gray-300 font-mono">
                {categoryProducts.length} verified designs ready for wholesale
              </span>
            </div>
          </div>

          {/* Background Image Blend */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 lg:opacity-40 hidden md:block">
            <Image
              src={category.heroImage}
              alt={category.name}
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy">
              Available Designs ({categoryProducts.length})
            </h2>
            <span className="text-xs text-charcoal-muted">
              Click any style to enquire wholesale specs & pricing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => {
              const productWhatsAppUrl = buildWhatsAppLink(
                whatsappMessages.product(product.name, product.sku, category.name)
              );

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-subtle hover:shadow-card-hover transition-all duration-300"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-[3/4] w-full overflow-hidden bg-ivory block"
                    aria-label={`View ${product.name}`}
                  >
                    <Image
                      src={product.image}
                      alt={`${product.name} - ${product.fabric}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* SKU badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-navy text-[11px] font-mono font-medium px-2 py-0.5 rounded-md border border-gray-200">
                      {product.sku}
                    </div>

                    {/* Fabric */}
                    <div className="absolute top-3 right-3 bg-navy/85 backdrop-blur-xs text-gold text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {product.fabric}
                    </div>

                    <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 bg-white text-navy px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-3.5 h-3.5 text-gold" />
                        <span>View Details</span>
                      </span>
                    </div>
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="block text-sm font-serif font-bold text-navy hover:text-gold transition-colors mt-0.5 line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-charcoal-muted mt-1">
                        Sizes: <span className="font-medium text-charcoal">{product.sizes.join(', ')}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <a
                        href={productWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-700 text-white py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-xs group/btn"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-gold fill-gold/20 group-hover/btn:scale-110 transition-transform" />
                        <span>Enquire About This Design</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Categories Navigation */}
        <div className="pt-12 border-t border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-navy">
              Explore Other Collections
            </h3>
            <Link
              href="/collections"
              className="text-xs font-semibold text-gold hover:text-navy uppercase tracking-wider transition-colors"
            >
              All Categories &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {otherCategories.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="group p-3 rounded-xl bg-ivory/60 hover:bg-blush-50 border border-gray-100 text-center space-y-2 transition-colors"
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white">
                  <Image
                    src={c.heroImage}
                    alt={c.name}
                    fill
                    sizes="120px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs font-serif font-semibold text-navy group-hover:text-gold transition-colors line-clamp-1">
                  {c.name}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
