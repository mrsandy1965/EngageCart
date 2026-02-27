import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const AddToCartButton = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const { cart, addToCart, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const cartItem = cart?.items?.find(
    (i) => (i.product?._id || i.product) === product._id
  );
  const qty = cartItem?.quantity || 0;

  const handle = async (fn) => {
    setLoading(true);
    try { await fn(); }
    catch { /* errors toasted by CartContext */ }
    finally { setLoading(false); }
  };

  if (product.stock === 0) {
    return (
      <button disabled className="btn btn-primary add-to-cart-btn" style={{ opacity: 0.5 }}>
        Out of Stock
      </button>
    );
  }

  if (qty > 0) {
    return (
      <div className="qty-stepper">
        <button
          className="qty-btn"
          onClick={() => handle(() => qty === 1 ? removeItem(product._id) : updateQuantity(product._id, qty - 1))}
          disabled={loading}
          aria-label="Decrease"
        >−</button>
        <div className="qty-divider" />
        <span className="qty-value">{qty}</span>
        <div className="qty-divider" />
        <button
          className="qty-btn"
          onClick={() => handle(() => updateQuantity(product._id, qty + 1))}
          disabled={loading || qty >= product.stock}
          aria-label="Increase"
        >+</button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        handle(() => addToCart(product._id, 1));
      }}
      disabled={loading}
      className="btn btn-primary add-to-cart-btn"
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
};

export default AddToCartButton;
