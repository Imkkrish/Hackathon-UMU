import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import indiaPostLogo from '../assets/indiapostlogo.svg';
import deliveryTruck from '../assets/delivery-truck.png';
import analyticsChart from '../assets/analytics-chart.png';
import aiBrain from '../assets/ai-brain.png';

function Dashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [deliveryResult, setDeliveryResult] = useState(null);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('user_info');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      navigate('/login');
    }

    // Check for pending address/image after login
    const pendingAddress = sessionStorage.getItem('pending_address');
    const pendingImage = sessionStorage.getItem('pending_image');
    if (pendingAddress || pendingImage) {
      // Send to backend for processing
      const formData = new FormData();
      if (pendingAddress) formData.append('address', pendingAddress);
      if (pendingImage) {
        const imgObj = JSON.parse(pendingImage);
        // Convert dataURL to Blob
        const byteString = atob(imgObj.data.split(',')[1]);
        const mimeString = imgObj.data.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        formData.append('image', blob, imgObj.name);
      }
      fetch('/api/delivery-office', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          setDeliveryResult(data);
          // Clear pending data
          sessionStorage.removeItem('pending_address');
          sessionStorage.removeItem('pending_image');
        })
        .catch(() => {
          setDeliveryResult({ error: 'Failed to process address/image.' });
        });
    }
  }, [navigate]);

  const handleLogout = () => {
  sessionStorage.clear();
  navigate('/');
  };

  if (!userInfo) {
    return null;
  }

  // Show delivery result if available
  if (deliveryResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: "'Noto Sans', sans-serif" }}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Office Result</h2>
          {deliveryResult.error ? (
            <div className="text-red-600 mb-4">{deliveryResult.error}</div>
          ) : (
            <>
              <div className="mb-4">
                <span className="font-semibold">Address:</span> {deliveryResult.address || deliveryResult.input}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Delivery Office:</span> {deliveryResult.office || deliveryResult.match}
              </div>
              {deliveryResult.confidence && (
                <div className="mb-4">
                  <span className="font-semibold">Confidence:</span> {deliveryResult.confidence}
                </div>
              )}
              {deliveryResult.pin && (
                <div className="mb-4">
                  <span className="font-semibold">PIN Code:</span> {deliveryResult.pin}
                </div>
              )}
              {deliveryResult.mapUrl && (
                <div className="mb-4">
                  <a href={deliveryResult.mapUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View on Map</a>
                </div>
              )}
            </>
          )}
          <button
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            onClick={() => setDeliveryResult(null)}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Noto Sans', sans-serif" }}>
      {/* Header */}
      <header className="bg-white shadow-md" style={{ borderBottom: '4px solid #8B0000' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={indiaPostLogo} alt="India Post" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">AI Delivery Dashboard</h1>
                <p className="text-sm text-gray-600">Department of Posts</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                <p className="text-xs text-gray-600">{userInfo.email}</p>
              </div>
              <img 
                src={userInfo.picture} 
                alt={userInfo.name}
                className="h-10 w-10 rounded-full"
                style={{ border: '1px solid #8B0000' }}
              />
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="rounded-2xl p-8 text-white mb-8" style={{ background: 'linear-gradient(to right, #8B0000, #6B0000)' }}>
          <h2 className="text-3xl font-bold mb-2">Welcome back, {userInfo.name?.split(' ')[0]}!</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Access your tools and manage delivery operations efficiently.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Today's Scans</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">1,247</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-green-600 text-sm mt-2">↑ 12% from yesterday</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Match Accuracy</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">96.3%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-green-600 text-sm mt-2">↑ 2.1% improvement</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6" style={{ borderLeft: '4px solid #8B0000' }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Avg. Process Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">1.2s</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#8B00001A' }}>
                <svg className="h-6 w-6" style={{ color: '#8B0000' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-green-600 text-sm mt-2">↓ 0.3s faster</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Batch Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">23</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-2">5 in progress</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/address-match')}
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow text-left group"
          >
            <img src={aiBrain} alt="AI Match" className="h-16 w-16 mb-4" style={{ border: '1px solid #E5E7EB' }} />
            <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors" 
                onMouseEnter={(e) => e.target.style.color = '#8B0000'}
                onMouseLeave={(e) => e.target.style.color = '#111827'}
            >
              Single Address Match
            </h3>
            <p className="text-gray-600 mb-4">
              Upload parcel image or enter address to find the correct delivery office
            </p>
            <div className="flex items-center font-semibold" style={{ color: '#8B0000' }}>
              <span>Start Matching</span>
              <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => navigate('/batch-process')}
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow text-left group"
          >
            <img src={analyticsChart} alt="Batch Process" className="h-16 w-16 mb-4" style={{ border: '1px solid #E5E7EB' }} />
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              Batch Processing
            </h3>
            <p className="text-gray-600 mb-4">
              Upload CSV with thousands of addresses for bulk correction
            </p>
            <div className="flex items-center text-blue-600 font-semibold">
              <span>Upload CSV</span>
              <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow text-left group"
          >
            <img src={deliveryTruck} alt="Analytics" className="h-16 w-16 mb-4" style={{ border: '1px solid #E5E7EB' }} />
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
              Analytics & Reports
            </h3>
            <p className="text-gray-600 mb-4">
              View performance metrics, success rates, and delivery insights
            </p>
            <div className="flex items-center text-green-600 font-semibold">
              <span>View Analytics</span>
              <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Address matched', address: 'Kothimir B.O, Telangana', confidence: '95%', time: '2 minutes ago', status: 'success' },
              { action: 'Batch completed', address: '1,000 addresses processed', confidence: '92%', time: '15 minutes ago', status: 'success' },
              { action: 'OCR extracted', address: 'Papanpet BO, Adilabad', confidence: '88%', time: '1 hour ago', status: 'success' },
              { action: 'Manual verification', address: 'Yellapur Warangal', confidence: '67%', time: '2 hours ago', status: 'warning' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    item.status === 'success' ? 'bg-green-100 text-green-600' : ''
                  }`}
                  style={item.status === 'warning' ? { backgroundColor: '#8B00001A', color: '#8B0000' } : {}}
                  >
                    {item.status === 'success' ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.action}</p>
                    <p className="text-sm text-gray-600">{item.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.confidence}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
