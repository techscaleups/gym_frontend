import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE } from '../constants/config';
import axios from 'axios';

const Header = () => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUserId) {
      setUserId(storedUserId);
      setUserName(storedUser?.name || 'User Name');
      setUserEmail(storedUser?.email || 'user@example.com');
      fetchCartCount(storedUserId);
      fetchWishlistCount(storedUserId);
    }

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCartCount = async (uid) => {
    try {
      const res = await axios.get(`${API_BASE}/cart/user/${uid}`);
      const totalQty = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQty);
    } catch (err) {
      console.error('Failed to fetch cart count', err);
    }
  };

  const fetchWishlistCount = async (uid) => {
    try {
      const res = await axios.get(`${API_BASE}/wishlist/user/${uid}`);
      setWishlistCount(res.data.length || 0);
    } catch (err) {
      console.error('Failed to fetch wishlist count', err);
    }
  };

  const handleLogout = () => {
    setTimeout(() => {
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      setUserId('');
      setUserName('');
      setUserEmail('');
      setCartCount(0);
      setWishlistCount(0);
      setShowProfile(false);
      toast('Logged out successfully');
      navigate('/');
    }, 100);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const toggleProfile = () => setShowProfile((prev) => !prev);

  return (
    <>
      {/* Desktop Header */}
      <div className="bg-white shadow-sm d-none d-lg-block sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center py-2">
          <NavLink to="/" className="fw-bold fs-4 text-decoration-none text-primary">
            FitFlex
          </NavLink>

          {/* Search Bar */}
          <form className="d-flex" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              className="form-control me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '400px' }}
            />
            <button className="btn btn-outline-primary" type="submit">Search</button>
          </form>

          <div className="d-flex align-items-center gap-4">
            <NavLink to="/wishlist" className="text-dark position-relative fs-5">
              <FaHeart />
              {wishlistCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            <NavLink to="/cart" className="text-dark position-relative fs-5">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {userId ? (
              <div className="position-relative" ref={profileRef}>
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="User"
                  width="28"
                  height="28"
                  className="rounded-circle border border-dark"
                  onClick={toggleProfile}
                  style={{ cursor: 'pointer' }}
                />
                {showProfile && (
                  <div
                    className="position-absolute bg-white shadow border rounded p-3"
                    style={{ top: '130%', right: 0, zIndex: 999 }}
                  >
                    <p className="mb-1 fw-semibold">{userName}</p>
                    <p className="mb-2 small text-muted">{userEmail}</p>
                    <button
                      className="btn btn-sm btn-outline-danger w-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="text-dark fw-semibold small text-decoration-none">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="d-lg-none bg-white shadow-sm px-3 py-2 sticky-top">
        <div className="d-flex justify-content-between align-items-center">
          <NavLink className="fw-bold text-primary fs-5 text-decoration-none" to="/">
            FitFlex
          </NavLink>
          <form className="d-flex me-2" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              className="form-control form-control-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '150px' }}
            />
          </form>
          <div className="d-flex align-items-center gap-3">
            <NavLink to="/wishlist" className="text-dark position-relative fs-5">
              <FaHeart />
              {wishlistCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/cart" className="text-dark position-relative fs-5">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
                  {cartCount}
                </span>
              )}
            </NavLink>
            {userId ? (
              <div className="profile-dropdown" ref={profileRef}>
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="User"
                  width="28"
                  height="28"
                  className="rounded-circle border border-dark"
                  onClick={toggleProfile}
                  style={{ cursor: 'pointer' }}
                />
                {showProfile && (
                  <div className="dropdown-content shadow mt-2">
                    <p className="mb-1 fw-semibold">{userName}</p>
                    <p className="mb-2 small text-muted">{userEmail}</p>
                    <button
                      className="btn btn-sm btn-outline-danger w-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="text-dark fw-semibold small text-decoration-none">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

     

      <style>{`
        .profile-dropdown {
          position: relative;
        }
        .dropdown-content {
          position: absolute;
          top: 130%;
          right: 0;
          background-color: #fff;
          min-width: 200px;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 12px;
          z-index: 1000;
        }
        .badge {
          font-size: 0.65rem;
          padding: 3px 6px;
        }
        @media (max-width: 768px) {
          .dropdown-content {
            top: 110%;
            min-width: 180px;
            padding: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
