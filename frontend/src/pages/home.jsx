import React from 'react';
import ashokThumbLogo from '../assets/ashok-thumb-logo.svg';
import digiIndLogo from '../assets/digitalIndia.svg';
import indiaPostLogo from '../assets/india-post-logo.png';
import deliveryTruck from '../assets/delivery-truck.png';
import aiBrain from '../assets/ai-brain.png';
import mapLocation from '../assets/map-location.png';
import analyticsChart from '../assets/analytics-chart.png';

function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex flex-col items-center font-sans overflow-hidden">
			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-20 left-10 w-32 h-32 bg-[#E31E24]/10 rounded-full animate-pulse"></div>
				<div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
				<div className="absolute bottom-40 left-20 w-20 h-20 bg-green-500/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
			</div>

			{/* Hero Section */}
			<header className="w-full flex flex-col items-center py-10 relative z-10 animate-fade-in">
				<div className="flex items-center gap-4 mb-6 animate-slide-up">
					<img
						src={indiaPostLogo}
						alt="India Post"
						className="h-20 drop-shadow-lg hover:scale-105 transition-transform duration-300"
					/>
					<div className="flex flex-col items-center">
						<img
							src={ashokThumbLogo}
							alt="Ashok Chakra"
							className="h-8 w-8 mb-2 animate-spin-slow"
						/>
						<img
							src={digiIndLogo}
							alt="Digital India"
							className="h-6 opacity-80"
						/>
					</div>
				</div>

				<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-center tracking-tight animate-slide-up" style={{animationDelay: '0.2s'}}>
					AI-Powered Delivery Post Office
					<span className="block text-[#E31E24] animate-pulse">Identification System</span>
				</h1>

				<p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-4 animate-slide-up" style={{animationDelay: '0.4s'}}>
					Transforming messy or incomplete postal addresses into precise delivery targets using AI, for the world's largest postal network.
				</p>

				<div className="flex flex-wrap gap-4 justify-center mt-2 animate-slide-up" style={{animationDelay: '0.6s'}}>
					<span className="bg-[#E31E24] text-white px-4 py-1 rounded-full text-sm font-semibold shadow hover:bg-red-600 transition-colors animate-bounce" style={{animationDelay: '0.8s'}}>India Post</span>
					<span className="bg-blue-900 text-white px-4 py-1 rounded-full text-sm font-semibold shadow hover:bg-blue-800 transition-colors animate-bounce" style={{animationDelay: '1s'}}>DIGIPIN</span>
					<span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow hover:bg-green-700 transition-colors animate-bounce" style={{animationDelay: '1.2s'}}>AI + Visualization</span>
				</div>
			</header>

			{/* Problem Statement & Solution */}
			<section className="w-full max-w-3xl bg-white/10 rounded-xl shadow-lg p-8 mt-2 mb-6 backdrop-blur-sm animate-fade-in" style={{animationDelay: '0.8s'}}>
				<h2 className="text-2xl font-bold text-white mb-4 animate-slide-left">Why this matters?</h2>
				<ul className="list-disc ml-6 text-gray-200 text-base mb-6 space-y-2">
					<li className="animate-slide-left" style={{animationDelay: '1s'}}>India Post handles <span className="font-bold text-[#E31E24]">165,000+ post offices</span> and <span className="font-bold text-[#E31E24]">19,000+ PIN codes</span>.</li>
					<li className="animate-slide-left" style={{animationDelay: '1.1s'}}><span className="font-bold text-[#E31E24]">5% of daily mail</span> has incorrect or mismatched PIN codes, causing delays and misrouted parcels.</li>
					<li className="animate-slide-left" style={{animationDelay: '1.2s'}}>Dynamic network changes (merged PINs, Nodal Delivery Centres) make manual correction impossible.</li>
				</ul>

				<h2 className="text-xl font-semibold text-white mb-4 animate-slide-right" style={{animationDelay: '1.3s'}}>Our Solution</h2>
				<ul className="list-disc ml-6 text-gray-200 text-base space-y-2">
					<li className="animate-slide-right" style={{animationDelay: '1.4s'}}><span className="font-bold text-[#E31E24]">AI-powered address correction</span> for any input: text or image.</li>
					<li className="animate-slide-right" style={{animationDelay: '1.5s'}}><span className="font-bold text-[#E31E24]">DIGIPIN geospatial lookup</span> for precise delivery office mapping.</li>
					<li className="animate-slide-right" style={{animationDelay: '1.6s'}}><span className="font-bold text-[#E31E24]">3D visualization</span> of parcel routing and confidence scoring.</li>
					<li className="animate-slide-right" style={{animationDelay: '1.7s'}}><span className="font-bold text-[#E31E24]">Batch analytics</span> for large-scale address correction.</li>
				</ul>
			</section>

			{/* Features Section */}
			<section className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{animationDelay: '1.8s'}}>
				<div className="bg-white/10 rounded-xl p-6 flex flex-col items-start shadow hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm animate-slide-up" style={{animationDelay: '2s'}}>
					<div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
						<img src={mapLocation} alt="Location" className="h-16 w-16 opacity-80" />
					</div>
					<h3 className="text-lg font-bold text-white mb-2">Single Address Correction</h3>
					<p className="text-gray-200 mb-2">Paste an address or upload a parcel image. Instantly get the best matching delivery office, PIN code, and confidence score.</p>
				</div>

				<div className="bg-white/10 rounded-xl p-6 flex flex-col items-start shadow hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm animate-slide-up" style={{animationDelay: '2.1s'}}>
					<div className="w-full h-32 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg mb-4 flex items-center justify-center">
						<img src={analyticsChart} alt="Analytics" className="h-16 w-16 opacity-80" />
					</div>
					<h3 className="text-lg font-bold text-white mb-2">Batch Processing</h3>
					<p className="text-gray-200 mb-2">Upload a CSV of thousands of addresses. Get analytics, corrections, and export results for operational efficiency.</p>
				</div>

				<div className="bg-white/10 rounded-xl p-6 flex flex-col items-start shadow hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm animate-slide-up" style={{animationDelay: '2.2s'}}>
					<div className="w-full h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg mb-4 flex items-center justify-center">
						<img src={deliveryTruck} alt="Delivery" className="h-16 w-16 opacity-80" />
					</div>
					<h3 className="text-lg font-bold text-white mb-2">3D Routing Visualization</h3>
					<p className="text-gray-200 mb-2">See parcels animated in a virtual warehouse, color-coded by confidence, with interactive map overlays.</p>
				</div>

				<div className="bg-white/10 rounded-xl p-6 flex flex-col items-start shadow hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm animate-slide-up" style={{animationDelay: '2.3s'}}>
					<div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4 flex items-center justify-center">
						<img src={aiBrain} alt="AI" className="h-16 w-16 opacity-80" />
					</div>
					<h3 className="text-lg font-bold text-white mb-2">Explainable AI & Analytics</h3>
					<p className="text-gray-200 mb-2">Understand why a match was made, see which tokens influenced predictions, and view heatmaps of corrections.</p>
				</div>
			</section>

			{/* Call to Action */}
			<section className="w-full max-w-2xl flex flex-col items-center mb-10 animate-fade-in" style={{animationDelay: '2.4s'}}>
				<button className="px-8 py-3 bg-[#E31E24] text-white text-lg font-bold rounded-full shadow-lg hover:bg-red-700 hover:scale-110 transition-all duration-300 mb-2 animate-pulse">
					Get Started
				</button>
				<span className="text-gray-300 text-sm animate-fade-in" style={{animationDelay: '2.6s'}}>
					Try it now: Paste an address or upload a parcel image below
				</span>
			</section>

			{/* Footer */}
			<footer className="mt-auto py-6 text-gray-400 text-sm w-full text-center animate-fade-in" style={{animationDelay: '2.8s'}}>
				&copy; 2025 India Post Hackathon | Powered by DIGIPIN & AI
			</footer>

			{/* Custom CSS for animations */}
			<style jsx>{`
				@keyframes fade-in {
					from { opacity: 0; transform: translateY(20px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@keyframes slide-up {
					from { opacity: 0; transform: translateY(30px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@keyframes slide-left {
					from { opacity: 0; transform: translateX(-30px); }
					to { opacity: 1; transform: translateX(0); }
				}
				@keyframes slide-right {
					from { opacity: 0; transform: translateX(30px); }
					to { opacity: 1; transform: translateX(0); }
				}
				@keyframes spin-slow {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
				.animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
				.animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
				.animate-slide-left { animation: slide-left 0.8s ease-out forwards; }
				.animate-slide-right { animation: slide-right 0.8s ease-out forwards; }
				.animate-spin-slow { animation: spin-slow 20s linear infinite; }
			`}</style>
		</div>
	);
}

export default Home;
