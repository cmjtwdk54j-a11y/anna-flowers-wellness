import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get('isActive');

    const codes = await prisma.promoCode.findMany({
      where: isActive !== null && isActive !== '' ? { isActive: isActive === 'true' } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(codes.map((c) => ({
      ...c,
      startsAt: c.startsAt?.toISOString() ?? null,
      expiresAt: c.expiresAt?.toISOString() ?? null,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })));
  } catch (err) {
    console.error('PromoCodes GET error:', err);
    return NextResponse.json({ error: 'Haku epäonnistui' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code, discountType, discountValue, minOrderAmount,
      startsAt, expiresAt, maxUses, maxUsesPerUser,
      applicableTo, categoryIds, productIds, isActive,
    } = body;

    if (!code || code.trim() === '') {
      return NextResponse.json({ error: 'Koodi ei voi olla tyhjä' }, { status: 400 });
    }
    if (!discountType || !['PERCENT', 'FIXED'].includes(discountType)) {
      return NextResponse.json({ error: 'Virheellinen alennustyyppi' }, { status: 400 });
    }
    if (discountValue === undefined || discountValue < 0) {
      return NextResponse.json({ error: 'Alennus ei voi olla negatiivinen' }, { status: 400 });
    }
    if (discountType === 'PERCENT' && discountValue > 100) {
      return NextResponse.json({ error: 'Prosenttialennus ei voi ylittää 100%' }, { status: 400 });
    }
    if (startsAt && expiresAt && new Date(startsAt) >= new Date(expiresAt)) {
      return NextResponse.json({ error: 'Päättymispäivä on ennen alkamispäivää' }, { status: 400 });
    }

    const existing = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase().trim() } });
    if (existing) return NextResponse.json({ error: 'Koodi on jo olemassa' }, { status: 409 });

    const promo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase().trim(),
        discountType,
        discountValue: parseFloat(discountValue),
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

    return NextResponse.json({ ...promo, createdAt: promo.createdAt.toISOString(), updatedAt: promo.updatedAt.toISOString() }, { status: 201 });
  } catch (err) {
    console.error('PromoCode POST error:', err);
    return NextResponse.json({ error: 'Luonti epäonnistui' }, { status: 500 });
  }
}
