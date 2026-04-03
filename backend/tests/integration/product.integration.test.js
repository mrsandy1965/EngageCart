/**
 * product.integration.test.js
 *
 * Integration tests: full HTTP → Router → Controller → Mongoose → MongoDB Memory Server
 * Covers: list products, get by ID, admin create/update/delete (protected routes).
 */
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import mongoose from 'mongoose';

import testApp                                          from './helpers/testApp.js';
import { connectTestDB, clearTestDB, closeTestDB }     from './helpers/dbHelper.js';
import Product                                         from '../../src/models/product.model.js';
import Category                                        from '../../src/models/category.model.js';

// ── lifecycle ─────────────────────────────────────────────────────────────────
beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret_key_integration';
    await connectTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

// ── helpers ───────────────────────────────────────────────────────────────────
/** Register an admin user and return a signed JWT token. */
async function getAdminToken() {
    await request(testApp).post('/api/auth/register').send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin1234',
    });

    // Force the role to admin directly in DB (registration always creates 'user')
    const { default: User } = await import('../../src/models/user.model.js');
    await User.findOneAndUpdate({ email: 'admin@example.com' }, { role: 'admin' });

    const loginRes = await request(testApp).post('/api/auth/login').send({
        email: 'admin@example.com',
        password: 'admin1234',
    });
    return loginRes.body.token;
}

/** Seed a product directly via Mongoose (bypasses HTTP for setup speed). */
async function seedProduct(overrides = {}) {
    // Category is required by the Product model — create one if not supplied
    const randomSuffix = Date.now() + Math.floor(Math.random() * 10000);
    const category = await Category.create({
        name:        `Test Category ${randomSuffix}`,
        slug:        `test-cat-${randomSuffix}`,
        description: 'Seed category for tests',
    });
    return Product.create({
        name:        'Test Product',
        description: 'A test product description',
        price:       499,
        stock:       10,
        isActive:    true,
        category:    category._id,
        createdBy:   new mongoose.Types.ObjectId(),
        ...overrides,
    });
}

// ── GET /api/products ──────────────────────────────────────────────────────────
describe('GET /api/products', () => {
    it('returns empty list when no products exist', async () => {
        const res = await request(testApp).get('/api/products');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toEqual([]);
        expect(res.body.pagination.total).toBe(0);
    });

    it('returns seeded active products', async () => {
        await seedProduct({ name: 'Laptop', price: 59999 });
        await seedProduct({ name: 'Phone', price: 29999 });

        const res = await request(testApp).get('/api/products');

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
    });

    it('filters out inactive products', async () => {
        await seedProduct({ name: 'Active Item', isActive: true });
        await seedProduct({ name: 'Hidden Item', isActive: false });

        const res = await request(testApp).get('/api/products');

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].name).toBe('Active Item');
    });

    it('supports pagination via ?page and ?limit', async () => {
        for (let i = 0; i < 5; i++) {
            await seedProduct({ name: `Product ${i}`, price: 100 + i });
        }

        const res = await request(testApp).get('/api/products?page=1&limit=2');

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.pagination.pages).toBe(3);
    });
});

// ── GET /api/products/:id ──────────────────────────────────────────────────────
describe('GET /api/products/:id', () => {
    it('returns a product by valid ID', async () => {
        const product = await seedProduct({ name: 'Headphones' });

        const res = await request(testApp).get(`/api/products/${product._id}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Headphones');
    });

    it('returns 404 for a non-existent product ID', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res    = await request(testApp).get(`/api/products/${fakeId}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
    });
});

// ── Admin routes (POST / PUT / DELETE) ────────────────────────────────────────
describe('Admin product routes', () => {
    it('POST /api/products — admin creates a product (201)', async () => {
        const token = await getAdminToken();

        // Create a real category so the required category field passes validation
        const cat = await Category.create({
            name: 'Gadgets', slug: 'gadgets', description: 'Test category',
        });

        const res = await request(testApp)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name:        'New Widget',
                description: 'A shiny new widget for testing',
                price:       999,
                stock:       50,
                category:    cat._id.toString(),
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('New Widget');
    });

    it('POST /api/products — rejects unauthenticated request (401)', async () => {
        const res = await request(testApp)
            .post('/api/products')
            .send({ name: 'Sneaky', price: 100 });

        expect(res.status).toBe(401);
    });

    it('PUT /api/products/:id — admin updates price', async () => {
        const token   = await getAdminToken();
        const product = await seedProduct({ name: 'Old Name' });

        const res = await request(testApp)
            .put(`/api/products/${product._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ price: 1999 });

        expect(res.status).toBe(200);
        expect(res.body.data.price).toBe(1999);
    });

    it('DELETE /api/products/:id — soft-deletes (isActive becomes false)', async () => {
        const token   = await getAdminToken();
        const product = await seedProduct({ name: 'To Delete' });

        const delRes = await request(testApp)
            .delete(`/api/products/${product._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(delRes.status).toBe(200);
        expect(delRes.body.success).toBe(true);

        // Verify product is hidden from public listing
        const listRes = await request(testApp).get('/api/products');
        expect(listRes.body.data.find(p => p._id === product._id.toString())).toBeUndefined();
    });
});
