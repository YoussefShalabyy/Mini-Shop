import { OrderStatus } from '@/types';
import { Clock, Settings, Truck, CheckCircle, XCircle } from 'lucide-react';

const CONFIG: Record<OrderStatus, { label: string; icon: React.ReactNode }> = {
  pending:    { label: 'Pending',    icon: <Clock      size={12} /> },
  processing: { label: 'Processing', icon: <Settings   size={12} /> },
  shipped:    { label: 'Shipped',    icon: <Truck      size={12} /> },
  delivered:  { label: 'Delivered',  icon: <CheckCircle size={12} /> },
  cancelled:  { label: 'Cancelled',  icon: <XCircle    size={12} /> },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, icon } = CONFIG[status] ?? { label: status, icon: null };
  return (
    <span className={`badge badge-${status}`}>
      {icon}{label}
    </span>
  );
}
