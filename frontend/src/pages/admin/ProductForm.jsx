import { useState, useEffect } from 'react';
import { createProduct, updateProduct, getAdminCategories } from '../../services/adminService';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', stock: '', category: '' };

const ProductForm = ({ product, onClose, onSaved }) => {
  const isEdit = !!product;
  const [form, setForm] = useState(isEdit
    ? { name: product.name, description: product.description, price: product.price,
        stock: product.stock, category: product.category?._id || product.category || '' }
    : EMPTY
  );
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminCategories().then(r => setCategories(r.data || [])).catch(console.error);
  }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (isEdit) await updateProduct(product._id, payload);
      else await createProduct(payload);
      toast.success(isEdit ? 'Product updated' : 'Product created');
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ minWidth: 420 }} onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Name<input required value={form.name} onChange={set('name')} /></label>
          <label>Description<textarea rows={3} value={form.description} onChange={set('description')} /></label>
          <label>Price ($)<input type="number" min="0" step="0.01" required value={form.price} onChange={set('price')} /></label>
          <label>Stock<input type="number" min="0" required value={form.stock} onChange={set('stock')} /></label>
          <label>
            Category
            <select value={form.category} onChange={set('category')}>
              <option value="">— Select —</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-sm btn-delete" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-sm btn-save" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
