import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PaymentSuccess from './pages/PaymentSuccess';
import Support from './pages/Support';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        
        {/* Handle mistyped URLs gracefully */}
        <Route path="/payment%20success" element={<Navigate to="/payment-success" replace />} />
        <Route path="/payment success" element={<Navigate to="/payment-success" replace />} />
        
        <Route path="/support" element={<Support />} />
        
        {/* Catch-all 404 Route */}
        <Route path="*" element={
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--dark-bg)' }}>
            <Header />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column', padding: '100px 20px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '20px' }}>404 - Page Not Found</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>The page you are looking for does not exist or has been moved.</p>
              <a href="/" className="btn btn-primary">RETURN TO HOME</a>
            </div>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
