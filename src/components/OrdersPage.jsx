import React, { useState } from 'react';
import axios from 'axios';
import { Button, Alert, Spinner } from 'react-bootstrap';

const PlaceOrder = ({ cartItems, totalAmount, paymentMethod }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const userId = localStorage.getItem('userId');

  const handlePlaceOrder = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await axios.post(`${API_BASE}/orders`, {
        userId,
        items: cartItems,
        totalAmount,
        paymentMethod,
      });

      if (response.data.success) {
        setSuccessMsg('Order placed successfully!');
      } else {
        setErrorMsg('Order failed. Please try again.');
      }
    } catch (error) {
      setErrorMsg('Order failed. Please try again.');
      console.error('Order error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <Button variant="primary" onClick={handlePlaceOrder} disabled={loading}>
        {loading ? <Spinner size="sm" animation="border" /> : 'Place Order'}
      </Button>
    </div>
  );
};

export default PlaceOrder;
