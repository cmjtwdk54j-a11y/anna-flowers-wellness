export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { prisma } from '@/lib/prisma';
import type { AdminProduct } from '@/lib/admin/types';

async function getData(id: string) {
  try {
    const [product, rawCategories] = await Promise.all([
      prisma.product.findUnique({ where: { id }, include: { category: true } }),
      prisma.productCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);
    return { product, rawCategories };
  } catch {
    return { product: null, rawCategories: [] };
  }
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { product, rawCategories } = await getData(id);

  if (!product) notFound();

  const adminProduct: AdminProduct = {
    id: product.id,
    slug: product.slug,
    name_fi: product.name_fi,
    name_en: product.name_en,
    description_fi: product.description_fi,
    description_en: product.description_en,
    composition_fi: product.composition_fi,
    composition_en: product.composition_en,
    careInfo_fi: product.careInfo_fi,
    careInfo_en: product.careInfo_en,
    priceSmall: Number(product.priceSmall),
    priceLarge: product.priceLarge !== null ? Number(product.priceLarge) : null,
    imageUrl: product.imageUrl,
    imageUrls: product.imageUrls,
    categoryId: product.categoryId,
    categoryName: product.category.name_fi,
    occasions: product.occasions,
    color: product.color,
    flowerCount: product.flowerCount,
    heightCm: product.heightCm,
    popularity: product.popularity,
    inStock: product.inStock,
    isFeatured: product.isFeatured,
    isFuneral: product.isFuneral,
    isWedding: product.isWedding,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };

  const categories = rawCategories.map((c) => ({
    id: c.id, slug: c.slug, name_fi: c.name_fi, name_en: c.name_en,
    description_fi: c.description_fi, description_en: c.description_en,
    imageUrl: c.imageUrl, sortOrder: c.sortOrder, createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <AdminPageHeader backHref="/admin/products" titleKey="editProduct" subtitle={product.name_fi} />
      <ProductForm product={adminProduct} categories={categories} />
    </div>
  );
}
