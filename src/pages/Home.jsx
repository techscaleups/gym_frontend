import React  from "react";
import Navbar from "../commoncomponents/Navbar";
import HeroSection from "../components/HeroSection/HeroSection";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import HotPicks from "../components/HotPicks";
import DealOfTheDay from "../components/DealOfTheDay";
import BrandsWeTrust from "../components/BrandsWeTrust";
import VideoPromo from "../components/VideoPromo";
import Newsletter from "../components/Newsletter"
import Footer from "../commoncomponents/Footer";


function Home() {
  return (
    <>
    <Navbar />
    <HeroSection />
    <Categories />
    <FeaturedProducts />
    <HotPicks />
    <DealOfTheDay />
    <BrandsWeTrust />
    <VideoPromo />
    <Newsletter />
    <Footer />
    
    </>
  )
}

export default Home;
