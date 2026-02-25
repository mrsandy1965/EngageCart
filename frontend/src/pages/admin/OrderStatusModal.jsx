import { useState } from 'react';
import { updateOrderStatus } from '../../services/adminService';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrderStatusModal = ({ order, onClose, onUpdated }) => {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (status === order.status) { onClose(); return; }
    setSaving(true);
    try {
      await updateOrderStatus(order._id, status);
      toast.success(`Order status updated to "${status}"`);
      onUpdated();
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>Update Order Status</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem' }}>
          Order #{order._id.slice(-6).toUpperCase()} &nbsp;·&nbsp; {order.user?.name}
        </p>
        <div className="admin-form">
          <label>
            New Status
            <select value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="modal-actions">
          <button className="btn-sm btn-delete" onClick={onClose}>Cancel</button>
          <button className="btn-sm btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;
