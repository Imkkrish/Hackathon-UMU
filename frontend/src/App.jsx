import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home.jsx';
import Login from './pages/Login.jsx';
import GoogleCallback from './pages/GoogleCallback.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddressMatch from './pages/AddressMatch.jsx';
import BatchProcess from './pages/BatchProcess.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('access_token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/address-match" 
          element={
            <ProtectedRoute>
              <AddressMatch />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/batch-process" 
          element={
            <ProtectedRoute>
              <BatchProcess />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

