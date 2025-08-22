// // // components/landing/HeroSection.jsx

// // import React from 'react';
// // import { ArrowRight } from 'lucide-react';

// // const HeroSection = ({ onGetStarted }) => (
// //   <div className="relative px-6 py-20">
// //     <div className="max-w-4xl mx-auto text-center">
// //       <div className="mb-8">
// //         <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
// //           Generate 
// //           <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Blogs</span>
// //           <br />
// //           in Seconds
// //         </h1>
// //         <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
// //           Transform your ideas into compelling blog posts with our AI-powered generator. 
// //           Create high-quality content that engages your audience instantly.
// //         </p>
// //       </div>
      
// //       <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
// //         <button
// //           onClick={onGetStarted}
// //           className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
// //         >
// //           <span>Start Creating</span>
// //           <ArrowRight className="w-5 h-5" />
// //         </button>
// //         <button className="border border-gray-300 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors">
// //           Watch Demo
// //         </button>
// //       </div>
// //     </div>
// //   </div>
// // );

// // export default HeroSection;

// import React from "react";
// import { ArrowRight, PlayCircle } from "lucide-react";
// import { motion } from "framer-motion";

// const HeroSection = ({ onGetStarted }) => (
//   <section className="relative px-6 py-24 md:py-32 text-center">
//     <div className="max-w-5xl mx-auto">
//       {/* Heading */}
//       <motion.h1
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight"
//       >
//         Generate
//         <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//           {" "}
//           Blogs
//         </span>
//         <br />
//         in Seconds 🚀
//       </motion.h1>

//       {/* Subtext */}
//       <motion.p
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3, duration: 0.8 }}
//         className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl mx-auto"
//       >
//         Transform your ideas into compelling posts with our{" "}
//         <span className="text-purple-300 font-medium">AI-powered generator</span>
//         . Create SEO-friendly, engaging blogs instantly.
//       </motion.p>

//       {/* CTA Buttons */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.5, duration: 0.8 }}
//         className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
//       >
//         <button
//           onClick={onGetStarted}
//           className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
//         >
//           <span>Start Creating</span>
//           <ArrowRight className="w-5 h-5" />
//         </button>
//         <button className="border border-gray-400/50 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 flex items-center gap-2 transition-colors">
//           <PlayCircle className="w-5 h-5" />
//           Watch Demo
//         </button>
//       </motion.div>
//     </div>
//   </section>
// );

// export default HeroSection;

// components/landing/HeroSection.jsx
import React from 'react';
import { ArrowRight, Play, Star, CheckCircle } from 'lucide-react';

const HeroSection = ({ isVisible, onGetStarted }) => {
  const stats = [
    { number: "50K+", label: "Blogs Generated" },
    { number: "15K+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "User Rating" }
  ];

  return (
    <section className={`relative z-10 px-6 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm text-gray-300">Trusted by 15,000+ content creators</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Create 
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse"> Stunning</span>
            <br />
            Blogs in 
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Seconds</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Harness the power of advanced AI to generate high-quality, SEO-optimized blog posts that engage your audience and drive results. Join thousands of creators who've revolutionized their content strategy.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button 
            onClick={onGetStarted}
            className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3"
          >
            <span>Start Creating Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group border border-white/30 text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center space-x-3 backdrop-blur-lg">
            <Play className="w-5 h-5" />
            <span>Watch Demo</span>
          </button>
        </div>

        <div className="text-center text-gray-400 mb-8">
          <div className="flex items-center justify-center space-x-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>No credit card required</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Start free forever</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;