/**
 * Product Controller — Unit Tests (with chained Mongoose mocks)
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.unstable_mockModule('../src/models/product.model.js', () => ({
    default: {
        create: jest.fn(),
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        countDocuments: jest.fn(),
    },
}));

const { default: Product } = await import('../src/models/product.model.js');
const {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
} = await import('../src/controllers/product.controller.js');

const mockRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
});

/** Build a mock query chain for Product.find().sort().skip().limit().pop().pop() */
const chainMock = (resolvedValue) => {
    // getAllProducts: find().sort().skip().limit().populate().populate()
    // The SECOND populate() must resolve directly
    const firstPop = {
        populate: jest.fn().mockResolvedValue(resolvedValue),
    };
    return {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnValue(firstPop),
    };
};

/** 3-level populate chain for getProductById: .pop().pop().pop() */
const triplePopChain = (resolvedValue) => ({
    populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(resolvedValue),
        }),
    }),
});

describe('Product Controller', () => {
    beforeEach(() => jest.clearAllMocks());

    // ── createProduct ─────────────────────────────────────────
    describe('createProduct', () => {
        it('creates product and returns 201', async () => {
            const req = {
                user: { id: 'admin1' },
                body: { name: 'Watch', description: 'Nice watch', price: 299, category: 'cat1', stock: 10 },
            };
            const res = mockRes();
            const created = { _id: 'p1', ...req.body };
            Product.create.mockResolvedValue(created);

            await createProduct(req, res);

            expect(Product.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Watch', price: 299 }));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('returns 500 on DB error', async () => {
            const req = { user: { id: 'admin1' }, body: { name: 'Fail' } };
            const res = mockRes();
            Product.create.mockRejectedValue(new Error('DB error'));

            await createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    // ── getAllProducts ─────────────────────────────────────────
    describe('getAllProducts', () => {
        it('returns products with pagination', async () => {
            const fakeProducts = [{ _id: 'p1', name: 'Watch' }];
            Product.find.mockReturnValue(chainMock(fakeProducts));
            Product.countDocuments.mockResolvedValue(1);

            const req = { query: { page: '1', limit: '10' } };
            const res = mockRes();

            await getAllProducts(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, data: fakeProducts })
            );
        });

        it('filters by category when provided', async () => {
            Product.find.mockReturnValue(chainMock([]));
            Product.countDocuments.mockResolvedValue(0);

            const req = { query: { category: 'cat123' } };
            const res = mockRes();

            await getAllProducts(req, res);

            expect(Product.find).toHaveBeenCalledWith(
                expect.objectContaining({ category: 'cat123' })
            );
        });
    });

    // ── getProductById ────────────────────────────────────────
    describe('getProductById', () => {
        it('returns product when found', async () => {
            const product = { _id: 'p1', name: 'Watch' };
            // getProductById: .findById().populate().populate().populate()
            Product.findById.mockReturnValue(triplePopChain(product));

            const req = { params: { id: 'p1' } };
            const res = mockRes();

            await getProductById(req, res);

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: product }));
        });

        it('returns 404 when not found', async () => {
            Product.findById.mockReturnValue(triplePopChain(null));

            const req = { params: { id: 'missing' } };
            const res = mockRes();

            await getProductById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    // ── deleteProduct ─────────────────────────────────────────
    describe('deleteProduct', () => {
        it('soft deletes product (sets isActive: false)', async () => {
            const product = { _id: 'p1', isActive: true, save: jest.fn().mockResolvedValue(true) };
            Product.findById.mockResolvedValue(product);

            const req = { params: { id: 'p1' } };
            const res = mockRes();

            await deleteProduct(req, res);

            expect(product.isActive).toBe(false);
            expect(product.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        });

        it('returns 404 for missing product', async () => {
            Product.findById.mockResolvedValue(null);

            const req = { params: { id: 'missing' } };
            const res = mockRes();

            await deleteProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
