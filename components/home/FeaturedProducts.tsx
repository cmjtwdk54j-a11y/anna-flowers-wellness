'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Plus, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import type { CatalogProduct } from '@/lib/products';
import { v4 as uuidv4 } from 'uuid';

export default function FeaturedProducts({ locale, products }: { locale: string; products: CatalogProduct[] }) {
  const t = useTranslations('home');
  const tFlowers = useTranslations('flowers');
  const { addItem, openCart } = useCart();

  if (products.length === 0) return null;

  const handleAdd = (product: CatalogProduct) => {
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
    <section className="py-32 px-6 lg:px-10 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-6 mb-6 floral-divider">
            <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-pink)' }} />
            <h2 className="font-serif text-4xl lg:text-5xl font-medium whitespace-nowrap" style={{ color: 'var(--burgundy)' }}>
              {t('featured')}
            </h2>
            <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-pink)' }} />
          </div>
          <p className="text-gray-400 italic font-medium text-sm">
            {locale === 'fi'
              ? 'Huolella valitut kausikokoelmamme, jokainen kukkakimppu täydellisesti järjestetty.'
              : 'Explore our curated seasonal collections, hand-arranged to perfection.'}
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              className="group cursor-pointer"
            >
              {/* Portrait image */}
              <Link href={`/flowers/${product.slug}`}>
                <div
                  className="aspect-[3/4] rounded-[40px] overflow-hidden mb-6 premium-shadow transition-all duration-500 group-hover:-translate-y-3"
                  style={{ backgroundColor: 'var(--soft-pink)' }}
                >
                  <Image
                    src={product.imageUrl}
                    alt={locale === 'fi' ? product.name_fi : product.name_en}
                    width={400}
                    height={533}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </Link>

              {/* Info */}
              <Link href={`/flowers/${product.slug}`}>
                <h3 className="font-serif text-2xl mb-2 transition-colors group-hover:opacity-80" style={{ color: 'var(--burgundy)' }}>
                  {locale === 'fi' ? product.name_fi : product.name_en}
                </h3>
              </Link>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">
                {product.occasions.slice(0, 2).join(' & ')}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold" style={{ color: 'var(--gold)' }}>
                  {product.priceSmall.toFixed(2).replace('.', ',')} €
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAdd(product)}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
                  style={{ borderColor: '#fce7f3', color: 'var(--burgundy)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-pink)';
                    (e.currentTarget as HTMLElement).style.color = 'white';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-pink)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--burgundy)';
                    (e.currentTarget as HTMLElement).style.borderColor = '#fce7f3';
                  }}
                  aria-label={tFlowers('addToCart')}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link
            href="/flowers"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors group"
            style={{ color: 'var(--burgundy)' }}
          >
            {t('allProducts')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
