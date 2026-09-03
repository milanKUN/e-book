import React from 'react';
import './StickyMobileCTA.css';
import { config } from '../config';

const StickyMobileCTA = () => {
  const openCheckout = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-checkout'));
  };

  return (
    <div className="sticky-mobile-cta">
      <button onClick={openCheckout} className="btn btn-primary btn-block" style={{ border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span>GET THE GUIDE — ₹{config.PRODUCT_PRICE}</span>
        <strike style={{ opacity: 0.7, fontSize: '0.85em', fontWeight: 'normal' }}>₹{config.ORIGINAL_PRICE}</strike>
      </button>
    </div>
  );
};

export default StickyMobileCTA;
