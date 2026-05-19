import { useQuery } from '@tanstack/react-query';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp } from 'lucide-react';
import { ordersApi } from '@/api/orders.api';
import { productsApi } from '@/api/products.api';
import { customersApi } from '@/api/customers.api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Order, OrderStatus } from '@/types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    '#FF9800',
  processing: '#2196F3',
  shipped:    '#6C63FF',
  delivered:  '#4CAF50',
  cancelled:  '#F44336',
};

function buildRevenueChart(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    const day = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    map[day] = (map[day] ?? 0) + o.total_amount;
  });
  return Object.entries(map).slice(-14).map(([date, revenue]) => ({ date, revenue: +revenue.toFixed(2) }));
}

function buildStatusChart(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => { map[o.status] = (map[o.status] ?? 0) + 1; });
  return Object.entries(map).map(([status, count]) => ({ status, count }));
}

export default function Dashboard() {
  const { data: ordersData } = useQuery({ queryKey: ['orders-all'], queryFn: () => ordersApi.list({ limit: 200 }) });
  const { data: productsData } = useQuery({ queryKey: ['products-count'], queryFn: () => productsApi.list({ limit: 1 }) });
  const { data: customersData } = useQuery({ queryKey: ['customers-count'], queryFn: () => customersApi.list({ limit: 1 }) });

  const orders = ordersData?.data ?? [];
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total_amount, 0);
  const revenueChart = buildRevenueChart(orders);
  const statusChart = buildStatusChart(orders);
  const recent = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign size={22} />, color: '#43C6AC', bg: '#43C6AC15' },
    { label: 'Total Orders',  value: ordersData?.total ?? 0,         icon: <ShoppingCart size={22} />, color: '#6C63FF', bg: '#6C63FF15' },
    { label: 'Products',      value: productsData?.total ?? 0,       icon: <Package size={22} />,      color: '#FF9800', bg: '#FF980015' },
    { label: 'Customers',     value: customersData?.total ?? 0,      icon: <Users size={22} />,         color: '#2196F3', bg: '#2196F315' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} color="var(--primary)" />
            <span style={{ fontWeight: 600 }}>Revenue (last 14 days)</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }} labelStyle={{ color: 'var(--text)' }} itemStyle={{ color: 'var(--accent)' }} />
              <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Orders by Status</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusChart} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                {statusChart.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status as OrderStatus] ?? '#888'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }} />
              <Legend formatter={(value) => <span style={{ color: 'var(--text-2)', fontSize: 12 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: 16 }}>Recent Orders</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id}>
                  <td className="td-primary">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="td-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="td-muted">{o.order_items?.length ?? '—'}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent)' }}>${o.total_amount.toFixed(2)}</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
