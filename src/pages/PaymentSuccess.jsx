import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PaymentSuccess.css';
import { config } from '../config';

const PaymentSuccess = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <main className="success-section">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <h1 className="success-title">Payment Successful!</h1>
            <p className="success-desc">
              Thank you for your purchase. Your order has been securely processed and confirmed.
            </p>

            <div className="success-steps">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-text">
                  <h4>Order Processed</h4>
                  <p>Your payment of ₹{config.PRODUCT_PRICE} was successfully captured.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-text">
                  <h4>Check Your Email / Messages</h4>
                  <p>Your digital eBook access is being delivered to you right now via the configured delivery method.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-text">
                  <h4>Need Help?</h4>
                  <p>If you don't receive your eBook within 15 minutes, please contact our support team with your payment details.</p>
                </div>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/" className="btn btn-outline">
                RETURN TO HOME
              </Link>
              <Link to="/support" className="btn btn-primary">
                CONTACT SUPPORT
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
