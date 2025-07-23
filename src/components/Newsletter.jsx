import React from 'react';

const Newsletter = () => {
  return (
    <section className="py-5 text-center">
      <div className="container">
        <h3 className="fw-bold mb-4">Get exclusive deals &amp; updates</h3>

        <div className="d-flex justify-content-center">
          <form className="d-flex w-100 " style={{ maxWidth: '500px' }}>
            <input
              type="email"
              className="form-control me-2 py-3 rounded-start bg-success bg-opacity-10 border-0 text-white"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="btn btn-success border-0 rounded-end px-4 fw-semibold"
              style={{ backgroundColor: '#40f840', color: '#ffff' }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
