'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingCart, ChevronLeft, Minus, Plus, AlertCircle, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import type { CatalogProduct } from '@/lib/products';
import { v4 as uuidv4 } from 'uuid';

export default function ProductPageClient({ product }: { product: CatalogProduct }) {
  const t = useTranslations('product');
  const tFlowers = useTranslations('flowers');
  const { addItem, openCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<'SMALL' | 'LARGE'>('SMALL');
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [mainImage, setMainImage] = useState(product.imageUrl);
  const [showFuneralNotice, setShowFuneralNotice] = useState(false);
  const [added, setAdded] = useState(false);
  const [preOrderError, setPreOrderError] = useState('');

  const price = selectedSize === 'SMALL' ? product.priceSmall : (product.priceLarge || product.priceSmall);

  const handleAddToCart = () => {
    if (isPreOrder && (!selectedDate || !selectedTime)) {
      setPreOrderError(t('preOrderError'));
      return;
    }
    setPreOrderError('');
    if (product.isFuneral && !showFuneralNotice) {
      setShowFuneralNotice(true);
      return;
    }
    addItem({
      id: uuidv4(),
      productId: product.id,
      name_fi: product.name_fi,
      name_en: product.name_en,
      price,
      size: selectedSize,
      quantity,
      imageUrl: product.imageUrl,
      isFuneral: product.isFuneral,
      scheduledDate: isPreOrder ? selectedDate : undefined,
      scheduledTime: isPreOrder ? selectedTime : undefined,
    });
    setShowFuneralNotice(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart();
  };

  const today = new Date().toISOString().split('T')[0];
  const availableTimes = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-36 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 mb-16">
        <Link href="/" className="transition-colors hover:text-gray-600">{t('home')}</Link>
        <span>/</span>
        <Link href="/flowers" className="transition-colors hover:text-gray-600">{tFlowers('title')}</Link>
        <span>/</span>
        <span style={{ color: 'var(--burgundy)' }}>{product.name_fi}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-20 items-start">
        {/* ── Left: image ── */}
        <div className="lg:sticky lg:top-32">
          <div
            className="aspect-[3/4] rounded-[40px] overflow-hidden premium-shadow"
            style={{ backgroundColor: 'var(--soft-pink)' }}
          >
            <Image
              src={mainImage}
              alt={product.name_fi}
              width={600}
              height={800}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
          {product.imageUrls.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.imageUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(url)}
                  className="w-20 h-24 rounded-[16px] overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: mainImage === url ? 'var(--accent-pink)' : 'transparent',
                    backgroundColor: 'var(--soft-pink)',
                  }}
                >
                  <Image src={url} alt="" width={80} height={96} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: details ── */}
        <div>
          {/* Badges */}
          <div className="flex items-center gap-2 mb-5">
            {product.isWedding && (
              <span
                className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{ backgroundColor: 'var(--soft-pink)', color: 'var(--burgundy)' }}
              >
                {t('weddingBadge')}
              </span>
            )}
            {product.isFuneral && (
              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-gray-100 text-gray-500">
                {t('funeralBadge')}
              </span>
            )}
          </div>

          {/* Funeral notice */}
          {product.isFuneral && (
            <div
              className="flex items-start gap-3 p-4 rounded-[20px] mb-6 border"
              style={{ backgroundColor: 'var(--soft-pink)', borderColor: 'var(--accent-pink)' }}
            >
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm" style={{ color: 'var(--burgundy)' }}>{tFlowers('funeralNotice')}</p>
            </div>
          )}

          {/* Title */}
          <h1
            className="font-serif leading-tight mb-3"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--burgundy)' }}
          >
            {product.name_fi}
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description_fi}</p>

          {/* Price */}
          <div className="text-3xl font-bold mb-8" style={{ color: 'var(--gold)' }}>
            {formatPrice(price * quantity)}
          </div>

          {/* Specs */}
          {(product.flowerCount !== null || product.heightCm !== null || product.color) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.flowerCount !== null && (
                <span className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--soft-pink)', color: 'var(--burgundy)' }}>
                  {t('specsFlowers')}: {product.flowerCount}
                </span>
              )}
              {product.heightCm !== null && (
                <span className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--soft-pink)', color: 'var(--burgundy)' }}>
                  {t('specsHeight')}: {product.heightCm} cm
                </span>
              )}
              {product.color && (
                <span className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--soft-pink)', color: 'var(--burgundy)' }}>
                  {t('specsColor')}: {tFlowers(`colors.${product.color}` as any)}
                </span>
              )}
            </div>
          )}

          {/* Composition */}
          {product.composition_fi && (
            <div className="mb-6 p-5 rounded-[24px]" style={{ backgroundColor: 'var(--soft-pink)' }}>
              <h2 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--burgundy)' }}>
                {t('composition')}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">{product.composition_fi}</p>
            </div>
          )}

          {/* Occasions */}
          {product.occasions.length > 0 && (
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">{t('specsOccasion')}</p>
              <div className="flex flex-wrap gap-2">
                {product.occasions.map((o) => (
                  <span
                    key={o}
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
                    style={{ borderColor: '#fce7f3', color: 'var(--burgundy)' }}
                  >
                    {tFlowers(`occasions.${o}` as any)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">{t('selectSize')}</p>
            <div className="flex gap-3">
              {(['SMALL', 'LARGE'] as const).map((size) => {
                const sizePrice = size === 'SMALL' ? product.priceSmall : product.priceLarge;
                if (!sizePrice) return null;
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="flex-1 py-4 rounded-[20px] border-2 text-sm font-bold transition-all"
                    style={{
                      borderColor: active ? 'var(--accent-pink)' : '#fce7f3',
                      backgroundColor: active ? 'var(--soft-pink)' : 'transparent',
                      color: 'var(--burgundy)',
                    }}
                  >
                    {tFlowers(`sizes.${size === 'SMALL' ? 'small' : 'large'}` as any)}
                    <div className="text-xs font-normal mt-0.5 opacity-60">{formatPrice(sizePrice)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">{t('quantity')}</p>
            <div className="inline-flex items-center gap-4 border border-pink-100 rounded-full px-5 py-2.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ color: 'var(--burgundy)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--soft-pink)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold w-6 text-center" style={{ color: 'var(--burgundy)' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ color: 'var(--burgundy)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--soft-pink)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pre-order */}
          <div className="mb-8">
            <label className="flex items-center gap-2.5 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={isPreOrder}
                onChange={(e) => setIsPreOrder(e.target.checked)}
                className="rounded border-pink-200"
                style={{ accentColor: 'var(--burgundy)' }}
              />
              <span className="text-sm font-medium text-gray-600">{t('preOrder')}</span>
            </label>
            {isPreOrder && (
              <div className="grid grid-cols-2 gap-3 pl-6">
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {t('selectDate')}
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-pink-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#ffb6d9] transition-colors"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    {t('selectTime')}
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border border-pink-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#ffb6d9] transition-colors"
                  >
                    <option value="">{t('selectTimeFirst')}</option>
                    {availableTimes.map((time) => <option key={time} value={time}>{time}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          {preOrderError && <p className="text-xs text-red-500 mb-4">{preOrderError}</p>}

          {/* Add to cart button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            className="w-full py-5 rounded-full font-bold text-sm uppercase tracking-widest text-white transition-colors flex items-center justify-center gap-3 mb-6"
            style={{ backgroundColor: added ? '#5a9e6f' : 'var(--burgundy)' }}
          >
            <ShoppingCart className="w-5 h-5" />
            {added ? t('added') : t('addToCart')}
          </motion.button>

          {/* Care info */}
          {product.careInfo_fi && (
            <div className="p-5 rounded-[24px] border border-pink-100 mb-4">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('care')}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{product.careInfo_fi}</p>
            </div>
          )}

          {/* Funeral confirmation */}
          {showFuneralNotice && (
            <div
              className="p-5 rounded-[24px] border"
              style={{ backgroundColor: 'var(--soft-pink)', borderColor: 'var(--accent-pink)' }}
            >
              <p className="text-sm mb-4" style={{ color: 'var(--burgundy)' }}>{tFlowers('funeralNotice')}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFuneralNotice(false)}
                  className="flex-1 px-4 py-3 border border-pink-100 rounded-full text-xs font-bold text-gray-500 hover:bg-white transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-4 py-3 rounded-full text-xs font-bold text-white transition-colors"
                  style={{ backgroundColor: 'var(--burgundy)' }}
                >
                  {t('confirm')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
