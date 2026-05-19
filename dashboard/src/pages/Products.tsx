import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { productsApi } from '@/api/products.api';
import { categoriesApi } from '@/api/categories.api';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/store/toast.store';
import { Product } from '@/types';

const EMPTY: Partial<Product> = { name: '', description: '', price: 0, image_url: '', category_id: '' };

export default function Products() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Product>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['products', search, page],
    queryFn: () => productsApi.list({ search, page, limit: 10 }),
  });

  const { data: cats } = useQuery({ queryKey: ['categories'], queryFn: categoriesApi.list });

  const createMut = useMutation({
    mutationFn: (p: Partial<Product>) => editing ? productsApi.update(editing, p) : productsApi.create(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success(editing ? 'Product updated' : 'Product created');
      setModalOpen(false);
      setForm(EMPTY);
      setEditing(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Failed'),
  });

  const deleteMut = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); toast.success('Product deleted'); setDeleteId(null); },
    onError: () => toast.error('Delete failed'),
  });

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModalOpen(true); };
  const openEdit = (p: Product) => { setForm({ ...p, category_id: p.category_id ?? '' }); setEditing(p.id); setModalOpen(true); };
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <AdminLayout title="Products">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Products</h1>
          <p>{total} products total</p>
        </div>
        <div className="page-controls">
          <div className="input-icon-wrap" style={{ width: 240 }}>
            <Search size={16} />
            <input className="input" placeholder="Search products..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> New Product
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : data?.data?.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="product-thumb" />
                        : <div className="product-thumb-placeholder"><Package size={18} /></div>
                      }
                      <div>
                        <div className="td-primary">{p.name}</div>
                        <div className="td-muted" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-customer">{p.categories?.name ?? '—'}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--accent)' }}>${p.price.toFixed(2)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(p)} title="Edit"><Edit2 size={15} /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteId(p.id)} title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && data?.data.length === 0 && (
                <tr><td colSpan={4}><div className="empty-state"><Package size={48} /><h3>No products found</h3></div></td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal
          title={editing ? 'Edit Product' : 'New Product'}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => createMut.mutate(form)} disabled={createMut.isPending}>
                {createMut.isPending ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Name *</label>
              <input className="input" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-grid form-grid-2">
              <div className="input-group">
                <label className="input-label">Price *</label>
                <input className="input" type="number" step="0.01" min="0" value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: +e.target.value })} />
              </div>
              <div className="input-group">
                <label className="input-label">Category</label>
                <select className="input select" value={form.category_id ?? ''} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">— None —</option>
                  {cats?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Image URL</label>
              <input className="input" value={form.image_url ?? ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea className="input" rows={3} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <Modal title="Delete Product" onClose={() => setDeleteId(null)} maxWidth={400}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => deleteMut.mutate(deleteId)} disabled={deleteMut.isPending}>
                {deleteMut.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </>
          }
        >
          <p style={{ color: 'var(--text-2)' }}>Are you sure you want to delete this product? This action cannot be undone.</p>
        </Modal>
      )}
    </AdminLayout>
  );
}
