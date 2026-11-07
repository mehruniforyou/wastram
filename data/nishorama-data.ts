import { WESTERN_DRESSES } from './western-dresses';
import { TRADITIONAL_GOWNS } from './traditional-gowns';
import { CORD_SETS } from './cord-sets';
import { TOPS_SHIRTS } from './tops-shirts';
import { ETHNIC_WEAR_SETS } from './ethnic-wear-sets';
import { SHORT_LONG_KAFTANS } from './short-long-kaftan';
import { UMBRELLA_DRESSES } from './umbrella-dresses';
import { T_SHIRTS } from './t-shirts';
import { HOODIES_SWEATSHIRTS } from './hoodies-sweatshirts';
import { DENIM_COLLECTION } from './denim-collection';

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
  ...CORD_SETS,
  ...TOPS_SHIRTS,
  ...ETHNIC_WEAR_SETS,
  ...SHORT_LONG_KAFTANS,
  ...UMBRELLA_DRESSES,
  ...T_SHIRTS,
  ...HOODIES_SWEATSHIRTS,
  ...DENIM_COLLECTION
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
  },
  {
    id: 7,
    title: 'TOPS & SHIRTS',
    image: '/tops-shirts/IMG-20250122-WA0005.jpg.jpeg',
    subtitle: '120+ Designer Tops & Shirts',
    tag: 'NEW'
  },
  {
    id: 8,
    title: 'ETHNIC WEAR SETS',
    image: '/ethnic-wear-sets/Screenshot_2026-05-04-23-09-15-24_a23b203fd3aafc6dcb84e438dda678b6.jpg.jpeg',
    subtitle: '75+ Regal 3-Piece Sets',
    tag: 'ROYAL'
  },
  {
    id: 9,
    title: 'SHORT & LONG KAFTAN',
    image: '/short-long-kaftan/0041a02dcf6def76a860d012cb1771f5_2.jpg.jpeg',
    subtitle: '140+ Resort & Maxi Kaftans',
    tag: 'NEW'
  },
  {
    id: 10,
    title: 'UMBRELLA DRESSES',
    image: '/umbrella-dresses/4726.jpg.jpeg',
    subtitle: '30+ Flared Umbrella Styles',
    tag: 'NEW'
  },
  {
    id: 11,
    title: 'T-SHIRTS',
    image: '/t-shirts/13665.jpg.jpeg',
    subtitle: '50+ Heavyweight Streetwear Tees',
    tag: 'NEW'
  },
  {
    id: 12,
    title: 'HOODIES & SWEATSHIRTS',
    image: '/hoodies-sweatshirts/16885.jpg.jpeg',
    subtitle: '40+ Heavyweight Streetwear Hoodies',
    tag: 'NEW'
  },
  {
    id: 13,
    title: 'DENIM COLLECTION',
    image: '/denim-collection/IMG-20261102-WA0252.jpg.jpeg',
    subtitle: '140+ Premium Rigid & Stretch Denim Styles',
    tag: 'NEW'
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
