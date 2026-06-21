export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard' };

import { AlertTriangle } from 'lucide-react';
import DashboardContent from '@/components/admin/DashboardContent';
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

    const [revenueRows, recentOrders, ordersByStatus, topItems] =
      await Promise.all([
        prisma.order.findMany({
          where: { paymentStatus: 'PAID' },
          select: { createdAt: true, total: true, status: true },
        }),
        prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
        prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
        prisma.orderItem.groupBy({
          by: ['productId', 'name_fi'],
          _sum: { quantity: true, price: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
      ]);

    const sum = (rows: { createdAt: Date; total: unknown }[], from: Date) =>
      rows.filter(o => o.createdAt >= from).reduce((acc, o) => acc + Number(o.total), 0);

    const todayRevenue = sum(revenueRows, startOfDay);
    const weekRevenue = sum(revenueRows, startOfWeek);
    const monthRevenue = sum(revenueRows, startOfMonth);
    const allRevenue = revenueRows.reduce((acc, o) => acc + Number(o.total), 0);

    const statusCounts: Record<string, number> = {};
    ordersByStatus.forEach((g) => { statusCounts[g.status] = g._count.id; });

    const last30Orders = await prisma.order.findMany({
      where: { createdAt: { gte: startOf30Days }, paymentStatus: 'PAID' },
      select: { createdAt: true, total: true },
    });
    const dayMap = new Map<string, { revenue: number; orders: number }>();
    for (const o of last30Orders) {
      const day = o.createdAt.toISOString().slice(0, 10);
      const prev = dayMap.get(day) ?? { revenue: 0, orders: 0 };
      dayMap.set(day, { revenue: prev.revenue + Number(o.total), orders: prev.orders + 1 });
    }
    const salesByDay: DashboardStats['salesByDay'] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(startOfDay);
      d.setDate(d.getDate() - i);
      const day = d.toISOString().slice(0, 10);
      const data = dayMap.get(day) ?? { revenue: 0, orders: 0 };
      salesByDay.push({ date: day, ...data });
    }

    const alerts: DashboardStats['alerts'] = [];
    const outOfStock = await prisma.product.count({ where: { inStock: false } });
    if (outOfStock > 0) alerts.push({ type: 'warning', message: `${outOfStock} tuotetta loppu varastosta` });

    return {
      revenue: { today: todayRevenue, week: weekRevenue, month: monthRevenue },
      orders: {
        total: revenueRows.length,
        pending: statusCounts['PENDING'] || 0,
        confirmed: statusCounts['CONFIRMED'] || 0,
        processing: statusCounts['PROCESSING'] || 0,
        ready: statusCounts['READY'] || 0,
        delivered: statusCounts['DELIVERED'] || 0,
        cancelled: statusCounts['CANCELLED'] || 0,
      },
      avgOrderValue: revenueRows.length > 0 ? allRevenue / revenueRows.length : 0,
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
        status: o.status as OrderStatus,
        createdAt: o.createdAt.toISOString(),
      })),
      salesByDay,
      alerts,
    };
  } catch (err) {
    console.error('Dashboard error:', err);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  if (!stats) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-xl font-bold text-stone-800 mb-6">Dashboard</h1>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          Tietokantayhteyttä ei löydy. Varmista DATABASE_URL ympäristömuuttuja.
        </div>
      </div>
    );
  }

  return <DashboardContent stats={stats} />;
}
