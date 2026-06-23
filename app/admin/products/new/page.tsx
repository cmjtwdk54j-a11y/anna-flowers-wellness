export const metadata = { title: 'Uusi tuote' };
export const dynamic = 'force-dynamic';

import ProductForm from '@/components/admin/ProductForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { prisma } from '@/lib/prisma';

async function getCategories() {
  try {
    return await prisma.productCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  } catch {
    return [];
  }
}

export default async function NewProductPage() {
  const rawCategories = await getCategories();
  const categories = rawCategories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name_fi: c.name_fi,
    name_en: c.name_en,
    description_fi: c.description_fi,
    description_en: c.description_en,
    imageUrl: c.imageUrl,
    sortOrder: c.sortOrder,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <AdminPageHeader backHref="/admin/products" titleKey="newProduct" subtitleKey="newProductSub" />
      <ProductForm categories={categories} />
    </div>
  );
}
