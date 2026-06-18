import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession } from '@/lib/stripe';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName, customerEmail, customerPhone,
      deliveryType, deliveryAddress, deliveryCity, deliveryNote,
      scheduledAt, giftCardCode, giftCardDiscount,
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
        paymentMethod: 'card',
        giftCardCode: giftCardCode || null,
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
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await createCheckoutSession({
      items: items.map((item: any) => ({
        productId: item.productId,
        name: item.name_fi,
        price: parseFloat(item.price),
        quantity: item.quantity,
        size: item.size,
      })),
      deliveryFee: parseFloat(deliveryFee || 0),
      customerEmail,
      orderId: order.id,
      successUrl: `${appUrl}/checkout/success`,
      cancelUrl: `${appUrl}/checkout`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout failed:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
