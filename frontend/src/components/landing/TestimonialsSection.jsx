// components/landing/TestimonialsSection.jsx
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    { 
      name: "Sarah Johnson", 
      role: "Content Manager", 
      text: "This tool has revolutionized our content strategy. We're publishing 10x more content with the same team!" 
    },
    { 
      name: "Mike Chen", 
      role: "Digital Marketer", 
      text: "The SEO optimization is incredible. Our organic traffic increased by 300% in just 2 months." 
    },
    { 
      name: "Emma Davis", 
      role: "Blogger", 
      text: "I can focus on what I love - connecting with my audience - while the AI handles the heavy writing." 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
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
  );
};

export default TestimonialsSection;