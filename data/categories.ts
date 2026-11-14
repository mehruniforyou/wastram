export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  image?: string;
  itemCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  itemCount?: number;
  subcategories?: SubCategory[];
  isVirtual?: boolean;
  // Storefront backwards compatibility fields:
  tagline?: string;
  heroImage?: string;
  fabrics?: string[];
  silhouette?: string;
  featured?: boolean;
  order?: number;
  translations?: Record<string, {
    name?: string;
    description?: string;
  }>;
}

export const CATEGORIES: Category[] = [
  {
    id: "western-dresses",
    name: "Western Dresses",
    slug: "western-dresses",
    description: "Export-grade contemporary maxi, midi, and tiered Western dresses tailored in fine modal, georgette, and cotton silks.",
    image: "/western-dresses/1.jpg.jpeg",
    heroImage: "/western-dresses/1.jpg.jpeg",
    itemCount: 443,
    featured: true,
    order: 1,
  },
  {
    id: "traditional-gowns",
    name: "Traditional Gowns",
    slug: "traditional-gowns",
    description: "Opulent flared floor-length gowns and anarkalis featuring hand embroidery, zari work, and royal Jaipur artisan accents.",
    image: "/traditional-gowns/1.jpg.jpeg",
    heroImage: "/traditional-gowns/1.jpg.jpeg",
    itemCount: 112,
    featured: true,
    order: 2,
  },
  {
    id: "cord-sets",
    name: "Co-ord Sets",
    slug: "cord-sets",
    description: "Chic 2-piece and 3-piece coordinated ensembles, tailored pants, and matching tunics crafted for resort and retail collections.",
    image: "/cord-sets/1.jpg.jpeg",
    heroImage: "/cord-sets/1.jpg.jpeg",
    itemCount: 173,
    featured: true,
    order: 3,
  },
  {
    id: "tops-shirts",
    name: "Tops & Shirts",
    slug: "tops-shirts",
    description: "Artisanal block-printed tunics, breathable cotton shirts, and peplum blouses designed for effortless everyday elegance.",
    image: "/tops-shirts/1.jpg.jpeg",
    heroImage: "/tops-shirts/1.jpg.jpeg",
    itemCount: 133,
    featured: true,
    order: 4,
  },
  {
    id: "ethnic-wear-sets",
    name: "Ethnic Wear Sets",
    slug: "ethnic-wear-sets",
    description: "Classic Indian kurta sets with matching farshi salwars, straight trousers, and handwoven Chanderi or organza dupattas.",
    image: "/ethnic-wear-sets/1.jpg.jpeg",
    heroImage: "/ethnic-wear-sets/1.jpg.jpeg",
    itemCount: 171,
    featured: true,
    order: 5,
  },
  {
    id: "short-long-kaftan",
    name: "Kaftans (Short & Long)",
    slug: "short-long-kaftan",
    description: "Flowing bohemian and luxury lounge kaftans with tasselled waist drawstrings and handcrafted Jaipur motifs.",
    image: "/short-long-kaftan/1.jpg.jpeg",
    heroImage: "/short-long-kaftan/1.jpg.jpeg",
    itemCount: 297,
    featured: true,
    order: 6,
  },
  {
    id: "umbrella-dresses",
    name: "Umbrella Dresses",
    slug: "umbrella-dresses",
    description: "Dramatic full-flare 360-degree circular umbrella cut dresses with pom-pom lace hems and dynamic colorway shoots.",
    image: "/umbrella-dresses/4726.jpg.jpeg",
    heroImage: "/umbrella-dresses/4726.jpg.jpeg",
    itemCount: 319,
    featured: true,
    order: 7,
  },
  {
    id: "denim-collection",
    name: "Denim Collection",
    slug: "denim-collection",
    description: "Handcrafted denim jackets, indigo wash shirts, distressed tunics, and modern luxury denim silhouettes.",
    image: "/denim-collection/1.jpg.jpeg",
    heroImage: "/denim-collection/1.jpg.jpeg",
    itemCount: 146,
    featured: true,
    order: 8,
  },
  {
    id: "t-shirts",
    name: "T-Shirts",
    slug: "t-shirts",
    description: "Super-combed bio-washed cotton round-neck and polo tees crafted for comfort, breathability, and bulk boutique supply.",
    image: "/t-shirts/1.jpg.jpeg",
    heroImage: "/t-shirts/1.jpg.jpeg",
    itemCount: 38,
    featured: false,
    order: 9,
  },
  {
    id: "hoodies-sweatshirts",
    name: "Hoodies & Sweatshirts",
    slug: "hoodies-sweatshirts",
    description: "Premium fleece-lined heavyweight pullover hoodies and drop-shoulder streetwear sweatshirts.",
    image: "/hoodies-sweatshirts/1.jpg.jpeg",
    heroImage: "/hoodies-sweatshirts/1.jpg.jpeg",
    itemCount: 40,
    featured: false,
    order: 10,
  },
];

export const categories: Category[] = CATEGORIES;
