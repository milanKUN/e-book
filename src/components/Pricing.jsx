import React from 'react';
import { config } from '../config';
import './Pricing.css';

const Pricing = () => {
  const openCheckout = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-checkout'));
  };
  const features = [
    "Instant Digital Access",
    "500 Practical Ideas",
    "25 Categories",
    "Beginner Friendly",
    "Practical Workflows",
    "Starter Prompts"
  ];

  return (
    <section className="section bg-light pricing-section" id="pricing">
      <div className="container">
        <div className="text-center reveal mb-5">
          <h2 className="h2 mb-4">Start Exploring AI Income Opportunities for Just ₹{config.PRODUCT_PRICE}</h2>
          <p className="subtitle mx-auto" style={{ maxWidth: '600px' }}>
            A single practical idea from this guide could cover its cost many times over.
          </p>
        </div>

        <div className="pricing-card-wrapper reveal">
          <div className="pricing-card">
            <div className="pricing-header">
              <div className="launch-badge">🔥 TODAY'S SPECIAL OFFER</div>
              
              <div className="price-display-wrapper">
                <div className="original-price-row">
                  <span className="original-price">₹{config.ORIGINAL_PRICE}</span>
                  <span className="discount-badge">90% OFF</span>
                </div>
                
                <div className="current-price-box">
                  <span className="current-price">₹{config.PRODUCT_PRICE}</span>
                </div>
                
                <div className="payment-type">Special Price Today</div>
              </div>
            </div>

            <div className="pricing-body">
              <ul className="pricing-features">
                {features.map((feature, i) => (
                  <li key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pricing-footer">
              <button 
                onClick={openCheckout}
                className="btn btn-primary btn-block cta-pulse"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                BUY NOW — ₹{config.PRODUCT_PRICE}
              </button>
              <div className="secure-checkout-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
