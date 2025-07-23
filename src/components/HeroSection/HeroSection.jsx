import React from 'react';


const HeroSection = () => {
  return (
    <div
      className="hero-section d-flex align-items-center justify-content-center text-center text-white"
      style={{
        backgroundImage: 'url(/src/assets/images/herobanner.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '50vh',
        position: 'relative',
      }}
    >
      <div className="overlay position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}></div>

      <div className="container position-relative">
        <h1 className="display-4 ">Unleash Your Inner Athlete</h1>
        <p className=" mb-4">Elevate your fitness journey with premium gear and supplements.</p>
        <a href="/products" className="btn btn-primary btn-lg">Shop Now</a>
      </div>
    </div>
  );
};

export default HeroSection;
