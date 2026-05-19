import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Tag } from 'lucide-react';
import { categoriesApi } from '@/api/categories.api';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/store/toast.store';

export default function Categories() {
  const qc = useQueryClient();
  const [newName, setNewName] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categories, isLoading } = useQuery({ queryKey: ['categories'], queryFn: categoriesApi.list });

  const createMut = useMutation({
    mutationFn: () => categoriesApi.create(newName.trim()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('Category created'); setModalOpen(false); setNewName(''); },
    onError: () => toast.error('Failed to create'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); toast.success('Category deleted'); setDeleteId(null); },
    onError: () => toast.error('Delete failed'),
  });

  return (
    <AdminLayout title="Categories">
      <div className="page-header">
        <div className="page-header-left"><h1>Categories</h1><p>{categories?.length ?? 0} categories</p></div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}><Plus size={16} /> New Category</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Name</th><th>Slug</th><th></th></tr></thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : categories?.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Tag size={16} color="var(--primary)" />
                      <span className="td-primary">{c.name}</span>
                    </div>
                  </td>
                  <td><code style={{ background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 6, fontSize: 13, color: 'var(--text-muted)' }}>{c.slug}</code></td>
                  <td>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => setDeleteId(c.id)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {!isLoading && !categories?.length && (
                <tr><td colSpan={3}><div className="empty-state"><Tag size={40} /><h3>No categories yet</h3></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal title="New Category" onClose={() => setModalOpen(false)} maxWidth={400}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!newName.trim() || createMut.isPending} onClick={() => createMut.mutate()}>
                {createMut.isPending ? 'Creating...' : 'Create'}
              </button>
            </>
          }
        >
          <div className="input-group">
            <label className="input-label">Category Name</label>
            <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Electronics" onKeyDown={(e) => e.key === 'Enter' && createMut.mutate()} autoFocus />
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Delete Category" onClose={() => setDeleteId(null)} maxWidth={400}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" disabled={deleteMut.isPending} onClick={() => deleteMut.mutate(deleteId)}>
                {deleteMut.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </>
          }
        >
          <p style={{ color: 'var(--text-2)' }}>This will delete the category. Products using it will lose their category.</p>
        </Modal>
      )}
    </AdminLayout>
  );
}
