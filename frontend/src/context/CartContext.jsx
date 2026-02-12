import { createContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      loadCart();
    });
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data.data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const data = await cartService.addToCart(productId, quantity);
      setCart(data.data);
      toast.success('Added to cart!');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const data = await cartService.updateQuantity(productId, quantity);
      setCart(data.data);
      toast.success('Cart updated');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      throw error;
    }
  };

  const removeItem = async (productId) => {
    try {
      const data = await cartService.removeItem(productId);
      setCart(data.data);
      toast.success('Item removed');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const data = await cartService.clearCart();
      setCart(data.data);
      toast.success('Cart cleared');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      throw error;
    }
  };

  const itemCount = cart?.totalItems || 0;
  const cartTotal = cart?.totalPrice || 0;

  const value = {
    cart,
    loading,
    itemCount,
    cartTotal,
    loadCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
export default CartProvider;
