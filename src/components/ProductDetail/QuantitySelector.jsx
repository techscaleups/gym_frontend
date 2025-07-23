import React from 'react';
import { Button, Form } from 'react-bootstrap';

const QuantitySelector = ({ quantity, setQuantity, stock }) => {
  const increaseQty = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <Form.Group className="mb-3">
      <Form.Label><strong>Quantity</strong></Form.Label>
      <div className="d-flex align-items-center gap-3">
        <Button variant="outline-secondary" onClick={decreaseQty} disabled={quantity === 1}>−</Button>
        <span style={{ minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
        <Button variant="outline-secondary" onClick={increaseQty} disabled={quantity === stock}>+</Button>
      </div>
    </Form.Group>
  );
};

export default QuantitySelector;
