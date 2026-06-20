import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession } from '@/lib/stripe';
import { generateOrderNumber } from '@/lib/utils';
import { calcDeliveryFee } from '@/lib/prices';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName, customerEmail, customerPhone,
      deliveryType, deliveryAddress, deliveryCity, deliveryNote,
      scheduledAt, giftCardCode, giftCardDiscount,
      notes, items,
    } = body;

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: 'Missing required customer fields' }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    // Server-side recalculation — never trust client-sent prices or names
    let subtotal = 0;
    const validatedItems: Array<{
      productId: string; quantity: number; size: 'SMALL' | 'LARGE';
      price: number; name_fi: string; name_en: string;
    }> = [];

    for (const item of items) {
      const size: 'SMALL' | 'LARGE' = item.size === 'LARGE' ? 'LARGE' : 'SMALL';
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 0));
      const product = await prisma.product.findUnique({
        where: { id: String(item.productId) },
        select: { name_fi: true, name_en: true, priceSmall: true, priceLarge: true },
      });
      if (!product) {
        return NextResponse.json({ error: `Unknown product: ${item.productId}` }, { status: 400 });
      }
      const rawPrice = size === 'LARGE' ? product.priceLarge : product.priceSmall;
      if (rawPrice === null) {
        return NextResponse.json({ error: `Size ${size} unavailable for product ${item.productId}` }, { status: 400 });
      }
      const price = Number(rawPrice);
      subtotal += price * quantity;
      validatedItems.push({
        productId: String(item.productId),
        quantity,
        size,
        price,
        name_fi: product.name_fi,
        name_en: product.name_en,
      });
    }

    const deliveryFee = calcDeliveryFee(deliveryType, deliveryCity || '');
    const discount = giftCardDiscount ? parseFloat(String(giftCardDiscount)) : 0;
    const total = Math.max(0, subtotal + deliveryFee - discount);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName, customerEmail, customerPhone,
        deliveryType, deliveryAddress, deliveryCity, deliveryNote,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        paymentMethod: 'card',
        giftCardCode: giftCardCode || null,
        giftCardDiscount: discount || null,
        subtotal, deliveryFee, total,
        notes,
        items: {
          create: validatedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
            name_fi: item.name_fi,
            name_en: item.name_en,
          })),
        },
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await createCheckoutSession({
      items: validatedItems.map((item) => ({
        productId: item.productId,
        name: item.name_fi,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
      })),
      deliveryFee,
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
