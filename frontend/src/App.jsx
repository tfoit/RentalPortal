import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Apartments from './pages/Apartments';
import Contracts from './pages/Contracts';
import Tenants from './pages/Tenants';
import NotFound from './pages/NotFound';

// Layout
import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';

// Debugging
import DevTools from './components/DevTools';
import TranslationDebugger from './components/TranslationDebugger';

// Auth Context
import { useAuth } from './context/AuthContext';
import enhancedLogger from './utils/enhancedLogger';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  // Debug component render
  useEffect(() => {
    enhancedLogger.mountLog('App');
    enhancedLogger.info('🧩 App component mounted', {
      initialState: {
        loading,
        error,
        isAuthenticated
      }
    });

    return () => {
      enhancedLogger.unmountLog('App');
    };
  }, [loading, error, isAuthenticated]);

  // Check auth status on mount and token change with detailed logging
  useEffect(() => {
    const initAuth = async () => {
      try {
        enhancedLogger.info('🔐 Starting authentication check');
        
        // Add a timeout to prevent infinite loading
        const authCheckPromise = checkAuthStatus();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Authentication check timed out')), 5000)
        );
        
        await Promise.race([authCheckPromise, timeoutPromise]);
        enhancedLogger.info('✅ Authentication check completed successfully', {
          isAuthenticated: isAuthenticated
        });
      } catch (err) {
        enhancedLogger.error('❌ Authentication check failed', { 
          error: err.message,
          stack: err.stack
        });
        setError('Failed to authenticate. You can still use the app, but some features may be limited.');
      } finally {
        setLoading(false);
        enhancedLogger.info('Loading state set to false');
      }
    };
    
    enhancedLogger.info('🔄 Auth effect triggered');
    initAuth();
  }, [checkAuthStatus]);

  // When auth state changes, redirect accordingly with detailed logging
  useEffect(() => {
    if (!loading) {
      const currentPath = window.location.pathname;
      enhancedLogger.info('🧭 Auth state changed, checking redirects', {
        isAuthenticated,
        currentPath,
        loading
      });
      
      if (isAuthenticated && (currentPath === '/login' || currentPath === '/register')) {
        enhancedLogger.info('↪️ Redirecting to dashboard (authenticated user on auth page)');
        navigate('/dashboard', { replace: true });
      } else if (!isAuthenticated && 
                !currentPath.startsWith('/login') && 
                !currentPath.startsWith('/register') && 
                !currentPath.startsWith('/forgot-password') && 
                !currentPath.startsWith('/reset-password')) {
        enhancedLogger.info('↪️ Redirecting to login (unauthenticated user on protected page)');
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    enhancedLogger.debug('⏳ Rendering loading state');
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          bgcolor: 'background.default',
          flexDirection: 'column'
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading EuroRentals...
        </Typography>
        <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
          If this takes too long, try refreshing the page
        </Typography>
      </Box>
    );
  }

  // Show error but still render the app
  if (error) {
    enhancedLogger.warn('⚠️ Rendering app with authentication error', { error });
  }

  enhancedLogger.debug('🖥️ Rendering main app content', { isAuthenticated });
  return (
    <>
      {error && (
        <Box sx={{ bgcolor: 'error.light', color: 'error.contrastText', p: 1, textAlign: 'center' }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}
      
      {/* Add the translation debugger in development mode */}
      {import.meta.env.DEV && <TranslationDebugger />}
      
      <Routes key={isAuthenticated ? 'authenticated' : 'unauthenticated'}>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/apartments" element={isAuthenticated ? <Apartments /> : <Navigate to="/login" replace />} />
          <Route path="/contracts" element={isAuthenticated ? <Contracts /> : <Navigate to="/login" replace />} />
          <Route path="/tenants" element={isAuthenticated ? <Tenants /> : <Navigate to="/login" replace />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        
        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Dev Tools - Only shown in development */}
      {import.meta.env.DEV && <DevTools />}
    </>
  );
}

export default App; 