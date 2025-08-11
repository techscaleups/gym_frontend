import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE } from '../constants/config';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const name = searchParams.get('name');
  const price = searchParams.get('price');
  const qty = searchParams.get('qty');
  const id = searchParams.get('id');
  const refCode = searchParams.get('ref');
  const userId = localStorage.getItem('userId');

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

  const summary = location.state || (
    name && price && qty
      ? {
          items: [{ _id: id || '', name, price: parseFloat(price), quantity: parseInt(qty) }],
          subtotal: parseFloat(price) * parseInt(qty),
          shipping: 50,
          gst: parseFloat(price) * parseInt(qty) * 0.18,
          total: parseFloat(price) * parseInt(qty) + 50 + (parseFloat(price) * parseInt(qty) * 0.18),
          refCode: refCode || '',
        }
      : null
  );

  useEffect(() => {
    if (!summary) {
      toast.error("Invalid checkout. Redirecting...");
      setTimeout(() => navigate('/'), 2000);
    }
  }, [summary, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.address.trim() &&
      formData.city.trim() &&
      formData.postalCode.trim() &&
      formData.country.trim()
    );
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const createRazorpayOrder = async (amountInPaise) => {
    const res = await axios.post(`${API_BASE}/payment/create-order`, { amount: amountInPaise });
    return res.data;
  };

  const verifyRazorpaySignature = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/payment/verify-payment`, data);
      return res.data.success;
    } catch {
      return false;
    }
  };

  const clearCart = async () => {
    try {
      if (userId) {
        await axios.delete(`${API_BASE}/cart/clear/${userId}`);
      }
    } catch (err) {
      console.error('Cart clear error:', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      toast.error('You must be logged in to place an order.');
      return navigate('/login');
    }

    setIsPlacingOrder(true);

    if (!summary?.items || summary.items.length === 0) {
      toast.error('Your cart is empty.');
      setIsPlacingOrder(false);
      return;
    }

    if (!isFormValid()) {
      toast.error('Please fill in all required fields.');
      setIsPlacingOrder(false);
      return;
    }

    const baseOrderData = {
      userId,
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
      refCode: summary.refCode || '',
    };

    // ✅ Cash on Delivery flow
    if (formData.paymentMethod === 'Cash on Delivery') {
      try {
        const res = await axios.post(`${API_BASE}/orders`, baseOrderData); // fixed endpoint
        if (res.data.success) {
          await clearCart();
          toast.success('Order placed successfully!');
          navigate('/orders', { state: { orderId: res.data.orderId } });
        } else {
          toast.error(res.data.message || 'Order failed.');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Delivery is not available to your location');
      } finally {
        setIsPlacingOrder(false);
      }
      return;
    }

    // ✅ Online Payment flow
    const isRzpLoaded = await loadRazorpayScript();
    if (!isRzpLoaded) {
      toast.error('Failed to load Razorpay SDK.');
      setIsPlacingOrder(false);
      return;
    }

    try {
      const amountInPaise = Math.round(summary.total * 100);
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
            toast.error('Payment verification failed.');
            return;
          }

          const finalOrder = {
            ...baseOrderData,
            paymentMethod: 'Online Payment',
            paymentId: response.razorpay_payment_id,
          };

          const result = await axios.post(`${API_BASE}/orders`, finalOrder); // fixed endpoint
          if (result.data.success) {
            await clearCart();
            toast.success('Order placed successfully!');
            navigate('/orders', { state: { orderId: result.data.orderId } });
          } else {
            toast.error('Order creation failed after payment.');
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
        toast.error(`Payment failed: ${res.error.description || 'Try again'}`);
      });

      rzp.open();
    } catch (err) {
      toast.error(err.message || 'Payment error. Try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <Container className="mt-4 pb-5">
      <h2>Checkout</h2>
      <ToastContainer autoClose={2000} />
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
            <Button
              className="w-100 py-2"
              variant="primary"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? 'Processing...' : 'Place Order'}
            </Button>
          </Form>
        </Col>
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold">Order Summary</h5>
              {summary?.items?.map((item, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Subtotal</span>
                <span>₹{(summary?.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Shipping</span>
                <span>₹{(summary?.shipping || 0).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>GST (18%)</span>
                <span>₹{(summary?.gst || 0).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-3">
                <span>Total</span>
                <span>₹{(summary?.total || 0).toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
