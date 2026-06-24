import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { capturePayPalOrder } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const { paypalOrderId, orderId } = await request.json();
    if (!paypalOrderId || !orderId) {
      return NextResponse.json({ error: 'paypalOrderId and orderId required' }, { status: 400 });
    }

    const capture = await capturePayPalOrder(String(paypalOrderId));

    if (capture.status === 'COMPLETED') {
      await prisma.order.update({
        where: { id: String(orderId) },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, status: capture.status });
  } catch (err) {
    console.error('PayPal capture error:', err);
    return NextResponse.json({ error: 'Failed to capture payment' }, { status: 500 });
  }
}
