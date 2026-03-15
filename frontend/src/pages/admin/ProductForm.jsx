import { useState, useEffect, useRef } from 'react';
import { createProduct, updateProduct, getAdminCategories } from '../../services/adminService';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY = { name: '', description: '', price: '', stock: '', category: '', images: [] };

const ProductForm = ({ product, onClose, onSaved }) => {
  const isEdit = !!product;
  const [form, setForm] = useState(isEdit
    ? {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category?._id || product.category || '',
        images: product.images || []
      }
    : EMPTY
  );
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    getAdminCategories().then(r => setCategories(r.data || [])).catch(console.error);
  }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const data = new FormData();
      files.forEach(f => data.append('images', f));
      const res = await api.post('/upload/images', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const urls = res.data.data.map(img => img.url);
      setForm(f => ({ ...f, images: [...f.images, ...urls] }));
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (idx) =>
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

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
      <div className="modal-box" style={{ minWidth: 440, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Name<input required value={form.name} onChange={set('name')} /></label>
          <label>Description<textarea rows={3} value={form.description} onChange={set('description')} /></label>
          <label>Price (₹)<input type="number" min="0" step="0.01" required value={form.price} onChange={set('price')} /></label>
          <label>Stock<input type="number" min="0" required value={form.stock} onChange={set('stock')} /></label>
          <label>
            Category
            <select value={form.category} onChange={set('category')}>
              <option value="">— Select —</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </label>

          {/* Image Upload */}
          <label>
            Product Images
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ padding: '0.3rem 0' }}
            />
          </label>
          {uploading && <p style={{ fontSize: '0.8rem', color: '#60a5fa' }}>⏳ Uploading...</p>}

          {/* Thumbnails */}
          {form.images.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
              {form.images.map((url, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={url} alt="" style={{ width: 72, height: 72, objectFit: 'cover',
                    borderRadius: 6, border: '1px solid #e2e8f0' }} />
                  <button type="button" onClick={() => removeImage(i)}
                    style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444',
                      color: 'white', border: 'none', borderRadius: '50%',
                      width: 18, height: 18, fontSize: 10, cursor: 'pointer', lineHeight: 1 }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-sm btn-delete" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-sm btn-save" disabled={saving || uploading}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
