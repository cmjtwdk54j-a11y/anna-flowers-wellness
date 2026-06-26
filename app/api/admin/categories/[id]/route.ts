import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { slug, name_fi, name_en, description_fi, description_en, imageUrl, icon, isVisible, sortOrder } = body;

    if (!slug || !name_fi || !name_en) {
      return NextResponse.json({ error: 'Slug, nimi FI ja EN ovat pakollisia' }, { status: 400 });
    }
    const existing = await prisma.productCategory.findFirst({ where: { slug, NOT: { id } } });
    if (existing) return NextResponse.json({ error: 'Slug on jo käytössä' }, { status: 409 });

    const updated = await prisma.productCategory.update({
      where: { id },
      data: {
        slug: slug.toLowerCase().trim(),
        name_fi, name_en,
        description_fi: description_fi || null,
        description_en: description_en || null,
        imageUrl: imageUrl || null,
        icon: icon || null,
        isVisible: isVisible ?? true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });
    return NextResponse.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Päivitys epäonnistui' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json({ error: `Kategoriaan kuuluu ${productCount} tuotetta. Siirrä tuotteet ensin.` }, { status: 409 });
    }
    await prisma.productCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Poisto epäonnistui' }, { status: 500 });
  }
}
