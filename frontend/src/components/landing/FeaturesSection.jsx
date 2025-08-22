// components/landing/FeaturesSection.jsx
import React from 'react';
import { Zap, FileText, Users, BarChart3, Clock, Shield } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
  <div className="group bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105">
    <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{description}</p>
  </div>
);

const AdditionalFeature = ({ icon: Icon, title, description, iconColor }) => (
  <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
    <Icon className={`w-8 h-8 ${iconColor}`} />
    <div>
      <h4 className="font-semibold text-white">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate complete, publication-ready blog posts in under 30 seconds. Our advanced AI processes your topic and creates engaging content instantly.",
      gradient: "from-blue-400 to-purple-400"
    },
    {
      icon: FileText,
      title: "SEO Optimized",
      description: "Built-in SEO optimization ensures your content ranks higher. Meta descriptions, keyword integration, and proper structure included automatically.",
      gradient: "from-green-400 to-blue-400"
    },
    {
      icon: Users,
      title: "User Friendly",
      description: "Intuitive interface designed for creators of all skill levels. No technical knowledge required - just enter your topic and watch the magic happen.",
      gradient: "from-purple-400 to-pink-400"
    }
  ];

  const additionalFeatures = [
    {
      icon: BarChart3,
      title: "Analytics Ready",
      description: "Track performance metrics",
      iconColor: "text-green-400"
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "10x faster content creation",
      iconColor: "text-blue-400"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected",
      iconColor: "text-purple-400"
    }
  ];

  return (
    <section id="features" className="relative z-10 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Everything you need to create compelling content that converts</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
            />
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {additionalFeatures.map((feature, index) => (
            <AdditionalFeature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconColor={feature.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;