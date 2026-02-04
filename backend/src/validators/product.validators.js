import { body, param, query } from 'express-validator';

export const createProductValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ max: 200 }).withMessage('Product name cannot exceed 200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Product description is required')
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

    body('price')
        .notEmpty().withMessage('Product price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('category')
        .trim()
        .notEmpty().withMessage('Product category is required'),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

    body('images')
        .optional()
        .isArray().withMessage('Images must be an array'),

    body('images.*')
        .optional()
        .isURL().withMessage('Each image must be a valid URL')
];

export const updateProductValidator = [
    param('id')
        .isMongoId().withMessage('Invalid product ID'),

    body('name')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Product name cannot exceed 200 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

    body('price')
        .optional()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('category')
        .optional()
        .trim(),

    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

    body('images')
        .optional()
        .isArray().withMessage('Images must be an array'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean')
];

export const getProductByIdValidator = [
    param('id')
        .isMongoId().withMessage('Invalid product ID')
];

export const getProductsQueryValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

    query('minPrice')
        .optional()
        .isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),

    query('maxPrice')
        .optional()
        .isFloat({ min: 0 }).withMessage('maxPrice must be a positive number')
];
