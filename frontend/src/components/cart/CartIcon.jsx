import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import './Cart.css';

const CartIcon = () => {
  const { itemCount } = useCart();

  return (
    <Link to="/cart" className="cart-icon-container">
      <div className="cart-icon">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          className="cart-svg"
        >
          <circle cx="8" cy="21" r="1"/>
          <circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
        {itemCount > 0 && (
          <span className="cart-badge">{itemCount}</span>
        )}
      </div>
    </Link>
  );
};

export default CartIcon;
