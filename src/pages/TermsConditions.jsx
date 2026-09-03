import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { config } from '../config';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <main style={{ padding: '80px 20px', background: 'var(--dark-bg)', color: 'white', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '12px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', marginBottom: '30px' }}>Terms & Conditions</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <br/>
          
          <h3>1. Introduction</h3>
          <p>Welcome to {config.COMPANY_NAME} ("we", "our", "us"). By accessing or purchasing from our website, you agree to be bound by these Terms & Conditions. Please read them carefully.</p>
          <br/>

          <h3>2. Digital Product</h3>
          <p>The product offered on this website, "{config.PRODUCT_NAME}", is a purely digital PDF eBook. No physical product will be shipped to you. Upon successful payment of ₹{config.PRODUCT_PRICE} INR, you will receive digital access to download the eBook.</p>
          <br/>

          <h3>3. Pricing and Payments</h3>
          <p>All prices are listed in Indian Rupees (INR). Payments are processed securely via Cashfree. We reserve the right to modify prices at any time without prior notice, but any purchases already processed will not be affected by subsequent price changes.</p>
          <br/>

          <h3>4. Copyright and Intellectual Property</h3>
          <p>All content within the {config.PRODUCT_NAME} is the intellectual property of {config.COMPANY_NAME}. Upon purchase, you are granted a single-user license to read and use the information. You may not distribute, reproduce, sell, or publicly share the eBook or its contents without our express written permission.</p>
          <br/>

          <h3>5. Disclaimer of Income Guarantees</h3>
          <p>The eBook provides educational ideas, workflows, and prompts related to AI and ChatGPT. We do not guarantee any specific financial results or income. Your success depends entirely on your own effort, execution, market conditions, and skills. {config.COMPANY_NAME} is not liable for any business losses or lack of financial results.</p>
          <br/>

          <h3>6. Governing Law</h3>
          <p>These terms shall be governed and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in our operating state.</p>
          <br/>

          <h3>7. Contact Information</h3>
          <p>For any inquiries regarding these terms, contact us at:</p>
          <p>Email: {config.EMAIL}</p>
          <p>WhatsApp: {config.WHATSAPP_NUMBER}</p>
          {config.ADDRESS !== "YOUR_PHYSICAL_ADDRESS_HERE, CITY, STATE, PIN_CODE" && <p>Physical Address: {config.ADDRESS}</p>}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsConditions;
