import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'DELIVERED', 'CANCELLED'];

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ error: 'Ei löydy' }, { status: 404 });
    return NextResponse.json({
      ...order,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      total: Number(order.total),
      giftCardDiscount: order.giftCardDiscount !== null ? Number(order.giftCardDiscount) : null,
      scheduledAt: order.scheduledAt?.toISOString() ?? null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((i) => ({
        ...i,
        price: Number(i.price),
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Virhe' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Virheellinen tila' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ ok: true, status: updated.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Päivitys epäonnistui' }, { status: 500 });
  }
}
