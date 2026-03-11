/**
 * Category Controller — Unit Tests
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.unstable_mockModule('../src/models/category.model.js', () => ({
    default: {
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        countDocuments: jest.fn(),
    },
}));

jest.unstable_mockModule('../src/models/product.model.js', () => ({
    default: { countDocuments: jest.fn() },
}));

const { default: Category } = await import('../src/models/category.model.js');
const { default: Product } = await import('../src/models/product.model.js');
const {
    getAllCategories,
    createCategory,
    deleteCategory,
} = await import('../src/controllers/category.controller.js');

const mockRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
});

/** Chain: .populate().populate().sort() → resolves on sort */
const doublePop = (result) => ({
    populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(result),
        }),
    }),
});

describe('Category Controller', () => {
    beforeEach(() => jest.clearAllMocks());

    // ── getAllCategories ───────────────────────────────────────
    describe('getAllCategories', () => {
        it('returns all categories', async () => {
            const categories = [{ _id: 'c1', name: 'Electronics' }];
            Category.find.mockReturnValue(doublePop(categories));

            const req = { query: {} };
            const res = mockRes();

            await getAllCategories(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, data: categories })
            );
        });
    });

    // ── createCategory ────────────────────────────────────────
    describe('createCategory', () => {
        it('creates category and returns 201', async () => {
            Category.findOne.mockResolvedValue(null);
            const created = { _id: 'c1', name: 'Electronics', slug: 'electronics' };
            Category.create.mockResolvedValue(created);

            const req = { body: { name: 'Electronics' } };
            const res = mockRes();

            await createCategory(req, res);

            expect(Category.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('returns 400 if slug already exists (DB duplicate key)', async () => {
            // Controller catches err.code === 11000 — simulate that
            Category.findOne.mockResolvedValue(null);  // slug check not used
            const dupError = new Error('duplicate key');
            dupError.code = 11000;
            Category.create.mockRejectedValue(dupError);

            const req = { body: { name: 'Electronics' } };
            const res = mockRes();

            await createCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: false })
            );
        });

        it('returns 400 if slug already exists', async () => {
            // findOne returns an existing category with same slug
            Category.findOne.mockResolvedValue({ slug: 'electronics', _id: 'existing' });

            const req = { body: { name: 'Electronics' } };
            const res = mockRes();

            await createCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: false })
            );
        });
    });

    // ── deleteCategory ────────────────────────────────────────
    describe('deleteCategory', () => {
        it('prevents deletion if category has products', async () => {
            const category = { _id: 'c1', name: 'Electronics' };
            Category.findById.mockResolvedValue(category);
            Category.countDocuments.mockResolvedValue(0);    // no children
            Product.countDocuments.mockResolvedValue(3);     // has products

            const req = { params: { id: 'c1' } };
            const res = mockRes();

            await deleteCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('returns 404 for missing category', async () => {
            Category.findById.mockResolvedValue(null);

            const req = { params: { id: 'missing' } };
            const res = mockRes();

            await deleteCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    // ── slug generation logic ─────────────────────────────────
    describe('slug logic', () => {
        const toSlug = (name) =>
            name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        it('converts name to slug', () => {
            expect(toSlug('Electronics & Gadgets')).toBe('electronics-gadgets');
        });

        it('handles special characters', () => {
            expect(toSlug("Men's Fashion (New!)")).toBe('men-s-fashion-new');
        });
    });
});
