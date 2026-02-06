import api from './api';

const authService = {
    // Register new user
    async register(name, email, password) {
        const response = await api.post('/auth/register', {
            name,
            email,
            password
        });
        return response.data;
    },

    // Login user
    async login(email, password) {
        const response = await api.post('/auth/login', {
            email,
            password
        });

        if (response.data.token) {
            this.setToken(response.data.token);
            if (response.data.user) {
                this.setUser(response.data.user);
            }
        }

        return response.data;
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user profile
    async getCurrentUser() {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    // Token management
    getToken() {
        return localStorage.getItem('token');
    },

    setToken(token) {
        localStorage.setItem('token', token);
    },

    // User management
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }
};

export default authService;
