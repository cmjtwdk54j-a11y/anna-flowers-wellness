import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';
import { calcDeliveryFee } from '@/lib/prices';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email';
import { ADDONS } from '@/lib/addons';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName, customerEmail, customerPhone,
      recipientName, recipientPhone, cardMessage,
      deliveryType, deliveryAddress, deliveryCity, deliveryNote,
      scheduledAt, paymentMethod, giftCardCode, giftCardDiscount,
      notes, items, addons: rawAddons,
    } = body;

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: 'Missing required customer fields' }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    // Server-side recalculation — ignore client-sent prices and names, read from DB
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

    // Validate addons server-side — only known ids and their prices
    const selectedAddonIds: string[] = Array.isArray(rawAddons) ? rawAddons.map(String) : [];
    const validatedAddons = selectedAddonIds
      .map((id) => ADDONS.find((a) => a.id === id))
      .filter((a): a is NonNullable<typeof a> => !!a);
    const addonsTotal = validatedAddons.reduce((sum, a) => sum + a.price, 0);

    const deliveryFee = calcDeliveryFee(deliveryType, deliveryCity || '');
    const discount = giftCardDiscount ? parseFloat(String(giftCardDiscount)) : 0;
    const total = Math.max(0, subtotal + addonsTotal + deliveryFee - discount);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName, customerEmail, customerPhone,
        recipientName: recipientName || null,
        recipientPhone: recipientPhone || null,
        cardMessage: cardMessage || null,
        deliveryType, deliveryAddress, deliveryCity, deliveryNote,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        addons: validatedAddons.length > 0 ? (validatedAddons as any) : undefined,
        paymentMethod,
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
      include: { items: true },
    });

    const emailData = {
      orderNumber: order.orderNumber,
      customerName, customerEmail, customerPhone,
      items: validatedItems.map((i) => ({
        name_fi: i.name_fi, size: i.size, quantity: i.quantity, price: i.price,
      })),
      deliveryType,
      deliveryAddress: deliveryAddress || undefined,
      deliveryCity: deliveryCity || undefined,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      subtotal, deliveryFee, total,
    };
    // For card payments the confirmation emails are sent by the Stripe webhook
    // once payment succeeds, so we skip them here to avoid confirming an unpaid
    // order. Other payment methods (settled manually) get emailed immediately.
    if (paymentMethod !== 'card') {
      await Promise.allSettled([
        sendOrderConfirmationEmail(emailData),
        sendAdminOrderNotification(emailData),
      ]);
    }

    return NextResponse.json({ order, orderNumber: order.orderNumber });
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Query parameter "email" is required' },
      { status: 400 }
    );
  }

  try {
    const orders = await prisma.order.findMany({
      where: { customerEmail: email },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
