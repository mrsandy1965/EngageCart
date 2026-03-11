/**
 * productService — unit tests
 * Mocks `axios` so no real HTTP calls are made.
 */

// Mock the api module
jest.mock('../../services/api', () => ({
    get: jest.fn(),
}));

import api from '../../services/api';
import productService from '../../services/productService';

describe('productService', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('getProducts', () => {
        it('calls GET /products with no params by default', async () => {
            api.get.mockResolvedValue({ data: { data: [], pagination: {} } });
            await productService.getProducts();
            expect(api.get).toHaveBeenCalledWith('/products', { params: {} });
        });

        it('forwards filter params to the API', async () => {
            api.get.mockResolvedValue({ data: { data: [], pagination: {} } });
            const params = { page: 2, limit: 10, category: 'electronics' };
            await productService.getProducts(params);
            expect(api.get).toHaveBeenCalledWith('/products', { params });
        });

        it('returns response data', async () => {
            const mockProducts = [{ _id: '1', name: 'Watch' }];
            api.get.mockResolvedValue({ data: { data: mockProducts, pagination: { total: 1 } } });
            const result = await productService.getProducts();
            expect(result.data).toEqual(mockProducts);
        });
    });

    describe('getProductById', () => {
        it('calls GET /products/:id', async () => {
            api.get.mockResolvedValue({ data: { data: { _id: '123', name: 'Watch' } } });
            await productService.getProductById('123');
            expect(api.get).toHaveBeenCalledWith('/products/123');
        });

        it('returns product data', async () => {
            const mockProduct = { _id: '123', name: 'Watch' };
            api.get.mockResolvedValue({ data: { data: mockProduct } });
            const result = await productService.getProductById('123');
            expect(result.data).toEqual(mockProduct);
        });
    });

    describe('getCategories', () => {
        it('calls GET /categories', async () => {
            api.get.mockResolvedValue({ data: { data: [] } });
            await productService.getCategories();
            expect(api.get).toHaveBeenCalledWith('/categories');
        });

        it('returns an array of categories', async () => {
            const categories = [{ _id: '1', name: 'Electronics' }];
            api.get.mockResolvedValue({ data: { data: categories } });
            const result = await productService.getCategories();
            expect(result.data).toEqual(categories);
        });
    });
});
