import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName, customerEmail, customerPhone,
      deliveryType, deliveryAddress, deliveryCity, deliveryNote,
      scheduledAt, paymentMethod, giftCardCode, giftCardDiscount,
      subtotal, deliveryFee, total, notes, items,
    } = body;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerEmail,
        customerPhone,
        deliveryType,
        deliveryAddress,
        deliveryCity,
        deliveryNote,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        paymentMethod,
        giftCardCode,
        giftCardDiscount: giftCardDiscount ? parseFloat(giftCardDiscount) : null,
        subtotal: parseFloat(subtotal),
        deliveryFee: parseFloat(deliveryFee || 0),
        total: parseFloat(total),
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: parseFloat(item.price),
            name_fi: item.name_fi,
            name_en: item.name_en,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ order, orderNumber: order.orderNumber });
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  try {
    const orders = await prisma.order.findMany({
      where: email ? { customerEmail: email } : {},
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
