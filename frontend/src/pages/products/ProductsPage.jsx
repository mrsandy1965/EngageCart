import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductList from '../../components/product/ProductList';
import ProductFilters from '../../components/product/ProductFilters';
import toast from 'react-hot-toast';
import './Products.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({});

  const loadProducts = async (page, activeFilters) => {
    setLoading(true);
    try {
      // Strip empty / falsy values so they don't pollute the query string
      const cleanFilters = Object.fromEntries(
        Object.entries(activeFilters).filter(([, v]) => v !== '' && v != null)
      );

      const params = { page, limit: 12, ...cleanFilters };
      const data = await productService.getProducts(params);
      setProducts(data.data || []);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(pagination.page, filters);
  }, [pagination.page, filters]);

  const handleFilterChange = (newFilters) => {
    // Reset to page 1 first, then update filters — triggers one clean load
    setPagination(prev => ({ ...prev, page: 1 }));
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <div className="products-page">
        <aside className="sidebar">
          <ProductFilters onFilterChange={handleFilterChange} />
        </aside>

        <div className="products-content">
          <div className="products-header">
            <h1>Products</h1>
            <p className="results-count">
              {pagination.total} {pagination.total === 1 ? 'product' : 'products'} found
            </p>
          </div>

          <ProductList products={products} loading={loading} />

          {!loading && pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn btn-outline"
              >
                Previous
              </button>

              <span className="page-info">
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="btn btn-outline"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
