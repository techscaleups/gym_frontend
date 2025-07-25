import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { FaHeart, FaStar } from 'react-icons/fa';
import { API_BASE } from '../constants/config';
import { toast, ToastContainer } from 'react-toastify'; // ✅ FIXED
import 'react-toastify/dist/ReactToastify.css';

export const API_image = "https://techscaleups.in/gym_backend";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await axios.get(`${API_BASE}/products/search?query=${query}`);
        setProducts(res.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again later.');
      }

      if (userId) {
        try {
          const res = await axios.get(`${API_BASE}/wishlist/user/${userId}`);
          const ids = res.data.map((item) => item.product._id);
          setWishlist(ids);
        } catch (err) {
          console.error('Failed to fetch wishlist:', err);
        }
      }

      setLoading(false);
    };

    if (query.trim()) {
      fetchData();
    }
  }, [query, userId, reload]);

  const toggleWishlist = async (productId) => {
    if (!userId) return toast.warning('Please login to use wishlist');

    try {
      const res = await axios.post(`${API_BASE}/wishlist/toggle`, {
        userId,
        productId,
      });

      const message = res.data?.message || 'Wishlist updated';
      toast(message);
      setReload((prev) => !prev);
    } catch (err) {
      console.error('Wishlist toggle failed:', err);
      toast('Failed to update wishlist');
    }
  };

  return (
    <Container className="mt-4 mb-5">
      {/* ✅ Toast container for showing notifications */}
      <ToastContainer
      
        autoClose={3000}
  
      />

      <h4 className="mb-4">
        Search Results {query && <span>for "<strong>{query}</strong>"</span>}
      </h4>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted">No products found for "{query}".</p>
      ) : (
        <Row>
          {products.map((product) => (
            <Col xs={6} sm={6} md={4} lg={3} className="mb-4" key={product._id}>
              <Card className="h-100 shadow-sm position-relative">
                <Card.Img
                  variant="top"
                  src={
                    product.images?.[0]
                      ? `${API_image}${product.images[0]}`
                      : 'https://via.placeholder.com/300x200?text=No+Image'
                  }
                  alt={product.name}
                  className="responsive-image"
                />

                {/* Wishlist icon */}
                <Button
                  variant="light"
                  className="position-absolute top-0 end-0 m-2 p-1 rounded-circle shadow"
                  onClick={() => toggleWishlist(product._id)}
                >
                  <FaHeart color={wishlist.includes(product._id) ? 'red' : 'gray'} />
                </Button>

                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-6 text-truncate mb-1">{product.name}</Card.Title>
                  <small className="text-muted mb-1">Brand: {product.brand || 'N/A'}</small>

                  <div className="d-flex align-items-center mb-1">
                    <FaStar className="text-warning me-1" size={14} />
                    <small>{product.rating || 0}/5</small>
                  </div>

                  <div className="mb-1">
                    <strong className="card-text me-2">
                      ₹{product.discountPrice || product.price}
                    </strong>
                    {product.discountPrice && (
                      <small className="text-muted text-decoration-line-through">
                        ₹{product.price}
                      </small>
                    )}
                  </div>

                  <small
                    className={`fw-semibold mb-2 ${
                      product.stock > 0 ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </small>

                  <a
                    href={`/ProductDetails/${product.slug}`}
                    className="btn btn-outline-success w-100 mt-auto"
                  >
                    View Product
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SearchResults;
