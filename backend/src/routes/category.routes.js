import express from 'express';
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategoryTree
} from '../controllers/category.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
    createCategoryValidator,
    updateCategoryValidator,
    getCategoryByIdValidator
} from '../validators/category.validators.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/tree', getCategoryTree);
router.get('/:id', getCategoryByIdValidator, validate, getCategoryById);

// Admin protected routes
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    createCategoryValidator,
    validate,
    createCategory
);

router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    updateCategoryValidator,
    validate,
    updateCategory
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    getCategoryByIdValidator,
    validate,
    deleteCategory
);

export default router;
