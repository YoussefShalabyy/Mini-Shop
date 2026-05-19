import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../ui/Toast';
import { useAuthStore } from '@/store/auth.store';

interface Props { children: ReactNode; title: string; }

export function AdminLayout({ children, title }: Props) {
  const { user, token } = useAuthStore();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin' && user.role !== 'owner') return <Navigate to="/login" replace />;

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-area">
        <header className="topbar">
          <h1 className="topbar-title">{title}</h1>
          <div className="topbar-right">
            <span className="badge badge-admin" style={{ fontSize: 12 }}>Admin</span>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user.email}</span>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}
