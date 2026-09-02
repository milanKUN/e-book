import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PaymentSuccess.css';
import { config } from '../config';

const PaymentSuccess = () => {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Track Meta Pixel Purchase Event
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('order_id') || urlParams.get('cf_id') || urlParams.get('txnid') || 'generic';
      
      const trackingKey = `meta_purchase_tracked_${orderId}`;
      
      // Prevent duplicate tracking by checking sessionStorage
      if (!sessionStorage.getItem(trackingKey)) {
        if (window.fbq) {
          window.fbq('track', 'Purchase', {
            value: 99.00,
            currency: 'INR'
          });
        }
        sessionStorage.setItem(trackingKey, 'true');
      }
    } catch (e) {
      console.error('Meta Pixel tracking error:', e);
    }
  }, []);

  return (
    <>
      <main className="success-section" style={{ minHeight: '100vh' }}>
        <div className="container">
          <div className="success-card">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <img src="/logo.png" alt={`${config.COMPANY_NAME} Logo`} style={{ height: '64px', width: 'auto', borderRadius: '8px', margin: '0 auto' }} />
            </div>

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
                  <h4>Download Your eBook</h4>
                  <p>You can instantly download your eBook using the secure button below.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-text">
                  <h4>Need Help?</h4>
                  <p>If you have any issues, please contact our support team.</p>
                </div>
              </div>
            </div>

            <div className="success-actions-vertical">
              <a href="https://drive.google.com/file/d/1sqZm9nVnuL5PO83_49XrFeXyppSpYehP/view?usp=sharing" download className="btn btn-primary btn-block mb-3" style={{ width: '100%' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 20, height: 20, marginRight: 10}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                DOWNLOAD EBOOK (PDF)
              </a>
              <div className="secondary-actions" style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                <Link to="/" className="btn btn-outline">
                  RETURN TO HOME
                </Link>
                <Link to="/support" className="btn btn-outline">
                  CONTACT SUPPORT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PaymentSuccess;
