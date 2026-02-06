import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to EngageCart</h1>
            <p className="hero-subtitle">
              Discover amazing products at great prices
            </p>
            <Link to="/products" className="btn btn-primary btn-large">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛍️</div>
              <h3>Wide Selection</h3>
              <p>Browse thousands of products across multiple categories</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping to your doorstep</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>Safe and encrypted payment processing</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Best Prices</h3>
              <p>Competitive pricing and regular deals</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
