import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

/**
 * Connects to the product's socket.io room and tracks:
 *  - live viewer count
 *  - real-time stock updates
 *
 * Automatically emits 'watch-product' on mount and 'unwatch-product' on unmount.
 *
 * @param {string} productId - MongoDB ObjectId of the product
 * @param {number} initialStock - Stock value from the initial REST fetch (used until socket fires)
 */
const useProductSocket = (productId, initialStock = 0) => {
    const socketRef = useRef(null);
    const [viewers, setViewers] = useState(1);
    const [stock, setStock] = useState(initialStock);
    const [connected, setConnected] = useState(false);

    // Sync stock when the parent re-loads the product
    useEffect(() => {
        setStock(initialStock);
    }, [initialStock]);

    useEffect(() => {
        if (!productId) return;

        const socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            socket.emit('watch-product', productId);
        });

        socket.on('disconnect', () => {
            setConnected(false);
        });

        socket.on('viewer-count', ({ productId: pid, count }) => {
            if (pid === productId) {
                setViewers(count);
            }
        });

        socket.on('stock-change', ({ productId: pid, stock: newStock }) => {
            if (pid === productId) {
                setStock(newStock);
            }
        });

        return () => {
            socket.emit('unwatch-product', productId);
            socket.disconnect();
        };
    }, [productId]);

    return {
        viewers,
        stock,
        connected,
        lowStock: stock > 0 && stock <= 5,
        outOfStock: stock === 0
    };
};

export default useProductSocket;
