import { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import logger from '../utils/logger';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to our logging system
    logger.error('React Error Boundary Caught Error', {
      error: error.toString(),
      component: this.props.componentName || 'Unknown Component',
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    this.setState({
      errorInfo
    });
  }

  handleRefresh = () => {
    // Log the recovery attempt
    logger.info('User attempted to recover from error by refreshing', {
      component: this.props.componentName || 'Unknown Component'
    });
    
    window.location.reload();
  };

  handleReset = () => {
    // Log the reset attempt
    logger.info('User attempted to recover from error by resetting component state', {
      component: this.props.componentName || 'Unknown Component'
    });
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Call the optional reset handler from props
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <Paper 
          elevation={3} 
          sx={{
            p: 4,
            m: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#fff8e1',
            borderRadius: 2
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" color="error.main" gutterBottom>
            {this.props.title || 'Something went wrong'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            {this.props.message || 'The application encountered an unexpected error.'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
            >
              Try Again
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={this.handleRefresh}
            >
              Refresh Page
            </Button>
          </Box>
          
          {/* Show details only in development mode */}
          {import.meta.env.DEV && this.state.error && (
            <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, width: '100%', overflow: 'auto' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Error Details (visible in development only):
              </Typography>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {this.state.error.toString()}
              </Typography>
              {this.state.errorInfo && (
                <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', mt: 2 }}>
                  {this.state.errorInfo.componentStack}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 