import React from "react";
import { formatEther } from "ethers";
import '../styles/OwnedItems.css';

const OwnedItems = ({ ownedItems }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="owned-items">
      <h2>Your Agricultural Products</h2>
      {ownedItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌾</div>
          <h3>You don't own any agricultural products yet</h3>
          <p>List new products to get started</p>
        </div>
      ) : (
        <div className="owned-items-grid">
          {ownedItems.map((item) => (
            <div key={item.id.toString()} className="owned-item-card">
              <div className="item-header">
                <div className="item-initials">
                  {item.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                </div>
                <h3 className="item-name">{item.name}</h3>
              </div>
              
              <div className="item-details">
                <div className="detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">{formatEther(item.price)} ETH</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Harvest Date:</span>
                  <span className="detail-value">{formatDate(item.harvestDate)}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{item.location || 'Not specified'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Farm ID:</span>
                  <span className="detail-value">{item.farmId || 'Not specified'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`status-badge ${item.isSold ? 'sold' : 'available'}`}>
                    {item.isSold ? 'Sold' : 'Available'}
                  </span>
                </div>
                
                {item.organic && (
                  <div className="organic-tag">
                    <span>🌱 Organic Certified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnedItems;