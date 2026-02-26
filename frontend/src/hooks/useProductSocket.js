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
 * @param {string} productId   - MongoDB ObjectId of the product
 * @param {number|null} initialStock - Stock from initial REST fetch (fallback until socket fires)
 */
const useProductSocket = (productId, initialStock = null) => {
    const socketRef = useRef(null);
    const [viewers, setViewers] = useState(1);
    // null = socket hasn't sent a value yet; use initialStock as fallback in return
    const [socketStock, setSocketStock] = useState(null);
    const [connected, setConnected] = useState(false);

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
            if (pid === productId) setViewers(count);
        });

        socket.on('stock-change', ({ productId: pid, stock: newStock }) => {
            if (pid === productId) setSocketStock(newStock);
        });

        return () => {
            socket.emit('unwatch-product', productId);
            socket.disconnect();
            socketRef.current = null;
        };
    }, [productId]);

    // Socket is source of truth once it fires; otherwise fall back to REST value
    const stock = socketStock !== null ? socketStock : initialStock;

    return {
        viewers,
        stock,
        connected,
        lowStock: stock !== null && stock > 0 && stock <= 5,
        outOfStock: stock !== null && stock === 0
    };
};

export default useProductSocket;
