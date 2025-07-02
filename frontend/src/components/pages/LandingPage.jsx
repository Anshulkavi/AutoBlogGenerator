import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from '../landing/Navigation';
import HeroSection from '../landing/HeroSection';
import FeaturesGrid from '../landing/Features';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
    >
      <Navigation onGetStarted={() => navigate('/app')} />
      <HeroSection onGetStarted={() => navigate('/app')} />
      <div className="px-6 max-w-4xl mx-auto">
        <FeaturesGrid />
      </div>
    </motion.div>
  );
};

export default LandingPage;
