import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wastram - Authentic Indian Textiles & Contemporary Luxury',
    short_name: 'Wastram',
    description: "Indian Women's Wear Wholesale & Export Manufacturer",
    start_url: '/',
    display: 'standalone',
    background_color: '#0B2D7F',
    theme_color: '#0B2D7F',
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
