import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useBlockchain } from '../contexts/BlockchainContext';
import '../styles/ProduceView.css';

const ProduceView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    location: '',
    condition: '',
    notes: ''
  });
  const { account, contract } = useBlockchain();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Fetch from blockchain
        const blockchainData = await contract.methods.getProduct(id).call();
        
        // Fetch from database (optional)
        const dbResponse = await axios.get(`/api/products/${id}`);
        
        // Combine data
        setProduct({
          ...blockchainData,
          ...dbResponse.data
        });

        // Fetch history
        const updateCount = await contract.methods.getUpdatesCount(id).call();
        const updates = [];
        
        for (let i = 0; i < updateCount; i++) {
          const update = await contract.methods.getUpdate(id, i).call();
          updates.push(update);
        }
        
        setHistory(updates);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, contract.methods]);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await contract.methods.updateProduct(
        id,
        updateForm.location,
        updateForm.condition,
        account
      ).send({ from: account });

      // Update local state
      const newUpdate = {
        location: updateForm.location,
        condition: updateForm.condition,
        updatedBy: account,
        timestamp: Math.floor(Date.now() / 1000)
      };

      setHistory([...history, newUpdate]);
      setUpdateForm({ location: '', condition: '', notes: '' });
      
      // Optional: Update in database
      await axios.post(`/api/products/${id}/updates`, {
        ...updateForm,
        updatedBy: account
      });

    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update product: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  return (
    <div className="produce-view-container">
      <div className="produce-header">
        <h1 className="produce-title">{product.productName}</h1>
        <p className="produce-id">ID: {id}</p>
      </div>

      <div className="produce-details">
        <div className="detail-section">
          <h2 className="section-title">Product Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{product.productType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Harvest Date:</span>
              <span className="detail-value">{product.harvestDate}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Farm Location:</span>
              <span className="detail-value">{product.farmLocation}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Batch Number:</span>
              <span className="detail-value">{product.batchNumber}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Quantity:</span>
              <span className="detail-value">{product.quantity} {product.unit}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Organic:</span>
              <span className="detail-value">
                {product.organicCertification ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <div className="update-section">
          <h2 className="section-title">Update Product Status</h2>
          <form onSubmit={handleUpdateSubmit} className="update-form">
            <div className="form-group">
              <label className="form-label">Current Location</label>
              <input
                type="text"
                name="location"
                value={updateForm.location}
                onChange={handleUpdateChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Condition</label>
              <select
                name="condition"
                value={updateForm.condition}
                onChange={handleUpdateChange}
                required
                className="form-input"
              >
                <option value="">Select condition</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea
                name="notes"
                value={updateForm.notes}
                onChange={handleUpdateChange}
                className="form-textarea"
              />
            </div>
            <button type="submit" className="update-button">
              Submit Update
            </button>
          </form>
        </div>
      </div>

      <div className="history-section">
        <h2 className="section-title">Product History</h2>
        {history.length === 0 ? (
          <p className="no-history">No updates available for this product</p>
        ) : (
          <div className="history-list">
            {history.map((update, index) => (
              <div key={index} className="history-item">
                <div className="history-header">
                  <span className="history-location">{update.location}</span>
                  <span className="history-condition">{update.condition}</span>
                  <span className="history-date">
                    {new Date(update.timestamp * 1000).toLocaleString()}
                  </span>
                </div>
                <div className="history-updated-by">
                  Updated by: {update.updatedBy}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProduceView;