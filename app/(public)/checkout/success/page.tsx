export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { CheckCircle2, Flower2, Package, Truck, Clock, Phone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDate } from '@/lib/utils';
import CartClearer from '@/components/checkout/CartClearer';

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const t = await getTranslations('success');
  const tCart = await getTranslations('cart');

  let order: Awaited<ReturnType<typeof prisma.order.findFirst>> & { items: any[] } | null = null;

  if (session_id) {
    try {
      order = await prisma.order.findFirst({
        where: { stripeSessionId: session_id } as any,
        include: { items: true },
      }) as any;
    } catch {
      // DB unavailable — show generic success without order details
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <CartClearer />

      {/* Success header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-stone-800 mb-2">{t('title')}</h1>
        {order && (
          <p className="text-stone-500 text-sm">
            {t('orderNumber')}:{' '}
            <span className="font-semibold text-stone-700">{order.orderNumber}</span>
          </p>
        )}
        <p className="text-stone-500 mt-1 text-sm">{t('confirmationSent')}</p>
      </div>

      {/* Order summary */}
      {order && order.items.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-4">
          <h2 className="font-semibold text-stone-800 mb-4">{t('orderSummary')}</h2>
          <ul className="space-y-3 mb-4">
            {order.items.map((item: any, i: number) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-stone-700">
                  {item.name_fi}{' '}
                  <span className="text-stone-400">
                    ({item.size === 'SMALL' ? tCart('sizeSmall') : tCart('sizeLarge')}) × {item.quantity}
                  </span>
                </span>
                <span className="font-medium text-stone-800">
                  {formatPrice(Number(item.price) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-stone-100 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">{tCart('subtotal')}</span>
              <span className="text-stone-700">{formatPrice(Number(order.subtotal))}</span>
            </div>
            {Number(order.deliveryFee) > 0 && (
              <div className="flex justify-between">
                <span className="text-stone-500">{t('deliveryFee')}</span>
                <span className="text-stone-700">{formatPrice(Number(order.deliveryFee))}</span>
              </div>
            )}
            {order.giftCardDiscount && Number(order.giftCardDiscount) > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>{t('giftCardDiscount')}</span>
                <span>-{formatPrice(Number(order.giftCardDiscount))}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t border-stone-100">
              <span className="text-stone-800">{t('total')}</span>
              <span className="text-stone-800">{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </div>
      )}

      {/* Delivery info */}
      {order && (order.deliveryAddress || order.scheduledAt) && (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-4">
          <h2 className="font-semibold text-stone-800 mb-3">{t('deliveryInfo')}</h2>
          <div className="space-y-2 text-sm text-stone-600">
            {order.deliveryAddress && (
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                <span>
                  {order.deliveryAddress}
                  {order.deliveryCity ? `, ${order.deliveryCity}` : ''}
                </span>
              </div>
            )}
            {order.scheduledAt && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                <span>{formatDate(order.scheduledAt)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* What's next */}
      <div className="bg-rose-50 rounded-2xl p-6 mb-8">
        <h2 className="font-semibold text-stone-800 mb-3">{t('whatsNext')}</h2>
        <ul className="space-y-2.5 text-sm text-stone-600">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            {t('step1')}
          </li>
          <li className="flex items-start gap-2.5">
            <Package className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            {t('step2')}
          </li>
          <li className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            {t('step3')}
          </li>
        </ul>
        <div className="mt-4 pt-4 border-t border-rose-100 flex items-center gap-2 text-sm text-stone-600">
          <Phone className="w-4 h-4 text-stone-400 flex-shrink-0" />
          <span>
            {t('questions')} <strong>+358 50 123 4567</strong>
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/flowers"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-colors"
        >
          <Flower2 className="w-4 h-4" />
          {t('continueShopping')}
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition-colors"
        >
          {t('home')}
        </Link>
      </div>
    </div>
  );
}
