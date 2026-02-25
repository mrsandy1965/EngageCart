import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/adminService';
import './Admin.css';

const StatCard = ({ label, value, color, link }) => (
  <Link to={link} className={`stat-card stat-${color}`}>
    <div className="stat-value">{value ?? '—'}</div>
    <div className="stat-label">{label}</div>
  </Link>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="admin-page-header">
        <h1>📊 Dashboard</h1>
      </div>

      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="stats-grid">
          <StatCard label="Total Orders"     value={stats?.totalOrders}     color="blue"   link="/admin/orders" />
          <StatCard label="Pending Orders"   value={stats?.pendingOrders}   color="yellow" link="/admin/orders" />
          <StatCard label="Total Products"   value={stats?.totalProducts}   color="green"  link="/admin/products" />
          <StatCard label="Total Categories" value={stats?.totalCategories} color="purple" link="/admin/categories" />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
