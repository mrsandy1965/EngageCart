import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import '../../styles/Order.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await orderService.getOrders(page);
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here!</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="orders-page">
        <h1>Order History</h1>

        <div className="orders-list">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="order-card"
            >
              <div className="order-card-header">
                <div className="order-info">
                  <h3>{order.orderNumber}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="order-item-image"
                      style={{
                        backgroundImage: `url(${item.image || '/placeholder.jpg'})`
                      }}
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">+{order.items.length - 3}</div>
                  )}
                </div>

                <div className="order-summary">
                  <p>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  <p className="order-total">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="order-card-footer">
                <span className="view-details">View Details →</span>
              </div>
            </Link>
          ))}
        </div>

        {pagination.pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => loadOrders(page)}
                className={`pagination-btn ${page === pagination.page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
