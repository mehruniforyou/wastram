import { WESTERN_DRESSES } from './western-dresses';
import { TRADITIONAL_GOWNS } from './traditional-gowns';
import { CORD_SETS } from './cord-sets';

export interface NishoramaProduct {
  id: string;
  title: string;
  slug: string;
  tab: string;
  category: string;
  badge: string;
  regularPrice: number;
  salePrice: number;
  images: string[];
  sizes: string[];
  description: string;
  fabric: string;
  details: string[];
  moq?: string;
  sku?: string;
}

export const NISHORAMA_PRODUCTS: NishoramaProduct[] = [
  ...WESTERN_DRESSES,
  ...TRADITIONAL_GOWNS,
  ...CORD_SETS
];

export const NISHORAMA_STORIES = [
  {
    id: 1,
    title: 'WESTERN DRESSES',
    image: '/western-dresses/1668.jpg.jpeg',
    subtitle: '170+ Export Designs',
    tag: 'NEW'
  },
  {
    id: 2,
    title: 'TIERED MAXI',
    image: '/western-dresses/5494.jpg.jpeg',
    subtitle: 'Silk Crepe & Georgette',
    tag: 'BESTSELLER'
  },
  {
    id: 3,
    title: 'SLIP & COWL',
    image: '/western-dresses/10096.jpg.jpeg',
    subtitle: 'Evening & Occasion',
    tag: 'TRENDING'
  },
  {
    id: 4,
    title: 'RESORT WEAR',
    image: '/western-dresses/10426.jpg.jpeg',
    subtitle: 'Boutique Collection',
    tag: 'WHOLESALE'
  },
  {
    id: 5,
    title: 'TRADITIONAL GOWNS',
    image: '/traditional-gowns/16668.jpg.jpeg',
    subtitle: 'Regal Kalidar Gowns',
    tag: 'ROYAL'
  },
  {
    id: 6,
    title: 'CO-ORD SETS',
    image: '/cord-sets/_MG_7607.JPG.jpeg',
    subtitle: '95+ Designer Sets',
    tag: 'NEW'
  }
];

export const NISHORAMA_POPULAR_SEARCHES = {
  'Co-ord Sets': [
    { text: 'All Co-ord Sets', href: '/collections/cord-sets' },
    { text: 'Tailored Blazer Sets', href: '/collections/cord-sets' },
    { text: 'Linen Tunic & Trouser Sets', href: '/collections/cord-sets' },
    { text: 'Handcrafted Silk Sets', href: '/collections/cord-sets' },
    { text: 'Resort Wear Sets', href: '/collections/cord-sets' }
  ],
  'Traditional Gowns': [
    { text: 'All Traditional Gowns', href: '/collections/traditional-gowns' },
    { text: 'Zari Flared Gowns', href: '/collections/traditional-gowns' },
    { text: 'Organza Festive Gowns', href: '/collections/traditional-gowns' },
    { text: 'Banarasi Brocade Gowns', href: '/collections/traditional-gowns' },
    { text: 'Chikankari Floor Gowns', href: '/collections/traditional-gowns' }
  ],
  'Western Dresses': [
    { text: 'All Western Dresses', href: '/collections/western-dresses' },
    { text: 'Maxi Dresses', href: '/collections/maxi-dresses' },
    { text: 'Midi Dresses', href: '/collections/midi-dress' },
    { text: 'Mini Dresses', href: '/collections/mini-dress' },
    { text: 'Slip Dresses', href: '/collections/western-dresses' },
    { text: 'Tiered Dresses', href: '/collections/western-dresses' }
  ],
  'Silhouettes': [
    { text: 'Cowl Neck Slip', href: '/collections/western-dresses' },
    { text: 'Cutout Halter', href: '/collections/western-dresses' },
    { text: 'Ruched Bodycon', href: '/collections/western-dresses' },
    { text: 'Fluted Hem Midi', href: '/collections/western-dresses' },
    { text: 'Puff Sleeve Flounce', href: '/collections/western-dresses' }
  ],
  'Export Collections': [
    { text: 'Shop All (170+ Styles)', href: '/collections/shop-all' },
    { text: 'Export Bestsellers', href: '/collections/most-wanted' },
    { text: 'New Arrivals 2026', href: '/collections/new-in' }
  ],
  'Wholesale Information': [
    { text: 'About Wastram Wholesale', href: '/pages/about-us' },
    { text: 'Export & Shipping Terms', href: '/pages/refund-policy' },
    { text: 'Buyer FAQs', href: '/pages/faqs' },
    { text: 'Contact Export Desk', href: '/pages/contact' }
  ]
};
