import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import CartDrawer from '@/components/CartDrawer';
import WishlistToast from '@/components/WishlistToast';
import TapAndViewModal from '@/components/TapAndViewModal';
import BodyMeasurementModal from '@/components/BodyMeasurementModal';
import StoryViewerModal from '@/components/StoryViewerModal';
import CurtainIntro from '@/components/CurtainIntro';
import NavigationProgressBar from '@/components/NavigationProgressBar';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0B2D7F' },
    { media: '(prefers-color-scheme: dark)', color: '#0B2D7F' },
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
    icon: '/images/brand/wastram-artisan-crest.png',
    apple: '/images/brand/wastram-artisan-crest.png',
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
        <meta name="theme-color" content="#0B2D7F" />
        <meta name="msapplication-navbutton-color" content="#0B2D7F" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#0B2D7F" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-background text-foreground font-sans antialiased selection:bg-[#0B2D7F] selection:text-white w-full">
        <NavigationProgressBar />
        <ThemeProvider>
          <CartProvider>
            <CurtainIntro />
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
