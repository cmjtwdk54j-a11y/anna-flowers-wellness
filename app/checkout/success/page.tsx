'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Flower2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center py-16">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-stone-800 mb-3">
          Tilaus vahvistettu!
        </h1>
        <p className="text-stone-500 mb-8 leading-relaxed">
          Kiitos tilauksestasi! Lähetämme tilausvahvistuksen sähköpostiisi.
          Käsittelemme tilauksesi mahdollisimman pian.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/flowers"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-colors"
          >
            <Flower2 className="w-4 h-4" />
            Jatka ostoksia
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition-colors"
          >
            Etusivulle
          </Link>
        </div>
      </div>
    </div>
  );
}
