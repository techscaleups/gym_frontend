import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { API_BASE } from '../constants/config';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const summary = location.state;

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'Cash on Delivery',
  });

  const [error, setError] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () =>
    formData.name && formData.email && formData.phone && formData.address &&
    formData.city && formData.postalCode && formData.country;

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const createRazorpayOrder = async (amountInPaise) => {
    try {
      const res = await axios.post(`${API_BASE}/payment/create-order`, { amount: amountInPaise });
      return res.data;
    } catch (error) {
      throw new Error('Failed to create Razorpay order');
    }
  };

  const verifyRazorpaySignature = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/payment/verify-payment`, data);
      return res.data.success;
    } catch {
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    setError('');
    setIsPlacingOrder(true);

    if (!summary?.items || summary.items.length === 0) {
      setError('Your cart is empty.');
      setIsPlacingOrder(false);
      return;
    }

    if (!isFormValid()) {
      setError('Please fill in all required fields.');
      setIsPlacingOrder(false);
      return;
    }

    const baseOrderData = {
      userId: '12345',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      items: summary.items.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: summary.total,
      placedAt: new Date().toISOString(),
    };

    if (formData.paymentMethod === 'Cash on Delivery') {
      try {
        const res = await axios.post(`${API_BASE}/orders/create`, baseOrderData);
        if (res.data.success) {
          navigate('/orders', { state: { orderId: res.data.orderId } });
        } else {
          setError(res.data.message || 'Order failed.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to place order.');
      } finally {
        setIsPlacingOrder(false);
      }
    } else {
      // Online payment flow
      const isRzpLoaded = await loadRazorpayScript();
      if (!isRzpLoaded) {
        setError('Failed to load Razorpay SDK.');
        setIsPlacingOrder(false);
        return;
      }

      try {
        const amountInPaise = Math.round(summary.total * 100); // ✅ Fixed conversion
        const razorpayOrder = await createRazorpayOrder(amountInPaise);

        const options = {
          key: 'rzp_live_MmV8shPATEBEeh',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'My Shop',
          description: 'Payment for Order',
          order_id: razorpayOrder.id,
          handler: async function (response) {
            const verified = await verifyRazorpaySignature({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verified) {
              setError('Payment verification failed.');
              return;
            }

            try {
              const finalOrder = {
                ...baseOrderData,
                paymentMethod: 'Online Payment',
                paymentId: response.razorpay_payment_id,
              };

              const result = await axios.post(`${API_BASE}/orders/create`, finalOrder);
              if (result.data.success) {
                navigate('/orders', { state: { orderId: result.data.orderId } });
              } else {
                setError('Order creation failed after payment.');
              }
            } catch {
              setError('Payment succeeded but order creation failed.');
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: '#3399cc' },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (res) {
          setError(`Payment failed: ${res.error.description || 'Try again'}`);
        });

        rzp.open();
      } catch (err) {
        setError(err.message || 'Payment error. Try again.');
      } finally {
        setIsPlacingOrder(false);
      }
    }
  };

  return (
    <Container className="mt-4 pb-5">
      <h2>Checkout</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6} className="p-4 shadow-sm bg-white">
          <Form>
            {['name', 'email', 'phone', 'address', 'city', 'postalCode', 'country'].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>{field[0].toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  value={formData[field]}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
                <option>Cash on Delivery</option>
                <option>Online Payment</option>
              </Form.Select>
            </Form.Group>

            <Button className="w-100" variant="primary" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
              {isPlacingOrder ? 'Processing...' : 'Place Order'}
            </Button>
          </Form>
        </Col>

        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold">Order Summary</h5>
              {summary?.items.map((item, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>₹{(summary.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span>₹{(summary.shipping || 0).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">GST (18%)</span>
                <span>₹{(summary.gst || 0).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-3">
                <span>Total</span>
                <span>₹{(summary.total || 0).toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
