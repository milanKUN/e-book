import React from 'react';
import './IncomeOpportunity.css';

const IncomeOpportunity = () => {
  const cards = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      ),
      num: '01',
      title: 'Learn',
      desc: 'Discover 500 practical AI-assisted opportunities across 25 categories.',
      color: 'emerald'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
      ),
      num: '02',
      title: 'Apply',
      desc: 'Choose an idea, build a sample and start testing it with real people.',
      color: 'gold'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      ),
      num: '03',
      title: 'Earn',
      desc: 'Turn useful skills and outcomes into paid offers that solve real problems.',
      color: 'emerald'
    }
  ];

  return (
    <section className="section section-dark opportunity-section">
      <div className="container">
        <div className="text-center reveal">
          <div className="section-label section-label-dark">THE OPPORTUNITY</div>
          <h2 className="h2 mb-4">
            AI Is Powerful. Knowing How to Use It<br />
            <span className="text-gradient">Is the Opportunity.</span>
          </h2>
          <p className="subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>
            ChatGPT can help you research faster, create content, organize information,
            build workflows and develop useful business assets. The real opportunity comes
            from turning those capabilities into valuable outcomes for real people and businesses.
          </p>
        </div>

        <div className="opp-cards-grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`opp-card reveal`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className={`opp-card-icon opp-card-icon-${card.color}`}>
                {card.icon}
              </div>
              <div className="opp-card-num">{card.num}</div>
              <h3 className="h3 mb-2">{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="flow-bar reveal">
          {['LEARN', 'APPLY', 'DELIVER', 'IMPROVE', 'EARN'].map((step, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="flow-connector" />}
              <div className={`flow-chip ${step === 'EARN' ? 'flow-chip-accent' : ''}`}>
                {step}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IncomeOpportunity;
