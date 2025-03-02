import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

// Import i18n configuration first to ensure language settings are applied
import { i18nPromise } from './i18n';
import './i18n';

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ErrorBoundary from './components/ErrorBoundary';
import enhancedLogger from './utils/enhancedLogger';
import diagnostics from './utils/diagnostics';
import { createTheme } from '@mui/material/styles';

// DEBUGGING FOR WHITE SCREEN ISSUES
console.clear();
enhancedLogger.critical('🛑 APPLICATION STARTUP - DEBUGGING WHITE SCREEN', {
  timestamp: new Date().toISOString(),
  url: window.location.href,
});

// Loading component for i18n initialization
const Loading = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}
  >
    <CircularProgress size={60} thickness={4} />
    <Typography variant="h6" sx={{ mt: 2 }}>
      Loading translations...
    </Typography>
  </Box>
);

// Directly create a fallback theme to avoid import issues
const fallbackTheme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#fff",
    },
  },
});

// Run diagnostics with detailed error reporting
try {
  enhancedLogger.info('Running startup diagnostics');
  
  // Log DOM ready state
  enhancedLogger.info('Document ready state', { 
    readyState: document.readyState,
    location: window.location.href,
    root: document.getElementById('root') ? 'Found' : 'Not found'
  });
  
  diagnostics.runAll();
} catch (err) {
  enhancedLogger.error('Failed to run diagnostics', { 
    error: err.message,
    stack: err.stack
  });
}

// Initialize global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  enhancedLogger.critical('Uncaught error:', {
    message: event.message,
    source: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack
  });
  
  // Try to still render something to prevent white screen
  try {
    if (!document.getElementById('error-recovery')) {
      const errorDiv = document.createElement('div');
      errorDiv.id = 'error-recovery';
      errorDiv.style.padding = '20px';
      errorDiv.style.margin = '20px';
      errorDiv.style.backgroundColor = '#ffdddd';
      errorDiv.style.border = '1px solid #ff0000';
      errorDiv.innerHTML = `
        <h2>Application Error</h2>
        <p>The application encountered an error: ${event.message}</p>
        <p>Try refreshing the page or clearing your browser cache.</p>
        <button onclick="window.location.reload()">Refresh Page</button>
      `;
      document.body.appendChild(errorDiv);
    }
  } catch (recoveryError) {
    console.error('Failed to render error recovery UI', recoveryError);
  }
});

// Initialize global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  enhancedLogger.critical('Unhandled promise rejection:', {
    reason: event.reason?.stack || event.reason || 'Unknown reason'
  });
});

// Log application startup
enhancedLogger.info('Application starting up', {
  appVersion: import.meta.env.VITE_APP_VERSION || 'development',
  environment: import.meta.env.MODE,
  buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
  renderTargetFound: !!document.getElementById('root')
});

// Initialize React after i18n is ready
i18nPromise.then(() => {
  enhancedLogger.info('i18n initialized, rendering React application');
  
  // Try to detect problems with React's bootstrapping
  try {
    enhancedLogger.info('Creating React root');
    const root = ReactDOM.createRoot(document.getElementById('root'));
    
    enhancedLogger.info('Rendering React application');
    root.render(
      <React.StrictMode>
        <ErrorBoundary title="Application Error" message="We're sorry, the application encountered an unexpected error.">
          <Suspense fallback={<Loading />}>
            <BrowserRouter>
              <ThemeProvider theme={fallbackTheme}>
                <CssBaseline />
                <AuthProvider>
                  <CurrencyProvider>
                    <App />
                  </CurrencyProvider>
                </AuthProvider>
              </ThemeProvider>
            </BrowserRouter>
          </Suspense>
        </ErrorBoundary>
      </React.StrictMode>
    );
    enhancedLogger.info('React render call completed');
  } catch (renderError) {
    enhancedLogger.critical('Failed to render React application', {
      error: renderError.message,
      stack: renderError.stack
    });
    
    // Try to render a basic error message
    document.body.innerHTML = `
      <div style="padding: 20px; margin: 20px; background-color: #ffdddd; border: 1px solid #ff0000;">
        <h2>Critical Application Error</h2>
        <p>The application failed to start: ${renderError.message}</p>
        <p>Please check the console for more details.</p>
        <button onclick="window.location.reload()">Refresh Page</button>
      </div>
    `;
  }
}).catch(error => {
  enhancedLogger.critical('Failed to initialize i18n', {
    error: error.message,
    stack: error.stack
  });
  
  // Render fallback UI
  document.body.innerHTML = `
    <div style="padding: 20px; margin: 20px; background-color: #ffdddd; border: 1px solid #ff0000;">
      <h2>Translation System Error</h2>
      <p>Failed to initialize language support: ${error.message}</p>
      <p>Please check your connection and try again.</p>
      <button onclick="window.location.reload()">Refresh Page</button>
    </div>
  `;
});

// Final check after a delay to see if the app rendered
setTimeout(() => {
  try {
    const appContent = document.querySelector('.MuiBox-root') || document.querySelector('.MuiContainer-root');
    if (!appContent || appContent.children.length === 0) {
      enhancedLogger.critical('Potential white screen detected - no app content rendered after 2 seconds');
      
      // Try to render fallback content if nothing appears to be rendered
      if (!document.getElementById('white-screen-recovery')) {
        const recoveryDiv = document.createElement('div');
        recoveryDiv.id = 'white-screen-recovery';
        recoveryDiv.style.padding = '20px';
        recoveryDiv.style.margin = '20px';
        recoveryDiv.style.backgroundColor = '#ffffdd';
        recoveryDiv.style.border = '1px solid #ffcc00';
        recoveryDiv.innerHTML = `
          <h2>Application Loading Issue</h2>
          <p>The application seems to be having trouble loading.</p>
          <p>Try the following steps:</p>
          <ol>
            <li>Refresh the page</li>
            <li>Clear your browser cache</li>
            <li>Check your network connection</li>
          </ol>
          <button onclick="window.location.reload()">Refresh Page</button>
        `;
        document.body.appendChild(recoveryDiv);
      }
    } else {
      enhancedLogger.info('Application appears to be rendering correctly');
    }
  } catch (checkError) {
    enhancedLogger.error('Error while checking if app rendered', { error: checkError.message });
  }
}, 2000); 