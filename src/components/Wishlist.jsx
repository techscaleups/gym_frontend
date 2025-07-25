import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  ListGroup,
  Image,
  Row,
  Col,
  Container,
  Alert,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../constants/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      toast.error('User not logged in!');
      navigate('/login');
      return;
    }
    setUserId(storedUserId);

    axios
      .get(`${API_BASE}/wishlist/user/${storedUserId}`)
      .then((res) => setWishlist(res.data))
      .catch((err) => console.error('Error fetching wishlist:', err));
  }, [navigate]);

  const handleRemove = (id) => {
    axios
      .delete(`${API_BASE}/wishlist/remove/${id}`)
      .then(() => {
        setWishlist((prev) => prev.filter((item) => item._id !== id));
        toast('Item removed from wishlist!');
      })
      .catch((err) => console.error('Error removing item:', err));
  };

  const handleAddToCart = async (product) => {
    if (!product || product.stock < 1) {
      toast.error('Product is out of stock!');
      return;
    }

    const selectedSize = product.sizes?.[0] || 'default';
    const selectedColor = product.colors?.[0] || 'default';
    const quantity = 1;

    try {
      await axios.post(`${API_BASE}/cart`, {
        userId,
        productId: product._id,
        quantity,
        selectedSize,
        selectedColor,
      });

      toast('Product added to cart!', {

      });

      window.dispatchEvent(new Event('cart-changed')); 
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast('Error adding to cart.');
    }
  };

  if (!userId) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Please login to view your wishlist.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <ToastContainer />
      <h2 className="mb-4">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
   <ListGroup variant="flush">
  {wishlist.map((item) => (
    <ListGroup.Item key={item._id} className="py-3">
      <Row className="align-items-center gy-3">
        {/* Image */}
        <Col xs={12} md={2} className="text-center">
          <Image
            src={
              item.product?.image
                ? `https://techscaleups.in/gym_backend/${item.product.image}`
                : '/placeholder.jpg'
            }
            alt={item.product?.name || 'No Image'}
            fluid
            rounded
            style={{ maxHeight: '180px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = '/placeholder.jpg';
            }}
          />
        </Col>

        {/* Product Info */}
        <Col xs={12} md={6}>
          <h5 className="text-center text-md-start">{item.product?.name || 'Unnamed Product'}</h5>
          <div className="text-center text-md-start">
            <small
              className={
                item.product?.stock > 0 ? 'text-success' : 'text-danger'
              }
            >
              {item.product?.stock > 0 ? 'In stock' : 'Out of stock'}
            </small>
          </div>
        </Col>

        {/* Action Buttons */}
        <Col xs={12} md={4} className="text-center text-md-end">
          <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-end align-items-center gap-2">
            <Button
              variant="outline-success"
              className="text-success custom-hover-white w-100 w-md-auto"
              disabled={item.product?.stock < 1}
              onClick={() => handleAddToCart(item.product)}
            >
              {item.product?.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            <Button
              variant="outline-danger px-4 w-100 w-md-auto"
              onClick={() => handleRemove(item._id)}
            >
              Remove
            </Button>
          </div>
        </Col>
      </Row>
    </ListGroup.Item>
  ))}
</ListGroup>

      )}
    </Container>
  );
};

export default Wishlist;
