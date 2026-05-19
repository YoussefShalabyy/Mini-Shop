import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart,
  Users, Tag, LogOut, ShoppingBag,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const NAV = [
  { to: '/',           label: 'Dashboard',  icon: <LayoutDashboard size={18} />, end: true },
  { to: '/products',   label: 'Products',   icon: <Package         size={18} /> },
  { to: '/orders',     label: 'Orders',     icon: <ShoppingCart    size={18} /> },
  { to: '/customers',  label: 'Customers',  icon: <Users           size={18} /> },
  { to: '/categories', label: 'Categories', icon: <Tag             size={18} /> },
];

export function Sidebar() {
  const { user, clearSession } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const initial = user?.name?.[0]?.toUpperCase() ?? 'A';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <ShoppingBag size={20} color="#fff" />
        </div>
        <span>Mini Shop</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">Main</div>
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initial}</div>
          <div>
            <div className="sidebar-user-name">{user?.name ?? 'Admin'}</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
        </div>
        <button className="sidebar-link w-full" onClick={handleLogout} style={{ color: 'var(--error)' }}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
