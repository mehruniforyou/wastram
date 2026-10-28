import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.nishorama.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account', '/cart/checkout'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
