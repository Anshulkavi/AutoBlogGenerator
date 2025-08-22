// components/landing/CTASection.jsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

const CTASection = ({ onGetStarted }) => {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Content?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators who've revolutionized their blogging workflow
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              Get Started Free
            </button>
            <button className="border border-white/30 text-white px-12 py-5 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all backdrop-blur-lg">
              Contact Sales
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-8 space-x-4 text-gray-400">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>No credit card required</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>14-day free trial</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;