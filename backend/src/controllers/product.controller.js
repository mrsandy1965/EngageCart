import Product from '../models/product.model.js';

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Admin
 */
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, images } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock: stock || 0,
            images: images || [],
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    Get all products with pagination, filtering, sorting, and search
 * @route   GET /api/products
 * @access  Public
 */
export const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            minPrice,
            maxPrice,
            search,
            sort = '-createdAt',
            inStock
        } = req.query;

        // Build filter query
        const filter = { isActive: true };

        // Category filter
        if (category) {
            filter.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // In stock filter
        if (inStock === 'true') {
            filter.stock = { $gt: 0 };
        }

        // Text search
        if (search) {
            filter.$text = { $search: search };
        }

        // Parse sort parameter
        const sortOptions = {};
        if (sort) {
            const sortFields = sort.split(',');
            sortFields.forEach(field => {
                if (field.startsWith('-')) {
                    sortOptions[field.substring(1)] = -1;
                } else {
                    sortOptions[field] = 1;
                }
            });
        }

        // Calculate pagination
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Execute query
        const products = await Product.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .populate('createdBy', 'name email');

        // Get total count for pagination
        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            data: products,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('ratings.user', 'name');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: product
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Admin
 */
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, images, isActive } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Update only provided fields
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (category !== undefined) product.category = category;
        if (stock !== undefined) product.stock = stock;
        if (images !== undefined) product.images = images;
        if (isActive !== undefined) product.isActive = isActive;

        await product.save();

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    Delete product (soft delete by setting isActive to false)
 * @route   DELETE /api/products/:id
 * @access  Admin
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Soft delete - set isActive to false
        product.isActive = false;
        await product.save();

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    Get all unique categories
 * @route   GET /api/products/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category', { isActive: true });

        res.json({
            success: true,
            data: categories
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
