import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import AnnouncementBar from '@/components/AnnouncementBar';
import WishlistToast from '@/components/WishlistToast';
import TapAndViewModal from '@/components/TapAndViewModal';
import BodyMeasurementModal from '@/components/BodyMeasurementModal';

export const metadata: Metadata = {
  title: 'NISHORAMA India | You know where to GET IT',
  description: 'Contemporary fusion of ethnic and modern Indian wear. Kurtis, Co-ord Sets, Dresses, Tops and Bottoms handcrafted for global fashion lovers.',
  keywords: 'Nishorama, Kurtis, Co-ord Sets, Halter Kurtis, Dabu prints, Sanganeri prints, Modern Ethnic Wear, India',
  openGraph: {
    title: 'NISHORAMA India',
    description: 'You know where to GET IT. Discover the latest Diwali Sale and signature ethnic collections.',
    url: 'https://www.nishorama.com',
    siteName: 'NISHORAMA',
    images: [
      {
        url: '/nishorama-images/hero-desktop.png',
        width: 1200,
        height: 630,
        alt: 'Nishorama India',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/nishorama-images/cat-most-wanted.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#F5F5F5] text-[#121212] font-archivo antialiased selection:bg-[#482922] selection:text-white">
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
