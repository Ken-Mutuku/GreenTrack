import React from "react"
import { Link } from "react-router-dom"
import "../styles/navbar.css"

const Navbar = ({ account, isConnected, connectWallet }) => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link className="nav-brand" to="/">🛒 GreenTrack</Link>
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/buy">Buy</Link>
        <Link className="nav-link" to="/list">List Item</Link>
        <Link className="nav-link" to="/myitems">My Items</Link>
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
    </nav>
  )
}

export default Navbar
