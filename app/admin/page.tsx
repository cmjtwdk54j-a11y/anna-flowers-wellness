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
