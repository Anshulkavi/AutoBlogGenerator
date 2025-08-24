// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
// import { AnimatePresence } from 'framer-motion';
// import LandingPage from './components/pages/LandingPage';
// import AppPage from './components/pages/AppPage';
// import AuthGuard from './components/auth/AuthGuard';

// const AppWrapper = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleBackToHome = () => {
//     navigate('/');
//   };

//   return (
//     <AnimatePresence mode="wait">
//       <Routes location={location} key={location.pathname}>
//         <Route path="/" element={<LandingPage />} />
//         <Route 
//           path="/app" 
//           element={
//             <AuthGuard>
//               <AppPage onBackToHome={handleBackToHome} />
//             </AuthGuard>
//           } 
//         />
//         {/* Add a catch-all route to redirect to home */}
//         <Route path="*" element={<LandingPage />} />
//       </Routes>
//     </AnimatePresence>
//   );
// };

// const App = () => (
//   <Router>
//     <AppWrapper />
//   </Router>
// );

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/pages/LandingPage';
import AppPage from './components/pages/AppPage';
import AuthGuard from './components/auth/AuthGuard';
import Profile from './components/Profile/Profile';
import DashboardLayout from './components/layout/DashboardLayout';

const AppWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/app" 
          element={
            <AuthGuard>
              <AppPage onBackToHome={handleBackToHome} />
            </AuthGuard>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <AuthGuard>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </AuthGuard>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <AuthGuard>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
                  <p className="text-gray-600">Welcome to your dashboard. Your content will go here.</p>
                </div>
              </DashboardLayout>
            </AuthGuard>
          } 
        />

        <Route 
          path="/my-blogs" 
          element={
            <AuthGuard>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">My Blogs</h1>
                  <p className="text-gray-600">Your blog posts will be displayed here.</p>
                </div>
              </DashboardLayout>
            </AuthGuard>
          } 
        />

        <Route 
          path="/generate" 
          element={
            <AuthGuard>
              <AppPage onBackToHome={handleBackToHome} />
            </AuthGuard>
          } 
        />
        
        {/* Catch-all route to redirect to home */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;