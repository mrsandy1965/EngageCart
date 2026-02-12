import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import './Cart.css';

const CartIcon = () => {
  const { itemCount } = useCart();

  return (
    <Link to="/cart" className="cart-icon-container">
      <div className="cart-icon">
        🛒
        {itemCount > 0 && (
          <span className="cart-badge">{itemCount}</span>
        )}
      </div>
    </Link>
  );
};

export default CartIcon;
