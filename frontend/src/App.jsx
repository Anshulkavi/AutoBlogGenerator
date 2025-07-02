// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Sparkles, Zap, FileText, Users, ArrowRight, Menu, X, Plus, Download, Copy, Trash2 } from 'lucide-react';

// const App = () => {
//   const [currentPage, setCurrentPage] = useState('landing');
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isGenerating) return;

//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       content: inputValue,
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue('');
//     setIsGenerating(true);

//     // Simulate blog generation
//     setTimeout(() => {
//       const blogContent = generateMockBlogPost(inputValue);
//       const aiMessage = {
//         id: Date.now() + 1,
//         type: 'assistant',
//         content: blogContent,
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, aiMessage]);
//       setIsGenerating(false);
//     }, 2000);
//   };

//   const generateMockBlogPost = (topic) => {
//     return `# ${topic.charAt(0).toUpperCase() + topic.slice(1)}: A Comprehensive Guide

// ## Introduction

// In today's digital landscape, understanding ${topic} has become increasingly important. This comprehensive guide will walk you through the essential aspects and provide actionable insights.

// ## Key Points to Consider

// **1. Foundation Knowledge**
// Understanding the basics is crucial for building a solid foundation in ${topic}. This involves researching current trends and best practices.

// **2. Implementation Strategies**
// - Start with thorough planning and research
// - Create a structured approach to execution
// - Monitor progress and adjust as needed
// - Gather feedback for continuous improvement

// **3. Best Practices**
// The most effective approaches to ${topic} involve consistent application of proven methodologies while remaining adaptable to change.

// ## Conclusion

// Mastering ${topic} requires dedication, continuous learning, and practical application. By following the strategies outlined in this guide, you'll be well-equipped to succeed.

// ---

// *This blog post was generated using AI technology. Feel free to edit and customize it according to your needs.*`;
//   };

//   const LandingPage = () => (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
//       {/* Navigation */}
//       <nav className="relative z-10 px-6 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
//               <Sparkles className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-bold text-white">BlogAI</span>
//           </div>
//           <button
//             onClick={() => setCurrentPage('app')}
//             className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
//           >
//             Get Started
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="relative px-6 py-20">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="mb-8">
//             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
//               Generate 
//               <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Blogs</span>
//               <br />
//               in Seconds
//             </h1>
//             <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
//               Transform your ideas into compelling blog posts with our AI-powered generator. 
//               Create high-quality content that engages your audience instantly.
//             </p>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
//             <button
//               onClick={() => setCurrentPage('app')}
//               className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
//             >
//               <span>Start Creating</span>
//               <ArrowRight className="w-5 h-5" />
//             </button>
//             <button className="border border-gray-300 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors">
//               Watch Demo
//             </button>
//           </div>

//           {/* Features Grid */}
//           <div className="grid md:grid-cols-3 gap-8 mt-20">
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4 mx-auto">
//                 <Zap className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
//               <p className="text-gray-300">Generate complete blog posts in under 30 seconds with our advanced AI technology.</p>
//             </div>
            
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
//               <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mb-4 mx-auto">
//                 <FileText className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-white mb-2">High Quality</h3>
//               <p className="text-gray-300">SEO-optimized, well-structured content that engages readers and drives traffic.</p>
//             </div>
            
//             <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4 mx-auto">
//                 <Users className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-white mb-2">User Friendly</h3>
//               <p className="text-gray-300">Intuitive interface designed for bloggers, marketers, and content creators.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const AppPage = () => (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 transition-all duration-300 overflow-hidden`}>
//         <div className="p-4">
//           <div className="flex items-center space-x-2 mb-8">
//             <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
//               <Sparkles className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-bold text-white">BlogAI</span>
//           </div>
          
//           <button className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg flex items-center space-x-2 mb-6 transition-colors">
//             <Plus className="w-5 h-5" />
//             <span>New Blog Post</span>
//           </button>
          
//           <div className="space-y-2">
//             <div className="text-gray-400 text-sm font-medium mb-2">Recent Generations</div>
//             <div className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
//               <div className="text-white text-sm">AI and Machine Learning</div>
//               <div className="text-gray-400 text-xs">2 hours ago</div>
//             </div>
//             <div className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
//               <div className="text-white text-sm">Digital Marketing Trends</div>
//               <div className="text-gray-400 text-xs">1 day ago</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//             </button>
//             <h1 className="text-xl font-semibold text-gray-800">Blog Generator</h1>
//           </div>
//           <button
//             onClick={() => setCurrentPage('landing')}
//             className="text-gray-600 hover:text-gray-800 transition-colors"
//           >
//             Back to Home
//           </button>
//         </div>

//         {/* Messages Area */}
//         <div className="flex-1 overflow-y-auto p-4">
//           {messages.length === 0 ? (
//             <div className="h-full flex items-center justify-center">
//               <div className="text-center max-w-md">
//                 <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Sparkles className="w-8 h-8 text-white" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Start Creating Amazing Blogs</h2>
//                 <p className="text-gray-600 mb-6">Tell me what you'd like to write about, and I'll generate a complete blog post for you.</p>
//                 <div className="grid grid-cols-1 gap-3">
//                   <button
//                     onClick={() => setInputValue("The future of artificial intelligence")}
//                     className="p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
//                   >
//                     <div className="font-medium text-gray-800">The future of artificial intelligence</div>
//                     <div className="text-sm text-gray-600">Explore AI trends and predictions</div>
//                   </button>
//                   <button
//                     onClick={() => setInputValue("Sustainable living tips for beginners")}
//                     className="p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
//                   >
//                     <div className="font-medium text-gray-800">Sustainable living tips</div>
//                     <div className="text-sm text-gray-600">Guide to eco-friendly lifestyle</div>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="max-w-4xl mx-auto space-y-6">
//               {messages.map((message) => (
//                 <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
//                   <div className={`max-w-3xl ${message.type === 'user' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl p-4`}>
//                     {message.type === 'user' ? (
//                       <div>{message.content}</div>
//                     ) : (
//                       <div>
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center space-x-2">
//                             <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
//                               <Sparkles className="w-3 h-3 text-white" />
//                             </div>
//                             <span className="font-medium text-gray-800">BlogAI</span>
//                           </div>
//                           <div className="flex space-x-2">
//                             <button className="p-1 hover:bg-gray-100 rounded">
//                               <Copy className="w-4 h-4 text-gray-600" />
//                             </button>
//                             <button className="p-1 hover:bg-gray-100 rounded">
//                               <Download className="w-4 h-4 text-gray-600" />
//                             </button>
//                           </div>
//                         </div>
//                         <div className="prose prose-sm max-w-none">
//                           <pre className="whitespace-pre-wrap font-sans text-gray-800">{message.content}</pre>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//               {isGenerating && (
//                 <div className="flex justify-start">
//                   <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-3xl">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
//                         <Sparkles className="w-3 h-3 text-white" />
//                       </div>
//                       <span className="font-medium text-gray-800">BlogAI</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
//                       <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//                       <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//                       <span className="text-gray-600 ml-2">Generating your blog post...</span>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//           )}
//         </div>

//         {/* Input Area */}
//         <div className="border-t border-gray-200 bg-white p-4">
//           <div className="max-w-4xl mx-auto">
//             <div className="flex items-end space-x-4">
//               <div className="flex-1 relative">
//                 <textarea
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   placeholder="What would you like to write about? Be specific for better results..."
//                   className="w-full p-4 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   rows="3"
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSendMessage();
//                     }
//                   }}
//                 />
//               </div>
//               <button
//                 onClick={handleSendMessage}
//                 disabled={!inputValue.trim() || isGenerating}
//                 className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white p-4 rounded-2xl transition-colors"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="text-xs text-gray-500 mt-2 text-center">
//               Press Enter to send, Shift + Enter for new line
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return currentPage === 'landing' ? <LandingPage /> : <AppPage />;
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/pages/LandingPage';
import AppPage from './components/pages/AppPage';

const AppWrapper = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppPage />} />
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
