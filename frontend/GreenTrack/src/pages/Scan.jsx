import React, { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import 'qr-scanner/qr-scanner-worker.min';
import '../styles/Scan.css';

const Scan = () => {
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'camera' or 'upload'
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize scanner
  const startScanner = () => {
    if (videoRef.current && !qrScannerRef.current) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        result => {
          setScanResult(result.data);
          stopScanner();
        },
        {
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
        }
      );

      qrScannerRef.current.start()
        .then(() => setCameraActive(true))
        .catch(err => {
          setError(err.message);
          setCameraActive(false);
        });
    }
  };

  // Stop scanner
  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current = null;
      setCameraActive(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    setError(null);
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    QrScanner.scanImage(file, { returnDetailedScanResult: true })
      .then(result => {
        setScanResult(result.data);
      })
      .catch(err => {
        setError('No QR code found in the image');
        console.error(err);
      });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="scan-container">
      <h1>QR Code Scanner</h1>
      
      <div className="tab-buttons">
        
        <button 
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('upload');
            stopScanner();
          }}
        >
          Upload Image
        </button>
        <button 
          className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          Camera Scan
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {activeTab === 'camera' ? (
        <>
          <div className="scanner-section">
            <video 
              ref={videoRef}
              className={`scanner-video ${cameraActive ? 'active' : ''}`}
              playsInline
            />
            
            {!cameraActive && (
              <div className="scanner-placeholder">
                {scanResult ? 'Scan complete!' : 'Camera will appear here when activated'}
              </div>
            )}
          </div>
          
          <div className="controls">
            {!cameraActive ? (
              <button onClick={startScanner} className="scan-button">
                {scanResult ? 'Scan Again' : 'Start Scanning'}
              </button>
            ) : (
              <button onClick={stopScanner} className="stop-button">
                Stop Scanner
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="upload-section">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="upload-button"
            >
              Choose Image to Scan
            </button>
            <p className="upload-hint">Upload an image containing a QR code</p>
          </div>
          
          {scanResult && (
            <button 
              onClick={() => setScanResult('')}
              className="clear-button"
            >
              Clear Result
            </button>
          )}
        </>
      )}
      
      {scanResult && (
        <div className="result-section">
          <h2>Scan Result:</h2>
          <div className="result-content">
            {scanResult.startsWith('http') ? (
              <a href={scanResult} target="_blank" rel="noopener noreferrer">
                {scanResult}
              </a>
            ) : (
              <p>{scanResult}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scan;