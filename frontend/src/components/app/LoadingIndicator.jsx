import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-3xl">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
        <span className="font-medium text-gray-800">BlogAI</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        <span className="text-gray-600 ml-2">Generating your blog post...</span>
      </div>
    </div>
  </div>
);


export default LoadingIndicator;