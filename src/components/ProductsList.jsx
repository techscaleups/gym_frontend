import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterSidebar from './FilterSidebar/FilterSidebar';
import { useSearchParams, Link } from 'react-router-dom';
import { API_BASE } from '../constants/config';
export const API_image = "https://techscaleups.in/gym_backend";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filters from URL
  const filtersFromURL = {
    category: searchParams.getAll('category'),
    brand: searchParams.getAll('brand'),
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || ''
  };

  // Fetch products from backend based on filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE}/products?${searchParams.toString()}`;
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  // Handle filter changes and update URL search params
  const handleFilterChange = (type, value) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (type === 'minPrice' || type === 'maxPrice') {
      if (value === '' || value === 0) {
        newParams.delete(type);
      } else {
        newParams.set(type, value);
      }
    } else {
      const values = newParams.getAll(type);
      const exists = values.includes(value);
      const updatedValues = exists
        ? values.filter((v) => v !== value)
        : [...values, value];

      newParams.delete(type);
      updatedValues.forEach((v) => newParams.append(type, v));
    }

    setSearchParams(newParams);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Filter Sidebar */}
        <FilterSidebar
          selectedFilters={filtersFromURL}
          onFilterChange={handleFilterChange}
          clearFilters={clearFilters}
        />

        {/* Products Grid */}
        <div className="col-12 col-md-9">
          <h3 className="mb-4">Gym & Fitness Products</h3>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length > 0 ? (
            <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {products.map((product) => (
                <Link
                  to={`/ProductDetails/${product.slug}`}
                  key={product._id}
                  className="text-decoration-none text-dark"
                >
                  <div className="card h-100 shadow-sm">
                    <img
                      src={
                        product.images?.length > 0
                          ? product.images[0].startsWith('http')
                            ? product.images[0]
                            : `${API_image}${product.images[0]}`
                          : '/placeholder.jpg'
                      }
                      alt={product.name || 'Product Image'}
                      className=" responsive-image"
                     
                    />
                    <div className="card-body">
                      <div className="card-title">{product.name}</div>
                      <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                        Brand <strong>{product.brand}</strong>
                      </p>
                      <div className="card-text">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          ) : (
            <div className="alert alert-warning">No products match your filters.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
