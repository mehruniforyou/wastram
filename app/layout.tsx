import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import CartDrawer from '@/components/CartDrawer';
import WishlistToast from '@/components/WishlistToast';
import TapAndViewModal from '@/components/TapAndViewModal';
import BodyMeasurementModal from '@/components/BodyMeasurementModal';
import StoryViewerModal from '@/components/StoryViewerModal';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F5' },
    { media: '(prefers-color-scheme: dark)', color: '#12100E' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Wastram | Authentic Jaipur Handloom & Contemporary Atelier',
  description:
    'Direct-from-atelier wholesale sourcing for luxury boutiques. Specializing in Pure Mulmul, Modal Silk, Gota Patti appliqué, and Sanganeri handblock prints with worldwide boutique air freight.',
  keywords:
    'Wastram, Jaipur Handloom Atelier, Pure Mulmul, Modal Silk, Gota Patti, Sanganeri Block Print, Wholesale Boutique Sourcing, Export Garments',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Wastram | Authentic Jaipur Handloom & Contemporary Atelier',
    description:
      'Direct-from-atelier wholesale sourcing for luxury boutiques. 1,400+ handcrafted silhouettes in Pure Mulmul, Modal Silk, and Chanderi.',
    url: 'https://www.wastram.in',
    siteName: 'Wastram',
    images: [
      {
        url: '/images/hero/hero-main.jpg',
        width: 1200,
        height: 800,
        alt: 'Wastram Atelier Jaipur',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/images/brand/wastram-artisan-crest.jpg',
    apple: '/images/brand/wastram-artisan-crest.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-background text-foreground font-sans antialiased selection:bg-[#0B2D7F] selection:text-white w-full">
        <ThemeProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <StoryViewerModal />
            <TapAndViewModal />
            <BodyMeasurementModal />
            <WishlistToast />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
