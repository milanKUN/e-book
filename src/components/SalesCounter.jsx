import React, { useState, useEffect } from 'react';
import './SalesCounter.css';
import { config } from '../config';

const SalesCounter = () => {
  const [sales, setSales] = useState(config.REAL_SALES_COUNT);
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    if (config.DEMO_MODE) {
      const interval = setInterval(() => {
        setSales(prev => prev + 1);
        setJustUpdated(true);
        setTimeout(() => setJustUpdated(false), 2000);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="sales-counter-wrapper">
      <div className={`sales-counter ${justUpdated ? 'updated' : ''}`}>
        <div className="pulse-dot"></div>
        <div className="counter-text">
          <span className="count-number">{sales}</span> copies purchased
        </div>
        {config.DEMO_MODE && <span className="demo-badge">Demo</span>}
      </div>
    </div>
  );
};

export default SalesCounter;
