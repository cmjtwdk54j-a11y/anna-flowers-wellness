import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MASSAGE_CATEGORIES, MASSAGE_SERVICES } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.massageCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        services: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            name_fi: true,
            name_en: true,
            desc_fi: true,
            desc_en: true,
            duration: true,
            price: true,
          },
        },
      },
    });

    if (categories.length === 0) {
      return NextResponse.json(
        MASSAGE_CATEGORIES.map((cat) => ({
          id: cat.id,
          slug: cat.id,
          name_fi: cat.label,
          name_en: cat.label_en,
          services: MASSAGE_SERVICES
            .filter((s) => s.category === cat.id)
            .map((s) => ({
              id: s.id,
              name_fi: s.name_fi,
              name_en: s.name_en,
              desc_fi: s.desc_fi,
              desc_en: s.desc_en,
              duration: s.duration,
              price: s.price,
            })),
        }))
      );
    }

    return NextResponse.json(
      categories.map((cat) => ({
        ...cat,
        services: cat.services.map((s) => ({ ...s, price: Number(s.price) })),
      }))
    );
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
