'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  CreditCard, Smartphone, Wallet, MapPin, Home, School,
  Building2, Calendar, Clock, Tag, ShoppingBag, CheckCircle2, Loader2
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, DELIVERY_ZONES, cn } from '@/lib/utils';
import { ADDONS } from '@/lib/addons';

type PaymentMethod = 'card' | 'mobilepay' | 'edenred';
type DeliveryType = 'HOME' | 'SCHOOL' | 'CITY_CENTER' | 'PICKUP';

export default function CheckoutClient() {
  const t = useTranslations('checkout');
  const tCart = useTranslations('cart');
  const { state, subtotal, clearCart } = useCart();

  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  const [recipient, setRecipient] = useState({ sameAsBuyer: true, name: '', phone: '' });
  const [cardMessage, setCardMessage] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState({
    type: 'HOME' as DeliveryType,
    address: '', city: '', note: '',
    scheduleDate: '', scheduleTime: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardDiscount, setGiftCardDiscount] = useState(0);
  const [giftCardError, setGiftCardError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [orderError, setOrderError] = useState('');

  const selectedZone = DELIVERY_ZONES.find((z) => z.city === deliveryInfo.city);
  const deliveryFee =
    deliveryInfo.type === 'PICKUP' ? 0
    : deliveryInfo.type === 'CITY_CENTER' ? 0
    : (selectedZone ? selectedZone.priceOutside : 0);

  const addonsTotal = ADDONS
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const total = Math.max(0, subtotal + addonsTotal + deliveryFee - giftCardDiscount);

  const availableTimes = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const today = new Date().toISOString().split('T')[0];

  const handleApplyGiftCard = async () => {
    if (!giftCardCode.trim()) return;
    try {
      const res = await fetch(`/api/gift-cards/validate?code=${giftCardCode}`);
      const data = await res.json();
      if (data.valid) {
        setGiftCardDiscount(data.balance);
        setGiftCardError('');
      } else {
        setGiftCardError(t('giftCardInvalid'));
      }
    } catch {
      setGiftCardError(t('giftCardCheckError'));
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderPayload = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        recipientName: deliveryInfo.type === 'PICKUP'
          ? null
          : (recipient.sameAsBuyer ? customerInfo.name : recipient.name),
        recipientPhone: deliveryInfo.type === 'PICKUP'
          ? null
          : (recipient.sameAsBuyer ? customerInfo.phone : recipient.phone),
        cardMessage: cardMessage || null,
        deliveryType: deliveryInfo.type,
        deliveryAddress: deliveryInfo.address,
        deliveryCity: deliveryInfo.city,
        deliveryNote: deliveryInfo.note,
        scheduledAt: deliveryInfo.scheduleDate
          ? new Date(`${deliveryInfo.scheduleDate}T${deliveryInfo.scheduleTime || '12:00'}`).toISOString()
          : null,
        addons: selectedAddons,
        paymentMethod,
        giftCardCode: giftCardCode || null,
        giftCardDiscount: giftCardDiscount || null,
        subtotal,
        deliveryFee,
        total,
        notes: deliveryInfo.note,
        items: state.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
          name_fi: item.name_fi,
          name_en: item.name_en,
        })),
      };

      let res: Response;
      try {
        res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
      } catch {
        setOrderError(t('networkError'));
        return;
      }
      if (!res.ok) {
        setOrderError(t('orderError'));
        return;
      }

      // Card payment → create a Stripe Checkout session and redirect to the
      // hosted payment page. Other methods → in-page confirmation.
      if (paymentMethod === 'card') {
        const { order } = await res.json();
        const payRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        });
        const payData = await payRes.json();
        if (payRes.ok && payData.url) {
          window.location.href = payData.url;
          return;
        }
        setOrderError(t('orderError'));
        return;
      }

      clearCart();
      setOrderPlaced(true);
    } catch {
      setOrderError(t('orderError'));
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{tCart('empty')}</h2>
        <Link href="/flowers" className="text-burgundy hover:text-burgundy font-medium">
          {tCart('continue')} →
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 bg-soft-pink rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-burgundy" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('orderReceived')}</h2>
        <p className="text-gray-500 mb-8">
          {t('confirmationSentTo')} <strong>{customerInfo.email}</strong>.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/flowers" className="px-5 py-2.5 bg-burgundy text-white rounded-full font-medium hover:bg-burgundy/90 transition-colors">
            {tCart('continue')}
          </Link>
          <Link href="/" className="px-5 py-2.5 border border-pink-100 text-gray-600 rounded-xl hover:bg-soft-pink transition-colors">
            {t('homeLink')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handlePlaceOrder}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">{t('title')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer info */}
            <div className="bg-white rounded-2xl border border-pink-50 p-6">
              <h2 className="font-semibold text-gray-800 mb-4">{t('customerInfo')}</h2>
              <div className="space-y-3">
                <input
                  type="text" required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder={t('name') + ' *'}
                  className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-pink"
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="email" required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder={t('email') + ' *'}
                    className="border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-pink"
                  />
                  <input
                    type="tel" required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder={t('phone') + ' *'}
                    className="border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-pink"
                  />
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-2xl border border-pink-50 p-6">
              <h2 className="font-semibold text-gray-800 mb-4">{t('deliveryInfo')}</h2>

              {/* Delivery type */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {([
                  { type: 'HOME', icon: Home, label: t('home') },
                  { type: 'SCHOOL', icon: School, label: t('school') },
                  { type: 'CITY_CENTER', icon: Building2, label: t('cityCenter') },
                  { type: 'PICKUP', icon: MapPin, label: t('pickup') },
                ] as const).map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDeliveryInfo({ ...deliveryInfo, type })}
                    className={cn(
                      'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-xs font-medium transition-colors',
                      deliveryInfo.type === type
                        ? 'border-accent-pink bg-soft-pink text-burgundy'
                        : 'border-pink-100 text-gray-500 hover:border-accent-pink/60'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {deliveryInfo.type !== 'PICKUP' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={deliveryInfo.address}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                    placeholder={`${t('address')} *`}
                    className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-pink"
                  />
                  <select
                    required
                    value={deliveryInfo.city}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                    className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-pink"
                  >
                    <option value="">{t('city')} *</option>
                    {DELIVERY_ZONES.map((z) => (
                      <option key={z.city} value={z.city}>{z.city}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Recipient */}
              {deliveryInfo.type !== 'PICKUP' && (
                <div className="mt-4 pt-4 border-t border-pink-50">
                  <label className="flex items-center gap-2.5 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={!recipient.sameAsBuyer}
                      onChange={(e) => setRecipient({ ...recipient, sameAsBuyer: !e.target.checked })}
                      className="rounded border-stone-300 text-burgundy focus:ring-accent-pink"
                    />
                    <span className="text-sm font-medium text-gray-700">{t('recipientOther')}</span>
                  </label>
                  {!recipient.sameAsBuyer && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        type="text" required
                        value={recipient.name}
                        onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
                        placeholder={`${t('recipientName')} *`}
                        className="border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-pink"
                      />
                      <input
                        type="tel" required
                        value={recipient.phone}
                        onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
                        placeholder={`${t('recipientPhone')} *`}
                        className="border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-pink"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Pre-order scheduling */}
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {t('scheduleDate')}
                  </label>
                  <input
                    type="date"
                    min={today}
                    required={deliveryInfo.type !== 'PICKUP'}
                    value={deliveryInfo.scheduleDate}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, scheduleDate: e.target.value })}
                    className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-pink"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {t('scheduleTime')}
                  </label>
                  <select
                    value={deliveryInfo.scheduleTime}
                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, scheduleTime: e.target.value })}
                    className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-pink"
                  >
                    <option value="">{t('selectTime')}</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-2">{t('cutoffHint')}</p>

              {/* Card message */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('cardMessage')}</label>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  placeholder={t('cardMessagePlaceholder')}
                  className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-pink resize-none"
                />
              </div>

              <textarea
                rows={2}
                value={deliveryInfo.note}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, note: e.target.value })}
                placeholder={t('notes')}
                className="mt-3 w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-pink resize-none"
              />
            </div>

            {/* Addons / upsell */}
            <div className="bg-white rounded-2xl border border-pink-50 p-6">
              <h2 className="font-semibold text-gray-800 mb-1">{t('addonsTitle')}</h2>
              <p className="text-xs text-gray-400 mb-4">{t('addonsSubtitle')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ADDONS.map((addon) => {
                  const active = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() =>
                        setSelectedAddons((prev) =>
                          active ? prev.filter((id) => id !== addon.id) : [...prev, addon.id]
                        )
                      }
                      className={cn(
                        'flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border text-center transition-colors',
                        active
                          ? 'border-accent-pink bg-soft-pink text-burgundy'
                          : 'border-pink-100 text-gray-600 hover:border-accent-pink/60'
                      )}
                    >
                      <span className="text-2xl">{addon.emoji}</span>
                      <span className="text-xs font-medium leading-tight">{addon.name_en}</span>
                      <span className="text-xs text-gray-400">+{formatPrice(addon.price)}</span>
                    </button>
                  );
                })}
              </div>
              {selectedAddons.length > 0 && (
                <p className="text-xs text-burgundy mt-3">
                  {t('addonsSelected', { count: selectedAddons.length })}
                </p>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-pink-50 p-6">
              <h2 className="font-semibold text-gray-800 mb-4">{t('paymentInfo')}</h2>

              <div className="space-y-3">
                {([
                  { id: 'card', icon: CreditCard, label: t('card'), desc: 'Visa, Mastercard' },
                  { id: 'mobilepay', icon: Smartphone, label: t('mobilePay'), desc: t('mobilePayDesc') },
                  { id: 'edenred', icon: Wallet, label: t('edenred'), desc: 'Edenred Virike & Kulttuuri' },
                ] as const).map(({ id, icon: Icon, label, desc }) => (
                  <label
                    key={id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors',
                      paymentMethod === id
                        ? 'border-accent-pink bg-soft-pink'
                        : 'border-pink-100 hover:border-accent-pink/60'
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={() => setPaymentMethod(id)}
                      className="text-burgundy"
                    />
                    <Icon className={cn('w-5 h-5', paymentMethod === id ? 'text-accent-pink' : 'text-gray-400')} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                    {id === 'mobilepay' && (
                      <span className="text-xs bg-soft-pink text-burgundy px-2 py-0.5 rounded-full">{t('soon')}</span>
                    )}
                  </label>
                ))}
              </div>

              {/* Gift card */}
              <div className="mt-4 pt-4 border-t border-pink-50">
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {t('giftCard')}
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                    placeholder={t('giftCardCode')}
                    className="flex-1 border border-pink-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent-pink"
                  />
                  <button
                    type="button"
                    onClick={handleApplyGiftCard}
                    className="px-4 py-2 bg-soft-pink hover:bg-soft-pink text-gray-700 rounded-xl text-sm font-medium transition-colors"
                  >
                    {t('apply')}
                  </button>
                </div>
                {giftCardError && <p className="text-xs text-red-500 mt-1">{giftCardError}</p>}
                {giftCardDiscount > 0 && (
                  <p className="text-xs text-burgundy mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('giftCardApplied')}: -{formatPrice(giftCardDiscount)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Order summary */}
          <div>
            <div className="bg-white rounded-2xl border border-pink-50 p-6 sticky top-20">
              <h2 className="font-semibold text-gray-800 mb-4">{t('orderSummary')}</h2>

              <ul className="space-y-3 mb-4">
                {state.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-soft-pink flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name_fi}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{item.name_fi}</p>
                      <p className="text-xs text-gray-400">
                        {item.size === 'SMALL' ? tCart('sizeSmall') : tCart('sizeLarge')} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-gray-800">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 pt-4 border-t border-pink-50 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{tCart('subtotal')}</span>
                  <span className="text-gray-700">{formatPrice(subtotal)}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('addonsTitle')}</span>
                    <span className="text-gray-700">+{formatPrice(addonsTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('deliveryFee')}</span>
                  <span className="text-gray-700">
                    {deliveryFee === 0 ? <span className="text-burgundy">{t('free')}</span> : formatPrice(deliveryFee)}
                  </span>
                </div>
                {giftCardDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('giftCard')}</span>
                    <span className="text-burgundy">-{formatPrice(giftCardDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center py-3 border-t border-pink-100 mb-5">
                <span className="font-semibold text-gray-800">{t('total')}</span>
                <span className="text-xl font-bold text-gray-800">{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-burgundy hover:bg-burgundy/90 disabled:bg-burgundy/40 text-white font-medium py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t('processing')}</>
                ) : (
                  <>{t('placeOrder')} →</>
                )}
              </button>

              {orderError && (
                <p className="text-xs text-red-500 text-center mt-2">{orderError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
