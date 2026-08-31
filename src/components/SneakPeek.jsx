import React from 'react';
import './SneakPeek.css';

const SneakPeek = () => {
  const sneakPeeks = [
    {
      id: 1,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      ),
      title: "The Global Arbitrage",
      description: "How to use ChatGPT to deliver high-quality SEO and copy services to US/UK clients, earning in dollars while working from home."
    },
    {
      id: 2,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      title: "The Micro-Product Blueprint",
      description: "The exact prompt structure to write, format, and launch niche guides on Gumroad that generate automated daily sales."
    },
    {
      id: 3,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      ),
      title: "The Cold Email Closer",
      description: "A hidden AI framework to generate deeply personalized B2B outreach emails that secure high-paying monthly retainers."
    }
  ];

  return (
    <section className="section section-dark sneak-peek-section">
      <div className="container">
        <div className="text-center reveal mb-5">
          <div className="section-label section-label-dark">LEAKED FRAMEWORKS</div>
          <h2 className="h2 mb-3">A Peek Inside <span className="text-gradient">The Vault</span></h2>
          <p className="subtitle mx-auto">
            Here are just 3 of the 500 hidden frameworks you'll unlock inside the guide.
          </p>
        </div>

        <div className="sneak-peek-grid">
          {sneakPeeks.map((peek) => (
            <div key={peek.id} className="sneak-peek-card glass-card reveal">
              <div className="peek-icon-wrapper">
                {peek.icon}
              </div>
              <h3 className="h4 mb-3 text-gold">{peek.title}</h3>
              <p className="peek-desc">
                {peek.description}
              </p>
              <div className="peek-blur-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SneakPeek;
