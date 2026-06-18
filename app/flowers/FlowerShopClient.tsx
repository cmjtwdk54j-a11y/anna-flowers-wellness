'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingCart, AlertCircle, Filter } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

const PRODUCTS = [
  {
    id: '1', slug: 'romanttinen-ruusukukka',
    name_fi: 'Romanttinen ruusukukka', name_en: 'Romantic Rose Bouquet',
    description_fi: 'Kaunis romanttinen ruusukukka punaisista ruusuista. Sopii täydellisesti lahjaksi rakkaalle.',
    description_en: 'Beautiful romantic bouquet of red roses. Perfect as a gift for your loved one.',
    priceSmall: 35, priceLarge: 65, category: 'bouquets', isFuneral: false, isWedding: false,
    imageUrl: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=500&h=500&fit=crop',
  },
  {
    id: '2', slug: 'haiden-valkoinen-kimppu',
    name_fi: 'Häiden valkoinen kimppu', name_en: 'Wedding White Bouquet',
    description_fi: 'Elegantti valkoinen häätarjoilu, jossa on ruusuja, pioneja ja vihreyttä.',
    description_en: 'Elegant white wedding bouquet with roses, peonies and greenery.',
    priceSmall: 85, priceLarge: 150, category: 'wedding', isFuneral: false, isWedding: true,
    imageUrl: 'https://images.unsplash.com/photo-1487530811015-780a59f9e2e0?w=500&h=500&fit=crop',
  },
  {
    id: '3', slug: 'vaaleanpunainen-sekakimppu',
    name_fi: 'Vaaleanpunainen sekakimppu', name_en: 'Pink Mixed Bouquet',
    description_fi: 'Pirteä vaaleanpunainen sekakimppu kausiluonteisista kukista.',
    description_en: 'Cheerful pink mixed bouquet of seasonal flowers.',
    priceSmall: 28, priceLarge: 55, category: 'bouquets', isFuneral: false, isWedding: false,
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88df5691cc66?w=500&h=500&fit=crop',
  },
  {
    id: '4', slug: 'kevainen-tulppaanikimppu',
    name_fi: 'Kevään tulppaanit', name_en: 'Spring Tulip Bouquet',
    description_fi: 'Kirkkaat kevättulppaanit eri väreissä. Iloa jokaiseen kotiin.',
    description_en: 'Bright spring tulips in various colors. Joy for every home.',
    priceSmall: 22, priceLarge: 42, category: 'bouquets', isFuneral: false, isWedding: false,
    imageUrl: 'https://images.unsplash.com/photo-1453293425659-d33fef51fa7c?w=500&h=500&fit=crop',
  },
  {
    id: '5', slug: 'hautajaiskimppu-valkoinen',
    name_fi: 'Hautajaisten valkoinen kimppu', name_en: 'Funeral White Bouquet',
    description_fi: 'Arvokas ja kunnioittava valkoinen kimppu hautajaisiin.',
    description_en: 'Dignified and respectful white bouquet for funerals.',
    priceSmall: 45, priceLarge: 90, category: 'funeral', isFuneral: true, isWedding: false,
    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&h=500&fit=crop',
  },
  {
    id: '6', slug: 'haiden-roosa-kimppu',
    name_fi: 'Häiden roosa kimppu', name_en: 'Wedding Pink Bouquet',
    description_fi: 'Romanttinen vaaleanpunainen häätarjoilu pionien ja ruusujen kanssa.',
    description_en: 'Romantic pink wedding bouquet with peonies and roses.',
    priceSmall: 95, priceLarge: 175, category: 'wedding', isFuneral: false, isWedding: true,
    imageUrl: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=500&h=500&fit=crop',
  },
  {
    id: '7', slug: 'auringonkukkakimppu',
    name_fi: 'Auringonkukkakimppu', name_en: 'Sunflower Bouquet',
    description_fi: 'Iloinen ja kirkas auringonkukkakimppu, joka tuo auringonpaisteen sisätiloihin.',
    description_en: 'Cheerful and bright sunflower bouquet that brings sunshine indoors.',
    priceSmall: 25, priceLarge: 48, category: 'bouquets', isFuneral: false, isWedding: false,
    imageUrl: 'https://images.unsplash.com/photo-1416339134316-0e91dc9ded92?w=500&h=500&fit=crop',
  },
  {
    id: '8', slug: 'muistokimppu-punainen',
    name_fi: 'Muistokimppu punainen', name_en: 'Memorial Red Bouquet',
    description_fi: 'Kaunis ja arvokas punainen muistokimppu hautajaisiin.',
    description_en: 'Beautiful and dignified red memorial bouquet for funerals.',
    priceSmall: 50, priceLarge: 95, category: 'funeral', isFuneral: true, isWedding: false,
    imageUrl: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=500&h=500&fit=crop',
  },
];

export default function FlowerShopClient() {
  const t = useTranslations('flowers');
  const { addItem, openCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFuneralNotice, setShowFuneralNotice] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: t('categories.all') },
    { key: 'bouquets', label: t('categories.bouquets') },
    { key: 'wedding', label: t('categories.wedding') },
    { key: 'funeral', label: t('categories.funeral') },
  ];

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    if (product.isFuneral) {
      setShowFuneralNotice(product.id);
      return;
    }
    addItem({
      id: uuidv4(),
      productId: product.id,
      name_fi: product.name_fi,
      name_en: product.name_en,
      price: product.priceSmall,
      size: 'SMALL',
      quantity: 1,
      imageUrl: product.imageUrl,
      isFuneral: product.isFuneral,
    });
    openCart();
  };

  const confirmFuneralAdd = (product: typeof PRODUCTS[0]) => {
    addItem({
      id: uuidv4(),
      productId: product.id,
      name_fi: product.name_fi,
      name_en: product.name_en,
      price: product.priceSmall,
      size: 'SMALL',
      quantity: 1,
      imageUrl: product.imageUrl,
      isFuneral: true,
    });
    setShowFuneralNotice(null);
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">{t('title')}</h1>
        <p className="text-stone-500">{t('subtitle')}</p>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-stone-400 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeCategory === cat.key
                ? 'bg-rose-500 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-rose-200 hover:text-rose-500'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {filtered.map((product) => (
          <div key={product.id} className="group">
            {/* Funeral notice modal */}
            {showFuneralNotice === product.id && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-stone-800 mb-2">Huomio</h3>
                      <p className="text-sm text-stone-600 leading-relaxed">
                        {t('funeralNotice')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setShowFuneralNotice(null)}
                      className="flex-1 px-4 py-2 border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                      Peruuta
                    </button>
                    <button
                      onClick={() => confirmFuneralAdd(product)}
                      className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      Lisää silti
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-rose-200 hover:shadow-lg transition-all h-full flex flex-col">
              <Link href={`/flowers/${product.slug}`} className="block">
                <div className="aspect-square overflow-hidden bg-stone-50">
                  <Image
                    src={product.imageUrl}
                    alt={product.name_fi}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="p-4 flex flex-col flex-1">
                {product.isFuneral && (
                  <span className="inline-block text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full mb-2 w-fit">
                    Muistokukat
                  </span>
                )}
                {product.isWedding && (
                  <span className="inline-block text-xs bg-rose-50 text-rose-400 px-2 py-0.5 rounded-full mb-2 w-fit">
                    Häät
                  </span>
                )}
                <Link href={`/flowers/${product.slug}`}>
                  <h3 className="text-sm font-medium text-stone-800 leading-tight mb-1 hover:text-rose-500 transition-colors">
                    {product.name_fi}
                  </h3>
                </Link>
                <p className="text-xs text-stone-400 mb-3 flex-1">
                  {t('sizes.small')}: {formatPrice(product.priceSmall)}
                  {product.priceLarge && (
                    <> · {t('sizes.large')}: {formatPrice(product.priceLarge)}</>
                  )}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {t('addToCart')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
