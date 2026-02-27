import { useState, useEffect, useCallback } from 'react';
import { getAdminProducts, deleteProduct } from '../../services/adminService';
import ProductForm from './ProductForm';
import toast from 'react-hot-toast';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null=closed, 'new'=create, object=edit

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminProducts();
      // API returns { data: [...products], pagination: {...} }
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>🛒 Products ({products.length})</h1>
        <button className="btn-sm btn-save" onClick={() => setEditing('new')}>+ Add Product</button>
      </div>

      {loading ? <p>Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category?.name || p.category || '—'}</td>
                <td>${p.price?.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${p.stock === 0 ? 'badge-cancelled' : p.stock <= 5 ? 'badge-pending' : 'badge-delivered'}`}>
                    {p.stock}
                  </span>
                </td>
                <td>
                  <button className="btn-sm btn-edit" onClick={() => setEditing(p)}>Edit</button>
                  <button className="btn-sm btn-delete" onClick={() => handleDelete(p._id, p.name)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <ProductForm
          product={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={load}
        />
      )}
    </div>
  );
};

export default AdminProducts;
