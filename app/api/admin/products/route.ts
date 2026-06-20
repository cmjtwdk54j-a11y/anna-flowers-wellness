import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const inStock = searchParams.get('inStock');

    const products = await prisma.product.findMany({
      where: {
        ...(search ? {
          OR: [
            { name_fi: { contains: search, mode: 'insensitive' } },
            { name_en: { contains: search, mode: 'insensitive' } },
          ],
        } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(inStock !== null && inStock !== '' ? { inStock: inStock === 'true' } : {}),
      },
      include: {
        category: { select: { id: true, name_fi: true, slug: true } },
        _count: { select: { orderItems: true } },
      },
      orderBy: [{ popularity: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name_fi: p.name_fi,
      name_en: p.name_en,
      description_fi: p.description_fi,
      description_en: p.description_en,
      composition_fi: p.composition_fi,
      composition_en: p.composition_en,
      careInfo_fi: p.careInfo_fi,
      careInfo_en: p.careInfo_en,
      priceSmall: Number(p.priceSmall),
      priceLarge: p.priceLarge !== null ? Number(p.priceLarge) : null,
      imageUrl: p.imageUrl,
      imageUrls: p.imageUrls,
      categoryId: p.categoryId,
      categoryName: p.category.name_fi,
      occasions: p.occasions,
      color: p.color,
      flowerCount: p.flowerCount,
      heightCm: p.heightCm,
      popularity: p.popularity,
      inStock: p.inStock,
      isFeatured: p.isFeatured,
      isFuneral: p.isFuneral,
      isWedding: p.isWedding,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      _count: p._count,
    })));
  } catch (err) {
    console.error('Products GET error:', err);
    return NextResponse.json({ error: 'Haku epäonnistui' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug on jo käytössä' }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        slug,
        name_fi,
        name_en,
        description_fi,
        description_en,
        composition_fi: composition_fi || null,
        composition_en: composition_en || null,
        careInfo_fi: careInfo_fi || null,
        careInfo_en: careInfo_en || null,
        priceSmall: parseFloat(priceSmall),
        priceLarge: priceLarge ? parseFloat(priceLarge) : null,
        imageUrl,
        imageUrls: imageUrls || [],
        categoryId,
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
      include: { category: { select: { name_fi: true } } },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error('Product POST error:', err);
    return NextResponse.json({ error: 'Luonti epäonnistui' }, { status: 500 });
  }
}
