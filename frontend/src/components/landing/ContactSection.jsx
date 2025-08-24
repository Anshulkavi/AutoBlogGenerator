// components/landing/ContactSection.jsx
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-10">
          Have questions or feedback? We'd love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left - Info */}
          <div className="text-gray-300 space-y-4 text-left">
            <p className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-500" /> support@blogai.com
            </p>
            <p className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-purple-500" /> +91 98765 43210
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-500" /> Mumbai, India
            </p>
          </div>

          {/* Right - Form */}
          <form className="text-gray-300 p-6 rounded-xl space-y-4 shadow-lg">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              required
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
