const fs = require('fs');
const path = require('path');

const categories = {
  '3-piece-sets': {
    name: 'Royal 3-Piece Kurti Sets',
    slug: '3-piece-sets',
    prefix: 'WST-SET',
    names: [
      'Chandrika Royal Chanderi Anarkali Suit',
      'Zeenat Handcrafted Farshi Salwar Suit',
      'Gulbagh Embroidered Pure Cotton Set',
      'Mehtab Zari Embellished Mal Chanderi Suit',
      'Noorani Flared Kalidar Kurta Ensemble',
      'Rukhsar Festive Gota Patti Suit Set',
      'Aafreen Organza Bordered Suit Ensemble',
      'Tasneem Pure Silk-Blend Anarkali',
      'Sitara Handblocked Floral Farshi Suit',
      'Nazneen Heritage Jaipur Chanderi Set',
      'Mehrunisa Flared Jamdani Accent Set',
      'Bano Handworked Pure Muslin Suit',
      'Roohani Embroidered Yoke Anarkali',
      'Dilshad Zardozi Highlighted Kurta Set',
      'Farah Festive Cotton Chanderi Set',
      'Bahaar Sanganeri Motif Suit Ensemble',
      'Kareena Luxury Farshi Salwar Ensemble',
      'Zohra Dual-Tone Dupatta Suit Set',
      'Parizaad Heritage Gold Print Ensemble',
      'Yasmin Pastel Chanderi Festive Suit'
    ],
    fabrics: ['Chanderi Silk', 'Pure Cotton 60:60', 'Mal Chanderi', 'Fine Muslin', 'Silk-Blend'],
    details: 'Full 3-piece set comprising kurti/anarkali, tailored pants/farshi salwar, and embellished dupatta. Intricate neckline embroidery with zari and gota accents.'
  },
  'co-ord-sets': {
    name: 'Designer Ethnic Co-Ords',
    slug: 'co-ord-sets',
    prefix: 'WST-CORD',
    names: [
      'Aarohi Pastel Peach Floral Co-Ord',
      'Zoya Minimalist Embroidered Cotton Co-Ord',
      'Gulnar Block-Printed Tunic & Trousers',
      'Meera Handcrafted Tassel Co-Ord Set',
      'Ananya Pure Chanderi Cigarette-Pant Co-Ord',
      'Kiran Linen-Cotton Resort Co-Ord',
      'Nandini Floral Slub Rayon Two-Piece',
      'Rhea Geometric Print Tailored Set',
      'Dia Keyhole Neck Embroidered Co-Ord',
      'Tanvi High-Slit Tunic & Pant Set',
      'Saanvi Botanical Jaipuri Print Co-Ord',
      'Isha Pastel Mint Contrast Yoke Set',
      'Avani Terracotta Tailored Two-Piece',
      'Siya Mustard Floral Ethnic Co-Ord',
      'Prisha Contemporary Indigo Tunic Set',
      'Kavya Embroidered Lapel Co-Ord',
      'Pari Tiered Hem Tunic with Cigarette Pants',
      'Aditi Artisan Motif Pure Cotton Co-Ord',
      'Tara Summer Breeze Slub Co-Ord Set',
      'Navya Luxury Mal Chanderi Co-Ord'
    ],
    fabrics: ['Pure Cotton 60:60', 'Mal Chanderi', 'Slub Rayon', 'Cambric Cotton'],
    details: 'Modern two-piece coordinated set with comfort-fit tailored trousers or ankle-length straight pants. Designed for chic daytime elegance and effortless wholesale appeal.'
  },
  'dresses': {
    name: 'Indo-Western & Tiered Dresses',
    slug: 'dresses',
    prefix: 'WST-DRS',
    names: [
      'Aria Tiered Floral Chiffon Maxi Dress',
      'Mira Botanical Print Tiered Midi',
      'Sultana Bohemian Flared Rayon Dress',
      'Elysia Resort Collared Shirt Dress',
      'Nyla Tiered Meadow Georgette Dress',
      'Tara Pastel Floral Tiered Sundress',
      'Zara Flared Tiered Midi with Pockets',
      'Leila Sanganeri Indigo Flared Dress',
      'Elena Smocked Yoke Chiffon Maxi',
      'Amara Mandarin Collar Tiered Midi',
      'Freya Multi-Tier Floral Georgette Gown',
      'Chloe Romantic Ruffle Sleeve Midi Dress',
      'Maya Bohemian High-Low Flared Dress',
      'Iris Jaipuri Floral Summer Maxi',
      'Seraphina Handprinted Button-Front Midi',
      'Clara Fluid Rayon Tiered Day Dress',
      'Dahlia Tiered Bell-Sleeve Midi',
      'Sienna Abstract Wave Chiffon Dress',
      'Rosalia Vibrant Floral Empire Midi',
      'Vivienne Vintage Floral Tiered Dress'
    ],
    fabrics: ['Airy Chiffon', 'Lustrous Rayon', 'Soft Georgette', 'Fine Voile'],
    details: 'Relaxed tiered silhouette with breathable inner lining where required. Delicate flare designed for high-end boutique resort and casual wear collections.'
  },
  'kurtas': {
    name: 'Artisanal Kurtas & Anarkalis',
    slug: 'kurtas-anarkalis',
    prefix: 'WST-KRT',
    names: [
      'Roopkala Angrakha Flared Cotton Kurti',
      'Jasmine Floral Print Straight-Cut Kurta',
      'Chhavi Handblocked Kalidar Tunic',
      'Parijaat Sanganeri Printed A-Line Kurta',
      'Vaidehi Embroidered Placket Cotton Kurti',
      'Chandani Classic Off-White Kalidar',
      'Riddhi Mustard Bandhani Print Kurta',
      'Shalini High-Slit Longline Rayon Kurta',
      'Madhavi Keyhole Neck Flared Kurti',
      'Bhavna Artisan Woodblock Straight Kurta',
      'Gauri Foil Printed Festive Kalidar',
      'Kaveri Round Neck Slub Rayon Kurti',
      'Deepika Traditional Jaipuri Buta Kurta',
      'Alaknanda Dual-Tone Flared Anarkali',
      'Sarojini Subtle Gota Border Straight Kurta',
      'Vasudha Indigo Dabu Print Cotton Tunic',
      'Mohini Festive Embroidered Neckline Kurti',
      'Revati Flared Hem Floral Summer Kurta',
      'Charulata Minimalist Pin-Tuck Kurta',
      'Manjari Printed Rayon Everyday Kurta'
    ],
    fabrics: ['100% Pure Cotton', 'Lustrous Rayon', 'Modal Cotton', 'Dobby Cambric'],
    details: 'Traditional and fusion Indian kurti silhouettes cut from pre-shrunk breathable textiles with neat edge finishing and tasteful button accents.'
  },
  'lehengas': {
    name: 'Heritage Festive Lehengas',
    slug: 'lehengas',
    prefix: 'WST-LHG',
    names: [
      'Sitara Royal Navy Foil Printed Lehenga Set',
      'Meera Heritage Bandhani Volume Skirt Ensemble',
      'Padmavati Golden Zari Border Lehenga',
      'Rukmani Chanderi Festive Lehenga with Dupatta',
      'Devika Handcrafted Kali Festive Lehenga',
      'Yamini Marigold Yellow Sangeet Lehenga',
      'Shambhavi Peacock Blue Foil Printed Set',
      'Anandi Traditional Block Print Ghagra Set',
      'Kalyani Rich Maroon Festive Circular Lehenga',
      'Urvashi Mirror-Work Accent Festive Lehenga',
      'Damayanti Emerald Royal Flared Skirt Set',
      'Maitreyi Organza Bordered Festive Lehenga',
      'Satyavati Contemporary Pastel Wedding Lehenga',
      'Subhadra Metallic Foil Accent Festive Set',
      'Indrani Regal Jaipuri Festive Ensemble'
    ],
    fabrics: ['Printed Cotton', 'Foil Silk', 'Tissue Chanderi', 'Soft Organza'],
    details: 'High-volume flared skirt with structured waistband, matching patterned blouse/choli, and lightweight dupatta. Crafted for weddings, festive galas, and celebrations.'
  },
  'satin-shirts': {
    name: 'Luxe Silk-Satin Shirts',
    slug: 'satin-shirts',
    prefix: 'WST-SAT',
    names: [
      'Soraya Forest Green Striped Satin Shirt',
      'Sienna Mocha Espresso Striped Satin Blouse',
      'Verona Classic Navy Pinstripe Satin Shirt',
      'Leona Emerald Leopard Print Satin Blouse',
      'Safira Vintage Botanical Silk-Satin Shirt',
      'Aurelia Champagne Geometric Satin Blouse',
      'Geneva Monochrome Bold Stripe Satin Shirt',
      'Paloma Terracotta Sunset Striped Shirt',
      'Celina Olive Botanical Luxe Satin Top',
      'Olympia Royal Blue Multi-Stripe Blouse',
      'Valentina Baroque Scarf Print Satin Shirt',
      'Camilla Pearl White Satin Button-Down',
      'Giselle Tuscan Rust Striped Satin Blouse',
      'Milan Midnight Abstract Motif Satin Shirt',
      'Seline Coral Blossom Satin Silk Shirt',
      'Bianca Ivory Classic Tailored Satin Shirt'
    ],
    fabrics: ['Silk-Satin Blend', 'Polished Liquid Twill', 'Fine Crepe Satin'],
    details: 'Tailored European-cut button-down shirt with structured point collar, curved hemline, and buttoned French-style cuffs. Fluid luxury drape with high colour retention.'
  },
  'tops-tunics': {
    name: 'Embroidered Tops & Tunics',
    slug: 'tops-tunics',
    prefix: 'WST-TOP',
    names: [
      'Genevieve Black Guipure Lace Bell-Sleeve Top',
      'Celeste Tiered Babydoll Embroidered Top',
      'Ophelia Bohemian Floral Cotton Tunic',
      'Isla Peplum Embroidered Summer Top',
      'Amelie Sheer Lace Overlay Short Kurti',
      'Colette Mandarin Collar Slub Rayon Top',
      'Delphine Scallop Lace Hemline Tunic',
      'Juliette Smocked Neckline Blouse',
      'Elise Geometric Embroidered Short Kurta',
      'Margot Pure White Schiffli Cotton Top',
      'Fleur Jaipuri Floral Pintuck Tunic',
      'Seraphine Flared Bell-Cuff Embroidered Top',
      'Nadine Ruffled Sleeve Summer Tunic',
      'Adele Embroidered Yoke Bohemian Top',
      'Cosette Textured Dobby Cotton Short Kurti',
      'Camille Vintage Floral Peplum Blouse',
      'Blythe Contemporary Button-Down Tunic',
      'Helena Lace Trimmed Relaxed Fit Top',
      'Aveline Pastel Floral Tie-Up Neck Top',
      'Vivian Crisp White Cotton Lace Tunic'
    ],
    fabrics: ['Guipure Lace & Cotton', 'Soft Rayon', 'Schiffli Cotton', 'Georgette'],
    details: 'Versatile contemporary tops featuring artisanal lace insets, delicate button plackets, and relaxed hip-skimming lengths suitable for global markets.'
  }
};

const products = [];

Object.keys(categories).forEach(catKey => {
  const cat = categories[catKey];
  const dir = path.join('public', 'images', 'products', catKey);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('-clean.jpg') || (f.endsWith('.jpg') && !f.includes('-clean') && !fs.existsSync(path.join(dir, f.replace('.jpg', '-clean.jpg')))));

  files.forEach((file, idx) => {
    const id = `${cat.slug}-${idx + 1}`;
    const name = cat.names[idx] || `${cat.name} Design ${idx + 1}`;
    const sku = `${cat.prefix}-${String(idx + 101).padStart(3, '0')}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const fabric = cat.fabrics[idx % cat.fabrics.length];
    const imagePath = `/images/products/${catKey}/${file}`;

    products.push({
      id,
      name,
      slug,
      categoryId: catKey,
      categoryName: cat.name,
      categorySlug: cat.slug,
      sku,
      image: imagePath,
      gallery: [imagePath],
      fabric,
      sizes: ['M', 'L', 'XL', '2XL', '3XL'],
      description: `${name} is an exquisite Indian women's wear design from Wastram's ${cat.name} collection. ${cat.details} Hand-finished with precision stitching and export-grade material durability.`,
      wholesaleEnquiryStatus: 'Available for Bulk & Wholesale Orders',
      moq: 'Flexible Wholesale MOQ (Direct Enquiries)',
      exportMarkets: ['United Kingdom', 'North America', 'Europe', 'Middle East', 'Australia', 'Southeast Asia'],
      isFeatured: idx < 2, // First 2 of each category featured on homepage
      seoTitle: `${name} | Indian Women's Wear Wholesale Supplier | Wastram`,
      seoDescription: `Enquire wholesale export pricing for ${name} (${sku}) by Wastram. Premium Indian ${cat.name.toLowerCase()} in ${fabric} for fashion boutiques and retailers worldwide.`
    });
  });
});

console.log(`Generated ${products.length} products total.`);

const fileContent = `export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  sku: string;
  image: string;
  gallery: string[];
  fabric: string;
  sizes: string[];
  description: string;
  wholesaleEnquiryStatus: string;
  moq: string;
  exportMarkets: string[];
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
}

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.categoryId === categoryId || p.categorySlug === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(p => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, limit);
}
`;

fs.writeFileSync('data/products.ts', fileContent);
console.log('Saved data/products.ts successfully!');
