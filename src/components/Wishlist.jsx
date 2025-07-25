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
              <Row className="align-items-center">
                <Col xs={2}>
                  <Image
                    src={
                      item.product?.image
                        ? `https://techscaleups.in/gym_backend/${item.product.image}`
                        : '/placeholder.jpg'
                    }
                    alt={item.product?.name || 'No Image'}
                    fluid
                    rounded
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </Col>
                <Col xs={6}>
                  <h5>{item.product?.name || 'Unnamed Product'}</h5>
                  <small
                    className={
                      item.product?.stock > 0 ? 'text-success' : 'text-danger'
                    }
                  >
                    {item.product?.stock > 0 ? 'In stock' : 'Out of stock'}
                  </small>
                </Col>
                <Col xs={4} className="text-end">
                  <Button
                    variant="outline-success"
                    className="text-success me-2 custom-hover-white"
                    disabled={item.product?.stock < 1}
                    onClick={() => handleAddToCart(item.product)}
                  >
                    {item.product?.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>

                  <Button
                    variant="outline-danger px-4"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </Button>
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
