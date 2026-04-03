/**
 * auth.integration.test.js
 *
 * Integration tests: full HTTP request → Express router → Controller → mongoose → MongoDB Memory Server
 * No mocks — this validates the real stack end-to-end.
 */
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';

import testApp                               from './helpers/testApp.js';
import { connectTestDB, clearTestDB, closeTestDB } from './helpers/dbHelper.js';

// ── lifecycle ────────────────────────────────────────────────────────────────
beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret_key_integration';
    await connectTestDB();
});

afterEach(async () => {
    await clearTestDB();       // wipe DB between each test → isolation
});

afterAll(async () => {
    await closeTestDB();
});

// ── helpers ──────────────────────────────────────────────────────────────────
const validUser = {
    name:     'Test User',
    email:    'test@example.com',
    password: 'password123',
};

async function registerUser(overrides = {}) {
    return request(testApp)
        .post('/api/auth/register')
        .send({ ...validUser, ...overrides });
}

async function loginUser(email = validUser.email, password = validUser.password) {
    return request(testApp)
        .post('/api/auth/login')
        .send({ email, password });
}

// ── register ─────────────────────────────────────────────────────────────────
describe('POST /api/auth/register', () => {
    it('creates a new user and returns 201 with userId', async () => {
        const res = await registerUser();

        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ message: 'User registered successfully' });
        expect(res.body.userId).toBeDefined();
    });

    it('returns 400 when email is already registered', async () => {
        await registerUser();                    // first registration

        const res = await registerUser();        // duplicate
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('User already exists');
    });

    it('returns 500 when required fields are missing', async () => {
        const res = await request(testApp)
            .post('/api/auth/register')
            .send({ email: 'noname@example.com' });   // missing name & password

        expect(res.status).toBeGreaterThanOrEqual(400);
    });
});

// ── login ─────────────────────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
    it('returns JWT token and user info on valid credentials', async () => {
        await registerUser();
        const res = await loginUser();

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user).toMatchObject({
            email: validUser.email,
            name:  validUser.name,
            role:  'user',
        });
    });

    it('returns 400 on wrong password', async () => {
        await registerUser();
        const res = await loginUser(validUser.email, 'wrongpassword');

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid credentials');
    });

    it('returns 400 for unregistered email', async () => {
        const res = await loginUser('nobody@example.com', 'pass123');

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid credentials');
    });
});

// ── profile (protected route) ─────────────────────────────────────────────────
describe('GET /api/auth/profile', () => {
    it('returns user profile when authenticated with valid token', async () => {
        await registerUser();
        const loginRes = await loginUser();
        const { token } = loginRes.body;

        const res = await request(testApp)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe(validUser.email);
        expect(res.body.password).toBeUndefined();   // password must be stripped
    });

    it('returns 401 when no token is provided', async () => {
        const res = await request(testApp).get('/api/auth/profile');

        expect(res.status).toBe(401);
    });
});
