export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard' };

import { Euro, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import SalesChart from '@/components/admin/SalesChart';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import type { DashboardStats, OrderStatus } from '@/lib/admin/types';
import { prisma } from '@/lib/prisma';

async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOf30Days = new Date(startOfDay);
    startOf30Days.setDate(startOfDay.getDate() - 29);

    const [todayOrders, weekOrders, monthOrders, allOrders, recentOrders, ordersByStatus, topItems] =
      await Promise.all([
        prisma.order.findMany({ where: { createdAt: { gte: startOfDay }, paymentStatus: 'PAID' } }),
        prisma.order.findMany({ where: { createdAt: { gte: startOfWeek }, paymentStatus: 'PAID' } }),
        prisma.order.findMany({ where: { createdAt: { gte: startOfMonth }, paymentStatus: 'PAID' } }),
        prisma.order.findMany({ where: { paymentStatus: 'PAID' } }),
        prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
        prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
        prisma.orderItem.groupBy({
          by: ['productId', 'name_fi'],
          _sum: { quantity: true, price: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
      ]);

    const sum = (orders: { total: unknown }[]) =>
      orders.reduce((acc, o) => acc + Number(o.total), 0);

    const statusCounts: Record<string, number> = {};
    ordersByStatus.forEach((g) => { statusCounts[g.status] = g._count.id; });

    const salesByDay: DashboardStats['salesByDay'] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(startOfDay);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const dayOrders = await prisma.order.findMany({
        where: { createdAt: { gte: d, lt: next }, paymentStatus: 'PAID' },
      });
      salesByDay.push({
        date: d.toISOString().slice(0, 10),
        revenue: dayOrders.reduce((a, o) => a + Number(o.total), 0),
        orders: dayOrders.length,
      });
    }

    const alerts: DashboardStats['alerts'] = [];
    const outOfStock = await prisma.product.count({ where: { inStock: false } });
    if (outOfStock > 0) alerts.push({ type: 'warning', message: `${outOfStock} tuotetta loppu varastosta` });

    return {
      revenue: { today: sum(todayOrders), week: sum(weekOrders), month: sum(monthOrders) },
      orders: {
        total: allOrders.length,
        pending: statusCounts['PENDING'] || 0,
        confirmed: statusCounts['CONFIRMED'] || 0,
        processing: statusCounts['PROCESSING'] || 0,
        ready: statusCounts['READY'] || 0,
        delivered: statusCounts['DELIVERED'] || 0,
        cancelled: statusCounts['CANCELLED'] || 0,
      },
      avgOrderValue: allOrders.length > 0 ? sum(allOrders) / allOrders.length : 0,
      topProducts: topItems.map((t) => ({
        id: t.productId,
        name: t.name_fi,
        count: Number(t._sum.quantity) || 0,
        revenue: Number(t._sum.price) || 0,
      })),
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        total: Number(o.total),
        status: o.status as any,
        createdAt: o.createdAt.toISOString(),
      })),
      salesByDay,
      alerts,
    };
  } catch (err) {
    console.error('Dashboard error:', err);
    throw err;
  }
}

function fmt(v: number) {
  return v.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('fi-FI', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminDashboardPage() {
  let stats: DashboardStats | null = null;
  let errorMsg = '';
  try {
    stats = await getDashboardStats();
  } catch (err: any) {
    errorMsg = String(err?.message || err);
  }

  if (!stats) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-xl font-bold text-stone-800 mb-6">Dashboard</h1>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            Tietokantayhteyttä ei löydy.
          </div>
          {errorMsg && <pre className="text-xs mt-2 whitespace-pre-wrap break-all">{errorMsg}</pre>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-800">Dashboard</h1>
        <p className="text-sm text-stone-400 mt-0.5">Yleiskatsaus liiketoimintaan</p>
      </div>

      {/* Alerts */}
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

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Tänään" value={fmt(stats.revenue.today)} icon={Euro} color="green"
          sub={`${stats.orders.pending} uutta tilausta`} />
        <StatCard label="Tämä viikko" value={fmt(stats.revenue.week)} icon={TrendingUp} color="blue" />
        <StatCard label="Tämä kuukausi" value={fmt(stats.revenue.month)} icon={Euro} color="purple" />
        <StatCard label="Tilauksia yhteensä" value={stats.orders.total} icon={ShoppingBag} color="rose"
          sub={`Keskim. ${fmt(stats.avgOrderValue)}`} />
      </div>

      {/* Order status pills */}
      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-stone-600 mb-3">Tilaukset statuksen mukaan</h2>
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
        {/* Sales chart */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-700">Myynti (30 pv)</h2>
          </div>
          <SalesChart data={stats.salesByDay} mode="revenue" height={200} />
        </div>

        {/* Top products */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">Top tuotteet</h2>
          <ol className="space-y-3">
            {stats.topProducts.length === 0 && <li className="text-sm text-stone-400">Ei dataa</li>}
            {stats.topProducts.map((p, i) => (
              <li key={p.id} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{p.name}</p>
                  <p className="text-xs text-stone-400">{p.count} kpl · {fmt(p.revenue)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-700">Viimeisimmät tilaukset</h2>
          <a href="/admin/orders" className="text-xs text-indigo-600 hover:underline">Kaikki →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-stone-400 uppercase tracking-wide bg-stone-50">
                <th className="px-5 py-2.5 text-left font-medium">Numero</th>
                <th className="px-5 py-2.5 text-left font-medium">Asiakas</th>
                <th className="px-5 py-2.5 text-left font-medium">Summa</th>
                <th className="px-5 py-2.5 text-left font-medium">Status</th>
                <th className="px-5 py-2.5 text-left font-medium">Aika</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {stats.recentOrders.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-stone-400">Ei tilauksia</td></tr>
              )}
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3">
                    <a href={`/admin/orders/${o.id}`} className="font-mono text-xs text-indigo-600 hover:underline">
                      {o.orderNumber.slice(0, 12)}…
                    </a>
                  </td>
                  <td className="px-5 py-3 text-stone-700">{o.customerName}</td>
                  <td className="px-5 py-3 font-semibold text-stone-800">{fmt(o.total)}</td>
                  <td className="px-5 py-3"><OrderStatusBadge status={o.status as OrderStatus} /></td>
                  <td className="px-5 py-3 text-stone-400 text-xs whitespace-nowrap">{fmtDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
