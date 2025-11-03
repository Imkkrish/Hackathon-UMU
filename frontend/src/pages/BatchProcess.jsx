import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import indiaPostLogo from '../assets/indiapostlogo.svg';
import analyticsChart from '../assets/analytics-chart.png';

function BatchProcess() {
  const navigate = useNavigate();
  const [csvFile, setCsvFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    }
  };

  const handleProcess = async () => {
    if (!csvFile) return;
    
    setProcessing(true);
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setResults({
            total: 1000,
            successful: 920,
            needsReview: 65,
            failed: 15,
            avgConfidence: 0.89,
            processingTime: '4m 32s'
          });
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-4 hover:opacity-80">
              <img src={indiaPostLogo} alt="India Post" className="h-12 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Batch Processing</h1>
                <p className="text-sm text-gray-600">Bulk Address Correction</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!results ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <img src={analyticsChart} alt="Batch" className="h-8 w-8" />
              <h2 className="text-2xl font-bold text-gray-800">Upload CSV File</h2>
            </div>

            <div className="mb-8">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-16 h-16 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-lg font-semibold text-gray-700">
                    {csvFile ? csvFile.name : 'Click to upload CSV file'}
                  </p>
                  <p className="text-sm text-gray-500">
                    CSV files only, up to 50MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {csvFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">CSV Format Requirements</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Your CSV file should have the following columns:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li><code className="bg-blue-100 px-1 rounded">id</code> - Unique identifier</li>
                        <li><code className="bg-blue-100 px-1 rounded">raw_address</code> - Full address text</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {processing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Processing addresses...</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-gray-600">
                  Estimated time remaining: {Math.ceil((100 - progress) / 5 * 0.2)} seconds
                </p>
              </div>
            ) : (
              <button
                onClick={handleProcess}
                disabled={!csvFile}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all shadow-lg"
              >
                🚀 Start Batch Processing
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm">Total Processed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{results.total}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-sm">Successful</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{results.successful}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
                <p className="text-gray-600 text-sm">Needs Review</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{results.needsReview}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                <p className="text-gray-600 text-sm">Failed</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{results.failed}</p>
              </div>
            </div>

            {/* Results Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Processing Summary</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Average Confidence</p>
                  <p className="text-2xl font-bold text-gray-900">{(results.avgConfidence * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Processing Time</p>
                  <p className="text-2xl font-bold text-gray-900">{results.processingTime}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md">
                  📥 Download Results CSV
                </button>
                <button className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all">
                  📊 View Detailed Report
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setCsvFile(null);
                setResults(null);
                setProgress(0);
              }}
              className="w-full bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 border-2 border-gray-300 transition-all"
            >
              ← Process Another File
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default BatchProcess;
