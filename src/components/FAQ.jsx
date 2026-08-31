import React, { useState } from 'react';
import './FAQ.css';
import { config } from '../config';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section section-dark faq-section" id="faq">
      <div className="container">
        <div className="text-center reveal">
          <div className="section-label section-label-dark">FAQ</div>
          <h2 className="h2 mb-5">Frequently Asked Questions</h2>
        </div>

        <div className="faq-container reveal">
          {config.FAQ.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
              >
                <span className="faq-q-text">{item.question}</span>
                <span className="faq-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {openIndex === index
                      ? <line x1="5" y1="12" x2="19" y2="12"/>
                      : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
                    }
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div className="faq-answer-inner">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
