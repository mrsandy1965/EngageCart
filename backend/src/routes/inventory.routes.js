import express from 'express';
import Product from '../models/product.model.js';
import { viewerTracker } from '../utils/viewerTracker.js';

const router = express.Router();

/**
 * GET /api/inventory/:productId/live-stats
 * Returns current stock and live viewer count for a product.
 * No authentication required (public endpoint).
 */
router.get('/:productId/live-stats', async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId).select('stock name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: {
                productId,
                stock: product.stock,
                viewers: viewerTracker.get(productId),
                lowStock: product.stock > 0 && product.stock <= 5,
                outOfStock: product.stock === 0
            }
        });
    } catch (error) {
        console.error('Error in live-stats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

export default router;
