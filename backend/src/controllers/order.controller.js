import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Create new order from cart
export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { shippingAddress, paymentInfo } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id }).session(session).populate('items.product');

        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Validate stock availability for all items within transaction
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id).session(session);
            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product.name} not found`
                });
            }
            if (product.stock < item.quantity) {
                await session.abortTransaction();
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}. Only ${product.stock} available`
                });
            }
        }

        // Prepare order items (snapshot product data)
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            image: item.product.images?.[0] || ''
        }));

        // Calculate total amount
        const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order within transaction
        const [order] = await Order.create([{
            user: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentInfo,
            totalAmount,
            status: 'pending'
        }], { session });

        // Update product stock within transaction
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }

        // Clear user's cart within transaction
        await Cart.findByIdAndUpdate(
            cart._id,
            { items: [] },
            { session }
        );

        await session.commitTransaction();

        // Populate product references in response (after commit)
        await order.populate('items.product', 'name category');

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error in createOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        session.endSession();
    }
};

// Get user's orders
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
        // Admin authorization check
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const { id } = req.params;
        const { status } = req.body;

        // Validate status
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

        // If changing to cancelled, restore stock
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

// Cancel order
export const cancelOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { id } = req.params;

        const order = await Order.findById(id).session(session);

        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify user owns the order
        if (order.user.toString() !== req.user.id) {
            await session.abortTransaction();
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Only allow cancelling pending or confirmed orders
        if (!['pending', 'confirmed'].includes(order.status)) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.status}`
            });
        }

        order.status = 'cancelled';
        await order.save({ session });

        // Restore product stock within transaction
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } },
                { session }
            );
        }

        await session.commitTransaction();

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error in cancelOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    } finally {
        session.endSession();
    }
};
