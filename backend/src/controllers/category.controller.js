import Category from '../models/category.model.js';
import Product from '../models/product.model.js';

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Admin
 */
export const createCategory = async (req, res) => {
    try {
        const { name, description, parent, image } = req.body;

        // Check if parent category exists if provided
        if (parent) {
            const parentCategory = await Category.findById(parent);
            if (!parentCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Parent category not found'
                });
            }
        }

        const category = await Category.create({
            name,
            description,
            parent: parent || null,
            image
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getAllCategories = async (req, res) => {
    try {
        const { parent, includeInactive } = req.query;

        const filter = {};

        // Filter by parent - if parent=null, get root categories
        if (parent !== undefined) {
            filter.parent = parent === 'null' ? null : parent;
        }

        // Filter inactive categories
        if (!includeInactive || includeInactive === 'false') {
            filter.isActive = true;
        }

        const categories = await Category.find(filter)
            .populate('parent', 'name slug')
            .populate('children')
            .sort({ name: 1 });

        res.json({
            success: true,
            data: categories,
            count: categories.length
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    Get category by ID with children
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parent', 'name slug')
            .populate('children');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Admin
 */
export const updateCategory = async (req, res) => {
    try {
        const { name, description, parent, image, isActive } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Prevent setting self as parent
        if (parent && parent === req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Category cannot be its own parent'
            });
        }

        // Check if parent exists
        if (parent) {
            const parentCategory = await Category.findById(parent);
            if (!parentCategory) {
                return res.status(404).json({
                    success: false,
                    message: 'Parent category not found'
                });
            }
        }

        // Update fields
        if (name !== undefined) {
            category.name = name;
            category.slug = undefined; // Force regeneration
        }
        if (description !== undefined) category.description = description;
        if (parent !== undefined) category.parent = parent || null;
        if (image !== undefined) category.image = image;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Admin
 */
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if category has children
        const children = await Category.countDocuments({ parent: req.params.id });
        if (children > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with subcategories. Delete subcategories first.'
            });
        }

        // Check if category has products
        const products = await Product.countDocuments({ category: req.params.id });
        if (products > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category with ${products} product(s). Remove or reassign products first.`
            });
        }

        await category.deleteOne();

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * @desc    Get category tree (hierarchical structure)
 * @route   GET /api/categories/tree
 * @access  Public
 */
export const getCategoryTree = async (req, res) => {
    try {
        // Get all root categories (no parent) with their children populated
        const rootCategories = await Category.find({ parent: null, isActive: true })
            .populate({
                path: 'children',
                match: { isActive: true },
                populate: {
                    path: 'children',
                    match: { isActive: true }
                }
            })
            .sort({ name: 1 });

        res.json({
            success: true,
            data: rootCategories
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
