import { body, param } from 'express-validator';

export const createCategoryValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ max: 100 }).withMessage('Category name cannot exceed 100 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

    body('parent')
        .optional()
        .isMongoId().withMessage('Invalid parent category ID'),

    body('image')
        .optional()
        .isURL().withMessage('Image must be a valid URL')
];

export const updateCategoryValidator = [
    param('id')
        .isMongoId().withMessage('Invalid category ID'),

    body('name')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Category name cannot exceed 100 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

    body('parent')
        .optional()
        .custom((value, { req }) => {
            if (value === req.params.id) {
                throw new Error('Category cannot be its own parent');
            }
            return true;
        })
        .isMongoId().withMessage('Invalid parent category ID'),

    body('image')
        .optional()
        .isURL().withMessage('Image must be a valid URL'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean')
];

export const getCategoryByIdValidator = [
    param('id')
        .isMongoId().withMessage('Invalid category ID')
];
