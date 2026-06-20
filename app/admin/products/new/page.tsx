export const metadata = { title: 'Uusi tuote' };
export const dynamic = 'force-dynamic';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';
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
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-stone-800">Uusi tuote</h1>
          <p className="text-sm text-stone-400">Lisää uusi tuote valikoimaan</p>
        </div>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
