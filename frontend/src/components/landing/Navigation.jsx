//components/landing/Navigation.jsx

import React from 'react';
import { Sparkles } from 'lucide-react';

const Navigation = ({ onGetStarted }) => (
  <nav className="relative z-10 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">BlogAI</span>
      </div>
      <button
        onClick={onGetStarted}
        className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
      >
        Get Started
      </button>
    </div>
  </nav>
);

export default Navigation;