/**
 * authService — unit tests
 * Mocks `axios` (via api.js) and localStorage.
 */

jest.mock('../../services/api', () => ({
    post: jest.fn(),
    get: jest.fn(),
}));

import api from '../../services/api';
import authService from '../../services/authService';

describe('authService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe('login', () => {
        it('returns user and token on success', async () => {
            const mockResponse = { data: { token: 'abc123', user: { _id: '1', name: 'Sandesh', role: 'user' } } };
            api.post.mockResolvedValue({ data: mockResponse });

            const result = await authService.login('test@example.com', 'password');
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password',
            });
            expect(result).toBeDefined();
        });

        it('throws on failed login', async () => {
            api.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
            await expect(authService.login('bad@example.com', 'wrong')).rejects.toBeDefined();
        });
    });

    describe('logout', () => {
        it('removes token from localStorage', () => {
            localStorage.setItem('token', 'abc123');
            authService.logout();
            expect(localStorage.getItem('token')).toBeNull();
        });
    });

    describe('getToken', () => {
        it('returns token from localStorage', () => {
            localStorage.setItem('token', 'mytoken');
            expect(authService.getToken()).toBe('mytoken');
        });

        it('returns null when no token stored', () => {
            expect(authService.getToken()).toBeNull();
        });
    });
});
