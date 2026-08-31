import React, { useState, useEffect } from 'react';
import './LiveStats.css';

const LiveStats = () => {
  const [visitors, setVisitors] = useState(() => {
    const saved = localStorage.getItem('live_visitors');
    return saved ? parseInt(saved, 10) : 124;
  });
  
  const [totalPurchases, setTotalPurchases] = useState(() => {
    const saved = localStorage.getItem('total_purchases');
    return saved ? parseInt(saved, 10) : 50;
  });
  
  const [todayPurchases, setTodayPurchases] = useState(() => {
    const savedDate = localStorage.getItem('purchases_date');
    const currentDate = new Date().toDateString();
    
    if (savedDate !== currentDate) {
      localStorage.setItem('purchases_date', currentDate);
      return 0;
    }
    
    const saved = localStorage.getItem('today_purchases');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('live_visitors', visitors);
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem('total_purchases', totalPurchases);
    localStorage.setItem('today_purchases', todayPurchases);
  }, [totalPurchases, todayPurchases]);

  // Visitor Counter: Fluctuates randomly to look realistic
  useEffect(() => {
    const visitorInterval = setInterval(() => {
      setVisitors(prev => {
        // Random change between -3 and +5
        const change = Math.floor(Math.random() * 9) - 3;
        const newValue = prev + change;
        
        // Keep it within realistic bounds (e.g., 100 to 300)
        if (newValue < 100) return 100 + Math.floor(Math.random() * 10);
        if (newValue > 300) return 300 - Math.floor(Math.random() * 10);
        return newValue;
      });
    }, 2500); // Updates every 2.5 seconds

    return () => clearInterval(visitorInterval);
  }, []);

  // Purchase Counters: +1 every 5 minutes (300,000 ms)
  useEffect(() => {
    const purchaseInterval = setInterval(() => {
      const savedDate = localStorage.getItem('purchases_date');
      const currentDate = new Date().toDateString();
      
      setTotalPurchases(prev => prev + 1);
      
      if (savedDate !== currentDate) {
        localStorage.setItem('purchases_date', currentDate);
        setTodayPurchases(1);
      } else {
        setTodayPurchases(prev => prev + 1);
      }
    }, 300000);

    return () => clearInterval(purchaseInterval);
  }, []);

  return (
    <section className="section bg-light live-stats-section">
      <div className="container">
        <div className="stats-grid reveal">
          
          <div className="stat-card">
            <div className="stat-icon pulse-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{visitors}</h3>
              <p className="stat-label">Active Visitors Now</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{todayPurchases}</h3>
              <p className="stat-label">Purchases Today</p>
            </div>
          </div>

          <div className="stat-card highlight-card">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{totalPurchases}</h3>
              <p className="stat-label">Total Verified Purchases</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LiveStats;
