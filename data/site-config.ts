export interface SiteConfig {
  brandName: string;
  tagline: string;
  description: string;
  whatsappNumber: string; // international digits without plus
  whatsappDisplay: string;
  email: string;
  location: string;
  originHub: string;
  productionDomain: string;
  announcementText: string;
  currencyNotice: string;
  moqNotice: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export const siteConfig: SiteConfig = {
  brandName: 'Wastram',
  tagline: "Indian Women's Wear Wholesale & Export Manufacturer",
  description:
    "Wastram is an export-oriented Indian women's wear manufacturer and wholesale supplier. Discover handcrafted 3-piece suit sets, designer co-ords, tiered dresses, artisanal kurtas, festive lehengas, and luxe satin shirts crafted for global retailers and fashion boutiques.",
  whatsappNumber: '918003088838',
  whatsappDisplay: '+91 80030 88838',
  email: 'exports@wastram.com', // placeholder / documented point
  location: 'Jaipur, Rajasthan, India',
  originHub: 'Sanganer Textile Craft Hub, Jaipur',
  productionDomain: 'https://wastram.com',
  announcementText: "Indian Women's Wear | Wholesale & International Enquiries Welcome",
  currencyNotice: 'Wholesale pricing quoted upon enquiry based on order volume and destination',
  moqNotice: 'Flexible Wholesale MOQs – Direct Manufacturer Communication via WhatsApp',
  socials: {
    instagram: 'https://instagram.com/wastram_exports',
  },
};

/**
 * Builds the official wa.me WhatsApp URL with a prefilled, URL-encoded message
 */
export function buildWhatsAppLink(message: string, customNumber?: string): string {
  const number = customNumber || siteConfig.whatsappNumber;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Common WhatsApp message generators
 */
export const whatsappMessages = {
  general: () =>
    `Hello Wastram, I am interested in your Indian women's wear wholesale collections. Please share more information about your available catalogues and the wholesale enquiry process.`,
  
  category: (categoryName: string) =>
    `Hello Wastram, I am interested in your "${categoryName}" collection. Could you please share more information regarding available designs, minimum quantities, and wholesale pricing?`,

  product: (productName: string, sku?: string, category?: string) => {
    const ref = sku ? ` (Ref / SKU: ${sku})` : '';
    const cat = category ? ` in ${category}` : '';
    return `Hello Wastram, I am interested in enquiring about "${productName}"${ref}${cat}. Could you please share the available details, fabric specifications, and wholesale export pricing?`;
  },

  international: () =>
    `Hello Wastram, I am contacting you regarding international wholesale purchases of Indian women's wear for our boutique / retail business. I would like to discuss available collections, order quantities, and international delivery options.`,

  customOrder: (details?: string) =>
    `Hello Wastram, I would like to enquire about bulk wholesale / private label sourcing for our brand. ${details ? `Details: ${details}` : 'Please connect me with your export coordinator.'}`,
};
