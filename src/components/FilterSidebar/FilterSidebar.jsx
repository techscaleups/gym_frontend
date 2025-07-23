import React, { useState, useEffect } from 'react';

const FilterSidebar = ({
  selectedFilters = {},
  onFilterChange,
  clearFilters
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categories = [
    'Apparel', 'Equipment', 'Supplements', 'Footwear',
    'Accessories', 'Bags', 'Nutrition', 'Gear'
  ];

  const brands = [
    'Alphafit', 'TitanGear', 'Brandod', 'Ironclad', 'FitPro',
    'BeastWear', 'MuscleCore', 'GymX', 'TitanEdge', 'BulkNation'
  ];

  const {
    category = [],
    brand = [],
    minPrice = '',
    maxPrice = ''
  } = selectedFilters;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const drawerClass = drawerOpen ? 'filter-drawer open' : 'filter-drawer';

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Filters</h5>
          <button className="btn btn-sm btn-outline-primary" onClick={() => setDrawerOpen(!drawerOpen)}>
            {drawerOpen ? 'Close ✕' : 'Open Filters ☰'}
          </button>
        </div>
      )}

      {/* Filter Panel */}
      <div className={isMobile ? drawerClass : 'col-md-3'}>
        <div className="bg-white p-3 p-md-4 rounded shadow-sm border position-relative">

          {/* Mobile Close Button inside drawer */}
          {isMobile && (
            <div className="d-flex justify-content-end mb-2">
              <button
                className="btn-close"
                aria-label="Close"
                onClick={() => setDrawerOpen(false)}
              ></button>
            </div>
          )}

          {/* Clear Filters */}
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-sm btn-outline-danger" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          {/* Category Filter */}
          <h5 className="mb-3" style={{ color: '#00C18C' }}>Category</h5>
          {categories.map((cat, i) => (
            <div className="form-check mb-2" key={i}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`cat-${i}`}
                onChange={() => onFilterChange('category', cat)}
                checked={category.includes(cat)}
              />
              <label className="form-check-label" htmlFor={`cat-${i}`}>
                {cat}
              </label>
            </div>
          ))}

          {/* Brand Filter */}
          <h5 className="mt-4 mb-3" style={{ color: '#00C18C' }}>Brand</h5>
          {brands.map((b, i) => (
            <div className="form-check mb-2" key={i}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`brand-${i}`}
                onChange={() => onFilterChange('brand', b)}
                checked={brand.includes(b)}
              />
              <label className="form-check-label" htmlFor={`brand-${i}`}>
                {b}
              </label>
            </div>
          ))}

          {/* Price Filter */}
          <h5 className="mt-4 mb-3" style={{ color: '#00C18C' }}>Price Rang</h5>
          <div className="mb-2">
            <label className="form-label">Min Price (₹)</label>
            <input
              type="number"
              className="form-control"
              value={minPrice}
              onChange={(e) => onFilterChange('minPrice', Number(e.target.value))}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Max Price (₹)</label>
            <input
              type="number"
              className="form-control"
              value={maxPrice}
              onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))}
            />
          </div>

        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
