import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import './Support.css';
import { config } from '../config';

const Support = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <main className="support-section">
        <div className="container">
          
          <div className="support-header">
            <h1 className="support-title">How can we help?</h1>
            <p className="support-desc">
              If you have any questions, issues with your order, or need assistance, our support team is here for you.
            </p>
          </div>

          <div className="support-grid">
            
            <div className="contact-card">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h3>WhatsApp Support</h3>
              <p>Get quick responses for delivery issues or urgent payment queries via WhatsApp.</p>
              <a href={`https://wa.me/${config.WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                Chat on WhatsApp
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3>Email Support</h3>
              <p>For detailed queries, refund requests, or business inquiries, please email us.</p>
              <a href={`mailto:${config.EMAIL}`} className="contact-link">
                {config.EMAIL}
              </a>
            </div>

          </div>

          <div className="support-faq">
            <h3>Quick Answers</h3>
            
            <div className="faq-mini-item">
              <h4>I paid but didn't receive the eBook. What should I do?</h4>
              <p>Don't worry! Sometimes delivery emails get delayed or end up in the spam folder. First, check your spam/promotions tab. If it's not there, send us a WhatsApp message with your payment screenshot or email address, and we will manually send you the access link immediately.</p>
            </div>

            <div className="faq-mini-item">
              <h4>My payment failed but money was deducted.</h4>
              <p>If the money was deducted but the transaction shows as failed, the payment gateway will automatically refund the amount to your original payment method within 3-5 business days. You can safely try purchasing again.</p>
            </div>

            <div className="faq-mini-item">
              <h4>Can I read the eBook on my phone?</h4>
              <p>Yes! The eBook is delivered in a high-quality PDF format that is fully compatible with smartphones, tablets, laptops, and desktop computers.</p>
            </div>

          </div>

        </div>
      </main>
      
      {/* Include the Chatbot on the support page as well */}
      <Chatbot />
      <Footer />
    </>
  );
};

export default Support;
