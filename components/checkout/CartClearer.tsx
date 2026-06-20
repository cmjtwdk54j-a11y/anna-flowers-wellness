'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

// Tiny client island that clears the cart once on mount (after Stripe redirect).
export default function CartClearer() {
  const { clearCart } = useCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { clearCart(); }, []);
  return null;
}
