import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wastram - Authentic Indian Textiles & Contemporary Luxury',
    short_name: 'Wastram',
    description: "Indian Women's Wear Wholesale & Export Manufacturer",
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFEFE',
    theme_color: '#FFFEFE',
    icons: [
      {
        src: '/images/brand/wastram-craft-emblem.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/brand/wastram-craft-emblem.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
