import React from 'react';
import { Sparkles } from 'lucide-react';

const WelcomeScreen = ({ onSampleClick }) => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Start Creating Amazing Blogs</h2>
      <p className="text-gray-600 mb-6">Tell me what you'd like to write about, and I'll generate a complete blog post for you.</p>
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => onSampleClick("The future of artificial intelligence")}
          className="p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
        >
          <div className="font-medium text-gray-800">The future of artificial intelligence</div>
          <div className="text-sm text-gray-600">Explore AI trends and predictions</div>
        </button>
        <button
          onClick={() => onSampleClick("Sustainable living tips for beginners")}
          className="p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
        >
          <div className="font-medium text-gray-800">Sustainable living tips</div>
          <div className="text-sm text-gray-600">Guide to eco-friendly lifestyle</div>
        </button>
      </div>
    </div>
  </div>
);

export default WelcomeScreen;