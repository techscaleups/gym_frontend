import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { API_BASE } from '../constants/config';
export const API_image = "https://techscaleups.in/gym_backend";


const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/products/featured`);
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="">
      <div className="container">
        <h5 className=" py-4">Featured Products</h5>
        <Swiper
          slidesPerView={2}
          spaceBetween={16}
          breakpoints={{
            576: { slidesPerView: 1.5 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 4.5 },
          }}
          freeMode={true}
          modules={[FreeMode]}
        >
          {featuredProducts.map((product, index) => (
            <SwiperSlide key={index}>
              <Link to={`/ProductDetails/${product.slug}`} className="text-decoration-none">
                <div className="card border-0 shadow-sm">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? `${API_image}${product.images[0]}`
                        : '/placeholder.jpg'
                    }
                    alt={product.name}
                    className="card-img-top rounded"
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <div className="card-title mb-1 ">{product.name}</div>
                    <div className="card-text  mb-0">₹{product.price}</div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedProducts;
