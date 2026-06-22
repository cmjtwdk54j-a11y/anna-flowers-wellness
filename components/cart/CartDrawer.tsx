'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer({ locale }: { locale: string }) {
  const t = useTranslations('cart');
  const tCommon = useTranslations('common');
  const { state, removeItem, updateQuantity, closeCart, subtotal } = useCart();

  if (!state.isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent-pink" />
            {t('title')}
          </h2>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label={tCommon('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <ShoppingBag className="w-12 h-12 text-stone-200 mb-3" />
              <p className="text-stone-400 text-sm">{t('empty')}</p>
              <Link
                href="/flowers"
                onClick={closeCart}
                className="mt-4 text-sm text-burgundy hover:text-burgundy font-medium"
              >
                {t('continue')} →
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {state.items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={locale === 'fi' ? item.name_fi : item.name_en}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">
                      {locale === 'fi' ? item.name_fi : item.name_en}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {item.size === 'SMALL' ? t('sizeSmall') : t('sizeLarge')} · {formatPrice(item.price)}
                    </p>
                    {item.scheduledDate && (
                      <p className="text-xs text-accent-pink mt-0.5">
                        {item.scheduledDate} {item.scheduledTime}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:border-accent-pink hover:text-burgundy transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium text-stone-700 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:border-accent-pink hover:text-burgundy transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-stone-300 hover:text-red-400 transition-colors"
                      aria-label={t('remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-sm font-semibold text-stone-800">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-stone-100 px-5 py-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500">{t('subtotal')}</span>
              <span className="text-sm font-semibold text-stone-800">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-stone-400">{t('deliveryNote')}</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-burgundy hover:bg-burgundy/90 text-white text-sm font-medium text-center py-3 rounded-full transition-colors"
            >
              {t('checkout')}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
