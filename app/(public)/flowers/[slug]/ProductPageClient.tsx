'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingCart, ChevronLeft, Minus, Plus, AlertCircle, Calendar, Clock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, cn } from '@/lib/utils';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-6">
        <Link href="/" className="hover:text-stone-600">{t('home')}</Link>
        <span>/</span>
        <Link href="/flowers" className="hover:text-stone-600">{tFlowers('title')}</Link>
        <span>/</span>
        <span className="text-stone-600">{product.name_fi}</span>
      </nav>

      <Link
        href="/flowers"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-burgundy mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        {t('back')}
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-3">
            <Image
              src={mainImage}
              alt={product.name_fi}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          {product.imageUrls.length > 1 && (
            <div className="flex gap-2">
              {product.imageUrls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(url)}
                  className={cn(
                    'w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                    mainImage === url ? 'border-rose-400' : 'border-transparent'
                  )}
                >
                  <Image src={url} alt="" width={64} height={64} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.isFuneral && (
            <div className="flex items-start gap-2.5 p-4 bg-soft-pink border border-accent-pink/50 rounded-xl mb-4">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-burgundy">{tFlowers('funeralNotice')}</p>
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            {product.isWedding && (
              <span className="text-xs bg-soft-pink text-accent-pink px-2 py-0.5 rounded-full">{t('weddingBadge')}</span>
            )}
            {product.isFuneral && (
              <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{t('funeralBadge')}</span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-stone-800 mb-3">{product.name_fi}</h1>
          <p className="text-stone-500 text-sm leading-relaxed mb-5">{product.description_fi}</p>

          {/* Specs */}
          {(product.flowerCount !== null || product.heightCm !== null || product.color) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {product.flowerCount !== null && (
                <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-lg">
                  {t('specsFlowers')}: {product.flowerCount}
                </span>
              )}
              {product.heightCm !== null && (
                <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-lg">
                  {t('specsHeight')}: {product.heightCm} cm
                </span>
              )}
              {product.color && (
                <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-lg">
                  {t('specsColor')}: {tFlowers(`colors.${product.color}` as any)}
                </span>
              )}
            </div>
          )}

          {/* Composition */}
          {product.composition_fi && (
            <div className="mb-5 p-4 bg-stone-50 rounded-xl">
              <h2 className="text-sm font-semibold text-stone-700 mb-1">{t('composition')}</h2>
              <p className="text-sm text-stone-500 leading-relaxed">{product.composition_fi}</p>
            </div>
          )}

          {/* Occasions */}
          {product.occasions.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-stone-400 mb-1.5">{t('specsOccasion')}</p>
              <div className="flex flex-wrap gap-1.5">
                {product.occasions.map((o) => (
                  <span key={o} className="text-xs bg-soft-pink text-burgundy px-2 py-0.5 rounded-full">
                    {tFlowers(`occasions.${o}` as any)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mb-5">
            <p className="text-sm font-medium text-stone-700 mb-2">{t('selectSize')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedSize('SMALL')}
                className={cn(
                  'flex-1 py-3 rounded-xl border text-sm font-medium transition-colors',
                  selectedSize === 'SMALL'
                    ? 'border-rose-400 bg-soft-pink text-burgundy'
                    : 'border-stone-200 text-stone-600 hover:border-rose-200'
                )}
              >
                {tFlowers('sizes.small')}
                <div className="text-xs font-normal mt-0.5">{formatPrice(product.priceSmall)}</div>
              </button>
              {product.priceLarge && (
                <button
                  onClick={() => setSelectedSize('LARGE')}
                  className={cn(
                    'flex-1 py-3 rounded-xl border text-sm font-medium transition-colors',
                    selectedSize === 'LARGE'
                      ? 'border-rose-400 bg-soft-pink text-burgundy'
                      : 'border-stone-200 text-stone-600 hover:border-rose-200'
                  )}
                >
                  {tFlowers('sizes.large')}
                  <div className="text-xs font-normal mt-0.5">{formatPrice(product.priceLarge)}</div>
                </button>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-5">
            <p className="text-sm font-medium text-stone-700 mb-2">{t('quantity')}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:border-accent-pink hover:text-burgundy transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-medium text-stone-800 w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:border-accent-pink hover:text-burgundy transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pre-order */}
          <div className="mb-6">
            <label className="flex items-center gap-2.5 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={isPreOrder}
                onChange={(e) => setIsPreOrder(e.target.checked)}
                className="rounded border-stone-300 text-burgundy focus:ring-accent-pink"
              />
              <span className="text-sm font-medium text-stone-700">{t('preOrder')}</span>
            </label>
            {isPreOrder && (
              <div className="grid grid-cols-2 gap-3 pl-6">
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {t('selectDate')}
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-pink"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {t('selectTime')}
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-pink"
                  >
                    <option value="">{t('selectTimeFirst')}</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Pre-order error */}
          {preOrderError && (
            <p className="text-xs text-red-500 mb-3">{preOrderError}</p>
          )}

          {/* Price & Add to cart */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-stone-400">{t('total')}</p>
              <p className="text-2xl font-bold text-stone-800">{formatPrice(price * quantity)}</p>
            </div>
            <button
              onClick={handleAddToCart}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all',
                added
                  ? 'bg-emerald-500 text-white'
                  : 'bg-burgundy hover:bg-burgundy/90 text-white hover:shadow-lg hover:shadow-rose-200'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {added ? t('added') : t('addToCart')}
            </button>
          </div>

          {/* Care instructions */}
          {product.careInfo_fi && (
            <div className="mb-4 p-4 border border-stone-100 rounded-xl">
              <h2 className="text-sm font-semibold text-stone-700 mb-1">{t('care')}</h2>
              <p className="text-sm text-stone-500 leading-relaxed">{product.careInfo_fi}</p>
            </div>
          )}

          {/* Funeral confirmation */}
          {showFuneralNotice && (
            <div className="p-4 bg-soft-pink border border-accent-pink/50 rounded-xl">
              <p className="text-sm text-burgundy mb-3">{tFlowers('funeralNotice')}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFuneralNotice(false)}
                  className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-600 hover:bg-stone-50"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-3 py-2 bg-burgundy text-white rounded-lg text-xs font-medium hover:bg-rose-600"
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
