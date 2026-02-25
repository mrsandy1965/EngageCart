import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthContext';
import CartProvider from './context/CartContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/order/CheckoutPage';
import OrderHistoryPage from './pages/order/OrderHistoryPage';
import OrderDetailPage from './pages/order/OrderDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Admin routes — own layout, no store header */}
            <Route
              path="/admin"
              element={<AdminRoute><AdminLayout /></AdminRoute>}
            >
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>

            {/* Store routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
              <Route path="orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

