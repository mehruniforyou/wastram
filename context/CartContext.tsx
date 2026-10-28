'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NishoramaProduct, NISHORAMA_PRODUCTS } from '@/data/nishorama-data';

export interface CartItem {
  product: NishoramaProduct;
  size: string;
  quantity: number;
}

export interface WishlistToastState {
  show: boolean;
  message: string;
  product?: NishoramaProduct;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: NishoramaProduct, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  cartCount: number;
  cartSubtotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  wishlistToast: WishlistToastState | null;
  clearWishlistToast: () => void;

  // Tap & View Quick Lightbox Modal
  tapAndViewProduct: NishoramaProduct | null;
  openTapAndView: (product: NishoramaProduct) => void;
  closeTapAndView: () => void;

  // Size Guide Modal ("What's my size ?")
  isSizeGuideOpen: boolean;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistToast, setWishlistToast] = useState<WishlistToastState | null>(null);
  const [tapAndViewProduct, setTapAndViewProduct] = useState<NishoramaProduct | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('nishorama_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('nishorama_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('nishorama_cart', JSON.stringify(cart));
      localStorage.setItem('nishorama_wishlist', JSON.stringify(wishlist));
    }
  }, [cart, wishlist, mounted]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: NishoramaProduct, size: string, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, size, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const toggleWishlist = (slug: string) => {
    const product = NISHORAMA_PRODUCTS.find(p => p.slug === slug);
    setWishlist(prev => {
      const alreadyIn = prev.includes(slug);
      if (alreadyIn) {
        setWishlistToast({
          show: true,
          message: 'Removed from Wishlist',
          product
        });
        return prev.filter(s => s !== slug);
      } else {
        setWishlistToast({
          show: true,
          message: 'Saved to Wishlist',
          product
        });
        return [...prev, slug];
      }
    });

    // Auto-hide toast after 3.2 seconds
    setTimeout(() => {
      setWishlistToast(null);
    }, 3200);
  };

  const clearWishlistToast = () => setWishlistToast(null);

  const isWishlisted = (slug: string) => wishlist.includes(slug);

  const openTapAndView = (product: NishoramaProduct) => setTapAndViewProduct(product);
  const closeTapAndView = () => setTapAndViewProduct(null);

  const openSizeGuide = () => setIsSizeGuideOpen(true);
  const closeSizeGuide = () => setIsSizeGuideOpen(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        wishlistToast,
        clearWishlistToast,
        tapAndViewProduct,
        openTapAndView,
        closeTapAndView,
        isSizeGuideOpen,
        openSizeGuide,
        closeSizeGuide
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
