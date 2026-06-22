'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer({ locale }: { locale: string }) {
  const t = useTranslations('cart');
  const tCommon = useTranslations('common');
  const { state, removeItem, updateQuantity, closeCart, subtotal } = useCart();

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-pink-50">
              <h2 className="font-serif text-2xl font-medium flex items-center gap-3" style={{ color: 'var(--burgundy)' }}>
                <ShoppingBag className="w-5 h-5" style={{ color: 'var(--accent-pink)' }} />
                {t('title')}
              </h2>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-pink-50 transition-colors"
                aria-label={tCommon('close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--soft-pink)' }}>
                    <ShoppingBag className="w-8 h-8" style={{ color: 'var(--accent-pink)' }} />
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{t('empty')}</p>
                  <Link
                    href="/flowers"
                    onClick={closeCart}
                    className="text-sm font-bold uppercase tracking-widest transition-colors"
                    style={{ color: 'var(--burgundy)' }}
                  >
                    {t('continue')} →
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  <AnimatePresence>
                    {state.items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-24 rounded-[16px] overflow-hidden flex-shrink-0" style={{ backgroundColor: 'var(--soft-pink)' }}>
                          <Image
                            src={item.imageUrl}
                            alt={locale === 'fi' ? item.name_fi : item.name_en}
                            width={80}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate mb-0.5" style={{ color: 'var(--burgundy)' }}>
                            {locale === 'fi' ? item.name_fi : item.name_en}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                            {item.size === 'SMALL' ? t('sizeSmall') : t('sizeLarge')} · {formatPrice(item.price)}
                          </p>
                          {item.scheduledDate && (
                            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--accent-pink)' }}>
                              {item.scheduledDate} {item.scheduledTime}
                            </p>
                          )}
                          {/* Qty controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full border flex items-center justify-center transition-colors"
                              style={{ borderColor: '#fce7f3', color: 'var(--burgundy)' }}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-5 text-center" style={{ color: 'var(--burgundy)' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full border flex items-center justify-center transition-colors"
                              style={{ borderColor: '#fce7f3', color: 'var(--burgundy)' }}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Right: price + delete */}
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                            aria-label={t('remove')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <p className="text-sm font-bold" style={{ color: 'var(--burgundy)' }}>
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t border-pink-50 px-6 py-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{t('subtotal')}</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--burgundy)' }}>{formatPrice(subtotal)}</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-gray-300">{t('deliveryNote')}</p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full text-white text-sm font-bold text-center py-4 rounded-full transition-all hover:shadow-xl hover:shadow-pink-200 hover:-translate-y-0.5 uppercase tracking-widest"
                  style={{ backgroundColor: 'var(--burgundy)' }}
                >
                  {t('checkout')}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
