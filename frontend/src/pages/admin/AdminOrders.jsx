import { useState, useEffect, useCallback } from 'react';
import { getAllOrders } from '../../services/adminService';
import OrderStatusModal from './OrderStatusModal';
import './Admin.css';

const STATUS_COLORS = {
  pending: 'pending', confirmed: 'confirmed', processing: 'processing',
  shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled'
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllOrders(page);
      setOrders(res.data?.orders || []);
      setPagination(res.data?.pagination || {});
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="admin-page-header">
        <h1>📦 Orders ({pagination.total ?? 0})</h1>
      </div>

      {loading ? <p>Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th><th>Customer</th><th>Total</th>
              <th>Status</th><th>Date</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6).toUpperCase()}</td>
                <td>{o.user?.name || 'N/A'}<br /><small>{o.user?.email}</small></td>
                <td>${o.totalAmount?.toFixed(2)}</td>
                <td>
                  <span className={`status-badge badge-${STATUS_COLORS[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-sm btn-edit" onClick={() => setSelected(o)}>
                    Change Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pagination.pages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="btn-sm btn-edit" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}>{page} / {pagination.pages}</span>
          <button className="btn-sm btn-edit" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {selected && (
        <OrderStatusModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdated={load}
        />
      )}
    </div>
  );
};

export default AdminOrders;
