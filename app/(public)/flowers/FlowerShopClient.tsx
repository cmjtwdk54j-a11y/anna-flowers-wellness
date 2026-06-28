'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, AlertCircle, X, Menu, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import type { CatalogProduct } from '@/lib/products';
import { v4 as uuidv4 } from 'uuid';

type SortKey = 'popular' | 'priceAsc' | 'priceDesc' | 'newest';

interface ShopSubcategory { id: string; name_fi: string; name_en: string; }
interface ShopCategory { id: string; slug: string; name_fi: string; name_en: string; icon?: string | null; productCount: number; subcategories: ShopSubcategory[]; }

export default function FlowerShopClient({ products }: { products: CatalogProduct[] }) {
  const t = useTranslations('flowers');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isFi = locale === 'fi';
  const { addItem, openCart } = useCart();

  const [activeCategory, setActiveCategory] = useState('all');
  const [occasion, setOccasion] = useState('all');
  const [color, setColor] = useState('all');
  const [maxPrice, setMaxPrice] = useState('all');
  const [sort, setSort] = useState<SortKey>('popular');
  const [showFuneralNotice, setShowFuneralNotice] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [shopCategories, setShopCategories] = useState<ShopCategory[]>([]);

  useEffect(() => {
    fetch('/api/shop/categories')
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setShopCategories(data))
      .catch(() => {});
  }, []);

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
      case 'priceAsc': sorted.sort((a, b) => a.priceSmall - b.priceSmall); break;
      case 'priceDesc': sorted.sort((a, b) => b.priceSmall - a.priceSmall); break;
      case 'newest': sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      default: sorted.sort((a, b) => b.popularity - a.popularity);
    }
    return sorted;
  }, [products, activeCategory, occasion, color, maxPrice, sort]);

  const handleAddToCart = (product: CatalogProduct) => {
    if (product.isFuneral) { setShowFuneralNotice(product.id); return; }
    addItem({ id: uuidv4(), productId: product.id, name_fi: product.name_fi, name_en: product.name_en, price: product.priceSmall, size: 'SMALL', quantity: 1, imageUrl: product.imageUrl, isFuneral: product.isFuneral });
    openCart();
  };

  const confirmFuneralAdd = (product: CatalogProduct) => {
    addItem({ id: uuidv4(), productId: product.id, name_fi: product.name_fi, name_en: product.name_en, price: product.priceSmall, size: 'SMALL', quantity: 1, imageUrl: product.imageUrl, isFuneral: true });
    setShowFuneralNotice(null);
    openCart();
  };

  const selectClass = 'border border-blue-100 rounded-full px-3 sm:px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-white outline-none focus:border-blue-300 transition-colors text-gray-600';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 pb-12 lg:pt-36 lg:pb-24">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 lg:mb-12"
      >
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium mb-3" style={{ color: 'var(--burgundy)' }}>
          {t('title')}
        </h1>
        <p className="text-gray-400 text-sm italic">{t('subtitle')}</p>
      </motion.div>

      {/* Toolbar: hamburger + filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 justify-center">
        {/* Hamburger button */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border',
            sidebarOpen
              ? 'text-white border-transparent shadow-sm'
              : 'bg-white border-blue-100 text-gray-600 hover:border-blue-300'
          )}
          style={sidebarOpen ? { backgroundColor: 'var(--burgundy)' } : undefined}
          aria-label="Toggle categories"
        >
          <Menu className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('filters.categories')}</span>
        </button>

        <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className={selectClass}>
          <option value="all">{t('filters.allOccasions')}</option>
          {occasionOptions.map((o) => <option key={o} value={o}>{t(`occasions.${o}` as any)}</option>)}
        </select>

        <select value={color} onChange={(e) => setColor(e.target.value)} className={selectClass}>
          <option value="all">{t('filters.allColors')}</option>
          {colorOptions.map((c) => <option key={c} value={c}>{t(`colors.${c}` as any)}</option>)}
        </select>

        <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={selectClass}>
          <option value="all">{t('filters.anyPrice')}</option>
          <option value="30">≤ 30 €</option>
          <option value="50">≤ 50 €</option>
          <option value="100">≤ 100 €</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectClass}>
          <option value="popular">{t('sort.popular')}</option>
          <option value="priceAsc">{t('sort.priceAsc')}</option>
          <option value="priceDesc">{t('sort.priceDesc')}</option>
          <option value="newest">{t('sort.newest')}</option>
        </select>

        {filtersActive && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors px-4 py-2 rounded-full border"
            style={{ color: 'var(--burgundy)', borderColor: 'var(--accent-pink)' }}
          >
            <X className="w-3 h-3" />
            {t('filters.clear')}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-8">
        {t('filters.results', { count: filtered.length })}
      </p>

      {/* Main content: sidebar + grid */}
      <div className="flex gap-6 items-start">

        {/* Mobile overlay backdrop */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 sm:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar — mobile: fixed drawer, desktop: inline panel */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 left-0 h-full z-50 sm:static sm:h-auto sm:z-auto flex-shrink-0 overflow-hidden sm:w-64"
              style={{ width: '280px' }}
            >
              <div
                className="h-full sm:h-auto bg-white sm:rounded-[22px] p-5 sm:sticky sm:top-28 overflow-y-auto"
                style={{ boxShadow: '0 4px 24px rgba(15,58,125,0.08)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                    {t('filters.categories')}
                  </p>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="sm:hidden p-1.5 rounded-full bg-gray-100 text-gray-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* All */}
                <button
                  onClick={() => { setActiveCategory('all'); if (window.innerWidth < 640) setSidebarOpen(false); }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-1',
                    activeCategory === 'all'
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-blue-50'
                  )}
                  style={activeCategory === 'all' ? { backgroundColor: 'var(--burgundy)' } : undefined}
                >
                  <span>{t('categories.all')}</span>
                  <span className="text-xs opacity-60">{products.length}</span>
                </button>

                {/* Dynamic categories */}
                <div className="space-y-0.5 max-h-[60vh] overflow-y-auto pr-1">
                  {shopCategories.map((cat) => (
                    <div key={cat.id}>
                      <button
                        onClick={() => {
                          setActiveCategory(cat.slug);
                          setExpandedCategory(expandedCategory === cat.id ? null : cat.id);
                          if (window.innerWidth < 640) setSidebarOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                          activeCategory === cat.slug
                            ? 'text-white'
                            : 'text-gray-600 hover:bg-blue-50'
                        )}
                        style={activeCategory === cat.slug ? { backgroundColor: 'var(--burgundy)' } : undefined}
                      >
                        <span className="flex items-center gap-2">
                          {cat.icon && <span>{cat.icon}</span>}
                          {isFi ? cat.name_fi : cat.name_en}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs opacity-60">{cat.productCount}</span>
                          {cat.subcategories.length > 0 && (
                            <ChevronRight
                              className={cn('w-3.5 h-3.5 transition-transform duration-200', expandedCategory === cat.id && 'rotate-90')}
                            />
                          )}
                        </div>
                      </button>

                      {/* Subcategories */}
                      <AnimatePresence initial={false}>
                        {expandedCategory === cat.id && cat.subcategories.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-1 space-y-0.5">
                              {cat.subcategories.map((sub) => (
                                <button
                                  key={sub.id}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-800 hover:bg-blue-50 transition-colors font-medium"
                                >
                                  {isFi ? sub.name_fi : sub.name_en}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="font-serif text-2xl mb-4" style={{ color: 'var(--burgundy)' }}>{t('filters.noResults')}</p>
              <button onClick={resetFilters} className="text-xs font-bold uppercase tracking-widest transition-colors" style={{ color: 'var(--accent-pink)' }}>
                {t('filters.clear')}
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
            <AnimatePresence>
              {filtered.map((product) => (
                <motion.div key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="group">

                  {showFuneralNotice === product.id && (
                    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                      <div className="bg-white rounded-[40px] p-8 max-w-sm w-full shadow-2xl">
                        <div className="flex items-start gap-3 mb-6">
                          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-serif text-xl mb-2" style={{ color: 'var(--burgundy)' }}>{t('notice')}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{t('funeralNotice')}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setShowFuneralNotice(null)} className="flex-1 px-4 py-3 border border-blue-100 rounded-full text-sm text-gray-500 hover:bg-gray-50 transition-colors">{tCommon('cancel')}</button>
                          <button onClick={() => confirmFuneralAdd(product)} className="flex-1 px-4 py-3 rounded-full text-sm font-bold text-white transition-all" style={{ backgroundColor: 'var(--burgundy)' }}>{t('addAnyway')}</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Link href={`/flowers/${product.slug}`}>
                      <div className="aspect-[3/4] rounded-[20px] sm:rounded-[36px] overflow-hidden mb-3 sm:mb-5 premium-shadow transition-transform duration-300 lg:group-hover:-translate-y-2" style={{ backgroundColor: 'var(--soft-pink)' }}>
                        <Image src={product.imageUrl} alt={product.name_fi} width={400} height={533} className="w-full h-full object-cover lg:group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) calc(50vw - 20px), (max-width: 1024px) calc(33vw - 24px), calc(25vw - 40px)" />
                      </div>
                    </Link>

                    <Link href={`/flowers/${product.slug}`}>
                      <h3 className="font-serif text-sm sm:text-lg lg:text-xl mb-1 group-hover:opacity-70 transition-opacity leading-tight" style={{ color: 'var(--burgundy)' }}>
                        {isFi ? product.name_fi : product.name_en}
                      </h3>
                    </Link>

                    {(product.isFuneral || product.isWedding) && (
                      <span className="inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2" style={{ backgroundColor: product.isFuneral ? 'var(--light-gray)' : 'var(--soft-pink)', color: 'var(--warm-gray)' }}>
                        {product.isFuneral ? t('categories.funeral') : t('categories.wedding')}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-base" style={{ color: 'var(--gold)' }}>
                        {product.priceSmall.toFixed(2).replace('.', ',')} €
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddToCart(product)}
                        className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
                        style={{ borderColor: '#bae6fd', color: 'var(--burgundy)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-pink)'; (e.currentTarget as HTMLElement).style.color = 'white'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-pink)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--burgundy)'; (e.currentTarget as HTMLElement).style.borderColor = '#bae6fd'; }}
                        aria-label={t('addToCart')}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
