import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navLinks = [
    { to: '/admin', label: '📊 Dashboard', end: true },
    { to: '/admin/orders', label: '📦 Orders' },
    { to: '/admin/products', label: '🛒 Products' },
    { to: '/admin/categories', label: '🏷️ Categories' },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">⚙️ Admin Panel</div>
        <nav className="admin-nav">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/" className="admin-nav-link back-link">
          ← Back to Store
        </NavLink>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
