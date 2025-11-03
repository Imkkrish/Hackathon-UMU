import React from 'react';

function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex flex-col items-center font-sans">
			{/* Hero Section */}
			<header className="w-full flex flex-col items-center py-10">
				<img src="https://dev.cept.gov.in/mydigipin/_next/image?url=%2Fmydigipin%2Fimages%2Findiapost_logo_v2.webp&w=1920&q=75" alt="India Post" className="h-20 mb-4 drop-shadow-lg" />
				<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 text-center tracking-tight">AI-Powered Delivery Post Office Identification</h1>
				<p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-4">
					Transforming messy or incomplete postal addresses into precise delivery targets using AI, for the world's largest postal network.
				</p>
				<div className="flex flex-wrap gap-4 justify-center mt-2">
					<span className="bg-[#E31E24] text-white px-4 py-1 rounded-full text-sm font-semibold shadow">India Post</span>
					<span className="bg-blue-900 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">DIGIPIN</span>
					<span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">AI + Visualization</span>
				</div>
			</header>

			{/* Problem Statement & Solution */}
			<section className="w-full max-w-3xl bg-white/10 rounded-xl shadow-lg p-8 mt-2 mb-6">
				<h2 className="text-2xl font-bold text-white mb-2">Why this matters?</h2>
				<ul className="list-disc ml-6 text-gray-200 text-base mb-4">
					<li>India Post handles 165,000+ post offices and 19,000+ PIN codes.</li>
					<li>5% of daily mail has incorrect or mismatched PIN codes, causing delays and misrouted parcels.</li>
					<li>Dynamic network changes (merged PINs, Nodal Delivery Centres) make manual correction impossible.</li>
				</ul>
				<h2 className="text-xl font-semibold text-white mb-2">Our Solution</h2>
				<ul className="list-disc ml-6 text-gray-200 text-base">
					<li><span className="font-bold text-[#E31E24]">AI-powered address correction</span> for any input: text or image.</li>
					<li><span className="font-bold text-[#E31E24]">DIGIPIN geospatial lookup</span> for precise delivery office mapping.</li>
					<li><span className="font-bold text-[#E31E24]">3D visualization</span> of parcel routing and confidence scoring.</li>
					<li><span className="font-bold text-[#E31E24]">Batch analytics</span> for large-scale address correction.</li>
				</ul>
			</section>

			{/* Features Section */}
			<section className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<div className="bg-white/10 rounded-xl p-6 flex flex-col items-start shadow">
					<h3 className="text-lg font-bold text-white mb-2">Single Address Correction</h3>
					<p className="text-gray-200 mb-2">Paste an address or upload a parcel image. Instantly get the best matching delivery office, PIN code, and confidence score.</p>
				</div>
				<div className="bg-white/10 rounded-xl p-6 flex flex-col items-start shadow">
					<h3 className="text-lg font-bold text-white mb-2">Batch Processing</h3>
					<p className="text-gray-200 mb-2">Upload a CSV of thousands of addresses. Get analytics, corrections, and export results for operational efficiency.</p>
				</div>
				<div className="bg-white/10 rounded-xl p-6 flex flex-col items-start shadow">
					<h3 className="text-lg font-bold text-white mb-2">3D Routing Visualization</h3>
					<p className="text-gray-200 mb-2">See parcels animated in a virtual warehouse, color-coded by confidence, with interactive map overlays.</p>
				</div>
				<div className="bg-white/10 rounded-xl p-6 flex flex-col items-start shadow">
					<h3 className="text-lg font-bold text-white mb-2">Explainable AI & Analytics</h3>
					<p className="text-gray-200 mb-2">Understand why a match was made, see which tokens influenced predictions, and view heatmaps of corrections.</p>
				</div>
			</section>

			{/* Call to Action */}
			<section className="w-full max-w-2xl flex flex-col items-center mb-10">
				<button className="px-8 py-3 bg-[#E31E24] text-white text-lg font-bold rounded-full shadow-lg hover:bg-red-700 transition mb-2">Get Started</button>
				<span className="text-gray-300 text-sm">Try it now: Paste an address or upload a parcel image below</span>
			</section>

			{/* Footer */}
			<footer className="mt-auto py-6 text-gray-400 text-sm w-full text-center">
				&copy; 2025 India Post Hackathon | Powered by DIGIPIN & AI
			</footer>
		</div>
	);
}

export default Home;
