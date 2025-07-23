// src/pages/WishlistPage.js (or WishlistPage.jsx)
import React from "react";
import WishlistComponent from "../components/Wishlist";
import Navbar from "../commoncomponents/Navbar";

function WishlistPage() {
  return (
    <>
      <Navbar />
      <WishlistComponent />
    </>
  );
}

export default WishlistPage;
