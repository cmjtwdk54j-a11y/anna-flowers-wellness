'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { v4 as uuidv4 } from 'uuid';

const FEATURED = [
  {
    id: '1', slug: 'romanttinen-ruusukukka',
    name_fi: 'Romanttinen ruusukukka', name_en: 'Romantic Rose Bouquet',
    priceSmall: 35,
    imageUrl: 'https://images.unsplash.com/photo-1548266652-99cf27701ced?w=400&h=400&fit=crop',
  },
  {
    id: '2', slug: 'haiden-valkoinen-kimppu',
    name_fi: 'Häiden valkoinen kimppu', name_en: 'Wedding White Bouquet',
    priceSmall: 85,
    imageUrl: 'https://images.unsplash.com/photo-1519225421980-716e8e87cef2?w=400&h=400&fit=crop',
  },
  {
    id: '3', slug: 'vaaleanpunainen-sekakimppu',
    name_fi: 'Vaaleanpunainen sekakimppu', name_en: 'Pink Mixed Bouquet',
    priceSmall: 28,
    imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&h=400&fit=crop',
  },
  {
    id: '4', slug: 'kevainen-tulppaanikimppu',
    name_fi: 'Kevään tulppaanit', name_en: 'Spring Tulip Bouquet',
    priceSmall: 22,
    imageUrl: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=400&h=400&fit=crop',
  },
];

export default function FeaturedProducts({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const tFlowers = useTranslations('flowers');
  const { addItem, openCart } = useCart();

  const handleAdd = (product: typeof FEATURED[0]) => {
    addItem({
      id: uuidv4(),
      productId: product.id,
      name_fi: product.name_fi,
      name_en: product.name_en,
      price: product.priceSmall,
      size: 'SMALL',
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    openCart();
  };

  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-stone-800">{t('featured')}</h2>
          <Link
            href="/flowers"
            className="text-sm text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
          >
            {t('allProducts')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {FEATURED.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-rose-200 hover:shadow-lg transition-all flex flex-col"
            >
              <Link href={`/flowers/${product.slug}`} className="block">
                <div className="aspect-square overflow-hidden bg-stone-100">
                  <Image
                    src={product.imageUrl}
                    alt={locale === 'fi' ? product.name_fi : product.name_en}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <Link href={`/flowers/${product.slug}`}>
                  <h3 className="text-sm font-medium text-stone-800 leading-tight mb-1 hover:text-rose-500 transition-colors">
                    {locale === 'fi' ? product.name_fi : product.name_en}
                  </h3>
                </Link>
                <p className="text-xs text-stone-400 mb-3 flex-1">
                  {tFlowers('from')} {product.priceSmall} €
                </p>
                <button
                  onClick={() => handleAdd(product)}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {tFlowers('addToCart')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
