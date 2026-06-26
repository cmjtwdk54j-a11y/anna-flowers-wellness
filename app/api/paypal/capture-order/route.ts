import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { capturePayPalOrder } from '@/lib/paypal';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { paypalOrderId, orderId } = await request.json();
    if (!paypalOrderId || !orderId) {
      return NextResponse.json({ error: 'paypalOrderId and orderId required' }, { status: 400 });
    }

    const capture = await capturePayPalOrder(String(paypalOrderId));

    if (capture.status === 'COMPLETED') {
      const order = await prisma.order.update({
        where: { id: String(orderId) },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
        include: { items: true },
      });

      const emailData = {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        items: order.items.map((i) => ({
          name_fi: i.name_fi, size: i.size, quantity: i.quantity, price: Number(i.price),
        })),
        deliveryType: order.deliveryType,
        deliveryAddress: order.deliveryAddress ?? undefined,
        deliveryCity: order.deliveryCity ?? undefined,
        scheduledAt: order.scheduledAt,
        subtotal: Number(order.subtotal),
        deliveryFee: Number(order.deliveryFee),
        total: Number(order.total),
      };
      await Promise.allSettled([
        sendOrderConfirmationEmail(emailData),
        sendAdminOrderNotification(emailData),
      ]);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, status: capture.status });
  } catch (err) {
    console.error('PayPal capture error:', err);
    return NextResponse.json({ error: 'Failed to capture payment' }, { status: 500 });
  }
}
