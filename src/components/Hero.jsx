import React, { useState, useEffect } from 'react';
import { config } from '../config';
import './Hero.css';

const Hero = () => {
  const [sales, setSales] = useState(config.REAL_SALES_COUNT);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!config.SHOW_REAL_SALES_COUNTER) return;

    const fetchSales = async () => {
      try {
        const response = await fetch('/api/sales-count');
        if (response.ok) {
          const data = await response.json();
          if (data.completed_orders > sales) {
            setSales(data.completed_orders);
            setAnimated(true);
            setTimeout(() => setAnimated(false), 2000);
          }
        }
      } catch (error) {
        console.error('Failed to fetch sales count:', error);
      }
    };

    fetchSales();
    const interval = setInterval(fetchSales, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [sales]);

  return (
    <section className="hero section-dark" id="hero">
      <div className="hero-bg-effects">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-grid-pattern"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="h1">
              <span className="text-gradient">The 500 Hidden ChatGPT Secrets</span> That Turn
              Ordinary Skills Into{' '}
              <span className="text-gradient">A High-Paying Side Hustle</span>
            </h1>
            <p className="hero-subheadline">
              While others just use AI for fun, smart freelancers are using these exact 500 frameworks to land global clients, earn in dollars, and build profitable digital assets from home. Here is what they know that you don't...
            </p>

            <div className="cta-group">
              <a href="#whats-inside" className="btn btn-outline">
                SEE WHAT'S INSIDE ↓
              </a>
            </div>

            <div className="hero-features-list">
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Instant Digital Access
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                500 Practical Ideas
              </div>
              <div className="feature-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Beginner Friendly
              </div>

            </div>

            {config.SHOW_REAL_SALES_COUNTER && sales > 0 ? (
              <div className={`hero-counter ${animated ? 'glow-update' : ''}`}>
                <div className="hero-counter-dot"></div>
                <span className="hero-counter-text">
                  <strong>{sales}</strong> copies purchased
                </span>
              </div>
            ) : (
              <div className="hero-counter-static">
                <div className="hero-counter-dot-static"></div>
                <span className="hero-counter-text">
                  <strong>500+</strong> Practical Ideas Inside
                </span>
              </div>
            )}

            <div className="trust-disclaimer">
              <p className="trust-line">Learn the opportunities. Apply the ideas. Build real value.</p>
              <p className="disclaimer-text">
                Income depends on execution, skills, market demand, pricing and consistency.
              </p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="mockup-wrapper">
              <div className="mockup-glow"></div>
              <img
                src={config.COVER_IMAGE}
                alt={config.PRODUCT_NAME}
                className="ebook-mockup"
              />
              <div className="mockup-badge">
                <span>500 IDEAS</span>
                <span className="badge-dot">•</span>
                <span>25 CATEGORIES</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
