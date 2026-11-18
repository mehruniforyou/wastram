import { PRODUCTS, ColorVariant as ProductColorVariant } from './products';

export interface ColorVariant {
  id: string;
  name: string;
  colorCode: string;
  images: string[];
}

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
  colorVariants?: ColorVariant[];
  sizes: string[];
  description: string;
  fabric: string;
  details: string[];
  moq?: string;
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  partNumber?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  freeShipping?: boolean;
  brand?: string;
  [key: string]: any;
}

export const NISHORAMA_PRODUCTS: NishoramaProduct[] = PRODUCTS as unknown as NishoramaProduct[];

export const NISHORAMA_STORIES = [
  {
    id: 1,
    title: 'WESTERN DRESSES',
    image: '/western-dresses/1668.jpg.jpeg',
    subtitle: 'Tiered Silhouettes in 100% Cambric',
    tag: 'NEW ARRIVAL',
    href: '/collections/western-dresses'
  },
  {
    id: 2,
    title: 'CO-ORD SETS',
    image: '/cord-sets/12550.jpg.jpeg',
    subtitle: 'Tailored 2-Piece & 3-Piece Suites',
    tag: 'ATELIER EDIT',
    href: '/collections/cord-sets'
  },
  {
    id: 3,
    title: 'TRADITIONAL GOWNS',
    image: '/traditional-gowns/16668.jpg.jpeg',
    subtitle: '5-Meter Sweeping Gota Patti Flair',
    tag: 'ROYAL JAIPUR',
    href: '/collections/traditional-gowns'
  },
  {
    id: 4,
    title: 'RESORT KAFTANS',
    image: '/short-long-kaftan/0041a02dcf6def76a860d012cb1771f5_2.jpg.jpeg',
    subtitle: 'River-Washed Mulmul & Artisanal Ties',
    tag: 'FEATHERLIGHT',
    href: '/collections/short-long-kaftan'
  },
  {
    id: 5,
    title: 'UMBRELLA DRESSES',
    image: '/umbrella-dresses/4726.jpg.jpeg',
    subtitle: 'Full 360° Circular Motion Flare',
    tag: 'HANDBLOCK',
    href: '/collections/umbrella-dresses'
  },
  {
    id: 6,
    title: 'TOPS & TUNICS',
    image: '/tops-shirts/IMG-20250122-WA0005.jpg.jpeg',
    subtitle: 'Hand-Carved Sanganer Teakwood Butis',
    tag: 'DAILY COMFORT',
    href: '/collections/tops-shirts'
  },
  {
    id: 7,
    title: 'TIERED MAXI',
    image: '/western-dresses/5494.jpg.jpeg',
    subtitle: 'Silk Crepe & Georgette Flounces',
    tag: 'BESTSELLER',
    href: '/collections/western-dresses'
  },
  {
    id: 8,
    title: 'DENIM WEAVES',
    image: '/denim-collection/IMG-20261102-WA0252.jpg.jpeg',
    subtitle: 'Indigo Dyed Heritage Looms',
    tag: 'ATELIER CRAFT',
    href: '/collections/denim-collection'
  }
];

export const NISHORAMA_POPULAR_SEARCHES = {
  'Denim Collection': [
    { text: 'All Denim Collection', href: '/collections/denim-collection' },
    { text: 'High-Rise Vintage Flared Denim', href: '/collections/denim-collection' },
    { text: 'Wide-Leg Rigid Cotton Jeans', href: '/collections/denim-collection' },
    { text: 'Acid-Washed Barrel Leg Denim', href: '/collections/denim-collection' },
    { text: 'Raw Indigo Selvedge Denim Trousers', href: '/collections/denim-collection' }
  ],
  'Hoodies & Sweatshirts': [
    { text: 'All Hoodies & Sweatshirts', href: '/collections/hoodies-sweatshirts' },
    { text: 'Heavyweight Boxy Fleece Hoodies', href: '/collections/hoodies-sweatshirts' },
    { text: 'French Terry Drop-Shoulder Pullovers', href: '/collections/hoodies-sweatshirts' },
    { text: 'Acid-Wash Vintage Sweatshirts', href: '/collections/hoodies-sweatshirts' },
    { text: 'Carbon-Brushed Cotton Hoodies', href: '/collections/hoodies-sweatshirts' }
  ],
  'T-Shirts': [
    { text: 'All T-Shirts', href: '/collections/t-shirts' },
    { text: 'Heavyweight Oversized Tees', href: '/collections/t-shirts' },
    { text: 'Bio-Washed Crewneck T-Shirts', href: '/collections/t-shirts' },
    { text: 'Drop-Shoulder Boxy Tees', href: '/collections/t-shirts' },
    { text: 'Vintage Acid-Wash T-Shirts', href: '/collections/t-shirts' }
  ],
  'Umbrella Dresses': [
    { text: 'All Umbrella Dresses', href: '/collections/umbrella-dresses' },
    { text: 'Chanderi Kalidar Umbrella Dresses', href: '/collections/umbrella-dresses' },
    { text: 'Pure Mulmul Flared Dresses', href: '/collections/umbrella-dresses' },
    { text: 'Tiered Circular Umbrella Maxis', href: '/collections/umbrella-dresses' },
    { text: 'Block-Printed Umbrella Dresses', href: '/collections/umbrella-dresses' }
  ],
  'Short & Long Kaftan': [
    { text: 'All Short & Long Kaftans', href: '/collections/short-long-kaftan' },
    { text: 'Silk Crepe Maxi Kaftans', href: '/collections/short-long-kaftan' },
    { text: 'Mulmul Cotton Short Kaftans', href: '/collections/short-long-kaftan' },
    { text: 'Chanderi Embroidered Kaftans', href: '/collections/short-long-kaftan' },
    { text: 'Georgette Resort Kaftans', href: '/collections/short-long-kaftan' }
  ],
  'Ethnic Wear Sets': [
    { text: 'All Ethnic Wear Sets', href: '/collections/ethnic-wear-sets' },
    { text: '3-Piece Suit Sets', href: '/collections/ethnic-wear-sets' },
    { text: 'Chanderi Anarkali Sets', href: '/collections/ethnic-wear-sets' },
    { text: 'Gota Patti Sharara Sets', href: '/collections/ethnic-wear-sets' },
    { text: 'Chikankari Kurta & Pant Sets', href: '/collections/ethnic-wear-sets' }
  ],
  'Tops & Shirts': [
    { text: 'All Tops & Shirts', href: '/collections/tops-shirts' },
    { text: 'Linen Relaxed Shirts', href: '/collections/tops-shirts' },
    { text: 'Embroidered Peplum Tops', href: '/collections/tops-shirts' },
    { text: 'Silk Wrap Blouses', href: '/collections/tops-shirts' },
    { text: 'Schiffli Crop Blouses', href: '/collections/tops-shirts' }
  ],
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
  'Signature Collections': [
    { text: 'Shop All (1,400+ Styles)', href: '/collections/shop-all' },
    { text: 'Signature Bestsellers', href: '/collections/most-wanted' },
    { text: 'New Arrivals 2026', href: '/collections/new-in' }
  ],
  'Boutique & Trade Services': [
    { text: 'About Wastram Atelier', href: '/pages/about-us' },
    { text: 'Atelier Delivery Terms', href: '/pages/refund-policy' },
    { text: 'Boutique FAQs', href: '/pages/faqs' },
    { text: 'Contact Atelier Concierge', href: '/pages/contact' }
  ]
};
