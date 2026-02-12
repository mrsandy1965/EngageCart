import Cart from '../src/models/cart.model.js';
import Product from '../src/models/product.model.js';
import {
    getCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
} from '../src/controllers/cart.controller.js';

describe('Cart Controller', () => {
    describe('addToCart', () => {
        it('should add new product to empty cart', async () => {
            const req = {
                user: { id: 'user123' },
                body: { productId: 'product123', quantity: 2 }
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            // Mock product
            Product.findById = jest.fn().mockResolvedValue({
                _id: 'product123',
                name: 'Test Product',
                price: 100,
                stock: 10
            });

            // Mock cart
            Cart.findOne = jest.fn().mockResolvedValue(null);
            Cart.prototype.save = jest.fn().mockResolvedValue(true);
            Cart.prototype.populate = jest.fn().mockResolvedValue({
                items: [{ product: 'product123', quantity: 2, price: 100 }]
            });

            await addToCart(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Product added to cart'
                })
            );
        });

        it('should update quantity if product already in cart', async () => {
            const req = {
                user: { id: 'user123' },
                body: { productId: 'product123', quantity: 1 }
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            Product.findById = jest.fn().mockResolvedValue({
                _id: 'product123',
                price: 100,
                stock: 10
            });

            const existingCart = {
                user: 'user123',
                items: [{ product: 'product123', quantity: 2, price: 100 }],
                save: jest.fn().mockResolvedValue(true),
                populate: jest.fn().mockResolvedValue({
                    items: [{ product: 'product123', quantity: 3, price: 100 }]
                })
            };

            Cart.findOne = jest.fn().mockResolvedValue(existingCart);

            await addToCart(req, res);

            expect(existingCart.items[0].quantity).toBe(3);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });

        it('should return error if insufficient stock', async () => {
            const req = {
                user: { id: 'user123' },
                body: { productId: 'product123', quantity: 5 }
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            Product.findById = jest.fn().mockResolvedValue({
                _id: 'product123',
                stock: 3
            });

            Cart.findOne = jest.fn().mockResolvedValue({
                items: []
            });

            await addToCart(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Only 3 items in stock'
                })
            );
        });
    });

    describe('updateQuantity', () => {
        it('should update product quantity in cart', async () => {
            const req = {
                user: { id: 'user123' },
                params: { productId: 'product123' },
                body: { quantity: 5 }
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            Product.findById = jest.fn().mockResolvedValue({
                _id: 'product123',
                stock: 10
            });

            const cart = {
                items: [{ product: 'product123', quantity: 2, price: 100 }],
                save: jest.fn().mockResolvedValue(true),
                populate: jest.fn().mockResolvedValue({
                    items: [{ product: 'product123', quantity: 5, price: 100 }]
                })
            };

            Cart.findOne = jest.fn().mockResolvedValue(cart);

            await updateQuantity(req, res);

            expect(cart.items[0].quantity).toBe(5);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true })
            );
        });
    });

    describe('removeItem', () => {
        it('should remove product from cart', async () => {
            const req = {
                user: { id: 'user123' },
                params: { productId: 'product123' }
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            const cart = {
                items: [
                    { product: 'product123', quantity: 2, price: 100 },
                    { product: 'product456', quantity: 1, price: 50 }
                ],
                save: jest.fn().mockResolvedValue(true),
                populate: jest.fn().mockResolvedValue({
                    items: [{ product: 'product456', quantity: 1, price: 50 }]
                })
            };

            Cart.findOne = jest.fn().mockResolvedValue(cart);

            await removeItem(req, res);

            expect(cart.items.length).toBe(1);
            expect(cart.items[0].product).toBe('product456');
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Item removed from cart'
                })
            );
        });
    });

    describe('clearCart', () => {
        it('should clear all items from cart', async () => {
            const req = {
                user: { id: 'user123' }
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            const cart = {
                items: [
                    { product: 'product123', quantity: 2, price: 100 },
                    { product: 'product456', quantity: 1, price: 50 }
                ],
                save: jest.fn().mockResolvedValue(true)
            };

            Cart.findOne = jest.fn().mockResolvedValue(cart);

            await clearCart(req, res);

            expect(cart.items.length).toBe(0);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Cart cleared'
                })
            );
        });
    });
});
