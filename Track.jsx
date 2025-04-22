import React, { useState } from 'react';
import { ethers } from 'ethers';
import './Track.css';

const Track = () => {
  const [trackingId, setTrackingId] = useState('');
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock blockchain data - replace with actual contract calls
  const mockProducts = {
    'PROD-123': {
      id: 'PROD-123',
      name: 'Organic Mangoes',
      origin: 'Sunny Slope Farms, California',
      harvestDate: '2023-10-15',
      currentLocation: 'Distribution Center, Chicago',
      temperatureHistory: [4.2, 4.5, 4.1, 3.9],
      humidityHistory: [72, 70, 68, 65],
      ownerHistory: [
        '0x3F...45B2 (Farm)',
        '0x7A...91C3 (Transport)',
        '0xE2...67F1 (Warehouse)'
      ],
      isCertifiedOrganic: true,
      lastUpdated: '2023-10-20T14:30:00Z'
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate blockchain lookup delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (mockProducts[trackingId]) {
        setProductData(mockProducts[trackingId]);
      } else {
        setError('Product not found. Please check your tracking ID.');
        setProductData(null);
      }
    } catch (err) {
      setError('Error accessing blockchain data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-container">
      <div className="track-header">
        <h1>Track Your Produce</h1>
        <p>Enter your product ID to view its complete journey from farm to table</p>
        
        <form onSubmit={handleTrack} className="track-form">
          <div className="input-group">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Product ID (e.g. PROD-123)"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Searching...
                </>
              ) : (
                'Track Product'
              )}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>

      {productData && (
        <div className="product-journey">
          <div className="product-overview">
            <div className="product-image">
              <img 
                src="https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt={productData.name} 
              />
              {productData.isCertifiedOrganic && (
                <span className="organic-badge">Certified Organic</span>
              )}
            </div>
            <div className="product-details">
              <h2>{productData.name}</h2>
              <div className="detail-row">
                <span className="detail-label">Product ID:</span>
                <span>{productData.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Origin:</span>
                <span>{productData.origin}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Harvest Date:</span>
                <span>{new Date(productData.harvestDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Current Location:</span>
                <span>{productData.currentLocation}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last Updated:</span>
                <span>{new Date(productData.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="journey-timeline">
            <h3>Supply Chain Journey</h3>
            <div className="timeline">
              <div className="timeline-event">
                <div className="event-icon farm"></div>
                <div className="event-content">
                  <h4>Harvested at Farm</h4>
                  <p>{productData.origin}</p>
                  <p>{new Date(productData.harvestDate).toLocaleDateString()}</p>
                  <p className="blockchain-link">Blockchain TX: 0x3F...45B2</p>
                </div>
              </div>
              <div className="timeline-event">
                <div className="event-icon transport"></div>
                <div className="event-content">
                  <h4>In Transit</h4>
                  <p>Temperature maintained at 4.2°C avg</p>
                  <p>3 days in transit</p>
                  <p className="blockchain-link">Blockchain TX: 0x7A...91C3</p>
                </div>
              </div>
              <div className="timeline-event">
                <div className="event-icon warehouse"></div>
                <div className="event-content">
                  <h4>Warehouse Storage</h4>
                  <p>{productData.currentLocation}</p>
                  <p>Optimal storage conditions maintained</p>
                  <p className="blockchain-link">Blockchain TX: 0xE2...67F1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="environmental-data">
            <h3>Environmental Conditions</h3>
            <div className="data-grid">
              <div className="data-card">
                <h4>Temperature History (°C)</h4>
                <div className="data-values">
                  {productData.temperatureHistory.map((temp, i) => (
                    <span key={i}>{temp.toFixed(1)}</span>
                  ))}
                </div>
              </div>
              <div className="data-card">
                <h4>Humidity History (%)</h4>
                <div className="data-values">
                  {productData.humidityHistory.map((humidity, i) => (
                    <span key={i}>{humidity}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="blockchain-verification">
            <h3>Blockchain Verification</h3>
            <p>
              This product's journey has been immutably recorded on the Ethereum blockchain. 
              All data points have been verified by network participants.
            </p>
            <div className="verification-badge">
              <span>Verified Supply Chain</span>
            </div>
          </div>
        </div>
      )}

      {!productData && (
        <div className="tracking-help">
          <h3>How to find your Product ID</h3>
          <div className="help-steps">
            <div className="help-step">
              <div className="step-number">1</div>
              <p>Look for the QR code on your product packaging</p>
            </div>
            <div className="help-step">
              <div className="step-number">2</div>
              <p>Scan the code with your phone's camera</p>
            </div>
            <div className="help-step">
              <div className="step-number">3</div>
              <p>Enter the 8-digit code shown after scanning</p>
            </div>
          </div>
          <div className="qr-example">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PROD-123" 
              alt="Example QR code" 
            />
            <p>Example product QR code</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Track;