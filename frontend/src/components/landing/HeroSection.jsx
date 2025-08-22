// components/landing/HeroSection.jsx

import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = ({ onGetStarted }) => (
  <div className="relative px-6 py-20">
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Generate 
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Blogs</span>
          <br />
          in Seconds
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Transform your ideas into compelling blog posts with our AI-powered generator. 
          Create high-quality content that engages your audience instantly.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <button
          onClick={onGetStarted}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <span>Start Creating</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <button className="border border-gray-300 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors">
          Watch Demo
        </button>
      </div>
    </div>
  </div>
);

export default HeroSection;