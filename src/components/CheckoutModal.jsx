import React, { useState, useEffect, useRef } from 'react';
import './CheckoutModal.css';
import { config } from '../config';
import { handleCheckout } from '../utils/checkout';

const CheckoutModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const pollIntervalRef = useRef(null);

  // Poll for payment success when paymentData is set
  useEffect(() => {
    if (paymentData && paymentData.order_id) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch('/.netlify/functions/verify-ekqr-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ client_txn_id: paymentData.order_id })
          });
          const data = await res.json();
          if (data.status === 'SUCCESS') {
            clearInterval(pollIntervalRef.current);
            window.location.href = `/payment-success?client_txn_id=${paymentData.order_id}`;
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);
    }
    
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [paymentData]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required for receipt';
    }
    if (!formData.phone.trim() || !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error on type
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Trigger the checkout process with actual user data
    const data = await handleCheckout(e, setIsProcessing, {
      customer_name: formData.name.trim(),
      customer_email: formData.email.trim(),
      customer_phone: formData.phone.trim().startsWith('+') ? formData.phone.trim() : `+91${formData.phone.trim()}`
    });
    
    if (data) {
      setPaymentData(data);
    }
  };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal-content" onClick={e => e.stopPropagation()}>
        <div className="checkout-modal-header">
          <h3>Secure Checkout</h3>
          <button className="checkout-modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="checkout-modal-body">
          <div className="checkout-product-summary">
            <div>
              <p className="checkout-product-title">{config.PRODUCT_NAME}</p>
              <span style={{ fontSize: '0.85rem', color: '#666' }}>Digital PDF Access</span>
            </div>
            <p className="checkout-product-price">₹{config.PRODUCT_PRICE}</p>
          </div>

          {!paymentData ? (
            <form onSubmit={handleSubmit}>
              <div className="checkout-form-group">
                <label htmlFor="checkout-name">Full Name</label>
                <input
                  id="checkout-name"
                  name="name"
                  type="text"
                  className={`checkout-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isProcessing}
                />
                {errors.name && <span className="checkout-error-text">{errors.name}</span>}
              </div>

              <div className="checkout-form-group">
                <label htmlFor="checkout-email">Email Address</label>
                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  className={`checkout-input ${errors.email ? 'error' : ''}`}
                  placeholder="Where should we send the receipt?"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isProcessing}
                />
                {errors.email && <span className="checkout-error-text">{errors.email}</span>}
              </div>

              <div className="checkout-form-group">
                <label htmlFor="checkout-phone">WhatsApp / Phone Number</label>
                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  className={`checkout-input ${errors.phone ? 'error' : ''}`}
                  placeholder="Enter 10-digit number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isProcessing}
                />
                {errors.phone && <span className="checkout-error-text">{errors.phone}</span>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary checkout-submit-btn"
                disabled={isProcessing}
              >
                {isProcessing ? 'PROCESSING...' : `PAY ₹${config.PRODUCT_PRICE} SECURELY`}
              </button>

              <div className="checkout-secure-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Payments protected by EKQR
              </div>
            </form>
          ) : (
            <div className="payment-options-container">
              <h4 style={{ textAlign: 'center', marginBottom: '8px', color: '#333' }}>Complete your payment</h4>
              <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem', color: '#666' }}>
                Waiting for payment confirmation. Do not close this window.
              </p>
              
              {isMobile && paymentData.upi_intent ? (
                <div className="upi-apps-grid">
                  {paymentData.upi_intent.gpay_link && (
                    <a href={paymentData.upi_intent.gpay_link} className="upi-btn gpay">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="upi-icon" />
                      Pay with GPay
                    </a>
                  )}
                  {paymentData.upi_intent.phonepe_link && (
                    <a href={paymentData.upi_intent.phonepe_link} className="upi-btn phonepe">
                      <img src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" alt="PhonePe" className="upi-icon" style={{ filter: 'brightness(0) invert(1)' }} />
                      Pay with PhonePe
                    </a>
                  )}
                  {paymentData.upi_intent.paytm_link && (
                    <a href={paymentData.upi_intent.paytm_link} className="upi-btn paytm">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="upi-icon" />
                      Pay with Paytm
                    </a>
                  )}
                  {paymentData.upi_intent.bhim_link && (
                    <a href={paymentData.upi_intent.bhim_link} className="upi-btn generic">
                      Pay with Any UPI App
                    </a>
                  )}
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <a href={paymentData.payment_url} className="fallback-payment-link">
                      Other Payment Methods
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <a href={paymentData.payment_url} className="btn btn-primary checkout-submit-btn" style={{ textDecoration: 'none', display: 'block' }}>
                    PROCEED TO PAYMENT
                  </a>
                  <p style={{ marginTop: '12px', fontSize: '0.85rem', color: '#666' }}>
                    You will be redirected to our secure payment gateway to complete your purchase using any UPI app or card.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
