import React from 'react';
import images from '../images/ima';
const brands = [
  {
    name: 'Fitness brand',
  image: images.brand1
  },
  {
    name: 'Fitness brand',
   image: images.brand2
  },
  {
    name: 'Fitness brand',
     image: images.brand3
  },
  {
    name: 'Fitness brand',
     image: images.brand4
  },
];

const BrandsWeTrust = () => {
  return (
    <section className="py-5">
      <div className="container">
        <h5 className="fw-bold py-4 ">Brands We Trust</h5>
        <div className="row g-4">
          {brands.map((brand, index) => (
            <div className="col-6 col-md-3" key={index}>
              <div className="card border-0  text-center ">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="card-img-top rounded"
                
                />
                <div className="card-body px-0">
                  <p className="mb-0  ">{brand.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsWeTrust;
