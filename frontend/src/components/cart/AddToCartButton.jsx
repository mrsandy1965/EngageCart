import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const AddToCartButton = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product.stock === 0) {
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      // Error already handled in CartContext with toast
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={product.stock === 0 || isAdding}
      className="btn btn-primary add-to-cart-btn"
    >
      {isAdding ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
    </button>
  );
};

export default AddToCartButton;
