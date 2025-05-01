import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = ({ account, isConnected, connectWallet }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-brand-container">
        <Link className="nav-brand" to="/">🛒 GreenTrack</Link>
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
      </div>

      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <div className="nav-left">
          <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link className="nav-link" to="/buy" onClick={() => setIsMenuOpen(false)}>Buy</Link>
          <Link className="nav-link" to="/list" onClick={() => setIsMenuOpen(false)}>List Item</Link>
          <Link className="nav-link" to="/myitems" onClick={() => setIsMenuOpen(false)}>My Items</Link>
          <Link className="nav-link" to="/addproduce" onClick={() => setIsMenuOpen(false)}>Add</Link>
          <Link className="nav-link" to="/viewproduce" onClick={() => setIsMenuOpen(false)}>View</Link>
          <Link className="nav-link" to="/scan" onClick={() => setIsMenuOpen(false)}>Scan</Link>
        </div>

        <div className="nav-right">
          {isConnected ? (
            <span className="wallet-info">
              🟢 {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          ) : (
            <button className="connect-button" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;