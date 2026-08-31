import React, { useState, useEffect } from 'react';
import './StickyMobileCTA.css';
import { config } from '../config';

const StickyMobileCTA = () => {
  return (
    <div className="sticky-mobile-cta">
      <a href={config.PAYMENT_LINK} className="btn btn-primary btn-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span>GET THE GUIDE — ₹{config.PRODUCT_PRICE}</span>
        <strike style={{ opacity: 0.7, fontSize: '0.85em', fontWeight: 'normal' }}>₹{config.ORIGINAL_PRICE}</strike>
      </a>
    </div>
  );
};

export default StickyMobileCTA;
