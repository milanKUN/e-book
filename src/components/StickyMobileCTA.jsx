import React, { useState, useEffect } from 'react';
import './StickyMobileCTA.css';
import { config } from '../config';
import { handleCheckout } from '../utils/checkout';

const StickyMobileCTA = () => {
  return (
    <div className="sticky-mobile-cta">
      <button onClick={(e) => handleCheckout(e)} className="btn btn-primary btn-block" style={{ border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span>GET THE GUIDE — ₹{config.PRODUCT_PRICE}</span>
        <strike style={{ opacity: 0.7, fontSize: '0.85em', fontWeight: 'normal' }}>₹{config.ORIGINAL_PRICE}</strike>
      </button>
    </div>
  );
};

export default StickyMobileCTA;
