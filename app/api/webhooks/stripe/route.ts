import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
          include: { items: true },
        });

        const emailData = {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          items: order.items.map((i) => ({
            name_fi: i.name_fi,
            size: i.size,
            quantity: i.quantity,
            price: Number(i.price),
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
      } catch (err) {
        console.error('Failed to update order or send emails after payment:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
