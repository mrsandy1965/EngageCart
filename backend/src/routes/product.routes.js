import express from 'express';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getCategories
} from '../controllers/product.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import validate from '../middleware/validate.middleware.js';
import {
    createProductValidator,
    updateProductValidator,
    getProductByIdValidator,
    getProductsQueryValidator
} from '../validators/product.validators.js';

const router = express.Router();

// Public routes
router.get('/', getProductsQueryValidator, validate, getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductByIdValidator, validate, getProductById);

// Admin protected routes
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    createProductValidator,
    validate,
    createProduct
);

router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    updateProductValidator,
    validate,
    updateProduct
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    getProductByIdValidator,
    validate,
    deleteProduct
);

export default router;
