import React  from "react";
import Navbar from "../commoncomponents/Navbar";
import ProductDetails from "../components/ProductDetail/ProductDetails";
import Productgrid from "../components/ProductDetail/Productgrid";


function ProductDetail() {
  return (
    <>
    <Navbar />
    <ProductDetails />
    <Productgrid />
    </>
  );
}

export default ProductDetail;
