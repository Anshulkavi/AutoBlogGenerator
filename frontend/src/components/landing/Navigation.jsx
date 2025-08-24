// // //components/landing/Navigation.jsx

// // import React from 'react';
// // import { Sparkles } from 'lucide-react';

// // const Navigation = ({ onGetStarted }) => (
// //   <nav className="relative z-10 px-6 py-4">
// //     <div className="max-w-7xl mx-auto flex items-center justify-between">
// //       <div className="flex items-center space-x-2">
// //         <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
// //           <Sparkles className="w-5 h-5 text-white" />
// //         </div>
// //         <span className="text-xl font-bold text-white">BlogAI</span>
// //       </div>
// //       <button
// //         onClick={onGetStarted}
// //         className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
// //       >
// //         Get Started
// //       </button>
// //     </div>
// //   </nav>
// // );

// // export default Navigation;

// import React from "react";
// import { Sparkles } from "lucide-react";

// const Navigation = ({ onGetStarted }) => (
//   <header className="relative z-20 px-6 py-5">
//     <div className="max-w-7xl mx-auto flex items-center justify-between">
//       {/* Logo */}
//       <div className="flex items-center space-x-3">
//         <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
//           <Sparkles className="w-6 h-6 text-white" />
//         </div>
//         <span className="text-2xl font-extrabold text-white tracking-wide">
//           BlogAI
//         </span>
//       </div>

//       {/* CTA */}
//       <button
//         onClick={onGetStarted}
//         className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md"
//       >
//         Get Started
//       </button>
//     </div>
//   </header>
// );

// export default Navigation;

// components/landing/Navigation.jsx
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const Navigation = ({ onLogin, onSignUp, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Read login state from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
  };

  return (
    <nav className="relative z-10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">BlogAI</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
          <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Hi, {user?.name || "User"}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button onClick={onLogin} className="text-gray-300 hover:text-white transition-colors">
                Login
              </button>
              <button 
                onClick={onSignUp}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* ✅ Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2 space-y-2 bg-gray-800 p-4 rounded-lg">
          <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
          <a href="#testimonials" className="block text-gray-300 hover:text-white">Reviews</a>
          <a href="#contact" className="block text-gray-300 hover:text-white">Contact</a>

          {isLoggedIn ? (
            <>
              <span className="block text-gray-300">Hi, {user?.name || "User"}</span>
              <button onClick={handleLogout} className="w-full text-left bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={onLogin} className="block w-full text-left text-gray-300 hover:text-white">
                Login
              </button>
              <button 
                onClick={onSignUp}
                className="block w-full text-left bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
