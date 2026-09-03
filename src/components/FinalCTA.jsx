import React from 'react';
import { config } from '../config';
import './FinalCTA.css';

const FinalCTA = () => {
  const openCheckout = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-checkout'));
  };
  return (
    <section className="section section-dark final-cta-section">
      <div className="container">
        <div className="cta-content text-center reveal">
          <h2 className="h2 mb-4">What Could You Build If You Had Access to the Missing 500 Ideas?</h2>
          <p className="cta-subheadline mx-auto">
            You only need to uncover one idea from the vault to change everything.
          </p>
          
          <div className="cta-process-flow">
            <span className="process-step">Learn it</span>
            <span className="process-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
            <span className="process-step">Apply it</span>
            <span className="process-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
            <span className="process-step">Test it</span>
            <span className="process-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
            <span className="process-step highlight">Improve it</span>
          </div>

          <p className="cta-subheadline mb-5 mx-auto">
            Then build from there.
          </p>
          
          <div className="cta-button-wrapper">
            <button onClick={openCheckout} className="btn btn-primary btn-large cta-pulse" style={{border: 'none', background: 'transparent', padding: 0}}>
              <span className="btn btn-primary btn-large cta-pulse" style={{display: 'flex', alignItems: 'center', margin: 0}}>
                <span>UNLOCK THE HIDDEN 500</span>
                <span className="price-pill" style={{marginLeft: '10px'}}>₹{config.PRODUCT_PRICE}</span>
              </span>
            </button>
            <p className="mt-3 text-muted small-text">Instant Digital Access</p>
          </div>
        </div>

        <div className="trust-badges reveal">
          <div className="trust-item">
            <span className="check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span> 
            Instant Digital Access
          </div>
          <div className="trust-item">
            <span className="check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span> 
            One-Time Payment
          </div>
          <div className="trust-item">
            <span className="check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span> 
            Beginner Friendly
          </div>
          <div className="trust-item">
            <span className="check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span> 
            Practical AI Guide
          </div>
          <div className="trust-item secure">
            <span className="check lock">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </span> 
            Secure Checkout
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
