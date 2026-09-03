import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { config } from '../config';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <main style={{ padding: '80px 20px', background: 'var(--dark-bg)', color: 'white', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '12px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', marginBottom: '30px' }}>Refund & Cancellation Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <br/>
          
          <h3>1. Digital Product Policy</h3>
          <p>Because the {config.PRODUCT_NAME} is a digital eBook and access is granted instantly upon successful payment, <strong>all sales are final and non-refundable</strong>.</p>
          <p>We do not offer refunds, exchanges, or cancellations once the digital product has been purchased and access has been granted. Please read the product description carefully before making a purchase.</p>
          <br/>

          <h3>2. Failed Transactions</h3>
          <p>If you attempted a payment and the money was deducted from your bank account, but the transaction was marked as "Failed" by the payment gateway, the amount will automatically be refunded to your original payment method by your bank within 3-7 business days.</p>
          <br/>

          <h3>3. Payment Deducted but eBook Not Delivered</h3>
          <p>In rare cases, a payment might be successful but a network error could prevent the delivery page from loading. If this happens:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>Do NOT make another payment.</li>
            <li>Immediately contact us via WhatsApp ({config.WHATSAPP_NUMBER}) or Email ({config.EMAIL}).</li>
            <li>Provide your payment screenshot, Email ID, or Phone Number used during checkout.</li>
            <li>We will manually verify the payment on our Cashfree dashboard and send you the direct access link within 24 hours.</li>
          </ul>
          <br/>

          <h3>4. Delivery and Access</h3>
          <p>The product is delivered via a secure, encrypted link immediately upon payment success. You are responsible for ensuring you download or access the eBook within the valid time limit indicated on the success page.</p>
          <br/>

          <h3>5. Contact Us</h3>
          <p>If you have any questions or experience issues with your download, please contact support:</p>
          <p>Email: {config.EMAIL}</p>
          <p>WhatsApp: {config.WHATSAPP_NUMBER}</p>
          {config.ADDRESS !== "YOUR_PHYSICAL_ADDRESS_HERE, CITY, STATE, PIN_CODE" && <p>Address: {config.ADDRESS}</p>}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RefundPolicy;
