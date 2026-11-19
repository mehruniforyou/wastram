// Master product catalogue for Wastram Atelier (1394 Reconstructed Individual Products)
import productsJson from './products-data.json';

// Auto-generated master product catalogue for Wastram Atelier (1508 Reconstructed Individual Products)
export interface ProductReview {
  id: string;
  author: string;
  location: string;
  date: string;
  rating: number;
  title: string;
  body: string;
  helpfulCount: number;
  totalVotes: number;
}

export interface ColorVariant {
  id: string;
  name: string;
  colorCode: string;
  images: string[];
}

export interface Product {
  id: string;
  partNumber: string;
  name: string;
  title: string;
  slug: string;
  aliasSlugs?: string[];
  price: number;
  regularPrice?: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQty?: number;
  freeShipping: boolean;
  brand: string;
  category: string;
  categoryId?: string;
  category_id?: string;
  categoryName?: string;
  category_name?: string;
  categorySlug?: string;
  category_slug?: string;
  mainImage: string;
  image?: string;
  featured_image?: string;
  images: string[];
  gallery: string[];
  galleryImages: { url: string; caption?: string }[];
  shortDescription?: string;
  short_desc?: string;
  description: string;
  descriptionHtml: string;
  fabric: string;
  badge?: string;
  tag?: "SALE" | "POPULAR" | "BESTSELLER" | string;
  colorVariants?: ColorVariant[];
  sizes: string[];
  moq: string;
  wholesaleEnquiryStatus?: string;
  exportMarkets?: string[];
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  technical_specs?: Record<string, string>;
  is_hidden?: boolean;
  is_featured?: boolean;
  deleted?: boolean;
  [key: string]: any;
}

export const PRODUCTS: Product[] = (productsJson as unknown) as Product[];
export const products: Product[] = PRODUCTS;
