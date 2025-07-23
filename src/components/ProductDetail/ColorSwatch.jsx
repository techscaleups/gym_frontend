import React from 'react';
import { Form } from 'react-bootstrap';

const ColorSwatch = ({ colors, selectedColor, setSelectedColor }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label><strong>Select Color</strong></Form.Label>
      <div className="d-flex gap-3 flex-wrap">
        {colors.map((color, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedColor(color)}
            style={{
              cursor: 'pointer',
              border: selectedColor === color ? '2px solid #28a745' : '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px 20px',
              minWidth: '80px',
              textAlign: 'center',
              backgroundColor: selectedColor === color ? '#eaffea' : '#f9f9f9',
              fontWeight: selectedColor === color ? 'bold' : 'normal'
            }}
          >
            {color}
          </div>
        ))}
      </div>
      {selectedColor && (
        <div className="mt-2 text-success"> <strong>{selectedColor}</strong></div>
      )}
    </Form.Group>
  );
};

export default ColorSwatch;
