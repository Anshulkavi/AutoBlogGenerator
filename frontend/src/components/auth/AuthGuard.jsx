// src/components/auth/AuthGuard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../utils/apiService';

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const { accessToken } = ApiService.getTokens();
    
    if (!accessToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate('/', { replace: true });
      return;
    }

    try {
      // Basic JWT validation - check if token is expired
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        // Token expired
        ApiService.clearTokens();
        setIsAuthenticated(false);
        setIsLoading(false);
        navigate('/', { replace: true });
        return;
      }
      
      // Token is valid
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      // Invalid token
      console.error('Invalid token:', error);
      ApiService.clearTokens();
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate('/', { replace: true });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Component will navigate away
  }

  return children;
};

export default AuthGuard;