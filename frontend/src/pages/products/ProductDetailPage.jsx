import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import AddToCartButton from '../../components/cart/AddToCartButton';
import useProductSocket from '../../hooks/useProductSocket';
import toast from 'react-hot-toast';
import './Products.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductById(id);
      setProduct(data.data);
    } catch (error) {
      toast.error('Failed to load product');
      console.error(error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Live real-time data from socket
  const { viewers, stock, lowStock, outOfStock } = useProductSocket(
    product?._id,
    product?.stock ?? 0
  );

  // Back-in-stock toast: fires when stock goes from 0 → > 0
  const prevStockRef = useRef(null);
  useEffect(() => {
    if (prevStockRef.current === 0 && stock > 0) {
      toast.success(`🎉 Back in stock! Grab it before it's gone!`, { duration: 4000 });
    }
    prevStockRef.current = stock;
  }, [stock]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ['/placeholder.jpg'];

  return (
    <div className="container">
      <button onClick={() => navigate('/products')} className="btn btn-outline back-btn">
        ← Back to Products
      </button>

      <div className="product-detail">
        <div className="product-gallery">
          <div
            className="main-image"
            style={{ backgroundImage: `url(${images[currentImage]})` }}
          />
          {images.length > 1 && (
            <div className="thumbnail-list">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === currentImage ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${img})` }}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>

          {product.category && (
            <span className="category-badge">
              {product.category.name || product.category}
            </span>
          )}

          {/* Live viewer count */}
          {viewers > 1 && (
            <div className="live-viewers">
              <span className="live-dot" aria-hidden="true" />
              <span>{viewers} people are viewing this right now</span>
            </div>
          )}

          <div className="price-section">
            <span className="price">${product.price?.toFixed(2)}</span>

            {/* Live stock badge */}
            {outOfStock ? (
              <span className="stock out-of-stock">Out of stock</span>
            ) : lowStock ? (
              <span className="stock low-stock">⚡ Only {stock} left!</span>
            ) : (
              <span className="stock in-stock">{stock} in stock</span>
            )}
          </div>

          {/* Urgency alert banner */}
          {lowStock && !outOfStock && (
            <div className="urgency-banner" role="alert">
              🔥 <strong>Almost gone!</strong> Only {stock} item{stock !== 1 ? 's' : ''} left — order soon!
            </div>
          )}
          {outOfStock && (
            <div className="urgency-banner out-of-stock-banner" role="alert">
              😔 <strong>Out of stock.</strong> Check back soon or browse similar items.
            </div>
          )}

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.averageRating > 0 && (
            <div className="rating-section">
              <div className="rating">
                ⭐ {product.averageRating.toFixed(1)}
              </div>
              <span className="reviews-count">
                ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          <AddToCartButton product={{ ...product, stock }} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

