import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        deliveryType: o.deliveryType,
        deliveryAddress: o.deliveryAddress,
        deliveryCity: o.deliveryCity,
        deliveryNote: o.deliveryNote,
        scheduledAt: o.scheduledAt?.toISOString() ?? null,
        subtotal: Number(o.subtotal),
        deliveryFee: Number(o.deliveryFee),
        total: Number(o.total),
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        giftCardCode: o.giftCardCode,
        giftCardDiscount: o.giftCardDiscount !== null ? Number(o.giftCardDiscount) : null,
        notes: o.notes,
        items: o.items.map((i) => ({
          id: i.id,
          productId: i.productId,
          name_fi: i.name_fi,
          name_en: i.name_en,
          size: i.size,
          quantity: i.quantity,
          price: Number(i.price),
        })),
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Orders GET error:', err);
    return NextResponse.json({ error: 'Haku epäonnistui' }, { status: 500 });
  }
}
