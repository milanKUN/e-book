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
  const [paymentData, setPaymentData] = useState(() => {
    const saved = sessionStorage.getItem('pendingPaymentData');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });
  const pollIntervalRef = useRef(null);

  // Poll for payment success when paymentData is set
  useEffect(() => {
    // If it's a manual payment, we don't poll
    if (paymentData && paymentData.is_manual) {
      return;
    }
    
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

  const handleClose = () => {
    sessionStorage.removeItem('pendingPaymentData');
    setPaymentData(null);
    onClose();
  };

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

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    
    const upiString = `pa=milankundu2003-5@oksbi&pn=Guru%20Netra&am=${config.PRODUCT_PRICE}.00&cu=INR`;
    
    const manualData = {
      is_manual: true,
      email: formData.email,
      name: formData.name,
      upi_intent: {
        gpay_link: `gpay://upi/pay?${upiString}`,
        phonepe_link: `phonepe://pay?${upiString}`,
        paytm_link: `paytmmp://pay?${upiString}`,
        bhim_link: `upi://pay?${upiString}`
      },
      payment_url: `upi://pay?${upiString}`
    };

    sessionStorage.setItem('pendingPaymentData', JSON.stringify(manualData));
    setPaymentData(manualData);
    setIsProcessing(false);

    // Auto-redirect on mobile
    if (isMobile) {
      window.location.href = `upi://pay?${upiString}`;
    }
  };


  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal-content" onClick={e => e.stopPropagation()}>
        <div className="checkout-modal-header">
          <h3>Secure Checkout</h3>
          <button className="checkout-modal-close" onClick={handleClose}>
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
                data-analytics-event="form_submit"
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
                Please complete the ₹{config.PRODUCT_PRICE} payment using any UPI app.
              </p>
              
              <div className="upi-apps-grid">
                {paymentData.upi_intent.gpay_link && (
                  <a href={paymentData.upi_intent.gpay_link} className="upi-btn gpay" data-analytics-event="payment_button_click">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="upi-icon" />
                    Pay with GPay
                  </a>
                )}
                {paymentData.upi_intent.phonepe_link && (
                  <a href={paymentData.upi_intent.phonepe_link} className="upi-btn phonepe" data-analytics-event="payment_button_click">
                    <img src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" alt="PhonePe" className="upi-icon" style={{ filter: 'brightness(0) invert(1)' }} />
                    PhonePe
                  </a>
                )}
                {paymentData.upi_intent.paytm_link && (
                  <a href={paymentData.upi_intent.paytm_link} className="upi-btn paytm" data-analytics-event="payment_button_click">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="upi-icon" />
                    Paytm
                  </a>
                )}
                <a href={paymentData.upi_intent.bhim_link} className="upi-btn generic" data-analytics-event="payment_button_click">
                  Any UPI App
                </a>
              </div>
              
              <div style={{ marginTop: '25px', padding: '15px', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9', textAlign: 'center' }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>Step 2: Get Your eBook</h5>
                <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', color: '#1b5e20' }}>
                  After successful payment, click below to send a screenshot on WhatsApp and receive your eBook immediately.
                </p>
                <a 
                  href={`https://wa.me/919735659798?text=Hello,%20I%20have%20paid%20Rs%20${config.PRODUCT_PRICE}%20for%20the%20ChatGPT%20Income%20Guide.%20My%20email%20is%20${paymentData.email}%20and%20name%20is%20${paymentData.name}.%20Please%20send%20the%20eBook.`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary" 
                  style={{ width: '100%', background: '#25D366', color: 'white', textDecoration: 'none' }}
                  data-analytics-event="whatsapp_verification_click"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  I HAVE PAID, GET EBOOK
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
