import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import indiaPostLogo from '../assets/indiapostlogo.svg';
import digitalIndiaLogo from '../assets/digitalIndia.svg';
import swachBharathLogo from '../assets/swachBharath.svg';
import ashokThumb from '../assets/ashok-thumb-logo.svg';
import indiaFlag from '../assets/flag.svg';
import deliveryTruck from '../assets/delivery-truck.png';
import mapLocation from '../assets/map-location.png';
import aiBrain from '../assets/ai-brain.png';
import analyticsChart from '../assets/analytics-chart.png';

function Home() {
  const navigate = useNavigate();
  const [addressInput, setAddressInput] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect to login first
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: India Post Logo */}
            <div className="flex items-center space-x-4">
              <img src={indiaPostLogo} alt="India Post" className="h-16 w-auto" />
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-gray-800">India Post</h1>
                <p className="text-sm text-gray-600">Department of Posts, Govt. of India</p>
              </div>
            </div>

            {/* Right: Government Logos */}
            <div className="flex items-center space-x-4">
              <img src={ashokThumb} alt="Ashok Stambh" className="h-12 w-auto" />
              <img src={digitalIndiaLogo} alt="Digital India" className="h-12 w-auto hidden sm:block" />
              <img src={swachBharathLogo} alt="Swachh Bharat" className="h-12 w-auto hidden sm:block" />
              <img src={indiaFlag} alt="India Flag" className="h-10 w-auto" />
              <button
                onClick={() => navigate('/login')}
                className="ml-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold shadow-md"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                <img src={aiBrain} alt="AI" className="h-5 w-5" />
                <span>AI-Powered Delivery System</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Smart Address
                <span className="text-orange-600"> Matching</span>
                <br />
                for India Post
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Identify correct delivery locations instantly with AI. Serving 165,000+ post offices 
                across 19,000+ PIN codes with precision and speed.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-orange-600">165K+</div>
                  <div className="text-sm text-gray-600">Post Offices</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">19K+</div>
                  <div className="text-sm text-gray-600">PIN Codes</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>
            </div>

            {/* Right: Address Input Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <img src={mapLocation} alt="Location" className="h-8 w-8" />
                <h2 className="text-2xl font-bold text-gray-800">Find Delivery Office</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Address or Paste Text
                  </label>
                  <textarea
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="e.g., Kothimir B.O, Kumuram Bheem Asifabad, Telangana 504273"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows="4"
                  />
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Parcel Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-1 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  {imageFile && (
                    <p className="mt-2 text-sm text-green-600">✓ {imageFile.name}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] transition-all shadow-lg"
                >
                  🔍 Find Matching Delivery Office
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-gray-600">Intelligent features designed for efficiency</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <img src={aiBrain} alt="AI Matching" className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Matching</h3>
              <p className="text-gray-600">
                AI-powered semantic search matches addresses with 95%+ accuracy using advanced NLP models.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <img src={deliveryTruck} alt="Fast Delivery" className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Merged PIN Support</h3>
              <p className="text-gray-600">
                Automatically handles PIN code mergers and operational delivery hubs for accurate routing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <img src={analyticsChart} alt="Analytics" className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Batch Processing</h3>
              <p className="text-gray-600">
                Process thousands of addresses in bulk with CSV upload and download corrected results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to accurate delivery</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Input Address</h3>
              <p className="text-gray-600">Type or paste address, or upload parcel image for OCR extraction</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">Our AI matches your address against 165K+ post offices in milliseconds</p>
            </div>

            <div className="text-center">
              <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get Results</h3>
              <p className="text-gray-600">View matches with confidence scores, location on map, and DIGIPIN code</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to optimize your delivery network?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of postal workers using our AI-powered system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-orange-600 font-semibold py-3 px-8 rounded-lg hover:bg-orange-50 transition-colors shadow-lg"
            >
              Get Started →
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-orange-600 transition-colors"
            >
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img src={indiaPostLogo} alt="India Post" className="h-12 w-auto brightness-0 invert" />
              <div>
                <p className="font-semibold">India Post - AI Delivery System</p>
                <p className="text-sm text-gray-400">Powered by DIGIPIN & Machine Learning</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © 2025 Department of Posts, Government of India
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Developed for India Post Hackathon
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;