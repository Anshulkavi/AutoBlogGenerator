//pages/LandingPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navigation from '../landing/Navigation';
import HeroSection from '../landing/HeroSection';
import FeaturesGrid from '../landing/Features';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, FileText, Users, Star, CheckCircle, Play, Sparkles, BarChart3, Clock, Shield } from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    { name: "Sarah Johnson", role: "Content Manager", text: "This tool has revolutionized our content strategy. We're publishing 10x more content with the same team!" },
    { name: "Mike Chen", role: "Digital Marketer", text: "The SEO optimization is incredible. Our organic traffic increased by 300% in just 2 months." },
    { name: "Emma Davis", role: "Blogger", text: "I can focus on what I love - connecting with my audience - while the AI handles the heavy writing." }
  ];

  const stats = [
    { number: "50K+", label: "Blogs Generated" },
    { number: "15K+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BlogAI</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Seconds</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Harness the power of advanced AI to generate high-quality, SEO-optimized blog posts that engage your audience and drive results. Join thousands of creators who've revolutionized their content strategy.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-3">
              <span>Start Creating Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group border border-white/30 text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center space-x-3 backdrop-blur-lg">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
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

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Everything you need to create compelling content that converts</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-300 leading-relaxed">Generate complete, publication-ready blog posts in under 30 seconds. Our advanced AI processes your topic and creates engaging content instantly.</p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">SEO Optimized</h3>
              <p className="text-gray-300 leading-relaxed">Built-in SEO optimization ensures your content ranks higher. Meta descriptions, keyword integration, and proper structure included automatically.</p>
            </div>

            <div className="group bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">User Friendly</h3>
              <p className="text-gray-300 leading-relaxed">Intuitive interface designed for creators of all skill levels. No technical knowledge required - just enter your topic and watch the magic happen.</p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <BarChart3 className="w-8 h-8 text-green-400" />
              <div>
                <h4 className="font-semibold text-white">Analytics Ready</h4>
                <p className="text-gray-400 text-sm">Track performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <Clock className="w-8 h-8 text-blue-400" />
              <div>
                <h4 className="font-semibold text-white">Save Time</h4>
                <p className="text-gray-400 text-sm">10x faster content creation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <h4 className="font-semibold text-white">Secure & Private</h4>
                <p className="text-gray-400 text-sm">Your data is protected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Creators Say</h2>
          <p className="text-xl text-gray-300 mb-16">Join thousands of satisfied users</p>
          
          <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <blockquote className="text-xl text-white mb-8 leading-relaxed">
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            
            <div className="text-gray-300">
              <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
              <div className="text-sm">{testimonials[currentTestimonial].role}</div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-purple-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Content?</h2>
            <p className="text-xl text-gray-300 mb-8">Join thousands of creators who've revolutionized their blogging workflow</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-2xl">
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

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BlogAI</span>
          </div>
          <p className="text-gray-400">© 2024 BlogAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;