import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import { getIO } from '../socket.js';

// Get all orders (admin only — paginated)
export const getAllOrdersAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments();

        res.json({
            success: true,
            data: {
                orders,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            }
        });
    } catch (error) {
        console.error('Error in getAllOrdersAdmin:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Create new order from cart
export const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentInfo } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate stock availability for all items (check all before touching anything)
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product.name} not found`
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}. Only ${product.stock} available`
                });
            }
        }

        // Prepare order items (snapshot product data at purchase time)
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            image: item.product.images?.[0] || ''
        }));

        // Calculate total amount
        const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order document
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentInfo,
            totalAmount,
            status: 'pending'
        });

        // Decrement stock for each item (manual rollback on failure)
        const decremented = [];
        try {
            for (const item of cart.items) {
                await Product.findByIdAndUpdate(
                    item.product._id,
                    { $inc: { stock: -item.quantity } }
                );
                decremented.push({ id: item.product._id, qty: item.quantity });
            }
        } catch (stockErr) {
            // Rollback: restore any stock already decremented, delete the orphan order
            for (const d of decremented) {
                await Product.findByIdAndUpdate(d.id, { $inc: { stock: d.qty } });
            }
            await Order.findByIdAndDelete(order._id);
            throw stockErr;
        }

        // Clear user's cart
        await Cart.findByIdAndUpdate(cart._id, { items: [] });

        // Populate product references in response
        await order.populate('items.product', 'name category');

        // Emit real-time stock-change events
        try {
            const io = getIO();
            for (const item of order.items) {
                const updatedProduct = await Product.findById(item.product._id).select('stock');
                if (updatedProduct) {
                    io.to(`product:${item.product._id}`).emit('stock-change', {
                        productId: item.product._id.toString(),
                        stock: updatedProduct.stock,
                        lowStock: updatedProduct.stock > 0 && updatedProduct.stock <= 5,
                        outOfStock: updatedProduct.stock === 0
                    });
                }
            }
        } catch (socketErr) {
            console.error('[Socket] Failed to emit stock-change on createOrder:', socketErr.message);
        }

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        console.error('Error in createOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get user's orders (paginated)
export const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'name category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments({ user: req.user.id });

        res.json({
            success: true,
            data: {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error in getOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate('items.product', 'name category images')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify user owns the order (or is admin)
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error in getOrderById:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }

        const order = await Order.findById(id).populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const previousStatus = order.status;
        order.status = status;

        // Restore stock if cancelling
        if (status === 'cancelled' && previousStatus !== 'cancelled') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: item.quantity } }
                );
            }
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Cancel order (user-initiated)
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.status}`
            });
        }

        order.status = 'cancelled';
        await order.save();

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } }
            );
        }

        // Emit real-time stock-restore events
        try {
            const io = getIO();
            for (const item of order.items) {
                const updatedProduct = await Product.findById(item.product).select('stock');
                if (updatedProduct) {
                    io.to(`product:${item.product}`).emit('stock-change', {
                        productId: item.product.toString(),
                        stock: updatedProduct.stock,
                        lowStock: updatedProduct.stock > 0 && updatedProduct.stock <= 5,
                        outOfStock: updatedProduct.stock === 0
                    });
                }
            }
        } catch (socketErr) {
            console.error('[Socket] Failed to emit stock-change on cancelOrder:', socketErr.message);
        }

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        console.error('Error in cancelOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
