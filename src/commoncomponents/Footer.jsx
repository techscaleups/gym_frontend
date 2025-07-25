import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const handleComingSoon = () => {
    alert('Coming soon...');
  };

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row text-center text-start mb-3">
          <div className="col-6 col-md-3 mb-2">
            <button className="btn btn-link text-light text-decoration-none p-0" onClick={handleComingSoon}>
              About
            </button>

          </div>
          <div className="col-6 col-md-3 mb-2">
            <button className="btn btn-link text-light text-decoration-none p-0" onClick={handleComingSoon}>Contact</button>
          </div>
          <div className="col-6 col-md-3 mb-2">
            <button className="btn btn-link text-light text-decoration-none p-0" onClick={handleComingSoon}>Terms</button>
          </div>
          <div className="col-6 col-md-3 mb-2">
            <button className="btn btn-link text-light text-decoration-none p-0" onClick={handleComingSoon}>Privacy</button>
          </div>
        </div>

        <div className="row justify-content-center mb-3">
          <div className="col-auto">
            <FaFacebookF className="mx-2" />
            <FaTwitter className="mx-2" />
            <FaInstagram className="mx-2" />
          </div>
        </div>

        <div className="row text-center">
          <div className="col">
            <small>© 2023 TechScaleups. All rights reserved.</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
