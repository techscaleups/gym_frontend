import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { API_BASE } from '../constants/config';

const OrdersPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const highlightRef = useRef(null);

  const userId = localStorage.getItem('userId') || location.state?.user?.userId;
  const recentOrderId = location.state?.orderId; // passed from CheckoutPage

  useEffect(() => {
    if (userId) {
      axios.get(`${API_BASE}/orders/user/${userId}`)
        .then(res => {
          if (res.data.success) {
            setOrders(res.data.orders);
          } else {
            setOrders([]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching orders:', err);
          setLoading(false);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (recentOrderId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [recentOrderId, orders]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="container py-4">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            ref={order._id === recentOrderId ? highlightRef : null}
            className={`border p-3 mb-3 ${order._id === recentOrderId ? 'bg-warning-subtle' : ''}`}
          >
            <h5>Order ID: {order._id}</h5>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            <p><strong>Payment:</strong> {order.paymentMethod}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <ul>
              {order.items?.map((item, index) => (
                <li key={index}>
                  {item.name} × {item.quantity} – ₹{item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
