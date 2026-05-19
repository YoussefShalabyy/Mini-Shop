import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ShoppingBag, Package } from 'lucide-react';
import { ordersApi } from '@/api/orders.api';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.get(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <AdminLayout title="Order Detail"><div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div></AdminLayout>;
  }

  if (!order) {
    return <AdminLayout title="Order Detail"><div style={{ padding: 48, textAlign: 'center', color: 'var(--error)' }}>Order not found</div></AdminLayout>;
  }

  return (
    <AdminLayout title="Order Detail">
      <div className="page-header">
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate('/orders')}><ArrowLeft size={18} /></button>
          <div>
            <h1>Order #{order.id.slice(0, 8).toUpperCase()}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Clock size={14} color="var(--text-muted)" />
              <p>{new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="form-grid form-grid-2">
        {/* Customer Info */}
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)22', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              👤
            </span>
            Customer Details
          </h3>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div style={{ color: 'var(--text)', fontWeight: 500 }}>{order.user_email || '—'}</div>
          </div>
          <div className="input-group" style={{ marginTop: 12 }}>
            <label className="input-label">User ID</label>
            <code style={{ background: 'var(--surface-2)', padding: '4px 8px', borderRadius: 6, fontSize: 13, color: 'var(--text-muted)' }}>{order.user_id}</code>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)22', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={16} />
            </span>
            Summary
          </h3>
          <div className="flex justify-between mb-4">
            <span className="text-muted">Total Items</span>
            <span style={{ fontWeight: 600 }}>{order.order_items?.reduce((s, i) => s + i.quantity, 0) ?? 0}</span>
          </div>
          <div className="flex justify-between" style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>Total Amount</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>${order.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <h3 style={{ fontSize: 16, marginTop: 32, marginBottom: 16, fontWeight: 600 }}>Ordered Items</h3>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead>
            <tbody>
              {order.order_items?.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {item.products?.image_url
                        ? <img src={item.products.image_url} alt="Product" className="product-thumb" />
                        : <div className="product-thumb-placeholder"><Package size={16} /></div>
                      }
                      <span className="td-primary">{item.products?.name ?? 'Unknown Product'}</span>
                    </div>
                  </td>
                  <td className="td-muted">${item.unit_price.toFixed(2)}</td>
                  <td style={{ fontWeight: 600 }}>× {item.quantity}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>${(item.unit_price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              {!order.order_items?.length && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
