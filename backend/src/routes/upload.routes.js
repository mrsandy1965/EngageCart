import express from 'express';
import {
    uploadSingleImage,
    uploadMultipleImages,
    deleteImage
} from '../controllers/upload.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import { uploadSingle, uploadMultiple } from '../middleware/upload.middleware.js';

const router = express.Router();

// All upload routes require admin access
router.post(
    '/image',
    authMiddleware,
    adminMiddleware,
    uploadSingle,
    uploadSingleImage
);

router.post(
    '/images',
    authMiddleware,
    adminMiddleware,
    uploadMultiple,
    uploadMultipleImages
);

router.delete(
    '/image/:publicId',
    authMiddleware,
    adminMiddleware,
    deleteImage
);

// Error handling for multer
router.use((err, req, res, next) => {
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next(err);
});

export default router;
