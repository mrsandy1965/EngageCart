import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import './Product.css';

const ProductFilters = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      loadCategories();
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="filters-container">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Search</label>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search products..."
        />
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Min Price</label>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="0"
          min="0"
        />
      </div>

      <div className="filter-group">
        <label>Max Price</label>
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="1000"
          min="0"
        />
      </div>

      <div className="filter-actions">
        <button onClick={handleApply} className="btn btn-primary">
          Apply
        </button>
        <button onClick={handleReset} className="btn btn-outline">
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
