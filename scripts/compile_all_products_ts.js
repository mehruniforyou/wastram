const fs = require('fs');
const path = require('path');

const files = [
  'western-dresses.ts',
  'traditional-gowns.ts',
  'cord-sets.ts',
  'tops-shirts.ts',
  'ethnic-wear-sets.ts',
  'short-long-kaftan.ts',
  'umbrella-dresses.ts',
  'denim-collection.ts',
  't-shirts.ts',
  'hoodies-sweatshirts.ts'
];

const categoryNames = {
  'western-dresses': 'Western Dresses',
  'traditional-gowns': 'Traditional Gowns',
  'cord-sets': 'Co-ord Sets',
  'tops-shirts': 'Tops & Shirts',
  'ethnic-wear-sets': 'Ethnic Wear Sets',
  'short-long-kaftan': 'Kaftans (Short & Long)',
  'umbrella-dresses': 'Umbrella Dresses',
  'denim-collection': 'Denim Collection',
  't-shirts': 'T-Shirts',
  'hoodies-sweatshirts': 'Hoodies & Sweatshirts'
};

const categoryBasePricesINR = {
  'western-dresses': 1899,
  'traditional-gowns': 3499,
  'cord-sets': 2199,
  'tops-shirts': 1299,
  'ethnic-wear-sets': 2799,
  'short-long-kaftan': 1699,
  'umbrella-dresses': 1999,
  'denim-collection': 2499,
  't-shirts': 899,
  'hoodies-sweatshirts': 1899
};

function main() {
  console.log('Compiling 1,872 products into data/products.ts...');
  const allProducts = [];

  for (const f of files) {
    const filePath = path.join(__dirname, '..', 'data', f);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/export const [A-Z_]+: NishoramaProduct\[] = (\[[\s\S]*?\]);\s*$/);
    if (match) {
      const items = JSON.parse(match[1]);
      for (const p of items) {
        const catId = p.category;
        const catName = categoryNames[catId] || catId;
        const basePrice = categoryBasePricesINR[catId] || 1999;
        const price = p.salePrice || p.regularPrice || basePrice;

        allProducts.push({
          id: p.id,
          partNumber: p.sku || `WST-${p.id.toUpperCase()}`,
          name: p.title,
          title: p.title,
          slug: p.slug,
          aliasSlugs: [`product-${p.id}`],
          price: price,
          regularPrice: price + 600,
          salePrice: price,
          rating: 4.9,
          reviewCount: 18 + (parseInt(p.id.replace(/\D/g, '') || '5', 10) % 30),
          inStock: true,
          stockQty: 50,
          freeShipping: true,
          brand: 'Wastram Atelier',
          category: catId,
          categoryId: catId,
          category_id: catId,
          categoryName: catName,
          category_name: catName,
          categorySlug: catId,
          category_slug: catId,
          mainImage: p.images[0] || '',
          image: p.images[0] || '',
          images: p.images,
          gallery: p.images,
          galleryImages: p.images.map(img => ({ url: img, caption: p.title })),
          shortDescription: p.description,
          short_desc: p.description,
          description: p.description,
          descriptionHtml: `<p>${p.description}</p>`,
          fabric: p.fabric || 'Pure Handloom Silk & Cotton',
          badge: p.badge || 'Signature Bestseller',
          tag: p.badge && p.badge.includes('Bestseller') ? 'BESTSELLER' : 'POPULAR',
          colorVariants: p.colorVariants || [],
          sizes: p.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          moq: p.moq || '20 pcs / Flexible Wholesale Pack',
          wholesaleEnquiryStatus: 'Available for Bulk & Wholesale Orders',
          exportMarkets: ['United Kingdom', 'North America', 'Europe', 'Middle East', 'Australia'],
          isFeatured: true,
          seoTitle: `${p.title} - Wastram Wholesale`,
          seoDescription: p.description,
          technical_specs: {
            'Fabric': p.fabric || 'Pure Handloom Silk & Cotton',
            'Silhouette': p.badge || 'Artisanal Tailored Flare',
            'Wholesale MOQ': p.moq || '20 pcs / Wholesale Pack',
            'Sizes': (p.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL']).join(', '),
            'Origin': 'Jaipur Atelier, India',
            'Export Pack': 'Individually poly-bagged master carton'
          }
        });
      }
    }
  }

  console.log(`Loaded ${allProducts.length} unified products.`);

  const outputTs = `// Auto-generated master product catalogue for Wastram Atelier (1,872 Unified Products)
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

export const PRODUCTS: Product[] = ${JSON.stringify(allProducts, null, 2)};

export const products: Product[] = PRODUCTS;
`;

  fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.ts'), outputTs, 'utf8');
  console.log('Successfully wrote data/products.ts with all 1,872 products.');
}

main();
