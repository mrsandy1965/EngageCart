import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
    getCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
} from '../controllers/cart.controller.js';
import {
    addToCartValidation,
    updateQuantityValidation
} from '../validators/cart.validators.js';

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get('/', getCart);

/**
 * @route   POST /api/cart/add
 * @desc    Add product to cart
 * @access  Private
 */
router.post('/add', addToCartValidation, validate, addToCart);

/**
 * @route   PUT /api/cart/update/:productId
 * @desc    Update product quantity in cart
 * @access  Private
 */
router.put('/update/:productId', updateQuantityValidation, validate, updateQuantity);

/**
 * @route   DELETE /api/cart/remove/:productId
 * @desc    Remove product from cart
 * @access  Private
 */
router.delete('/remove/:productId', removeItem);

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear all items from cart
 * @access  Private
 */
router.delete('/clear', clearCart);

export default router;
