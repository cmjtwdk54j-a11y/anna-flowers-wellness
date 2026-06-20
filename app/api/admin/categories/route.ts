import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name_fi: c.name_fi,
      name_en: c.name_en,
      description_fi: c.description_fi,
      description_en: c.description_en,
      imageUrl: c.imageUrl,
      sortOrder: c.sortOrder,
      productCount: c._count.products,
      createdAt: c.createdAt.toISOString(),
    })));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Haku epäonnistui' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, name_fi, name_en, description_fi, description_en, imageUrl, sortOrder } = body;

    if (!slug || !name_fi || !name_en) {
      return NextResponse.json({ error: 'Slug, nimi FI ja EN ovat pakollisia' }, { status: 400 });
    }
    const existing = await prisma.productCategory.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ error: 'Slug on jo käytössä' }, { status: 409 });

    const category = await prisma.productCategory.create({
      data: {
        slug: slug.toLowerCase().trim(),
        name_fi, name_en,
        description_fi: description_fi || null,
        description_en: description_en || null,
        imageUrl: imageUrl || null,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });
    return NextResponse.json({ ...category, createdAt: category.createdAt.toISOString() }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Luonti epäonnistui' }, { status: 500 });
  }
}
