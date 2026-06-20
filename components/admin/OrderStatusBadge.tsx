import type { OrderStatus } from '@/lib/admin/types';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: 'Uusi', className: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  CONFIRMED: { label: 'Vahvistettu', className: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  PROCESSING: { label: 'Kerätään', className: 'bg-purple-50 text-purple-700 ring-purple-600/20' },
  READY: { label: 'Valmis', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  DELIVERED: { label: 'Toimitettu', className: 'bg-stone-100 text-stone-600 ring-stone-500/20' },
  CANCELLED: { label: 'Peruutettu', className: 'bg-red-50 text-red-700 ring-red-600/20' },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'bg-stone-100 text-stone-600 ring-stone-500/20' };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset', config.className)}>
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };
