import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './PaymentSuccess.css';
import { config } from '../config';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('VERIFYING'); // VERIFYING, SUCCESS, PENDING, FAILED
  const [downloadToken, setDownloadToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    const orderId = searchParams.get('order_id') || searchParams.get('cf_id');
    
    if (!orderId) {
      setStatus('FAILED');
      setErrorMessage('No order ID found in the URL. If you made a payment, please contact support.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch('/.netlify/functions/verify-cashfree-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setStatus(data.status); // SUCCESS, PENDING, FAILED
          if (data.status === 'SUCCESS' && data.download_token) {
            setDownloadToken(data.download_token);
            
            // Fire Meta Pixel tracking only once per successful order
            const trackingKey = `meta_purchase_tracked_${orderId}`;
            if (!sessionStorage.getItem(trackingKey)) {
              if (window.fbq) {
                window.fbq('track', 'Purchase', {
                  value: 99.00,
                  currency: 'INR'
                });
              }
              sessionStorage.setItem(trackingKey, 'true');
            }
          } else if (data.status === 'FAILED') {
            setErrorMessage(data.message || 'Payment verification failed.');
          }
        } else {
          setStatus('FAILED');
          setErrorMessage(data.error || 'Failed to connect to verification server.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('FAILED');
        setErrorMessage('A network error occurred while verifying your payment.');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <>
      <main className="success-section" style={{ minHeight: '100vh' }}>
        <div className="container">
          <div className="success-card">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <img src="/logo.png" alt={`${config.COMPANY_NAME} Logo`} style={{ height: '64px', width: 'auto', borderRadius: '8px', margin: '0 auto' }} />
            </div>

            {status === 'VERIFYING' && (
              <div className="text-center">
                <div className="spinner" style={{ margin: '0 auto 20px auto', width: '40px', height: '40px', border: '4px solid rgba(255, 90, 10, 0.2)', borderTopColor: '#FF5A0A', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <h1 className="success-title">Verifying Payment...</h1>
                <p className="success-desc">Please do not close or refresh this page. We are securely checking your payment status.</p>
              </div>
            )}

            {status === 'PENDING' && (
              <div className="text-center">
                <div className="success-icon" style={{ borderColor: '#f39c12', color: '#f39c12' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h1 className="success-title">Payment Pending</h1>
                <p className="success-desc">Your payment is still processing with the bank. Please check back later or contact support if the amount was deducted.</p>
                <div className="secondary-actions" style={{ display: 'flex', gap: '16px', flexDirection: 'column', marginTop: '30px' }}>
                  <Link to="/support" className="btn btn-primary">CONTACT SUPPORT</Link>
                  <Link to="/" className="btn btn-outline">RETURN TO HOME</Link>
                </div>
              </div>
            )}

            {status === 'FAILED' && (
              <div className="text-center">
                <div className="success-icon" style={{ borderColor: '#e74c3c', color: '#e74c3c' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <h1 className="success-title">Payment Failed</h1>
                <p className="success-desc">{errorMessage || 'Your payment could not be completed.'}</p>
                <div className="secondary-actions" style={{ display: 'flex', gap: '16px', flexDirection: 'column', marginTop: '30px' }}>
                  <Link to="/" className="btn btn-primary">TRY AGAIN</Link>
                  <Link to="/support" className="btn btn-outline">CONTACT SUPPORT</Link>
                </div>
              </div>
            )}

            {status === 'SUCCESS' && (
              <>
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
                  {downloadToken ? (
                    <a href={`/.netlify/functions/secure-ebook-download?token=${downloadToken}`} className="btn btn-primary btn-block mb-3" style={{ width: '100%' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: 20, height: 20, marginRight: 10}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      DOWNLOAD EBOOK (PDF)
                    </a>
                  ) : (
                    <div className="alert alert-warning">Download link unavailable. Please contact support.</div>
                  )}
                  <div className="secondary-actions" style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                    <Link to="/" className="btn btn-outline">
                      RETURN TO HOME
                    </Link>
                    <Link to="/support" className="btn btn-outline">
                      CONTACT SUPPORT
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
      </main>
    </>
  );
};

export default PaymentSuccess;
