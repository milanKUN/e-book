import React, { useState, useEffect } from 'react';
import { config } from '../config';
import './Header.css';

import { Link } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const getMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(23, 59, 59, 999);
      return midnight.getTime();
    };
    const targetDate = getMidnight();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        setTimeLeft(0);
      } else {
        setTimeLeft(distance);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-top-bar">
        <div className="header-marquee-container">
          <div className="header-marquee">
            <span>
              <span className="pulse-icon">🔥</span> 
              <strong>Today's Offer:</strong> Get the guide for ₹{config.PRODUCT_PRICE} <strike className="strike-price">₹{config.ORIGINAL_PRICE}</strike>
            </span>
            <span>
              <span className="pulse-icon">🔥</span> 
              <strong>Today's Offer:</strong> Get the guide for ₹{config.PRODUCT_PRICE} <strike className="strike-price">₹{config.ORIGINAL_PRICE}</strike>
            </span>
            <span>
              <span className="pulse-icon">🔥</span> 
              <strong>Today's Offer:</strong> Get the guide for ₹{config.PRODUCT_PRICE} <strike className="strike-price">₹{config.ORIGINAL_PRICE}</strike>
            </span>
            <span>
              <span className="pulse-icon">🔥</span> 
              <strong>Today's Offer:</strong> Get the guide for ₹{config.PRODUCT_PRICE} <strike className="strike-price">₹{config.ORIGINAL_PRICE}</strike>
            </span>
          </div>
        </div>
      </div>

      <div className="header-container">
        <Link to="/" className="header-brand">
          <img src="/logo.png" alt="Guru Netra Logo" className="header-logo-img" />
        </Link>

        <div className="header-timer">
          <div className="time-block">
            <span className="time-value">{String(hours).padStart(2, '0')}</span>
            <span className="time-label">HRS</span>
          </div>
          <span className="time-colon">:</span>
          <div className="time-block">
            <span className="time-value">{String(minutes).padStart(2, '0')}</span>
            <span className="time-label">MIN</span>
          </div>
          <span className="time-colon">:</span>
          <div className="time-block">
            <span className="time-value">{String(seconds).padStart(2, '0')}</span>
            <span className="time-label">SEC</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
