import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import Order from '../src/models/order.model.js';
import Cart from '../src/models/cart.model.js';
import Product from '../src/models/product.model.js';
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} from '../src/controllers/order.controller.js';

describe('Order Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        it('should create order from cart successfully', async () => {
            const req = {
                user: { id: 'user123' },
                body: {
                    shippingAddress: {
                        fullName: 'John Doe',
                        address: '123 Main St',
                        city: 'New York',
                        state: 'NY',
                        zipCode: '10001',
                        phone: '1234567890'
                    },
                    paymentInfo: {
                        method: 'card',
                        last4: '1234'
                    }
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockCart = {
                user: 'user123',
                items: [
                    {
                        product: {
                            _id: 'prod123',
                            name: 'Test Product',
                            images: ['image1.jpg'],
                            price: 100
                        },
                        quantity: 2,
                        price: 100
                    }
                ],
                save: jest.fn()
            };

            const mockProduct = {
                _id: 'prod123',
                stock: 10
            };

            Cart.findOne = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockCart)
            });

            Product.findById = jest.fn().mockResolvedValue(mockProduct);
            Product.findByIdAndUpdate = jest.fn();

            Order.create = jest.fn().mockResolvedValue({
                _id: 'order123',
                user: 'user123',
                items: [{
                    product: 'prod123',
                    name: 'Test Product',
                    quantity: 2,
                    price: 100,
                    image: 'image1.jpg'
                }],
                totalAmount: 200,
                populate: jest.fn().mockResolvedValue({})
            });

            await createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Order created successfully'
                })
            );
        });

        it('should return error if cart is empty', async () => {
            const req = {
                user: { id: 'user123' },
                body: {}
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Cart.findOne = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue({ items: [] })
            });

            await createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Cart is empty'
                })
            );
        });

        it('should return error if insufficient stock', async () => {
            const req = {
                user: { id: 'user123' },
                body: {
                    shippingAddress: {},
                    paymentInfo: {}
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockCart = {
                items: [{
                    product: {
                        _id: 'prod123',
                        name: 'Test Product'
                    },
                    quantity: 5,
                    price: 100
                }]
            };

            const mockProduct = {
                _id: 'prod123',
                name: 'Test Product',
                stock: 2
            };

            Cart.findOne = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockCart)
            });

            Product.findById = jest.fn().mockResolvedValue(mockProduct);

            await createOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: expect.stringContaining('Insufficient stock')
                })
            );
        });
    });

    describe('getOrders', () => {
        it('should get user orders with pagination', async () => {
            const req = {
                user: { id: 'user123' },
                query: { page: '1', limit: '10' }
            };

            const res = {
                json: jest.fn()
            };

            const mockOrders = [
                { _id: 'order1', totalAmount: 100 },
                { _id: 'order2', totalAmount: 200 }
            ];

            Order.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockOrders)
            });

            Order.countDocuments = jest.fn().mockResolvedValue(2);

            await getOrders(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: expect.objectContaining({
                        orders: mockOrders,
                        pagination: expect.any(Object)
                    })
                })
            );
        });
    });

    describe('getOrderById', () => {
        it('should get order by ID', async () => {
            const req = {
                user: { id: 'user123', role: 'user' },
                params: { id: 'order123' }
            };

            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            const mockOrder = {
                _id: 'order123',
                user: { _id: 'user123' },
                totalAmount: 100
            };

            Order.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                then: async (callback) => callback(mockOrder)
            });

            await getOrderById(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    data: mockOrder
                })
            );
        });

        it('should return 404 if order not found', async () => {
            const req = {
                user: { id: 'user123' },
                params: { id: 'invalidId' }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Order.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                then: async (callback) => callback(null)
            });

            await getOrderById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Order not found'
                })
            );
        });
    });

    describe('updateOrderStatus', () => {
        it('should update order status', async () => {
            const req = {
                params: { id: 'order123' },
                body: { status: 'shipped' }
            };

            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            const mockOrder = {
                _id: 'order123',
                status: 'confirmed',
                save: jest.fn()
            };

            Order.findById = jest.fn().mockResolvedValue(mockOrder);

            await updateOrderStatus(req, res);

            expect(mockOrder.status).toBe('shipped');
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Order status updated'
                })
            );
        });
    });

    describe('cancelOrder', () => {
        it('should cancel pending order', async () => {
            const req = {
                user: { id: 'user123' },
                params: { id: 'order123' }
            };

            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            const mockOrder = {
                _id: 'order123',
                user: 'user123',
                status: 'pending',
                items: [
                    { product: 'prod123', quantity: 2 }
                ],
                save: jest.fn()
            };

            Order.findById = jest.fn().mockResolvedValue(mockOrder);
            Product.findByIdAndUpdate = jest.fn();

            await cancelOrder(req, res);

            expect(mockOrder.status).toBe('cancelled');
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Order cancelled successfully'
                })
            );
        });

        it('should not cancel shipped order', async () => {
            const req = {
                user: { id: 'user123' },
                params: { id: 'order123' }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockOrder = {
                _id: 'order123',
                user: 'user123',
                status: 'shipped'
            };

            Order.findById = jest.fn().mockResolvedValue(mockOrder);

            await cancelOrder(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: expect.stringContaining('Cannot cancel')
                })
            );
        });
    });
});
