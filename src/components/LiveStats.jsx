import React, { useState, useEffect } from 'react';
import './LiveStats.css';

const LiveStats = () => {
  const [visitors, setVisitors] = useState(() => {
    const saved = localStorage.getItem('live_visitors');
    return saved ? parseInt(saved, 10) : 124;
  });
  
  const [totalPurchases, setTotalPurchases] = useState(() => {
    const saved = localStorage.getItem('total_purchases');
    const parsed = saved ? parseInt(saved, 10) : 0;
    return parsed > 569 ? parsed : 569;
  });
  
  const [todayPurchases, setTodayPurchases] = useState(() => {
    const savedDate = localStorage.getItem('purchases_date');
    const currentDate = new Date().toDateString();
    
    if (savedDate !== currentDate) {
      localStorage.setItem('purchases_date', currentDate);
      return 76;
    }
    
    const saved = localStorage.getItem('today_purchases');
    const parsed = saved ? parseInt(saved, 10) : 0;
    return parsed > 76 ? parsed : 76;
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
        setTodayPurchases(77);
      } else {
        setTodayPurchases(prev => prev + 1);
      }
    }, 300000);

    return () => clearInterval(purchaseInterval);
  }, []);

  return (
    <section className="section section-dark live-stats-section">
      <div className="container">
        <div className="stats-grid reveal">
          
          <div className="stat-card">
            <div className="stat-icon pulse-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{visitors}</h3>
              <p className="stat-label">Active Visitors Now</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pulse-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{todayPurchases}</h3>
              <p className="stat-label">Purchases Today</p>
            </div>
          </div>

          <div className="stat-card highlight-card">
            <div className="stat-icon pulse-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
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
