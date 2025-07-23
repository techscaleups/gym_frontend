import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

const RatingProgress = ({ product }) => {
  const [ratingsData, setRatingsData] = useState([]);

  useEffect(() => {
    if (product && product.reviews && product.reviews.length > 0) {
      const ratingCount = [0, 0, 0, 0, 0]; // For 1 to 5 stars

      product.reviews.forEach((review) => {
        const rating = Math.floor(review.rating); // 1 to 5
        if (rating >= 1 && rating <= 5) {
          ratingCount[rating - 1]++;
        }
      });

      const totalReviews = product.reviews.length;
      const formatted = ratingCount.map((count, index) => ({
        star: `${5 - index}★`,
        value: Math.round((ratingCount[4 - index] / totalReviews) * 100),
      }));

      setRatingsData(formatted);
    }
  }, [product]);

  return (
    <div>
      {/* Rating stars */}
      <div className="mb-2">
        <strong>Rating:</strong>{' '}
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {product.rating >= i + 1 ? '⭐' : product.rating >= i + 0.5 ? '⭐' : '☆'}
          </span>
        ))}
        <span className="ms-2">({product.rating})</span>
      </div>

      {/* Rating Progress */}
    
    </div>
  );
};

export default RatingProgress;
