import type { OrderStatus } from '@/lib/admin/types';
import { cn } from '@/lib/utils';
import { useAdminLang } from '@/components/admin/AdminLangContext';

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  CONFIRMED: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  PROCESSING: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  READY: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  DELIVERED: 'bg-stone-100 text-stone-600 ring-stone-500/20',
  CANCELLED: 'bg-red-50 text-red-700 ring-red-600/20',
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useAdminLang();
  const label = t.orderStatus[status] ?? status;
  const className = STATUS_STYLES[status] ?? 'bg-stone-100 text-stone-600 ring-stone-500/20';
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', className)}>
      {label}
    </span>
  );
}

export { STATUS_STYLES };
