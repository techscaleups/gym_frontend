import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../constants/config';

const HotPicks = () => {
  const [hotPicks, setHotPicks] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/products/getHotPicks`)
      .then(response => {
        setHotPicks(response.data); // Make sure your backend returns an array
      })
      .catch(error => {
        console.error('Error fetching hot picks:', error);
      });
  }, []);

  return (
    <section className="py-5">
      <div className="container">
        <h5 className="fw-bold py-4">Hot Picks</h5>
        <div className="row g-4">
          {hotPicks.slice(0, 6).map((product, index) => (
            <div className="col-6 col-md-2" key={index}>
              <div className="card border-0 shadow-sm h-100">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? `${API_BASE}${product.images[0]}`
                      : '/placeholder.jpg'
                  }
                  alt={product.name}
                  className="card-img-top rounded"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <div className="card-title mb-1">{product.name}</div>
                  <p className="card-text text-muted mb-0">₹{product.price}</p>
                </div>
              </div>
            </div>
          ))}

          {hotPicks.length === 0 && (
            <div className="text-muted">No hot picks available</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotPicks;
