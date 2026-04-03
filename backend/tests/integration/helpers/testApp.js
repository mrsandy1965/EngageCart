/**
 * testApp.js
 * A lightweight Express app used exclusively during integration tests.
 * Routes are registered here so tests can make real HTTP calls
 * without starting the Socket.io server or connecting to production DB.
 */
import express from 'express';
import cors from 'cors';

import authRoutes     from '../../../src/routes/auth.routes.js';
import productRoutes  from '../../../src/routes/product.routes.js';
import categoryRoutes from '../../../src/routes/category.routes.js';
import cartRoutes     from '../../../src/routes/cart.routes.js';
import orderRoutes    from '../../../src/routes/order.routes.js';

const testApp = express();

testApp.use(cors());
testApp.use(express.json());
testApp.use(express.urlencoded({ extended: true }));

// Health check
testApp.get('/api/health', (_req, res) =>
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// Routes
testApp.use('/api/auth',       authRoutes);
testApp.use('/api/products',   productRoutes);
testApp.use('/api/categories', categoryRoutes);
testApp.use('/api/cart',       cartRoutes);
testApp.use('/api/orders',     orderRoutes);

// Error handler
testApp.use((err, _req, res, _next) => {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

export default testApp;
