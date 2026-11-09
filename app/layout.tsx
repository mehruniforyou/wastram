import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import AnnouncementBar from '@/components/AnnouncementBar';
import WishlistToast from '@/components/WishlistToast';
import TapAndViewModal from '@/components/TapAndViewModal';
import BodyMeasurementModal from '@/components/BodyMeasurementModal';
import MobileNavDrawer from '@/components/MobileNavDrawer';
import StoryViewerModal from '@/components/StoryViewerModal';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F6' },
    { media: '(prefers-color-scheme: dark)', color: '#FAF9F6' },
  ],
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Wastram | Authentic Indian Textiles & Contemporary Luxury',
  description: 'Wastram is a premier Indian textile and fashion brand combining traditional Indian craftsmanship with modern luxury aesthetics. Explore handcrafted ethnic wear sets, kalidar umbrella dresses, artisanal kaftans, and contemporary resort collections.',
  keywords: 'Wastram, Indian Haute Textiles, Luxury Apparel Atelier, Ethnic Wear Sets, Umbrella Dresses, Kaftans, Co-ord Sets, Western Dresses, Handcrafted Indian Apparel, Boutique Sourcing',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Wastram | Authentic Indian Textiles & Contemporary Luxury',
    description: 'Combining traditional Indian craftsmanship with modern luxury aesthetics. Explore 1,400+ handcrafted styles.',
    url: 'https://wastram.vercel.app',
    siteName: 'Wastram',
    images: [
      {
        url: '/images/brand/wastram-gold-thread-logo.png',
        width: 1200,
        height: 400,
        alt: 'Wastram Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/images/brand/wastram-craft-emblem.png',
    apple: '/images/brand/wastram-craft-emblem.png',
  },
  other: {
    'color-scheme': 'light only',
    'supported-color-schemes': 'light',
    'msapplication-TileColor': '#FAF9F6',
    'msapplication-navbutton-color': '#FAF9F6',
    'apple-mobile-web-app-status-bar-style': '#FAF9F6',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#FAF9F6]" style={{ colorScheme: 'light' }}>
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="theme-color" content="#FAF9F6" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FAF9F6" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#FAF9F6" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#FAF9F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="msapplication-navbutton-color" content="#FAF9F6" />
        <meta name="msapplication-TileColor" content="#FAF9F6" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#FAF9F6] text-[#1A1A1A] font-sans antialiased selection:bg-[#0B2D7F] selection:text-white w-full" style={{ colorScheme: 'light' }}>
        <CartProvider>
          <AnnouncementBar />
          {children}
          <CartDrawer />
          <MobileNavDrawer />
          <StoryViewerModal />
          <TapAndViewModal />
          <BodyMeasurementModal />
          <WishlistToast />
        </CartProvider>
      </body>
    </html>
  );
}
