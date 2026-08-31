import React from 'react';
import './ValueStack.css';

const ValueStack = () => {
  const stackItems = [
    "500 Practical AI Income Ideas",
    "25 Income Categories",
    "Customer Angles",
    "Monetization Models",
    "AI Workflows",
    "Starter Prompts",
    "7-Day Launch Plan",
    "Outreach Scripts",
    "Pricing Framework",
    "Quality Checklist"
  ];

  return (
    <section className="section section-dark value-stack-section">
      <div className="container">
        <div className="value-stack-container reveal">
          <div className="value-stack-visual">
            <div className="massive-number">
              <span className="number-500">500</span>
              <span className="number-text">IDEAS</span>
            </div>
            <div className="visual-badge">The Uncensored Library</div>
          </div>
          
          <div className="value-stack-content">
            <h2 className="h2 mb-4">The Missing Blueprints They Don't Tell You About</h2>
            
            <ul className="value-list">
              {stackItems.map((item, i) => (
                <li key={i} className="value-item">
                  <span className="value-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueStack;
