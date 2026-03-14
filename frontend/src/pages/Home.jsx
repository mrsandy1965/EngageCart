import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-split">
            <div className="hero-content">
              <span className="hero-badge">✨ New Collection 2026</span>
              <h1>
                Discover the <br/>
                <span className="text-gradient">Future</span> of Shopping
              </h1>
              <p className="hero-subtitle">
                Experience curate products, real-time inventory updates, and lightning-fast checkout. 
                Your premium e-commerce destination.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary btn-large">
                  Shop Collection
                </Link>
                <Link to="/products?sort=-createdAt" className="btn btn-outline btn-large">
                  View Latest
                </Link>
              </div>
            </div>
            <div className="hero-image-wrapper">
              <div className="hero-blob"></div>
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
                alt="Modern shopping" 
                className="hero-image"
              />
              <div className="hero-card float-1">
                <div className="icon">🚀</div>
                <div className="text">
                  <strong>Free Shipping</strong>
                  <span>On orders over $50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-preview">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/products" className="link-hover">View All Collections →</Link>
          </div>
          <div className="category-grid">
            <Link to="/products?category=Electronics" className="category-card" style={{ '--bg': '#e0e7ff' }}>
              <span className="category-icon">💻</span>
              <h3>Electronics</h3>
              <p>Gadgets & Tech</p>
            </Link>
            <Link to="/products?category=Clothing" className="category-card" style={{ '--bg': '#fce7f3' }}>
              <span className="category-icon">👕</span>
              <h3>Clothing</h3>
              <p>Modern Apparel</p>
            </Link>
            <Link to="/products?category=Home" className="category-card" style={{ '--bg': '#dcfce7' }}>
              <span className="category-icon">🏡</span>
              <h3>Home & Garden</h3>
              <p>Interior Decor</p>
            </Link>
            <Link to="/products?category=Sports" className="category-card" style={{ '--bg': '#ffedd5' }}>
              <span className="category-icon">⚽</span>
              <h3>Sports</h3>
              <p>Active Gear</p>
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
