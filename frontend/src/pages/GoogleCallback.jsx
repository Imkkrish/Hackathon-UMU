import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse the access token from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      // Store the token securely
      sessionStorage.setItem('access_token', accessToken);
      
      // Fetch user info from Google
      fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(userInfo => {
          // Store user info
          sessionStorage.setItem('user_info', JSON.stringify(userInfo));
          
          // Redirect to dashboard
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Error fetching user info:', error);
          navigate('/login');
        });
    } else {
      // No token found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-orange-600 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
        <p className="text-white text-xl font-semibold">Authenticating...</p>
      </div>
    </div>
  );
}

export default GoogleCallback;
