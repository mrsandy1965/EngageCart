import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import orderService from '../../services/orderService';
import toast from 'react-hot-toast';
import '../../styles/Order.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, loading } = useCart();
  const [submitting, setSubmitting] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleShippingChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        shippingAddress,
        paymentInfo: {
          method: paymentInfo.method,
          last4: paymentInfo.cardNumber.slice(-4)
        }
      };

      const response = await orderService.createOrder(orderData);
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add items to your cart before checking out</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="checkout-page">
        <h1>Checkout</h1>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Shipping Address */}
            <section className="form-section">
              <h2>Shipping Address</h2>
              <div className="form-grid">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={shippingAddress.fullName}
                  onChange={handleShippingChange}
                  required
                  className="form-input"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={shippingAddress.phone}
                  onChange={handleShippingChange}
                  required
                  className="form-input"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  required
                  className="form-input full-width"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  required
                  className="form-input"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={handleShippingChange}
                  required
                  className="form-input"
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={shippingAddress.zipCode}
                  onChange={handleShippingChange}
                  required
                  className="form-input"
                />
              </div>
            </section>

            {/* Payment Information */}
            <section className="form-section">
              <h2>Payment Information</h2>
              <div className="payment-notice">
                <p>⚠️ This is a placeholder. No real payment processing.</p>
              </div>
              <div className="form-grid">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number (e.g., 1234567890123456)"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                  required
                  maxLength="16"
                  className="form-input full-width"
                />
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={paymentInfo.expiry}
                  onChange={handlePaymentChange}
                  required
                  maxLength="5"
                  className="form-input"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={paymentInfo.cvv}
                  onChange={handlePaymentChange}
                  required
                  maxLength="3"
                  className="form-input"
                />
              </div>
            </section>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-large checkout-submit"
            >
              {submitting ? 'Placing Order...' : `Place Order - $${cartTotal.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cart.items.map((item) => (
                <div key={item.product._id} className="summary-item">
                  <div
                    className="summary-item-image"
                    style={{
                      backgroundImage: `url(${item.product.images?.[0] || '/placeholder.jpg'})`
                    }}
                  />
                  <div className="summary-item-details">
                    <h4>{item.product.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="summary-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
