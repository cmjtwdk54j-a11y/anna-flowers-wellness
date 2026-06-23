'use client';

import { Euro, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import SalesChart from '@/components/admin/SalesChart';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { useAdminLang } from '@/components/admin/AdminLangContext';
import type { DashboardStats, OrderStatus } from '@/lib/admin/types';

function fmt(v: number, lang: string) {
  return v.toLocaleString(lang === 'fi' ? 'fi-FI' : 'en-GB', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  });
}

function fmtDate(iso: string, lang: string) {
  return new Date(iso).toLocaleString(lang === 'fi' ? 'fi-FI' : 'en-GB', {
    day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function DashboardContent({ stats }: { stats: DashboardStats }) {
  const { lang, t } = useAdminLang();

  const statusLabels: Record<string, string> = lang === 'fi'
    ? { PENDING: 'Uusi', CONFIRMED: 'Vahvistettu', PROCESSING: 'Kerätään', READY: 'Valmis', DELIVERED: 'Toimitettu', CANCELLED: 'Peruutettu' }
    : { PENDING: 'New', CONFIRMED: 'Confirmed', PROCESSING: 'Preparing', READY: 'Ready', DELIVERED: 'Delivered', CANCELLED: 'Cancelled' };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-800">{t.dashboard.title}</h1>
        <p className="text-sm text-stone-400 mt-0.5">
          {lang === 'fi' ? 'Yleiskatsaus liiketoimintaan' : 'Business overview'}
        </p>
      </div>

      {stats.alerts.length > 0 && (
        <div className="space-y-2">
          {stats.alerts.map((a, i) => (
            <div key={i} className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2.5 rounded-xl">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {a.message}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label={lang === 'fi' ? 'Tänään' : 'Today'}
          value={fmt(stats.revenue.today, lang)}
          icon={Euro} color="green"
          sub={`${stats.orders.pending} ${lang === 'fi' ? 'uutta tilausta' : 'new orders'}`}
        />
        <StatCard
          label={lang === 'fi' ? 'Tämä viikko' : 'This week'}
          value={fmt(stats.revenue.week, lang)}
          icon={TrendingUp} color="blue"
        />
        <StatCard
          label={lang === 'fi' ? 'Tämä kuukausi' : 'This month'}
          value={fmt(stats.revenue.month, lang)}
          icon={Euro} color="purple"
        />
        <StatCard
          label={lang === 'fi' ? 'Tilauksia yhteensä' : 'Total orders'}
          value={stats.orders.total}
          icon={ShoppingBag} color="rose"
          sub={`${lang === 'fi' ? 'Keskim.' : 'Avg.'} ${fmt(stats.avgOrderValue, lang)}`}
        />
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-stone-600 mb-3">
          {lang === 'fi' ? 'Tilaukset statuksen mukaan' : 'Orders by status'}
        </h2>
        <div className="flex flex-wrap gap-3">
          {([
            ['PENDING', stats.orders.pending],
            ['CONFIRMED', stats.orders.confirmed],
            ['PROCESSING', stats.orders.processing],
            ['READY', stats.orders.ready],
            ['DELIVERED', stats.orders.delivered],
            ['CANCELLED', stats.orders.cancelled],
          ] as [OrderStatus, number][]).map(([st, count]) => (
            <div key={st} className="flex items-center gap-2">
              <OrderStatusBadge status={st} />
              <span className="text-sm font-bold text-stone-700">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">
            {t.dashboard.salesChart}
          </h2>
          <SalesChart data={stats.salesByDay} mode="revenue" height={200} />
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">
            {t.dashboard.topProducts}
          </h2>
          <ol className="space-y-3">
            {stats.topProducts.length === 0 && (
              <li className="text-sm text-stone-400">{lang === 'fi' ? 'Ei dataa' : 'No data'}</li>
            )}
            {stats.topProducts.map((p, i) => (
              <li key={p.id} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{p.name}</p>
                  <p className="text-xs text-stone-400">
                    {p.count} {lang === 'fi' ? 'kpl' : 'pcs'} · {fmt(p.revenue, lang)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-700">
            {t.dashboard.recentOrders}
          </h2>
          <a href="/admin/orders" className="text-xs text-indigo-600 hover:underline">
            {t.dashboard.viewAll} →
          </a>
        </div>
        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-stone-100">
          {stats.recentOrders.length === 0 && (
            <p className="px-4 py-8 text-center text-stone-400 text-sm">{t.dashboard.noOrders}</p>
          )}
          {stats.recentOrders.map((o) => (
            <a key={o.id} href={`/admin/orders/${o.id}`} className="block px-4 py-3 hover:bg-stone-50 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-1">
                <span className="font-medium text-stone-700 truncate">{o.customerName}</span>
                <OrderStatusBadge status={o.status as OrderStatus} />
              </div>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-stone-800">{fmt(o.total, lang)}</span>
                <span className="text-stone-400 whitespace-nowrap">{fmtDate(o.createdAt, lang)}</span>
              </div>
            </a>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-stone-400 uppercase tracking-wide bg-stone-50">
                <th className="px-5 py-2.5 text-left font-medium">{lang === 'fi' ? 'Numero' : 'Number'}</th>
                <th className="px-5 py-2.5 text-left font-medium">{lang === 'fi' ? 'Asiakas' : 'Customer'}</th>
                <th className="px-5 py-2.5 text-left font-medium">{lang === 'fi' ? 'Summa' : 'Amount'}</th>
                <th className="px-5 py-2.5 text-left font-medium">Status</th>
                <th className="px-5 py-2.5 text-left font-medium">{lang === 'fi' ? 'Aika' : 'Time'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-stone-400">
                    {t.dashboard.noOrders}
                  </td>
                </tr>
              )}
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3">
                    <a href={`/admin/orders/${o.id}`} className="font-mono text-xs text-indigo-600 hover:underline">
                      {o.orderNumber.slice(0, 12)}…
                    </a>
                  </td>
                  <td className="px-5 py-3 text-stone-700">{o.customerName}</td>
                  <td className="px-5 py-3 font-semibold text-stone-800">{fmt(o.total, lang)}</td>
                  <td className="px-5 py-3"><OrderStatusBadge status={o.status as OrderStatus} /></td>
                  <td className="px-5 py-3 text-stone-400 text-xs whitespace-nowrap">
                    {fmtDate(o.createdAt, lang)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
