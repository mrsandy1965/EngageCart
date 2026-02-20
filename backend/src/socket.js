import { Server } from 'socket.io';
import { viewerTracker } from './utils/viewerTracker.js';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        // Client wants to watch a product page
        socket.on('watch-product', (productId) => {
            if (!productId) return;

            // Join a room named after the product
            socket.join(`product:${productId}`);

            // Increment viewer count and broadcast to the room
            const count = viewerTracker.increment(productId);
            io.to(`product:${productId}`).emit('viewer-count', { productId, count });

            console.log(`[Socket] ${socket.id} watching product ${productId} — viewers: ${count}`);
        });

        // Client leaves a product page
        socket.on('unwatch-product', (productId) => {
            if (!productId) return;

            socket.leave(`product:${productId}`);
            const count = viewerTracker.decrement(productId);
            io.to(`product:${productId}`).emit('viewer-count', { productId, count });

            console.log(`[Socket] ${socket.id} left product ${productId} — viewers: ${count}`);
        });

        // Auto-cleanup on disconnect: decrement all rooms this socket was in
        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);

            // Find all product rooms this socket was in
            const rooms = [...socket.rooms].filter(r => r.startsWith('product:'));
            rooms.forEach((room) => {
                const productId = room.replace('product:', '');
                const count = viewerTracker.decrement(productId);
                io.to(room).emit('viewer-count', { productId, count });
            });
        });
    });

    return io;
};

/**
 * Get the initialized Socket.io instance.
 * Throws if called before initSocket().
 */
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized. Call initSocket(httpServer) first.');
    }
    return io;
};
