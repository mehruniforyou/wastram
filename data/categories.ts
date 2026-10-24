export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  itemCount: number;
  fabrics: string[];
  silhouette: string;
  featured: boolean;
  order: number;
}

export const categories: Category[] = [
  {
    id: '3-piece-sets',
    name: 'Royal 3-Piece Kurti Sets',
    slug: '3-piece-sets',
    tagline: 'Regal ensemble of anarkalis, farshi salwars & handcrafted dupattas',
    description:
      'Explore opulent three-piece Indian ethnic ensembles featuring heavily embroidered kurtas, Farshi salwars, and pure Chanderi or organza dupattas. Tailored with zari borders, gota work, and artisan floral motifs for high-end boutique collections and bridal/festive retailers.',
    heroImage: '/images/hero/hero-main.jpg',
    itemCount: 20,
    fabrics: ['Chanderi Silk', 'Pure Cotton 60:60', 'Mal Chanderi', 'Fine Muslin'],
    silhouette: 'Flared Anarkali, Straight Kurta, Farshi Salwar & Pants with Matching Dupatta',
    featured: true,
    order: 1,
  },
  {
    id: 'co-ord-sets',
    name: 'Designer Ethnic Co-Ords',
    slug: 'co-ord-sets',
    tagline: 'Modern luxury 2-piece tunics & tailored trousers',
    description:
      'Contemporary two-piece coordinated sets bridging traditional Indian block motifs with clean, global Western tailoring. Crafted in breathable cottons and luxe blends, featuring delicate neckline hand-embroidery and matching cigarette or straight-leg trousers.',
    heroImage: '/images/hero/hero-coords.jpg',
    itemCount: 20,
    fabrics: ['Pure Cotton 60:60', 'Mal Chanderi', 'Slub Rayon', 'Cambric Cotton'],
    silhouette: 'Mid-Length Tunic with Straight-Cut Tailored Trousers & Palazzos',
    featured: true,
    order: 2,
  },
  {
    id: 'dresses',
    name: 'Indo-Western & Tiered Dresses',
    slug: 'dresses',
    tagline: 'Flowing romantic silhouettes with botanical & ethnic prints',
    description:
      'Breezy, feminine tiered maxi and midi dresses designed for resort boutiques, summer retail collections, and contemporary evening wear. Printed with delicate Jaipuri botanicals, paisleys, and abstract motifs on airy chiffon, georgette, and rayon.',
    heroImage: '/images/hero/hero-dress.jpg',
    itemCount: 20,
    fabrics: ['Airy Chiffon', 'Lustrous Rayon', 'Georgette', 'Fine Voile'],
    silhouette: 'Tiered Flared Maxi, Midi Dress, Shirt Dress & A-Line Flared Cuts',
    featured: true,
    order: 3,
  },
  {
    id: 'kurtas-anarkalis',
    name: 'Artisanal Kurtas & Anarkalis',
    slug: 'kurtas-anarkalis',
    tagline: 'Authentic Angrakha, Kalidar & straight-cut Indian tunics',
    description:
      'Timeless Indian kurtas celebrating classic tailoring, from Angrakha overlapping necklines to flared multi-kali silhouettes. Embellished with subtle silver and gold gota patti trims and heritage woodblock prints, perfect for everyday sophistication and festive wear.',
    heroImage: '/images/products/kurtas/item-001-000.jpg',
    itemCount: 20,
    fabrics: ['100% Pure Cotton', 'Premium Rayon', 'Modal Silk', 'Dobby Cotton'],
    silhouette: 'Angrakha Wrap, A-Line Flared, Long Straight Cut, High-Slit Tunics',
    featured: true,
    order: 4,
  },
  {
    id: 'lehengas',
    name: 'Heritage Festive Lehengas',
    slug: 'lehengas',
    tagline: 'High-volume flared skirts with matching choli & dupattas',
    description:
      'Spectacular Indian lehenga sets crafted with high-volume kali construction, metallic foil prints, and heritage border detailing. Designed for diaspora boutiques, international destination weddings, and cultural celebrations.',
    heroImage: '/images/hero/hero-lehenga.jpg',
    itemCount: 15,
    fabrics: ['Printed Cotton', 'Foil Silk', 'Tissue Chanderi', 'Organza'],
    silhouette: 'Full Flared Circular Lehenga, Fitted Blouse / Choli & Organza Dupatta',
    featured: true,
    order: 5,
  },
  {
    id: 'satin-shirts',
    name: 'Luxe Silk-Satin Shirts',
    slug: 'satin-shirts',
    tagline: 'Tailored high-sheen blouses in stripes & botanical prints',
    description:
      'Premium European-fit satin button-downs that combine fluid drape with vibrant patterns. Featuring crisp point collars, French cuffs, and bold stripes, jungle florals, and heritage motifs designed for international fashion stockists.',
    heroImage: '/images/hero/hero-satin.jpg',
    itemCount: 16,
    fabrics: ['Silk-Satin Blend', 'Polished Twill', 'Liquid Satin'],
    silhouette: 'Relaxed Tailored Fit, Classic Collar, French Cuffed Button-Down',
    featured: true,
    order: 6,
  },
  {
    id: 'tops-tunics',
    name: 'Embroidered Tops & Tunics',
    slug: 'tops-tunics',
    tagline: 'Lace-accented, peplum & bell-sleeve contemporary tops',
    description:
      'Chic everyday tops and short tunics blending Indian artisanal needlecraft with contemporary casual wear. Adorned with delicate sheer lace panels, bell sleeves, pearl buttons, and flattering tiered babydoll hems.',
    heroImage: '/images/products/tops-tunics/item-001-000.jpg',
    itemCount: 20,
    fabrics: ['Guipure Lace & Cotton', 'Soft Rayon', 'Schiffli Cotton', 'Georgette'],
    silhouette: 'Peplum, Bell Sleeve, Straight Hip-Length Tunics & Bohemian Blouses',
    featured: false,
    order: 7,
  },
];
