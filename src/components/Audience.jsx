import React from 'react';
import './Audience.css';

const Audience = () => {
  const audiences = [
    "Freelancers",
    "Students",
    "Job Seekers",
    "Content Creators",
    "Small Business Owners",
    "Digital Marketers",
    "Agency Owners",
    "Beginners Exploring AI",
    "Side-Income Seekers",
    "Existing Freelancers"
  ];

  return (
    <section className="section section-dark audience-section">
      <div className="container">
        <div className="text-center reveal mb-5">
          <div className="section-label section-label-dark">FOR EVERYONE</div>
          <h2 className="h2 mb-4">Who Can Use This Guide?</h2>
          <p className="subtitle mx-auto" style={{ maxWidth: '600px', color: '#fff' }}>
            <strong>You don't need to be an AI expert.</strong> <br/>
            You need a willingness to learn, test and take action.
          </p>
        </div>

        <div className="audience-grid reveal">
          {audiences.map((audience, i) => (
            <div key={i} className="audience-card">
              <div className="audience-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span className="audience-label">{audience}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Audience;
