import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30d';

    const now = new Date();
    let startDate: Date;
    let prevStartDate: Date;

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 1);
    } else if (period === '7d') {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 7);
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    } else {
      // 30d default
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
      prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - 30);
    }

    const [currentOrders, previousOrders, cancelledCount, topItems] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: startDate }, paymentStatus: 'PAID' },
        include: { items: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: prevStartDate, lt: startDate }, paymentStatus: 'PAID' },
      }),
      prisma.order.count({ where: { createdAt: { gte: startDate }, status: 'CANCELLED' } }),
      prisma.orderItem.groupBy({
        by: ['productId', 'name_fi'],
        where: { order: { createdAt: { gte: startDate }, paymentStatus: 'PAID' } },
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      }),
    ]);

    // Group by day
    const dayMap: Record<string, { revenue: number; orders: number }> = {};
    currentOrders.forEach((o) => {
      const day = o.createdAt.toISOString().slice(0, 10);
      if (!dayMap[day]) dayMap[day] = { revenue: 0, orders: 0 };
      dayMap[day].revenue += Number(o.total);
      dayMap[day].orders += 1;
    });

    const salesByDay = Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({
        date,
        revenue: v.revenue,
        orders: v.orders,
        avgOrder: v.orders > 0 ? v.revenue / v.orders : 0,
      }));

    // Top categories (via product join)
    const categoryMap: Record<string, { name: string; count: number; revenue: number }> = {};
    for (const o of currentOrders) {
      for (const item of o.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { category: { select: { name_fi: true } } },
        }).catch(() => null);
        if (!product) continue;
        const cat = product.category.name_fi;
        if (!categoryMap[cat]) categoryMap[cat] = { name: cat, count: 0, revenue: 0 };
        categoryMap[cat].count += item.quantity;
        categoryMap[cat].revenue += Number(item.price) * item.quantity;
      }
    }

    const currentRevenue = currentOrders.reduce((a, o) => a + Number(o.total), 0);
    const previousRevenue = previousOrders.reduce((a, o) => a + Number(o.total), 0);

    return NextResponse.json({
      salesByDay,
      topProducts: topItems.map((t) => ({
        id: t.productId,
        name: t.name_fi,
        count: Number(t._sum.quantity) || 0,
        revenue: Number(t._sum.price) || 0,
      })),
      topCategories: Object.values(categoryMap).sort((a, b) => b.revenue - a.revenue).slice(0, 8),
      currentRevenue,
      previousRevenue,
      cancelledCount,
      totalOrders: currentOrders.length,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return NextResponse.json({ error: 'Analytiikan haku epäonnistui' }, { status: 500 });
  }
}
