import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { config } from '../config';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <main style={{ padding: '80px 20px', background: 'var(--dark-bg)', color: 'white', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '12px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', marginBottom: '30px' }}>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <br/>
          
          <h3>1. Information We Collect</h3>
          <p>When you purchase the {config.PRODUCT_NAME}, we collect essential information required to process your order and deliver the product. This includes your name, email address, and phone number.</p>
          <br/>

          <h3>2. Payment Processing</h3>
          <p>All payments are securely processed by Cashfree, our third-party payment gateway. We do not store, process, or have access to your credit card, debit card, or UPI PIN details on our servers.</p>
          <br/>

          <h3>3. Use of Information</h3>
          <p>The information we collect is strictly used to:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>Process your payment securely.</li>
            <li>Deliver the digital eBook to your email.</li>
            <li>Provide customer support related to your purchase.</li>
          </ul>
          <br/>

          <h3>4. Data Sharing</h3>
          <p>We respect your privacy. We do not sell, rent, or trade your personal information with third parties. Your data is only shared with our payment gateway (Cashfree) strictly for the purpose of processing your transaction securely.</p>
          <br/>

          <h3>5. Cookies</h3>
          <p>Our website uses minimal cookies to ensure smooth functionality and track basic analytics (such as Meta Pixel) to improve our marketing efforts. You can disable cookies in your browser, though it may affect checkout functionality.</p>
          <br/>

          <h3>6. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, you can contact us at:</p>
          <p>Email: {config.EMAIL}</p>
          <p>WhatsApp: {config.WHATSAPP_NUMBER}</p>
          {config.ADDRESS !== "YOUR_PHYSICAL_ADDRESS_HERE, CITY, STATE, PIN_CODE" && <p>Address: {config.ADDRESS}</p>}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
