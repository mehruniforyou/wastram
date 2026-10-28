import { MetadataRoute } from 'next';
import { NISHORAMA_PRODUCTS } from '@/data/nishorama-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.nishorama.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/collections/shop-all`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/collections/kurtis`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/collections/sets`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/collections/tops`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/collections/bottoms`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/collections/dresses`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/collections/under-999`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/most-wanted`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/pages/about-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/pages/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/pages/faqs`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/pages/refund-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/pages/terms-of-service`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/cart`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
  ];

  const productRoutes: MetadataRoute.Sitemap = NISHORAMA_PRODUCTS.map(p => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
