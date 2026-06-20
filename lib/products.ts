import { prisma } from './prisma';
import type { Prisma } from '@prisma/client';

// Plain, serializable product shape passed from Server Components to Client
// Components. Prisma Decimal fields are converted to plain numbers here so they
// cross the server/client boundary cleanly.
export interface CatalogProduct {
  id: string;
  slug: string;
  name_fi: string;
  name_en: string;
  description_fi: string;
  description_en: string;
  composition_fi: string | null;
  composition_en: string | null;
  careInfo_fi: string | null;
  careInfo_en: string | null;
  priceSmall: number;
  priceLarge: number | null;
  imageUrl: string;
  imageUrls: string[];
  categorySlug: string;
  occasions: string[];
  color: string | null;
  flowerCount: number | null;
  heightCm: number | null;
  popularity: number;
  isFeatured: boolean;
  isFuneral: boolean;
  isWedding: boolean;
  createdAt: string;
}

type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>;

function serializeProduct(p: ProductWithCategory): CatalogProduct {
  return {
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
    priceLarge: p.priceLarge === null ? null : Number(p.priceLarge),
    imageUrl: p.imageUrl,
    imageUrls: p.imageUrls,
    categorySlug: p.category.slug,
    occasions: p.occasions,
    color: p.color,
    flowerCount: p.flowerCount,
    heightCm: p.heightCm,
    popularity: p.popularity,
    isFeatured: p.isFeatured,
    isFuneral: p.isFuneral,
    isWedding: p.isWedding,
    createdAt: p.createdAt.toISOString(),
  };
}

export async function getProducts(): Promise<CatalogProduct[]> {
  const products = await prisma.product.findMany({
    where: { inStock: true },
    include: { category: true },
    orderBy: [{ popularity: 'desc' }, { createdAt: 'desc' }],
  });
  return products.map(serializeProduct);
}

export async function getFeaturedProducts(limit = 4): Promise<CatalogProduct[]> {
  const products = await prisma.product.findMany({
    where: { inStock: true, isFeatured: true },
    include: { category: true },
    orderBy: [{ popularity: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  });
  return products.map(serializeProduct);
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  return product ? serializeProduct(product) : null;
}
