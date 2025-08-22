// //pages/LandingPage.jsx
// import React from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import Navigation from '../landing/Navigation';
// import HeroSection from '../landing/HeroSection';
// import FeaturesGrid from '../landing/Features';

// const LandingPage = () => {
//   const navigate = useNavigate();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -50 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
//     >
//       <Navigation onGetStarted={() => navigate('/app')} />
//       <HeroSection onGetStarted={() => navigate('/app')} />
//       <div className="px-6 max-w-4xl mx-auto">
//         <FeaturesGrid />
//       </div>
//     </motion.div>
//   );
// };

// export default LandingPage;


// pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../landing/Navigation';
import HeroSection from '../landing/HeroSection';
import FeaturesSection from '../landing/FeaturesSection';
import TestimonialsSection from '../landing/TestimonialsSection';
import CTASection from '../landing/CTASection';
import Footer from '../landing/Footer';
import AuthModal from '../../auth/AuthModal';
import BackgroundElements from '../landing/BackgroundElements';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleGetStarted = () => {
    // Check if user is already authenticated
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/app');
    } else {
      openAuthModal('register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <BackgroundElements />
      
      <Navigation 
        onLogin={() => openAuthModal('login')}
        onSignUp={() => openAuthModal('register')}
      />
      
      <HeroSection 
        isVisible={isVisible}
        onGetStarted={handleGetStarted}
      />
      
      <FeaturesSection />
      
      <TestimonialsSection />
      
      <CTASection 
        onGetStarted={handleGetStarted}
      />
      
      <Footer />

      <AuthModal 
        isOpen={showAuthModal}
        mode={authMode}
        onClose={closeAuthModal}
        onSwitchMode={setAuthMode}
        onSuccess={() => {
          closeAuthModal();
          navigate('/app');
        }}
      />
    </div>
  );
};

export default LandingPage;