import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import './Home.css';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await productService.getProducts({ sort: '-createdAt', limit: 4 });
        setTrending(data.products || []);
      } catch (err) {
        console.error('Failed to load trending products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);
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

      <section className="trending-products">
        <div className="container">
          <div className="section-header">
            <h2>Trending Now</h2>
            <Link to="/products?sort=-createdAt" className="link-hover">View New Arrivals →</Link>
          </div>
          
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="products-grid">
              {trending.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <h3>Wide Selection</h3>
              <p>Browse thousands of products across multiple categories</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping to your doorstep</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3>Secure Payments</h3>
              <p>Safe and encrypted payment processing</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
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
