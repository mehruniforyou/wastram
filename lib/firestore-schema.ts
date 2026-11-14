/**
 * Wastram Atelier - Firestore & Headless CMS Database Schema
 *
 * This module defines the official Firestore schema and data converters
 * for products and color variants, allowing seamless integration with
 * Firebase Firestore, Google Cloud, and future Admin Panels.
 */

export interface ColorVariantDocument {
  id: string;          // e.g. "var-1", "var-2"
  name: string;        // Color name, e.g. "Emerald Green", "Ivory White", "Wine Maroon"
  colorCode: string;   // Hex code for UI swatch dot, e.g. "#2E6F40", "#F5F2EB"
  images: string[];    // Array of photoshoot angles for this specific color
}

export interface ProductDocument {
  id: string;          // Firestore document ID e.g. "wd-0001"
  title: string;       // Style / Product Name e.g. "Aria Tiered Flared Maxi Dress"
  slug: string;        // SEO URL slug e.g. "aria-tiered-flared-maxi-dress-wd-1"
  category: string;    // Category slug e.g. "western-dresses"
  tab: string;         // Navigation tab e.g. "western-dresses"
  badge: string;       // Badge e.g. "Signature Collection", "Export Bestseller"
  regularPrice: number;// Wholesale list price (0 for inquiry mode)
  salePrice: number;   // Wholesale discounted tier price
  images: string[];    // Top-level display images (variant 0 angles)
  colorVariants: ColorVariantDocument[]; // 1 to 5 Colorways with their multi-angle photoshoots
  sizes: string[];     // Sizing pre-pack ratio e.g. ["XS", "S", "M", "L", "XL", "XXL"]
  fabric: string;      // Material specification e.g. "Lustrous Crepe Silk"
  description: string; // Luxury wholesale product copy
  details: string[];   // Bulleted craftsmanship details & specifications
  moq: string;         // Batch MOQ e.g. "20 pcs / Flexible Wholesale Pack"
  sku: string;         // Atelier SKU e.g. "WST-WD-0001"
  createdAt: string;   // ISO 8601 timestamp
  updatedAt: string;   // ISO 8601 timestamp
}

/**
 * Standard Firestore Data Converter for use with Firebase JS SDK / Admin SDK
 *
 * Usage:
 *   import { collection } from 'firebase/firestore';
 *   const productsRef = collection(db, 'products').withConverter(firestoreProductConverter);
 */
export const firestoreProductConverter = {
  toFirestore(product: ProductDocument) {
    return {
      ...product,
      updatedAt: new Date().toISOString()
    };
  },
  fromFirestore(snapshot: any): ProductDocument {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title || '',
      slug: data.slug || '',
      category: data.category || '',
      tab: data.tab || '',
      badge: data.badge || '',
      regularPrice: data.regularPrice || 0,
      salePrice: data.salePrice || 0,
      images: Array.isArray(data.images) ? data.images : [],
      colorVariants: Array.isArray(data.colorVariants) ? data.colorVariants : [],
      sizes: Array.isArray(data.sizes) ? data.sizes : [],
      fabric: data.fabric || '',
      description: data.description || '',
      details: Array.isArray(data.details) ? data.details : [],
      moq: data.moq || '20 pcs',
      sku: data.sku || snapshot.id,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    };
  }
};
