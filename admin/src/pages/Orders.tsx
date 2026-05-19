import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { ordersApi } from '@/api/orders.api';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { OrderStatus } from '@/types';
import { toast } from '@/store/toast.store';

const STATUSES: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function Orders() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['orders', statusFilter, page],
    queryFn: () => ordersApi.list({ status: statusFilter === 'all' ? undefined : statusFilter, page, limit: 12 }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => ordersApi.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); toast.success('Status updated'); },
    onError: () => toast.error('Update failed'),
  });

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 12);

  return (
    <AdminLayout title="Orders">
      <div className="page-header">
        <div className="page-header-left"><h1>Orders</h1><p>{total} orders total</p></div>
      </div>

      <div className="filter-tabs mb-4">
        {STATUSES.map((s) => (
          <button key={s.value} className={`filter-tab${statusFilter === s.value ? ' active' : ''}`}
            onClick={() => { setStatusFilter(s.value); setPage(1); }}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th><th></th></tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : data?.data?.map((o) => (
                <tr key={o.id}>
                  <td className="td-primary">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="td-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="td-muted">{o.order_items?.length ?? '—'}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent)' }}>${o.total_amount.toFixed(2)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    <select className="input select" style={{ padding: '6px 28px 6px 10px', fontSize: 13, width: 'auto', minWidth: 130 }}
                      value={o.status}
                      onChange={(e) => updateStatus.mutate({ id: o.id, status: e.target.value as OrderStatus })}>
                      {STATUSES.filter(s => s.value !== 'all').map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/orders/${o.id}`)}>View</button>
                  </td>
                </tr>
              ))}
              {!isLoading && !data?.data.length && (
                <tr><td colSpan={7}><div className="empty-state"><ShoppingCart size={40} /><h3>No orders</h3></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between" style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
            <span className="text-muted">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
              <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
