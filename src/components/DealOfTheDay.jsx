import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../constants/config';

const DealOfTheDay = () => {
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/deals/current`)
      .then(res => {
          console.log('Deal Data:', res.data);  // 🔍 Check if imageBase64 looks right
    setDeal(res.data);
      })
      .catch(err => console.error('Error fetching deal:', err));
  }, []);

  useEffect(() => {
    if (!deal?.dealEndTime) return;
    const timer = setInterval(() => updateCountdown(deal.dealEndTime), 1000);
    return () => clearInterval(timer);
  }, [deal]);

  const updateCountdown = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      setExpired(true);
      return;
    }

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setTimeLeft({ hours, minutes, seconds });
  };

  const handleBuyNow = () => {
    const queryParams = new URLSearchParams({
      name: deal.name,
      price: deal.price,
      qty: 1,
    }).toString();

    navigate(`/checkout?${queryParams}`);
  };

  if (!deal || timeLeft === null) return <p className="">Loading Deal...</p>;

  return (
    <section className="pt-3 pb-5" style={{ backgroundColor: '#111a14', color: '#fff' }}>
      <div className="container">
        <h5 className="fw-bold py-4">Deal of the Day</h5>

        <div className="row g-4 align-items-center">
          <div className="col-12 col-md-5 text-center">
            <img
              src={deal.imageBase64}
              alt={deal.name}
              className="img-fluid rounded"
              style={{ maxWidth: '300px', height: 'auto' }}
            />
          </div>

          <div className="col-12 col-md-7">
            <p className="small mb-3">Limited Time Offer</p>
            <h6 className="fw-bold">{deal.name}</h6>
            <p className="mb-2">{deal.description}</p>
            <p className="fw-bold text-success fs-5">₹ {deal.price}</p>

            {!expired ? (
              <button className="btn btn-success btn-sm" onClick={handleBuyNow}>
                Buy Now
              </button>
            ) : (
              <button className="btn btn-secondary btn-sm" disabled>
                Deal Expired
              </button>
            )}
          </div>
        </div>

        <div className="row text-center mt-5">
          {['Hours', 'Minutes', 'Seconds'].map((label, i) => {
            const val = [timeLeft.hours, timeLeft.minutes, timeLeft.seconds][i]
              .toString()
              .padStart(2, '0');

            return (
              <div className="col-4" key={i}>
                <div className="bg-dark rounded py-2">
                  <h5 className="mb-0">{val}</h5>
                </div>
                <small>{label}</small>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;
