import React from 'react';
import './Footer.css';
import { config } from '../config';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/logo.png" alt={`${config.COMPANY_NAME} Logo`} className="footer-logo-img" />
            <p className="footer-tagline">
              Empowering individuals with practical AI skills. Learn how to leverage modern tools to build profitable digital assets, secure high-paying clients, and future-proof your career.
            </p>
          </div>


          <div className="footer-contact">
            <h4>Contact</h4>
            {config.PHONE_NUMBER && (
              <a href={`tel:${config.PHONE_NUMBER}`} className="footer-contact-item">
                <span className="footer-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </span>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">Phone</span>
                  <span className="footer-contact-value">{config.PHONE_NUMBER}</span>
                </div>
              </a>
            )}
            {config.WHATSAPP_NUMBER && (
              <a href={`https://wa.me/${config.WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="footer-contact-item">
                <span className="footer-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </span>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">WhatsApp</span>
                  <span className="footer-contact-value">{config.WHATSAPP_NUMBER}</span>
                </div>
              </a>
            )}
            {config.EMAIL && (
              <a href={`mailto:${config.EMAIL}`} className="footer-contact-item">
                <span className="footer-contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </span>
                <div className="footer-contact-text">
                  <span className="footer-contact-label">Email</span>
                  <span className="footer-contact-value">{config.EMAIL}</span>
                </div>
              </a>
            )}
            {!config.PHONE_NUMBER && !config.WHATSAPP_NUMBER && !config.EMAIL && (
              <p>Contact information not provided.</p>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright © 2026 {config.COMPANY_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
