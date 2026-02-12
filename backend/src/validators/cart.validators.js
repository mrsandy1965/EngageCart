import { body, param } from 'express-validator';

export const addToCartValidation = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('quantity')
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage('Quantity must be between 1 and 10')
];

export const updateQuantityValidation = [
    param('productId')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('quantity')
        .isInt({ min: 1, max: 10 })
        .withMessage('Quantity must be between 1 and 10')
];
