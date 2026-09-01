import React, { useState, useEffect } from 'react';
import './LiveStats.css';

const LiveStats = () => {
  const [visitors, setVisitors] = useState(() => {
    const saved = localStorage.getItem('live_visitors');
    return saved ? parseInt(saved, 10) : 299;
  });
  
  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem('demo_purchases_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.today === 'number' && typeof parsed.total === 'number') {
          return parsed;
        }
      } catch (e) {}
    }
    return { today: 126, total: 648 };
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [animateId, setAnimateId] = useState(0);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('live_visitors', visitors.toString());
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem('demo_purchases_state', JSON.stringify(purchases));
  }, [purchases]);

  // Handle animation class removal
  useEffect(() => {
    if (animateId > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animateId]);

  // Visitor Counter: Fluctuates randomly to look realistic
  useEffect(() => {
    const visitorInterval = setInterval(() => {
      setVisitors(prev => {
        const change = Math.floor(Math.random() * 9) - 3;
        const newValue = prev + change;
        if (newValue < 100) return 100 + Math.floor(Math.random() * 10);
        if (newValue > 500) return 500 - Math.floor(Math.random() * 10);
        return newValue;
      });
    }, 2500);

    return () => clearInterval(visitorInterval);
  }, []);

  // Purchase Counters: Exactly +1 every 30 seconds
  useEffect(() => {
    const purchaseInterval = setInterval(() => {
      setPurchases(prev => {
        let nextTotal = prev.total + 1;
        let nextToday = prev.today + 1;
        
        if (nextTotal >= 1001) {
          nextTotal = 648;
          nextToday = 126;
        }
        
        setAnimateId(id => id + 1);
        return { today: nextToday, total: nextTotal };
      });
    }, 30000);

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
            <div className={`stat-icon ${isAnimating ? 'animate-icon-glow' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <polyline points="9 13 11 15 16 10"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">
                <span className={isAnimating ? 'animate-value' : ''} style={{ display: 'inline-block' }}>
                  {purchases.today}
                </span>
              </h3>
              <p className="stat-label">Purchases Today</p>
            </div>
          </div>

          <div className="stat-card highlight-card">
            <div className={`stat-icon ${isAnimating ? 'animate-icon-glow' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <polyline points="9 15 11 17 16 12"></polyline>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">
                <span className={isAnimating ? 'animate-value' : ''} style={{ display: 'inline-block' }}>
                  {purchases.total}
                </span>
              </h3>
              <p className="stat-label">Live Purchase Activity</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LiveStats;
