'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import OrderStatusBadge, { STATUS_CONFIG } from '@/components/admin/OrderStatusBadge';
import type { AdminOrder, OrderStatus } from '@/lib/admin/types';

const STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED'];

function fmt(v: number) {
  return v.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('fi-FI', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const DELIVERY_LABELS: Record<string, string> = {
  HOME: 'Kotiinkuljetus', SCHOOL: 'Koulu', CITY_CENTER: 'Kaupunkikeskusta', PICKUP: 'Nouto',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      params.set('page', String(page));
      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Tilaukset</h1>
          <p className="text-sm text-stone-400 mt-0.5">{total} tilausta yhteensä</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hae numerolla, nimellä, puhelimella..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
              Hae
            </button>
          </form>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Kaikki statukset</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-stone-400 uppercase tracking-wide bg-stone-50 border-b border-stone-200">
                <th className="px-5 py-3 text-left font-medium">Numero</th>
                <th className="px-5 py-3 text-left font-medium">Asiakas</th>
                <th className="px-5 py-3 text-left font-medium">Puhelin</th>
                <th className="px-5 py-3 text-left font-medium">Toimitus</th>
                <th className="px-5 py-3 text-left font-medium">Summa</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Aika</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-stone-400">Ladataan...</td></tr>
              )}
              {!loading && orders.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-stone-400">Ei tilauksia</td></tr>
              )}
              {!loading && orders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs text-stone-600">{o.orderNumber.slice(0, 14)}…</span>
                  </td>
                  <td className="px-5 py-3 font-medium text-stone-800">{o.customerName}</td>
                  <td className="px-5 py-3 text-stone-500">{o.customerPhone}</td>
                  <td className="px-5 py-3 text-stone-500">{DELIVERY_LABELS[o.deliveryType] || o.deliveryType}</td>
                  <td className="px-5 py-3 font-semibold text-stone-800">{fmt(o.total)}</td>
                  <td className="px-5 py-3"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-5 py-3 text-stone-400 text-xs whitespace-nowrap">{fmtDate(o.createdAt)}</td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-xs text-indigo-600 hover:underline whitespace-nowrap">
                      Avaa →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-stone-100 bg-stone-50">
            <p className="text-xs text-stone-400">Sivu {page} / {totalPages}</p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-100"
              >← Edellinen</button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-100"
              >Seuraava →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
