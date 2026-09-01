import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LiveStats from '../components/LiveStats';
import ProductPreview from '../components/ProductPreview';
import Audience from '../components/Audience';
import FAQ from '../components/FAQ';
import Reviews from '../components/Reviews';
import Pricing from '../components/Pricing';
import ImpactMessage from '../components/ImpactMessage';
import WhatsInside from '../components/WhatsInside';
import HowItWorks from '../components/HowItWorks';
import ValueStack from '../components/ValueStack';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import StickyMobileCTA from '../components/StickyMobileCTA';
import Chatbot from '../components/Chatbot';

const Home = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <LiveStats />
      <ProductPreview />
      <Audience />
      <FAQ />
      <Reviews />
      <Pricing />
      <ImpactMessage />
      <WhatsInside />
      <HowItWorks />
      <ValueStack />
      <FinalCTA />
      <Footer />
      <StickyMobileCTA />
      <Chatbot />
    </>
  );
};

export default Home;
