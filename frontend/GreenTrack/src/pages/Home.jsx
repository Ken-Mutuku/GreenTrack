import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';


const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Transparent Fresh Produce Supply Chains</h1>
          <p>Track your food's journey from farm to table with blockchain-powered transparency</p>
          <div className="hero-buttons">
            <Link to="/track" className="btn primary">Track a Product</Link>
            <Link to="/list" className="btn secondary">Register Your Farm</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Fresh produce supply chain" />
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Our Platform</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-link"></i>
            </div>
            <h3>Blockchain Verified</h3>
            <p>Immutable records of every step in your food's journey, secured by blockchain technology.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-leaf"></i>
            </div>
            <h3>Farm to Table</h3>
            <p>Complete visibility from the farm where your food was grown to the store where you purchased it.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-clock"></i>
            </div>
            <h3>Real-time Tracking</h3>
            <p>Monitor your produce's condition and location throughout the entire supply chain in real-time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-certificate"></i>
            </div>
            <h3>Quality Assurance</h3>
            <p>Verified quality metrics including harvest date, storage conditions, and transportation details.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Farm Registration</h3>
              <p>Producers register their farms and record harvest details on the blockchain.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Transport Logging</h3>
              <p>Shipping companies log temperature, humidity, and location data during transport.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Retail Verification</h3>
              <p>Retailers confirm receipt and storage conditions when produce arrives.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Consumer Access</h3>
              <p>Shoppers scan QR codes to view the complete journey of their fresh produce.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>Trusted by Farmers and Consumers</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <div className="testimonial-text">
              "This platform has given my farm credibility and helped me get better prices for my organic produce."
            </div>
            <div className="testimonial-author">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Farmer" />
              <div>
                <h4>Miguel Rodriguez</h4>
                <p>Organic Farmer, California</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-text">
              "As a consumer, I love knowing exactly where my food comes from and how it was handled along the way."
            </div>
            <div className="testimonial-author">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Consumer" />
              <div>
                <h4>Sarah Johnson</h4>
                <p>Health-conscious Shopper</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to experience transparent food supply chains?</h2>
          <p>Join our network of farmers, distributors, and conscious consumers today.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn primary">Get Started</Link>
            <Link to="/demo" className="btn secondary">See Demo</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
