import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import toast from 'react-hot-toast';
import './Products.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

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

          <div className="price-section">
            <span className="price">${product.price?.toFixed(2)}</span>
            <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

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

          <button 
            className="btn btn-primary btn-large"
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
