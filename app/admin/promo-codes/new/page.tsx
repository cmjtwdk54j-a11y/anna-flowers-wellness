export const metadata = { title: 'Uusi promokoodi' };

import PromoCodeForm from '@/components/admin/PromoCodeForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function NewPromoCodePage() {
  return (
    <div className="p-6 lg:p-8 space-y-5">
      <AdminPageHeader backHref="/admin/promo-codes" titleKey="newPromo" subtitleKey="newPromoSub" />
      <PromoCodeForm />
    </div>
  );
}
