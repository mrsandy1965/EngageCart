import { body, param } from 'express-validator';

export const createOrderValidation = [
    body('shippingAddress.fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ max: 100 }).withMessage('Full name cannot exceed 100 characters'),

    body('shippingAddress.address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters'),

    body('shippingAddress.city')
        .trim()
        .notEmpty().withMessage('City is required')
        .isLength({ max: 50 }).withMessage('City cannot exceed 50 characters'),

    body('shippingAddress.state')
        .trim()
        .notEmpty().withMessage('State is required')
        .isLength({ max: 50 }).withMessage('State cannot exceed 50 characters'),

    body('shippingAddress.zipCode')
        .trim()
        .notEmpty().withMessage('ZIP code is required')
        .matches(/^[0-9]{5,10}$/).withMessage('Invalid ZIP code format'),

    body('shippingAddress.phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10,15}$/).withMessage('Invalid phone number format'),

    body('paymentInfo.method')
        .notEmpty().withMessage('Payment method is required')
        .isIn(['card', 'paypal', 'cash']).withMessage('Invalid payment method'),

    body('paymentInfo.last4')
        .optional()
        .matches(/^[0-9]{4}$/).withMessage('Last 4 digits must be 4 numbers')
];

export const updateOrderStatusValidation = [
    param('id')
        .isMongoId().withMessage('Invalid order ID'),

    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid order status')
];
