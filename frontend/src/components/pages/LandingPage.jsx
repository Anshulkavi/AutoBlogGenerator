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
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navigation from '../landing/Navigation';
// import HeroSection from '../landing/HeroSection';
// import FeaturesSection from '../landing/FeaturesSection';
// import TestimonialsSection from '../landing/TestimonialsSection';
// import CTASection from '../landing/CTASection';
// import Footer from '../landing/Footer';
// import AuthModal from '../../auth/AuthModal';
// import BackgroundElements from '../landing/BackgroundElements';

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const [isVisible, setIsVisible] = useState(false);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [authMode, setAuthMode] = useState('login');

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   const openAuthModal = (mode) => {
//     setAuthMode(mode);
//     setShowAuthModal(true);
//   };

//   const closeAuthModal = () => {
//     setShowAuthModal(false);
//   };

//   const handleGetStarted = () => {
//     // Check if user is already authenticated
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       navigate('/app');
//     } else {
//       openAuthModal('register');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
//       <BackgroundElements />
      
//       <Navigation 
//         onLogin={() => openAuthModal('login')}
//         onSignUp={() => openAuthModal('register')}
//       />
      
//       <HeroSection 
//         isVisible={isVisible}
//         onGetStarted={handleGetStarted}
//       />
      
//       <FeaturesSection />
      
//       <TestimonialsSection />
      
//       <CTASection 
//         onGetStarted={handleGetStarted}
//       />
      
//       <Footer />

//       <AuthModal 
//         isOpen={showAuthModal}
//         mode={authMode}
//         onClose={closeAuthModal}
//         onSwitchMode={setAuthMode}
//         onSuccess={() => {
//           closeAuthModal();
//           navigate('/app');
//         }}
//       />
//     </div>
//   );
// };

// export default LandingPage;

// pages/LandingPage.jsx
// pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../landing/Navigation';
import HeroSection from '../landing/HeroSection';
import FeaturesSection from '../landing/FeaturesSection';
import TestimonialsSection from '../landing/TestimonialsSection';
import CTASection from '../landing/CTASection';
import Footer from '../landing/Footer';
import AuthModal from '../auth/AuthModal';
import BackgroundElements from '../landing/BackgroundElements';
import ContactSection from "../landing/ContactSection";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Helper function to check if token is valid
  const isValidToken = (token) => {
    if (!token) return false;
    
    try {
      // Basic check - decode JWT to see if it's expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // If token is expired, remove it
      if (payload.exp < currentTime) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return false;
      }
      
      return true;
    } catch (error) {
      // If token is malformed, remove it
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      return false;
    }
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleGetStarted = () => {
    // Check if user has a valid authentication token
    const token = localStorage.getItem('access_token');
    
    if (token && isValidToken(token)) {
      // User is authenticated, redirect to app
      navigate('/app');
    } else {
      // User is not authenticated, show registration modal
      openAuthModal('register');
    }
  };

  const handleAuthSuccess = () => {
    closeAuthModal();
    // Navigate to app after successful authentication
    navigate('/app');
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

      <ContactSection />

      
      <Footer />

      <AuthModal 
        isOpen={showAuthModal}
        mode={authMode}
        onClose={closeAuthModal}
        onSwitchMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default LandingPage;