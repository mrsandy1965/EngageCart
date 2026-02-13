import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import '../../components/cart/Cart.css';

const CartPage = () => {
  const { cart, loading, cartTotal, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch {
      // Error handled in context
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
    } catch {
      // Error handled in context
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch {
        // Error handled in context
      }
    }
  };

  return (
    <div className="container">
      <div className="cart-page">
        <h1>Shopping Cart</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div 
                  className="cart-item-image"
                  style={{ 
                    backgroundImage: `url(${item.product.images?.[0] || '/placeholder.jpg'})` 
                  }}
                />

                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  {item.product.category && (
                    <span className="category-badge">
                      {item.product.category.name || item.product.category}
                    </span>
                  )}
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="quantity-btn"
                    >
                      −
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>

                  <p className="item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Items ({cart.totalItems})</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-large checkout-btn">
            <button className="btn btn-primary btn-large checkout-btn">
              Proceed to Checkout
            </button>

            <button onClick={handleClearCart} className="btn btn-outline btn-large">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
