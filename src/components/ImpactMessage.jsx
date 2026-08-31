import React from 'react';
import './ImpactMessage.css';

const ImpactMessage = () => {
  const steps = [
    { label: 'LEARN', className: '' },
    { label: 'CHOOSE', className: '' },
    { label: 'BUILD', className: '' },
    { label: 'OFFER', className: 'highlight-offer' },
    { label: 'DELIVER', className: '' },
    { label: 'IMPROVE', className: '' },
    { label: 'EARN', className: 'highlight-earn' }
  ];

  return (
    <section className="section section-dark impact-section">
      <div className="impact-bg"></div>
      <div className="container">
        <div className="text-center reveal">
          <div className="section-label section-label-dark">THE REAL OPPORTUNITY</div>
          <h2 className="h2 mb-4">
            Stop Using ChatGPT Like Everyone Else. <br/>
            <span className="text-gradient">Uncover the 'Build-and-Earn' Framework.</span>
          </h2>
          <p className="subtitle mx-auto mb-5" style={{ maxWidth: '700px' }}>
            Knowing an AI tool is one thing. Knowing the hidden frameworks that get people to actually pay you for it... is the secret.
          </p>
        </div>

        <div className="flow-container reveal">
          <div className="visual-flow">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <div className={`flow-step ${step.className}`}>
                  {step.label}
                </div>
                {i < steps.length - 1 && (
                  <div className="flow-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ImpactMessage;
