import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import CollectionsCatalogue from '@/components/CollectionsCatalogue';

interface Props {
  params: {
    category: string;
  };
}

export function generateStaticParams() {
  return [
    { category: 'shop-all' },
    { category: 'new-in' },
    { category: 'kurtis' },
    { category: 'sets' },
    { category: 'tops' },
    { category: 'bottoms' },
    { category: 'dresses' },
    { category: 'most-wanted' },
    { category: 'under-999' },
    { category: 'under-1299' },
    { category: '50-off' },
    { category: '40-off' },
    { category: 'goodbyedeals' },
    { category: 'trending' },
    { category: 'short-kurti' },
    { category: 'long-kurti' },
    { category: 'sleeveless-kurtis' },
    { category: 'full-sleeve-kurti' },
    { category: 'corset-kurti' },
    { category: 'deep-back-kurti' },
    { category: 'halter-neck-kurti' },
    { category: 'maxi-dresses' },
    { category: 'mini-dress' },
    { category: 'skirt-set' },
    { category: '3-piece' },
    { category: '2-piece' },
    { category: 'men' },
    { category: 'cover-ups' },
    { category: 'corset-tops' },
    { category: 'fitted-tops' },
    { category: 'loose-fitted-tops' },
    { category: 'skirts' },
    { category: 'nishooffice-ss2' },
    { category: 'nishooffice-ss1' },
    { category: 'nishohaveli-ss2' },
    { category: 'nishohaveli-ss1' },
    { category: 'desi-romance' },
    { category: 'accessories' }
  ];
}

export function generateMetadata({ params }: Props): Metadata {
  const formatted = params.category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${formatted} Collection | NISHORAMA India`,
    description: `Shop the latest ${formatted} designs from NISHORAMA India. Handcrafted prints, modern ethnic wear, and festive discounts.`,
  };
}

export default function CategoryPage({ params }: Props) {
  let mappedCategory = params.category;
  if (['shop-all', 'new-in', 'trending', 'goodbyedeals'].includes(params.category)) {
    mappedCategory = 'all';
  } else if (params.category.includes('kurti')) {
    mappedCategory = 'kurtis';
  } else if (params.category.includes('dress')) {
    mappedCategory = 'dresses';
  } else if (params.category.includes('top') || params.category.includes('cover-up')) {
    mappedCategory = 'tops';
  } else if (params.category.includes('pant') || params.category.includes('skirt') || params.category.includes('bottom')) {
    mappedCategory = 'bottoms';
  } else if (params.category.includes('set') || params.category.includes('piece')) {
    mappedCategory = 'sets';
  }

  return (
    <Suspense fallback={<div className="py-20 text-center font-archivo text-xs">Loading collection...</div>}>
      <CollectionsCatalogue initialCategory={mappedCategory} />
    </Suspense>
  );
}
