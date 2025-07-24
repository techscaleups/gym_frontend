import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "../constants/config";
import images from "../images/ima";

function OTPLogin() {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: "", email: "" });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && otpSent) {
      setMessage("OTP expired. Please resend.");
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/send-otp`, { mobile });
      setIsNewUser(res.data.newUser);
      setOtpSent(true);
      setTimer(120);
      setMessage(res.data.message || "OTP sent to your mobile.");
    } catch (error) {
      setMessage("Error sending OTP.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (timer === 0) {
      setMessage("OTP expired. Please resend.");
      return;
    }

    try {
     const res = await axios.post(`${API_BASE}/verify-otp`,  {
        mobile,
        otp,
        ...(isNewUser ? userDetails : {}),
      });

      if (res.data.success && res.data.profile) {
        const userProfile = res.data.profile;

        // Save user details to localStorage
        localStorage.setItem("userId", userProfile.mobile);
        localStorage.setItem("user", JSON.stringify(userProfile));
        localStorage.setItem("userName", userProfile.name || "User");
        localStorage.setItem("userEmail", userProfile.email || "user@example.com");

        // If redirected from ProductDetails with product info
        const { state } = location;
        if (state?.action === "addToCart" && state.product) {
          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const existingItem = cart.find(
            item =>
              item.id === state.product.id &&
              item.size === state.product.size &&
              item.color === state.product.color
          );

          if (existingItem) {
            existingItem.quantity += state.product.quantity;
          } else {
            cart.push(state.product);
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          navigate("/cart");
        } else {
          navigate("/home");
        }

        setMessage("Logged in successfully.");
      } else {
        setMessage("Invalid OTP.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Login failed.");
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="w-100 mb-4">
        <img
          src={images.loginbanneer}
          alt="Banner"
          className="img-fluid rounded"
          style={{ maxHeight: "300px", objectFit: "cover", width: "100%" }}
        />
      </div>

      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center fw-bold mb-4">Welcome Back</h3>

        <form onSubmit={otpSent ? handleLogin : handleSendOTP}>
          <div className="mb-3">
            <input
              type="tel"
              className="form-control py-3"
              placeholder="Mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              pattern="[0-9]{10}"
              maxLength={10}
              required
              disabled={otpSent}
            />
          </div>

          {otpSent && (
            <div className="mb-3">
              <input
                type="text"
                className="form-control py-3"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={timer === 0}
              />
              <div className="text-end small text-muted mt-1">
                {timer > 0
                  ? `Time left: ${Math.floor(timer / 60)}:${(timer % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : "OTP expired"}
              </div>
            </div>
          )}

          {otpSent && isNewUser && (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control py-3"
                  placeholder="Full Name"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control py-3"
                  placeholder="Email Address"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-3 py-3">
            {otpSent ? "Log In with OTP" : "Send OTP"}
          </button>

          {message && (
            <div
              className={`alert text-center py-2 ${
                message.includes("successfully")
                  ? "alert-success"
                  : "alert-danger"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default OTPLogin;
