import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      code, discountType, discountValue, minOrderAmount,
      startsAt, expiresAt, maxUses, maxUsesPerUser,
      applicableTo, categoryIds, productIds, isActive,
    } = body;

    if (!code?.trim()) return NextResponse.json({ error: 'Koodi ei voi olla tyhjä' }, { status: 400 });
    if (discountValue < 0) return NextResponse.json({ error: 'Alennus ei voi olla negatiivinen' }, { status: 400 });
    if (discountType === 'PERCENT' && discountValue > 100) return NextResponse.json({ error: 'Prosenttialennus ei voi ylittää 100%' }, { status: 400 });

    const existing = await prisma.promoCode.findFirst({ where: { code: code.toUpperCase().trim(), NOT: { id } } });
    if (existing) return NextResponse.json({ error: 'Koodi on jo käytössä' }, { status: 409 });

    const updated = await prisma.promoCode.update({
      where: { id },
      data: {
        code: code.toUpperCase().trim(),
        discountType, discountValue: parseFloat(discountValue),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        maxUsesPerUser: maxUsesPerUser ? parseInt(maxUsesPerUser) : null,
        applicableTo: applicableTo || 'ALL',
        categoryIds: categoryIds || [],
        productIds: productIds || [],
        isActive: isActive !== false,
      },
    });
    return NextResponse.json({ ...updated, createdAt: updated.createdAt.toISOString(), updatedAt: updated.updatedAt.toISOString() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Päivitys epäonnistui' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.promoCode.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Poisto epäonnistui' }, { status: 500 });
  }
}
