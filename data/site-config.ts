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
  tagline: 'Authentic Indian Textiles & Contemporary Haute Luxury',
  description:
    "Wastram is an artisanal Indian women's wear atelier and couture manufacturer. Discover handcrafted 3-piece suit sets, designer co-ords, tiered dresses, artisanal kurtas, festive lehengas, and luxe satin shirts crafted for global fashion boutiques.",
  whatsappNumber: '918003088838',
  whatsappDisplay: '+91 80030 88838',
  email: 'exports@wastram.com',
  location: 'Jaipur, Rajasthan, India',
  originHub: 'Sanganer Textile Craft Hub, Jaipur',
  productionDomain: 'https://wastram.com',
  announcementText: 'Indian Haute Textiles | Boutique & Trade Inquiries Welcome',
  currencyNotice: 'Boutique pricing quoted upon inquiry based on collection selection and volume',
  moqNotice: 'Flexible Atelier Batch MOQs - Direct Concierge Communication via WhatsApp',
  socials: {
    instagram: 'https://instagram.com/wastram_exports',
    facebook: 'https://facebook.com/wastram',
    linkedin: 'https://linkedin.com/company/wastram',
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
    `Hello Wastram Atelier, I am interested in your Indian women's wear collections. Please share more information about your available lookbooks and trade inquiries.`,
  
  category: (categoryName: string) =>
    `Hello Wastram Atelier, I am interested in your "${categoryName}" collection. Could you please share more information regarding available designs, minimum quantities, and boutique pricing?`,

  product: (productName: string, sku?: string, category?: string) => {
    const ref = sku ? ` (Ref / SKU: ${sku})` : '';
    const cat = category ? ` in ${category}` : '';
    return `Hello Wastram Atelier, I am interested in inquiring about "${productName}"${ref}${cat}. Could you please share the available details, fabric specifications, and trade pricing?`;
  },

  international: () =>
    `Hello Wastram Atelier, I am contacting you regarding boutique sourcing of Indian women's wear for our retail business. I would like to discuss available collections, order quantities, and international delivery options.`,

  customOrder: (details?: string) =>
    `Hello Wastram Atelier, I would like to inquire about bespoke manufacturing / private label sourcing for our brand. ${details ? `Details: ${details}` : 'Please connect me with your atelier coordinator.'}`,
};
