import React, { useState } from 'react';
import './EbookPreview.css';
import { config } from '../config';

const EbookPreview = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { title: 'Table of Contents', subtitle: 'Overview of all 25 categories' },
    { title: 'Idea Examples', subtitle: 'Practical income opportunities' },
    { title: 'Workflow Examples', subtitle: 'Step-by-step AI workflows' },
    { title: 'Starter Prompts', subtitle: 'Ready-to-use ChatGPT prompts' },
    { title: '7-Day Launch Plan', subtitle: 'From idea to first customer' },
    { title: 'Pricing Section', subtitle: 'How to price your services' }
  ];

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="section section-dark preview-section">
      <div className="container">
        <div className="text-center reveal">
          <div className="section-label section-label-dark">PREVIEW</div>
          <h2 className="h2 mb-5">Sneak Peek Inside</h2>
        </div>

        <div className="carousel-container reveal">
          <button className="carousel-btn prev-btn" onClick={prevSlide} aria-label="Previous slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          <div className="carousel-view">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="carousel-slide">
                  <div className="slide-content">
                    <div className="slide-page-num">PAGE {index + 1}</div>
                    <h4 className="slide-title">{slide.title}</h4>
                    <p className="slide-subtitle">{slide.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-btn next-btn" onClick={nextSlide} aria-label="Next slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${activeSlide === index ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="text-center mt-5">
          <a href={config.PAYMENT_LINK} className="btn btn-primary">
            SEE THE FULL GUIDE
          </a>
        </div>
      </div>
    </section>
  );
};

export default EbookPreview;
