import React from 'react';
import { config } from '../config';
import './Testimonials.css';

const Testimonials = () => {
  const hasTestimonials = config.TESTIMONIALS && config.TESTIMONIALS.length > 0;

  return (
    <section className="section bg-light testimonials-section" id="testimonials">
      <div className="container">
        {hasTestimonials ? (
          <>
            <div className="text-center reveal mb-5">
              <div className="section-label">REAL RESULTS</div>
              <h2 className="h2">What Readers Are Saying</h2>
            </div>
            
            <div className="testimonials-grid reveal">
              {config.TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card glass-card-light">
                  <div className="review-badge">REAL CUSTOMER REVIEW</div>
                  <p className="review-text">"{testimonial.review}"</p>
                  <div className="reviewer-info">
                    {testimonial.photo && <img src={testimonial.photo} alt={testimonial.name} className="reviewer-photo" />}
                    <div className="reviewer-details">
                      <h4 className="reviewer-name">{testimonial.name}</h4>
                      <span className="review-date">{testimonial.date}</span>
                      {testimonial.verified && (
                        <span className="verified-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-testimonials reveal text-center">
             <div className="section-label">EARLY ACCESS</div>
             <h2 className="h2 mb-4">Be Among Our First Readers</h2>
             <p className="subtitle mx-auto" style={{ maxWidth: '600px' }}>
                Real customer experiences will appear here after verified purchases. We do not use fake or fabricated reviews.
             </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
