import React, { useState } from 'react';


const Items = ({ contract, listItem }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !price.trim()) {
      console.error("Please enter a valid name and price");
      return;
    }
    listItem(name, price);
    setName('');
    setPrice('');
  };

  return (
    <div className="items-page">
      <h2>📝 List a New Item</h2>
      <div className="form-container">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item Name"
          className="input-field"
        />
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Item Price (ETH)"
          className="input-field"
        />
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!contract}
        >
          List Item
        </button>
      </div>
    </div>
  );
};

export default Items;
