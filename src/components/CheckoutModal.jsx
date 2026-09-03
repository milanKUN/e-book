import React, { useState } from 'react';
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
    await handleCheckout(e, setIsProcessing, {
      customer_name: formData.name.trim(),
      customer_email: formData.email.trim(),
      customer_phone: formData.phone.trim().startsWith('+') ? formData.phone.trim() : `+91${formData.phone.trim()}`
    });
  };

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
              Payments protected by Cashfree
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
