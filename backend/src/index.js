import { createServer } from 'http';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import { initSocket } from './socket.js';
import { initBackendErrorTracking, captureBackendError } from './config/errorTracking.js';
import logger from './utils/logger.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';

const PORT = process.env.PORT || 5001;

initBackendErrorTracking();

// Connect to database
connectDB();

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health check — used by Render to verify service is alive
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    captureBackendError(err, {
        route: req.originalUrl,
        method: req.method
    });

    logger.error(
        {
            route: req.originalUrl,
            method: req.method,
            stack: err.stack
        },
        'Unhandled backend error'
    );

    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Create HTTP server and attach Socket.io
const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
    logger.info({ port: PORT }, 'Backend server running');
    logger.info('WebSocket server ready');
});

export default app;
