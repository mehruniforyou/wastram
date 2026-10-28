'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NishoramaProduct, NISHORAMA_PRODUCTS } from '@/data/nishorama-data';

export interface CartItem {
  product: NishoramaProduct;
  size: string;
  quantity: number;
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
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
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
    setWishlist(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const isWishlisted = (slug: string) => wishlist.includes(slug);

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
        isWishlisted
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
