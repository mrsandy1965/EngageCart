import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import toast from 'react-hot-toast';
import '../../styles/Order.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancelling(true);
      await orderService.cancelOrder(id);
      toast.success('Order cancelled successfully');
      loadOrder(); // Reload to show updated status
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel order';
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
  };

  const canCancelOrder = () => {
    return order && ['pending', 'confirmed'].includes(order.status);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="container">
      <div className="order-detail-page">
        <div className="order-detail-header">
          <div>
            <Link to="/orders" className="back-link">← Back to Orders</Link>
            <h1>Order {order.orderNumber}</h1>
            <p className="order-date">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="order-detail-content">
          {/* Order Items */}
          <section className="order-section">
            <h2>Order Items</h2>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div
                    className="order-item-image"
                    style={{
                      backgroundImage: `url(${item.image || '/placeholder.jpg'})`
                    }}
                  />
                  <div className="order-item-details">
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p className="order-item-price">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="order-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="order-detail-grid">
            {/* Shipping Address */}
            <section className="order-section">
              <h2>Shipping Address</h2>
              <div className="address-box">
                <p><strong>{order.shippingAddress.fullName}</strong></p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            </section>

            {/* Payment Info */}
            <section className="order-section">
              <h2>Payment Information</h2>
              <div className="payment-box">
                <p>
                  <strong>Method:</strong> {order.paymentInfo.method}
                </p>
                {order.paymentInfo.last4 && (
                  <p>
                    <strong>Card:</strong> **** **** **** {order.paymentInfo.last4}
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <section className="order-section">
            <h2>Order Summary</h2>
            <div className="order-summary-box">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Actions */}
          {canCancelOrder() && (
            <div className="order-actions">
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="btn btn-outline btn-large"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
