import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import MobileBottomNav from '@/components/MobileBottomNav';
import { siteConfig } from '@/data/site-config';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#173B78',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.productionDomain),
  title: {
    default: `${siteConfig.brandName} | Indian Women's Wear Wholesale & Export Manufacturer`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.description,
  keywords: [
    "Indian women's wear wholesale",
    "Indian women's clothing wholesale supplier",
    "Women's ethnic wear wholesale India",
    "Wholesale Indian fashion collections",
    "Indian clothing for boutiques and retailers",
    "Indian women's wear export enquiries",
    "Jaipur kurti manufacturer wholesale",
    "Chanderi suit set wholesale supplier India",
    "Ethnic co ords wholesale",
    "Tiered floral dresses export",
    "Satin silk shirts wholesale India",
  ],
  authors: [{ name: siteConfig.brandName }],
  creator: siteConfig.brandName,
  publisher: siteConfig.brandName,
  icons: {
    icon: '/images/brand/favicon.png',
    apple: '/images/brand/wastram-emblem.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.productionDomain,
    siteName: siteConfig.brandName,
    title: `${siteConfig.brandName} | Indian Women's Wear Wholesale & Export`,
    description: siteConfig.description,
    images: [
      {
        url: '/images/hero/hero-main.jpg',
        width: 1200,
        height: 1200,
        alt: `${siteConfig.brandName} Premium Indian Women's Wear Wholesale`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.brandName} | Indian Women's Wear Wholesale & Export`,
    description: siteConfig.description,
    images: ['/images/hero/hero-main.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.productionDomain,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured Data (JSON-LD Organization & WebSite)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.brandName,
    url: siteConfig.productionDomain,
    logo: `${siteConfig.productionDomain}/images/brand/wastram-logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${siteConfig.whatsappNumber}`,
      contactType: 'sales',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.brandName,
    url: siteConfig.productionDomain,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.productionDomain}/collections?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-white text-charcoal antialiased pb-16 lg:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <MobileBottomNav />
      </body>
    </html>
  );
}
