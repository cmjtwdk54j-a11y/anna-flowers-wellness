export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import PromoCodeForm from '@/components/admin/PromoCodeForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
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
      <AdminPageHeader backHref="/admin/promo-codes" titleKey="editPromo" subtitle={promo.code} mono />
      <PromoCodeForm promo={promo} />
    </div>
  );
}
