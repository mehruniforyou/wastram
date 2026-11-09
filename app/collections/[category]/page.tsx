import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import CollectionsCatalogue from '@/components/CollectionsCatalogue';

interface Props {
  params: {
    category: string;
  };
}

const CATEGORY_MAP: Record<string, string> = {
  // All products
  'shop-all': 'all',
  'all': 'all',
  'new-in': 'all',
  'trending': 'all',
  'goodbyedeals': 'all',
  'most-wanted': 'most-wanted',

  // 1. Western Dresses
  'western-dresses': 'western-dresses',
  'western': 'western-dresses',
  'dresses': 'western-dresses',
  'maxi-dresses': 'western-dresses',
  'mini-dress': 'western-dresses',

  // 2. Denim Collection
  'denim-collection': 'denim-collection',
  'denim': 'denim-collection',
  'jeans': 'denim-collection',
  'bottoms': 'denim-collection',
  'pants': 'denim-collection',

  // 3. Ethnic Wear Sets
  'ethnic-wear-sets': 'ethnic-wear-sets',
  'ethnic-wear': 'ethnic-wear-sets',
  'ethnic-sets': 'ethnic-wear-sets',
  '3-piece-sets': 'ethnic-wear-sets',
  '3-piece': 'ethnic-wear-sets',
  '2-piece': 'ethnic-wear-sets',
  'sets': 'ethnic-wear-sets',

  // 4. Umbrella Dresses
  'umbrella-dresses': 'umbrella-dresses',
  'umbrella': 'umbrella-dresses',

  // 5. Co-ord Sets
  'cord-sets': 'cord-sets',
  'co-ords': 'cord-sets',
  'co-ord-sets': 'cord-sets',
  'coord-sets': 'cord-sets',
  'skirt-set': 'cord-sets',

  // 6. Kaftans
  'short-long-kaftan': 'short-long-kaftan',
  'kaftans': 'short-long-kaftan',
  'kaftan': 'short-long-kaftan',

  // 7. Traditional Gowns & Kurtis
  'traditional-gowns': 'traditional-gowns',
  'gowns': 'traditional-gowns',
  'kurtis': 'traditional-gowns',
  'kurtas': 'traditional-gowns',
  'short-kurti': 'traditional-gowns',
  'long-kurti': 'traditional-gowns',
  'sleeveless-kurtis': 'traditional-gowns',
  'full-sleeve-kurti': 'traditional-gowns',
  'corset-kurti': 'traditional-gowns',
  'deep-back-kurti': 'traditional-gowns',
  'halter-neck-kurti': 'traditional-gowns',

  // 8. Tops & Shirts
  'tops-shirts': 'tops-shirts',
  'tops': 'tops-shirts',
  'shirts': 'tops-shirts',
  'corset-tops': 'tops-shirts',
  'fitted-tops': 'tops-shirts',
  'loose-fitted-tops': 'tops-shirts',
  'cover-ups': 'tops-shirts',

  // 9. Hoodies & Sweatshirts
  'hoodies-sweatshirts': 'hoodies-sweatshirts',
  'hoodies': 'hoodies-sweatshirts',
  'sweatshirts': 'hoodies-sweatshirts',

  // 10. T-Shirts
  't-shirts': 't-shirts',
  'tshirts': 't-shirts',
  'tees': 't-shirts',
};

const CATEGORY_TITLES: Record<string, string> = {
  'all': 'All Collections',
  'western-dresses': 'Western Dresses',
  'denim-collection': 'Denim Collection',
  'ethnic-wear-sets': 'Ethnic Wear Sets',
  'umbrella-dresses': 'Umbrella Dresses',
  'cord-sets': 'Co-ord Sets',
  'short-long-kaftan': 'Short & Long Kaftans',
  'traditional-gowns': 'Traditional Gowns',
  'tops-shirts': 'Tops & Shirts',
  'hoodies-sweatshirts': 'Hoodies & Sweatshirts',
  't-shirts': 'T-Shirts',
  'most-wanted': 'Signature Bestsellers',
};

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map(category => ({ category }));
}

export function generateMetadata({ params }: Props): Metadata {
  const normalizedCategory = params.category.toLowerCase();
  const mappedKey = CATEGORY_MAP[normalizedCategory] || normalizedCategory;
  const title =
    CATEGORY_TITLES[mappedKey] ||
    params.category
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  return {
    title: `${title} | WASTRAM Atelier | Jaipur Haute Textiles`,
    description: `Explore handcrafted ${title} from Wastram Atelier. Artisanal block prints, pure mulmul, modal silks, and bespoke boutique sourcing with flexible MOQs.`,
  };
}

export default function CategoryPage({ params }: Props) {
  const normalizedCategory = params.category.toLowerCase();
  const mappedCategory = CATEGORY_MAP[normalizedCategory] || normalizedCategory;

  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-[#0B2D7F] font-serif">
          <div className="w-8 h-8 border-2 border-[#0B2D7F] border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-sans uppercase tracking-widest text-[#0B2D7F]/70">
            Loading Wastram Atelier Collection...
          </p>
        </div>
      }
    >
      <CollectionsCatalogue initialCategory={mappedCategory} />
    </Suspense>
  );
}
