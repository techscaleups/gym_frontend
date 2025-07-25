import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { API_BASE } from '../constants/config';

const OrdersPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assuming user ID is passed via location state
  const userId = location.state?.user?.userId || "your-default-id";

  useEffect(() => {
    if (userId) {
      axios.get(`${API_BASE}/orders/user/${userId}`)
        .then(res => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching orders:', err);
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="container py-4">
      <h2> My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} className="border p-3 mb-3">
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
