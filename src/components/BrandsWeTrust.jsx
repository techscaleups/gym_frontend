import React from 'react';

const brands = [
  {
    name: 'Fitness brand',
    image: '/src/assets/images/brand1.svg',
  },
  {
    name: 'Fitness brand',
    image: '/src/assets/images/brand2.svg',
  },
  {
    name: 'Fitness brand',
    image: '/src/assets/images/brand3.svg',
  },
  {
    name: 'Fitness brand',
    image: '/src/assets/images/brand4.svg',
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
