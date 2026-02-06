import cloudinary from '../config/cloudinary.config.js';
import { Readable } from 'stream';

/**
 * Helper function to upload buffer to Cloudinary
 */
const uploadToCloudinary = (buffer, folder = 'engagecart') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image',
                transformation: [
                    { width: 1000, crop: 'limit' }, // Max width 1000px
                    { quality: 'auto' }, // Auto quality optimization
                    { fetch_format: 'auto' } // Auto format (WebP if supported)
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        // Convert buffer to stream and pipe to Cloudinary
        const stream = Readable.from(buffer);
        stream.pipe(uploadStream);
    });
};

/**
 * @desc    Upload single image
 * @route   POST /api/upload/image
 * @access  Admin
 */
export const uploadSingleImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: `Upload failed: ${err.message}`
        });
    }
};

/**
 * @desc    Upload multiple images
 * @route   POST /api/upload/images
 * @access  Admin
 */
export const uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No image files provided'
            });
        }

        // Upload all images in parallel
        const uploadPromises = req.files.map(file =>
            uploadToCloudinary(file.buffer)
        );

        const results = await Promise.all(uploadPromises);

        const uploadedImages = results.map(result => ({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format
        }));

        res.json({
            success: true,
            message: `${uploadedImages.length} image(s) uploaded successfully`,
            data: uploadedImages
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: `Upload failed: ${err.message}`
        });
    }
};

/**
 * @desc    Delete image from Cloudinary
 * @route   DELETE /api/upload/image/:publicId
 * @access  Admin
 */
export const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.params;

        // Decode the public ID (it might be URL encoded)
        const decodedPublicId = decodeURIComponent(publicId);

        const result = await cloudinary.uploader.destroy(decodedPublicId);

        if (result.result === 'ok') {
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Image not found or already deleted'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: `Delete failed: ${err.message}`
        });
    }
};
