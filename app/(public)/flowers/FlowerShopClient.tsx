'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingCart, AlertCircle, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { formatPrice, cn } from '@/lib/utils';
import type { CatalogProduct } from '@/lib/products';
import { v4 as uuidv4 } from 'uuid';

type SortKey = 'popular' | 'priceAsc' | 'priceDesc' | 'newest';

export default function FlowerShopClient({ products }: { products: CatalogProduct[] }) {
  const t = useTranslations('flowers');
  const tCommon = useTranslations('common');
  const { addItem, openCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [occasion, setOccasion] = useState('all');
  const [color, setColor] = useState('all');
  const [maxPrice, setMaxPrice] = useState('all');
  const [sort, setSort] = useState<SortKey>('popular');
  const [showFuneralNotice, setShowFuneralNotice] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: t('categories.all') },
    { key: 'bouquets', label: t('categories.bouquets') },
    { key: 'wedding', label: t('categories.wedding') },
    { key: 'funeral', label: t('categories.funeral') },
  ];

  // Derive available occasions and colours from the actual product set
  const occasionOptions = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.occasions))).sort(),
    [products]
  );
  const colorOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.color).filter((c): c is string => !!c))).sort(),
    [products]
  );

  const filtersActive = activeCategory !== 'all' || occasion !== 'all' || color !== 'all' || maxPrice !== 'all';

  const resetFilters = () => {
    setActiveCategory('all');
    setOccasion('all');
    setColor('all');
    setMaxPrice('all');
  };

  const filtered = useMemo(() => {
    const max = maxPrice === 'all' ? Infinity : Number(maxPrice);
    const result = products.filter((p) => {
      if (activeCategory !== 'all' && p.categorySlug !== activeCategory) return false;
      if (occasion !== 'all' && !p.occasions.includes(occasion)) return false;
      if (color !== 'all' && p.color !== color) return false;
      if (p.priceSmall > max) return false;
      return true;
    });
    const sorted = [...result];
    switch (sort) {
      case 'priceAsc':
        sorted.sort((a, b) => a.priceSmall - b.priceSmall);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.priceSmall - a.priceSmall);
        break;
      case 'newest':
        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      default:
        sorted.sort((a, b) => b.popularity - a.popularity);
    }
    return sorted;
  }, [products, activeCategory, occasion, color, maxPrice, sort]);

  const handleAddToCart = (product: CatalogProduct) => {
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

  const confirmFuneralAdd = (product: CatalogProduct) => {
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-stone-800 mb-2">{t('title')}</h1>
        <p className="text-stone-500">{t('subtitle')}</p>
      </motion.div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
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

      {/* Filters & sorting */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          aria-label={t('filters.occasion')}
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-rose-400"
        >
          <option value="all">{t('filters.allOccasions')}</option>
          {occasionOptions.map((o) => (
            <option key={o} value={o}>{t(`occasions.${o}` as any)}</option>
          ))}
        </select>

        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          aria-label={t('filters.color')}
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-rose-400"
        >
          <option value="all">{t('filters.allColors')}</option>
          {colorOptions.map((c) => (
            <option key={c} value={c}>{t(`colors.${c}` as any)}</option>
          ))}
        </select>

        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          aria-label={t('filters.maxPrice')}
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-rose-400"
        >
          <option value="all">{t('filters.anyPrice')}</option>
          <option value="30">≤ 30 €</option>
          <option value="50">≤ 50 €</option>
          <option value="100">≤ 100 €</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label={t('filters.sort')}
          className="border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white focus:outline-none focus:border-rose-400 ml-auto"
        >
          <option value="popular">{t('sort.popular')}</option>
          <option value="priceAsc">{t('sort.priceAsc')}</option>
          <option value="priceDesc">{t('sort.priceDesc')}</option>
          <option value="newest">{t('sort.newest')}</option>
        </select>
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-stone-400">{t('filters.results', { count: filtered.length })}</p>
        {filtersActive && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600"
          >
            <X className="w-3.5 h-3.5" />
            {t('filters.clear')}
          </button>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-stone-500 mb-4">{t('filters.noResults')}</p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-500 hover:text-rose-600"
          >
            <X className="w-4 h-4" />
            {t('filters.clear')}
          </button>
        </div>
      )}

      {/* Products grid */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        <AnimatePresence mode="popLayout">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            className="group"
          >
            {/* Funeral notice modal */}
            {showFuneralNotice === product.id && (
              <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-stone-800 mb-2">{t('notice')}</h3>
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
                      {tCommon('cancel')}
                    </button>
                    <button
                      onClick={() => confirmFuneralAdd(product)}
                      className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      {t('addAnyway')}
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
                    {t('categories.funeral')}
                  </span>
                )}
                {product.isWedding && (
                  <span className="inline-block text-xs bg-rose-50 text-rose-400 px-2 py-0.5 rounded-full mb-2 w-fit">
                    {t('categories.wedding')}
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
          </motion.div>
        ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
