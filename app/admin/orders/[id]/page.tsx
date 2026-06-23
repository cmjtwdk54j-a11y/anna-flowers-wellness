'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, MapPin, Package, CreditCard } from 'lucide-react';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import type { AdminOrder, OrderStatus } from '@/lib/admin/types';
import { useAdminLang } from '@/components/admin/AdminLangContext';

const STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED'];

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { t, lang } = useAdminLang();
  const td = t.orderDetail;
  const locale = lang === 'fi' ? 'fi-FI' : 'en-GB';
  const fmt = (v: number) => v.toLocaleString(locale, { style: 'currency', currency: 'EUR' });
  const fmtDate = (iso: string | null | undefined) =>
    iso ? new Date(iso).toLocaleString(locale, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    setStatusMsg('');
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setOrder({ ...order, status: newStatus });
      setStatusMsg(td.statusUpdated);
      setTimeout(() => setStatusMsg(''), 3000);
    } else {
      setStatusMsg(td.statusError);
    }
    setUpdating(false);
  };

  if (loading) return (
    <div className="p-6 lg:p-8">
      <div className="text-sm text-stone-400">{td.loading}</div>
    </div>
  );

  if (!order) return (
    <div className="p-6 lg:p-8">
      <div className="text-sm text-red-500">{td.notFound}</div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-stone-800">{td.orderPrefix} #{order.orderNumber.slice(0, 16)}</h1>
          <p className="text-xs text-stone-400">{fmtDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto"><OrderStatusBadge status={order.status} /></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Status change */}
        <div className="lg:col-span-3 bg-white border border-stone-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-stone-700 mb-3">{td.changeStatus}</h2>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                disabled={updating || order.status === s}
                onClick={() => updateStatus(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  order.status === s
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50'
                }`}
              >
                {t.orderStatus[s]}
              </button>
            ))}
          </div>
          {statusMsg && <p className="text-xs text-emerald-600 mt-2">{statusMsg}</p>}
        </div>

        {/* Customer */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-stone-400" />
            <h2 className="text-sm font-semibold text-stone-700">{td.customer}</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-stone-400 text-xs">{td.name}</dt><dd className="font-medium text-stone-800">{order.customerName}</dd></div>
            <div><dt className="text-stone-400 text-xs">{td.phone}</dt><dd className="text-stone-700">{order.customerPhone}</dd></div>
            <div><dt className="text-stone-400 text-xs">{td.email}</dt><dd className="text-stone-700 break-all">{order.customerEmail}</dd></div>
          </dl>
        </div>

        {/* Delivery */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-stone-400" />
            <h2 className="text-sm font-semibold text-stone-700">{td.delivery}</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-stone-400 text-xs">{td.deliveryMethod}</dt><dd className="font-medium text-stone-800">{t.deliveryTypes[order.deliveryType as keyof typeof t.deliveryTypes] || order.deliveryType}</dd></div>
            {order.deliveryAddress && <div><dt className="text-stone-400 text-xs">{td.address}</dt><dd className="text-stone-700">{order.deliveryAddress}, {order.deliveryCity}</dd></div>}
            {order.deliveryNote && <div><dt className="text-stone-400 text-xs">{td.note}</dt><dd className="text-stone-700">{order.deliveryNote}</dd></div>}
            {order.scheduledAt && <div><dt className="text-stone-400 text-xs">{td.scheduled}</dt><dd className="text-stone-700">{fmtDate(order.scheduledAt)}</dd></div>}
          </dl>
        </div>

        {/* Payment */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-stone-400" />
            <h2 className="text-sm font-semibold text-stone-700">{td.payment}</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-stone-400 text-xs">{td.paymentMethod}</dt><dd className="font-medium text-stone-800">{order.paymentMethod}</dd></div>
            <div><dt className="text-stone-400 text-xs">{td.paymentStatus}</dt>
              <dd><span className={`text-xs font-medium ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>{order.paymentStatus}</span></dd>
            </div>
            {order.giftCardCode && <div><dt className="text-stone-400 text-xs">{td.giftCard}</dt><dd className="text-stone-700">{order.giftCardCode} (−{fmt(order.giftCardDiscount ?? 0)})</dd></div>}
          </dl>
        </div>

        {/* Items */}
        <div className="lg:col-span-3 bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-stone-100">
            <Package className="w-4 h-4 text-stone-400" />
            <h2 className="text-sm font-semibold text-stone-700">{td.items}</h2>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="text-xs text-stone-400 uppercase tracking-wide bg-stone-50">
                <th className="px-5 py-2.5 text-left font-medium">{td.product}</th>
                <th className="px-5 py-2.5 text-left font-medium">{td.size}</th>
                <th className="px-5 py-2.5 text-left font-medium">{td.qty}</th>
                <th className="px-5 py-2.5 text-right font-medium">{td.price}</th>
                <th className="px-5 py-2.5 text-right font-medium">{td.lineTotal}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-3 font-medium text-stone-800">{lang === 'en' ? item.name_en : item.name_fi}</td>
                  <td className="px-5 py-3 text-stone-500">{item.size === 'SMALL' ? td.sizeSmall : td.sizeLarge}</td>
                  <td className="px-5 py-3 text-stone-500">{item.quantity}</td>
                  <td className="px-5 py-3 text-right text-stone-700">{fmt(item.price)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-stone-800">{fmt(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-50 border-t border-stone-200">
              <tr>
                <td colSpan={4} className="px-5 py-2.5 text-right text-xs text-stone-400">{td.subtotal}</td>
                <td className="px-5 py-2.5 text-right text-sm font-medium text-stone-700">{fmt(order.subtotal)}</td>
              </tr>
              {order.deliveryFee > 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-1.5 text-right text-xs text-stone-400">{td.deliveryFee}</td>
                  <td className="px-5 py-1.5 text-right text-sm text-stone-700">{fmt(order.deliveryFee)}</td>
                </tr>
              )}
              {order.giftCardDiscount && order.giftCardDiscount > 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-1.5 text-right text-xs text-stone-400">{td.giftCardDiscount}</td>
                  <td className="px-5 py-1.5 text-right text-sm text-emerald-600">−{fmt(order.giftCardDiscount)}</td>
                </tr>
              )}
              <tr>
                <td colSpan={4} className="px-5 py-3 text-right text-sm font-semibold text-stone-700">{td.total}</td>
                <td className="px-5 py-3 text-right text-base font-bold text-stone-800">{fmt(order.total)}</td>
              </tr>
            </tfoot>
          </table>
          </div>
        </div>

        {order.notes && (
          <div className="lg:col-span-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-medium text-amber-700 mb-1">{td.customerComment}</p>
            <p className="text-sm text-amber-800">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
