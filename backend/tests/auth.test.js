/**
 * Auth Controller — Unit Tests
 * Expectations match the actual response shapes in auth.controller.js
 */
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.unstable_mockModule('../src/models/user.model.js', () => ({
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
    },
}));

jest.unstable_mockModule('bcryptjs', () => ({
    default: {
        hash: jest.fn().mockResolvedValue('hashed_password'),
        compare: jest.fn(),
    },
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        sign: jest.fn().mockReturnValue('mock_token'),
    },
}));

const { default: User } = await import('../src/models/user.model.js');
const bcrypt = (await import('bcryptjs')).default;
const { register, login, getProfile } = await import('../src/controllers/auth.controller.js');

const mockRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
});

describe('Auth Controller', () => {
    beforeEach(() => jest.clearAllMocks());

    // ── register ───────────────────────────────────────────────
    describe('register', () => {
        it('creates user and returns 201 with userId', async () => {
            User.findOne.mockResolvedValue(null);
            const newUser = { _id: 'u1', name: 'Sandesh', email: 'test@example.com', role: 'user' };
            User.create.mockResolvedValue(newUser);

            const req = { body: { name: 'Sandesh', email: 'test@example.com', password: 'pass123' } };
            const res = mockRes();

            await register(req, res);

            expect(User.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'User registered successfully' })
            );
        });

        it('returns 400 if email already exists', async () => {
            User.findOne.mockResolvedValue({ email: 'test@example.com' });

            const req = { body: { name: 'Test', email: 'test@example.com', password: 'pass123' } };
            const res = mockRes();

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'User already exists' })
            );
        });
    });

    // ── login ─────────────────────────────────────────────────
    describe('login', () => {
        it('returns token on correct credentials', async () => {
            const user = {
                _id: 'u1',
                email: 'test@example.com',
                password: 'hashed',
                role: 'user',
                isActive: true,
            };
            User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
            bcrypt.compare.mockResolvedValue(true);

            const req = { body: { email: 'test@example.com', password: 'pass123' } };
            const res = mockRes();

            await login(req, res);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ token: 'mock_token' })
            );
        });

        it('returns 400 on wrong password', async () => {
            const user = { _id: 'u1', email: 'test@example.com', password: 'hashed', isActive: true };
            User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
            bcrypt.compare.mockResolvedValue(false);

            const req = { body: { email: 'test@example.com', password: 'wrong' } };
            const res = mockRes();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'Invalid credentials' })
            );
        });

        it('returns 400 when user not found', async () => {
            User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

            const req = { body: { email: 'nobody@example.com', password: 'pass' } };
            const res = mockRes();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
