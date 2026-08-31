import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';
import { config } from '../config';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Calculate midnight of the current day
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
        // Reset for the next day
        setTimeLeft(0);
      } else {
        setTimeLeft(distance);
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="countdown-banner">
      <div className="container">
        <div className="countdown-content">
          <div className="countdown-text">
            <span className="pulse-icon">🔥</span> 
            <span className="offer-msg"><strong>Today's Offer:</strong> Get the guide for ₹{config.PRODUCT_PRICE} <span className="strike-price">₹{config.ORIGINAL_PRICE || '1000'}</span></span>
          </div>
          <div className="countdown-clock">
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
      </div>
    </div>
  );
};

export default CountdownTimer;
