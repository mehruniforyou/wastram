export interface NishoramaProduct {
  id: string;
  title: string;
  slug: string;
  tab: 'under-999' | 'festive-sets' | 'upto-50' | 'most-wanted';
  category: string;
  badge: string;
  regularPrice: number;
  salePrice: number;
  images: string[];
  sizes: string[];
  description: string;
  fabric: string;
  details: string[];
}

export const NISHORAMA_PRODUCTS: NishoramaProduct[] = [
  // UNDER ₹999 Tab
  {
    id: 'gunj-mul-cover-up',
    title: 'Gunj Mul cover up',
    slug: 'gunj-mul-cover-up',
    tab: 'under-999',
    category: 'tops',
    badge: '13% off',
    regularPrice: 1159,
    salePrice: 999,
    images: [
      '/nishorama-images/product-gunj-hero-ai.jpg',
      '/nishorama-images/product-gunj-back-AI.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Lightweight mulmul printed cover-up featuring traditional floral motifs and effortless resort styling.',
    fabric: '100% Cotton Mulmul',
    details: ['Gentle machine wash', 'Front tie-up detailing', 'Relaxed kimono sleeves', 'Breathable summer craft']
  },
  {
    id: 'dabu-halter-neck-corset-kurti',
    title: 'Dabu halter neck corset kurti',
    slug: 'dabu-halter-neck-corset-kurti',
    tab: 'under-999',
    category: 'kurtis',
    badge: '28% off',
    regularPrice: 1395,
    salePrice: 999,
    images: [
      '/nishorama-images/product-halter_neck_corset_kurti.jpg',
      '/nishorama-images/product-halter_corset_kurti.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Artisanal Dabu mud-resist block printed corset kurti with halter neckline, structured bodice, and graceful flare.',
    fabric: 'Pure Cotton Dabu Print',
    details: ['Handcrafted natural dyes', 'Corset boning structure', 'Halter neck tie-up', 'Dry clean recommended']
  },
  {
    id: 'noor-sleeved-modest-kurti',
    title: 'Noor Sleeved Modest Kurti',
    slug: 'noor-sleeved-modest-kurti',
    tab: 'under-999',
    category: 'kurtis',
    badge: '44% off',
    regularPrice: 1799,
    salePrice: 999,
    images: [
      '/nishorama-images/product-noor-hero-ai_e76547a0-cc33-4e0c-a14e-43708ca67de7.jpg',
      '/nishorama-images/product-noor-back-ai_80ed0f72-a0db-458c-8be5-e8b834f3fd35.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Elegant long-sleeve modest kurti in soothing white with delicate foil hand-block prints and Mandarin collar.',
    fabric: 'Premium Viscose Cotton Blend',
    details: ['Full sleeves with cuff detail', 'Side slit silhouette', 'Functional button placket', 'Comfortable daily wear']
  },
  {
    id: 'hema-sleeved-modest-kurti',
    title: 'Hema Sleeved Modest Kurti',
    slug: 'hema-sleeved-modest-kurti',
    tab: 'under-999',
    category: 'kurtis',
    badge: '50% off',
    regularPrice: 1399,
    salePrice: 699,
    images: [
      '/nishorama-images/product-hema-hero-AI_28b7a189-1f12-4c19-84a6-049bb94f5072.jpg',
      '/nishorama-images/product-hema-back-AI_590717ac-7a4d-4c07-a37d-b54b659dbd1d.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Earthy floral printed kurti with modest 3/4 sleeves, flattering straight cut, and notched round neckline.',
    fabric: '100% Breathable Cambric Cotton',
    details: ['All-day breathable comfort', 'Machine washable', 'Contrast piping on neck', 'Side slits']
  },

  // FESTIVE SETS Tab
  {
    id: 'ishq-skirt-set',
    title: 'Ishq Skirt Set',
    slug: 'ishq-skirt-set',
    tab: 'festive-sets',
    category: 'sets',
    badge: '24% off',
    regularPrice: 3299,
    salePrice: 2499,
    images: [
      '/nishorama-images/product-hero_e6ea71ef-62be-4a66-b09a-b33d43db633a.jpg',
      '/nishorama-images/product-back_cf0c2ba0-9f1f-4339-a41b-bc3903d08c20.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Two-piece festive skirt set featuring an embellished bustier top paired with a voluminous printed tier skirt.',
    fabric: 'Lurex Weave Cotton Silk',
    details: ['Includes crop top and flared skirt', 'Side zipper on skirt', 'Adjustable shoulder straps', 'Dry clean only']
  },
  {
    id: 'ganga-corset-kurti-pant-set',
    title: 'Ganga Halterneck Corset Kurti Pant dupatta Set',
    slug: 'ganga-corset-kurti-pant-set',
    tab: 'festive-sets',
    category: 'sets',
    badge: '20% off',
    regularPrice: 2499,
    salePrice: 1999,
    images: [
      '/nishorama-images/product-263.png',
      '/nishorama-images/product-262.png'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Three-piece designer ethnic set with halterneck corset kurti, tailored cigarette pants, and matching sheer dupatta.',
    fabric: 'Chanderi Silk with Cotton Lining',
    details: ['3-piece complete festive ensemble', 'Padded corset top', 'Elasticated back waist on pants', 'Zari lace borders']
  },
  {
    id: 'evy-skirt-set',
    title: 'Evy Skirt Set',
    slug: 'evy-skirt-set',
    tab: 'festive-sets',
    category: 'sets',
    badge: '20% off',
    regularPrice: 2499,
    salePrice: 1999,
    images: [
      '/nishorama-images/product-1_da69241a-d93a-4500-999e-b10d798f5821.jpg',
      '/nishorama-images/product-2_99ace501-7d05-48cb-95d7-1a5b5d12daa6.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Contemporary coordinated skirt set featuring halter cropped blouse and high-waist A-line skirt with heritage prints.',
    fabric: 'Pure Cotton Modal',
    details: ['Signature Nishorama silhouette', 'Smocked back for flexible fit', 'Maxi length skirt', 'Concealed side zipper']
  },
  {
    id: 'alha-jacquard-set',
    title: 'Alha Jacquard Set',
    slug: 'alha-jacquard-set',
    tab: 'festive-sets',
    category: 'sets',
    badge: '20% off',
    regularPrice: 2499,
    salePrice: 1999,
    images: [
      '/nishorama-images/product-alha-hero-AI.jpg',
      '/nishorama-images/product-alha-back-AI.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Festive jacquard woven kurti and pant set woven with subtle metallic threads and tailored for celebratory evenings.',
    fabric: 'Artisanal Jacquard Weave',
    details: ['Self-textured metallic motifs', 'Straight cut comfort fit', 'Cigarette pants with pocket', 'Dry clean only']
  },

  // UPTO 50% Tab
  {
    id: 'moksha-halterneck-top',
    title: 'Moksha Halterneck Top',
    slug: 'moksha-halterneck-top',
    tab: 'upto-50',
    category: 'tops',
    badge: '50% off',
    regularPrice: 1399,
    salePrice: 699,
    images: [
      '/nishorama-images/product-4_3266eda5-cd98-496a-bc96-ca70be2d7d4e.jpg',
      '/nishorama-images/product-2_ff40033f-27bb-48d8-9d92-a1c83cf7bb02.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Modern fusion halterneck top in artisanal block print, tailored with an open back and tie-up cord.',
    fabric: '100% Pure Mulmul',
    details: ['Halter tie-up collar', 'Low-cut back with ties', 'Soft pre-shrunk cotton', 'Gentle hand wash']
  },
  {
    id: 'vaelina-short-dress',
    title: 'Vaelina Short Dress',
    slug: 'vaelina-short-dress',
    tab: 'upto-50',
    category: 'dresses',
    badge: '49% off',
    regularPrice: 1395,
    salePrice: 699,
    images: [
      '/nishorama-images/product-dress-HERO-AI.jpg',
      '/nishorama-images/product-dress-BACK-AI.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Breezy mini tiered dress with ruffle hem, flutter short sleeves, and all-over floral bouquet print.',
    fabric: 'Rayon Crepe',
    details: ['Tiered skirt flare', 'Round notch neck', 'Above-knee length', 'Easy pull-on silhouette']
  },
  {
    id: 'nisa-sleeved-modest-kurti',
    title: 'Nisa Full Sleeved Kurti',
    slug: 'nisa-sleeved-modest-kurti',
    tab: 'upto-50',
    category: 'kurtis',
    badge: '56% off',
    regularPrice: 1599,
    salePrice: 699,
    images: [
      '/nishorama-images/product-ADK08504.jpg',
      '/nishorama-images/product-NY-K-CP0092_3.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Deep navy blue straight kurti adorned with geometric bootis, full sleeves, and contrasting border accents.',
    fabric: 'Premium Slub Cotton',
    details: ['Full sleeve modest styling', 'Side slit straight fit', 'Calf length hemline', 'Colourfast dyes']
  },

  // MOST WANTED Tab
  {
    id: 'white-loose-fitting-pants',
    title: 'White Loose fitting pants',
    slug: 'white-loose-fitting-pants',
    tab: 'most-wanted',
    category: 'bottoms',
    badge: '20% off',
    regularPrice: 1499,
    salePrice: 1199,
    images: [
      '/nishorama-images/product-whiteloosepant-HERO-AI.jpg',
      '/nishorama-images/product-white_pants.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'The iconic Nishorama wide-leg pants in pristine white. Tailored with deep side pockets and relaxed drape.',
    fabric: 'Linen-Cotton Blend',
    details: ['Free pants offer eligible', 'Deep functional pockets', 'Elasticated back waistband', 'Pairs with all kurtis']
  },
  {
    id: 'black-loose-fitting-pants',
    title: 'Black Loose fitting pants',
    slug: 'black-loose-fitting-pants',
    tab: 'most-wanted',
    category: 'bottoms',
    badge: '20% off',
    regularPrice: 1499,
    salePrice: 1199,
    images: [
      '/nishorama-images/product-black_pants-hero-AI.jpg',
      '/nishorama-images/product-black_pants-back-AI_1.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Classic midnight black wide-leg relaxed trousers engineered for effortless ethnic and fusion styling.',
    fabric: 'High-Density Cotton Twill',
    details: ['Wrinkle resistant', 'Dual side pockets', 'Clean front belt finish', 'Machine wash cold']
  },
  {
    id: 'navy-blue-loose-fitting-pants',
    title: 'Navy Blue Loose fitting pants',
    slug: 'navy-blue-loose-fitting-pants',
    tab: 'most-wanted',
    category: 'bottoms',
    badge: '20% off',
    regularPrice: 1499,
    salePrice: 1199,
    images: [
      '/nishorama-images/product-navybluepants-hero-AI.jpg',
      '/nishorama-images/product-navybluepants-back-AI.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Rich royal navy blue relaxed fitting trousers with breathable natural weave and elegant drape.',
    fabric: 'Linen-Cotton Blend',
    details: ['Breathable linen blend', 'Relaxed palazzo cut', 'Comfort stretch back', 'Deep pockets']
  },
  {
    id: 'jasmin-pink-full-sleeve-kurti',
    title: 'Jasmin Pink Full Sleeve Kurti',
    slug: 'jasmin-pink-full-sleeve-kurti',
    tab: 'most-wanted',
    category: 'kurtis',
    badge: '56% off',
    regularPrice: 1599,
    salePrice: 699,
    images: [
      '/nishorama-images/product-196.jpg',
      '/nishorama-images/product-197.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    description: 'Charming blush pink full-sleeve kurti with hand-screen printed floral vines, Mandarin collar, and pearl buttons.',
    fabric: '100% Fine Mul Cotton',
    details: ['Full sleeves with button cuffs', 'Delicate pearl buttons', 'Side slits for mobility', 'Hand wash recommended']
  }
];

export const NISHORAMA_STORIES = [
  {
    id: 1,
    title: 'DIWALI SPECIALS',
    image: '/nishorama-images/banner-sets.png',
    subtitle: 'Limited Festive Editions',
    tag: '50% OFF'
  },
  {
    id: 2,
    title: 'CORSET KURTIS',
    image: '/nishorama-images/product-halter_neck_corset_kurti.jpg',
    subtitle: 'Signature Dabu Prints',
    tag: 'TRENDING'
  },
  {
    id: 3,
    title: 'LOOSE PANTS',
    image: '/nishorama-images/product-whiteloosepant-HERO-AI.jpg',
    subtitle: 'Free on Orders > ₹2999',
    tag: 'MOST WANTED'
  },
  {
    id: 4,
    title: 'FESTIVE SETS',
    image: '/nishorama-images/banner-most-wanted.png',
    subtitle: 'Two & Three Piece Outfits',
    tag: 'UP TO 50%'
  }
];

export const NISHORAMA_POPULAR_SEARCHES = {
  Kurtis: [
    { text: 'All Kurtis', href: '/collections/kurtis' },
    { text: 'Short Kurti', href: '/collections/short-kurti' },
    { text: 'Long Kurti', href: '/collections/long-kurti' },
    { text: 'Sleeveless Kurti', href: '/collections/sleeveless-kurtis' },
    { text: 'Sleeved Kurti', href: '/collections/full-sleeve-kurti' },
    { text: 'Corset Kurti', href: '/collections/corset-kurti' },
    { text: 'Deep Back Kurti', href: '/collections/deep-back-kurti' },
    { text: 'Halter Kurti', href: '/collections/halter-neck-kurti' }
  ],
  Tops: [
    { text: 'All Tops', href: '/collections/tops' },
    { text: 'Cover Ups', href: '/collections/cover-ups' },
    { text: 'Corset Tops', href: '/collections/corset-tops' },
    { text: 'Halter Tops', href: '/collections/halter-neck-kurti' },
    { text: 'Fitted Tops', href: '/collections/fitted-tops' },
    { text: 'Loose Fitted Tops', href: '/collections/loose-fitted-tops' }
  ],
  Sets: [
    { text: 'All Sets', href: '/collections/sets' },
    { text: 'Skirt Sets', href: '/collections/skirt-set' },
    { text: '3 Piece', href: '/collections/3-piece' },
    { text: '2 Piece', href: '/collections/2-piece' }
  ],
  Bottoms: [
    { text: 'All Bottoms', href: '/collections/bottoms' },
    { text: 'Pants', href: '/collections/bottoms' },
    { text: 'Skirts', href: '/collections/skirts' }
  ],
  Dresses: [
    { text: 'All Dresses', href: '/collections/dresses' },
    { text: 'Maxi Dresses', href: '/collections/maxi-dresses' },
    { text: 'Mini Dresses', href: '/collections/mini-dress' }
  ],
  'Our Collections': [
    { text: 'NishoOffice SS2', href: '/collections/nishooffice-ss2' },
    { text: 'NishoOffice SS1', href: '/collections/nishooffice-ss1' },
    { text: 'NishoHaveli SS2', href: '/collections/nishohaveli-ss2' },
    { text: 'NishoHaveli SS1', href: '/collections/nishohaveli-ss1' },
    { text: 'Desi Romance', href: '/collections/desi-romance' }
  ]
};
