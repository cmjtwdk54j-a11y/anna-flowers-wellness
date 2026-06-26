import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: String(orderId) } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.paymentStatus === 'PAID') return NextResponse.json({ error: 'Already paid' }, { status: 409 });

    const paypalOrder = await createPayPalOrder(Number(order.total));

    await prisma.order.update({
      where: { id: order.id },
      data: { paypalOrderId: paypalOrder.id },
    });

    return NextResponse.json({ paypalOrderId: paypalOrder.id });
  } catch (err) {
    console.error('PayPal create-order error:', err);
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
  }
}
