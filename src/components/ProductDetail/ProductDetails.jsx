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

  const [reviewUser, setReviewUser] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    const ref = new URLSearchParams(location.search).get('ref');
    if (ref) localStorage.setItem('referralCode', ref);
  }, [location.search]);

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
        toast.error('Error fetching product');
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
      toast('Please login to add items to the cart.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (product.stock < 1) {
      toast('Product is out of stock!');
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      toast('Please select a size.');
      return;
    }

    if (product.colors?.length && !selectedColor) {
      toast('Please select a color.');
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

    const viewcart = JSON.parse(localStorage.getItem('viewcart')) || [];
    const existing = viewcart.find(
      item =>
        item.id === cartItem.id &&
        item.size === cartItem.size &&
        item.color === cartItem.color
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      viewcart.push(cartItem);
    }

    localStorage.setItem('viewcart', JSON.stringify(viewcart));
    toast('Product added to cart!');
    navigate('/viewcart?marketplace=FitFlex');
  };

  const handleAddToWishlist = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user?.['_id']) {
      toast('Please login to add items to wishlist.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (product.sizes?.length && !selectedSize) {
      toast('Please select a size.');
      return;
    }

    if (product.colors?.length && !selectedColor) {
      toast('Please select a color.');
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
      toast('Product added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast('Failed to add to wishlist.');
    }
  };

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewUser || !reviewComment || !reviewRating) {
      toast('Please complete all review fields.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/products/${product._id}/reviews`, {
        user: reviewUser,
        comment: reviewComment,
        rating: parseInt(reviewRating)
      });

      const updatedProduct = await axios.get(`${API_BASE}/products/slug/${slug}`);
      setProduct(updatedProduct.data);
      setRatingsData(calculateRatingsData(updatedProduct.data.reviews));
      toast('Thank you for your review!');

      setReviewUser('');
      setReviewRating(5);
      setReviewComment('');
    } catch (error) {
      console.error('Review submit error:', error);
      toast('Failed to submit review');
    }
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
              <img
                key={idx}
                src={`https://techscaleups.in/gym_backend/${encodeURIComponent(img)}`}
                alt={`Product ${idx + 1}`}
                className="img-fluid rounded shadow-sm"
                style={{ width: '100%', height: '600px', objectFit: 'cover', objectPosition: 'center' }}
                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
              />
            ))}
          </div>
        </Col>

        <Col md={6}>
          <h3 className="fw-bold">{product.name}</h3>
          <p className="">{product.description}</p>
          <p><strong>Brand</strong> {product.brand}</p>

          <h5 className="mb-3 card-text">
            ₹{product.discountPrice && product.discountPrice < product.price
              ? product.discountPrice
              : product.price}
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-muted fs-6 text-decoration-line-through ms-2">
                ₹{product.price}
              </span>
            )}
            {' '}
            <Badge bg="success">In Stock {product.stock}</Badge>
          </h5>

          <ProductRating product={product} ratingsData={ratingsData} />

          <div className="product-options">
            {product.sizes?.length > 0 && (
              <div className="product-size">
                <SizeSelector
                  className="size-selector"
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                />
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="product-color">
                <ColorSwatch
                  colors={product.colors}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                />
              </div>
            )}
          </div>


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

    
       <h5 className="pt-5 pb-3">Customer Reviews</h5>
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
              <div>{review.comment}</div>
            </Card.Body>
          </Card>
        ))
      )}

      <hr />
      <h6 className="mb-3 mt-4">Leave a Review</h6>
      <Form onSubmit={handleReviewSubmit}>
        <Row className="g-3">
          <Col md={4}>
            <Form.Control
              placeholder="Your name"
              value={reviewUser}
              onChange={(e) => setReviewUser(e.target.value)}
              required
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={reviewRating}
              onChange={(e) => setReviewRating(e.target.value)}
              required
            >
              <option value="">Rating</option>
              {[5, 4, 3, 2, 1].map((val) => (
                <option key={val} value={val}>{val} Star</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={12}>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write your review..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              required
            />
          </Col>
          <Col md={12}>
            <Button className='py-2' variant="primary" type="submit">Submit Review</Button>
          </Col>
        </Row>
      </Form>

      <ToastContainer autoClose={2000} />
    </Container>
  );
};

export default ProductDetails;
