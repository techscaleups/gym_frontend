import React from 'react';
import images from '../../images/ima';

const HeroSection = () => {
  return (
    <div
      className="hero-section d-flex align-items-center justify-content-center text-white text-center"
      style={{
        backgroundImage: `url(${images.herobanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '75vh',
        position: 'relative',
      }}
    >
      {/* Overlay for dark tint */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      ></div>

      <div className="container position-relative">
        <h1 className="fw-bold display-4 mb-3">Unleash Your Inner Athlete</h1>
        <p className="lead mb-4">Elevate your fitness journey with premium gear and supplements.</p>
        <a href="/products" className="btn btn-outline-light btn-lg px-4 py-2 shadow">
          Shop Now
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
