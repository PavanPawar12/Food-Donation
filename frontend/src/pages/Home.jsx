import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaHandHoldingHeart, 
  FaHandsHelping, 
  FaLeaf, 
  FaUsers, 
  FaChartLine, 
  FaStar,
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt
} from "react-icons/fa";
import foodDistributionImage from "../assets/landing_image.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isLoggedIn = useMemo(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!token && !!user;
  }, []);

  const handleProtectedNav = (path) => (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowAuthModal(true);
      return;
    }
    navigate(path);
  };
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Restaurant Owner",
      content: "ShareButes helped us reduce food waste by 80% while supporting our local community. It's a win-win!",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "NGO Director",
      content: "We've been able to provide meals to 200+ people daily thanks to the generous donors on this platform.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Community Volunteer",
      content: "The platform is so easy to use. I can quickly find and claim food donations for our shelter.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: FaShieldAlt,
      title: "Safe & Verified",
      description: "All donors and organizations are verified to ensure food safety and quality."
    },
    {
      icon: FaClock,
      title: "Real-time Updates",
      description: "Get instant notifications when new donations are available or claimed."
    },
    {
      icon: FaMapMarkerAlt,
      title: "Location-based",
      description: "Find donations and requests near you for easy pickup and delivery."
    },
    {
      icon: FaHandHoldingHeart,
      title: "Community Impact",
      description: "Track your impact and see how many people you've helped feed."
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => (
      <FaStar key={i} className="text-yellow-400" />
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative text-white overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${foodDistributionImage})`
          }}
        >
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-blue-900/70 to-cyan-900/60 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">
                <FaHandHoldingHeart className="text-6xl text-yellow-300" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Save Food, Save Lives
                <span className="block text-yellow-300">🌍</span>
              </h1>
              <p className="text-xl sm:text-2xl mb-8 max-w-2xl text-gray-100">
                Connect with local organizations to donate surplus food, reduce waste, and help those in need
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12">
                <Link
                  to="/donate"
                  onClick={handleProtectedNav('/donate')}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-800 px-8 py-4 rounded-lg font-bold text-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Donate Food
                </Link>
                <Link
                  to="/request"
                  onClick={handleProtectedNav('/request')}
                  className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Request Food
                </Link>
              </div>
              <div className="flex justify-center lg:justify-start space-x-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold">1,500+</div>
                  <div className="text-gray-200">Donations Made</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">12,000+</div>
                  <div className="text-gray-200">Meals Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-gray-200">Active NGOs</div>
                </div>
              </div>
            </div>

            {/* Right Content - Floating Card */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="relative overflow-hidden rounded-xl">
                  {/* Impact Stats Card */}
                  <div className="aspect-[4/3] relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
                          <FaHandHoldingHeart className="text-4xl text-yellow-300" />
                        </div>
                        <p className="text-white text-lg font-medium mb-2">Every Meal Matters</p>
                        <p className="text-white/80 text-sm max-w-xs">
                          Your donation can make a difference in a child's life
                        </p>
                      </div>
                    </div>
                    
                    {/* Impact messaging overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                      <div className="flex items-center space-x-2">
                        <FaHandHoldingHeart className="text-yellow-300 text-sm" />
                        <span className="text-white text-xs font-medium">Making a Real Impact</span>
                      </div>
                    </div>
                    
                    {/* Child-focused messaging overlay */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <FaHandHoldingHeart className="text-white text-xs" />
                        </div>
                        <span className="text-xs font-semibold text-gray-800">Feeding Hope</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Impact Stats Overlay */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl shadow-2xl p-4 min-w-[200px] border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">200+</div>
                    <div className="text-sm text-white/80">Children Fed Daily</div>
                  </div>
                </div>
              </div>
              
              {/* Additional emotional context */}
              <div className="mt-6 text-center lg:text-left">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-white/90 text-sm italic">
                    "Every donation helps provide meals to children and families in need. 
                    Your generosity creates real change in our community."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Please login or register to continue.</h3>
            <p className="text-sm text-gray-600 mb-6">You need an account to donate or request food.</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex-1 bg-gray-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
              >
                Register
              </button>
            </div>
            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to make a difference in your community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-indigo-100 to-cyan-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-indigo-200 group-hover:to-cyan-200 transition-all duration-300 shadow-lg">
                <FaHandHoldingHeart size={40} className="text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">1. Donate Food</h3>
              <p className="text-gray-600 leading-relaxed">
                Post your surplus food with details like quantity, expiry date, and location. Our platform makes it easy to share what you have.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300 shadow-lg">
                <FaHandsHelping size={40} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">2. NGOs Claim</h3>
              <p className="text-gray-600 leading-relaxed">
                Verified NGOs and organizations browse available donations and claim what they need for their beneficiaries.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-cyan-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-cyan-200 group-hover:to-indigo-200 transition-all duration-300 shadow-lg">
                <FaLeaf size={40} className="text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">3. Food Delivered</h3>
              <p className="text-gray-600 leading-relaxed">
                Donated food reaches those in need, reducing food waste and making a positive impact on your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose ShareButes?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with safety, efficiency, and community impact in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from donors and organizations making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-indigo-100">
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Impact So Far</h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Together, we're making a real difference in communities across the country
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1,500+</div>
              <div className="text-indigo-200">Donations Made</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">12,000+</div>
              <div className="text-indigo-200">Meals Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-indigo-200">Active NGOs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">45,000kg</div>
              <div className="text-indigo-200">Food Waste Reduced</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of people who are already helping reduce food waste and feed those in need
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-800 px-8 py-4 rounded-lg font-bold text-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-2xl"
            >
              <span>Get Started Today</span>
              <FaArrowRight />
            </Link>
            <Link
              to="/donate"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Browse Donations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
