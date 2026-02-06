import { Link } from 'react-router-dom';
import './Product.css';

const ProductCard = ({ product }) => {
  const { _id, name, price, images, category, stock } = product;
  const imageUrl = images && images.length > 0 ? images[0] : '/placeholder.jpg';

  return (
    <Link to={`/products/${_id}`} className="product-card">
      <div className="product-image" style={{ backgroundImage: `url(${imageUrl})` }}>
        {stock === 0 && <div className="out-of-stock-badge">Out of Stock</div>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        
        {category && (
          <span className="category-badge">
            {category.name || category}
          </span>
        )}
        
        <div className="product-footer">
          <span className="product-price">${price?.toFixed(2)}</span>
          <span className="stock-indicator">
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
