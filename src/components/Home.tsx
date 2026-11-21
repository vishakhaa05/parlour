import React from 'react';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Gallary from './Gallary';
import ReviewsSection from './ReviewsSection';
import Contact from './Contect';

const Home: React.FC = () => {
  return (
    <>
      {/* 2. Premium hero section */}
      <Hero />

      {/* 3. About Us section */}
      <About />

      {/* 4. Popular Beauty Services */}
      <Services />

      {/* 5. Beauty Portfolio / Gallery */}
      <Gallary />

      {/* 6. Customer Testimonials */}
      <ReviewsSection />

      {/* 7. Contact section */}
      <Contact />
    </>
  );
};

export default Home;
