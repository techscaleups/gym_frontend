import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../../constants/config';
import { API_image } from '../ProductsList';

const Productgrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenProductIds, setHiddenProductIds] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 🔁 Store hidden products to avoid showing again
  const fetchProducts = async (queryStr) => {
    setLoading(true);
    try {
      const url = `${API_BASE}/products?${queryStr}`;
      const res = await axios.get(url);
      const visibleProducts = res.data.filter(
        (p) => !hiddenProductIds.includes(p._id)
      );
      setProducts(visibleProducts);
    } catch (err) {
      console.error('Failed to fetch products:', err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentQuery = searchParams.toString();
    if (!currentQuery) {
      const savedQuery = localStorage.getItem('lastSearchParams');
      if (savedQuery) {
        navigate(`?${savedQuery}`, { replace: true });
        window.location.reload();
      } else {
        fetchProducts('');
      }
    } else {
      fetchProducts(currentQuery);
    }
  }, []);

  useEffect(() => {
    const query = searchParams.toString();
    if (query) {
      localStorage.setItem('lastSearchParams', query);
      fetchProducts(query);
    }
  }, [searchParams, hiddenProductIds]);

  // 🧠 Product click logic: first visit, else hide
  const handleProductClick = (product) => {
    const alreadyHidden = hiddenProductIds.includes(product._id);
    if (alreadyHidden) return;

    // First time: navigate to product detail
    if (product.slug) {
      window.location.href = `/ProductDetails/${product.slug}`;
    }

    // Add to hidden list for next render
    setHiddenProductIds((prev) => [...prev, product._id]);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Gym & Fitness Products</h3>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 0 ? (
        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {products.map((product) => (
            <div className="col" key={product._id}>
              <div
                className="card h-100 shadow-sm p-2"
                onClick={() => handleProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={
                    product.images?.length > 0
                      ? `${API_image}${product.images[0]}`
                      : '/placeholder.jpg'
                  }
                  alt={product.name}
                  className="card-img-top rounded"
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <div className="product_list_card-title">{product.name}</div>
                  <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                    Brand: <strong>{product.brand}</strong>
                  </p>
                  <p className="product_list_price">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-warning">No products match your filters.</div>
      )}
    </div>
  );
};

export default Productgrid;
