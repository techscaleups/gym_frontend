import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE } from '../../constants/config';

const CartManager = ({ product, selectedSize, selectedColor, quantity }) => {
  const userId = localStorage.getItem('userId');
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!userId) {
      toast('Please log in to add items to your cart.');
      setTimeout(() => navigate('/login'), 1000); 
      return;
    }

    if (product.stock < 1) {
      toast('Product is out of stock!');
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      toast('Please select a size.');
      return;
    }

    if (product.colors?.length > 0 && !selectedColor) {
      toast('Please select a color.');
      return;
    }

    const cartItem = {
      userId,
      productId: product._id,
      quantity: quantity || 1,
      selectedSize: selectedSize || null,
      selectedColor: selectedColor || null,
      addedAt: new Date()
    };

    try {
      const res = await axios.post(`${API_BASE}/cart/`, cartItem);
      toast.success('Product added to cart!');

      // Optional: Update local cart state
      fetchCartItems();

      // Navigate to /viewcart with marketplace query
      setTimeout(() => {
        navigate('/viewcart?marketplace=FitFlex');
      }, 1500); // Delay to let the toast show
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart.');
    }
  };

  const handleAddToWishlist = async () => {
    if (!userId) {
      toast('Please log in to add items to your wishlist.');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    const wishlistItem = {
      userId,
      productId: product._id,
      selectedSize: selectedSize || null,
      selectedColor: selectedColor || null,
      addedAt: new Date()
    };

    try {
      await axios.post(`${API_BASE}/wishlist/`, wishlistItem);
      toast.success('Product added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add product to wishlist.');
    }
  };

  const fetchCartItems = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE}/cart/user/${userId}`);
      setCartItems(res.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div>
      <div className="d-flex gap-4 mt-4">
        <Button
          variant="primary"
          className="w-100"
          onClick={handleAddToCart}
          disabled={!selectedSize && product?.sizes?.length > 0}
        >
          Add to Cart
        </Button>
        <Button
          variant="outline-secondary"
          className="w-100 py-3"
          onClick={handleAddToWishlist}
        >
          Add to Wishlist
        </Button>
      </div>

      {/* Toast container for pop-up messages */}
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default CartManager;
