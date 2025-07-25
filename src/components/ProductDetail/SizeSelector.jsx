import React from 'react';
import { Form } from 'react-bootstrap';

const SizeSelector = ({ sizes, selectedSize, setSelectedSize }) => {
  return (
    <Form.Group className="mt-4 mb-3">
      <Form.Label><strong>Select Size</strong></Form.Label>
      <div className="d-flex gap-3 flex-wrap">
        {sizes.map((size, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedSize(size)}
            style={{
              cursor: 'pointer',
              border: selectedSize === size ? '2px solid #28a745' : '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px 20px',
              minWidth: '80px',
              textAlign: 'center',
              backgroundColor: selectedSize === size ? '#eaffea' : '#f9f9f9',
              fontWeight: selectedSize === size ? 'bold' : 'normal'
             
            }}
          >
            {size}
          </div>
        ))}
      </div>
      {selectedSize && (
        <div className="mt-2 text-success"> <strong>{selectedSize}</strong></div>
      )}
    </Form.Group>
  );
};

export default SizeSelector;
