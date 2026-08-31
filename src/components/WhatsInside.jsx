import React from 'react';
import './WhatsInside.css';

const WhatsInside = () => {
  const items = [
    { num: '01', title: '500 Practical Ideas', icon: '💡' },
    { num: '02', title: '25 Income Categories', icon: '📂' },
    { num: '03', title: 'Customer & Market Angles', icon: '🎯' },
    { num: '04', title: 'Monetization Models', icon: '💰' },
    { num: '05', title: 'Practical AI Workflows', icon: '⚙️' },
    { num: '06', title: 'Starter Prompts', icon: '✨' },
    { num: '07', title: '7-Day Launch Plan', icon: '🚀' },
    { num: '08', title: 'Outreach Templates', icon: '📧' },
    { num: '09', title: 'Pricing Guidance', icon: '💲' },
    { num: '10', title: 'Quality Checklist', icon: '✅' }
  ];

  return (
    <section id="whats-inside" className="section section-dark inside-section">
      <div className="container">
        <div className="text-center reveal">
          <div className="section-label section-label-dark">WHAT'S HIDDEN INSIDE?</div>
          <h2 className="h2 mb-5">
            Unlock the Vault: <span className="text-gold">The ChatGPT Income Guide</span>
          </h2>
        </div>

        <div className="inside-grid">
          {items.map((item, index) => (
            <div
              key={index}
              className="inside-card reveal"
              style={{ transitionDelay: `${(index % 5) * 0.08}s` }}
            >
              <div className="inside-card-top">
                <span className="inside-num">{item.num}</span>
                <span className="inside-icon">{item.icon}</span>
              </div>
              <h4 className="inside-title">{item.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatsInside;
