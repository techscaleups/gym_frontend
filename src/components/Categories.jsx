import React from 'react';
import { Link } from 'react-router-dom';
import images from '../images/ima';
const categories = [
  {
    name: 'Gym Equipment',
    image: images.category3
  },
  {
    name: 'Supplements',
       image: images.category2
  },
  {
    name: 'Apparel',
        image: images.category4
  },
  {
    name: 'Accessories',
    image: images.category1
  },
];

const Categories = () => {
  return (
    <section className="py-5">
      <div className="container">
        <h5 className=" mb-4">Categories</h5>
        <div className="row g-4">
          {categories.map((category, index) => (
            <div key={index} className="col-6 col-md-3">
              <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="text-decoration-none text-dark">
                <div className="card border-0 shadow-sm h-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="card-img-top "
                    style={{ height: '100', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center">
                    <div className="mb-0 category_title ">{category.name}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
