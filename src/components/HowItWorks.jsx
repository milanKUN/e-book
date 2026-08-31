import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    { num: '01', title: 'Choose', desc: 'Pick one opportunity from 500 ideas.', icon: '🎯' },
    { num: '02', title: 'Build', desc: 'Use ChatGPT to create your first sample.', icon: '🛠️' },
    { num: '03', title: 'Offer', desc: 'Package the result into a clear service or product.', icon: '📦' },
    { num: '04', title: 'Grow', desc: 'Get feedback, improve your workflow and repeat.', icon: '📈' }
  ];

  return (
    <section className="section works-section">
      <div className="container">
        <div className="text-center reveal">
          <div className="section-label">HOW IT WORKS</div>
          <h2 className="h2 mb-5">
            Don't Just Read It. <span className="text-emerald">Use It.</span>
          </h2>
        </div>

        <div className="timeline reveal">
          {steps.map((step, index) => (
            <div key={index} className="timeline-step">
              <div className="step-number-wrapper">
                <div className="step-number">{step.icon}</div>
                {index < steps.length - 1 && <div className="step-line" />}
              </div>
              <div className="step-content">
                <span className="step-num-label">STEP {step.num}</span>
                <h3 className="h4 mb-2">{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
