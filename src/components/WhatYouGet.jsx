import React from 'react';
import './WhatYouGet.css';

const WhatYouGet = () => {
  return (
    <section className="section bg-light what-you-get-section">
      <div className="container">
        <div className="text-center reveal mb-5">
          <h2 className="h2 mb-3">WHAT YOU'RE REALLY GETTING</h2>
          <p className="subtitle mx-auto" style={{ maxWidth: '700px' }}>
            This isn't a list of random AI tricks.
            It's an idea library designed to help you discover what you could create, sell or offer using AI.
          </p>
        </div>

        <div className="wyg-grid reveal">
          <div className="wyg-card">
            <div className="wyg-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h3>500 Practical Ideas</h3>
            <p>A massive, categorized library of specific ways to generate income using AI capabilities.</p>
          </div>
          
          <div className="wyg-card">
            <div className="wyg-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </div>
            <h3>25 Focused Categories</h3>
            <p>From freelance services to digital products to local business support — find your perfect niche.</p>
          </div>
          
          <div className="wyg-card">
            <div className="wyg-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3>Actionable AI Workflows</h3>
            <p>Step-by-step processes explaining exactly how to execute the ideas efficiently.</p>
          </div>
          
          <div className="wyg-card">
            <div className="wyg-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3>Ready-to-Adapt Prompts</h3>
            <p>Starter prompts you can immediately plug into ChatGPT to begin producing results.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGet;
