import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import logger from '../utils/logger';
import api, { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      logger.debug('Setting auth token in axios defaults');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      logger.debug('Removing auth token from axios defaults');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Listen for auth:logout events from the API service
  useEffect(() => {
    const handleLogout = () => {
      logger.info('Received auth:logout event');
      logout();
    };
    
    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  // Check authentication status - made into a useCallback to prevent dependency issues
  const checkAuthStatus = useCallback(async () => {
    if (!token) {
      logger.info('No authentication token found, user is not authenticated');
      setUser(null);
      setLoading(false);
      return false;
    }

    try {
      logger.info('Verifying authentication token', { tokenExists: !!token });
      // Log the current authorization header for debugging
      logger.debug('Current authorization header', { 
        authHeader: axios.defaults.headers.common['Authorization'] ? 'Set' : 'Not set' 
      });
      
      // Use the api service to verify the token and get user data
      const response = await authAPI.getCurrentUser();
      const userData = response.data;
      
      logger.info('User authenticated successfully', { 
        userId: userData.id || userData._id, 
        role: userData.role 
      });
      setUser(userData);
      setLoading(false);
      return true;
    } catch (error) {
      logger.error('Authentication check failed', { 
        error: error.message,
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data 
      });
      
      // Only logout if it's an authentication error (401/403)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logger.warn('Authentication token invalid, logging out user');
        logout(); // Clear invalid token
        setError('Session expired. Please login again.');
      }
      
      setLoading(false);
      return false;
    }
  }, [token]);

  // Initial auth check
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      logger.info('User login attempt', { email: credentials.email });
      
      // Use the api service to login
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      // Store token and update state
      localStorage.setItem('token', token);
      
      // Explicitly set the Authorization header immediately to prevent race conditions
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setToken(token);
      setUser(user);
      
      logger.info('User logged in successfully', { 
        userId: user.id || user._id, 
        username: user.username, 
        role: user.role 
      });
      
      // Verify the authentication immediately after login, before redirecting
      await checkAuthStatus();
      
      setLoading(false);
      
      return { success: true, user };
    } catch (error) {
      logger.error('Login failed', { 
        email: credentials.email, 
        error: error.message,
        response: error.response?.data
      });
      
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      logger.info('User registration attempt', { 
        email: userData.email,
        username: userData.username
      });
      
      // Use the api service to register
      const response = await authAPI.register(userData);
      const { message } = response.data;
      
      logger.info('User registered successfully', { 
        email: userData.email,
        username: userData.username
      });
      
      return { success: true, message: message || 'Registration successful! Please login.' };
    } catch (error) {
      logger.error('Registration failed', { 
        email: userData.email, 
        username: userData.username,
        error: error.message,
        response: error.response?.data
      });
      
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      logger.info('Profile update attempt', { 
        userId: user?.id || user?._id,
        fields: Object.keys(profileData)
      });
      
      // Use the api service to update profile
      const response = await authAPI.updateProfile(profileData);
      const { user: updatedUser } = response.data;
      
      logger.info('Profile updated successfully', { 
        userId: updatedUser.id || updatedUser._id,
        fields: Object.keys(profileData)
      });
      
      setUser(updatedUser);
      setLoading(false);
      return { success: true, user: updatedUser };
    } catch (error) {
      logger.error('Profile update failed', { 
        userId: user?.id || user?._id,
        error: error.message,
        response: error.response?.data
      });
      
      console.error('Profile update error:', error);
      setError(error.response?.data?.message || 'Profile update failed. Please try again.');
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const updatePrivacySettings = async (privacySettings) => {
    try {
      setLoading(true);
      setError(null);
      
      logger.info('Privacy settings update attempt', { 
        userId: user?.id || user?._id,
        settings: privacySettings
      });
      
      // Use the api service to update privacy settings
      const response = await api.put('/users/privacy', privacySettings);
      const { user: updatedUser } = response.data;
      
      logger.info('Privacy settings updated successfully', { 
        userId: updatedUser.id || updatedUser._id,
        settings: privacySettings
      });
      
      setUser(updatedUser);
      setLoading(false);
      return { success: true, user: updatedUser };
    } catch (error) {
      logger.error('Privacy settings update failed', { 
        userId: user?.id || user?._id,
        error: error.message,
        response: error.response?.data
      });
      
      console.error('Privacy settings update error:', error);
      setError(error.response?.data?.message || 'Privacy settings update failed. Please try again.');
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    logger.info('User logging out');
    localStorage.removeItem('token');
    // Explicitly clear the Authorization header
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    logger.info('User logged out successfully');
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuthStatus,
    updateUserProfile,
    updatePrivacySettings
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 