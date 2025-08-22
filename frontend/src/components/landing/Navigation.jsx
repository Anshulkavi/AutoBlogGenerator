// //components/landing/Navigation.jsx

// import React from 'react';
// import { Sparkles } from 'lucide-react';

// const Navigation = ({ onGetStarted }) => (
//   <nav className="relative z-10 px-6 py-4">
//     <div className="max-w-7xl mx-auto flex items-center justify-between">
//       <div className="flex items-center space-x-2">
//         <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
//           <Sparkles className="w-5 h-5 text-white" />
//         </div>
//         <span className="text-xl font-bold text-white">BlogAI</span>
//       </div>
//       <button
//         onClick={onGetStarted}
//         className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
//       >
//         Get Started
//       </button>
//     </div>
//   </nav>
// );

// export default Navigation;

import React from "react";
import { Sparkles } from "lucide-react";

const Navigation = ({ onGetStarted }) => (
  <header className="relative z-20 px-6 py-5">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-extrabold text-white tracking-wide">
          BlogAI
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={onGetStarted}
        className="bg-white text-gray-900 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md"
      >
        Get Started
      </button>
    </div>
  </header>
);

export default Navigation;
