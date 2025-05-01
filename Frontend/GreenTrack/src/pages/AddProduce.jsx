import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { saveAs } from 'file-saver';
import { useBlockchain } from '../contexts/BlockchainContext';
import '../styles/AddProduce.css';

const AddProduce = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    harvestDate: '',
    farmLocation: '',
    organicCertification: false,
    batchNumber: '',
    quantity: '',
    unit: 'kg'
  });

  const [qrCodeData, setQrCodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const navigate = useNavigate();
  const { account, contract } = useBlockchain();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateProductId = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `PROD-${timestamp}-${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const productId = generateProductId();
      const productData = {
        ...formData,
        producer: account,
        timestamp: new Date().toISOString()
      };

      // 1. Store in blockchain
      const tx = await contract.methods.createProduct(
        productId,
        JSON.stringify(productData)
      ).send({ from: account });
      
      setTxHash(tx.transactionHash);

      // 2. Store reference in database (optional)
      await axios.post('/api/products', {
        productId,
        blockchainTx: tx.transactionHash,
        producer: account,
        ...formData
      });

      // 3. Generate QR code data
      const productUrl = `${window.location.origin}/products/${productId}`;
      setQrCodeData({
        productId,
        url: productUrl,
        productData
      });

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeData) return;
    
    const canvas = document.getElementById('qr-code-canvas');
    canvas.toBlob((blob) => {
      saveAs(blob, `product-${qrCodeData.productId}-qrcode.png`);
    });
  };

  return (
    <div className="add-produce-container">
      <h1 className="add-produce-title">Add New Produce</h1>
      
      {!qrCodeData ? (
        <form onSubmit={handleSubmit} className="add-produce-form">
          <div className="add-produce-form-grid">
            <div className="add-produce-form-group">
              <label className="add-produce-label">Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                className="add-produce-input"
              />
            </div>

            <div className="add-produce-form-group">
              <label className="add-produce-label">Product Type</label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                required
                className="add-produce-input"
              >
                <option value="">Select type</option>
                <option value="vegetable">Vegetable</option>
                <option value="fruit">Fruit</option>
                <option value="grain">Grain</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
              </select>
            </div>

            <div className="add-produce-form-group">
              <label className="add-produce-label">Harvest Date</label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                required
                className="add-produce-input"
              />
            </div>

            <div className="add-produce-form-group">
              <label className="add-produce-label">Farm Location</label>
              <input
                type="text"
                name="farmLocation"
                value={formData.farmLocation}
                onChange={handleChange}
                required
                className="add-produce-input"
              />
            </div>

            <div className="add-produce-form-group">
              <label className="add-produce-label">Batch Number</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                required
                className="add-produce-input"
              />
            </div>

            <div className="add-produce-quantity-container">
              <div className="add-produce-quantity-input">
                <label className="add-produce-label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="add-produce-input"
                />
              </div>
              <div className="add-produce-unit-select">
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="add-produce-input"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="lbs">lbs</option>
                  <option value="units">units</option>
                </select>
              </div>
            </div>

            <div className="add-produce-checkbox-container">
              <input
                type="checkbox"
                name="organicCertification"
                checked={formData.organicCertification}
                onChange={handleChange}
                className="add-produce-checkbox"
              />
              <label className="add-produce-checkbox-label">Organic Certified</label>
            </div>
          </div>

          <div className="add-produce-submit-container">
            <button
              type="submit"
              disabled={loading}
              className={`add-produce-submit-button ${loading ? 'add-produce-loading' : ''}`}
            >
              {loading ? 'Processing...' : 'Register Produce on Blockchain'}
            </button>
          </div>
        </form>
      ) : (
        <div className="add-produce-success-container">
          <h2 className="add-produce-success-title">Produce Registered Successfully!</h2>
          
          <div className="add-produce-qr-container">
            <div className="add-produce-qr-wrapper">
              <QRCode
                id="qr-code-canvas"
                value={qrCodeData.url}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="add-produce-qr-label">Scan to view product details</p>
          </div>

          <div className="add-produce-details">
            <h3 className="add-produce-details-title">Product Details:</h3>
            <p><span className="add-produce-detail-label">ID:</span> {qrCodeData.productId}</p>
            <p><span className="add-produce-detail-label">Name:</span> {qrCodeData.productData.productName}</p>
            <p><span className="add-produce-detail-label">Type:</span> {qrCodeData.productData.productType}</p>
            {txHash && (
              <p className="add-produce-tx-hash">
                <span className="add-produce-detail-label">Tx Hash:</span> 
                <a 
                  href={`https://etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="add-produce-tx-link"
                >
                  View on Etherscan
                </a>
              </p>
            )}
          </div>

          <div className="add-produce-action-buttons">
            <button
              onClick={downloadQRCode}
              className="add-produce-download-button"
            >
              Download QR Code
            </button>
            <button
              onClick={() => navigate(`/products/${qrCodeData.productId}`)}
              className="add-produce-view-button"
            >
              View Product Page
            </button>
            <button
              onClick={() => {
                setQrCodeData(null);
                setFormData({
                  productName: '',
                  productType: '',
                  harvestDate: '',
                  farmLocation: '',
                  organicCertification: false,
                  batchNumber: '',
                  quantity: '',
                  unit: 'kg'
                });
              }}
              className="add-produce-another-button"
            >
              Add Another Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduce;  // Assuming your component is named AddProduce