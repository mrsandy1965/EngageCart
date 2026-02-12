import api from './api';

const cartService = {
    // Get user's cart
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },

    // Add product to cart
    addToCart: async (productId, quantity = 1) => {
        const response = await api.post('/cart/add', {
            productId,
            quantity
        });
        return response.data;
    },

    // Update product quantity
    updateQuantity: async (productId, quantity) => {
        const response = await api.put(`/cart/update/${productId}`, {
            quantity
        });
        return response.data;
    },

    // Remove product from cart
    removeItem: async (productId) => {
        const response = await api.delete(`/cart/remove/${productId}`);
        return response.data;
    },

    // Clear entire cart
    clearCart: async () => {
        const response = await api.delete('/cart/clear');
        return response.data;
    }
};

export default cartService;
