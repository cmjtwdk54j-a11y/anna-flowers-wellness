export const dynamic = 'force-dynamic';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PromoCodeForm from '@/components/admin/PromoCodeForm';
import { prisma } from '@/lib/prisma';
import type { AdminPromoCode } from '@/lib/admin/types';

export default async function EditPromoCodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let promo: AdminPromoCode | null = null;
  try {
    const raw = await prisma.promoCode.findUnique({ where: { id } });
    if (!raw) notFound();
    promo = {
      ...raw,
      discountType: raw.discountType as 'PERCENT' | 'FIXED',
      applicableTo: raw.applicableTo as 'ALL' | 'CATEGORIES' | 'PRODUCTS',
      startsAt: raw.startsAt?.toISOString() ?? null,
      expiresAt: raw.expiresAt?.toISOString() ?? null,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
    };
  } catch {
    notFound();
  }

  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/promo-codes" className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-stone-800">Muokkaa promokoodia</h1>
          <p className="text-sm text-stone-400 font-mono">{promo.code}</p>
        </div>
      </div>
      <PromoCodeForm promo={promo} />
    </div>
  );
}
