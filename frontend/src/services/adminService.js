import api from './api';

// ── Orders ──────────────────────────────────────────────
export const getAllOrders = (page = 1, limit = 20) =>
    api.get(`/orders/admin/all?page=${page}&limit=${limit}`).then(r => r.data);

export const updateOrderStatus = (id, status) =>
    api.put(`/orders/${id}/status`, { status }).then(r => r.data);

// ── Products ─────────────────────────────────────────────
export const getAdminProducts = (page = 1, limit = 20) =>
    api.get(`/products?page=${page}&limit=${limit}`).then(r => r.data);

export const createProduct = (data) =>
    api.post('/products', data).then(r => r.data);

export const updateProduct = (id, data) =>
    api.put(`/products/${id}`, data).then(r => r.data);

export const deleteProduct = (id) =>
    api.delete(`/products/${id}`).then(r => r.data);

// ── Categories ───────────────────────────────────────────
export const getAdminCategories = () =>
    api.get('/categories').then(r => r.data);

export const createCategory = (data) =>
    api.post('/categories', data).then(r => r.data);

export const updateCategory = (id, data) =>
    api.put(`/categories/${id}`, data).then(r => r.data);

export const deleteCategory = (id) =>
    api.delete(`/categories/${id}`).then(r => r.data);

// ── Stats ─────────────────────────────────────────────────
export const getAdminStats = async () => {
    const [products, categories, orders] = await Promise.all([
        getAdminProducts(1, 1),
        getAdminCategories(),
        getAllOrders(1, 100)
    ]);

    const allOrders = orders.data?.orders || [];
    return {
        totalProducts: products.data?.pagination?.total || 0,
        totalCategories: Array.isArray(categories.data) ? categories.data.length : 0,
        totalOrders: orders.data?.pagination?.total || 0,
        pendingOrders: allOrders.filter(o => o.status === 'pending').length
    };
};
