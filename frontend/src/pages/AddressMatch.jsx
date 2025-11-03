import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import indiaPostLogo from '../assets/indiapostlogo.svg';
import mapLocation from '../assets/map-location.png';
import aiBrain from '../assets/ai-brain.png';

function AddressMatch() {
  const navigate = useNavigate();
  const [addressInput, setAddressInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setResults({
        matches: [
          {
            rank: 1,
            pincode: '504273',
            officename: 'Kothimir B.O',
            district: 'KUMURAM BHEEM ASIFABAD',
            state: 'TELANGANA',
            confidence: 0.95,
            latitude: 19.3638689,
            longitude: 79.5376658,
            digipin: '4P3-JK8-52C9'
          },
          {
            rank: 2,
            pincode: '504296',
            officename: 'Kammergaon B.O',
            district: 'KUMURAM BHEEM ASIFABAD',
            state: 'TELANGANA',
            confidence: 0.78,
            latitude: 19.4,
            longitude: 79.6,
            digipin: '4P3-JK9-62D1'
          },
          {
            rank: 3,
            pincode: '504299',
            officename: 'Papanpet B.O',
            district: 'KUMURAM BHEEM ASIFABAD',
            state: 'TELANGANA',
            confidence: 0.67,
            latitude: 19.35,
            longitude: 79.45,
            digipin: '4P3-JK7-42B8'
          }
        ]
      });
      setLoading(false);
    }, 2000);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
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
                <h1 className="text-xl font-bold text-gray-800">Address Matching</h1>
                <p className="text-sm text-gray-600">AI-Powered Delivery Office Identification</p>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <img src={mapLocation} alt="Location" className="h-8 w-8" />
                <h2 className="text-2xl font-bold text-gray-800">Find Delivery Office</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Parcel Image
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  {imageFile && <p className="mt-2 text-sm text-green-600">✓ {imageFile.name}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading || (!addressInput && !imageFile)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    '🔍 Find Matching Delivery Office'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <img src={aiBrain} alt="AI" className="h-8 w-8" />
                    <h2 className="text-2xl font-bold text-gray-800">Matching Results</h2>
                  </div>

                  <div className="space-y-4">
                    {results.matches.map((match) => (
                      <div
                        key={match.rank}
                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-orange-100 text-orange-600 font-bold w-8 h-8 rounded-full flex items-center justify-center">
                              {match.rank}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{match.officename}</h3>
                              <p className="text-sm text-gray-600">{match.district}, {match.state}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(match.confidence)}`}>
                            {(match.confidence * 100).toFixed(0)}%
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 uppercase">PIN Code</p>
                            <p className="font-semibold text-gray-900">{match.pincode}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase">DIGIPIN</p>
                            <p className="font-mono font-semibold text-gray-900">{match.digipin}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase">Latitude</p>
                            <p className="font-semibold text-gray-900">{match.latitude.toFixed(4)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 uppercase">Longitude</p>
                            <p className="font-semibold text-gray-900">{match.longitude.toFixed(4)}</p>
                          </div>
                        </div>

                        <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
                          View on Map →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center h-full text-center">
                <div className="bg-gray-100 rounded-full p-8 mb-4">
                  <img src={mapLocation} alt="Map" className="h-24 w-24 opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Yet</h3>
                <p className="text-gray-600">
                  Enter an address or upload a parcel image to see matching results
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddressMatch;
