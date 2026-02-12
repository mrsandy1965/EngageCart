import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import CartIcon from '../cart/CartIcon';
import './Layout.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            EngageCart
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
          </nav>

          <div className="auth-actions">
            {isAuthenticated && <CartIcon />}
            {isAuthenticated ? (
              <>
                <span className="user-name">Hi, {user?.name}</span>
                <button onClick={logout} className="btn btn-outline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
