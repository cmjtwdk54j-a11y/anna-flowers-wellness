export const metadata = { title: 'Uusi promokoodi' };

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PromoCodeForm from '@/components/admin/PromoCodeForm';

export default function NewPromoCodePage() {
  return (
    <div className="p-6 lg:p-8 space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/promo-codes" className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-stone-800">Uusi promokoodi</h1>
          <p className="text-sm text-stone-400">Luo uusi alennuskoodi asiakkaille</p>
        </div>
      </div>
      <PromoCodeForm />
    </div>
  );
}
