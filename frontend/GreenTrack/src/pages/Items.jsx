import React, { useState } from 'react';
import '../styles/items.css';

const Items = ({ contract, listItem }) => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    harvestDate: '',
    location: '',
    farmId: '',
    organic: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!productData.name.trim() || !productData.price.trim()) {
      console.error("Please enter valid product details");
      return;
    }
    // Include all product data in the listing
    listItem(productData);
    setProductData({
      name: '',
      price: '',
      harvestDate: '',
      location: '',
      farmId: '',
      organic: false
    });
  };

  return (
    <div className="items-page">
      <h2>📝 List New Agricultural Product</h2>
      <div className="form-container">
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="input-field"
          required
        />
        <input
          type="text"
          name="price"
          value={productData.price}
          onChange={handleChange}
          placeholder="Price (ETH)"
          className="input-field"
          required
        />
        <input
          type="text"
          name="farmId"
          value={productData.farmId}
          onChange={handleChange}
          placeholder="Farm ID"
          className="input-field"
        />
        <input
          type="date"
          name="harvestDate"
          value={productData.harvestDate}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="text"
          name="location"
          value={productData.location}
          onChange={handleChange}
          placeholder="Location (e.g., California, USA)"
          className="input-field"
        />
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="organic"
            checked={productData.organic}
            onChange={handleChange}
          />
          Organic Certified
        </label>
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={!contract}
        >
          List Product
        </button>
      </div>
    </div>
  );
};

export default Items;