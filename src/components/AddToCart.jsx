import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE } from '../constants/config';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const productData = searchParams.get('productData');

    if (productData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(productData));
        const newItem = {
          product: {
            _id: decoded.id,
            name: decoded.name,
            price: decoded.price,
            discountPrice: decoded.price,
            images: [decoded.image],
          },
          selectedSize: decoded.size || 'default',
          selectedColor: decoded.color || 'default',
          quantity: parseInt(decoded.quantity) || 1,
          mergedIds: [decoded.id + '_url'],
        };
        setCartItems([newItem]);
      } catch (err) {
        console.error('Invalid product data in URL:', err);
        fetchCart();
      }
    } else {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    if (!userId) {
      toast.error('User not logged in!');
      return navigate('/');
    }

    try {
      const res = await axios.get(`${API_BASE}/cart/user/${userId}`);
      const mergedMap = new Map();

      res.data.forEach(item => {
        const size = item.selectedSize || 'default';
        const color = item.selectedColor || 'default';
        const key = `${item.product._id}_${size}_${color}`;

        if (mergedMap.has(key)) {
          const existing = mergedMap.get(key);
          existing.quantity += item.quantity;
          existing.mergedIds.push(item._id);
        } else {
          mergedMap.set(key, {
            ...item,
            selectedSize: size,
            selectedColor: color,
            mergedIds: [item._id],
          });
        }
      });

      setCartItems([...mergedMap.values()]);
    } catch (err) {
      console.error('Cart fetch error:', err);
      toast.error('Failed to fetch cart');
    }
  };

  const handleRemoveItem = async (mergedIds) => {
    try {
      await Promise.all(
        mergedIds.map(id =>
          id.endsWith('_url') ? Promise.resolve() : axios.delete(`${API_BASE}/cart/${id}`)
        )
      );
      setCartItems(items => items.filter(item => !item.mergedIds.some(id => mergedIds.includes(id))));
      toast.success('Item removed!');
    } catch (err) {
      console.error('Remove error:', err);
      toast.error('Failed to remove item!');
    }
  };

 const handleQuantityChange = async (index, delta) => {
  const updated = [...cartItems];
  const item = updated[index];
  const newQty = item.quantity + delta;

  if (newQty < 1) return handleRemoveItem(item.mergedIds);

  updated[index].quantity = newQty;
  setCartItems(updated);

  const cartItemId = item.mergedIds?.[0];
  if (!cartItemId || cartItemId.endsWith('_url')) return;

  try {
    await axios.put(`${API_BASE}/cart/quantity/${cartItemId}`, {
      quantity: newQty,
    });
    toast.success('Quantity updated!');
  } catch (err) {
    console.error('Quantity update error:', err);
    toast.error('Failed to update quantity');
  }
};


  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shipping = 5;
  const gst = subtotal * 0.05;
  const total = subtotal + shipping + gst;

  const handleCheckout = () => {
    const summary = {
      items: cartItems.map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
      })),
      subtotal,
      shipping,
      gst,
      total,
      refCode,
    };

    navigate('/checkout', { state: summary });
  };

  return (
    <div className="container py-4">
      <ToastContainer position="bottom-right" autoClose={2000} />
      <h2 className="mb-4 text-center text-md-start">Your Cart</h2>

      <div className="row gy-4">
        <div className="col-lg-8">
          {cartItems.length === 0 ? (
            <p className="text-muted">Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => {
              const product = item.product || {};
              const price = product.price || 0;
              const discountPrice = product.discountPrice || price;

              return (
                <div
                  key={`${product._id}_${item.selectedSize}_${item.selectedColor}`}
                  className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-4 border-bottom pb-3 gap-3"
                >
                  <div className="d-flex flex-column flex-sm-row align-items-start gap-3 w-100">
                    <img
                      src={
                        product.images?.[0]?.startsWith('http')
                          ? product.images[0]
                          : `http://localhost:3001${product.images?.[0]}`
                      }
                      alt={product.name || 'Product'}
                      className="img-fluid rounded"
                      style={{ width: '100%', maxWidth: '150px', height: '150px', objectFit: 'cover' }}
                      onError={(e) => (e.target.src = '/placeholder.jpg')}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{product.name}</h6>
                      <h5 className="mb-2">
                        ₹{discountPrice.toFixed(2)}{' '}
                        {discountPrice < price && (
                          <span className="text-muted fs-6 text-decoration-line-through ms-2">
                            ₹{price.toFixed(2)}
                          </span>
                        )}
                      </h5>
                      <p className="text-muted mb-1">Color: {item.selectedColor}</p>
                      <p className="text-muted mb-2">Size: {item.selectedSize}</p>
                    </div>
                  </div>

                  <div className="text-md-end w-100 w-md-auto">
                    <div className="d-flex justify-content-between justify-content-md-end align-items-center mb-2 gap-2">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(index, -1)}>
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(index, 1)}>
                        +
                      </button>
                    </div>
                    <button className="btn btn-danger btn-sm mt-2 w-100 w-md-auto" onClick={() => handleRemoveItem(item.mergedIds)}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="col-lg-4">
            <div className="card p-4 shadow-sm sticky-top" style={{ top: '100px' }}>
              <h5 className="mb-3">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Total Items</span>
                <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2 text-success">
                <span>You Save</span>
                <span>
                  ₹
                  {cartItems.reduce((save, item) => {
                    const { price = 0, discountPrice = price } = item.product;
                    return save + (price - discountPrice) * item.quantity;
                  }, 0).toFixed(2)}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>GST (5%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>

              <hr />
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button className="btn btn-primary w-100" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
