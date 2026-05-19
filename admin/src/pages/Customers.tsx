import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Users } from 'lucide-react';
import { customersApi } from '@/api/customers.api';
import { AdminLayout } from '@/components/layout/AdminLayout';

export default function Customers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['customers', search, page],
    queryFn: () => customersApi.list({ search, page, limit: 15 }),
  });

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 15);

  return (
    <AdminLayout title="Customers">
      <div className="page-header">
        <div className="page-header-left"><h1>Customers</h1><p>{total} registered users</p></div>
        <div className="page-controls">
          <div className="input-icon-wrap" style={{ width: 240 }}>
            <Search size={16} />
            <input className="input" placeholder="Search customers..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th></tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : data?.data?.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'var(--primary)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0
                      }}>{u.name?.[0]?.toUpperCase() ?? '?'}</div>
                      <span className="td-primary">{u.name}</span>
                    </div>
                  </td>
                  <td className="td-muted">{u.email}</td>
                  <td><span className={`badge badge-${u.role === 'admin' ? 'admin' : 'customer'}`}>{u.role}</span></td>
                </tr>
              ))}
              {!isLoading && !data?.data.length && (
                <tr><td colSpan={3}><div className="empty-state"><Users size={40} /><h3>No customers found</h3></div></td></tr>
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
