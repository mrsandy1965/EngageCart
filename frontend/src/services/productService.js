import api from './api';

const productService = {
    // Get all products with filters
    async getProducts(params = {}) {
        const response = await api.get('/products', { params });
        return response.data;
    },

    // Get single product by ID
    async getProductById(id) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Get all categories
    async getCategories() {
        const response = await api.get('/categories');
        return response.data;
    },

    // Get category tree
    async getCategoryTree() {
        const response = await api.get('/categories/tree');
        return response.data;
    }
};

export default productService;
