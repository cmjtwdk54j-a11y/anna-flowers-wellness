import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: { select: { name_fi: true } }, _count: { select: { orderItems: true } } },
    });
    if (!product) return NextResponse.json({ error: 'Ei löydy' }, { status: 404 });
    return NextResponse.json({
      ...product,
      priceSmall: Number(product.priceSmall),
      priceLarge: product.priceLarge !== null ? Number(product.priceLarge) : null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Virhe' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      slug, name_fi, name_en, description_fi, description_en,
      composition_fi, composition_en, careInfo_fi, careInfo_en,
      priceSmall, priceLarge, imageUrl, imageUrls, categoryId,
      occasions, color, flowerCount, heightCm, popularity,
      inStock, isFeatured, isFuneral, isWedding,
    } = body;

    if (!slug || !name_fi || !name_en || !description_fi || !description_en || !imageUrl || !categoryId || !priceSmall) {
      return NextResponse.json({ error: 'Pakolliset kentät puuttuvat' }, { status: 400 });
    }

    const existing = await prisma.product.findFirst({ where: { slug, NOT: { id } } });
    if (existing) return NextResponse.json({ error: 'Slug on jo käytössä' }, { status: 409 });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        slug,
        name_fi, name_en, description_fi, description_en,
        composition_fi: composition_fi || null,
        composition_en: composition_en || null,
        careInfo_fi: careInfo_fi || null,
        careInfo_en: careInfo_en || null,
        priceSmall: parseFloat(priceSmall),
        priceLarge: priceLarge ? parseFloat(priceLarge) : null,
        imageUrl, imageUrls: imageUrls || [], categoryId,
        occasions: occasions || [],
        color: color || null,
        flowerCount: flowerCount ? parseInt(flowerCount) : null,
        heightCm: heightCm ? parseInt(heightCm) : null,
        popularity: popularity ? parseInt(popularity) : 0,
        inStock: inStock !== false,
        isFeatured: isFeatured === true,
        isFuneral: isFuneral === true,
        isWedding: isWedding === true,
      },
    });
    return NextResponse.json({ ...updated, priceSmall: Number(updated.priceSmall), priceLarge: updated.priceLarge !== null ? Number(updated.priceLarge) : null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Päivitys epäonnistui' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Poisto epäonnistui' }, { status: 500 });
  }
}
