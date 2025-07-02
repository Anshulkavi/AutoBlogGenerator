import { Zap, FileText, Users } from "lucide-react";

export const FeatureCard = ({ icon: Icon, title, description, gradient }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform duration-300">
    <div
      className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center mb-4 mx-auto`}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export const FeaturesGrid = () => (
  <div className="grid md:grid-cols-3 gap-8 mt-20">
    <FeatureCard
      icon={Zap}
      title="Lightning Fast"
      description="Generate complete blog posts in under 30 seconds with our advanced AI technology."
      gradient="from-blue-400 to-purple-400"
    />
    <FeatureCard
      icon={FileText}
      title="High Quality"
      description="SEO-optimized, well-structured content that engages readers and drives traffic."
      gradient="from-green-400 to-blue-400"
    />
    <FeatureCard
      icon={Users}
      title="User Friendly"
      description="Intuitive interface designed for bloggers, marketers, and content creators."
      gradient="from-purple-400 to-pink-400"
    />
  </div>
);

// ✅ Fix: export only FeaturesGrid as default
export default FeaturesGrid;
