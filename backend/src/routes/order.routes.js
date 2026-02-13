import express from 'express';
import auth from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} from '../controllers/order.controller.js';
import {
    createOrderValidation,
    updateOrderStatusValidation
} from '../validators/order.validators.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create order from cart
router.post('/', createOrderValidation, validate, createOrder);

// Get user's orders (paginated)
router.get('/', getOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Update order status (admin only)
router.put('/:id/status', adminMiddleware, updateOrderStatusValidation, validate, updateOrderStatus);

// Cancel order
router.put('/:id/cancel', cancelOrder);

export default router;
