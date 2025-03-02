import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import logger from '../utils/logger';

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

  // Check authentication status - made into a useCallback to prevent dependency issues
  const checkAuthStatus = useCallback(async () => {
    if (!token) {
      logger.info('No authentication token found, user is not authenticated');
      setUser(null);
      setLoading(false);
      return false;
    }

    try {
      logger.info('Verifying authentication token');
      // In a real app, you would make an API call to verify the token and get user data
      // For example: const response = await axios.get('/api/users/me');
      
      // For now, we'll simulate a successful auth check
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'Berlin',
        country: 'Germany',
        postalCode: '10115',
        profileImage: '',
        bio: 'I am a test user',
        privacySettings: {
          allowContactFromOtherUsers: true,
          showContactInfo: false,
          showActivity: true,
          profileVisibility: 'public'
        }
      };
      
      logger.info('User authenticated successfully', { userId: mockUser.id, role: mockUser.role });
      setUser(mockUser);
      setLoading(false);
      return true;
    } catch (error) {
      logger.error('Authentication check failed', { error: error.message });
      console.error('Auth check failed:', error);
      logout(); // Clear invalid token
      setError('Session expired. Please login again.');
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
      
      // In a real app, replace this with an actual API call
      // const response = await axios.post('/api/users/login', credentials);
      // const { token, user } = response.data;
      
      // Mock response for now
      const mockToken = 'mock-jwt-token';
      const mockUser = {
        id: '1',
        username: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'user',
        firstName: 'Test',
        lastName: 'User',
        phone: '+1234567890',
        address: '123 Main St',
        city: 'Berlin',
        country: 'Germany',
        postalCode: '10115',
        profileImage: '',
        bio: 'I am a test user',
        privacySettings: {
          allowContactFromOtherUsers: true,
          showContactInfo: false,
          showActivity: true,
          profileVisibility: 'public'
        }
      };

      // Store token and update state in proper sequence
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser); // This ensures user is set before navigation happens
      
      logger.info('User logged in successfully', { 
        userId: mockUser.id, 
        username: mockUser.username, 
        role: mockUser.role 
      });
      
      setLoading(false);
      
      return { success: true, user: mockUser };
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
      
      // In a real app, replace this with an actual API call
      // const response = await axios.post('/api/users/register', userData);
      // const { message } = response.data;
      
      logger.info('User registered successfully', { 
        email: userData.email,
        username: userData.username
      });
      
      return { success: true, message: 'Registration successful! Please login.' };
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
        userId: user?.id,
        fields: Object.keys(profileData)
      });
      
      // In a real app, replace this with an actual API call
      // const response = await axios.put('/api/users/profile', profileData);
      // const { user: updatedUser } = response.data;
      
      // For now, we'll simulate a successful profile update
      const updatedUser = {
        ...user,
        ...profileData
      };
      
      logger.info('Profile updated successfully', { 
        userId: updatedUser.id,
        fields: Object.keys(profileData)
      });
      
      setUser(updatedUser);
      setLoading(false);
      return { success: true, user: updatedUser };
    } catch (error) {
      logger.error('Profile update failed', { 
        userId: user?.id,
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
        userId: user?.id,
        settings: privacySettings
      });
      
      // In a real app, replace this with an actual API call
      // const response = await axios.put('/api/users/privacy', privacySettings);
      // const { user: updatedUser } = response.data;
      
      // For now, we'll simulate a successful privacy settings update
      const updatedUser = {
        ...user,
        privacySettings: {
          ...user.privacySettings,
          ...privacySettings
        }
      };
      
      logger.info('Privacy settings updated successfully', { 
        userId: updatedUser.id,
        settings: privacySettings
      });
      
      setUser(updatedUser);
      setLoading(false);
      return { success: true, user: updatedUser };
    } catch (error) {
      logger.error('Privacy settings update failed', { 
        userId: user?.id,
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
    logger.info('User logged out', { userId: user?.id });
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
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