import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import AnnouncementBar from '@/components/AnnouncementBar';
import WishlistToast from '@/components/WishlistToast';
import TapAndViewModal from '@/components/TapAndViewModal';
import BodyMeasurementModal from '@/components/BodyMeasurementModal';

export const viewport: Viewport = {
  themeColor: '#FAF9F6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Wastram | Authentic Indian Textiles & Contemporary Luxury',
  description: 'Wastram is a premier Indian textile and fashion brand combining traditional Indian craftsmanship with modern luxury aesthetics. Explore handcrafted ethnic wear sets, kalidar umbrella dresses, artisanal kaftans, and contemporary resort collections.',
  keywords: 'Wastram, Indian Textiles, Wholesale Fashion, Ethnic Wear Sets, Umbrella Dresses, Kaftans, Co-ord Sets, Western Dresses, Handcrafted Indian Apparel, B2B Apparel Export',
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
    'msapplication-TileColor': '#FAF9F6',
    'msapplication-navbutton-color': '#FAF9F6',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#FAF9F6]">
      <head>
        <meta name="theme-color" content="#FAF9F6" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#FAF9F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="msapplication-navbutton-color" content="#FAF9F6" />
        <meta name="msapplication-TileColor" content="#FAF9F6" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#FAF9F6] text-[#1A1A1A] font-sans antialiased selection:bg-[#0B2D7F] selection:text-white w-full max-w-full overflow-x-hidden">
        <CartProvider>
          <AnnouncementBar />
          {children}
          <CartDrawer />
          <TapAndViewModal />
          <BodyMeasurementModal />
          <WishlistToast />
        </CartProvider>
      </body>
    </html>
  );
}
