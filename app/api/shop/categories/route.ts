import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      where: { isVisible: true },
      include: {
        subcategories: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { products: { where: { inStock: true } } } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(
      categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name_fi: c.name_fi,
        name_en: c.name_en,
        icon: c.icon,
        productCount: c._count.products,
        subcategories: c.subcategories.map((s) => ({
          id: s.id,
          name_fi: s.name_fi,
          name_en: s.name_en,
          sortOrder: s.sortOrder,
        })),
      }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
