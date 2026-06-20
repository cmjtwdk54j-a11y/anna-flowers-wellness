'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, MapPin, Package, CreditCard } from 'lucide-react';
import OrderStatusBadge, { STATUS_CONFIG } from '@/components/admin/OrderStatusBadge';
import type { AdminOrder, OrderStatus } from '@/lib/admin/types';

function fmt(v: number) {
  return v.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });
}
function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
const DELIVERY_LABELS: Record<string, string> = {
  HOME: 'Kotiinkuljetus', SCHOOL: 'Koulu', CITY_CENTER: 'Kaupunkikeskusta', PICKUP: 'Nouto',
};
const STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED'];

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
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
      setStatusMsg('Status päivitetty!');
      setTimeout(() => setStatusMsg(''), 3000);
    } else {
      setStatusMsg('Virhe päivityksessä');
    }
    setUpdating(false);
  };

  if (loading) return (
    <div className="p-6 lg:p-8">
      <div className="text-sm text-stone-400">Ladataan...</div>
    </div>
  );

  if (!order) return (
    <div className="p-6 lg:p-8">
      <div className="text-sm text-red-500">Tilausta ei löydy</div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-stone-800">Tilaus #{order.orderNumber.slice(0, 16)}</h1>
          <p className="text-xs text-stone-400">{fmtDate(order.createdAt)}</p>
        </div>
        <div className="ml-auto"><OrderStatusBadge status={order.status} /></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Status change */}
        <div className="lg:col-span-3 bg-white border border-stone-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-stone-700 mb-3">Muuta statusta</h2>
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
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
          {statusMsg && <p className="text-xs text-emerald-600 mt-2">{statusMsg}</p>}
        </div>

        {/* Customer */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-stone-400" />
            <h2 className="text-sm font-semibold text-stone-700">Asiakas</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-stone-400 text-xs">Nimi</dt><dd className="font-medium text-stone-800">{order.customerName}</dd></div>
            <div><dt className="text-stone-400 text-xs">Puhelin</dt><dd className="text-stone-700">{order.customerPhone}</dd></div>
            <div><dt className="text-stone-400 text-xs">Sähköposti</dt><dd className="text-stone-700 break-all">{order.customerEmail}</dd></div>
          </dl>
        </div>

        {/* Delivery */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-stone-400" />
            <h2 className="text-sm font-semibold text-stone-700">Toimitus</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-stone-400 text-xs">Toimitustapa</dt><dd className="font-medium text-stone-800">{DELIVERY_LABELS[order.deliveryType] || order.deliveryType}</dd></div>
            {order.deliveryAddress && <div><dt className="text-stone-400 text-xs">Osoite</dt><dd className="text-stone-700">{order.deliveryAddress}, {order.deliveryCity}</dd></div>}
            {order.deliveryNote && <div><dt className="text-stone-400 text-xs">Huomio</dt><dd className="text-stone-700">{order.deliveryNote}</dd></div>}
            {order.scheduledAt && <div><dt className="text-stone-400 text-xs">Ajastettu</dt><dd className="text-stone-700">{fmtDate(order.scheduledAt)}</dd></div>}
          </dl>
        </div>

        {/* Payment */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-stone-400" />
            <h2 className="text-sm font-semibold text-stone-700">Maksu</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-stone-400 text-xs">Maksutapa</dt><dd className="font-medium text-stone-800">{order.paymentMethod}</dd></div>
            <div><dt className="text-stone-400 text-xs">Maksustatus</dt>
              <dd><span className={`text-xs font-medium ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>{order.paymentStatus}</span></dd>
            </div>
            {order.giftCardCode && <div><dt className="text-stone-400 text-xs">Lahjakortti</dt><dd className="text-stone-700">{order.giftCardCode} (−{fmt(order.giftCardDiscount ?? 0)})</dd></div>}
          </dl>
        </div>

        {/* Items */}
        <div className="lg:col-span-3 bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-stone-100">
            <Package className="w-4 h-4 text-stone-400" />
            <h2 className="text-sm font-semibold text-stone-700">Tilauksen sisältö</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-stone-400 uppercase tracking-wide bg-stone-50">
                <th className="px-5 py-2.5 text-left font-medium">Tuote</th>
                <th className="px-5 py-2.5 text-left font-medium">Koko</th>
                <th className="px-5 py-2.5 text-left font-medium">Kpl</th>
                <th className="px-5 py-2.5 text-right font-medium">Hinta</th>
                <th className="px-5 py-2.5 text-right font-medium">Yhteensä</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-3 font-medium text-stone-800">{item.name_fi}</td>
                  <td className="px-5 py-3 text-stone-500">{item.size === 'SMALL' ? 'Pieni' : 'Suuri'}</td>
                  <td className="px-5 py-3 text-stone-500">{item.quantity}</td>
                  <td className="px-5 py-3 text-right text-stone-700">{fmt(item.price)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-stone-800">{fmt(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-50 border-t border-stone-200">
              <tr>
                <td colSpan={4} className="px-5 py-2.5 text-right text-xs text-stone-400">Välisumma</td>
                <td className="px-5 py-2.5 text-right text-sm font-medium text-stone-700">{fmt(order.subtotal)}</td>
              </tr>
              {order.deliveryFee > 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-1.5 text-right text-xs text-stone-400">Toimitusmaksu</td>
                  <td className="px-5 py-1.5 text-right text-sm text-stone-700">{fmt(order.deliveryFee)}</td>
                </tr>
              )}
              {order.giftCardDiscount && order.giftCardDiscount > 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-1.5 text-right text-xs text-stone-400">Lahjakorttialennus</td>
                  <td className="px-5 py-1.5 text-right text-sm text-emerald-600">−{fmt(order.giftCardDiscount)}</td>
                </tr>
              )}
              <tr>
                <td colSpan={4} className="px-5 py-3 text-right text-sm font-semibold text-stone-700">Yhteensä</td>
                <td className="px-5 py-3 text-right text-base font-bold text-stone-800">{fmt(order.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {order.notes && (
          <div className="lg:col-span-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-medium text-amber-700 mb-1">Asiakkaan kommentti</p>
            <p className="text-sm text-amber-800">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
