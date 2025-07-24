import React, { useState, useEffect } from 'react';
import {
  Button, Form, Row, Col, Badge, Card, Container, Spinner
} from 'react-bootstrap';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ColorSwatch from './ColorSwatch';
import SizeSelector from './SizeSelector';
import ProductRating from './RatingProgress';
import ActionButtons from './ActionButtons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE } from '../../constants/config';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [ratingsData, setRatingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Save referral code if exists
  useEffect(() => {
    const ref = new URLSearchParams(location.search).get('ref');
    if (ref) localStorage.setItem('referralCode', ref);
  }, [location.search]);

  // Fetch product details by slug
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/slug/${slug}`);
        const data = res.data;
        setProduct(data);
        setRatingsData(data.ratingsData || calculateRatingsData(data.reviews));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const calculateRatingsData = (reviews = []) => {
    const count = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => count[r.rating]++);
    const total = reviews.length;
    return Object.entries(count).reverse().map(([star, value]) => ({
      star: parseInt(star),
      value: total ? Math.round((value / total) * 100) : 0
    }));
  };

  const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.['_id']) {
      toast.warning('⚠ Please login to add items to the cart.');
      navigate('/', { state: { from: location.pathname } });
      return;
    }

    if (product.stock < 1) {
      toast.error('❌ Product is out of stock!');
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      toast.warning('⚠ Please select a size.');
      return;
    }

    if (product.colors?.length && !selectedColor) {
      toast.warning('⚠ Please select a color.');
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor
    };

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(
      item =>
        item.id === cartItem.id &&
        item.size === cartItem.size &&
        item.color === cartItem.color
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('🛒 Product added to cart!');
  };

  const handleAddToWishlist = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user?.['_id']) {
      toast.warning('⚠ Please login to add items to wishlist.');
      navigate('/', { state: { from: location.pathname } });
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      toast.warning('⚠ Please select a size.');
      return;
    }

    if (product.colors?.length && !selectedColor) {
      toast.warning('⚠ Please select a color.');
      return;
    }

    const wishlistItem = {
      userId: user._id,
      productId: product._id,
      selectedSize: selectedSize || null,
      selectedColor: selectedColor || null,
      addedAt: new Date()
    };

    try {
      await axios.post(`${API_BASE}/wishlist`, wishlistItem);
      toast.success('💖 Product added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('❌ Failed to add to wishlist.');
    }
  };

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <p>Product not found.</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="g-4">
        <Col md={6}>
          <div className="d-flex flex-column gap-3">
            {product.images.map((img, idx) => (
          {images.map((img, idx) => (
  <img
    key={idx}
    src={`https://techscaleups.in/gym_backend/api/uploads/${encodeURIComponent(img)}`}
    alt={`Product ${idx + 1}`}
    className="img-fluid rounded shadow-sm"
    style={{
      width: '100%',
      height: '600px',
      objectFit: 'cover',
      objectPosition: 'center'
    }}
    onError={(e) => { e.target.src = '/placeholder.jpg'; }}
  />
))}

            ))}
          </div>
        </Col>

        <Col md={6}>
          <h3 className="fw-bold">{product.name}</h3>
          <p className="text-muted">{product.description}</p>
          <p><strong>Brand:</strong> {product.brand}</p>

          <h5 className="mb-3">
            ₹{product.discountPrice && product.discountPrice < product.price
              ? product.discountPrice
              : product.price}
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-muted fs-6 text-decoration-line-through ms-2">
                ₹{product.price}
              </span>
            )}
            {' '}
            <Badge bg="success">In Stock: {product.stock}</Badge>
          </h5>

          <ProductRating product={product} ratingsData={ratingsData} />

          {product.sizes?.length > 0 && (
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
          )}

          {product.colors?.length > 0 && (
            <ColorSwatch
              colors={product.colors}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          )}

          <Form.Group className="mb-3 mt-3">
            <Form.Label><strong>Quantity</strong></Form.Label>
            <div className="d-flex align-items-center gap-3">
              <Button variant="outline-secondary" onClick={decreaseQty} disabled={quantity === 1}>−</Button>
              <span style={{ minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
              <Button variant="outline-secondary" onClick={increaseQty} disabled={quantity === product.stock}>+</Button>
            </div>
          </Form.Group>

          <ActionButtons
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            quantity={quantity}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </Col>
      </Row>

      <h5 className="mt-5">Customer Reviews</h5>
      {product.reviews?.length === 0 ? (
        <p className="text-muted">No reviews yet.</p>
      ) : (
        product.reviews.map((review, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>
                {review.user || 'User'}{' '}
                <span className="text-warning">{'★'.repeat(review.rating)}</span>
              </Card.Title>
              <Card.Text>{review.comment}</Card.Text>
              <small className="text-muted">
                👍 {review.likes} ‧ 💬 {review.replies}
              </small>
            </Card.Body>
          </Card>
        ))
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </Container>
  );
};

export default ProductDetails;
