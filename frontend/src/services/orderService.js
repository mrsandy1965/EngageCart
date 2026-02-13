import api from './api';

const orderService = {
    // Create order from cart
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Get user's orders
    getOrders: async (page = 1, limit = 10) => {
        const response = await api.get(`/orders?page=${page}&limit=${limit}`);
        return response.data;
    },

    // Get order by ID
    getOrderById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        const response = await api.put(`/orders/${orderId}/cancel`);
        return response.data;
    }
};

export default orderService;
