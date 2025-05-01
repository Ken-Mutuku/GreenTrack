import React, { useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import '../styles/ItemsForSale.css';

const ItemForSale = ({ items, account, purchaseItem }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const filteredItems = items.filter(
    (item) =>
      item.owner.toLowerCase() !== account.toLowerCase() && !item.isSold
  );

  const handlePurchase = async (id) => {
    setLoadingId(id);
    try {
      await purchaseItem(id);
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="items-container">
      <h2 className="section-title">Available Fresh Produce</h2>
      <p className="section-subtitle">Direct from trusted farmers to your table</p>
      
      {filteredItems.length === 0 ? (
        <motion.div className="empty-state">
          <div className="empty-icon">🍏</div>
          <h3>No items available for purchase</h3>
          <p>Make sure your wallet is connected to see available produce</p>
        </motion.div>
      ) : (
        <div className="items-grid">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id.toString()}
                className="item-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="item-image-container">
                  <div className="item-image-placeholder">
                    {item.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                  </div>
                  <div className="item-owner-tag">
                    <span>Farm ID: {item.farmId || item.owner.slice(0, 6)}...{item.owner.slice(-4)}</span>
                  </div>
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <div className="item-price">
                    <span className="eth-price">{ethers.formatEther(item.price)} ETH</span>
                    <span className="usd-price">${(ethers.formatEther(item.price) * 1551.04).toFixed(2)} USD</span>
                  </div>
                  
                  <div className="item-meta">
                    <div className="meta-row">
                      <div className="meta-item">
                        <span className="meta-label">Harvest Date</span>
                        <span className="meta-value">
                          {formatDate(item.harvestDate)}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Location</span>
                        <span className="meta-value">
                          {item.location || 'Not specified'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="meta-row">
                      <div className="meta-item">
                        <span className="meta-label">Seller</span>
                        <span className="meta-value">
                          {item.seller.slice(0, 6)}...{item.seller.slice(-4)}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Status</span>
                        <span className="meta-value">
                          {item.isSold ? 'Sold' : 'Available'}
                        </span>
                      </div>
                    </div>
                    
                    {item.organic && (
                      <div className="organic-badge">
                        <span>🌱 Organic Certified</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <motion.button
                  className={`buy-button ${loadingId === item.id ? 'loading' : ''}`}
                  onClick={() => handlePurchase(item.id)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ backgroundColor: "#0056b3" }}
                  animate={{
                    backgroundColor: hoveredItem === item.id ? "#1a73e8" : "#1e90ff"
                  }}
                  disabled={loadingId === item.id || item.isSold}
                >
                  {loadingId === item.id ? (
                    <>
                      <span className="spinner"></span>
                      Processing...
                    </>
                  ) : (
                    item.isSold ? 'Sold Out' : 'Purchase with ETH'
                  )}
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ItemForSale;