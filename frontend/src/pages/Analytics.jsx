import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import indiaPostLogo from '../assets/indiapostlogo.svg';
import analyticsChart from '../assets/analytics-chart.png';
import deliveryTruck from '../assets/delivery-truck.png';
import aiBrain from '../assets/ai-brain.png';

function Analytics() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem('user_info');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  if (!userInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Noto Sans', sans-serif" }}>
      {/* Header */}
      <header className="bg-white shadow-md border-b-4" style={{ borderColor: '#8B0000' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-4 hover:opacity-80">
              <img src={indiaPostLogo} alt="India Post" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Analytics & Reports</h1>
                <p className="text-sm text-gray-600">Department of Posts</p>
              </div>
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                <p className="text-xs text-gray-600">{userInfo.email}</p>
              </div>
              <img 
                src={userInfo.picture} 
                alt={userInfo.name}
                className="h-10 w-10 rounded-full border"
                style={{ borderWidth: '1px', borderColor: '#8B0000' }}
              />
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors text-sm font-medium"
                style={{ backgroundColor: '#8B0000' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Performance Analytics</h2>
            <p className="text-gray-600 mt-1">Monitor system performance and delivery insights</p>
          </div>
          <div className="flex space-x-2">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                style={timeRange === range ? { backgroundColor: '#8B0000' } : {}}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4" style={{ borderColor: '#8B0000' }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Total Addresses Processed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">15,847</p>
                <p className="text-green-600 text-sm mt-2">↑ 23% from last {timeRange}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#8B00001A' }}>
                <img src={analyticsChart} alt="Chart" className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">96.8%</p>
                <p className="text-green-600 text-sm mt-2">↑ 2.3% improvement</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Avg Response Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0.8s</p>
                <p className="text-green-600 text-sm mt-2">↓ 0.4s faster</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">342</p>
                <p className="text-gray-600 text-sm mt-2">Across India</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Processing Volume Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Processing Volume Trend</h3>
            <div className="h-64 flex items-end justify-around space-x-2">
              {[65, 80, 75, 90, 85, 95, 100].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full rounded-t-lg transition-all hover:opacity-80"
                    style={{ 
                      height: `${height}%`,
                      backgroundColor: '#8B0000'
                    }}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Accuracy Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Accuracy Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">High Confidence (&gt;80%)</span>
                  <span className="text-sm font-bold text-gray-900">78.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '78.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Medium Confidence (50-80%)</span>
                  <span className="text-sm font-bold text-gray-900">18.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '18.2%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Low Confidence (&lt;50%)</span>
                  <span className="text-sm font-bold text-gray-900">3.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="h-3 rounded-full" style={{ width: '3.3%', backgroundColor: '#8B0000' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Performing Regions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2" style={{ borderColor: '#8B0000' }}>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Region</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Addresses Processed</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Success Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { region: 'Delhi NCR', processed: '3,245', rate: '98.2%', time: '0.6s', status: 'Excellent' },
                  { region: 'Maharashtra', processed: '2,890', rate: '97.5%', time: '0.7s', status: 'Excellent' },
                  { region: 'Karnataka', processed: '2,456', rate: '96.8%', time: '0.8s', status: 'Good' },
                  { region: 'Tamil Nadu', processed: '2,123', rate: '96.2%', time: '0.9s', status: 'Good' },
                  { region: 'West Bengal', processed: '1,987', rate: '95.8%', time: '1.0s', status: 'Good' },
                  { region: 'Telangana', processed: '1,745', rate: '97.1%', time: '0.7s', status: 'Excellent' },
                  { region: 'Gujarat', processed: '1,401', rate: '96.5%', time: '0.8s', status: 'Good' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{row.region}</td>
                    <td className="py-3 px-4 text-gray-700">{row.processed}</td>
                    <td className="py-3 px-4 text-gray-700">{row.rate}</td>
                    <td className="py-3 px-4 text-gray-700">{row.time}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        row.status === 'Excellent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/address-match')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow text-left group"
          >
            <img src={aiBrain} alt="AI" className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Single Address Match</h3>
            <p className="text-gray-600 text-sm mb-4">Process individual addresses</p>
            <div className="flex items-center font-semibold" style={{ color: '#8B0000' }}>
              <span>Start Matching</span>
              <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => navigate('/batch-process')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow text-left group"
          >
            <img src={analyticsChart} alt="Batch" className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Batch Processing</h3>
            <p className="text-gray-600 text-sm mb-4">Upload CSV for bulk correction</p>
            <div className="flex items-center text-blue-600 font-semibold">
              <span>Upload CSV</span>
              <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow text-left group"
          >
            <img src={deliveryTruck} alt="Dashboard" className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Dashboard</h3>
            <p className="text-gray-600 text-sm mb-4">View main control panel</p>
            <div className="flex items-center text-green-600 font-semibold">
              <span>Go to Dashboard</span>
              <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Analytics;
