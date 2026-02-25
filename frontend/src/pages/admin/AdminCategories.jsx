import { useState, useEffect, useCallback } from 'react';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '../../services/adminService';
import toast from 'react-hot-toast';
import './Admin.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminCategories();
      setCategories(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (c) => { setEditId(c._id); setForm({ name: c.name, description: c.description || '' }); };
  const cancelEdit = () => { setEditId(null); setForm({ name: '', description: '' }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCategory(editId, form);
        toast.success('Category updated');
      } else {
        await createCategory(form);
        toast.success('Category created');
      }
      cancelEdit();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>🏷️ Categories ({categories.length})</h1>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}
        style={{ maxWidth: 420, background: 'white', padding: '1.25rem', borderRadius: 10,
                 boxShadow: '0 1px 4px rgb(0 0 0 / 0.08)', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', color: '#1e293b' }}>
          {editId ? 'Edit Category' : 'Add Category'}
        </h3>
        <label>Name<input required value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></label>
        <label>Description<input value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></label>
        <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
          {editId && <button type="button" className="btn-sm btn-delete" onClick={cancelEdit}>Cancel</button>}
          <button type="submit" className="btn-sm btn-save">{editId ? 'Update' : 'Add'}</button>
        </div>
      </form>

      {loading ? <p>Loading...</p> : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c._id}>
                <td><strong>{c.name}</strong></td>
                <td style={{ color: '#64748b' }}>{c.description || '—'}</td>
                <td>
                  <button className="btn-sm btn-edit" onClick={() => startEdit(c)}>Edit</button>
                  <button className="btn-sm btn-delete" onClick={() => handleDelete(c._id, c.name)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCategories;
