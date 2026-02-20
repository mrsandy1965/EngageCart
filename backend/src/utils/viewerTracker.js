/**
 * In-memory viewer tracker.
 * Tracks how many active WebSocket connections are watching each product.
 * Resets on server restart (Redis can replace this for persistence later).
 */
const viewers = new Map();

export const viewerTracker = {
    /**
     * Increment viewer count for a product. Returns new count.
     */
    increment(productId) {
        const current = viewers.get(productId) || 0;
        const next = current + 1;
        viewers.set(productId, next);
        return next;
    },

    /**
     * Decrement viewer count for a product. Never goes below 0. Returns new count.
     */
    decrement(productId) {
        const current = viewers.get(productId) || 0;
        const next = Math.max(0, current - 1);
        if (next === 0) {
            viewers.delete(productId); // clean up
        } else {
            viewers.set(productId, next);
        }
        return next;
    },

    /**
     * Get current viewer count for a product.
     */
    get(productId) {
        return viewers.get(productId) || 0;
    },

    /**
     * Get all tracked products (for debugging).
     */
    getAll() {
        return Object.fromEntries(viewers);
    }
};
